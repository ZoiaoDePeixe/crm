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
 * @fileoverview LinkedIn widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.LinkedIn');
goog.require('goog.date.relative');
goog.require('ydn.social.ui.FixMetaProfile');
goog.require('ydn.time');



/**
 * LinkedIn widget.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.social.ui.FixMetaProfile}
 */
ydn.social.ui.LinkedIn = function(opt_dom) {
  goog.base(this, ydn.social.Network.LINKED_IN, opt_dom);
};
goog.inherits(ydn.social.ui.LinkedIn, ydn.social.ui.FixMetaProfile);


/**
 * @inheritDoc
 */
ydn.social.ui.LinkedIn.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  var button = this.getButton();
  hd.listen(button, 'click', this.onButtonClicked_);
};


/**
 * @param {ydn.social.Profile} profile
 * @private
 */
ydn.social.ui.LinkedIn.prototype.refresh_ = function(profile) {
  var tid = 'template-detail-' + ydn.social.Network.TWITTER;
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
  header.querySelector('.followers').textContent = profile.getFollowers() || '';
  header.querySelector('.following').textContent = profile.getFollowing() || '';
};


/**
 * @override
 */
ydn.social.ui.LinkedIn.prototype.redraw = function() {
  var container = this.getContainer();
  this.resetBaseClass();
  var detail = this.getDetailElement();
  var model = this.getModel();
  var profile = model ? model.getProfile() : null;
  if (profile) {
    container.classList.add('exist');
    goog.style.setElementShown(detail, true);
    this.refresh_(profile);
  } else {
    goog.style.setElementShown(detail, false);
    container.classList.add('empty');
  }
};


/**
 * @param {goog.events.BrowserEvent} ev
 * @private
 */
ydn.social.ui.LinkedIn.prototype.onButtonClicked_ = function(ev) {

};
