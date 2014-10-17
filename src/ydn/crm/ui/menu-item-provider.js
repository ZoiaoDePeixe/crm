// Copyright 2014 YDN Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Interface to provide Gmail heading Menu Item.
 */



goog.provide('ydn.crm.ui.IMenuItemProvider');



/**
 * Menu Item provider interface.
 * @interface
 */
ydn.crm.ui.IMenuItemProvider = function() {};


/**
 * Configure the Menu Item by invoking <code>widget.setMenuItemDetail()</code>.
 * @param {ydn.crm.gmail.MessageHeaderWidget} widget
 */
ydn.crm.ui.IMenuItemProvider.prototype.configureMenuItem = function(widget) {};


/**
 * @return {string} menu name.
 */
ydn.crm.ui.IMenuItemProvider.prototype.getMenuName = function() {};



/**
 * Menu Item provider interface.
 * @interface
 */
ydn.crm.ui.IMenuButtonProvider = function() {};


