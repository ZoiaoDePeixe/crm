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
 */
ydn.social.Profile.prototype.fetchFeed = function() {
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.SOCIAL_FEED, {
    'network': this.network,
    'userId': this.getUserId(),
    'userName': this.getScreenName()
  });
};


/**
 * Fetch social activity details, like feeds.
 * @return {!goog.async.Deferred}
 */
ydn.social.Profile.prototype.fetchDetail = function() {
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.SOCIAL_PROFILE_DETAIL, {
    'network': this.network,
    'userId': this.getUserId(),
    'userName': this.getUserName()
  });
};


/**
 * Profile source name.
 * @return {ydn.social.Source}
 */
ydn.social.Profile.prototype.getSourceName = goog.abstractMethod;


/**
 * Get user id. .
 * @return {string} empty string if not exists.
 */
ydn.social.Profile.prototype.getUserId = goog.abstractMethod;


/**
 * Get screen name.
 * @return {string} empty string if not exists.
 */
ydn.social.Profile.prototype.getUserName = goog.abstractMethod;


/**
 * Get screen name. If screen name is not available, user id should return;
 * @return {string}
 * @final
 */
ydn.social.Profile.prototype.getScreenName = function() {
  return this.getUserName() || this.getUserId();
};


/**
 * Get social network profile URL.
 * @return {string|undefined}
 */
ydn.social.Profile.prototype.getProfileUrl = goog.abstractMethod;


/**
 * Get social network profile photo URL.
 * @return {string|undefined}
 */
ydn.social.Profile.prototype.getPhotoUrl = function() {
  return undefined;
};


/**
 * Get a short summary of the user.
 * @return {string|undefined}
 */
ydn.social.Profile.prototype.getBio = function() {
  return undefined;
};


/**
 * @return {number|undefined}
 */
ydn.social.Profile.prototype.getFollowers = function() {
  return undefined;
};


/**
 * @return {number|undefined}
 */
ydn.social.Profile.prototype.getFollowing = function() {
  return undefined;
};


/**
 * @typedef {{
 *   title: (string|undefined),
 *   company: string,
 *   companyUrl: (string|undefined),
 *   companyTitle: (string|undefined)
 * }}
 */
ydn.social.Profile.Employment;



