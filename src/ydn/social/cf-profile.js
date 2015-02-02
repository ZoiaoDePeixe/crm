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
 * @fileoverview FullContact social network profile.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.social.FcProfile');
goog.require('ydn.social.Profile');



/**
 * FullContact social network profile.
 * @param {ydn.social.Network} network
 * @param {!CrmApp.FullContact2SocialProfile} data
 * @constructor
 * @struct
 * @extends {ydn.social.Profile}
 */
ydn.social.FcProfile = function(network, data) {
  goog.base(this, network);
  /**
   * @final
   * @type {!CrmApp.FullContact2SocialProfile}
   * @private
   */
  this.data_ = data;
};
goog.inherits(ydn.social.FcProfile, ydn.social.Profile);


/**
 * @override
 */
ydn.social.FcProfile.prototype.getScreenName = function() {
  return this.data_.username;
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getUserId = function() {
  return this.data_.id;
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getSourceName = function() {
  return 'FullContact';
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getBio = function() {
  return this.data_.bio;
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getFollowers = function() {
  return this.data_.followers;
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getFollowing = function() {
  return this.data_.following;
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getProfileUrl = function() {
  return this.data_.url;
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getPhotoUrl = function() {
  return undefined;
};




