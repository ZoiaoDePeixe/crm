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
 * @fileoverview About page.
 */


goog.provide('ydn.crm.AboutPage');



/**
 * About page that render content in 'about-template'.
 * @param {Element} el
 * @constructor
 * @implements {ydn.crm.IPage}
 * @struct
 */
ydn.crm.AboutPage = function(el) {
  /**
   * @final
   * @type {Element}
   * @private
   */
  this.root_ = el;
};


/**
 * @override
 */
ydn.crm.AboutPage.prototype.setUserInfo = function(info) {
};


/**
 * @override
 */
ydn.crm.AboutPage.prototype.showPage = function(val) {
  if (val) {
    if (ydn.crm.AboutPage.prototype.childElementCount == 0) {
      var temp = ydn.ui.getTemplateById('about-template');
      this.root_.appendChild(temp);
      this.root_.style.display = '';
    } else {
      this.root_.style.display = 'none';
    }
  }
};
