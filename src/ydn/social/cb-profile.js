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
 * @fileoverview ClearBit social network profile.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.social.ClearBitProfile');
goog.require('ydn.social.Profile');



/**
 * ClearBit social network profile.
 * @param {ydn.social.Network} network
 * @param {!CrmApp.ClearBitProfile} data
 * @constructor
 * @struct
 * @extends {ydn.social.Profile}
 */
ydn.social.ClearBitProfile = function(network, data) {
  goog.base(this, network);
  /**
   * @final
   * @type {!CrmApp.ClearBitProfile}
   */
  this.data = data;
};
goog.inherits(ydn.social.ClearBitProfile, ydn.social.Profile);


/**
 * Parse Pipl respond record
 * @param {CrmApp.ClearBit} cb
 * @param {ydn.social.Network} network
 * @return {ydn.social.ClearBitProfile}
 */
ydn.social.ClearBitProfile.parse = function(cb, network) {
  if (!cb) {
    return null;
  }
  var profile = /** @type {CrmApp.ClearBitProfile} */(cb[network]);
  if (profile && (profile.id || profile.handle)) {
    if (ydn.social.isIdRequired(network)) {
      if (profile.id) {
        return new ydn.social.ClearBitProfile(network, profile);
      }
    } else {
      return new ydn.social.ClearBitProfile(network, profile);
    }
  }
  return null;
};


/**
 * Return primary photo https url.
 * @param {CrmApp.ClearBit} respond
 * @return {?string}
 */
ydn.social.ClearBitProfile.getPrimaryPhotoUrl = function(respond) {
  if (!respond || !respond.avatar) {
    return null;
  }
  if (/^https:/.test(respond.avatar) && /[jpg$|jpeg$]/.test(respond.avatar)) {
    return respond.avatar;
  }
  return null;
};


/**
 * @override
 */
ydn.social.ClearBitProfile.prototype.getSourceName = function() {
  return ydn.social.Source.CB;
};


/**
 * @override
 */
ydn.social.ClearBitProfile.prototype.getUserId = function() {
  if (this.data.id) {
    return String(this.data.id);
  } else {
    return '';
  }
};


/**
 * @override
 */
ydn.social.ClearBitProfile.prototype.getUserName = function() {
  return this.data.handle;
};


/**
 * Get social network profile URL.
 * @return {string|undefined}
 */
ydn.social.ClearBitProfile.prototype.getProfileUrl = function() {
  return this.data.site;
};


/**
 * Get social network profile photo URL.
 * @return {string|undefined}
 */
ydn.social.ClearBitProfile.prototype.getPhotoUrl = function() {
  return this.data.avatar;
};


/**
 * Get a short summary of the user.
 * @return {string|undefined}
 */
ydn.social.ClearBitProfile.prototype.getBio = function() {
  return this.data.bio;
};


/**
 * @return {number|undefined}
 */
ydn.social.ClearBitProfile.prototype.getFollowers = function() {
  return this.data.followers;
};


/**
 * @return {number|undefined}
 */
ydn.social.ClearBitProfile.prototype.getFollowing = function() {
  return this.data.following;
};


/**
 * Extract bio.
 * @param {CrmApp.ClearBit} data
 * @return {?string}
 */
ydn.social.ClearBitProfile.getBio = function(data) {
  if (data && data.bio) {
    return data.bio;
  }
  return null;
};


/**
 * Extract bio.
 * @param {CrmApp.ClearBit} data
 * @return {?string}
 */
ydn.social.ClearBitProfile.getLocation = function(data) {
  if (data && data.location) {
    return data.location;
  }
  return null;
};


/**
 * Extract bio.
 * @param {CrmApp.ClearBit} data
 * @return {?ydn.social.Profile.Employment}
 */
ydn.social.ClearBitProfile.getEmployment = function(data) {
  if (data && data.employment) {
    var emp = /** @type {ydn.social.Profile.Employment} */({
      title: data.employment.title,
      company: data.employment.name
    });
    if (data.company) {
      emp.companyUrl = data.company.url;
      if (data.company.legal_name) {
        emp.company = data.company.legal_name;
      }
      emp.companyTitle = data.company.description;
    }
    return emp;
  }
  return null;
};


/**
 * Extract bio.
 * @param {CrmApp.ClearBit} data
 * @return {!Object}
 */
ydn.social.ClearBitProfile.getTopic = function(data) {
  var out = {};
  if (data) {
    if (data.gender) {
      out[ydn.social.Profile.Topic.SEX] = data.gender;
    }
  }
  return out;
};
