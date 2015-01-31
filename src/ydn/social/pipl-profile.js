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

goog.provide('ydn.social.PiplProfile');
goog.require('ydn.social.FcProfile');



/**
 * FullContact social network profile.
 * @param {ydn.social.Network} network
 * @param {!CrmApp.FullContact2SocialProfile} data
 * @constructor
 * @struct
 * @extends {ydn.social.FcProfile}
 */
ydn.social.PiplProfile = function(network, data) {
  goog.base(this, network, data);
};
goog.inherits(ydn.social.PiplProfile, ydn.social.FcProfile);


/**
 * @override
 */
ydn.social.PiplProfile.prototype.getSourceName = function() {
  return 'Pipl';
};



