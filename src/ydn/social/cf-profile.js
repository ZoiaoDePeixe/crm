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
 * @param {string=} opt_photo_url
 * @constructor
 * @struct
 * @extends {ydn.social.Profile}
 */
ydn.social.FcProfile = function(network, data, opt_photo_url) {
  goog.base(this, network);
  /**
   * @final
   * @type {!CrmApp.FullContact2SocialProfile}
   * @private
   */
  this.data_ = data;
  /**
   * @type {string|undefined}
   */
  this.photo_url = opt_photo_url;
};
goog.inherits(ydn.social.FcProfile, ydn.social.Profile);


/**
 * Extract social profile
 * @param {CrmApp.FullContact2} data
 * @param {ydn.social.Network} network
 * @return {Array<!CrmApp.FullContact2SocialProfile>}
 * @protected
 */
ydn.social.FcProfile.getSocialProfiles = function(data, network) {
  var arr = [];
  if (!data || !data.socialProfiles) {
    return arr;
  }
  var ps = data.socialProfiles;
  for (var i = 0; i < ps.length; i++) {
    var p = ps[i];
    if (p.typeId == network && (p.id || p.username)) {
      arr.push(p);
    }
  }
  return arr;
};


/**
 * @param {CrmApp.FullContact2SocialProfile} data
 * @return {number}
 * @private
 */
ydn.social.FcProfile.totalFollow_ = function(data) {
  var total = 0;
  if (data.followers) {
    total += data.followers;
  }
  if (data.following) {
    total += data.following;
  }
  return total;
};


/**
 * Extract social profile
 * @param {CrmApp.FullContact2} data
 * @param {ydn.social.Network} network
 * @return {ydn.social.FcProfile}
 */
ydn.social.FcProfile.parse = function(data, network) {
  var arr = ydn.social.FcProfile.getSocialProfiles(data, network);
  var idx = -1;
  for (var i = 0; i < arr.length; i++) {
    if (ydn.social.isIdRequired(network) && !arr[i].id) {
      continue;
    }
    if (idx == -1) {
      idx = 0;
    } else {
      if (ydn.social.FcProfile.totalFollow_(arr[i]) >
          ydn.social.FcProfile.totalFollow_(arr[idx])) {
        idx = i;
      }
    }
  }
  if (idx >= 0) {
    var url = ydn.social.FcProfile.getPhotoUrl(data, network, true);
    return new ydn.social.FcProfile(network, arr[idx], url);
  }
  return null;
};


/**
 * Extract social profile
 * @param {CrmApp.FullContact2} data
 * @param {ydn.social.Network} network
 * @param {boolean} https_only
 * @return {string|undefined}
 */
ydn.social.FcProfile.getPhotoUrl = function(data, network, https_only) {
  if (!data || !data.photos) {
    return undefined;
  }
  var ps = data.photos;
  for (var i = 0; i < ps.length; i++) {
    var p = ps[i];
    if (p.typeId == network && !!p.url &&
        (!https_only || /^https:/.test(p.url))) {
      return p.url;
    }
  }
  return undefined;
};


/**
 * Return primary photo https url.
 * @param {CrmApp.FullContact2} data
 * @return {?string}
 */
ydn.social.FcProfile.getPrimaryPhotoUrl = function(data) {
  if (!data || !data.photos) {
    return null;
  }
  var ps = data.photos;
  for (var i = 0; i < ps.length; i++) {
    var p = ps[i];
    if (p.isPrimary && !!p.url && /^https:/.test(p.url)) {
      return p.url;
    }
  }
  return null;
};


/**
 * Extract bio.
 * @param {CrmApp.FullContact2} data
 * @return {?string}
 */
ydn.social.FcProfile.getBio = function(data) {
  if (!data || !data.socialProfiles) {
    return null;
  }
  for (var i = 0; i < data.socialProfiles.length; i++) {
    var p = data.socialProfiles[i];
    if (p && p.bio) {
      return p.bio;
    }
  }
  return null;
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getUserName = function() {
  return this.data_.username || '';
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getUserId = function() {
  return this.data_.id || '';
};


/**
 * @override
 */
ydn.social.FcProfile.prototype.getSourceName = function() {
  return ydn.social.Source.FC;
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
  return this.photo_url;
};




