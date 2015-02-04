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


goog.provide('ydn.crm.feed.Message');



/**
 * Display news feed.
 * <pre>
 *   var msg = ydn.crm.feed.Message('Title');
 *   ydn.crm.feed.feed.add(msg);
 *   msg.status('working...');
 *   msg.link('http://www.example.com', 'view');
 *   msg.done('finished'); // optional message.
 * </pre>
 * @param {string=} opt_title message title.
 * @param {string=} opt_id message id.
 * @constructor
 * @extends {goog.Disposable}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @struct
 */
ydn.crm.feed.Message = function(opt_title, opt_id) {
  goog.base(this);
  this.id = opt_id || 'f' + this.count();
  /**
   * Li element
   * @protected
   * @type {Element}
   */
  this.root = null;
  /**
   * @protected
   * @type {Element}
   */
  this.ele_title = document.createElement('span');
  if (opt_title) {
    this.ele_title.textContent = opt_title;
  }
  /**
   * @protected
   * @type {Element}
   */
  this.ele_link = document.createElement('a');
  /**
   * @protected
   * @type {Element}
   */
  this.ele_status = document.createElement('span');
  /**
   * @final
   * @type {number}
   */
  this.created = goog.now();
  /**
   * @type {function(Object)?}
   * @private
   */
  this.stream_cb_ = null;
  /**
   * @type {Object}
   * @private
   */
  this.stream_scope_ = null;
};
goog.inherits(ydn.crm.feed.Message, goog.Disposable);


/**
 * The object is formatted for ydn.msg.Message.
 * @see #fromJSON
 * @return {Object}
 */
ydn.crm.feed.Message.prototype.toJSON = function() {
  return {
    'id': this.id,
    'message': {
      'title': this.ele_title.textContent,
      'status': this.ele_status.textContent,
      'link': {
        'href': this.ele_link.href,
        'text': this.ele_link.textContent,
        'title': this.ele_link.title
      }
    }
  };
};


/**
 * Update from JSON.
 * @param {*} obj
 */
ydn.crm.feed.Message.prototype.fromJSON = function(obj) {
  goog.asserts.assert(obj['id'] == this.id, 'expect id ' + this.id +
      ' but ' + obj['id']);
  var msg = obj['message'];
  if (!msg) {
    return;
  }
  // window.console.log('update ' + this.id);
  this.ele_title.textContent = msg['title'];
  this.ele_status.textContent = msg['status'];
  this.link(msg['link']['href'], msg['link']['text'], msg['link']['title']);
};


/**
 * @return {string}
 */
ydn.crm.feed.Message.prototype.getId = function() {
  return this.id;
};


/**
 * @return {string}
 */
ydn.crm.feed.Message.prototype.getTitle = function() {
  return this.ele_title.textContent;
};


/**
 * @type {number}
 * @private
 */
ydn.crm.feed.Message.count_ = 0;


/**
 * @protected
 * @return {number}
 */
ydn.crm.feed.Message.prototype.count = function() {
  ydn.crm.feed.Message.count_++;
  return ydn.crm.feed.Message.count_;
};


/**
 * @type {boolean}
 * @private
 */
ydn.crm.feed.Message.prototype.done_ = false;


/**
 * @param {Element} ele LI element.
 */
ydn.crm.feed.Message.prototype.init = function(ele) {
  if (this.root) {
    throw new Error('Already initialized');
  }
  this.root = ele;
  this.root.appendChild(this.ele_title);
  this.root.appendChild(this.ele_link);
  this.root.appendChild(this.ele_status);
};


/**
 * @return {Element}
 */
ydn.crm.feed.Message.prototype.getRoot = function() {
  return this.root;
};


/**
 * @inheritDoc
 */
ydn.crm.feed.Message.prototype.disposeInternal = function() {
  this.root = null;
  this.stream_cb_ = null;
  this.stream_scope_ = null;
};


/**
 * Change message title.
 * @param {string} title title longer than 20 char will be trimmed.
 * @param {string=} opt_description optional description as hover text.
 */
ydn.crm.feed.Message.prototype.title = function(title, opt_description) {
  this.ele_title.textContent = title;
  this.ele_title.title = opt_description || '';
  this.dispatch_();
};


/**
 * Append an link.
 * @param {string?} url
 * @param {string=} opt_title
 * @param {string=} opt_description optional description as hover text.
 */
ydn.crm.feed.Message.prototype.link = function(url, opt_title, opt_description) {
  if (!url) {
    goog.style.setElementShown(this.ele_link, false);
    return;
  } else {
    goog.style.setElementShown(this.ele_link, true);
  }
  if (opt_title.length > 20) {
    if (!opt_description) {
      opt_description = opt_title;
    }
    opt_title = opt_title.substr(0, 9) + '...' +
        opt_title.substring(opt_title.length - 7);
  }
  this.ele_link.href = url;
  this.ele_link.textContent = opt_title || url.substr(-10);
  if (!goog.string.startsWith(url, '#')) {
    this.ele_link.target = '_blank';
  }
  this.ele_link.title = opt_description || '';
  this.dispatch_();
};


/**
 * Set status text.
 * @param {string} s
 */
ydn.crm.feed.Message.prototype.status = function(s) {
  this.ele_status.textContent = s;
  this.dispatch_();
};


/**
 * Dispatch message to stream.
 * @private
 */
ydn.crm.feed.Message.prototype.dispatch_ = function() {
  if (this.stream_cb_) {
    this.stream_cb_.call(this.stream_scope_, this.toJSON());
  }
};


/**
 * Stream update message.
 * @param {function(this:T, Object)?} cb
 * @param {T} scope
 * @template T
 */
ydn.crm.feed.Message.prototype.stream = function(cb, scope) {
  this.stream_cb_ = cb;
  this.stream_scope_ = scope;
  this.dispatch_();
};


/**
 * Mark message as done.
 * @param {string=} opt_status optional status message.
 */
ydn.crm.feed.Message.prototype.done = function(opt_status) {
  if (!this.done_) {
    if (goog.isDef(opt_status)) {
      this.status(opt_status);
    }
    this.done_ = true;
    if (this.stream_cb_) {
      this.stream_cb_.call(this.stream_scope_, this.toJSON());
    }
    this.dispose();
  }
};

