/**
 * @fileoverview A single action of a widget.
 *
 * User: kyawtun
 * Date: 10/12/13
 */


goog.provide('ydn.crm.inj.Task');



/**
 *
 * @constructor
 * @struct
 * @extends {goog.Disposable}
 */
ydn.crm.inj.Task = function() {
  goog.base(this);

};
goog.inherits(ydn.crm.inj.Task, goog.Disposable);


/**
 * @enum {string}
 */
ydn.crm.inj.Task.Cmd = {
  ADD_TO_SUGAR: 'ats',
  IMPORT_CONTACT_TO_SUGAR: 'ics'
};


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.Task.PREFIX = 'ydnt';


/**
 * @return {string}
 */
ydn.crm.inj.Task.prototype.getName = goog.abstractMethod;


/**
 * Render disposable DOM and attach to root element of the parent widget,
 * i.e, no event attachment.
 * @param {string} root element class name
 */
ydn.crm.inj.Task.prototype.render = goog.abstractMethod;


/**
 * @param {string} context
 * @param {string} root element class name
 */
ydn.crm.inj.Task.prototype.handleClick = goog.abstractMethod;


/**
 * Get base href.
 * @return {string}
 */
ydn.crm.inj.Task.prototype.getBaseHref = function() {
  return '#widget/' + this.getName() + '/';
};

