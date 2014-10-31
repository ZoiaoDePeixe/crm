/**
 * @fileoverview User setting used in backend and front end.
 */


goog.provide('ydn.crm.UserSetting');
goog.require('ydn.crm.tracking');
goog.require('ydn.db.Storage');
goog.require('ydn.gdata.Kind');



/**
 * User setting.
 * @param {string=} opt_user_id
 * @constructor
 * @struct
 */
ydn.crm.UserSetting = function(opt_user_id) {
  /**
   * @type {?string}
   * @private
   */
  this.user_id_ = opt_user_id || null;
  /**
   * @private
   * @type {ydn.db.Storage}
   */
  this.user_db_ = null;
  /**
   * @private
   * @type {ydn.db.Storage}
   */
  this.gdata_db_ = null;

  if (opt_user_id) {
    this.setup(opt_user_id);
  }
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.UserSetting.prototype.logger =
    goog.log.getLogger('ydn.crm.UserSetting');


/**
 * @const
 * @type {string}
 */
ydn.crm.UserSetting.STORE_GENERAL = 'general';


/**
 * @const
 * @type {string}
 */
ydn.crm.UserSetting.STORE_SUGAR = 'sugar';


/**
 * Schema.
 * @const
 * @type {DatabaseSchema}
 */
ydn.crm.UserSetting.schema = /** @type {DatabaseSchema} */ (/** @type {Object} */({
  stores: [{
    name: ydn.crm.UserSetting.STORE_GENERAL
  }, {
    name: ydn.crm.UserSetting.STORE_SUGAR
  }, ydn.db.base.entitySchema,
  ydn.crm.tracking.trackSchema,
  ydn.crm.tracking.accessSchema]
}));


/**
 * Schema for GData.
 * @const
 * @type {DatabaseSchema}
 */
ydn.crm.UserSetting.schema_gdata = /** @type {DatabaseSchema} */ (/** @type {Object} */({
  stores: [{
    name: ydn.gdata.Kind.M8_CONTACT,
    keyPath: 'id.$t',
    type: 'TEXT',
    indexes: [{
      name: 'updated.$t',
      type: 'TEXT'
    }, {
      name: 'ydn$emails',
      multiEntry: true,
      generator: function(obj) {
        var emails = [];
        var gd_emails = goog.isArray(obj['gd$email']) ? obj['gd$email'] :
            goog.isObject(obj['gd$email']) ? [obj['gd$email']] : [];
        for (var i = 0; i < gd_emails.length; i++) {
          var email = ydn.string.normalizeEmail(gd_emails[i]['address']);
          if (email) {
            emails.push(email);
          }
        }
        return emails;
      }
    }, {
      name: 'ydn$externalIds',
      multiEntry: true,
      generator: function(gdata) {
        var ids = goog.isArray(gdata.gContact$externalId) ?
            gdata.gContact$externalId : gdata.gContact$externalId ? [gdata.gContact$externalId] : [];
        return ids.map(function(x) {
          return x['value'];
        });
      }
    }
    ]
  }]
}));


/**
 * Setup user setting
 * @param {string} id user id.
 */
ydn.crm.UserSetting.prototype.setup = function(id) {
  if (this.user_id_ && this.user_id_ == id) {
    return;
  }
  goog.global.sessionStorage.setItem('last-user-id', id);
  var db_name = 'setting-' + id;
  var gdata_db_name = 'gdata-' + id;
  if (this.user_db_) {
    if (this.user_db_.getName() != db_name) {
      this.user_db_.close();
      this.user_db_ = null;
    }
  }
  if (this.gdata_db_) {
    if (this.gdata_db_.getName() != gdata_db_name) {
      this.gdata_db_.close();
      this.gdata_db_ = null;
    }
  }

  if (!this.user_db_) {
    this.user_db_ = new ydn.db.Storage(db_name, ydn.crm.UserSetting.schema);
  }
  if (!this.gdata_db_) {
    this.gdata_db_ = new ydn.db.Storage(gdata_db_name, ydn.crm.UserSetting.schema_gdata);
  }
};


/**
 * @return {!ydn.db.Storage}
 */
ydn.crm.UserSetting.prototype.getUserDb = function() {
  goog.asserts.assertObject(this.user_db_, 'user db not ready');
  return this.user_db_;
};


/**
 * @return {!ydn.db.Storage}
 */
ydn.crm.UserSetting.prototype.getGDataDb = function() {
  goog.asserts.assertObject(this.gdata_db_, 'user db not ready');
  return this.gdata_db_;
};


/**
 * @enum {string}
 */
ydn.crm.UserSetting.Key = {
  SUGAR_DOMAINS: 'sd'
};


/**
 *
 * @param {ydn.crm.UserSetting.Key} key
 * @return {string}
 */
ydn.crm.UserSetting.prototype.getUserKey = function(key) {
  if (!!this.user_id_) {
    return this.user_id_ + '-' + key;
  } else {
    return goog.global.sessionStorage.getItem('last-user-id') + '-' + key;
  }
};


/**
 * Get user local setting.
 * @param {ydn.crm.UserSetting.Key} key
 * @return {!goog.async.Deferred}
 */
ydn.crm.UserSetting.prototype.getLocalSetting = function(key) {
  var user_key = this.getUserKey(key);
  var df = new goog.async.Deferred();
  chrome.storage.local.get(user_key, function(val) {
    df.callback(val[user_key]);
  });
  return df;
};


/**
 * Set user setting.
 * @param {ydn.crm.UserSetting.Key} key
 * @param {*} val
 * @return {!goog.async.Deferred}
 */
ydn.crm.UserSetting.prototype.setLocalSetting = function(key, val) {
  var user_key = this.getUserKey(key);
  var df = new goog.async.Deferred();
  var obj = {};
  obj[user_key] = val;
  chrome.storage.local.set(obj, function() {
    df.callback(true);
  });
  return df;
};


/**
 * @type {ydn.crm.base.AppShortName}
 * @private
 */
ydn.crm.UserSetting.app_name_;


/**
 * App short_name as defined in manifest.
 * @return {ydn.crm.base.AppShortName}
 */
ydn.crm.UserSetting.getAppShortName = function() {
  if (!ydn.crm.UserSetting.app_name_) {
    var mani = chrome.runtime.getManifest();
    if (mani['short_name'] == ydn.crm.base.AppShortName.EMAIL_TRACKER) {
      ydn.crm.UserSetting.app_name_ = ydn.crm.base.AppShortName.EMAIL_TRACKER;
    } else if (mani['short_name'] == ydn.crm.base.AppShortName.EMAIL_TRACKER_GMAIL) {
      ydn.crm.UserSetting.app_name_ = ydn.crm.base.AppShortName.EMAIL_TRACKER_GMAIL;
    } else if (mani['short_name'] == ydn.crm.base.AppShortName.SUGARCRM) {
      ydn.crm.UserSetting.app_name_ = ydn.crm.base.AppShortName.SUGARCRM;
    } else {
      ydn.crm.UserSetting.app_name_ = ydn.crm.base.AppShortName.OTHERS;
    }
  }
  return ydn.crm.UserSetting.app_name_;
};


/**
 * @param {ydn.crm.base.Feature} feature
 * @return {boolean}
 */
ydn.crm.UserSetting.hasFeature = function(feature) {
  var features = [];
  var app_name = ydn.crm.UserSetting.getAppShortName();
  if (feature == ydn.crm.base.Feature.TRACKING) {
    return true;
  } else if (feature == ydn.crm.base.Feature.SUGARCRM) {
    return app_name == ydn.crm.base.AppShortName.SUGARCRM;
  } else if (feature == ydn.crm.base.Feature.GDATA_CONTACT) {
    return app_name == ydn.crm.base.AppShortName.SUGARCRM;
  }
  return false;
};



