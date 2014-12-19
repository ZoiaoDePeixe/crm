// Copyright 2014 YDN Authors. All Rights Reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


/**
 * @fileoverview Display bar for social interaction.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.Bar');
goog.require('goog.date.relative');
goog.require('goog.log');
goog.require('goog.ui.AdvancedTooltip');
goog.require('goog.ui.Component');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.ui');
goog.require('ydn.msg');
goog.require('ydn.social.MetaContact');
goog.require('ydn.time');



/**
 * Display bar for social interaction.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.social.ui.Bar = function(opt_dom) {
  goog.base(this, opt_dom);
  /**
   * @protected
   * @type {ydn.social.MetaContact}
   */
  this.target = null;
};
goog.inherits(ydn.social.ui.Bar, goog.ui.Component);


/**
 * @protected
 * @type {goog.log.Logger}
 */
ydn.social.ui.Bar.prototype.logger =
    goog.log.getLogger('yydn.social.ui.Bar');


/**
 * @define {boolean} debug flag.
 */
ydn.social.ui.Bar.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Bar.CSS_CLASS_CONTAINER = 'tooltip-container';


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Bar.CSS_CLASS_DETAIL = 'tooltip-detail';


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Bar.CSS_CLASS = 'social-bar';


/**
 * @param {ydn.social.Network} name
 * @return {Element}
 * @private
 */
ydn.social.ui.Bar.prototype.createButton_ = function(name) {
  var container = document.createElement('div');
  var btn = document.createElement('div');
  var details = document.createElement('div');
  container.classList.add(ydn.social.ui.Bar.CSS_CLASS_CONTAINER);
  container.classList.add(name);
  btn.classList.add('tooltip-host');
  details.classList.add(ydn.social.ui.Bar.CSS_CLASS_DETAIL);
  goog.style.setElementShown(details, false);
  var twitter = ydn.crm.ui.createSvgIcon(name);
  btn.classList.add(ydn.crm.ui.CSS_CLASS_SVG_BUTTON);
  btn.setAttribute('name', name);
  btn.appendChild(twitter);
  container.appendChild(btn);
  container.appendChild(details);
  return container;
};


/**
 * @inheritDoc
 */
ydn.social.ui.Bar.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  root.classList.add(ydn.social.ui.Bar.CSS_CLASS);
  var tw = this.createButton_(ydn.social.Network.TWITTER);
  root.appendChild(tw);

};


/**
 * Get container element.
 * @param {ydn.social.Network} network
 * @return {Element}
 */
ydn.social.ui.Bar.prototype.getContainer = function(network) {
  return this.getElement().querySelector('.' +
      ydn.social.ui.Bar.CSS_CLASS_CONTAINER + '.' + network);
};


/**
 * Set target person.
 * @param {ydn.social.MetaContact} target
 */
ydn.social.ui.Bar.prototype.setTarget = function(target) {
  this.target = target;
  this.refresh();
};


/**
 * @protected
 */
ydn.social.ui.Bar.prototype.refresh = function() {
  this.refreshTwitter_();
};


/**
 * Render twitter profile
 * @param {Element} el element to render on.
 * @param {Object} profile twitter profile record as return by: users/show API
 */
ydn.social.ui.Bar.renderTwitterProfile = function(el, profile) {
  var tid = 'template-detail-' + ydn.social.Network.TWITTER;
  var t = ydn.ui.getTemplateById(tid).content;
  el.innerHTML = '';
  el.appendChild(t.cloneNode(true));
  goog.style.setElementShown(el, true);
  var header = el.querySelector('.header');
  var name = header.querySelector('.name a');
  name.textContent = profile['name'];
  name.href = profile['url'];
  header.querySelector('.description').textContent = profile['description'] || '';
  header.querySelector('.logo img').src = profile['profile_image_url_https'];
  header.querySelector('.followers').textContent = profile['followers_count'];
  header.querySelector('.following').textContent = profile['friends_count'];
  if (profile['location'] && profile['location'] != 'Global') {
    header.querySelector('.location').textContent = profile['location'];
  } else {
    goog.style.setElementShown(header.querySelector('.location'), false);
  }
};


/**
 * Render twitter profile
 * @param {Element} ul element to render on.
 * @param {Array<Object>} tweets list of tweets as return by:
 * statuses/user_timeline API
 */
ydn.social.ui.Bar.renderTweet = function(ul, tweets) {
  if (ydn.social.ui.Bar.DEBUG) {
    window.console.log(tweets);
  }
  ul.innerHTML = '';
  var templ = ydn.ui.getTemplateById('template-tweet').content;
  for (var i = 0; i < tweets.length; i++) {
    var tweet = tweets[i];
    var li = templ.cloneNode(true);
    li.querySelector('.text').textContent = tweet['text'];
    if (tweet['location'] && tweet['location'] != 'Global') {
      li.querySelector('.location').textContent = tweet['location'];
    }
    var date = new Date(tweet['created_at']);
    var created = date.getTime();
    if (created > 0) {
      li.querySelector('.time').textContent =
          goog.date.relative.format(created) || date.toDateString();
    }

    ul.appendChild(li);
  }
};


