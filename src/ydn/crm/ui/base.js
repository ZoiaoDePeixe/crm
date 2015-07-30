/**
 * @fileoverview About this file
 */


goog.provide('ydn.crm.ui');
goog.require('goog.soy.Renderer');
goog.require('ydn.crm.base');


/**
 * @const
 * @type {string} root class name for all UI.
 */
ydn.crm.ui.CSS_CLASS = 'ydn-crm';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_EMPTY = 'empty';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_ACTIVE = 'active';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_ERROR = 'error';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_TOOLBAR = 'toolbar';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_HEAD = 'head';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_TITLE = 'title';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_GMAIL_OFFLINE = 'gmail-offline';


/**
 * @const
 * @type {string} icon with rounded border.
 */
ydn.crm.ui.CSS_CLASS_SVG_BUTTON = 'svg-button';


/**
 * @enum {string} DOM custom event type used in this app.
 */
ydn.crm.ui.EventType = {
  DRAWER_REQUEST: 'drawer-request'
};


/**
 * @const
 * @type {string} icon with rounded border.
 */
ydn.crm.ui.CSS_CLASS_BADGE_ICON = 'badge-icon';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_OK_BUTTON = 'ok-button';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_MORE_MENU = 'more-menu';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_FLEX_BAR = 'flex-bar';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_CONTENT = 'content';


/**
 * @const
 * @type {string} error class
 */
ydn.crm.ui.CSS_CLASS_FOOTER = 'footer';


/**
 * @const
 * @type {string} CSS class name for editing record.
 */
ydn.crm.ui.CSS_CLASS_EDIT = 'edit';


/**
 * @const
 * @type {string} CSS class name for viewing record.
 */
ydn.crm.ui.CSS_CLASS_VIEW = 'view';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.CSS_CLASS_NORMALLY_HIDE = 'normally-hide';


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.CSS_CLASS_SIDEBAR_STATUS = 'sidebar-status';


/**
 * Convert JSON to Element.
 * @param {Object} json
 * @return {Element}
 */
ydn.crm.ui.json2element = function(json) {
  if (!json || ['DIV', 'SPAN', 'A', 'BUTTON'].indexOf(json.tagName) == -1) {
    window.console.log(json.tagName);
    return null;
  }
  var ele = document.createElement(json.tagName);
  var attrs = ['className', 'href', 'name', 'textContent', 'target'];
  for (var i = 0; i < attrs.length; i++) {
    if (json[attrs[i]]) {
      ele[attrs[i]] = json[attrs[i]];
    }
  }
  var n = json['children'] ? json['children'].length : 0;
  for (var i = 0; i < n; i++) {
    var child = ydn.crm.ui.json2element(json.children[i]);
    if (child) {
      ele.appendChild(child);
    }
  }
  return ele;
};


/**
 * @type {goog.soy.Renderer}
 * @private
 */
ydn.crm.ui.soy_renderer_ = null;


/**
 * @return {goog.soy.Renderer}
 */
ydn.crm.ui.getSoyRenderer = function() {
  if (!ydn.crm.ui.soy_renderer_) {
    ydn.crm.ui.soy_renderer_ = new goog.soy.Renderer();
  }
  return ydn.crm.ui.soy_renderer_;
};


/**
 * @type {Document}
 * @private
 */
ydn.crm.ui.svg_doc_ = null;


/**
 * Get svg doc.
 * @param {Function=} opt_cb callback after loading asynchronously. If not
 * provided, document is loaded synchroniously.
 * @return {Document} available only for synchronously.
 * @private
 */
ydn.crm.ui.getSvgDoc_ = function(opt_cb) {
  if (!ydn.crm.ui.svg_doc_) {
    var url = chrome.extension.getURL(ydn.crm.base.SVG_PAGE);
    ydn.crm.ui.setSvgDoc(url, opt_cb);
  }
  return ydn.crm.ui.svg_doc_;
};


/**
 * Set doc url and load document.
 * @param {string} url
 * @param {Function=} opt_cb callback after loading asynchronously. If not
 * provided, document is loaded synchroniously.
 */
ydn.crm.ui.setSvgDoc = function(url, opt_cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, !!opt_cb);
  xhr.onload = function() {
    ydn.crm.ui.svg_doc_ = xhr.responseXML;
    xhr = null;
    if (opt_cb) {
      opt_cb();
    }
  };
  xhr.send();
};


/**
 * Create SVG element for icon.
 * @param {string} name icon name in the svg sprite file.
 * @param {string=} opt_cls icon class, default to 'icons'. 'icons-small' use
 * 14px x 14px sized icon. If `null` no class will be added.
 * @return {Element}
 */
ydn.crm.ui.createSvgIcon = function(name, opt_cls) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  var svg_doc = ydn.crm.ui.getSvgDoc_();
  var symbol = svg_doc.getElementById(name);
  if (symbol) {
    svg.setAttribute('viewBox', symbol.getAttribute('viewBox'));
    svg.innerHTML = symbol.innerHTML;
  }
  if (arguments.length < 2) {
    svg.classList.add('icons');
  } else if (goog.isString(opt_cls)) {
    svg.classList.add(opt_cls);
  }
  // NOTE: work around https://crbug.com/370136
  // svg.style.pointerEvents = 'none';
  return svg;
};


/**
 * Create SVG element for icon.
 * Using svg by symbol is not supported in gmail content script.
 * @param {string} fileName either 'open-iconic' or 'paper-icons'
 * @param {string} name icon name in the svg sprite file.
 * @return {Element}
 */
ydn.crm.ui.createSvgIconBySymbol = function(fileName, name) {
  var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  var href = chrome.extension.getURL('/image/' + fileName + '.svg#' + name);
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', href);
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add(fileName + '-icon');
  svg.classList.add('icons');
  // NOTE: work around https://crbug.com/370136
  svg.style.pointerEvents = 'none';
  svg.appendChild(use);
  return svg;
};


/**
 * FIXME: for scrolling to work.
 * @param {number=} opt_gap additional space reduction.
 */
ydn.crm.ui.getPopupContentHeight = function(opt_gap) {
  var gap = opt_gap || 0;
  var base_el = document.querySelector('.popup-content');
  if (base_el) {
    var max_height = base_el.style.maxHeight;
    var gp = max_height.match(/100vh - (\d+)px/);
    if (gp) {
      var h = parseInt(gp[1], 10);
      return 'calc(100vh - ' + (h + 130 + gap) + 'px)';
    }
  }
  return NaN;
};


/**
 * FIXME: for scrolling to work.
 * @param {Element} el target scroll element.
 * @param {number=} opt_gap additional space reduction.
 */
ydn.crm.ui.fixHeightForScrollbar = function(el, opt_gap) {
  var h = ydn.crm.ui.getPopupContentHeight(opt_gap);
  if (h) {
    el.style.overflowY = 'auto';
    el.style.maxHeight = h;
  }
};


/**
 * @enum {string} page name.
 */
ydn.crm.ui.PageName = {
  DESKTOP_HOME: 'DesktopHome',
  DESKTOP_SEARCH: 'DesktopSearch',
  NEW_RECORD: 'NewRecord',
  RECORD_VIEW: 'RecordPage',
  TRACKING_PAGE: 'TrackingPage',
  SUGAR_SEARCH: 'SugarSearch',
  MODULE_HOME: 'ModuleHome'
};

