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



/**
 * @interface
 */
YdnCrm.TrackingData = function() {};


/**
 * @type {string} beacon path, primary key.
 */
YdnCrm.TrackingData.prototype.path;


/**
 * @type {string}
 */
YdnCrm.TrackingData.prototype.recipients;


/**
 * @type {string}
 */
YdnCrm.TrackingData.prototype.subject;


/**
 * @type {Date}
 */
YdnCrm.TrackingData.prototype.sentDate;


/**
 * @type {number}
 */
YdnCrm.TrackingData.prototype.opens;


/**
 * @type {number}
 */
YdnCrm.TrackingData.prototype.clicks;


/**
 * @type {number}
 */
YdnCrm.TrackingData.prototype.timeToOpen;


/**
 * @type {string} cities at which email open.
 */
YdnCrm.TrackingData.prototype.cities;


/**
 * @type {number} number of cities at which email open.
 */
YdnCrm.TrackingData.prototype.numCities;


/**
 * @type {Date}
 */
YdnCrm.TrackingData.prototype.lastOpen;



/**
 * TrackingData is aggregate on a range of time interval to get overview
 * of the stats.
 * @interface
 */
YdnCrm.TrackingAggregate = function() {};


/**
 * @type {number} timestamp of the aggregate begin, inclusive.
 */
YdnCrm.TrackingAggregate.prototype.lower;


/**
 * @type {number} timestamp of the aggregate end, inclusive.
 */
YdnCrm.TrackingAggregate.prototype.upper;


/**
 * @type {number} timestamp at which data is updated.
 */
YdnCrm.TrackingAggregate.prototype.modified;


/**
 * @type {number} Emails Tracked, number of track in this aggregate.
 */
YdnCrm.TrackingAggregate.prototype.count;


/**
 * @type {number} Emails Opened.
 */
YdnCrm.TrackingAggregate.prototype.numOpens;


/**
 * @type {number} number of email with Multiple Opens
 */
YdnCrm.TrackingAggregate.prototype.numMultiOpens;


/**
 * @type {number} # of clicks
 */
YdnCrm.TrackingAggregate.prototype.numOfClick;


/**
 * @type {number} sum of time to open.
 */
YdnCrm.TrackingAggregate.prototype.totalTimeToOpens;
