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
 * @fileoverview Display news feed.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.feed.Feed');
goog.require('goog.style');
goog.require('ydn.crm.feed.Message');



/**
 * Display news feed.
 * @constructor
 * @struct
 */
ydn.crm.feed.Feed = function() {
  /**
   * @protected
   * @type {Element}
   */
  this.root = null;

  /**
   * @protected
   * @type {Element}
   */
  this.ul = null;
  /**
   * @protected
   * @type {Array.<ydn.crm.feed.Message>}
   */
  this.messages = [];
  /**
   * @type {Function}
   */
  this.statusListener = null;
};


/**
 * Maximum number of messages to keep.
 * @type {number}
 */
ydn.crm.feed.Feed.MAX = 20;


/**
 * @param {Element} ele feed root element
 */
ydn.crm.feed.Feed.prototype.render = function(ele) {
  this.root = ele;
  this.ul = document.createElement('UL');
  this.root.appendChild(this.ul);
};


/**
 * @param {boolean} value
 */
ydn.crm.feed.Feed.prototype.setVisible = function(value) {
  goog.style.setElementShown(this.root, value);
};


/**
 * Add a new text message.
 * @param {string} text the message.
 * @return {ydn.crm.feed.Message}
 */
ydn.crm.feed.Feed.prototype.notify = function(text) {
  var msg = new ydn.crm.feed.Message(text);
  this.add(msg);
  return msg;
};


/**
 * @param {*} id message id.
 * @return {ydn.crm.feed.Message}
 */
ydn.crm.feed.Feed.prototype.getMessage = function(id) {
  for (var i = 0; i < this.messages.length; ++i) {
    if (this.messages[i].getId() == id) {
      return this.messages[i];
    }
  }
  return null;
};


/**
 * @param {ydn.crm.feed.Message} msg
 */
ydn.crm.feed.Feed.prototype.add = function(msg) {
  var li = document.createElement('li');
  this.ul.insertBefore(li, this.ul.children[0]);
  msg.init(li);
  if (this.messages.length > 0) {
    // unsubscribe
    this.messages[this.messages.length - 1].stream(null, null);
  }
  msg.stream(this.statusListener, null);
  this.messages.push(msg);
  if (this.messages.length > ydn.crm.feed.Feed.MAX) {
    var mg = this.messages[this.messages.length - 1];
    this.ul.removeChild(mg.getRoot());
    mg.dispose();
    this.messages.length = this.messages.length - 1;
  }

};


/**
 * @inheritDoc
 */
ydn.crm.feed.Feed.prototype.toString = function() {
  return 'Feed';
};


/**
 * Singleton feed instance.
 * @private
 * @type {ydn.crm.feed.Feed}
 */
ydn.crm.feed.feed_ = null;


/**
 * Get singleton instance.
 * @return {ydn.crm.feed.Feed}
 */
ydn.crm.feed.getInstance = function() {
  if (!ydn.crm.feed.feed_)  {
    ydn.crm.feed.feed_ = new ydn.crm.feed.Feed();
  }
  return ydn.crm.feed.feed_;
};

