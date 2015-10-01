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


goog.provide('ydn.crm.msg.SimpleStatusBar');
goog.require('ydn.crm.msg.Consumer');



/**
 * Simple status bar displays the last message.
 * @constructor
 * @implements {ydn.crm.msg.Consumer}
 */
ydn.crm.msg.SimpleStatusBar = function() {
  this.root = null;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.msg.SimpleStatusBar.CSS_CLASS = 'simple-status-bar';


/**
 * @param {Element} el
 */
ydn.crm.msg.SimpleStatusBar.prototype.render = function(el) {
  this.root = document.createElement('div');
  this.root.className = ydn.crm.msg.SimpleStatusBar.CSS_CLASS;
  var title = document.createElement('span');
  var link = document.createElement('a');
  var update = document.createElement('span');
  this.root.appendChild(title);
  this.root.appendChild(link);
  this.root.appendChild(update);
  el.appendChild(this.root);
};


/**
 * @inheritDoc
 */
ydn.crm.msg.SimpleStatusBar.prototype.setMessage = function(id, msg) {
  if (this.root) {
    this.root.children[0].textContent = msg.title + ' ';
    if (msg.linkHref) {
      this.root.children[1].textContent = msg.linkText;
      this.root.children[1].href = msg.linkHref;
      this.root.children[1].title = msg.linkTitle;
      this.root.children[1].style.display = '';
    } else {
      this.root.children[1].style.display = 'none';
    }
    this.root.children[2].textContent = ' ' + (msg.update || '');
  }
};


/**
 * Reset message.
 */
ydn.crm.msg.SimpleStatusBar.prototype.reset = function() {
  var msg = /** @type {ydn.crm.msg.Message} */({title: ''});
  this.setMessage(0, msg);
};


