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
 * @fileoverview User service provider.
 *
 *  * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.IUser');



/**
 * User service provider.
 * @interface
 */
ydn.crm.IUser = function() {};


/**
 * Get login email address to Yathit server.
 * @return {string}
 */
ydn.crm.IUser.prototype.getLoginEmail = function() {};


/**
 * @return {?string} gmail address.
 */
ydn.crm.IUser.prototype.getGmail = function() {};


/**
 * Check user has granted to use the feature.
 * @param {ydn.crm.base.Feature} feature
 * @param {boolean=} opt_show_msg show not support function to user.
 * @return {boolean}
 */
ydn.crm.IUser.prototype.hasFeature = function(feature, opt_show_msg) {};


/**
 * @return {string} user license edition.
 */
ydn.crm.IUser.prototype.getLicense = function() {};
