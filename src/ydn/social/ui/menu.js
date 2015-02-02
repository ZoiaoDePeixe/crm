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
 * @fileoverview Main menu.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.Menu');
goog.require('ydn.social.ui.MetaProfile');



/**
 * Main menu.
 * @constructor
 * @struct
 */
ydn.social.ui.Menu = function() {
  /**
   * @final
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');

  /**
   * @protected
   * @type {ydn.social.MetaContact}
   */
  this.target = null;
};


/**
 * Render UI.
 * @param {Element} el
 */
ydn.social.ui.Menu.prototype.render = function(el) {
  var btn = document.createElement('div');
  var details = document.createElement('div');
  this.root_.className = ydn.social.ui.MetaProfile.CSS_CLASS_CONTAINER;
  btn.classList.add(ydn.social.ui.MetaProfile.CSS_CLASS_HOST);
  details.classList.add(ydn.social.ui.MetaProfile.CSS_CLASS_DETAIL);
  btn.classList.add(ydn.crm.ui.CSS_CLASS_SVG_BUTTON);
  var svg = ydn.crm.ui.createSvgIcon('menu');
  btn.appendChild(svg);
  this.root_.appendChild(btn);
  this.root_.appendChild(details);
  el.appendChild(this.root_);
  this.renderDetailPanel_();
};


/**
 * @private
 */
ydn.social.ui.Menu.prototype.renderDetailPanel_ = function() {
  var el = this.root_.querySelector('.' + ydn.social.ui.MetaProfile.CSS_CLASS_DETAIL);

  var tid = 'template-social-menu';
  var t = ydn.ui.getTemplateById(tid).content;

  el.innerHTML = '';
  el.appendChild(t.cloneNode(true));
  if (!this.target) {
    return;
  }
  var header = el.querySelector('.header');
  var name = header.querySelector('.name a');
  name.textContent = this.target.getFullName();
  var url = '';
  if (url) {
    name.href = url;
  } else {
    name.removeAttribute('href');
  }
  var photo = '';
  var img = header.querySelector('.logo img');
  if (photo) {
    img.src = photo;
  } else {
    img.removeAttribute('src');
  }
};


/**
 * @return {Element}
 */
ydn.social.ui.Menu.prototype.getContentElement = function() {
  return this.root_.querySelector('.content');
};


/**
 * Set target person.
 * @param {ydn.social.MetaContact} target
 */
ydn.social.ui.Menu.prototype.setTarget = function(target) {
  if (target == this.target) {
    return;
  }
  this.target = target;
  this.renderDetailPanel_();
};
