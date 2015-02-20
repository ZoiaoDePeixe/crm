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
 * @fileoverview Bug reporter.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.BugReporter');
goog.require('goog.style');
goog.require('ydn.ui');



/**
 * Bug reporter.
 * @constructor
 * @struct
 */
ydn.crm.inj.BugReporter = function() {
  /**
   * @final
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');
  /**
   * @type {string}
   * @private
   */
  this.attachment_page_ = '';
};


/**
 * Render a but report UI.
 * @param {Element} footer_el the footer element, in which bug report UI
 * has to be render on.
 */
ydn.crm.inj.BugReporter.prototype.decorate = function(footer_el) {
  var btn_container = footer_el.querySelector('.popup-footer-bar .right-item');
  var btn = document.createElement('a');
  btn.href = '#bug-report';
  btn.textContent = 'Feedback';
  btn.onclick = this.onFeedbackClick_.bind(this);
  if (btn_container.firstElementChild) {
    btn_container.insertBefore(btn, btn_container.firstElementChild);
  } else {
    btn_container.appendChild(btn);
  }
  var t = ydn.ui.getTemplateById('feedback-template').content;
  this.root_.appendChild(t.cloneNode(true));
  goog.style.setElementShown(this.root_, false);
  footer_el.appendChild(this.root_);

  var btn_close = this.root_.querySelector('button[value=close]');
  btn_close.onclick = this.onCloseClick_.bind(this);

  var select = this.root_.querySelector('select');
  select.onchange = this.onSelectChange_.bind(this);

  var btn_submit = this.root_.querySelector('button[value=submit]');
  btn_submit.onclick = this.onSubmitClick_.bind(this);

};


/**
 * Create a bug report message.
 * @param {Event} e
 * @private
 */
ydn.crm.inj.BugReporter.prototype.onFeedbackClick_ = function(e) {
  e.preventDefault();
  var val = goog.style.isElementShown(this.root_);
  if (val) {
    this.closePanel_();
  } else {
    this.openPanel_();
  }
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.inj.BugReporter.prototype.onCloseClick_ = function(e) {
  this.closePanel_();
};


/**
 * @private
 */
ydn.crm.inj.BugReporter.prototype.openPanel_ = function() {
  var select = this.root_.querySelector('select');
  select.selectedIndex = 0;
  goog.style.setElementShown(this.root_, true);
  var btn_submit = this.root_.querySelector('button[value=submit]');
  btn_submit.removeAttribute('disabled');
  var chk_page = this.root_.querySelector('input[name=page]');
  var chk_shot = this.root_.querySelector('input[name=screenshot]');
  chk_page.checked = false;
  chk_shot.checked = false;
};


/**
 * @private
 */
ydn.crm.inj.BugReporter.prototype.closePanel_ = function() {
  goog.style.setElementShown(this.root_, false);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.inj.BugReporter.prototype.onSelectChange_ = function(e) {
  var chk_page = this.root_.querySelector('input[name=page]');
  var chk_shot = this.root_.querySelector('input[name=screenshot]');
  if (e.target.value == 'bug') {
    chk_page.checked = true;
    chk_shot.checked = true;
    this.prepareAttachment_();
    var panel = this.root_.querySelector('.attachment');
    goog.style.setElementShown(panel, true);
  }
};


/**
 * Create attachment.
 * @private
 */
ydn.crm.inj.BugReporter.prototype.preparePage_ = function() {
  var link = this.root_.querySelector('a[name=page]');
  this.attachment_page_ = document.body.outerHTML;
  var blob = new Blob([this.attachment_page_], {type: 'plain/text'});
  if (link.href) {
    window.URL.revokeObjectURL(link.href);
  }
  link.href = window.URL.createObjectURL(blob);
  link.textContent = 'page.html';
  link.setAttribute('download', 'page.html');
};


/**
 * Create attachment.
 * @private
 */
ydn.crm.inj.BugReporter.prototype.prepareAttachment_ = function() {
  this.preparePage_();
};


/**
 * @private
 */
ydn.crm.inj.BugReporter.prototype.disposeAttachment_ = function() {
  var link = this.root_.querySelector('a[name=page]');
  if (link.href) {
    window.URL.revokeObjectURL(link.href);
    link.removeAttribute('href');
  }
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.inj.BugReporter.prototype.onSubmitClick_ = function(e) {
  var msg_el = this.root_.querySelector('.message');
  var msg = msg_el.value;
  if (!msg) {
    ydn.crm.msg.Manager.addStatus('Feedback message required.');
    return;
  }
  var btn_submit = this.root_.querySelector('button[value=submit]');
  var select = this.root_.querySelector('select');
  var data = {
    'type': select.value,
    'message': msg
  };
  var chk_page = this.root_.querySelector('input[name=page]');
  if (chk_page.checked) {
    data['page'] = this.attachment_page_;
  }
  btn_submit.setAttribute('disabled', 'disabled');

  ydn.msg.getChannel().send(ydn.crm.ch.Req.FEEDBACK, data).addCallbacks(function() {
    msg_el.value = '';
    this.closePanel_();
  }, function(e) {
    window.console.error(e);
  }, this);
};
