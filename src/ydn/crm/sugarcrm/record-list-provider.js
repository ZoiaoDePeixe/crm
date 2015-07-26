/**
 * @fileoverview Record list model provide records list as requested.
 */

goog.provide('ydn.crm.su.ui.RecordListProvider');



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
 */
ydn.crm.su.ui.RecordListProvider = function(sugar, name, order) {
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
   * @type {ydn.crm.su.ModuleName}
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


/**
 * @return {number} total number of records in server.
 */
ydn.crm.su.ui.RecordListProvider.prototype.getTotal = function() {

};


/**
 * @return {number} number of records available.
 */
ydn.crm.su.ui.RecordListProvider.prototype.countRecords = function() {

};


/**
 * Get list of recrods.
 * @param {number} limit number of results.
 * @param {number} offset offset.
 */
ydn.crm.su.ui.RecordListProvider.prototype.list = function(limit, offset) {

};


/**
 * @return {!goog.async.Deferred} resolve on ready.
 */
ydn.crm.su.ui.RecordListProvider.prototype.onReady = function() {
  if (!this.ready_) {
    this.ready_ = new goog.async.Deferred();
    var data = {'module': this.name_};
    this.sugar_.getChannel().send(ydn.crm.ch.SReq.COUNT, data);
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
