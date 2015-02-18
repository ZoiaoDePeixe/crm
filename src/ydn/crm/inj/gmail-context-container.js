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
 * @fileoverview Context Container implemented for Gmail.
 *
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.GmailContextContainer');
goog.require('ydn.crm.inj.ContextContainer');



/**
 * Context Container implemented for Gmail.
 *  <pre>
 *   var con = new ydn.crm.inj.GmailContextContainer(ob);
 *   var el = con.getContentElement();
 *   // use el as root node to render UI
 * </pre>
 * @param {ydn.crm.gmail.GmailObserver} gmail_observer
 * @param {Element=} opt_ele
 * @constructor
 * @struct
 * @extends {ydn.crm.inj.ContextContainer}
 */
ydn.crm.inj.GmailContextContainer = function(gmail_observer, opt_ele) {
  goog.base(this, gmail_observer, opt_ele);
  this.sidebar_has_attached_ = false;
};
goog.inherits(ydn.crm.inj.GmailContextContainer, ydn.crm.inj.ContextContainer);


/**
 * @inheritDoc
 */
ydn.crm.inj.GmailContextContainer.prototype.attach = function() {
  // this will attach when showing gmail inbox thread.

};


/**
 * Attach to Gmail right side bar.
 * @param {!HTMLTableElement} contact_table right bar table
 * @private
 */
ydn.crm.inj.GmailContextContainer.prototype.attachByTable_ = function(contact_table) {
  // locate root element
  var root_container;
  var ele_stack = contact_table;
  for (var i = 0; i < 4; i++) {
    if (ele_stack && ele_stack.parentElement) {
      ele_stack = ele_stack.parentElement;
      if (ele_stack.nextElementSibling && ele_stack.nextElementSibling.tagName == 'DIV') {
        var parent = ele_stack.parentElement;
        var last = parent.lastElementChild;
        var is_ad = !!last && !!last.querySelector('a[href]'); // ad links
        root_container = document.createElement('div');
        if (is_ad && parent.parentElement.contains(last)) {
          // we want to insert above ad panel.
          parent.insertBefore(root_container, last);
        } else {
          parent.appendChild(root_container);
        }
        break;
      }
    }
  }
  // root_container = null;
  if (!root_container) {
    // this technique is robust, but place in the table.
    this.logger.warning('usual root position is not available, locating on second best position');
    var doc = contact_table.ownerDocument;
    var td = doc.createElement('td');
    td.setAttribute('colspan', '2');
    var tr = doc.createElement('tr');
    tr.className = 'widget-topraw';
    tr.appendChild(td);
    // window.console.log(this.root.parentElement, table);
    var base = contact_table.querySelector('tbody') || contact_table;
    base.appendChild(tr);
    root_container = td;
  }

  var root = this.ele_root;
  if (root.parentElement) {
    root.parentElement.removeChild(root);
    root_container.appendChild(root);
  } else {
    root_container.appendChild(root);
  }
  this.sidebar_has_attached_ = true;
  goog.style.setElementShown(root, true);
};


/**
 * @override
 */
ydn.crm.inj.GmailContextContainer.prototype.attachToGmailRightBar = function(col) {
  if (ydn.crm.inj.ContextContainer.DEBUG) {
    window.console.log('attachToGmailRightBar panel',
        this.sidebar_has_attached_, col);
  }

  if (!col) {
    this.sidebar_has_attached_ = false;
    goog.style.setElementShown(this.ele_root, false);
    return;
  }
  if (this.sidebar_has_attached_) {
    return;
  }
  var contact_table = col.querySelector('table');
  if (contact_table) {
    this.attachByTable_(/** @type {!HTMLTableElement} */(contact_table));
    return;
  }
  // find a good attach point, heuristically
  var root_container = col;
  if (col.firstElementChild) {
    root_container = col.firstElementChild;
    if (root_container.childElementCount > 2) {
      root_container = root_container.lastElementChild.previousElementSibling;
    }
  }
  var root = this.ele_root;
  if (root.parentElement) {
    root.parentElement.removeChild(root);
    root_container.appendChild(root);
  } else {
    root_container.appendChild(root);
  }
  this.sidebar_has_attached_ = true;
  goog.style.setElementShown(root, true);
};

