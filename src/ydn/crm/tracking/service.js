/**
 * @fileoverview Tracking data service.
 */


goog.provide('ydn.crm.tracking.Service');
goog.require('goog.crypt');
goog.require('goog.crypt.Md5');
goog.require('ydn.client.Client');
goog.require('ydn.db.crud.Storage');
goog.require('ydn.db.sync.Entity');



/**
 * Tracking data service.
 * Usage:
 * <pre>
 *   var schema = {
 *     stores: [ydn.db.sync.Entity.schema,
 *       ydn.crm.tracking.Service.trackSchema,
 *       ydn.crm.tracking.Service.accessSchema
 *     ]
 *   };
 *   var db = new ydn.db.Storage('tracking-app', schema);
 *   var service = new ydn.crm.tracking.Service(ydn.client.getClient(), db);
 *   var track_entity = this.db.entity(service, ydn.crm.tracking.Service.SN_BEACON);
 *   var access_entity = this.db.entity(service, ydn.crm.tracking.Service.SN_ACCESS);
 * </pre>
 * @param {ydn.client.Client} client
 * @param {ydn.db.crud.Storage} db
 * @constructor
 * @struct
 * @implements {ydn.db.sync.IService}
 */
ydn.crm.tracking.Service = function(client, db) {
  /**
   * @final
   * @type {ydn.client.Client}
   * @private
   */
  this.client_ = client;
  /**
   * @final
   * @type {ydn.db.Storage}
   * @private
   */
  this.db_ = db;

  /**
   * @type {string}
   * @private
   */
  this.user_id_hash_ = '';
};


/**
 * @protected
 * @type {goog.debug.Logger}
 */
ydn.crm.tracking.Service.prototype.logger =
    goog.log.getLogger('ydn.crm.tracking.Service');


/**
 * @override
 */
ydn.crm.tracking.Service.prototype.remove = function(callback, name, id, token) {
};


/**
 * @override
 */
ydn.crm.tracking.Service.prototype.get = function(callback, name, id, token) {
};


/**
 * @override
 */
ydn.crm.tracking.Service.prototype.list = function(callback, name, token) {
  var path = ydn.crm.tracking.Service.SERVICE_PATHS[name];
  var key_path = ydn.crm.tracking.Service.KEY_PATHS[name];
  var token_key_path = ydn.crm.tracking.Service.VALIDATION_TOKEN_KEY_PATHS[name];
  var me = this;
  var doRequest = function(params) {
    var req = me.client_.request(new ydn.client.HttpRequestData(
        path, 'GET', params));
    req.execute(function(json, resp) {
      var s = resp.getStatus();
      if (s == 200) {
        var entries = /** @type {!Array.<Object>} */ (json);
        var keys = [];
        var tokens = [];
        for (var i = 0; i < entries.length; i++) {
          keys[i] = entries[i][key_path];
          tokens[i] = entries[i][token_key_path];
        }
        var next = resp.getHeader('after');
        callback(resp.getStatus(), entries, keys, tokens, next);
      } else {
        callback(resp.getStatus(), [], [], [], null);
      }
    }, me);
  };

  var params = {};
  if (name == ydn.crm.tracking.Service.SN_ACCESS) {
    var user = /** @type {ydn.api.User} */ (ydn.api.User.getInstance());
    if (!user.isLogin()) {
      goog.log.warning(this.logger, 'User not login');
      callback(999, [], [], [], null);
      return;
    }
    if (!this.user_id_hash_) {
      var md5 = new goog.crypt.Md5();
      md5.update(user.getUserId());
      this.user_id_hash_ = goog.crypt.byteArrayToHex(md5.digest());
    }
    params['prefix'] = '/t/' + this.user_id_hash_ + '/';
  } else if (name != ydn.crm.tracking.Service.SN_BEACON) {
    throw new Error(name);
  }
  if (token) {
    params['after'] = token;
    doRequest(params);
  } else {
    var iter = new ydn.db.IndexIterator(name, token_key_path, null, true);
    this.db_.keys(iter, 1).addCallbacks(function(x) {
      if (x[0]) {
        params['after'] = x[0];
      }
      doRequest(params);
    }, function(e) {
      goog.log.warning(this.logger, e.message);
      callback(400, [], [], [], null);
    }, this);
  }

};


/**
 * @override
 */
ydn.crm.tracking.Service.prototype.add = function(callback, name, obj) {
  var path = ydn.crm.tracking.Service.SERVICE_PATHS[name];
  var req = this.client_.request(new ydn.client.HttpRequestData(
      path, 'POST', null, null,
      JSON.stringify(obj)));
  req.execute(function(json, resp) {
    var s = resp.getStatus();
    if (s == 201 || s == 200) {
      var key = json['path'];
      var token = resp.getHeader('etag');
      // delete "created" (or modified) timestamp so that not interfering
      // with sync.
      delete json['created'];
      callback(resp.getStatus(), json, key, token);
    } else {
      callback(resp.getStatus(), null, NaN, undefined);
    }
  }, this);
};


/**
 * @override
 */
ydn.crm.tracking.Service.prototype.put = function(callback, name, obj, id, token) {
};


/**
 * @define {string} store name.
 */
ydn.crm.tracking.Service.SN_BEACON = 'BeaconTrack';


/**
 * @define {string} store name.
 */
ydn.crm.tracking.Service.SN_ACCESS = 'AccessTokenRecord';


/**
 * @const
 * @type {Object.<string>}
 */
ydn.crm.tracking.Service.SERVICE_PATHS = {
  'BeaconTrack': '/track/',
  'AccessTokenRecord': '/track-access/'
};


/**
 * @const
 * @type {Object.<string>}
 */
ydn.crm.tracking.Service.KEY_PATHS = {
  'BeaconTrack': 'path',
  'AccessTokenRecord': 'ID'
};


/**
 * @const
 * @type {Object.<string>}
 */
ydn.crm.tracking.Service.VALIDATION_TOKEN_KEY_PATHS = {
  'BeaconTrack': 'created',
  'AccessTokenRecord': 'Created'
};


/**
 * @const
 * @type {StoreSchema}
 */
ydn.crm.tracking.Service.trackSchema = /** @type {StoreSchema} */ ({
  name: ydn.crm.tracking.Service.SN_BEACON,
  autoIncrement: true,
  indexes: [
    {
      name: 'path'
    }, {
      name: 'created'
    }
  ]
});


/**
 * @const
 * @type {StoreSchema}
 */
ydn.crm.tracking.Service.accessSchema = /** @type {StoreSchema} */ ({
  name: ydn.crm.tracking.Service.SN_ACCESS,
  autoIncrement: true,
  indexes: [
    {
      name: 'Path'
    }, {
      name: 'Created'
    }
  ]
});



