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
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @implements {ydn.crm.ui.IDesktopPage}
 */
ydn.crm.su.ui.SettingPage = function(opt_dom) {
  ydn.crm.su.ui.SettingPage.base(this, 'constructor', opt_dom);
  /**
   * @type {ydn.crm.su.model.GDataSugar}
   * @private
   */
  this.sugar_ = null;

  /**
   * @type {YdnCrm.UserSettingContactSync}
   * @private
   */
  this.setting_ = ydn.crm.su.ui.SettingPage.DEFAULT;
};
goog.inherits(ydn.crm.su.ui.SettingPage, goog.ui.Component);


/**
 * @inheritDoc
 */
ydn.crm.su.ui.SettingPage.prototype.createDom = function() {
  ydn.crm.su.ui.SettingPage.base(this, 'createDom');
  var root = this.getElement();
  root.classList.add('sugarcrm-setting-page');
  root.innerHTML = ydn.crm.templ.renderSugarCrmSetting();
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.SettingPage.prototype.enterDocument = function() {
  ydn.crm.su.ui.SettingPage.base(this, 'enterDocument');
  var hd = this.getHandler();
  var sync = this.getElement().querySelector('.' +
      ydn.crm.su.ui.SettingPage.CSS_SYNC);
  hd.listen(sync, 'click', this.onSyncClick_);
};


/**
 * @param {goog.events.Event} ev
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.onSyncClick_ = function(ev) {
  if (ev.target.tagName == 'SUMMARY') {
    var details = ev.target.parentElement;
    var is_open = !details.hasAttribute('open');
    var name = details.getAttribute('name');
    if (name == 'sync') {
      this.onSyncDetail_(is_open);
    }
  } else if (ev.target.tagName == 'BUTTON') {
    var name = ev.target.getAttribute('name');
    if (name == 'sync-reset') {
      this.onSyncRestore_();
    } else if (name == 'sync-save') {
      this.onSyncSave_();
    } else if (name == 'sync-cancel') {
      this.onSyncCancel_();
    }
  } else if (ev.target.tagName == 'INPUT') {
    var name = ev.target.getAttribute('name');
    if (name == 'sync-by-group') {
      this.refreshSyncByGroup_();
    }
  }
};


/**
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.enableSave_ = function() {
  var sync = this.getElement().querySelector('.' +
      ydn.crm.su.ui.SettingPage.CSS_SYNC);
  var btn_save = sync.querySelector('BUTTON[name=save]');
  btn_save.removeAttribute('disabled');
};


/**
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.refreshSyncByGroup_ = function() {
  var sync = this.getElement().querySelector('.' +
      ydn.crm.su.ui.SettingPage.CSS_SYNC);
  var select = sync.querySelector('SELECT');
  var chk_sync = sync.querySelector('INPUT[name=sync-by-group]');
  if (chk_sync.checked) {
    select.removeAttribute('disabled');
  } else {
    select.setAttribute('disabled', 'disabled');
  }
};


/**
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.onSyncRestore_ = function() {
  var sync = this.getElement().querySelector('.' +
      ydn.crm.su.ui.SettingPage.CSS_SYNC);
  var select = sync.querySelector('SELECT');
  select.selectedIndex = 0;
  var chk_sync = sync.querySelector('INPUT[name=sync-by-group]');
  goog.dom.forms.setValue(chk_sync,
      !!ydn.crm.su.ui.SettingPage.DEFAULT.syncByGroup);
  this.refreshSyncByGroup_();

};


/**
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.onSyncSave_ = function() {
  var sync = this.getElement().querySelector('.' +
      ydn.crm.su.ui.SettingPage.CSS_SYNC);
  var select = sync.querySelector('SELECT');
  var obj = /** @type {YdnCrm.UserSettingContactSync} */({});
  obj.syncGroupId = select.value;
  var chk_sync = sync.querySelector('INPUT[name=sync-by-group]');
  obj.syncByGroup = chk_sync.checked;

  this.setSync_(obj);
};


/**
 * Save sync setting.
 * @param {YdnCrm.UserSettingContactSync} obj
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.setSync_ = function(obj) {
  var q = {
    'key': ydn.crm.base.KeyRecordOnServer.USER_SETTING_CONTACT_SYNC,
    'value': obj
  };
  var df = ydn.msg.getChannel().send(ydn.crm.ch.Req.USER_SETTING_SERVER_SET, q);
  df.addCallback(function(obj) {
    this.refreshSync_();
  }, this);
};


/**
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.onSyncCancel_ = function() {

};


/**
 * @param {boolean} is_open
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.onSyncDetail_ = function(is_open) {
  if (is_open) {
    this.refreshGroups_();
  }
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

  var sync = this.getElement().querySelector('.' +
      ydn.crm.su.ui.SettingPage.CSS_SYNC);
  var select = sync.querySelector('SELECT');
  select.innerHTML = '';
  for (var i = 0; i < arr.length; i++) {
    var option = document.createElement('OPTION');
    var title = arr[i].title.$t.replace('System Group: ', '');
    option.textContent = title;
    option.value = arr[i].id.$t;
    select.appendChild(option);
  }


  if (this.setting_.syncByGroup) {
    var chk_sync = sync.querySelector('INPUT[name=sync-by-group]');
    goog.dom.forms.setValue(chk_sync, true);
  } else {
    select.setAttribute('disabled', 'disabled');
  }
  if (this.setting_.syncGroupId) {
    var sel = sync.querySelector('SELECT[name=sync-group]');
    goog.dom.forms.setValue(sel, this.setting_.syncGroupId);
  }
};


ydn.crm.su.ui.SettingPage.CSS_SYNC = 'sync-setting-panel';


/**
 * Render list of contact groups.
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.renderSync_ = function() {
  var sync = this.getElement().querySelector('.' +
      ydn.crm.su.ui.SettingPage.CSS_SYNC);
  sync.innerHTML = ydn.crm.templ.renderSugarCrmSettingSync();

};


/**
 * @type {YdnCrm.UserSettingContactSync}
 */
ydn.crm.su.ui.SettingPage.DEFAULT = /** @type {YdnCrm.UserSettingContactSync} */({});


/**
 * @private
 */
ydn.crm.su.ui.SettingPage.prototype.refreshSync_ = function() {
  var root = this.getElement();
  var q = {'key': ydn.crm.base.KeyRecordOnServer.USER_SETTING_CONTACT_SYNC};
  var df = ydn.msg.getChannel().send(ydn.crm.ch.Req.USER_SETTING_SERVER_GET, q);
  df.addCallback(function(obj) {
    this.setting_ = obj || ydn.crm.su.ui.SettingPage.DEFAULT;
    this.renderSync_();
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
ydn.crm.su.ui.SettingPage.prototype.setSugar = function(sugar) {
  this.sugar_ = sugar;
};
