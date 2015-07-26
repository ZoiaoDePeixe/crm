/**
 * @fileoverview Record list model provide records list as requested.
 */

goog.provide('ydn.crm.su.ui.RecordListProvider');
goog.require('goog.events.EventTarget');
goog.require('ydn.crm.su.events');



/**
 * Record list model provide records list as requested.
 * <pre>
 *   var rlp = ydn.crm.su.ui.RecordListProvider(sugar, 'Tasks', 'date_updated');
 *   rlp.onReady().done(function() {...
 * </pre>
 * @param {ydn.crm.su.Meta} sugar
 * @param {ydn.crm.su.ModuleName} name module name.
 * @param {string} order index order name.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ydn.crm.su.ui.RecordListProvider = function(sugar, name, order) {
  ydn.crm.su.ui.RecordListProvider.base(this, 'constructor');
  /**
   * @type {ydn.crm.su.Meta}
   * @private
   */
  this.sugar_ = sugar;
  /**
   * @type {ydn.crm.su.ModuleName}
   * @private
   */
  this.name_ = name;
  /**
   * @type {string}
   * @private
   */
  this.order_ = order;

  /**
   * @type {number}
   * @private
   */
  this.total_ = -1;

  /**
   * @type {number}
   * @private
   */
  this.count_ = -1;

  /**
   * @type {goog.async.Deferred}
   * @private
   */
  this.ready_ = null;
};
goog.inherits(ydn.crm.su.ui.RecordListProvider, goog.events.EventTarget);


/**
 * @return {number} total number of records in server.
 */
ydn.crm.su.ui.RecordListProvider.prototype.getTotal = function() {
  return this.total_;
};


/**
 * @return {number} number of records available.
 */
ydn.crm.su.ui.RecordListProvider.prototype.countRecords = function() {
  return this.count_;
};


/**
 * Get list of records.
 * The result has `ydn$index` field for respective index.
 * @param {number} limit number of results.
 * @param {number} offset offset.
 * @return {!goog.async.Deferred<Array<SugarCrm.Record>>}
 */
ydn.crm.su.ui.RecordListProvider.prototype.list = function(limit, offset) {
  var q = {
    'store': 'Contacts',
    'index': 'date_modified',
    'limit': limit,
    'offset': offset
  };
  return this.sugar_.getChannel().send(ydn.crm.ch.SReq.QUERY, [q]).addCallback(function(arr) {
    var res = /** @type {CrmApp.QueryResult} */(arr[0]);
    return res.result || [];
  }, this);
};


/**
 * Initialize.
 * @private
 */
ydn.crm.su.ui.RecordListProvider.prototype.init_ = function() {
  if (this.ready_) {
    return;
  }
  this.ready_ = new goog.async.Deferred();
  this.ready_.addCallback(function() {
    var ev = new goog.events.Event(ydn.crm.su.events.EventType.READY, this);
    this.dispatchEvent(ev);
  }, this);
  this.sugar_.getChannel().send(ydn.crm.ch.SReq.COUNT, {
    'module': this.name_,
    'source': 'client'}).addCallback(function(cnt) {
    console.log(cnt);
    this.count_ = cnt;
    if (this.total_ >= 0) {
      this.ready_.callback(null);
    }
  }, this);
  this.sugar_.getChannel().send(ydn.crm.ch.SReq.COUNT, {
    'module': this.name_,
    'source': 'server'}).addCallback(function(cnt) {
    console.log(cnt);
    this.total_ = cnt;
    if (this.count_ >= 0) {
      this.ready_.callback(null);
    }
  }, this);
};


/**
 * Initialize record statistic.
 * @return {boolean} return true if ready.
 */
ydn.crm.su.ui.RecordListProvider.prototype.init = function() {
  if (this.ready_ && this.ready_.hasFired()) {
    return true;
  } else {
    this.init_();
    return false;
  }
};


/**
 * @return {!goog.async.Deferred} resolve on ready.
 */
ydn.crm.su.ui.RecordListProvider.prototype.onReady = function() {
  if (!this.ready_) {
    this.init_();
    goog.asserts.assertObject(this.ready_);
    return this.ready_;
  } else {
    return this.ready_.branch();
  }
};


/**
 * @return {ydn.crm.su.ModuleName}
 */
ydn.crm.su.ui.RecordListProvider.prototype.getModuleName = function() {
  return this.name_;
};


/**
 * @return {ydn.crm.su.Meta}
 */
ydn.crm.su.ui.RecordListProvider.prototype.getMeta = function() {
  return this.sugar_;
};
