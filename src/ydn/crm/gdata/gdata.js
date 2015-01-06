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
 * @fileoverview Utilities.
 */



goog.provide('ydn.crm.sugarcrm.gdata');
goog.require('ydn.crm.sugarcrm.Record');
goog.require('ydn.string');


/**
 * Collect address
 * @param {!Object} obj
 * @param {StructuredPostalAddress} data
 * @param {string} prefix either of 'alt' or 'primary'
 * @return {number} number of changes
 */
ydn.crm.sugarcrm.gdata.collectAddress = function(obj, data, prefix) {
  // https://developers.google.com/gdata/docs/2.0/elements#gdStructuredPostalAddress
  // https://developers.google.com/google-apps/contacts/v3/reference#structuredPostalAddressRestrictions
  var changes = 0;
  if (!data) {
    return changes;
  }
  if (data.gd$city) {
    if (obj[prefix + '_address_city'] != data.gd$city.$t) {
      obj[prefix + '_address_city'] = data.gd$city.$t;
      changes++;
    }
  }
  if (data.gd$country) {
    if (obj[prefix + '_address_country'] != data.gd$country.$t) {
      obj[prefix + '_address_country'] = data.gd$country.$t;
      changes++;
    }
  }
  if (data.gd$postcode) {
    if (obj[prefix + '_address_postalcode'] != data.gd$postcode.$t) {
      obj[prefix + '_address_postalcode'] = data.gd$postcode.$t;
      changes++;
    }
  }
  if (data.gd$region) {
    if (obj[prefix + '_address_state'] != data.gd$region.$t) {
      obj[prefix + '_address_state'] = data.gd$region.$t;
      changes++;
    }
  }
  if (data.gd$street) {
    if (obj[prefix + '_address_street'] != data.gd$street.$t) {
      obj[prefix + '_address_street'] = data.gd$street.$t;
      changes++;
    }
  }
  if (data.gd$housename) {
    if (obj[prefix + '_address_street_2'] != data.gd$neighborhood.$t) {
      obj[prefix + '_address_street_2'] = data.gd$neighborhood.$t;
      changes++;
    }
  }
  if (data.gd$neighborhood) {
    if (obj[prefix + '_address_street_3'] != data.gd$city.$t) {
      obj[prefix + '_address_street_3'] = data.gd$city.$t;
      changes++;
    }
  }
  return changes;
};


/**
 * Collect address
 * @param {!Object} obj
 * @param {StructuredPostalAddress} data
 * @param {string} prefix either of 'alt' or 'primary'
 * @return {number}
 */
ydn.crm.sugarcrm.gdata.compileAddress = function(obj, data, prefix) {
  // https://developers.google.com/gdata/docs/2.0/elements#gdStructuredPostalAddress
  var changes = 0;
  if (!obj) {
    return 0;
  }
  if (!data) {
    data = /** @type {StructuredPostalAddress} */ (/** @type {Object} */ ({}));
  }
  var checkItem = function(name, field) {
    if (obj[prefix + field]) {
      if (!data[name] || data[name].$t != obj[prefix + field]) {
        changes++;
        data[name] = {'$t': obj[prefix + field]};
      }
    }
  };
  checkItem('gd$city', '_address_city');
  checkItem('gd$country', '_address_country');
  checkItem('gd$postcode', '_address_postalcode');
  checkItem('gd$region', '_address_state');
  checkItem('gd$street', '_address_street');
  checkItem('gd$neighborhood', '_address_street_2');
  checkItem('gd$city', '_address_street_3');

  if (changes && !data.rel) {
    if (prefix == 'primary') {
      data.rel = 'http://schemas.google.com/g/2005#work';
      data.primary = 'true';
    } else if (prefix == 'alt') {
      data.rel = 'http://schemas.google.com/g/2005#home';
    } else {
      data.rel = 'http://schemas.google.com/g/2005#other';
    }
  }

  return changes;
};


/**
 * @const
 * @type {boolean}
 */
ydn.crm.sugarcrm.gdata.SYNC_ORGANIZATION = false;


