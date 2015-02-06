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
goog.require('ydn.social');
goog.require('ydn.social.MetaProfile');



/**
 * Contact data obtained from social web sites.
 * @param {CrmApp.MetaContact} data
 * @param {string=} opt_email target email.
 * @constructor
 * @struct
 */
ydn.social.MetaContact = function(data, opt_email) {
  /**
   * @final
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
  return ydn.msg.getChannel().send(ydn.crm.ch.Req.SOCIAL_PROFILE, {
    'email': email
  }).addCallbacks(function(data) {
    if (ydn.social.MetaContact.DEBUG) {
      // window.console.log(JSON.stringify(data, null, 2));
      window.console.log(data);
    }
    return new ydn.social.MetaContact(data, email);
  }, function(e) {
    return new ydn.social.MetaContact(null, email);
  });
};


/**
 * Get social profile.
 * @param {ydn.social.Network} network
 * @return {?ydn.social.MetaProfile}
 */
ydn.social.MetaContact.prototype.getMetaProfile = function(network) {
  var p = new ydn.social.MetaProfile(this, network);
  if (p.hasProfile()) {
    return p;
  } else {
    return null;
  }
};


/**
 * @return {string}
 */
ydn.social.MetaContact.prototype.getFullName = function() {
  if (this.data.cb && this.data.cb.name) {
    return this.data.cb.name.fullName;
  }
  if (this.data.fc && this.data.fc.contactInfo) {
    return this.data.fc.contactInfo.fullName;
  }
  if (this.data.pp && this.data.pp.person && this.data.pp.person.names) {
    return this.data.pp.person.names[0].display;
  }
  return '';
};


/**
 * Get social profile.
 * @return {string} image src, only https url will be used.
 */
ydn.social.MetaContact.prototype.getPhotoUrl = function() {
  var cb = ydn.social.ClearBitProfile.getPrimaryPhotoUrl(this.data.cb);
  if (cb && /^https:/.test(cb)) {
    return cb;
  }
  var fc = ydn.social.FcProfile.getPrimaryPhotoUrl(this.data.fc);
  if (fc && /^https:/.test(fc)) {
    return fc;
  }
  var pp = ydn.social.PiplProfile.getPrimaryPhotoUrl(this.data.pp);
  if (pp && /^https:/.test(pp)) {
    return pp;
  }
  return '';
};


/**
 * @return {string}
 */
ydn.social.MetaContact.prototype.getBio = function() {
  var cb = ydn.social.ClearBitProfile.getBio(this.data.cb);
  var fc = ydn.social.FcProfile.getBio(this.data.fc);
  if (cb && fc) {
    return cb.length > fc.length ? cb : fc;
  }
  return cb || fc || '';
};


/**
 * @return {string}
 */
ydn.social.MetaContact.prototype.getLocation = function() {
  var arr = [ydn.social.ClearBitProfile.getLocation(this.data.cb),
             ydn.social.FcProfile.getLocation(this.data.fc),
             ydn.social.PiplProfile.getLocation(this.data.pp)];
  var idx = -1;
  for (var i = 0; i < arr.length; i++) {
    if (!arr[i] || arr[i] == 'Global') {
      continue;
    }
    if (idx == -1) {
      idx = 0;
    } else if (arr[i].length > arr[idx].length) {
      idx = i;
    }
  }
  return arr[idx] || '';
};


/**
 * @return {?ydn.social.Profile.Employment}
 */
ydn.social.MetaContact.prototype.getEmployment = function() {
  var cb = ydn.social.ClearBitProfile.getEmployment(this.data.cb);
  return cb || ydn.social.FcProfile.getEmployment(this.data.fc);
};


/**
 * Get miscellaneous information, like sex, age, ethinic.
 * @return {!Object} key are {@link ydn.social.Profile.Topic}
 */
ydn.social.MetaContact.prototype.getTopics = function() {
  var topics = ydn.social.ClearBitProfile.getTopic(this.data.cb);
  var fc = ydn.social.FcProfile.getTopic(this.data.fc);
  for (var key in fc) {
    if (!topics[key]) {
      topics[key] = fc[key];
    }
  }
  return topics;
};

