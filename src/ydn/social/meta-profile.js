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
goog.require('ydn.social.ClearBitProfile');
goog.require('ydn.social.FcProfile');
goog.require('ydn.social.PiplProfile');
goog.require('ydn.social.Profile');



/**
 * Compilation social network profile.
 * This class will select suitable source to get personal profile for given
 * network.
 * <pre>
 *   var twitter = mc.getMetaProfile('twitter');
 *   var profile = twitter.getProfile();
 * </pre>
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

  /**
   * Get list os sources.
   * @final
   * @type {!Array<!ydn.social.Profile>}
   * @private
   */
  this.sources_ = [];
  if (this.parent.data) {
    this.compile_();
  }
};


/**
 * @return {ydn.social.Network}
 */
ydn.social.MetaProfile.prototype.getNetworkName = function() {
  return /** @type {ydn.social.Network} */(this.network);
};


/**
 * @return {string}
 */
ydn.social.MetaProfile.prototype.getNetworkLabel = function() {
  return ydn.social.network2name[this.network] || this.network;
};


/**
 * @param {ydn.social.Profile} source
 * @return {number}
 */
ydn.social.MetaProfile.getSourceScore = function(source) {

  var s_source = 1;
  if (source instanceof ydn.social.ClearBitProfile) {
    s_source = 2;
  } else if (source instanceof ydn.social.PiplProfile) {
    s_source = 0.5;
  }

  var s_id = 0;
  if (source.getUserId()) {
    s_id += 2;
  }
  if (source.getUserName()) {
    s_id += 1;
  }

  var s_field = 0;
  if (source.getPhotoUrl()) {
    s_field += 1;
  }
  if (source.getProfileUrl()) {
    s_field += 0.8;
  }
  if (source.getBio()) {
    s_field += 0.6;
  }

  var s_cnt = 0;
  if (source.getFollowers()) {
    s_cnt += 1;
  }
  if (source.getFollowing()) {
    s_cnt += 1;
  }

  return 0.2 * s_source + s_id + 0.5 * s_field + 0.2 * s_cnt;
};


/**
 * Compile social profile from sources.
 * @private
 */
ydn.social.MetaProfile.prototype.compile_ = function() {
  if (this.parent.data.cb) {
    var cb = ydn.social.ClearBitProfile.parse(this.parent.data.cb, this.network);
    if (cb) {
      this.sources_.push(cb);
    }
  }
  if (this.parent.data.fc) {
    var fc = ydn.social.FcProfile.parse(this.parent.data.fc, this.network);
    if (fc) {
      this.sources_.push(fc);
    }
  }
  if (this.parent.data.pp) {
    var pp = ydn.social.PiplProfile.parse(this.parent.data.pp, this.network);
    if (pp) {
      this.sources_.push(pp);
    }
  }

  // ranking
  goog.array.sort(this.sources_, function(a, b) {
    var sa = ydn.social.MetaProfile.getSourceScore(a);
    var sb = ydn.social.MetaProfile.getSourceScore(b);
    return sa > sb ? 1 : sb > sa ? -1 : 0;
  });
};


/**
 * @return {boolean}
 */
ydn.social.MetaProfile.prototype.hasProfile = function() {
  return this.sources_.length > 0;
};


/**
 * Number of available sources.
 * @return {number}
 */
ydn.social.MetaProfile.prototype.count = function() {
  return this.sources_.length;
};


/**
 * Get profile of given source.
 * @param {number=} opt_idx source index, default to 0.
 * @return {ydn.social.Profile}
 */
ydn.social.MetaProfile.prototype.getProfile = function(opt_idx) {
  var idx = opt_idx || 0;
  return this.sources_[idx] || null;
};

