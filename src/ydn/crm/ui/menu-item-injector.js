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
 * @fileoverview Menu Item injector interface.
 */


goog.provide('ydn.crm.ui.IMenuItemInjector');



/**
 * Menu Item injector interface.
 * @interface
 */
ydn.crm.ui.IMenuItemInjector = function() {};


/**
 * Get menu item configuration by target element.
 * @param {Element} el
 * @return {?ydn.crm.ui.IMenuItemInjector.MenuItemConf}
 */
ydn.crm.ui.IMenuItemInjector.prototype.getConfigByTarget = function(el) {};


/**
 * @typedef {{
 *   label: string,
 *   tooltip: (string|undefined),
 *   enabled: boolean,
 *   status: number,
 *   statusString: (string|undefined)
 * }} menu item configuration
 */
ydn.crm.ui.IMenuItemInjector.MenuItemConf;
