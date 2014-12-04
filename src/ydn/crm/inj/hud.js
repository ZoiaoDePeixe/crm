/**
 * @fileoverview Control HUB stick to right side.
 *
 */


goog.provide('ydn.crm.inj.Hud');
goog.require('goog.events');
goog.require('ydn.crm.AppSetting');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.msg.StatusBar');
goog.require('ydn.crm.ui');
goog.require('ydn.crm.ui.UserSetting');
goog.require('ydn.ui');



/**
 * Control HUB stick to right side of document.
 * @constructor
 * @struct
 */
ydn.crm.inj.Hud = function() {

  /**
   * @type {Element}
   * @private
   */
  this.root_el_ = null;
  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);

};


/**
 * @protected
 * @type {goog.log.Logger}
 */
ydn.crm.inj.Hud.prototype.logger = goog.log.getLogger('ydn.crm.inj.Hud');


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.Hud.CSS_CLASS_INVALID = 'invalid';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.Hud.CSS_CLASS_INVALID_LOGIN_PANEL = 'invalid-login-panel';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.Hud.CSS_CLASS_SETUP = 'setup-panel';


/**
 * @param {Event} e
 * @private
 */
ydn.crm.inj.Hud.prototype.onClick_ = function(e) {
  this.root_el_.classList.toggle('open');
  var arrow = this.root_el_.querySelector('.hud-button').children[1];
  if (this.root_el_.classList.contains('open')) {
    arrow.classList.remove('arrow-drop-left');
    arrow.classList.add('arrow-drop-right');
  } else {
    arrow.classList.add('arrow-drop-left');
    arrow.classList.remove('arrow-drop-right');
  }
};


/**
 * This will render side
 */
ydn.crm.inj.Hud.prototype.render = function() {

  var temp = ydn.ui.getTemplateById('hub-template').content;
  var div = document.createElement('div');
  div.appendChild(temp.cloneNode(true));

  this.root_el_ = div.firstElementChild;

  document.body.appendChild(this.root_el_);

  var a_option = this.root_el_.querySelector('a[name=option-page-url]');
  a_option.href = chrome.extension.getURL(ydn.crm.base.OPTION_PAGE);

  /*
  var has_widget = ydn.crm.AppSetting.hasFeature(ydn.crm.base.Feature.GDATA_CONTACT) ||
      ydn.crm.AppSetting.hasFeature(ydn.crm.base.Feature.SUGARCRM);
  goog.style.setElementShown(this.root_el_, has_widget);
  */

  var popup = this.root_el_.querySelector('.hud-popup');
  var btn = this.root_el_.querySelector('.hud-button');
  goog.events.listen(btn, 'click', this.onClick_, false, this);

  var logo = this.root_el_.querySelector('.logo-box');
  logo.appendChild(ydn.crm.ui.createSvgIcon('ydn-logo'));
  var arrow = this.root_el_.querySelector('.arrow-box');
  arrow.appendChild(ydn.crm.ui.createSvgIcon('arrow-drop-right'));

  var dom = goog.dom.getDomHelper();
  var root = this.root_el_;

  var header = this.root_el_.querySelector('.popup-header');
  var status_el = document.createElement('div');
  var status = new ydn.crm.msg.StatusBar();
  status.render(header);
  ydn.crm.msg.Manager.addConsumer(status);

  var link_panel = dom.createDom('div', ydn.crm.inj.Hud.CSS_CLASS_SETUP);
  var a = dom.createElement('a');
  a.textContent = 'Setup';

  if (ydn.crm.AppSetting.isEmailTracker()) {
    a.href = chrome.extension.getURL(ydn.crm.base.LOGIN_PAGE);
    a.setAttribute('data-window-height', '600');
    a.setAttribute('data-window-width', '600');
  } else {
    a.href = chrome.extension.getURL(ydn.crm.base.SETUP_PAGE) + '#modal';
    a.setAttribute('data-window-height', '600');
    a.setAttribute('data-window-width', '800');
  }
  a.className = 'maia-button blue';
  link_panel.appendChild(a);
  goog.style.setElementShown(link_panel, false);

  var invalid_login = dom.createDom('div', ydn.crm.inj.Hud.CSS_CLASS_INVALID_LOGIN_PANEL);
  goog.style.setElementShown(invalid_login, false);
  header.appendChild(link_panel);
  header.appendChild(invalid_login);


  var a_grant = header.querySelector('div.' +
      ydn.crm.inj.Hud.CSS_CLASS_SETUP + ' a');
  this.handler.listen(a_grant, 'click', ydn.ui.openPageAsDialog, true);

  var us = ydn.crm.ui.UserSetting.getInstance();

  this.handler.listen(us,
      [ydn.crm.ui.UserSetting.EventType.LOGOUT,
        ydn.crm.ui.UserSetting.EventType.LOGIN],
      this.handleUserLogin_);
};


/**
 * @param {goog.events.Event} e
 * @private
 */
ydn.crm.inj.Hud.prototype.handleUserLogin_ = function(e) {
  var us = /** @type {ydn.crm.ui.UserSetting} */ (ydn.crm.ui.UserSetting.getInstance());
  var header = this.root_el_.querySelector('.popup-header');

  var setup = header.querySelector('.' + ydn.crm.inj.Hud.CSS_CLASS_SETUP);
  var invalid_login_panel = header.querySelector('.' +
      ydn.crm.inj.Hud.CSS_CLASS_INVALID_LOGIN_PANEL);

  goog.log.fine(this.logger, 'handling user login');

  if (us.isLogin()) {
    goog.style.setElementShown(setup, false);
    if (!us.hasValidLogin()) {
      var data = {
        ydn_login: us.getLoginEmail()
      };
      goog.soy.renderElement(invalid_login_panel, templ.ydn.crm.inj.wrongLogin, data);
      goog.style.setElementShown(invalid_login_panel, true);
    } else {
      goog.style.setElementShown(invalid_login_panel, false);
    }
  } else {
    goog.style.setElementShown(setup, true);
    goog.style.setElementShown(invalid_login_panel, false);

  }
};


/**
 * Add UI component.
 * @param {goog.ui.Component} panel
 */
ydn.crm.inj.Hud.prototype.addPanel = function(panel) {
  var popup_content = this.root_el_.querySelector('.popup-content');
  panel.render(popup_content);
};




