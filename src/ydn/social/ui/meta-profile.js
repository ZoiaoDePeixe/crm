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


goog.provide('ydn.social.ui.MetaProfile');
goog.require('goog.ui.Component');
goog.require('ydn.crm.ui');



/**
 * Generic social widget. If model is not set, the component will not be
 * displayed.
 * <pre>
 *   var net = new ydn.social.ui.MetaProfile();
 *   net.setModel(mp);
 * </pre>
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.social.ui.MetaProfile = function(opt_dom) {
  goog.base(this, opt_dom);
};
goog.inherits(ydn.social.ui.MetaProfile, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.social.ui.MetaProfile.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.social.ui.MetaProfile.CSS_CLASS_CONTAINER = 'tooltip-container';


/**
 * @const
 * @type {string}
 */
ydn.social.ui.MetaProfile.CSS_CLASS_DETAIL = 'tooltip-detail';


/**
 * @const
 * @type {string}
 */
ydn.social.ui.MetaProfile.CSS_CLASS_HOST = 'tooltip-host';


/**
 * @return {ydn.social.MetaProfile} obj
 * @final
 */
ydn.social.ui.MetaProfile.prototype.getModel;


/**
 * @param {string} name network name.
 * @protected
 */
ydn.social.ui.MetaProfile.prototype.renderButton = function(name) {
  var btn = this.getButton();
  btn.innerHTML = '';
  var icon = !!ydn.social.network2name[name] ? name : 'language';
  var svg = ydn.crm.ui.createSvgIcon(icon);
  btn.setAttribute('name', name);
  btn.appendChild(svg);
};


/**
 * @override
 */
ydn.social.ui.MetaProfile.prototype.setModel = function(model) {
  var ex = this.getModel();
  var net_changed = !ex && !!model ||
      (!!ex && !!model && ex.getNetworkName() != model.getNetworkName());
  goog.base(this, 'setModel', model);
  if (net_changed) {
    this.renderButton(model.getNetworkName());
  }
  this.redraw();
};


/**
 * Redraw UI. Default implementation only refresh the first profile.
 * @protected
 */
ydn.social.ui.MetaProfile.prototype.redraw = function() {
  var container = this.getContainer();
  this.resetBaseClass();
  var detail = this.getDetailElement();
  detail.innerHTML = '';
  var model = this.getModel();

  if (ydn.social.ui.MetaProfile.DEBUG) {
    window.console.log(model);
  }
  if (model && model.hasProfile()) {
    goog.style.setElementShown(container, true);
    this.getButton().setAttribute('title', model.getNetworkName());
    container.classList.add('exist');
    goog.style.setElementShown(detail, true);
    this.refreshProfile(/** @type {!ydn.social.Profile} */(model.getProfile()));
  } else {
    goog.style.setElementShown(container, false);
    goog.style.setElementShown(detail, false);
    container.classList.add('empty');
  }
};


/**
 * @protected reset container element class to initial.
 */
ydn.social.ui.MetaProfile.prototype.resetBaseClass = function() {
  var el = this.getElement();
  var name = ydn.social.ui.MetaProfile.CSS_CLASS_CONTAINER;
  var model = this.getModel();
  if (model) {
    name += ' ' + model.getNetworkName();
  }
  el.className = name;
};


/**
 * @return {string}
 * @protected
 */
ydn.social.ui.MetaProfile.prototype.getSvgSymbolName = function() {
  var model = this.getModel();
  if (!model) {
    return 'language'; // generic symbol
  }
  var network = model.getNetworkName();
  if (ydn.social.network2name[network]) {
    return network;
  } else {
    return 'language'; // generic symbol
  }
};


/**
 * @override
 */
ydn.social.ui.MetaProfile.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var container = this.getElement();
  var btn = document.createElement('div');
  var details = document.createElement('div');
  this.resetBaseClass();
  btn.classList.add(ydn.social.ui.MetaProfile.CSS_CLASS_HOST);
  details.classList.add(ydn.social.ui.MetaProfile.CSS_CLASS_DETAIL);
  goog.style.setElementShown(details, false);
  btn.classList.add(ydn.crm.ui.CSS_CLASS_SVG_BUTTON);
  container.appendChild(btn);
  container.appendChild(details);
  goog.style.setElementShown(container, false);
};


/**
 * @param {!ydn.social.Profile} profile
 * @protected
 */
ydn.social.ui.MetaProfile.prototype.refreshProfile = function(profile) {
  var tid = 'template-detail-generic';
  var t = ydn.ui.getTemplateById(tid).content;
  var el = this.getDetailElement();
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
ydn.social.ui.MetaProfile.prototype.getContainer = function() {
  return this.getElement();
};


/**
 * Get content element, which appear on hovering over the button.
 * @return {Element}
 */
ydn.social.ui.MetaProfile.prototype.getDetailElement = function() {
  return this.getContainer().querySelector('.' +
      ydn.social.ui.MetaProfile.CSS_CLASS_DETAIL);
};


/**
 * Get button host.
 * @return {Element}
 */
ydn.social.ui.MetaProfile.prototype.getButton = function() {
  return this.getContainer().querySelector('.' +
      ydn.social.ui.MetaProfile.CSS_CLASS_HOST);
};
