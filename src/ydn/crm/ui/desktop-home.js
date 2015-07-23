/**
 * @fileoverview Home content page.
 */

goog.provide('ydn.crm.ui.DesktopHome');
goog.require('goog.ui.Component');



/**
 * Home content page.
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
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
  root.textContent = 'Desktop home';
};


/**
 * @inheritDoc
 */
ydn.crm.ui.DesktopHome.prototype.toString = function() {
  return 'Home';
};
