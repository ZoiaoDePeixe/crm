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
 * @fileoverview Meetup widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.Meetup');
goog.require('goog.date.relative');
goog.require('ydn.social.ui.Network');
goog.require('ydn.time');



/**
 * Meetup widget.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.social.ui.Network}
 */
ydn.social.ui.Meetup = function(opt_dom) {
  goog.base(this, ydn.social.Network.MEETUP, opt_dom);

};
goog.inherits(ydn.social.ui.Meetup, ydn.social.ui.Network);


/**
 * @inheritDoc
 */
ydn.social.ui.Meetup.prototype.createDom = function() {
  goog.base(this, 'createDom');
};


/**
 * @inheritDoc
 */
ydn.social.ui.Meetup.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  var button = this.getButton();
  hd.listen(button, 'click', this.onButtonClicked_);
};


/**
 * @param {CrmApp.FullContact2SocialProfile} profile
 * @private
 */
ydn.social.ui.Meetup.prototype.refresh_ = function(profile) {
  var tid = 'template-detail-' + ydn.social.Network.MEETUP;
  var t = ydn.ui.getTemplateById(tid).content;
  var el = this.getDetail();
  el.innerHTML = '';
  el.appendChild(t.cloneNode(true));
  goog.style.setElementShown(el, true);
  var header = el.querySelector('.header');
  var name = header.querySelector('.name a');
  name.textContent = this.target.getFullName();
  if (profile.url) {
    name.href = profile.url;
  } else {
    name.removeAttribute('href');
  }
  var photo = this.target.getPhoto(this.network);
  var img = header.querySelector('.logo img');
  if (photo) {
    img.src = photo;
  } else {
    img.removeAttribute('src');
  }
  header.querySelector('.description').textContent = profile.bio || '';
};


/**
 * @override
 */
ydn.social.ui.Meetup.prototype.redraw = function() {
  var container = this.getContainer();
  this.resetBaseClass();
  var detail = this.getDetail();
  detail.innerHTML = '';
  this.getButton().setAttribute('title', 'Meetup');

  var profile = this.target ? this.target.getProfile(
      ydn.social.Network.MEETUP) : null;
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
ydn.social.ui.Meetup.prototype.onButtonClicked_ = function(ev) {

};
