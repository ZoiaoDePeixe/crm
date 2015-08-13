/**
 * @fileoverview SugarCrm setting page.
 */

goog.provide('ydn.crm.su.ui.SettingPage');
goog.require('goog.ui.Component');
goog.require('ydn.crm.base');
goog.require('ydn.crm.templ');
goog.require('ydn.crm.ui.IDesktopPage');
goog.require('ydn.msg');



/**
 * Home content page.
 * @param {goog.dom.DomHelper} dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @implements {ydn.crm.ui.IDesktopPage}
 */
ydn.crm.su.ui.SettingPage = function(dom) {
  ydn.crm.su.ui.SettingPage.base(this, 'constructor', dom);
  /**
   * @type {ydn.crm.su.model.GDataSugar}
   * @private
   */
  this.sugar_ = null;
};
goog.inherits(ydn.crm.su.ui.SettingPage, goog.ui.Component);


/**
 * @inheritDoc
 */
ydn.crm.su.ui.SettingPage.prototype.createDom = function() {
  ydn.crm.su.ui.SettingPage.base(this, 'createDom');
  var root = this.getElement();
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.SettingPage.prototype.toString = function() {
  return ydn.crm.ui.PageName.SETTING_PAGE;
};


/**
 * Render list of contact groups.
 * @param {Array<GroupEntry>} arr
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.renderGroups_ = function(arr) {
  console.log(arr);

};


/**
 * Render list of contact groups.
 * @param {YdnCrm.UserSettingGDataM8} obj
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.renderSync_ = function(obj) {
  console.log(obj);
  var div = this.getElement().querySelector('.sync-setting-panel');
  if (!div) {
    div = document.createElement('div');
    div.className = 'sync-setting-panel';
    this.getElement().appendChild(div);
  }
  div.innerHTML = ydn.crm.templ.renderSugarCrmSetting();

};


/**
 * @type {YdnCrm.UserSettingGDataM8}
 */
ydn.crm.su.ui.SettingPage.DEFAULT = /** @type {YdnCrm.UserSettingGDataM8} */({});


/**
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.refreshSync_ = function() {
  var root = this.getElement();
  var q = {'key': ydn.crm.base.KeyRecordOnServer.USER_SETTING_GDATA_CONTACT};
  var df = ydn.msg.getChannel().send(ydn.crm.ch.Req.USER_SETTING_SERVER_GET, q);
  df.addCallback(function(obj) {
    this.renderSync_(obj || ydn.crm.su.ui.SettingPage.DEFAULT);
  }, this);
};


/**
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.refreshGroups_ = function() {
  var root = this.getElement();
  var df = ydn.msg.getChannel().send(ydn.crm.ch.Req.GDATA_LIST_GROUP);
  df.addCallback(function(arr) {
    this.renderGroups_(arr);
  }, this);
};


/**
 * @override
 */
ydn.crm.su.ui.SettingPage.prototype.onPageShow = function(obj) {
  this.refreshSync_();
};


/**
 * @param {?ydn.crm.su.model.GDataSugar} sugar
 */
ydn.crm.su.ui.SettingPage.prototype.setSugarCrm = function(sugar) {
  this.sugar_ = sugar;
};
