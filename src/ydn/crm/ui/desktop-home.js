/**
 * @fileoverview Home content page.
 */

goog.provide('ydn.crm.ui.DesktopHome');
goog.require('goog.ui.Component');
goog.require('ydn.crm.ui.IDesktopPage');



/**
 * Home content page.
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @implements {ydn.crm.ui.IDesktopPage}
 */
ydn.crm.ui.DesktopHome = function(dom) {
  goog.base(this, dom);

};
goog.inherits(ydn.crm.ui.DesktopHome, goog.ui.Component);


/**
 * @inheritDoc
 */
ydn.crm.ui.DesktopHome.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
};


/**
 * @inheritDoc
 */
ydn.crm.ui.DesktopHome.prototype.toString = function() {
  return ydn.crm.ui.PageName.DESKTOP_HOME;
};


/**
 * @override
 */
ydn.crm.ui.DesktopHome.prototype.onPageShow = function(obj) {

};
