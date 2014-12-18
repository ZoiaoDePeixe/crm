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
 * @fileoverview Context widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.ContextWidget');
goog.require('ydn.crm.tracking.MsgModel');
goog.require('ydn.crm.ui');
goog.require('ydn.crm.ui.IMenuItemProvider');
goog.require('ydn.crm.ui.UserSetting');



/**
 * Context widget.
 * @param {ydn.crm.inj.ContextContainer} context_container
 * @constructor
 * @struct
 */
ydn.social.ui.ContextWidget = function(context_container) {


};


/**
 * @define {boolean} debug flag.
 */
ydn.social.ui.ContextWidget.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.social.ui.ContextWidget.CSS_CLASS = 'tracking-result';
