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
 * @fileoverview Compilation of contact data obtained from social web sites.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.MetaContact');
goog.require('ydn.msg');



/**
 * Contact data obtained from social web sites.
 * @param {CrmApp.MetaContact} data
 * @param {string=} opt_email target email.
 * @constructor
 * @struct
 */
ydn.social.MetaContact = function(data, opt_email) {
  /**
   * @type {!CrmApp.MetaContact}
   */
  this.data = data || /** @type {!CrmApp.MetaContact} */ ({});
  /**
   * @type {?string}
   */
  this.email = opt_email || null;
};


/**
 * @define {boolean} debug flag.
 */
ydn.social.MetaContact.DEBUG = false;


/**
 * @return {?string}
 */
ydn.social.MetaContact.prototype.getFullName = function() {
  if (this.data.fc) {
    return this.data.fc.contactInfo.fullName;
  }
  return null;
};


/**
 * Check any social data is available.
 * @return {boolean}
 */
ydn.social.MetaContact.prototype.hasData = function() {
  return !!this.data.fc;
};


/**
 * Check any social data is available.
 * @return {CrmApp.FullContact2DeducedLocation}
 */
ydn.social.MetaContact.prototype.getLocationDeduced = function() {
  return /** @type {CrmApp.FullContact2DeducedLocation} */ (goog.object.getValueByKeys(
      this.data, 'fc', 'demographics', 'locationDeduced'));
};


/**
 * Fetch contact info by email.
 * @param {string} email
 * @return {!goog.async.Deferred<ydn.social.MetaContact>}
 */
ydn.social.MetaContact.fetchByEmail = function(email) {
  email = email.trim().replace('%40', '@');
  if (email.indexOf('@') == -1 || email.indexOf('.') == -1) {
    return goog.async.Deferred.fail(new Error('Invalid email ' + email));
  }
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.SOCIAL_PROFILE, {
    'email': email
  }).addCallbacks(function(data) {
    if (ydn.social.MetaContact.DEBUG) {
      window.console.log(data);
    }
    return new ydn.social.MetaContact(data, email);
  }, function(e) {
    return new ydn.social.MetaContact(null, email);
  });
};


/**
 * @enum {string}
 */
ydn.social.Network = {
  ANGLE_LIST: 'angellist',
  FACEBOOK: 'facebook',
  G_PLUS: 'googleplus',
  LINKED_IN: 'linkedin',
  MEETUP: 'meetup',
  PINTEREST: 'pinterest',
  TUMBLR: 'tumblr',
  YELP: 'yelp',
  BLOGGER: 'blogger',
  YATHOO: 'yahoo',
  MYSPACE: 'myspace',
  TWITTER: 'twitter'
};


/**
 * List of default networks.
 * @type {Array<ydn.social.Network>}
 */
ydn.social.defaultNetworks = [ydn.social.Network.ANGLE_LIST,
  ydn.social.Network.FACEBOOK, ydn.social.Network.G_PLUS,
  ydn.social.Network.LINKED_IN, ydn.social.Network.TWITTER];


/**
 * Get social profile.
 * @param {ydn.social.Network} network
 * @return {?CrmApp.FullContact2SocialProfile}
 */
ydn.social.MetaContact.prototype.getProfile = function(network) {
  if (this.data && this.data.fc) {
    for (var i = 0; i < this.data.fc.socialProfiles.length; i++) {
      var obj = this.data.fc.socialProfiles[i];
      if (obj && obj.typeId == network) {
        return obj;
      }
    }
  }
  return null;
};


/**
 * @return {number}
 */
ydn.social.MetaContact.prototype.getProfileCount = function() {
  if (this.data && this.data.fc) {
    return this.data.fc.socialProfiles.length;
  } else {
    return 0;
  }
};


/**
 * @param {number} idx
 * @return {CrmApp.FullContact2SocialProfile}
 */
ydn.social.MetaContact.prototype.getProfileAt = function(idx) {
  if (this.data && this.data.fc) {
    return this.data.fc.socialProfiles[idx];
  } else {
    return null;
  }
};


/**
 * Get social profile.
 * @param {ydn.social.Network} network
 * @return {?string} image src, only https url will be used.
 */
ydn.social.MetaContact.prototype.getPhoto = function(network) {
  if (this.data && this.data.fc) {
    for (var i = 0; i < this.data.fc.photos.length; i++) {
      var obj = this.data.fc.photos[i];
      if (obj && obj.typeId == network) {
        if (obj.url && goog.string.startsWith(obj.url, 'https')) {
          return obj.url;
        }
        break;
      }
    }
  }
  return null;
};


/**
 * Get twitter user profile.
 * @param {ydn.social.Network} network
 * @return {!goog.async.Deferred<Object>} Resulting object depends on network.
 */
ydn.social.MetaContact.prototype.getProfileDetail = function(network) {
  var profile = this.getProfile(network);
  if (!profile) {
    return goog.async.Deferred.succeed(null);
  }
  if (!profile.id && !profile.username) {
    return goog.async.Deferred.succeed(null);
  }
  if (network == ydn.social.Network.TWITTER) {
    var tw = {
      'path': 'users/show',
      'user_id': profile.id,
      'screen_name': profile.username
    };
    return ydn.msg.getChannel().send(ydn.crm.Ch.Req.TWITTER, tw);
  } else if (network == ydn.social.Network.ANGLE_LIST) {
    var al = {
      'path': 'users',
      'id': profile.id
    };
    return ydn.msg.getChannel().send(ydn.crm.Ch.Req.ANGLE_LIST, al);
  } else if (network == ydn.social.Network.G_PLUS) {
    var gp = {
      'path': 'people/get',
      'userId': profile.id
    };
    return ydn.msg.getChannel().send(ydn.crm.Ch.Req.G_PLUS, gp);
  } else {
    throw new Error(network);
  }
};


/**
 * @return {!goog.async.Deferred<!Array<Object>>}
 */
ydn.social.MetaContact.prototype.getTweets = function() {
  var profile = this.getProfile(ydn.social.Network.TWITTER);
  if (!profile) {
    return goog.async.Deferred.succeed(null);
  }
  var tw = {
    'path': 'statuses/user_timeline',
    'user_id': profile.id,
    'screen_name': profile.username
  };
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.TWITTER, tw);
};


