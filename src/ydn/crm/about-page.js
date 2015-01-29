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
goog.require('ydn.ui');



/**
 * About page that render content in 'about-template'.
 * @param {string=} opt_name app name.
 * @constructor
 * @implements {ydn.crm.IPage}
 * @struct
 */
ydn.crm.AboutPage = function(opt_name) {
  this.name = opt_name || 'Yathit';
  /**
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');
};


/**
 * @override
 */
ydn.crm.AboutPage.prototype.render = function(el) {
  var temp = ydn.ui.getTemplateById('basic-about-template').content;
  this.root_.appendChild(temp.cloneNode(true));
  var version = this.root_.querySelector('span[name=version]');
  this.root_.querySelector('#app-name').textContent = this.name;
  version.textContent = ydn.crm.version;
  el.appendChild(this.root_);

};


/**
 * @param {YdnCrm.UserLicense} lic
 * @private
 */
ydn.crm.AboutPage.prototype.renderLicense_ = function(lic) {
  var el = this.root_.querySelector('.license-section .license');
  if (lic) {
    el.textContent = 'License: ' + lic.edition;
    if (lic.begin) {
      el.textContent += ' [' + new Date(lic.begin).toLocaleDateString() +
          ' - ' + new Date(lic.end).toLocaleDateString() + ']';
    }
    if (!lic.active) {
      el.textContent += ' (inactive)';
    }
  } else {
    el.textContent = 'License: ';
  }

};


/**
 * @override
 */
ydn.crm.AboutPage.prototype.onPageShow = function() {
  var us = ydn.crm.ui.UserSetting.getInstance();

  if (!us.isLogin()) {
    return;
  }
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.USER_LICENSE).addCallback(function(lic) {
    this.renderLicense_(lic);
  }, this);

};


/**
 * @override
 */
ydn.crm.AboutPage.prototype.toString = function() {
  return 'About';
};
