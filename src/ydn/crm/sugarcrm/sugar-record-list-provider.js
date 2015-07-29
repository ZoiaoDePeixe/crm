/**
 * @fileoverview Record list model provide records list as requested.
 */

goog.provide('ydn.crm.su.ui.SugarRecordListProvider');
goog.require('ydn.crm.su.model.Sugar');
goog.require('ydn.crm.su.ui.RecordListProvider');



/**
 * Record list model provide records list as requested.
 * @param {ydn.crm.su.model.Sugar} sugar
 * @constructor
 * @extends {ydn.crm.su.ui.RecordListProvider}
 */
ydn.crm.su.ui.SugarRecordListProvider = function(sugar) {
  goog.base(this);
  this.setSugar(sugar);
};
goog.inherits(ydn.crm.su.ui.SugarRecordListProvider,
    ydn.crm.su.ui.RecordListProvider);


/**
 * @return {ydn.crm.su.model.Sugar}
 */
ydn.crm.su.ui.SugarRecordListProvider.prototype.getSugar = function() {
  return /** @type {ydn.crm.su.model.Sugar} */(this.sugar);
};
