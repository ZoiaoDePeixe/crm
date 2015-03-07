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
 * @fileoverview Home page for SugarCRM in CRMinInbox suite.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.HomePage');
goog.require('ydn.crm.gdata.CalendarSettingPanel');
goog.require('ydn.crm.gdata.CredentialWidget');
goog.require('ydn.crm.su.Widget');
goog.require('ydn.crm.su.WidgetModel');
goog.require('ydn.crm.tracking.setting.Main');
goog.require('ydn.crm.ui.LoggingPrefPanel');



/**
 * Home page for SugarCRM in CRMinInbox suite.
 * @param {ydn.crm.ui.UserSetting} us
 * @constructor
 * @implements {ydn.crm.IPage}
 * @struct
 */
ydn.crm.ui.HomePage = function(us) {
  /**
   * @final
   * @type {ydn.crm.ui.UserSetting}
   */
  this.us = us;
  /**
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');
  /**
   * @protected
   * @type {ydn.crm.su.Widget}
   */
  this.sugar_widget = new ydn.crm.su.Widget(new ydn.crm.su.WidgetModel());
  this.sugar_widget.show_stats = true;
  this.need_refresh_ = true;

  /**
   * @protected
   * @type {ydn.crm.gdata.CredentialWidget}
   */
  this.gdata_widget = new ydn.crm.gdata.CredentialWidget();

  /**
   * @protected
   * @type {ydn.crm.gdata.CalendarSettingPanel}
   */
  this.calendar_setting = new ydn.crm.gdata.CalendarSettingPanel(us);

  /**
   * @protected
   * @type {ydn.crm.ui.LoggingPrefPanel}
   */
  this.logging_pref = null;

};


/**
 * @override
 */
ydn.crm.ui.HomePage.prototype.render = function(el) {
  var temp = ydn.ui.getTemplateById('sugarcrm-home-template').content;
  this.root_.appendChild(temp.cloneNode(true));
  var gdata_ele = this.root_.querySelector('#gdata');
  this.gdata_widget.render(gdata_ele);
  var us = ydn.crm.ui.UserSetting.getInstance();
  if (YathitCrm.Product.Tracking &&
      this.us.hasFeature(ydn.crm.base.Feature.TRACKING)) {
    var tracking = new ydn.crm.tracking.setting.Main(us);
    tracking.render(gdata_ele.parentElement);
  }
  if (YathitCrm.Product.GData.Calendar) {
    this.calendar_setting.render(this.root_.querySelector('section[name=calendar]'));
  }
  this.sugar_widget.render(this.root_.querySelector('#sugarcrm-widget'));
  this.logging_pref = new ydn.crm.ui.LoggingPrefPanel();
  this.logging_pref.render(this.root_.querySelector('#logging-section'));
  el.appendChild(this.root_);
};


/**
 * @return {boolean}
 */
ydn.crm.ui.HomePage.prototype.hasGDataCredential = function() {
  return this.gdata_widget.hasCredential();
};


/**
 * @private
 */
ydn.crm.ui.HomePage.prototype.refreshIfNeeded_ = function() {
  if (!this.need_refresh_) {
    return;
  }
  this.gdata_widget.refresh();
  ydn.crm.su.WidgetModel.list().addCallbacks(function(models) {
    for (var i = 0; i < models.length; i++) {
      var model = models[i];
      if (model.isLogin()) {
        this.need_refresh_ = false;
        this.sugar_widget.setModel(model);
        return;
      }
    }
    if (models.length > 0) {
      this.need_refresh_ = false;
      // console.log(models[0]);
      this.sugar_widget.setModel(models[0]);
    }
  }, function(e) {
    ydn.crm.msg.Manager.addStatus('listing sugarcrm model fail ' + (e.message || e));
  }, this);
};


/**
 * @override
 */
ydn.crm.ui.HomePage.prototype.onPageShow = function() {
  this.refreshIfNeeded_();
};


/**
 * @override
 */
ydn.crm.ui.HomePage.prototype.toString = function() {
  return 'Home';
};
