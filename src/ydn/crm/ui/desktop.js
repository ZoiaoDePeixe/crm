/**
 * @fileoverview Home screen desktop
 */


goog.provide('ydn.crm.ui.Desktop');
goog.require('goog.ui.Button');
goog.require('goog.ui.Toolbar');
goog.require('ydn.crm.ui');
goog.require('ydn.crm.ui.DesktopHome');



/**
 * Home screen desktop responsible for icons layout and routing.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 */
ydn.crm.ui.Desktop = function(opt_dom) {
  goog.base(this, opt_dom);

  /**
   * @type {goog.ui.Toolbar}
   * @private
   */
  this.toolbar_ = new goog.ui.Toolbar(opt_dom);
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
  goog.base(this, 'createDom');
  var dom = this.dom_;
  var root = this.getElement();
  goog.dom.classlist.add(root, ydn.crm.ui.Desktop.CSS_CLASS);
  var content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);
  var footer = dom.createDom('div', ydn.crm.ui.CSS_CLASS_FOOTER);
  root.appendChild(content);
  root.appendChild(footer);

  var home_btn = new goog.ui.Button('Home', null, dom);
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
  goog.base(this, 'enterDocument');
  var root = this.getElement();
  // Listen events
  var hd = this.getHandler();
  ydn.crm.ui.fixHeightForScrollbar(root);
  this.showPage(ydn.crm.ui.DesktopHome.NAME);
};


/**
 * Show child page. Only one page are shown at a time.
 * @param {string} name child name as query by  `getName`.
 */
ydn.crm.ui.Desktop.prototype.showPage = function(name) {
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
  return /** @type {ydn.crm.ui.DesktopHome} */(this.getPage(ydn.crm.ui.DesktopHome.NAME));
};
