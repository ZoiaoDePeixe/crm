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
 * @fileoverview Record snippet shows a brief description of the record.
 *
 * Upon hovering over the pane, an editable record panel appear on the side
 * of snippet panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.su.ui.HoverRecordList');
goog.require('ydn.crm.su.ui.RecordList');
goog.require('ydn.crm.su.ui.record.Record');
goog.require('ydn.crm.su.ui.record.HoverCard');
goog.require('ydn.crm.su.ui.RecordListProvider');



/**
 * Record snippet shows a brief description of the record.
 * @param {ydn.crm.su.ui.RecordListProvider} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.crm.su.ui.RecordList}
 * @see ydn.crm.su.ui.HoverResultList
 */
ydn.crm.su.ui.HoverRecordList = function(model, opt_dom) {
  goog.base(this, model, opt_dom);

  /**
   * @type {ydn.crm.su.ui.record.HoverCard}
   * @private
   */
  this.hover_ = null;

};
goog.inherits(ydn.crm.su.ui.HoverRecordList, ydn.crm.su.ui.RecordList);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.su.ui.HoverRecordList.DEBUG = false;


/**
 * @inheritDoc
 */
ydn.crm.su.ui.HoverRecordList.prototype.createDom = function() {
  goog.base(this, 'createDom');

  var dom = this.getDomHelper();
  var ul = this.getUlElement();
  var provider = this.getProvider();
  this.hover_ = new ydn.crm.su.ui.record.HoverCard(provider.getMeta(), ul, dom);
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.HoverRecordList.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  var hd = this.getHandler();
  hd.listen(this.hover_, goog.ui.HoverCard.EventType.TRIGGER,
      this.onTrigger_);
  hd.listen(this.hover_, goog.ui.HoverCard.EventType.BEFORE_SHOW,
      this.onBeforeShow_);

};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.HoverRecordList.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.hover_.dispose();
  this.hover_ = null;
};


/**
 * Handle on hover card trigger.
 * @param {goog.ui.HoverCard.TriggerEvent} ev
 * @return {boolean}
 * @private
 */
ydn.crm.su.ui.HoverRecordList.prototype.onTrigger_ = function(ev) {
  var trigger = ev.anchor;
  var pos = new goog.positioning.AnchoredViewportPosition(trigger,
      goog.positioning.Corner.TOP_LEFT, true);
  this.hover_.setPosition(pos);
  return true;
};


/**
 * Handle on hover card before show.
 * @param {goog.events.Event} ev
 * @private
 */
ydn.crm.su.ui.HoverRecordList.prototype.onBeforeShow_ = function(ev) {

  var trigger = this.hover_.getAnchorElement();
  var id = trigger.getAttribute('data-id');
  var mn = trigger.getAttribute('data-module');
  this.hover_.refreshRecord(/** @type {ydn.crm.su.ModuleName} */(mn), id);
};
