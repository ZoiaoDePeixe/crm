/**
 * @fileoverview SugarCRM home content page.
 */

goog.provide('ydn.crm.su.ui.DesktopHome');
goog.require('goog.ui.Component');



/**
 * SugarCRM home content page.
 * @param {ydn.crm.su.model.Sugar} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 */
ydn.crm.su.ui.DesktopHome = function(model, opt_dom) {
  goog.base(this, opt_dom);
  this.setModel(model);
};
goog.inherits(ydn.crm.su.ui.DesktopHome, goog.ui.Component);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.su.ui.DesktopHome.DEBUG = false;


/**
 * @return {ydn.crm.su.model.Sugar}
 * @override
 */
ydn.crm.su.ui.DesktopHome.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.su.ui.DesktopHome.NAME = 'SugarCRM home';


/**
 * @inheritDoc
 */
ydn.crm.su.ui.DesktopHome.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  root.textContent = 'SugarCRM Desktop home';
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
