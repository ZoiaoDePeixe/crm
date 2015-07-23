/**
 * @fileoverview Desktop events.
 */

goog.provide('ydn.crm.ui.events');
goog.require('goog.events.Event');



/**
 * Desktop event.
 * @param {string} name panel name.
 * @param {Object} data
 * @param {goog.events.EventTarget} event_target
 * @extends {goog.events.Event}
 * @constructor
 * @struct
 */
ydn.crm.ui.events.ShowPanelEvent = function(name, data, event_target) {
  goog.base(this, ydn.crm.ui.events.EventType.SHOW_PANEL,
      event_target);

  /**
   * @final
   * @type {string}
   */
  this.name = name;
  /**
   * @final
   * @type {Object}
   */
  this.data = data;
};
goog.inherits(ydn.crm.ui.events.ShowPanelEvent, goog.events.Event);


/**
 * @enum {string} activity event types.
 */
ydn.crm.ui.events.EventType = {
  SHOW_PANEL: 'sp',
  NEXT_PANEL: 'np',
  PREV_PANEL: 'pp'
};