/**
 * @private
 * @return {!goog.async.Deferred<Object>}
 */
ydn.social.ui.Bar.prototype.refreshTweet_ = function() {
  var container = this.getContainer(ydn.social.Network.TWITTER);
  var detail = container.querySelector('.tweets');
  container.classList.add('working');
  return this.target.getTweets().addCallbacks(function(tweets) {
    if (ydn.social.ui.Bar.DEBUG) {
      window.console.log(tweets);
    }
    container.classList.remove('working');
    if (!tweets) {
      return;
    }
    container.classList.add('exist');
    ydn.social.ui.Bar.renderTweet(detail, tweets);
  }, function(e) {
    ydn.crm.msg.Manager.addStatus('Fetching twitter fail: ' + String(e));
    container.classList.remove('working');
    if (e.name == ydn.crm.base.ErrorName.HOST_PERMISSION) {
      container.classList.add('alert');
    } else {
      container.classList.add('error');
    }
  }, this);
};


/**
 * @private
 * @return {!goog.async.Deferred<Object>}
 */
ydn.social.ui.Bar.prototype.refreshTwitterProfile_ = function() {
  var container = this.getContainer(ydn.social.Network.TWITTER);
  var detail = container.querySelector('.' + ydn.social.ui.Bar.CSS_CLASS_DETAIL);
  container.classList.add('working');
  return this.target.getProfileDetail(ydn.social.Network.TWITTER)
      .addCallbacks(function(dp) {
        if (ydn.social.ui.Bar.DEBUG) {
          window.console.log(dp);
        }
        container.classList.remove('working');
        if (!dp) {
          return;
        }
        container.classList.add('exist');
        ydn.social.ui.Bar.renderTwitterProfile(detail, dp);
      }, function(e) {
        goog.style.setElementShown(detail, false);
        ydn.crm.msg.Manager.addStatus('Fetching twitter fail: ' + String(e));
        container.classList.remove('working');
        if (e.name == ydn.crm.base.ErrorName.HOST_PERMISSION) {
          container.classList.add('alert');
        } else {
          container.classList.add('error');
        }
      }, this);
};


/**
 * @private
 */
ydn.social.ui.Bar.prototype.refreshTwitter_ = function() {
  var container = this.getContainer(ydn.social.Network.TWITTER);
  var detail = container.querySelector('.' + ydn.social.ui.Bar.CSS_CLASS_DETAIL);
  detail.innerHTML = '';

  var profile = this.target ? this.target.getProfile(
      ydn.social.Network.TWITTER) : null;
  container.classList.remove('exist');
  container.classList.remove('working');
  container.classList.remove('error');
  container.classList.remove('alert');
  container.classList.remove('empty');
  if (profile) {
    goog.style.setElementShown(detail, true);
    this.refreshTwitterProfile_().addBoth(function() {
      this.refreshTweet_();
    }, this);
  } else {
    goog.style.setElementShown(detail, false);
    container.classList.add('empty');
  }
};


/**
 * Update contents.
 * @param {?string} email
 */
ydn.social.ui.Bar.prototype.showByEmail = function(email) {
  if (ydn.social.ui.Bar.DEBUG) {
    window.console.log(email);
  }

  if (!email) {
    this.setTarget(null);
    return;
  }
  ydn.social.MetaContact.fetchByEmail(email).addCallbacks(function(mc) {
    this.setTarget(mc);
  }, function(e) {
    window.console.error(e.stack || e);
  }, this);
};


/**
 * @inheritDoc
 */
ydn.social.ui.Bar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  var buttons = this.getElement().querySelectorAll('.' +
      ydn.crm.ui.CSS_CLASS_SVG_BUTTON);
  for (var i = 0; i < buttons.length; i++) {
    hd.listen(buttons[i], 'click', this.onButtonClicked_);
  }
};


/**
 * @param {goog.events.BrowserEvent} ev
 * @private
 */
ydn.social.ui.Bar.prototype.onButtonClicked_ = function(ev) {
  var network = ev.currentTarget.getAttribute('name');
  if (network == ydn.social.Network.TWITTER) {
    this.refreshTwitter_();
  }
};


/**
 * Set contact by email.
 * @param {string} email
 */
ydn.social.ui.Bar.prototype.setTargetByEmail = function(email) {
  this.target = null;
  this.refresh();
  ydn.social.MetaContact.fetchByEmail(email).addCallback(function(t) {
    if (ydn.social.ui.Bar.DEBUG) {
      window.console.log(t);
    }
    this.target = t || null;
    this.refresh();
  }, this);
};


