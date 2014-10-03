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
goog.require('pear.ui.Grid');



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
 * @inheritDoc
 */
ydn.crm.TrackingPanel.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_CONTENT);
};


/**
 * @param {Array} data
 */
ydn.crm.TrackingPanel.prototype.setData = function(data) {
  var ex = this.removeChildAt(0, true);
  ex.dispose();
  var beacon_table = this.createGrid(data);
  this.addChild(beacon_table, true);
};


/**
 * @return {pear.ui.Grid}
 */
ydn.crm.TrackingPanel.prototype.getGrid = function() {
  return /** @type {pear.ui.Grid} */ (this.getChildAt(0));
};


/**
 * @param {Array} data
 * @return {pear.ui.Grid}
 */
ydn.crm.TrackingPanel.prototype.createGrid = function(data) {

  var beacon_table = new pear.ui.Grid();
  var config = {
    AllowColumnResize: true,
    AllowAlternateRowHighlight: true,
    ShowCellBorder: false
  };
  beacon_table.setConfiguration(config);

  var width = this.getContentElement().clientWidth || 1000;
  width = width - 8;
  var unit = (width - 8) / (4 + 4 + 2 + 3 + 2);

  var columns = [
    new pear.data.Column('Recipients', 'recipients', 'recipients', 4 * unit, pear.data.Column.DataType.TEXT),
    new pear.data.Column('Subject', 'subject', 'subject', 4 * unit, pear.data.Column.DataType.TEXT),
    new pear.data.Column('Sent Date', 'sentdate', 'sentDate', 2 * unit, pear.data.Column.DataType.DATETIME),
    new pear.data.Column('Opens', 'opens', 'opens', unit, pear.data.Column.DataType.NUMBER),
    new pear.data.Column('Clicks', 'clicks', 'clicks', unit, pear.data.Column.DataType.NUMBER),
    new pear.data.Column('Cities', 'cities', 'cities', unit, pear.data.Column.DataType.NUMBER),
    new pear.data.Column('Last Open', 'lastopen', 'lastOpen', 2 * unit, pear.data.Column.DataType.DATETIME)
  ];

  beacon_table.setWidth(width);
  beacon_table.setHeight(200);
  beacon_table.setColumns(columns);
  beacon_table.setDataRows(data);
  return beacon_table;
};


/**
 * @override
 */
ydn.crm.TrackingPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  root.classList.add(ydn.crm.TrackingPanel.CSS_CLASS);
  var dom = this.getDomHelper();
  var head = dom.createDom('div', ydn.crm.ui.CSS_CLASS_HEAD);
  var content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);
  root.appendChild(head);
  root.appendChild(content);
  var slots = [];
  for (var i = 0; i < ydn.crm.TrackingPanel.SLOT_LABELS.length; i++) {
    var value = dom.createDom('div', 'value-holder', [dom.createDom('span', 'value', '0')]);
    var label = dom.createDom('div', 'label', ydn.crm.TrackingPanel.SLOT_LABELS[i]);
    if (i == 2 || i == 3) {
      value.appendChild(dom.createDom('span', 'percent', '%'));
    }
    slots[i] = dom.createDom('div', {'class': 'slot', 'tabindex': i}, [value, label]);
  }
  head.appendChild(dom.createDom('div', 'stats', slots));

  var beacon_table = this.createGrid([]);
  this.addChild(beacon_table, true);
};



