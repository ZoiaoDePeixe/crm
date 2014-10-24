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
 * @fileoverview Tracking setup page.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.TrackingSetupPage');
goog.require('ydn.crm.IPage');



/**
 * About page that render content in 'about-template'.
 * @constructor
 * @implements {ydn.crm.IPage}
 * @struct
 */
ydn.crm.TrackingSetupPage = function() {
  /**
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');
};


/**
 * @typedef {{
 *   label: string,
 *   domain: string
 * }}
 */
ydn.crm.TrackingSetupPage.TargetEmailProviderInfo;


/**
 * @type {Array.<ydn.crm.TrackingSetupPage.TargetEmailProviderInfo>}
 */
ydn.crm.TrackingSetupPage.providers = [{
  label: 'Google Email (Gmail)',
  domain: 'mail.google.com'
}, {
  label: 'Microsoft Email (Outlook.com)',
  domain: 'mail.live.com'
}];


/**
 * @override
 */
ydn.crm.TrackingSetupPage.prototype.render = function(el) {
  var ul = document.createElement('ul');
  var gen = goog.ui.IdGenerator.getInstance();
  for (var i = 0; i < ydn.crm.TrackingSetupPage.providers.length; i++) {
    var provider = ydn.crm.TrackingSetupPage.providers[i];
    var li = document.createElement('li');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = gen.getNextUniqueId();
    var label = document.createElement('label');
    label.for = checkbox.id;
    label.value = provider.label;
    checkbox.setAttribute('data-domain', provider.domain);
    li.appendChild(checkbox);
    li.appendChild(label);
    ul.appendChild(li);
  }
  el.appendChild(this.root_);
};


/**
 * @override
 */
ydn.crm.TrackingSetupPage.prototype.onPageShow = function() {};


/**
 * @override
 */
ydn.crm.TrackingSetupPage.prototype.toString = function() {
  return 'Setup';
};
