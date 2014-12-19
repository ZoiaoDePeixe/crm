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
 * @fileoverview Display bar for social interaction.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.Bar');
goog.require('goog.log');
goog.require('goog.ui.Component');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.ui');
goog.require('ydn.msg');
goog.require('ydn.social.MetaContact');
goog.require('ydn.social.ui.Twitter');
goog.require('ydn.social.ui.GPlus');
goog.require('ydn.social.ui.LinkedIn');



/**
 * Display bar for social interaction.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.social.ui.Bar = function(opt_dom) {
  goog.base(this, opt_dom);
  /**
   * @protected
   * @type {ydn.social.MetaContact}
   */
  this.target = null;
};
goog.inherits(ydn.social.ui.Bar, goog.ui.Component);


/**
 * @protected
 * @type {goog.log.Logger}
 */
ydn.social.ui.Bar.prototype.logger =
    goog.log.getLogger('yydn.social.ui.Bar');


/**
 * @define {boolean} debug flag.
 */
ydn.social.ui.Bar.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Bar.CSS_CLASS = 'social-bar';


/**
 * @inheritDoc
 */
ydn.social.ui.Bar.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  root.classList.add(ydn.social.ui.Bar.CSS_CLASS);
  var twitter = new ydn.social.ui.Twitter();
  var li = new ydn.social.ui.LinkedIn();
  var gp = new ydn.social.ui.GPlus();
  this.addChild(twitter, true);
  this.addChild(gp, true);
  this.addChild(li, true);
};


/**
 * Set target person.
 * @param {ydn.social.MetaContact} target
 */
ydn.social.ui.Bar.prototype.setTarget = function(target) {
  if (target == this.target) {
    return;
  }
  this.target = target;
  for (var i = 0; i < this.getChildCount(); i++) {
    var ch = /** @type {ydn.social.ui.Network} */ (this.getChildAt(i));
    ch.setTarget(target);
  }
};


/**
 * Update contents.
 * @param {?string} email
 */
ydn.social.ui.Bar.prototype.showByEmail = function(email) {
  if (ydn.social.ui.Bar.DEBUG) {
    window.console.log(email);
  }

  if (!email) {
    this.setTarget(null);
    return;
  }
  ydn.social.MetaContact.fetchByEmail(email).addCallbacks(function(mc) {
    this.setTarget(mc);
  }, function(e) {
    window.console.error(e.stack || e);
  }, this);
};


/**
 * @inheritDoc
 */
ydn.social.ui.Bar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};


/**
 * Set contact by email.
 * @param {string} email
 */
ydn.social.ui.Bar.prototype.setTargetByEmail = function(email) {
  if (this.target && this.target.email == email) {
    return;
  }
  this.setTarget(null);
  ydn.social.MetaContact.fetchByEmail(email).addCallback(function(t) {
    if (ydn.social.ui.Bar.DEBUG) {
      window.console.log(t);
    }
    this.setTarget(t || null);
  }, this);
};


