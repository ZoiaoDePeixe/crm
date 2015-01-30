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
 * @fileoverview Logger sending back to background page.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.BackgroundLogger');
goog.require('ydn.crm.Ch');
goog.require('ydn.debug.ILogger');
goog.require('ydn.msg.Pipe');



/**
 * Logger sending back to background page.
 * <pre>
 *   ydn.debug.ILogger.instance = new ydn.crm.inj.BackgroundLogger();
 *   ydn.debug.ILogger.log(data);
 * </pre>
 * @constructor
 * @struct
 * @implements {ydn.debug.ILogger}
 */
ydn.crm.inj.BackgroundLogger = function() {

};


/**
 * @override
 */
ydn.crm.inj.BackgroundLogger.prototype.log = function(data) {
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.LOG, data);
};

