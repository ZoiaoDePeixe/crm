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


goog.provide('ydn.crm.msg.StatusBar');
goog.require('ydn.crm.msg.Consumer');



/**
 * Console status bar to consume message.
 * @param {boolean=} opt_drop_up status message panel should open up.
 * @constructor
 * @implements {ydn.crm.msg.Consumer}
 */
ydn.crm.msg.StatusBar = function(opt_drop_up) {
  this.root_ = null;
  this.status_el_ = null;
  this.drop_up_ = !!opt_drop_up;

  /**
   * @final
   * @type {string}
   */
  this.open_sign = this.drop_up_ ? '&#x25BC;' : '&#x25B2;';
  /**
   * @final
   * @type {string}
   */
  this.close_sign = this.drop_up_ ? '&#x25B2;' : '&#x25BC;';

  /**
   * @final
   * @type {Function}
   * @private
   */
  this.onBodyClickListener_ = this.onBodyClick_.bind(this);
};


/**
 * @const
 * @type {string}
 */
ydn.crm.msg.StatusBar.CSS_CLASS_BAR = 'status-bar';


/**
 * @const
 * @type {string}
 */
ydn.crm.msg.StatusBar.CSS_CLASS_MSG = 'status-message';


/**
 * @const
 * @type {string}
 */
ydn.crm.msg.StatusBar.CSS_CLASS_BASE = 'status-base';


/**
 * @const
 * @type {string}
 */
ydn.crm.msg.StatusBar.CSS_CLASS_PANEL = 'status-panel';


/**
 * @const
 * @type {string}
 */
ydn.crm.msg.StatusBar.CSS_CLASS_BUTTON = 'status-detail-button';


/**
 * @param {Element} el
 */
ydn.crm.msg.StatusBar.prototype.render = function(el) {
  this.root_ = document.createElement('div');
  this.status_el_ = document.createElement('span');
  var panel_el = document.createElement('div');
  this.root_.className = ydn.crm.msg.StatusBar.CSS_CLASS_BASE;
  panel_el.className = ydn.crm.msg.StatusBar.CSS_CLASS_PANEL;

  // main status bar
  this.status_el_.className = ydn.crm.msg.StatusBar.CSS_CLASS_BAR;
  var title = document.createElement('span');
  var link = document.createElement('a');
  var update = document.createElement('span');
  var btn = document.createElement('span');
  btn.className = ydn.crm.msg.StatusBar.CSS_CLASS_BUTTON;
  btn.innerHTML = this.close_sign;
  btn.setAttribute('title', 'Show previous messages');
  this.status_el_.appendChild(title);
  this.status_el_.appendChild(link);
  this.status_el_.appendChild(update);

  var msg_bar = document.createElement('div');
  msg_bar.className = ydn.crm.msg.StatusBar.CSS_CLASS_MSG;
  msg_bar.appendChild(this.status_el_);
  msg_bar.appendChild(btn);
  this.root_.appendChild(msg_bar);
  this.root_.appendChild(panel_el);
  el.appendChild(this.root_);

  btn.onclick = this.onOpenClick_.bind(this);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.msg.StatusBar.prototype.onOpenClick_ = function(e) {
  var panel = this.root_.querySelector('.' + ydn.crm.msg.StatusBar.CSS_CLASS_PANEL);
  if (panel.classList.contains('open')) {
    this.showPanel(false);
  } else {
    this.showPanel(true);
  }
};


/**
 * Show detail panel.
 * @param {boolean} val
 */
ydn.crm.msg.StatusBar.prototype.showPanel = function(val) {
  var btn = this.root_.querySelector('.' + ydn.crm.msg.StatusBar.CSS_CLASS_BUTTON);
  btn.innerHTML = val ? this.open_sign : this.close_sign;

  var panel = this.root_.querySelector('.' + ydn.crm.msg.StatusBar.CSS_CLASS_PANEL);

  if (val) {
    panel.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('title', 'Hide message panel');
    this.renderDetailPanel_();
    document.body.addEventListener('click', this.onBodyClickListener_, true);
  } else {
    panel.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('title', 'Show previous messages');
    panel.innerHTML = '';
    document.body.removeEventListener('click', this.onBodyClickListener_, true);
  }
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.msg.StatusBar.prototype.onBodyClick_ = function(e) {
  var ele = e.target;
  var panel = this.root_.querySelector('.' + ydn.crm.msg.StatusBar.CSS_CLASS_PANEL);
  if (!!ele && ele instanceof Element) {
    if (ele == panel) {
      return;
    }
    if (panel.contains(ele)) {
      return;
    }
    if (panel.classList.contains('open')) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.showPanel(false);
  }
};


/**
 * Render detail panel.
 * @private
 */
ydn.crm.msg.StatusBar.prototype.renderDetailPanel_ = function() {
  var panel = this.root_.querySelector('.' + ydn.crm.msg.StatusBar.CSS_CLASS_PANEL);
  panel.innerHTML = '';
  var fg = document.createDocumentFragment();
  for (var i = ydn.crm.msg.Manager.getLastId(); i >= 0; i--) {
    var msg = ydn.crm.msg.Manager.getMessageAt(i);
    if (!msg) {
      break;
    }
    var item = document.createElement('div');
    if (msg.title) {
      var title = document.createElement('span');
      title.textContent = msg.title;
      item.appendChild(title);
    }
    if (msg.linkHref) {
      var link = document.createElement('a');
      link.textContent = msg.linkText;
      link.href = msg.linkHref;
      if (msg.linkTitle) {
        link.setAttribute('title', msg.linkTitle);
      }
      if (msg.linkHref) {
        link.setAttribute('target', '_blank');
      }
      item.appendChild(link);
    }
    if (msg.update) {
      var update = document.createElement('span');
      update.textContent = msg.update;
      item.appendChild(update);
    }
    fg.appendChild(item);
  }
  panel.appendChild(fg);
  if (this.drop_up_) {
    panel.style.marginTop = (-18 - panel.clientHeight) + 'px';
  }
};


/**
 * @inheritDoc
 */
ydn.crm.msg.StatusBar.prototype.setMessage = function(id, msg) {
  if (this.status_el_) {
    this.status_el_.children[0].textContent = msg.title + ' ';
    var a = this.status_el_.children[1];
    if (msg.linkHref) {
      a.textContent = msg.linkText;
      a.href = msg.linkHref || '';
      if (a.href) {
        a.setAttribute('target', '_blank');
      }
      a.setAttribute('title', msg.linkTitle || '');
      a.style.display = '';
    } else {
      a.style.display = 'none';
    }
    this.status_el_.children[2].textContent = ' ' + (msg.update || '');
  }
};


