/**
 * @fileoverview SugarCrm setting page.
 */

goog.provide('ydn.crm.su.ui.SettingPage');
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
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.refreshSync_ = function() {
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

};


/**
 * @param {?ydn.crm.su.model.GDataSugar} sugar
 */
ydn.crm.su.ui.SettingPage.prototype.setSugarCrm = function(sugar) {
  this.sugar_ = sugar;
};
