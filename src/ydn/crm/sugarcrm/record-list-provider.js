/**
 * @fileoverview Record list model provide records list as requested.
 */

goog.provide('ydn.crm.su.ui.RecordListProvider');
goog.require('ydn.crm.su.events');



/**
 * Record list model provide records list as requested.
 * <pre>
 *   var rlp = ydn.crm.su.ui.RecordListProvider();
 *   rlp.setSugar(sugar);
 * </pre>
 * @param {ydn.crm.su.model.Sugar=} opt_sugar
 * @constructor
 */
ydn.crm.su.ui.RecordListProvider = function(opt_sugar) {
  /**
   * @type {ydn.crm.su.model.Sugar}
   * @protected
   */
  this.sugar = null;
  /**
   * @type {ydn.crm.su.ModuleName}
   * @private
   */
  this.name_ = ydn.crm.su.ModuleName.CONTACTS;
  /**
   * @type {ydn.crm.su.RecordOrder} index name.
   * @private
   */
  this.order_ = ydn.crm.su.RecordOrder.RECENT;

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
  if (opt_sugar) {
    this.setSugar(opt_sugar);
  }
};


/**
 * @param {ydn.crm.su.model.Sugar} meta sugarcrm provider.
 */
ydn.crm.su.ui.RecordListProvider.prototype.setSugar = function(meta) {
  if (this.sugar == meta) {
    return;
  }
  this.sugar = meta;
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
 * @param {ydn.crm.su.RecordOrder} index set name of index for order.
 * @return {boolean} true if it has changed.
 */
ydn.crm.su.ui.RecordListProvider.prototype.setOrder = function(index) {
  if (this.order_ == index) {
    return false;
  }
  this.order_ = index;
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
 * Get list of records for async listing.
 * @param {number=} opt_offset
 * @return {!ydn.async.Deferred<Array<SugarCrm.Record>>}
 * @see #list for others
 */
ydn.crm.su.ui.RecordListProvider.prototype.listAsync = function(opt_offset) {
  goog.asserts.assert(this.isListAsync());
  if (opt_offset) {
    var df = new ydn.async.Deferred();
    df.callback(null);
    return df;
  }
  var data = {'module': this.name_};
  return this.sugar.getChannel().send(ydn.crm.ch.SReq.GET_FAVORITE_ASYNC, data);
};


/**
 * To choose whether to use {@link #list} vs {@link #listAsync}.
 * @return {boolean}
 */
ydn.crm.su.ui.RecordListProvider.prototype.isListAsync = function() {
  return this.filter_ == ydn.crm.su.RecordFilter.FAVORITE;
};


/**
 * Get list of records.
 * The result has `ydn$index` field for respective index.
 * @param {number} limit number of results.
 * @param {number} offset offset.
 * @return {!goog.async.Deferred<Array<SugarCrm.Record>>}
 * @see #listAsync for Favorite query.
 */
ydn.crm.su.ui.RecordListProvider.prototype.list = function(limit, offset) {
  goog.asserts.assert(!this.isListAsync());
  var index = 'id';
  var reverse = false;
  var kr = null;
  if (this.order_ == ydn.crm.su.RecordOrder.RECENT) {
    index = 'date_modified';
    reverse = true;
  } else if (this.order_ == ydn.crm.su.RecordOrder.NAME) {
    index = 'name';
  }
  if (this.filter_ == ydn.crm.su.RecordFilter.MY) {
    index = 'assigned_user_id, name';
    reverse = false;
    kr = ydn.db.KeyRange.starts([this.sugar.getUserRecordId()]);
  }
  var q = {
    'store': this.name_,
    'index': index,
    'limit': limit,
    'reverse': reverse,
    'keyRange': kr,
    'offset': offset
  };
  return this.sugar.getChannel().send(ydn.crm.ch.SReq.QUERY, [q]).addCallback(function(arr) {
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
  this.sugar.getChannel().send(ydn.crm.ch.SReq.COUNT, {
    'module': this.name_,
    'source': 'client'}).addCallback(function(cnt) {
    this.count_ = cnt;
    if (this.total_ >= 0) {
      this.ready_.callback(null);
    }
  }, this);
  this.sugar.getChannel().send(ydn.crm.ch.SReq.COUNT, {
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
 * @return {ydn.crm.su.RecordFilter}
 */
ydn.crm.su.ui.RecordListProvider.prototype.getFilter = function() {
  return this.filter_;
};


/**
 * @return {ydn.crm.su.ModuleName}
 */
ydn.crm.su.ui.RecordListProvider.prototype.getModuleName = function() {
  return this.name_;
};


/**
 * @return {ydn.crm.su.model.Sugar}
 */
ydn.crm.su.ui.RecordListProvider.prototype.getMeta = function() {
  return this.sugar;
};
