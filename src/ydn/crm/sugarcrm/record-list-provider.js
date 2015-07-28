/**
 * @fileoverview Record list model provide records list as requested.
 */

goog.provide('ydn.crm.su.ui.RecordListProvider');
goog.require('goog.events.EventTarget');
goog.require('ydn.crm.su.events');



/**
 * Record list model provide records list as requested.
 * <pre>
 *   var rlp = ydn.crm.su.ui.RecordListProvider();
 *   rlp.setSugar(sugar);
 *   rlp.onReady().done(function() {...
 * </pre>
 * @constructor
 */
ydn.crm.su.ui.RecordListProvider = function() {
  /**
   * @type {ydn.crm.su.Meta}
   * @private
   */
  this.sugar_ = null;
  /**
   * @type {ydn.crm.su.ModuleName}
   * @private
   */
  this.name_ = ydn.crm.su.ModuleName.CONTACTS;
  /**
   * @type {string} index name.
   * @private
   */
  this.order_ = 'date_modified';
  /**
   * In reverse ordering.
   * @type {boolean}
   * @private
   */
  this.rev_ = false;

  /**
   * @type {ydn.crm.su.RecordFilter}
   * @private
   */
  this.filter_ = ydn.crm.su.RecordFilter.ALL;

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
  this.ready_ = goog.async.Deferred.fail('Not ready.');
};


/**
 * @param {ydn.crm.su.Meta} meta sugarcrm provider.
 */
ydn.crm.su.ui.RecordListProvider.prototype.setSugar = function(meta) {
  if (this.sugar_ == meta) {
    return;
  }
  this.sugar_ = meta;
  this.reset_();
};


/**
 * @param {ydn.crm.su.ModuleName} mn target module name.
 */
ydn.crm.su.ui.RecordListProvider.prototype.setModule = function(mn) {
  if (this.name_ == mn) {
    return;
  }
  this.name_ = mn;
  this.reset_();
};


/**
 * @param {string} index set name of index for order.
 * @param {boolean} rev in reverse direction.
 * @return {boolean} true if it has changed.
 */
ydn.crm.su.ui.RecordListProvider.prototype.setOrder = function(index, rev) {
  goog.asserts.assert(['name', 'id', 'date_modified'].indexOf(index) >= 0,
      'Invalid order ' + index);
  if (this.order_ == index && this.rev_ == rev) {
    return false;
  }
  this.order_ = index || 'id';
  this.rev_ = !!rev;
  this.reset_();
  return true;
};


/**
 * @param {ydn.crm.su.RecordFilter} filter set name of filter.
 * @return {boolean} true if it has changed.
 */
ydn.crm.su.ui.RecordListProvider.prototype.setFilter = function(filter) {
  if (this.filter_ == filter) {
    return false;
  }
  this.filter_ = filter;
  this.reset_();
  return true;
};


/**
 * @private
 */
ydn.crm.su.ui.RecordListProvider.prototype.reset_ = function() {
  this.ready_ = null;
  this.total_ = -1;
  this.count_ = -1;
};


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
  var index = this.order_ || 'id';
  var kr = null;
  if (this.filter_ == ydn.crm.su.RecordFilter.MY) {
    index = 'assigned_user_id, name';
    kr = ydn.db.KeyRange.starts([this.sugar_.getUserRecordId()]);
  }
  var q = {
    'store': this.name_,
    'index': index,
    'limit': limit,
    'keyRange': kr,
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
  this.sugar_.getChannel().send(ydn.crm.ch.SReq.COUNT, {
    'module': this.name_,
    'source': 'client'}).addCallback(function(cnt) {
    this.count_ = cnt;
    if (this.total_ >= 0) {
      this.ready_.callback(null);
    }
  }, this);
  this.sugar_.getChannel().send(ydn.crm.ch.SReq.COUNT, {
    'module': this.name_,
    'source': 'server'}).addCallback(function(cnt) {
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
