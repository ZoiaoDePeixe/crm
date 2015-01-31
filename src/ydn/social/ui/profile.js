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
 * @fileoverview Generic social widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.Profile');
goog.require('goog.ui.Component');
goog.require('ydn.crm.ui');



/**
 * Generic social widget.
 * <pre>
 *   var net = new ydn.social.ui.Profile(ydn.social.Network.MEETUP);
 *   net.setTarget(mc);
 *   // later change network type.
 *   net.setNetwork(ydn.social.Network.YELP);
 *   net.setTarget(mc);
 * </pre>
 * @param {ydn.social.Network} network
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.social.ui.Profile = function(network, opt_dom) {
  goog.base(this, opt_dom);
  /**
   * @type {ydn.social.Network}
   */
  this.network = network;
  /**
   * @protected
   * @type {?ydn.social.MetaContact}
   */
  this.target = null;
};
goog.inherits(ydn.social.ui.Profile, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.social.ui.Profile.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Profile.CSS_CLASS_CONTAINER = 'tooltip-container';


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Profile.CSS_CLASS_DETAIL = 'tooltip-detail';


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Profile.CSS_CLASS_HOST = 'tooltip-host';


/**
 * @param {ydn.social.MetaContact} obj
 * @final
 */
ydn.social.ui.Profile.prototype.setTarget = function(obj) {
  this.target = obj;
  this.redraw();
};


/**
 * Change network type.
 * @param {ydn.social.Network} network
 */
ydn.social.ui.Profile.prototype.setNetwork = function(network) {
  this.network = network;
  var btn = this.getButton();
  btn.innerHTML = '';
  var svg = ydn.crm.ui.createSvgIcon(this.getSvgSymbolName());
  btn.setAttribute('name', this.network);
  btn.appendChild(svg);
};


/**
 * @protected
 */
ydn.social.ui.Profile.prototype.redraw = function() {
  var container = this.getContainer();
  this.resetBaseClass();
  var detail = this.getDetail();
  detail.innerHTML = '';

  var mp = this.target ? this.target.getMetaProfile(this.network) : null;
  var profile = mp ? mp.getProfile() : null;
  if (ydn.social.ui.Profile.DEBUG) {
    window.console.log(this.network, profile);
  }
  if (profile) {
    goog.style.setElementShown(container, true);
    this.getButton().setAttribute('title', ydn.social.network2name[this.network]);
    container.classList.add('exist');
    goog.style.setElementShown(detail, true);
    this.refreshProfile(profile);
  } else {
    goog.style.setElementShown(container, false);
    goog.style.setElementShown(detail, false);
    container.classList.add('empty');
  }
};


/**
 * @protected reset container element class to initial.
 */
ydn.social.ui.Profile.prototype.resetBaseClass = function() {
  var el = this.getElement();
  el.className = ydn.social.ui.Profile.CSS_CLASS_CONTAINER + ' ' + this.network;
};


/**
 * @return {string}
 * @protected
 */
ydn.social.ui.Profile.prototype.getSvgSymbolName = function() {
  if (ydn.social.defaultNetworks.indexOf(this.network) >= 0) {
    return this.network;
  } else if (['meetup', 'pinterest', 'yelp', 'tumblr', 'reddit', 'instagram',
    'github', 'foursquare', 'flickr', 'youtube', 'friendfeed',
    'blogger', 'wordpress', 'quora', 'myspace', 'yahoo', 'delicious',
    'vimeo', 'klout'].indexOf(this.network) >= 0) {
    return this.network;
  } else {
    return 'language'; // generic symbol
  }
};


/**
 * @override
 */
ydn.social.ui.Profile.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var container = this.getElement();
  var btn = document.createElement('div');
  var details = document.createElement('div');
  this.resetBaseClass();
  btn.classList.add(ydn.social.ui.Profile.CSS_CLASS_HOST);
  details.classList.add(ydn.social.ui.Profile.CSS_CLASS_DETAIL);
  goog.style.setElementShown(details, false);
  var twitter = ydn.crm.ui.createSvgIcon(this.getSvgSymbolName());
  btn.classList.add(ydn.crm.ui.CSS_CLASS_SVG_BUTTON);
  btn.setAttribute('name', this.network);
  btn.appendChild(twitter);
  container.appendChild(btn);
  container.appendChild(details);
  var pn = ydn.social.defaultNetworks.indexOf(this.network) >= 0;
  goog.style.setElementShown(container, pn);
};


/**
 * @param {ydn.social.IProfile} profile
 * @protected
 */
ydn.social.ui.Profile.prototype.refreshProfile = function(profile) {
  var tid = 'template-detail-generic';
  var t = ydn.ui.getTemplateById(tid).content;
  var el = this.getDetail();
  el.innerHTML = '';
  el.appendChild(t.cloneNode(true));
  goog.style.setElementShown(el, true);
  var header = el.querySelector('.header');
  var name = header.querySelector('.name a');
  name.textContent = profile.getScreenName();
  var url = profile.getProfileUrl();
  if (url) {
    name.href = url;
  } else {
    name.removeAttribute('href');
  }
  var photo = profile.getPhotoUrl();
  var img = header.querySelector('.logo img');
  if (photo) {
    img.src = photo;
  } else {
    img.removeAttribute('src');
  }
  header.querySelector('.description').textContent = profile.getBio() || '';
  var followers = header.querySelector('.followers');
  if (profile.getFollowers()) {
    followers.textContent = profile.getFollowers();
  } else {
    goog.style.setElementShown(followers.parentElement, false);
  }
  var following = header.querySelector('.following');
  if (profile.getFollowing()) {
    following.textContent = profile.getFollowing();
  } else {
    goog.style.setElementShown(following.parentElement, false);
  }

};


/**
 * Get container element.
 * @return {Element}
 */
ydn.social.ui.Profile.prototype.getContainer = function() {
  return this.getElement();
};


/**
 * Get detail element.
 * @return {Element}
 */
ydn.social.ui.Profile.prototype.getDetail = function() {
  return this.getContainer().querySelector('.' +
      ydn.social.ui.Profile.CSS_CLASS_DETAIL);
};


/**
 * Get button host.
 * @return {Element}
 */
ydn.social.ui.Profile.prototype.getButton = function() {
  return this.getContainer().querySelector('.' +
      ydn.social.ui.Profile.CSS_CLASS_HOST);
};
