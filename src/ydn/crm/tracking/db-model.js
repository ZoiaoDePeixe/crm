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
 * @fileoverview Tracking data model.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.tracking.DbModel');
goog.require('ydn.crm.tracking.Model');



/**
 * Tracking data model using database.
 * @param {ydn.client.Client} client backend client.
 * @param {ydn.db.core.Storage} db database.
 * @constructor
 * @struct
 * @extends {ydn.crm.tracking.Model}
 */
ydn.crm.tracking.DbModel = function(client, db) {
  /**
   * @type {ydn.db.core.DbOperator}
   */
  this.db = db.branch(ydn.db.tr.Thread.Policy.SINGLE, true);

  var service = new ydn.crm.tracking.Service(client, db);
  this.track_entity = db.entity(service, ydn.crm.tracking.Service.SN_BEACON);
  this.access_entity = db.entity(service, ydn.crm.tracking.Service.SN_ACCESS);
};
goog.inherits(ydn.crm.tracking.DbModel, ydn.crm.tracking.Model);


/**
 * @override
 */
ydn.crm.tracking.DbModel.prototype.getBeaconData = function() {

  return this.db.valuesByKeyRange(ydn.crm.tracking.Service.SN_BEACON).addCallback(function(json) {
    // document.getElementById('list-panel').textContent = JSON.stringify(json);
    window.console.log(json);
  });

};