/**
 * Convert GData contact entry to sugarcrm Contacts entry
 * @param {string} domain
 * @param {ydn.crm.sugarcrm.ModuleName} module
 * @param {!ContactEntry} entry
 * @param {!SugarCrm.Record} obj record
 * @return {number} number of changes.
 */
ydn.crm.sugarcrm.gdata.gdataContact2Record = function(domain, module, entry, obj) {
  // https://developers.google.com/gdata/docs/2.0/elements
  // https://developers.google.com/google-apps/contacts/v3/reference
  var changes = 0;

  if (entry.title) {
    if (!obj['name'] || obj['name'] != entry.title.$t) {
      obj['name'] = entry.title.$t;
      changes++;
    }
  }
  // email
  var emails = [];
  var gd$emails = entry.gd$email ?
      goog.isArray(entry.gd$email) ? entry.gd$email : [entry.gd$email] : [];
  for (var i = 0; i < gd$emails.length; i++) {
    var email = gd$emails[i];
    if (email.primary) {
      emails.unshift(email.address);
    } else {
      emails.push(email.address);
    }
  }
  // Note only two emails can be import to sugar
  // email fields is bean array, but ready only?
  if (emails[0] != obj['email1']) {
    changes++;
    obj['email1'] = emails[0];
  }
  if (emails[1] != obj['email2']) {
    changes++;
    obj['email2'] = emails[1];
  }
  if (emails[2] != obj['email_addresses_non_primary']) {
    changes++;
    obj['email_addresses_non_primary'] = emails[2];
  }

  // name
  if (entry.gd$name) {
    if (entry.gd$name.gd$namePrefix) {
      if (obj['salutation'] != entry.gd$name.gd$namePrefix.$t) {
        changes++;
        obj['salutation'] = entry.gd$name.gd$namePrefix.$t;
      }
    }
    if (entry.gd$name.gd$givenName) {
      if (obj['first_name'] != entry.gd$name.gd$givenName.$t) {
        obj['first_name'] = entry.gd$name.gd$givenName.$t;
        changes++;
      }
    }
    if (entry.gd$name.gd$familyName) {
      if (obj['last_name'] != entry.gd$name.gd$familyName.$t) {
        obj['last_name'] = entry.gd$name.gd$familyName.$t;
        changes++;
      }
    }
    if (entry.gd$name.gd$fullName) {
      if (obj['full_name'] != entry.gd$name.gd$fullName.$t) {
        obj['full_name'] = entry.gd$name.gd$fullName.$t;
        changes++;
      }
    }
  } else {
    obj['full_name'] = entry.title.$t;
  }
  if (entry.gd$organization && entry.gd$organization[0]) {
    var org = entry.gd$organization[0];
    if (org.gd$orgTitle && org.gd$orgTitle.$t != obj['title']) {
      obj['title'] = org.gd$orgTitle.$t;
      changes++;
    }
    if (org.gd$orgDepartment && org.gd$orgDepartment.$t != obj['department']) {
      obj['department'] = org.gd$orgDepartment.$t;
      changes++;
    }
    if (org.gd$orgJobDescription && org.gd$orgJobDescription.$t != obj['description']) {
      obj['description'] = org.gd$orgJobDescription.$t;
      changes++;
    }
  }
  if (entry.gd$im) {
    for (var i = 0; i < entry.gd$im.length; i++) {
      if (entry.gd$im[i].label == 'Twitter' && obj['twitter'] != entry.gd$im[i].address) {
        obj['twitter'] = entry.gd$im[i].address;
        changes++;
      } else if (entry.gd$im[i].label == 'Facebook' && obj['facebook'] != entry.gd$im[i].address) {
        obj['facebook'] = entry.gd$im[i].address;
        changes++;
      } else if (entry.gd$im[i].label == 'Google Plus' && obj['googleplus'] != entry.gd$im[i].address) {
        obj['googleplus'] = entry.gd$im[i].address;
        changes++;
      } else if (entry.gd$im[i].label == 'Linkedin' && obj['linkedin'] != entry.gd$im[i].address) {
        obj['linkedin'] = entry.gd$im[i].address;
        changes++;
      }
    }
  }

  if (entry.gContact$birthday) {
    if (obj['birthdate'] != entry.gContact$birthday.when) {
      obj['birthdate'] = entry.gContact$birthday.when;
      changes++;
    }
  }
  // phone number
  var gd$phoneNumber = entry.gd$phoneNumber ?
      goog.isArray(entry.gd$phoneNumber) ? entry.gd$phoneNumber :
          [entry.gd$phoneNumber] : [];
  for (var i = 0; i < gd$phoneNumber.length; i++) {
    var ph = gd$phoneNumber[i];
    if (!ph.$t) {
      continue;
    }
    if (ph.rel == 'http://schemas.google.com/g/2005#mobile') {
      if (obj['phone_mobile'] != ph.$t) {
        obj['phone_mobile'] = ph.$t;
        changes++;
      }
    } else if (ph.rel == 'http://schemas.google.com/g/2005#work') {
      if (obj['phone_work'] != ph.$t) {
        obj['phone_work'] = ph.$t;
        changes++;
      }
    } else if (ph.rel == 'http://schemas.google.com/g/2005#home') {
      if (obj['phone_home'] != ph.$t) {
        obj['phone_home'] = ph.$t;
        changes++;
      }
    } else if (ph.rel == 'http://schemas.google.com/g/2005#fax' ||
        ph.rel == 'http://schemas.google.com/g/2005#home_fax' ||
        ph.rel == 'http://schemas.google.com/g/2005#work_fax') {
      if (obj['phone_fax'] != ph.$t) {
        obj['phone_fax'] = ph.$t;
        changes++;
      }
    } else {
      if (obj['phone_other'] = ph.$t) {
        obj['phone_other'] = ph.$t;
        changes++;
      }
    }
  }

  // addresses
  if (entry.gd$structuredPostalAddress) {
    var primary = -1;
    var alt = -1;
    for (var i = 0; i < entry.gd$structuredPostalAddress.length; i++) {
      var address = entry.gd$structuredPostalAddress[i];
      if (address.rel == 'http://schemas.google.com/g/2005#work' || address.primary) {
        primary = i;
      } else {
        alt = i;
      }
    }
    if (primary == -1) {
      alt = primary;
      alt = -1;
    }
    changes += ydn.crm.sugarcrm.gdata.collectAddress(obj, entry.gd$structuredPostalAddress[primary], 'primary');
    changes += ydn.crm.sugarcrm.gdata.collectAddress(obj, entry.gd$structuredPostalAddress[alt], 'alt');
  }

  return changes;
};


