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

goog.provide('ydn.social.IProfile');



/**
 * Interface for social network profile.
 * @interface
 * @constructor
 */
ydn.social.IProfile = function() {};


/**
 * Profile source name.
 * @return {string}
 */
ydn.social.IProfile.prototype.getSourceName = function() {
};


/**
 * Get screen name.
 * @return {string}
 */
ydn.social.IProfile.prototype.getScreenName = function() {
};


/**
 * Get social network profile URL.
 * @return {string|undefined}
 */
ydn.social.IProfile.prototype.getProfileUrl = function() {
};


/**
 * Get a short summary of the user.
 * @return {string|undefined}
 */
ydn.social.IProfile.prototype.getBio = function() {
};


/**
 * @return {number|undefined}
 */
ydn.social.IProfile.prototype.getFollowers = function() {
};


/**
 * @return {number|undefined}
 */
ydn.social.IProfile.prototype.getFollowing = function() {
};




