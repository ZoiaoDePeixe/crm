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
 * @fileoverview Upload attachment to email or document.
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.su.IAttachButton');
goog.provide('ydn.crm.su.IAttachButtonProvider');



/**
 * @interface
 */
ydn.crm.su.IAttachButtonProvider = function() {

};


/**
 * Render attach button on the download preview panel.
 * @param {Element} anchor attachment anchor element which has download_url
 * attribute.
 * @return {ydn.crm.su.IAttachButton} the button component.
 */
ydn.crm.su.IAttachButtonProvider.prototype.renderButton = function(anchor) {};



/**
 * @interface
 */
ydn.crm.su.IAttachButton = function() {

};


/**
 * Get message id representing this button.
 * @return {string} gmail message id, such as: "m1490e04d5446681e"
 */
ydn.crm.su.IAttachButton.prototype.getMessageId = function() {};


/**
 * Get download information.
 * @return {ydn.gmail.Utils.AttachmentParts}
 */
ydn.crm.su.IAttachButton.prototype.getDownloadInfo = function() {};
