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
YdnCrm.BeaconData.prototype.recorded;


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
 * @type {number}
 */
YdnCrm.BeaconData.prototype.numLink;


/**
 * This value exists only in client side used by ydn.crm.tracking.notifier.
 * @type {?Object} notification data.
 */
YdnCrm.BeaconData.prototype.notification;



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
YdnCrm.BeaconHit = function() {};


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.ID;


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.City;


/**
 * @type {YdnCrm.GeoPoint}
 */
YdnCrm.BeaconHit.prototype.CityLatLong;


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.Country;


/**
 * @type {number}
 */
YdnCrm.BeaconHit.prototype.Recorded;


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.Ip;


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.Path;


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.Referer;


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.Region;


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.Query;


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.UserAgent;


/**
 * @type {string} either 't', 'r', or 'f' representing tracking image, redirect
 * and font respectively.
 */
YdnCrm.BeaconHit.prototype.Tracker;


/**
 * @type {string|undefined}
 */
YdnCrm.BeaconHit.prototype.AccessUserId;


/**
 * @type {string}
 */
YdnCrm.BeaconHit.prototype.User;



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
 * @type {number} number of times email opens excluding self open.
 */
YdnCrm.TrackingData.prototype.opens;


/**
 * @type {number} number of times email opens by self.
 */
YdnCrm.TrackingData.prototype.selfOpens;


/**
 * @type {string} email opening state.
 */
YdnCrm.TrackingData.prototype.open;


/**
 * @type {number} number of click to tracked links recorded.
 */
YdnCrm.TrackingData.prototype.clicks;


/**
 * @type {number} number of tracked link in the message.
 */
YdnCrm.TrackingData.prototype.numLink;


/**
 * @type {number} time interval between open and sent.
 */
YdnCrm.TrackingData.prototype.timeToOpen;


/**
 * @type {string} comma separated names of cities at which email open.
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
 * @type {number} Number of email opened.
 */
YdnCrm.TrackingAggregate.prototype.numOpens;


/**
 * @type {number} Total number of email opened. An email can be opened by multiple
 * times.
 */
YdnCrm.TrackingAggregate.prototype.totalOpens;


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



/**
 * Do not track record.
 * @interface
 */
YdnCrm.DoNotTrack = function() {};


/**
 * @type {string}
 */
YdnCrm.DoNotTrack.prototype.Account;


/**
 * @type {string}
 */
YdnCrm.DoNotTrack.prototype.Id;


/**
 * @type {number}
 */
YdnCrm.DoNotTrack.prototype.Modified;


/**
 * @type {string}
 */
YdnCrm.DoNotTrack.prototype.Target;


/**
 * @type {boolean}
 */
YdnCrm.DoNotTrack.prototype.Deleted;



/**
 * Social cache record.
 * @interface
 */
YdnCrm.SocialCache = function() {};


/**
 * @type {string}
 */
YdnCrm.SocialCache.prototype.id;


/**
 * @type {number}
 */
YdnCrm.SocialCache.prototype.updated;


/**
 * @type {*}
 */
YdnCrm.SocialCache.prototype.data;



/**
 * Social cache record.
 * @constructor
 */
YdnCrm.SyncRecord = function() {};


/**
 * @type {string}
 */
YdnCrm.SyncRecord.prototype.gmail = '';


/**
 * @type {string}
 */
YdnCrm.SyncRecord.prototype.key = '';


/**
 * @type {string}
 */
YdnCrm.SyncRecord.prototype.modified = '';


/**
 * @type {?Array<number>}
 */
YdnCrm.SyncRecord.prototype.timestamps = [];


/**
 * @type {?Array<number>} previous timestamps for auditing purpose
 */
YdnCrm.SyncRecord.prototype.timestamps_old = [];


/**
 * @type {boolean|undefined}
 */
YdnCrm.SyncRecord.prototype.deleted = false;



/**
 * User license.
 * @interface
 */
YdnCrm.UserLicense = function() {};


/**
 * @type {boolean}
 */
YdnCrm.UserLicense.prototype.active;


/**
 * @type {string}
 */
YdnCrm.UserLicense.prototype.assignEmail;


/**
 * @type {number}
 */
YdnCrm.UserLicense.prototype.begin;


/**
 * @type {number}
 */
YdnCrm.UserLicense.prototype.end;


/**
 * @see ydn.crm.base.LicenseEdition
 * @type {string}
 */
YdnCrm.UserLicense.prototype.edition;



/**
 * User setting for Google services.
 * @constructor
 */
YdnCrm.UserSettingRecord = function() {};



/**
 * User setting for Google services.
 * @constructor
 * @extends {YdnCrm.UserSettingRecord}
 */
YdnCrm.UserSettingSugarCrm = function() {};



/**
 * User setting for Google services.
 * @constructor
 * @extends {YdnCrm.UserSettingRecord}
 */
YdnCrm.UserSettingGoogle = function() {};



/**
 * User setting for Google services.
 * @interface
 * @extends {YdnCrm.UserSettingRecord}
 */
YdnCrm.UserSettingGDataCal = function() {};


/**
 * @type {string|undefined} Google calendar id for sync with CRM.
 */
YdnCrm.UserSettingGDataCal.prototype.syncCalId = '';



/**
 * User setting for contacts and sync.
 * @interface
 * @extends {YdnCrm.UserSettingRecord}
 */
YdnCrm.UserSettingGDataM8 = function() {};


/**
 * @type {Object}
 * @const
 */
var YathitCrm = {};


/**
 * @type {string}
 */
YathitCrm.name;


/**
 * @type {Object}
 * @const
 */
YathitCrm.Product = {};


/**
 * @type {?Object}
 * @const
 */
YathitCrm.Product.GData = {};


/**
 * @type {?Object}
 * @const
 */
YathitCrm.Product.GData.Calendar = {};


/**
 * @type {?Object}
 * @const
 */
YathitCrm.Product.GData.Contacts = {};


/**
 * @type {?Object}
 * @const
 */
YathitCrm.Product.SugarCRM = {};


/**
 * @type {?Object}
 * @const
 */
YathitCrm.Product.Tracking = {};


/**
 * @type {?Object}
 * @const
 */
YathitCrm.Product.Social = {};


/**
 * amplitude
 * @type {Object}
 * @const
 */
var amplitude = {};


/**
 * @param {string} key
 * @param {string=} user
 */
amplitude.init = function(key, user) {};


/**
 * @param {string} user
 */
amplitude.setUserId = function(user) {};


/**
 * @param {string} app_ver
 */
amplitude.setVersionName = function(app_ver) {};


/**
 * @param {string} event event identifier.
 * @param {Object} properties key-value
 */
amplitude.logEvent = function(event, properties) {};


/**
 * @param {Object} properties key-value
 */
amplitude.setUserProperties = function(properties) {};



/**
 * Heap analytics
 * @type {Object}
 * @const
 */
var heap = {};


/**
 * @param {string} event event identifier.
 * @param {Object} properties key-value
 */
heap.track = function(event, properties) {};


/**
 * @param {Object} user
 */
heap.identify = function(user) {};


/**
 * @param {Object} obj
 */
heap.setEventProperties = function(obj) {};

