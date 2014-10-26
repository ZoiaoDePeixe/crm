/**
 * @fileoverview Control HUB stick to right side.
 *
 */


goog.provide('ydn.crm.inj.Hud');
goog.require('goog.ui.Popup');
goog.require('templ.ydn.crm.inj');



/**
 * Control HUB stick to right side of document.
 * @constructor
 * @struct
 */
ydn.crm.inj.Hud = function() {

  var temp = ydn.ui.getTemplateById('hub-template').content;
  var div = document.createElement('div');
  div.appendChild(temp.cloneNode(true));
  /**
   * @type {Element}
   * @private
   * @final
   */
  this.root_el_ = div.firstElementChild;
  var a = this.root_el_.querySelector('a[name=option-page-url]');
  a.href = chrome.extension.getURL(ydn.crm.base.OPTION_PAGE);

  var has_widget = ydn.crm.ui.UserSetting.hasFeature(ydn.crm.base.Feature.GDATA_CONTACT) ||
      ydn.crm.ui.UserSetting.hasFeature(ydn.crm.base.Feature.SUGARCRM);
  goog.style.setElementShown(this.root_el_, has_widget);

};


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.Hud.CSS_CLASS_INVALID = 'invalid';


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
  document.body.appendChild(this.root_el_);
  var popup = this.root_el_.querySelector('.hud-popup');
  var btn = this.root_el_.querySelector('.hud-button');
  goog.events.listen(btn, 'click', this.onClick_, false, this);

  var logo = this.root_el_.querySelector('.logo-box');
  logo.appendChild(ydn.crm.ui.createSvgIcon('ydn-logo'));
  var arrow = this.root_el_.querySelector('.arrow-box');
  arrow.appendChild(ydn.crm.ui.createSvgIcon('arrow-drop-right'));
};


/**
 * Add UI component.
 * @param {goog.ui.Component} panel
 */
ydn.crm.inj.Hud.prototype.addPanel = function(panel) {
  var popup_content = this.root_el_.querySelector('.popup-content');
  panel.render(popup_content);
};


/**
 * Update header UI.
 */
ydn.crm.inj.Hud.prototype.updateHeader = function() {
  var us = /** @type {ydn.crm.ui.UserSetting} */ (ydn.crm.ui.UserSetting.getInstance());
  if (us.isLogin() && !us.hasValidLogin()) {
    this.root_el_.classList.add(ydn.crm.inj.Hud.CSS_CLASS_INVALID);
  } else {
    this.root_el_.classList.remove(ydn.crm.inj.Hud.CSS_CLASS_INVALID);
  }
};


