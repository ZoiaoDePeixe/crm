/**
 * @fileoverview Extens for CRM.
 *
 * @externs
 */


/**
 * @const
 * @type {Object}
 */
var YdnCrm = {};



/**
 * @interface
 */
YdnCrm.BeaconData = function() {};


/**
 * @type {number}
 */
YdnCrm.BeaconData.prototype.created;


/**
 * @type {string}
 */
YdnCrm.BeaconData.prototype.ip;


/**
 * @type {string}
 */
YdnCrm.BeaconData.prototype.path;


/**
 * @type {!Array.<string>}
 */
YdnCrm.BeaconData.prototype.recipients;


/**
 * @type {string}
 */
YdnCrm.BeaconData.prototype.subject;


/**
 * @type {string}
 */
YdnCrm.BeaconData.prototype.userId;



/**
 * @interface
 */
YdnCrm.GeoPoint = function() {};


/**
 * @type {number}
 */
YdnCrm.GeoPoint.prototype.latitude;


/**
 * @type {number}
 */
YdnCrm.GeoPoint.prototype.longitude;



/**
 * @interface
 */
YdnCrm.AccessRecord = function() {};


/**
 * @type {string}
 */
YdnCrm.AccessRecord.prototype.City;


/**
 * @type {YdnCrm.GeoPoint}
 */
YdnCrm.AccessRecord.prototype.CityLatLong;


/**
 * @type {string}
 */
YdnCrm.AccessRecord.prototype.Country;


/**
 * @type {number}
 */
YdnCrm.AccessRecord.prototype.Created;


/**
 * @type {string}
 */
YdnCrm.AccessRecord.prototype.Ip;


/**
 * @type {string}
 */
YdnCrm.AccessRecord.prototype.Path;


/**
 * @type {string}
 */
YdnCrm.AccessRecord.prototype.Referer;


/**
 * @type {string}
 */
YdnCrm.AccessRecord.prototype.Region;


/**
 * @type {string}
 */
YdnCrm.AccessRecord.prototype.UserAgent;



