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
goog.require('goog.events.EventHandler');
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
  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
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
  domain: '*.mail.live.com'
}];


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.TrackingSetupPage.prototype.onPermissionClick_ = function(e) {
  if (e.target.tagName == 'INPUT') {
    var input = e.target;
    var domain = input.getAttribute('data-domain');
    var permissions = {
      'origins': ['http://' + domain + '/*', 'https://' + domain + '/*']
    };
    if (input.checked) {
      e.preventDefault();
      chrome.permissions.request(permissions, function(grant) {
        input.checked = !!grant;
      });
    } else {
      chrome.permissions.remove(permissions);
    }
  }
};


/**
 * @override
 */
ydn.crm.TrackingSetupPage.prototype.render = function(el) {
  var ul = document.createElement('ul');
  // var gen = goog.ui.IdGenerator.getInstance();
  for (var i = 0; i < ydn.crm.TrackingSetupPage.providers.length; i++) {
    var provider = ydn.crm.TrackingSetupPage.providers[i];
    var li = document.createElement('li');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.setAttribute('data-domain', provider.domain);
    var label = document.createElement('label');
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(provider.label));
    li.appendChild(label);
    ul.appendChild(li);
  }


  var div = document.createElement('div');
  var head = document.createElement('div');
  var h3 = document.createElement('h3');
  h3.textContent = 'Email provider to be tracked';
  head.appendChild(h3);

  div.appendChild(head);
  div.appendChild(ul);
  this.root_.appendChild(div);
  el.appendChild(this.root_);

  this.handler.listen(ul, 'click', this.onPermissionClick_, true);
};


/**
 * @param {HTMLInputElement} input
 * @private
 */
ydn.crm.TrackingSetupPage.prototype.updatePermission_ = function(input) {
  var domain = input.getAttribute('data-domain');
  var permissions = {
    'origins': ['http://' + domain + '/*', 'https://' + domain + '/*']
  };
  chrome.permissions.contains(permissions, function(ok) {
    input.checked = ok;
  });
};


/**
 * @private
 */
ydn.crm.TrackingSetupPage.prototype.updatePermissions_ = function() {
  var inputs = this.root_.querySelectorAll('li input');
  for (var i = 0; i < inputs.length; i++) {
    var obj = /** @type {HTMLInputElement} */ (inputs[i]);
    this.updatePermission_(obj);
  }
};


/**
 * @override
 */
ydn.crm.TrackingSetupPage.prototype.onPageShow = function() {
  this.updatePermissions_();
};


/**
 * @override
 */
ydn.crm.TrackingSetupPage.prototype.toString = function() {
  return 'Setup';
};