/**
 * To Contact GData entry.
 * @param {!ydn.crm.sugarcrm.Record} sugar_record
 * @param {!ContactEntry} entry
 * @return {number} if changed were made on gdata entry.
 */
ydn.crm.sugarcrm.gdata.record2GDataContact = function(sugar_record, entry) {
  var domain = sugar_record.getDomain();
  var module = sugar_record.getModule();
  var record = sugar_record.getData();
  var changes = 0;

  if (record['name']) {
    if (!entry.title || entry.title.$t != record['name']) {
      entry.title = ydn.atom.Entry.asText(record['name']);
      changes++;
    }
  }

  // Note only three emails can be import to sugar
  var removed_emails = [];
  var done_emails = [];
  /**
   * Find email by rel
   * @param {string} rel
   * @return {number}
   */
  var findEmailByRel = function(rel) {
    for (var i = 0; entry.gd$email && i < entry.gd$email.length; i++) {
      if (done_emails.indexOf(i) >= 0) {
        continue;
      }
      if (entry.gd$email[i].rel == rel) {
        return i;
      }
    }
    return -1;
  };

  /**
   * Find email by rel
   * @param {string} address
   * @return {number}
   */
  var findEmail = function(address) {
    for (var i = 0; entry.gd$email && i < entry.gd$email.length; i++) {
      if (done_emails.indexOf(i) >= 0) {
        continue;
      }
      if (entry.gd$email[i].address == address) {
        return i;
      }
    }
    return -1;
  };

  var checkEmail = function(name, rel) {
    if (record[name]) {
      if (!entry.gd$email) {
        entry.gd$email = [];
      } else if (!goog.isArrayLike(entry.gd$email)) {
        entry.gd$email = [entry.gd$email];
      }
      var idx = findEmail(record[name]);
      if (idx >= 0) {
        var em = entry.gd$email[idx];
        if (em.rel != rel) {
          changes++;
          em.rel = rel;
        }
        done_emails.push(idx);
      } else {
        var em1 = {
          'rel': rel,
          'address': record[name]
        };
        // FIXME: Uncaught TypeError: Object #<Object> has no method 'push'
        entry.gd$email.push(em1);
        done_emails.push(entry.gd$email.length - 1);
        changes++;
      }
    }
  };
  checkEmail('email1', 'http://schemas.google.com/g/2005#work');
  checkEmail('email2', 'http://schemas.google.com/g/2005#home');
  // Note: `email` field is not used in sugarcrm rest api.
  // checkEmail('email', 'http://schemas.google.com/g/2005#other');

  var ensureGdName = function() {
    if (!entry.gd$name) {
      entry.gd$name = /** @type {GDataName} */ (/** @type {Object} */ ({}));
      changes++;
    }
  };
  if (record['salutation']) {
    ensureGdName();
    if (!entry.gd$name.gd$namePrefix || entry.gd$name.gd$namePrefix.$t != record['salutation']) {
      entry.gd$name.gd$namePrefix = ydn.atom.Entry.asText(record['salutation']);
      changes++;
    }
  }
  if (record['first_name']) {
    ensureGdName();
    if (!entry.gd$name.gd$givenName || entry.gd$name.gd$givenName.$t != record['first_name']) {
      entry.gd$name.gd$givenName = ydn.atom.Entry.asText(record['first_name']);
      changes++;
    }
  }
  if (record['last_name']) {
    ensureGdName();
    if (!entry.gd$name.gd$familyName || entry.gd$name.gd$familyName.$t != record['last_name']) {
      entry.gd$name.gd$familyName = ydn.atom.Entry.asText(record['last_name']);
      changes++;
    }
  }
  if (record['full_name']) {
    ensureGdName();
    if (!entry.gd$name.gd$fullName || entry.gd$name.gd$fullName.$t != record['full_name']) {
      entry.gd$name.gd$fullName = ydn.atom.Entry.asText(record['full_name']);
      changes++;
    }
  }

  var ensureGdIm = function() {
    if (!entry.gd$im) {
      entry.gd$im = [];
    }
  };
  /**
   * @param {string} label
   * @return {GdIm}
   */
  var getIm = function(label) {
    ensureGdIm();
    for (var i = 0; i < entry.gd$im.length; i++) {
      if (entry.gd$im[i].label == label) {
        return entry.gd$im[i];
      }
    }
    return null;
  };
  if (record['twitter']) {
    var im = getIm('Twitter');
    if (!im) {
      entry.gd$im.push({'label': 'Twitter', 'address': record['twitter']});
      changes++;
    } else if (im.address != record['twitter']) {
      im.address = record['twitter'];
      changes++;
    }
  }
  if (record['facebook']) {
    var im = getIm('Facebook');
    if (!im) {
      entry.gd$im.push({'label': 'Facebook', 'address': record['facebook']});
      changes++;
    } else if (im.address != record['facebook']) {
      im.address = record['facebook'];
      changes++;
    }
  }
  if (record['googleplus']) {
    var im = getIm('Google Plus');
    if (!im) {
      entry.gd$im.push({'label': 'Google Plus', 'address': record['googleplus']});
      changes++;
    } else if (im.address != record['googleplus']) {
      im.address = record['googleplus'];
      changes++;
    }
  }
  if (record['linkedin']) {
    var im = getIm('Linkedin');
    if (!im) {
      entry.gd$im.push({'label': 'Linkedin', 'address': record['linkedin']});
      changes++;
    } else if (im.address != record['linkedin']) {
      im.address = record['linkedin'];
      changes++;
    }
  }

  if (record['birthdate']) {
    if (!entry.gContact$birthday || entry.gContact$birthday.when != record['birthdate']) {
      entry.gContact$birthday = /** @type {ContactBirthday} */ (/** @type {Object} */ (
          {'when': record['birthdate']}));
      changes++;
    }
  }

  /**
   * @param {string} rel
   * @return {GDataPhoneNumber}
   */
  var getPhoneByRel = function(rel) {
    for (var i = 0; entry.gd$phoneNumber && i < entry.gd$phoneNumber.length; i++) {
      if (entry.gd$phoneNumber[i].rel == rel) {
        return entry.gd$phoneNumber[i];
      }
    }
    return null;
  };

  var checkPhone = function(name, rel) {
    if (record[name]) {
      if (!entry.gd$phoneNumber) {
        entry.gd$phoneNumber = [];
      }
      var ph = getPhoneByRel(rel);
      if (ph) {
        if (ph.$t != record[name]) {
          ph.$t = record[name];
          changes++;
        }
      } else {
        if (!goog.isArray(entry.gd$phoneNumber)) {
          entry.gd$phoneNumber = [entry.gd$phoneNumber];
        }
        entry.gd$phoneNumber.push({
          'rel': rel,
          '$t': record[name]
        });
        changes++;
      }
    }
  };
  checkPhone('phone_mobile', 'http://schemas.google.com/g/2005#mobile');
  checkPhone('phone_work', 'http://schemas.google.com/g/2005#work');
  checkPhone('phone_home', 'http://schemas.google.com/g/2005#home');
  checkPhone('phone_fax', 'http://schemas.google.com/g/2005#work_fax');
  checkPhone('phone_other', 'http://schemas.google.com/g/2005#other');

  var primary_address = -1;
  var alt_address = -1;
  for (var i = 0; entry.gd$structuredPostalAddress && i < entry.gd$structuredPostalAddress.length; i++) {
    if (primary_address == -1 && entry.gd$structuredPostalAddress[i].primary == 'true' ||
        entry.gd$structuredPostalAddress[i].rel == 'http://schemas.google.com/g/2005#work') {
      primary_address = i;
    } else if (alt_address == -1) {
      alt_address = i;
    }
  }
  if (primary_address == -1 && alt_address >= 0) {
    primary_address = alt_address;
    entry.gd$structuredPostalAddress[primary_address].primary = 'true';
    alt_address = -1;
  }

  if (primary_address >= 0) {
    changes += ydn.crm.sugarcrm.gdata.compileAddress(record, entry.gd$structuredPostalAddress[primary_address],
        'primary');
  } else {
    var address = /** @type {StructuredPostalAddress} */ (/** @type {Object} */ ({}));
    address.primary = 'true';
    address.rel = 'http://schemas.google.com/g/2005#work';
    var ch = ydn.crm.sugarcrm.gdata.compileAddress(record, address, 'primary');
    if (ch > 0) {
      if (!entry.gd$structuredPostalAddress) {
        entry.gd$structuredPostalAddress = [];
      }
      entry.gd$structuredPostalAddress.push(address);
      changes += ch;
    }
  }

  if (alt_address >= 0) {
    changes += ydn.crm.sugarcrm.gdata.compileAddress(record, entry.gd$structuredPostalAddress[alt_address],
        'alt');
  } else {
    var address = /** @type {StructuredPostalAddress} */ (/** @type {Object} */ ({}));
    var ch = ydn.crm.sugarcrm.gdata.compileAddress(record, address, 'alt');
    if (ch > 0) {
      if (!entry.gd$structuredPostalAddress) {
        entry.gd$structuredPostalAddress = [];
      }
      entry.gd$structuredPostalAddress.push(address);
      changes += ch;
    }
  }

  return changes;
};


