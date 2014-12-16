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
goog.require('goog.ui.AdvancedTooltip');
goog.require('goog.ui.Component');
goog.require('ydn.crm.ui');
goog.require('ydn.social.MetaContact');



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
ydn.social.ui.Bar.DEBUG = true;


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Bar.CSS_CLASS = 'social-bar';


/**
 * @param {string} name
 * @return {Element}
 * @private
 */
ydn.social.ui.Bar.prototype.createButton_ = function(name) {
  var twitter = ydn.crm.ui.createSvgIcon(name);
  var btn = document.createElement('span');
  btn.classList.add(ydn.crm.ui.CSS_CLASS_SVG_BUTTON);
  btn.setAttribute('name', name);
  btn.appendChild(twitter);
  return btn;
};


/**
 * @inheritDoc
 */
ydn.social.ui.Bar.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  root.classList.add(ydn.social.ui.Bar.CSS_CLASS);
  var tw = this.createButton_('twitter');
  root.appendChild(tw);

};


/**
 * Set target person.
 * @param {ydn.social.MetaContact} target
 */
ydn.social.ui.Bar.prototype.setTarget = function(target) {
  this.target = target;
};


/**
 * @inheritDoc
 */
ydn.social.ui.Bar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  var buttons = this.getElement().querySelectorAll(ydn.crm.ui.CSS_CLASS_SVG_BUTTON);
  for (var i = 0; i < buttons.length; i++) {
    hd.listen(buttons[i], 'click', this.onButtonClicked_);
  }
};


/**
 * @param {goog.events.BrowserEvent} ev
 * @private
 */
ydn.social.ui.Bar.prototype.onButtonClicked_ = function(ev) {

};
