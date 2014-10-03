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
 */
ydn.crm.tracking.Model.prototype.getBeaconData = goog.abstractMethod;


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
ydn.crm.tracking.Model.prototype.getData = function() {
  return this.getMockData();
};
