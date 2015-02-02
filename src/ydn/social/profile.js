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
 * @fileoverview Interface for social network profile.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.social.Profile');



/**
 * Interface for social network profile.
 * @param {ydn.social.Network} network
 * @constructor
 * @struct
 */
ydn.social.Profile = function(network) {
  /**
   * @final
   * @type {ydn.social.Network}
   */
  this.network = network;
};


/**
 * Fetch social activity details, like feeds.
 * @return {!goog.async.Deferred}
 * @protected
 */
ydn.social.Profile.prototype.loadDetail = function() {
  return goog.async.Deferred.succeed(null);
};


/**
 * Transform server respond data from {@link loadDetail} to profile detail.
 * @param {Object} obj
 * @return {!CrmApp.ProfileDetail}
 * @protected
 */
ydn.social.Profile.prototype.toProfileDetail = function(obj) {
  var detail = /** @type {!CrmApp.ProfileDetail} */({});
  detail.raw = obj;
  return detail;
};


/**
 * Fetch social activity details, like feeds.
 * @return {!goog.async.Deferred<!CrmApp.ProfileDetail>}
 */
ydn.social.Profile.prototype.fetchDetail = function() {
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.SOCIAL_PROFILE_DETAIL, {
    'network': this.network,
    'userId': this.getUserId(),
    'userName': this.getScreenName()
  });
};


/**
 * Profile source name.
 * @return {string}
 */
ydn.social.Profile.prototype.getSourceName = goog.abstractMethod;


/**
 * Get screen name.
 * @return {string}
 */
ydn.social.Profile.prototype.getUserId = goog.abstractMethod;


/**
 * Get screen name.
 * @return {string}
 */
ydn.social.Profile.prototype.getScreenName = goog.abstractMethod;


/**
 * Get social network profile URL.
 * @return {string|undefined}
 */
ydn.social.Profile.prototype.getProfileUrl = goog.abstractMethod;


/**
 * Get social network profile photo URL.
 * @return {string|undefined}
 */
ydn.social.Profile.prototype.getPhotoUrl = goog.abstractMethod;


/**
 * Get a short summary of the user.
 * @return {string|undefined}
 */
ydn.social.Profile.prototype.getBio = goog.abstractMethod;


/**
 * @return {number|undefined}
 */
ydn.social.Profile.prototype.getFollowers = goog.abstractMethod;


/**
 * @return {number|undefined}
 */
ydn.social.Profile.prototype.getFollowing = goog.abstractMethod;




