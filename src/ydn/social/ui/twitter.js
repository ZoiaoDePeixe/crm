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
 * @fileoverview Twitter widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.Twitter');
goog.require('goog.date.relative');
goog.require('ydn.social.ui.Network');
goog.require('ydn.time');



/**
 * Twitter widget.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.social.ui.Profile}
 */
ydn.social.ui.Twitter = function(opt_dom) {
  goog.base(this, ydn.social.Network.TWITTER, opt_dom);

};
goog.inherits(ydn.social.ui.Twitter, ydn.social.ui.Profile);


/**
 * @inheritDoc
 */
ydn.social.ui.Twitter.prototype.createDom = function() {
  goog.base(this, 'createDom');
};


/**
 * @inheritDoc
 */
ydn.social.ui.Twitter.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  var button = this.getButton();
  hd.listen(button, 'click', this.onButtonClicked_);
};


/**
 * Render twitter profile
 * @param {Element} el element to render on.
 * @param {Object} profile twitter profile record as return by: users/show API
 */
ydn.social.ui.Twitter.renderTwitterProfile = function(el, profile) {
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
 * @param {Element} detail element to render on.
 * @param {Array<Object>} tweets list of tweets as return by:
 * statuses/user_timeline API
 */
ydn.social.ui.Twitter.renderTweet = function(detail, tweets) {
  if (ydn.social.ui.Profile.DEBUG) {
    window.console.log(tweets);
  }
  detail.innerHTML = '';

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

    detail.appendChild(li);
  }
};


/**
 * @private
 * @return {!goog.async.Deferred<Object>}
 */
ydn.social.ui.Twitter.prototype.refreshTweet_ = function() {
  var container = this.getContainer();
  var tweets_ul = container.querySelector('.tweets');
  if (!tweets_ul) {
    return goog.async.Deferred.succeed(null);
  }
  container.classList.add('working');
  return this.target.getFeed(this.network).addCallbacks(function(tweets) {
    if (ydn.social.ui.Profile.DEBUG) {
      window.console.log(tweets);
    }
    container.classList.remove('working');
    if (!tweets) {
      return;
    }
    container.classList.add('exist');
    ydn.social.ui.Twitter.renderTweet(tweets_ul, tweets);
  }, function(e) {
    ydn.crm.msg.Manager.addStatus('Fetching twitter fail: ' + String(e));
    container.classList.remove('working');
    if (e && e.name == ydn.crm.base.ErrorName.HOST_PERMISSION) {
      container.classList.add('alert');
      this.getButton().setAttribute('title', 'Click to grant access to Twitter API');
    } else {
      container.classList.add('error');
    }
  }, this);
};


/**
 * @private
 * @return {!goog.async.Deferred<Object>}
 */
ydn.social.ui.Twitter.prototype.refreshTwitterProfile_ = function() {
  var container = this.getContainer();

  container.classList.add('working');
  return this.target.getProfileDetail(ydn.social.Network.TWITTER)
      .addCallbacks(function(dp) {
        if (ydn.social.ui.Profile.DEBUG) {
          window.console.log(dp);
        }
        container.classList.remove('working');
        if (!dp) {
          return;
        }
        container.classList.add('exist');
        ydn.social.ui.Twitter.renderTwitterProfile(this.getDetail(), dp);
      }, function(e) {
        goog.style.setElementShown(this.getDetail(), false);
        ydn.crm.msg.Manager.addStatus('Fetching twitter fail: ' + String(e));
        container.classList.remove('working');
        if (e && e.name == ydn.crm.base.ErrorName.HOST_PERMISSION) {
          container.classList.add('alert');
        } else {
          container.classList.add('error');
        }
      }, this);
};


/**
 * @private
 */
ydn.social.ui.Twitter.prototype.refresh_ = function() {
  this.refreshTwitterProfile_().addCallback(function() {
    this.refreshTweet_();
  }, this);
};


/**
 * @override
 */
ydn.social.ui.Twitter.prototype.redraw = function() {
  var container = this.getContainer();
  this.resetBaseClass();
  var detail = this.getDetail();
  detail.innerHTML = '';
  this.getButton().setAttribute('title', 'Twitter');

  var profile = this.target ? this.target.getProfile(
      ydn.social.Network.TWITTER) : null;
  if (profile) {
    goog.style.setElementShown(detail, true);
    this.refresh_();
  } else {
    goog.style.setElementShown(detail, false);
    container.classList.add('empty');
  }
};


/**
 * @param {goog.events.BrowserEvent} ev
 * @private
 */
ydn.social.ui.Twitter.prototype.onButtonClicked_ = function(ev) {
  this.refresh_();
};
