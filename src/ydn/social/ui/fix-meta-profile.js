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
 * @fileoverview Generic social widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.FixMetaProfile');
goog.require('ydn.crm.ui');
goog.require('ydn.social.ui.MetaProfile');



/**
 * Generic social widget. If model is not set, the component will not be
 * displayed.
 * <pre>
 *   var net = new ydn.social.ui.FixMetaProfile();
 *   net.setModel(mp);
 * </pre>
 * @param {ydn.social.Network} network
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {ydn.social.ui.MetaProfile}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.social.ui.FixMetaProfile = function(network, opt_dom) {
  goog.base(this, opt_dom);
  /**
   * @type {ydn.social.Network}
   */
  this.network = network;
};
goog.inherits(ydn.social.ui.FixMetaProfile, ydn.social.ui.MetaProfile);


/**
 * @inheritDoc
 */
ydn.social.ui.FixMetaProfile.prototype.createDom = function() {
  goog.base(this, 'createDom');
  this.renderButton(this.network);
  goog.style.setElementShown(this.getElement(), true);
};


/**
 * @override
 */
ydn.social.ui.FixMetaProfile.prototype.setModel = function(model) {
  if (model) {
    var m = /** @type {ydn.social.MetaProfile} */(model);
    if (m.getNetworkName() != this.network) {
      throw new Error('X ' + this.network + ' to ' + m.getNetworkName());
    }
  }
  goog.base(this, 'setModel', model);
};

