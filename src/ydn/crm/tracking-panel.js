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
 * @fileoverview Stat for email tracking information.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.TrackingPanel');
goog.require('goog.ui.Component');



/**
 * Stat for email tracking information.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.TrackingPanel = function(opt_dom) {
  goog.base(this, opt_dom);

};
goog.inherits(ydn.crm.TrackingPanel, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.TrackingPanel.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.TrackingPanel.CSS_CLASS = 'tracking-panel';


/**
 * @protected
 * @type {goog.log.Logger}
 */
ydn.crm.TrackingPanel.prototype.logger =
    goog.log.getLogger('ydn.crm.TrackingPanel');


/**
 * @const
 * @type {Array.<string>}
 */
ydn.crm.TrackingPanel.SLOT_LABELS = ['Emails Tracked', 'Emails Opened',
  'Opened', 'with Multiple Opens', '# of Clicks', 'Avg. # Opens', 'Avg time to Open'];


/**
 * @override
 */
ydn.crm.TrackingPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  root.classList.add(ydn.crm.TrackingPanel.CSS_CLASS);
  var dom = this.getDomHelper();
  var slots = [];
  for (var i = 0; i < ydn.crm.TrackingPanel.SLOT_LABELS.length; i++) {
    var value = dom.createDom('div', 'value-holder', [dom.createDom('span', 'value', '0')]);
    var label = dom.createDom('div', 'label', ydn.crm.TrackingPanel.SLOT_LABELS[i]);
    if (i == 2 || i == 3) {
      value.appendChild(dom.createDom('span', 'percent', '%'));
    }
    slots[i] = dom.createDom('div', {'class': 'slot', 'tabindex': i}, [value, label]);
  }
  root.appendChild(dom.createDom('div', 'stats', slots));
};



