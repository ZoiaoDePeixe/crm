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
 * @fileoverview Interface to provide Gmail heading Menu Item.
 *
 *  * @author kyawtun@yathit.com (Kyaw Tun)
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
ydn.crm.ui.IMenuItemProvider.prototype.getName = function() {};


/**
 * @param {ydn.crm.gmail.MessageHeaderWidget} widget
 * @param {goog.events.Event} e Handle on menu item click
 */
ydn.crm.ui.IMenuItemProvider.prototype.onIMenuItem = function(widget, e) {};




