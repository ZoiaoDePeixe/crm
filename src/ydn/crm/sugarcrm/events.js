/**
 * @fileoverview Activity events.
 */

goog.provide('ydn.crm.sugarcrm.events');
goog.require('goog.events.Event');
goog.require('ydn.crm.sugarcrm');



/**
 * Edit click event.
 * @param {ydn.crm.sugarcrm.ModuleName} m_name module name.
 * @param {goog.events.EventTarget} event_target
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugarcrm.events.NewRecordEvent = function(m_name, event_target) {
  goog.base(this, ydn.crm.sugarcrm.events.EventType.NEW_RECORD,
      event_target);

  /**
   * @final
   * @type {ydn.crm.sugarcrm.ModuleName}
   */
  this.module = m_name;
};
goog.inherits(ydn.crm.sugarcrm.events.NewRecordEvent, goog.events.Event);



/**
 * Edit click event.
 * @param {ydn.crm.sugarcrm.ModuleName} m_name module name..
 * @param {string} id target.
 * @param {goog.events.EventTarget} event_target
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.sugarcrm.events.RecordViewEvent = function(m_name, id, event_target) {
  goog.base(this, ydn.crm.sugarcrm.events.EventType.VIEW_RECORD,
      event_target);

  /**
   * @final
   * @type {ydn.crm.sugarcrm.ModuleName}
   */
  this.module = m_name;
  /**
   * @final
   * @type {string}
   */
  this.id = id;
};
goog.inherits(ydn.crm.sugarcrm.events.RecordViewEvent, goog.events.Event);


/**
 * @enum {string} activity event types.
 */
ydn.crm.sugarcrm.events.EventType = {
  VIEW_RECORD: 'vr',
  NEW_RECORD: 'nr'
};
