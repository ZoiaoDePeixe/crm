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


goog.provide('ydn.crm.sugarcrm.Page');
goog.require('ydn.crm.sugarcrm.Widget');
goog.require('ydn.crm.sugarcrm.WidgetModel');



/**
 * Home page for SugarCRM in CRMinInbox suite.
 * @param {string=} opt_tid template element id.
 * @constructor
 * @implements {ydn.crm.IPage}
 * @struct
 */
ydn.crm.sugarcrm.Page = function(opt_tid) {
  this.template_id_ = opt_tid || 'sugarcrm-home-template';
  /**
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');
  this.widget_ = new ydn.crm.sugarcrm.Widget(new ydn.crm.sugarcrm.WidgetModel());
};


/**
 * @override
 */
ydn.crm.sugarcrm.Page.prototype.render = function(el) {
  var temp = ydn.ui.getTemplateById(this.template_id_).content;
  this.root_.appendChild(temp.cloneNode(true));
  this.widget_.render(this.root_.querySelector('#sugarcrm-widget'));
  el.appendChild(this.root_);
};


/**
 * @override
 */
ydn.crm.sugarcrm.Page.prototype.setUserInfo = function(info) {
};


/**
 * @override
 */
ydn.crm.sugarcrm.Page.prototype.showPage = function(val) {
  ydn.crm.sugarcrm.WidgetModel.list().addCallbacks(function(models) {
    for (var i = 0; i < models.length; i++) {
      var model = models[i];
      if (model.isLogin()) {
        this.widget_.setModel(model);
        break;
      }
    }
  }, function(e) {
    ydn.crm.msg.Manager.addStatus('listing sugarcrm model fail ' + (e.message || e));
  }, this);
};



