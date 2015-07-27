// Copyright 2015 YDN Authors. All Rights Reserved.
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
 * @fileoverview SugarCRM home content page.
 */

goog.provide('ydn.crm.su.ui.DesktopHome');
goog.require('goog.log');
goog.require('goog.ui.Component');
goog.require('ydn.crm.su.model.Sugar');
goog.require('ydn.crm.su.ui');
goog.require('ydn.crm.su.ui.Header');
goog.require('ydn.crm.su.ui.RecordTile');



/**
 * SugarCRM home content page.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 */
ydn.crm.su.ui.DesktopHome = function(opt_dom) {
  goog.base(this, opt_dom);
};
goog.inherits(ydn.crm.su.ui.DesktopHome, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.su.ui.DesktopHome.DEBUG = false;


/**
 * @protected
 * @type {goog.log.Logger}
 */
ydn.crm.su.ui.DesktopHome.prototype.logger =
    goog.log.getLogger('ydn.crm.su.ui.DesktopHome');


/**
 * @const
 * @type {string}
 */
ydn.crm.su.ui.DesktopHome.CSS_CLASS = 'sugarcrm-desktop';


/**
 * @const
 * @type {string}
 */
ydn.crm.su.ui.DesktopHome.NAME = 'SugarCRM home';


/**
 * @inheritDoc
 */
ydn.crm.su.ui.DesktopHome.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_CONTENT);
};


/**
 * @return {Element}
 */
ydn.crm.su.ui.DesktopHome.prototype.getHeaderElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_HEAD);
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.DesktopHome.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  root.classList.add(ydn.crm.su.ui.DesktopHome.CSS_CLASS);
  root.classList.add('sugar-panel');
  var header = dom.createDom('div', ydn.crm.ui.CSS_CLASS_HEAD);
  var content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);
  root.appendChild(header);
  root.appendChild(content);

  // render header

  var no_sugar_login = dom.createDom('div',
      ydn.crm.su.ui.CSS_CLASS_NO_SUGAR_PANEL);
  var a = dom.createElement('a');
  a.textContent = chrome.i18n.getMessage('Setup_SugarCRM');
  a.href = chrome.extension.getURL(ydn.crm.base.SETUP_PAGE) + '#modal';
  a.className = ydn.crm.su.ui.CSS_CLASS_SUGAR_SETUP_LINK + ' maia-button blue';
  a.setAttribute('data-window-height', '600');
  a.setAttribute('data-window-width', '800');
  no_sugar_login.appendChild(a);
  goog.style.setElementShown(no_sugar_login, false);

  header.appendChild(no_sugar_login);
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.DesktopHome.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.DesktopHome.prototype.toString = function() {
  return ydn.crm.su.ui.DesktopHome.NAME;
};


/**
 * Set SugarCRM.
 * @param {SugarCrm.Details?} details
 * @return {ydn.crm.su.model.Sugar} the model used.
 */
ydn.crm.su.ui.DesktopHome.prototype.setSugarCrm = function(details) {
  var no_sugar = this.getHeaderElement().querySelector('.' +
      ydn.crm.su.ui.CSS_CLASS_NO_SUGAR_PANEL);
  var panel = this.getSugarCrmPanel();
  var about = details ? details.about : null;
  if (!about) {
    goog.style.setElementShown(no_sugar, true);
    if (panel) {
      goog.style.setElementShown(panel.getElement(), false);
    }
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(ydn.crm.ui.EventType.DRAWER_REQUEST, true, true, {'open': true});
    no_sugar.dispatchEvent(evt);
    return null;
  }
  goog.style.setElementShown(no_sugar, false);

  var header = this.getHeaderPanel();
  if (panel) {
    var model = panel.getModel();
    if (model.getDomain() == about.domain) {
      goog.log.finer(this.logger, 'sugar panel ' + model.getDomain() + ' already exists.');
      return model;
    }
    goog.log.fine(this.logger, 'disposing sugar panel ' + model.getDomain());
    this.removeChild(panel, true);
    this.removeChild(header, true);
    model.dispose();
    header.dispose();
    panel.dispose();
  }

  var us = ydn.crm.ui.UserSetting.getInstance();

  var sugar = new ydn.crm.su.model.Sugar(details.about,
      details.modulesInfo, details.serverInfo);
  header = new ydn.crm.su.ui.Header(sugar, this.dom_);
  panel = new ydn.crm.su.ui.DesktopHome.Content(sugar, this.dom_);
  goog.log.fine(this.logger, 'sugar panel ' + about.domain + ' added.');
  this.addChild(header, true);
  this.addChild(panel, true);

  return sugar;
};


/**
 * @param {boolean} val
 */
ydn.crm.su.ui.DesktopHome.prototype.setVisible = function(val) {
  goog.style.setElementShown(this.getElement(), val);
};


/**
 * Show record.
 * @param {ydn.crm.su.ModuleName} m_name
 * @param {string} id
 */
ydn.crm.su.ui.DesktopHome.prototype.showRecord = function(m_name, id) {

};


/**
 * @return {ydn.crm.su.ui.DesktopHome.Content?}
 * @protected
 */
ydn.crm.su.ui.DesktopHome.prototype.getSugarCrmPanel = function() {
  return /** @type {ydn.crm.su.ui.DesktopHome.Content} */ (this.getChildAt(1)) || null;
};


/**
 * @return {ydn.crm.su.ui.Header?}
 * @protected
 */
ydn.crm.su.ui.DesktopHome.prototype.getHeaderPanel = function() {
  return /** @type {ydn.crm.su.ui.Header} */ (this.getChildAt(0)) || null;
};



/**
 * SugarCRM Home page content.
 * @param {!ydn.crm.su.model.Sugar} sugar
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @extends {goog.ui.Component}
 */
ydn.crm.su.ui.DesktopHome.Content = function(sugar, opt_dom) {
  goog.base(this, opt_dom);
  this.setModel(sugar);
};
goog.inherits(ydn.crm.su.ui.DesktopHome.Content, goog.ui.Component);


/**
 * @return {ydn.crm.su.model.Sugar}
 * @override
 */
ydn.crm.su.ui.DesktopHome.Content.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.su.ui.DesktopHome.Content.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  /**
   * @type {ydn.crm.su.model.Sugar}
   */
  var model = this.getModel();
  var modules = model.listModules();
  for (var i = 0; i < modules.length; i++) {
    var child = new ydn.crm.su.ui.RecordTile(model, modules[i], dom);
    this.addChild(child, true);
  }
};

