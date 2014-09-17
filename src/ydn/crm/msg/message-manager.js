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
 * @fileoverview Status message manager.
 *
 * Centralize repo to dump status message and forwarding message to consumer, which
 * display the message.
 *
 * The main reason, having as manager is we have more than one consumer.
 */



goog.provide('ydn.crm.msg.Manager');
goog.require('ydn.crm.msg.Consumer');



/**
 * Status message manager.
 * Do not instantiate this, but instead use static method.
 * @constructor
 * @struct
 */
ydn.crm.msg.Manager = function() {
  /**
   * @final
   * @type {Array.<(ydn.crm.msg.Message|undefined)>}
   * @private
   */
  this.messages_ = [];

  /**
   * @final
   * @type {Array.<ydn.crm.msg.Consumer>}
   * @private
   */
  this.consumers_ = [];
};


/**
 * @define {number} maximun number of message to keep in buffer.
 */
ydn.crm.msg.Manager.MAX_BUFFER = 20;


/**
 * Add message.
 * @param {ydn.crm.msg.Message} msg message.
 * @return {number} message id.
 * @protected
 */
ydn.crm.msg.Manager.prototype.addMessage = function(msg) {
  this.messages_.push(msg);
  var oid = this.messages_.length - ydn.crm.msg.Manager.MAX_BUFFER;
  if (oid >= 0) {
    this.messages_[oid] = undefined;
  }
  var id = this.messages_.length - 1;
  this.dispatchMessage(id);
  return id;
};


/**
 * @param {ydn.crm.msg.Consumer} con
 */
ydn.crm.msg.Manager.addConsumer = function(con) {
  ydn.crm.msg.Manager.instance_.consumers_.push(con);
};


/**
 * Get last message id.
 * The follow example illustrate iterating all message from the last.
 *
 *     for (var i = ydn.crm.msg.Manager.getLastId(); i >= 0; i--) {
 *       var msg = ydn.crm.msg.Manager.getMessageAt(i);
 *     }
 *
 * @return {number} last message id.
 */
ydn.crm.msg.Manager.getLastId = function() {
  return ydn.crm.msg.Manager.instance_.messages_.length - 1;
};


/**
 * @param {number} id message id.
 * @return {ydn.crm.msg.Message|undefined}
 */
ydn.crm.msg.Manager.getMessageAt = function(id) {
  return ydn.crm.msg.Manager.instance_.messages_[id];
};


/**
 * @param {number} id
 */
ydn.crm.msg.Manager.prototype.dispatchMessage = function(id) {
  for (var i = 0; i < this.consumers_.length; i++) {
    var consumer = this.consumers_[i];
    var msg = this.messages_[id];
    if (msg) {
      consumer.setMessage(id, msg);
    }
  }
};


/**
 * Singleton instance.
 * @type {ydn.crm.msg.Manager}
 * @private
 */
ydn.crm.msg.Manager.instance_ = new ydn.crm.msg.Manager();


/**
 * Add a new status message.
 * @param {string} status
 * @param {string=} opt_update status tail to update later on.
 * @param {ydn.crm.msg.MessageType=} opt_type
 * @return {number} message id.
 */
ydn.crm.msg.Manager.addStatus = function(status, opt_update, opt_type) {
  var msg = {
    title: status,
    update: opt_update,
    type: opt_type || ydn.crm.msg.MessageType.NORMAL
  };
  return ydn.crm.msg.Manager.instance_.addMessage(msg);
};


/**
 * Add a new status message.
 * @param {number} id message id.
 * @param {string} status
 * @param {string=} opt_update status tail to update later on.
 * @param {ydn.crm.msg.MessageType=} opt_type
 * @return {boolean}
 */
ydn.crm.msg.Manager.setStatus = function(id, status, opt_update, opt_type) {
  var msg = ydn.crm.msg.Manager.instance_.messages_[id];
  if (!msg) {
    return false;
  }
  msg.title = status;
  if (opt_update) {
    msg.update = opt_update;
  }
  if (opt_type) {
    msg.type = opt_type;
  }
  ydn.crm.msg.Manager.instance_.dispatchMessage(id);
  return true;
};


/**
 * Update status.
 * @param {number} id message id.
 * @param {string} update message tail to be update.
 * @param {ydn.crm.msg.MessageType=} opt_type
 * @return {boolean}
 */
ydn.crm.msg.Manager.updateStatus = function(id, update, opt_type) {
  var msg = ydn.crm.msg.Manager.instance_.messages_[id];
  if (!msg) {
    return false;
  }
  msg.update = update;
  if (opt_type) {
    msg.type = opt_type;
  }
  ydn.crm.msg.Manager.instance_.dispatchMessage(id);
  return true;
};


/**
 * Set a link to the message.
 * @param {number} id message id.
 * @param {string} href
 * @param {string} text
 * @param {string=} opt_title
 * @return {boolean} true if update the message, false if message no longer
 * applicable.
 */
ydn.crm.msg.Manager.setLink = function(id, href, text, opt_title) {
  var msg = ydn.crm.msg.Manager.instance_.messages_[id];
  if (!msg) {
    return false;
  }
  msg.linkHref = href;
  msg.linkText = text;
  msg.linkTitle = opt_title;
  ydn.crm.msg.Manager.instance_.dispatchMessage(id);
  return true;
};








