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
 * Compile social profile from sources.
 * @private
 */
ydn.social.MetaProfile.prototype.compile_ = function() {
  if (this.parent.data.fc && this.parent.data.fc.socialProfiles) {
    var ps = this.parent.data.fc.socialProfiles;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (p.typeId == this.network && (p.id || p.username || p.url)) {
        this.sources_.push(new ydn.social.FcProfile(this.network, p));
        break;
      }
    }
  }
  if (this.parent.data.pp && this.parent.data.pp.socialProfiles) {
    var ps = this.parent.data.pp.socialProfiles;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (p.typeId == this.network && (p.id || p.username || p.url)) {
        this.sources_.push(new ydn.social.PiplProfile(this.network, p));
        break;
      }
    }
  }
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

