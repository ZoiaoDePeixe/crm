/**
 * @fileoverview About this file
 */

goog.provide('ydn.crm.Ch');
goog.require('goog.async.Deferred');
goog.require('ydn.crm.ch.Req');
goog.require('ydn.crm.ch.SReq');
goog.require('ydn.msg.Pipe');



/**
 * @constructor
 */
ydn.crm.Ch = function() {

};


/**
 * @final
 * @private
 * @type {Object.<ydn.msg.Pipe>}
 */
ydn.crm.Ch.channels_ = {};


/**
 * Get channel.
 * @param {string} name
 * @return {ydn.msg.Pipe}
 * @deprecated use ydn.msg instead
 */
ydn.crm.Ch.getChannel = function(name) {
  return ydn.crm.Ch.channels_[name];
};


/**
 * List channels, excluding main channel.
 * @return {Array.<string>}
 */
ydn.crm.Ch.list = function() {
  return Object.keys(/** @type {!Object} */ (ydn.crm.Ch.channels_));
};

