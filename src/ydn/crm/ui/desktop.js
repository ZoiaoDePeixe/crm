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
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 */
ydn.crm.ui.Desktop = function(dom) {
  goog.base(this, dom);

  /**
   * @type {goog.ui.Toolbar}
   * @private
   */
  this.toolbar_ = new goog.ui.Toolbar(dom);
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

  var home = new ydn.crm.ui.DesktopHome();
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



ydn.crm.ui.Desktop.prototype.getHomePage = function() {
  return this.getPage('Home');
};
