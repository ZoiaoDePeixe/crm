// Copyright 2014 YDN Authors. All Rights Reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


/**
 * @fileoverview Tracking data model interface.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.tracking.Model');



/**
 * Tracking data model interface.
 * @constructor
 * @struct
 */
ydn.crm.tracking.Model = function() {

};


/**
 * @return {!goog.async.Deferred.<Array.<YdnCrm.BeaconData>>}
 * @protected
 */
ydn.crm.tracking.Model.prototype.getBeaconData = goog.abstractMethod;


/**
 * @param {string} path beacon data primary key.
 * @return {!goog.async.Deferred.<Array.<YdnCrm.AccessRecord>>}
 * @protected
 */
ydn.crm.tracking.Model.prototype.getAccessRecord = goog.abstractMethod;


/**
 * Compile beacon data and access recor data.
 * @param {YdnCrm.BeaconData} beacon
 * @param {Array.<YdnCrm.AccessRecord>} records
 * @return {YdnCrm.TrackingData} compile tracking data.
 */
ydn.crm.tracking.Model.compileTrackingData = function(beacon, records) {
  window.console.log(JSON.stringify(beacon));
  window.console.log(JSON.stringify(records));
  return /** @type {YdnCrm.TrackingData} */ ({
    recipients: beacon.recipients.join(', ')
  });
};


/**
 * Retrieve and compile tracking data.
 * @param {YdnCrm.BeaconData} beacon
 * @return {!goog.async.Deferred.<YdnCrm.TrackingData>} compile tracking data.
 * @protected
 */
ydn.crm.tracking.Model.prototype.getTrackingData = function(beacon) {
  return this.getAccessRecord(beacon.path).addCallback(function(records) {
    return ydn.crm.tracking.Model.compileTrackingData(beacon, records);
  }, this);
};


/**
 * @return {!goog.async.Deferred}
 * @protected
 */
ydn.crm.tracking.Model.prototype.getMockData = function() {
  var data = [{
    recipients: 'A@sere.com',
    subject: 'OK',
    sentDate: new Date(1384963200000),
    opens: 3,
    clicks: 5,
    cities: 2,
    lastOpen: new Date(1351689200000)
  }, {
    recipients: 'B@sere.com',
    subject: 'Re: new',
    sentDate: new Date(1351699200000),
    opens: 6,
    clicks: 32,
    cities: 2,
    lastOpen: new Date(1351599200000)
  }, {
    recipients: 'C@sere.com',
    subject: 'Comain',
    sentDate: new Date(1351699200000),
    opens: 6,
    clicks: 32,
    cities: 2,
    lastOpen: new Date(1351599200000)
  }, {
    recipients: 'D@sere.com',
    subject: 'New project',
    sentDate: new Date(1351599200000),
    opens: 6,
    clicks: 32,
    cities: 2,
    lastOpen: new Date(1351599200000)
  }];
  return goog.async.Deferred.succeed(data);
};


/**
 * @return {!goog.async.Deferred.<!Array.<Object>>} get tracking data.
 */
ydn.crm.tracking.Model.prototype.getTrackingRowData = function() {
  // return this.getMockData();
  return this.getBeaconData().addCallbacks(function(data) {
    var results = [];
    for (var i = 0; i < data.length; i++) {
      results[i] = this.getTrackingData(data[i]);
    }
    return goog.async.DeferredList.gatherResults(results);
  }, function(e) {
    window.console.error('Error tracking fetching ' + (e.message || e));
  }, this);
};


/**
 * Update data from server.
 */
ydn.crm.tracking.Model.prototype.fetch = goog.abstractMethod;