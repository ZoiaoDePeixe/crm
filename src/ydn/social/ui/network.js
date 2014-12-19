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
 * @fileoverview Abstract social widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.Network');
goog.require('goog.ui.Component');



/**
 * Abstract social widget.
 * @param {ydn.social.Network} network
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.social.ui.Network = function(network, opt_dom) {
  goog.base(this, opt_dom);
  /**
   * @final
   * @type {ydn.social.Network}
   */
  this.network = network;
  /**
   * @protected
   * @type {?ydn.social.MetaContact}
   */
  this.target = null;
};
goog.inherits(ydn.social.ui.Network, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.social.ui.Network.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Network.CSS_CLASS_CONTAINER = 'tooltip-container';


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Network.CSS_CLASS_DETAIL = 'tooltip-detail';


/**
 * @param {ydn.social.MetaContact} obj
 * @final
 */
ydn.social.ui.Network.prototype.setTarget = function(obj) {
  this.target = obj;
  this.redraw();
};


/**
 * @protected
 */
ydn.social.ui.Network.prototype.redraw = goog.abstractMethod;


/**
 * @protected reset container element class to initial.
 */
ydn.social.ui.Network.prototype.resetContainerClass = function() {
  var el = this.getElement();
  el.className = ydn.social.ui.Network.CSS_CLASS_CONTAINER + ' ' + this.network;
};


/**
 * @override
 */
ydn.social.ui.Network.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var container = this.getElement();
  var btn = document.createElement('div');
  var details = document.createElement('div');
  this.resetContainerClass();
  btn.classList.add('tooltip-host');
  details.classList.add(ydn.social.ui.Network.CSS_CLASS_DETAIL);
  goog.style.setElementShown(details, false);
  var twitter = ydn.crm.ui.createSvgIcon(this.network);
  btn.classList.add(ydn.crm.ui.CSS_CLASS_SVG_BUTTON);
  btn.setAttribute('name', this.network);
  btn.appendChild(twitter);
  container.appendChild(btn);
  container.appendChild(details);
};


/**
 * Get container element.
 * @return {Element}
 */
ydn.social.ui.Network.prototype.getContainer = function() {
  return this.getElement();
};


/**
 * Get detail element.
 * @return {Element}
 */
ydn.social.ui.Network.prototype.getDetail = function() {
  return this.getContainer().querySelector('.' +
      ydn.social.ui.Network.CSS_CLASS_DETAIL);
};
