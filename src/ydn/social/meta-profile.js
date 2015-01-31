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
 * @fileoverview Compilation social network profile.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.social.MetaProfile');



/**
 * Compilation social network profile.
 * This class will select suitable source to get personal profile for given
 * network.
 * List of available sources and source can be selected.
 * @param {ydn.social.MetaContact} parent
 * @param {ydn.social.Network} network
 * @constructor
 * @struct
 */
ydn.social.MetaProfile = function(parent, network) {
  /**
   * @final
   * @type {ydn.social.MetaContact}
   */
  this.parent = parent;
  /**
   * @final
   * @type {ydn.social.Network}
   */
  this.network = network;
  this.source_idx_ = 0; // the first available source
  /**
   * Get list os sources.
   * @final
   * @type {!Array<string>}
   * @private
   */
  this.sources_ = [];
  this.profiles_index_ = [];
  if (this.parent.data && this.parent.data.fc && this.parent.data.fc.socialProfiles) {
    var ps = this.parent.data.fc.socialProfiles;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (p.typeId == network && (p.id || p.username || p.url)) {
        this.sources_.push('fc');
        this.profiles_index_.push(i);
        break;
      }
    }
  }
  if (this.parent.data && this.parent.data.pp && this.parent.data.pp.socialProfiles) {
    var ps = this.parent.data.pp.socialProfiles;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (p.typeId == network && (p.id || p.username || p.url)) {
        this.sources_.push('pp');
        this.profiles_index_.push(i);
        break;
      }
    }
  }
};


/**
 * Switch to next data source provider.
 */
ydn.social.MetaProfile.prototype.nextSource = function() {
  this.source_idx_++;
  if (this.source_idx_ >= this.source_idx_) {
    this.source_idx_ = 0;
  }
};


/**
 * @return {string}
 */
ydn.social.MetaProfile.prototype.getSourceName = function() {
  if (this.sources_[this.source_idx_] == 'fc') {
    return 'FullContact';
  } else if (this.sources_[this.source_idx_] == 'pp') {
    return 'Pipl';
  } else if (this.sources_[this.source_idx_] == 'cb') {
    return 'ClearBit';
  } else {
    return '';
  }
};


/**
 * @return {boolean}
 */
ydn.social.MetaProfile.prototype.hasProfile = function() {
  return this.sources_.length > 0;
};


/**
 * Get list of social network having profiles.
 * @return {!Array<string>} must treat as readonly.
 */
ydn.social.MetaProfile.prototype.getSources = function() {
  return this.sources_;
};


/**
 * @return {CrmApp.FullContact2SocialProfile}
 * @private
 */
ydn.social.MetaProfile.prototype.getProfileAsFullContact_ = function() {
  var i = this.profiles_index_[this.source_idx_];
  if (this.sources_[this.source_idx_] == 'pp') {
    return this.parent.data.pp.socialProfiles[i];
  } else if (this.sources_[this.source_idx_] == 'fc') {
    return this.parent.data.fc.socialProfiles[i];
  } else {
    throw new Error('not pp or fc');
  }
};


/**
 * Get screen name.
 * @return {string}
 */
ydn.social.MetaProfile.prototype.getScreenName = function() {
  var pf = this.getProfileAsFullContact_();
  if (pf.username) {
    if (this.network == ydn.social.Network.TWITTER) {
      return '@' + pf.username;
    }
    return pf.username;
  } else if (pf.id) {
    return pf.id;
  } else {
    return this.parent.getFullName() || '';
  }
};


/**
 * Get social network profile URL.
 * @return {string|undefined}
 */
ydn.social.MetaProfile.prototype.getProfileUrl = function() {
  var pf = this.getProfileAsFullContact_();
  return pf.url;
};


/**
 * Get a short summary of the user.
 * @return {string|undefined}
 */
ydn.social.MetaProfile.prototype.getBio = function() {
  var pf = this.getProfileAsFullContact_();
  return pf.bio;
};


/**
 * @return {number|undefined}
 */
ydn.social.MetaProfile.prototype.getFollowers = function() {
  var pf = this.getProfileAsFullContact_();
  return pf.followers;
};


/**
 * @return {number|undefined}
 */
ydn.social.MetaProfile.prototype.getFollowing = function() {
  var pf = this.getProfileAsFullContact_();
  return pf.following;
};



