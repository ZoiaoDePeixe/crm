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
 * @fileoverview Social context widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.SocialWidget');
goog.require('goog.events.EventHandler');
goog.require('ydn.crm.gmail.GmailObserver');
goog.require('ydn.social.ui.Bar');



/**
 * Social context widget.
 * @param {ydn.crm.gmail.GmailObserver} gob
 * @constructor
 * @struct
 */
ydn.social.ui.SocialWidget = function(gob) {
  /**
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');

  /**
   * @protected
   * @type {ydn.social.ui.Bar}
   */
  this.bar = new ydn.social.ui.Bar();

  this.handler = new goog.events.EventHandler(this);

  this.handler.listen(gob,
      ydn.crm.gmail.GmailObserver.EventType.CONTEXT_CHANGE,
      this.onGmailContextEvent_);
};


/**
 * @define {boolean} debug flag.
 */
ydn.social.ui.SocialWidget.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.social.ui.SocialWidget.CSS_CLASS = 'social-widget';


/**
 * Render UI.
 * @param {Element} el
 */
ydn.social.ui.SocialWidget.prototype.render = function(el) {
  this.root_.classList.add(ydn.social.ui.SocialWidget.CSS_CLASS);
  el.appendChild(this.root_);
  this.bar.render(this.root_);
};


/**
 * Update target contact.
 * @param {ydn.crm.gmail.GmailObserver.ContextRightBarEvent} e
 * @private
 */
ydn.social.ui.SocialWidget.prototype.onGmailContextEvent_ = function(e) {

  if (e.context) {
    if (e.context.kind == ydn.crm.inj.Context.Kind.DEFAULT) {
      this.bar.showByEmail(e.context.getEmail());
    }
  } else {
    this.bar.showByEmail(null);
  }

};
