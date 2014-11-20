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
 * @fileoverview Status message consumer.
 */


goog.provide('ydn.crm.msg.ConsoleStatusBar');
goog.provide('ydn.crm.msg.Consumer');



/**
 * @interface
 */
ydn.crm.msg.Consumer = function() {};


/**
 * Update an existing message.
 * @param {number} id
 * @param {ydn.crm.msg.Message} msg
 */
ydn.crm.msg.Consumer.prototype.setMessage = function(id, msg) {};


/**
 * @enum {string}
 */
ydn.crm.msg.MessageType = {
  NORMAL: '',
  NOTIFICATION: 'n',
  ERROR: 'e'
};


/**
 * Simple status message format.
 * title: Message title.
 * update: Updated message.
 * link: a link
 *
 * Message is renderred as (title + link + update).
 * @typedef {{
 *   title: string,
 *   update: (string|undefined),
 *   type: ydn.crm.msg.MessageType,
 *   linkHref: (string|undefined),
 *   linkText: (string|undefined),
 *   linkTitle: (string|undefined)
 * }}
 */
ydn.crm.msg.Message;



/**
 * Console status bar to consume message.
 * @constructor
 * @implements {ydn.crm.msg.Consumer}
 */
ydn.crm.msg.ConsoleStatusBar = function() {

};


/**
 * @inheritDoc
 */
ydn.crm.msg.ConsoleStatusBar.prototype.setMessage = function(id, msg) {
  var link = '';
  var update = '';
  if (msg.linkText) {
    link = ' ' + msg.linkText;
  }
  if (msg.update) {
    update = ' ' + msg.update;
  }
  window.console.info(msg.title + ': ' + link + update);
};
