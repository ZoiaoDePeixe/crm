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
 * @fileoverview Home screen desktop
 *
 * All pages added to desktop must implement {@link ydn.crm.ui.IDesktopPage}
 * interface.
 */


goog.provide('ydn.crm.ui.Desktop');
goog.require('goog.ui.Button');
goog.require('goog.ui.Toolbar');
goog.require('ydn.crm.ui');
goog.require('ydn.crm.ui.DesktopHome');
goog.require('ydn.crm.ui.IDesktopPage');
goog.require('ydn.crm.ui.events');



/**
 * Home screen desktop responsible for icons layout and routing.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 */
ydn.crm.ui.Desktop = function(opt_dom) {
  ydn.crm.ui.Desktop.base(this, 'constructor', opt_dom);

  /**
   * @type {goog.ui.Toolbar}
   * @private
   */
  this.toolbar_ = new goog.ui.Toolbar();
};
goog.inherits(ydn.crm.ui.Desktop, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.Desktop.DEBUG = true;


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.Desktop.CSS_CLASS = 'desktop';


/**
 * @inheritDoc
 */
ydn.crm.ui.Desktop.prototype.createDom = function() {
  ydn.crm.ui.Desktop.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  goog.dom.classlist.add(root, ydn.crm.ui.Desktop.CSS_CLASS);
  var content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);
  var footer = dom.createDom('div', ydn.crm.ui.CSS_CLASS_FOOTER);
  root.appendChild(content);
  root.appendChild(footer);

  var home_btn = new goog.ui.Button('Home', null, dom);
  home_btn.setId('desktop-home');
  this.toolbar_.addChild(home_btn, true);
  this.toolbar_.render(footer);

  var home = new ydn.crm.ui.DesktopHome(dom);
  this.addChild(home, true);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.Desktop.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_CONTENT);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.Desktop.prototype.enterDocument = function() {
  ydn.crm.ui.Desktop.base(this, 'enterDocument');
  var root = this.getElement();
  // Listen events
  var hd = this.getHandler();
  hd.listen(this, ydn.crm.ui.events.EventType.SHOW_PANEL, this.onShowPage_);
  hd.listen(this.toolbar_, goog.ui.Component.EventType.ACTION, this.onAction_);
  ydn.crm.ui.fixHeightForScrollbar(root);
  this.showPage(ydn.crm.ui.PageName.DESKTOP_HOME);
};


ydn.crm.ui.Desktop.prototype.onAction_ = function(ev) {
  if (ev.target instanceof goog.ui.Button) {
    var btn = /** @type {goog.ui.Button} */(ev.target);
    var id = btn.getId();
    if (id == 'desktop-home') {
      var se = new ydn.crm.ui.events.ShowPanelEvent(
          ydn.crm.ui.PageName.DESKTOP_HOME, {}, this);
      this.dispatchEvent(se);
    }
  }
};


/**
 * @param {ydn.crm.ui.events.ShowPanelEvent} ev
 * @private
 */
ydn.crm.ui.Desktop.prototype.onShowPage_ = function(ev) {
  if (ydn.crm.ui.Desktop.DEBUG) {
    window.console.log('show page: ' + ev.name, ev.data);
  }
  this.showPage(ev.name, ev.data);
};


/**
 * Show child page. Only one page are shown at a time.
 * @param {string} name child name as query by  `getName`.
 * @param {*=} data optional payload.
 */
ydn.crm.ui.Desktop.prototype.showPage = function(name, data) {
  var idx = -1;
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = this.getChildAt(i);
    if (child.toString() == name) {
      idx = i;
      break;
    }
  }
  if (idx >= 0) {
    for (var i = 0; i < this.getChildCount(); i++) {
      var child = this.getChildAt(i);
      var page = /** @type {ydn.crm.ui.IDesktopPage} */(child);
      page.onPageShow(data);
      goog.style.setElementShown(child.getElement(), i == idx);
    }
  }
};


/**
 * @override
 */
ydn.crm.ui.Desktop.prototype.addChild = function(child, opt_render) {
  ydn.crm.ui.Desktop.base(this, 'addChild', child, opt_render);
  var el = child.getElement();
  if (el) {
    goog.style.setElementShown(el, false);
  }
};


/**
 * @param {string} name
 * @return {goog.ui.Component}
 */
ydn.crm.ui.Desktop.prototype.getPage = function(name) {
  for (var i = 0; i < this.getChildCount(); i++) {
    var child = this.getChildAt(i);
    if (child.toString() == name) {
      return child;
    }
  }
  return null;
};


/**
 * @return {ydn.crm.ui.DesktopHome}
 */
ydn.crm.ui.Desktop.prototype.getHomePage = function() {
  return /** @type {ydn.crm.ui.DesktopHome} */(
      this.getPage(ydn.crm.ui.PageName.DESKTOP_HOME));
};
