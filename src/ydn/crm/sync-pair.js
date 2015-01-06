/**
 * @fileoverview Synchronization pair.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.sync.SyncPair');
goog.require('goog.asserts');
goog.require('ydn.crm.sugarcrm.Record');
goog.require('ydn.gdata.m8.ContactEntry');



/**
 * Synchronization pair.
 * @param {!YdnCrm.SyncRecord} sync
 * @param {!ydn.crm.sugarcrm.Record} record
 * @param {?ContactEntry} entry
 * @constructor
 */
ydn.crm.sync.SyncPair = function(sync, record, entry) {

  /**
   * @final
   * @type {!YdnCrm.SyncRecord}
   */
  this.sync = sync;
  /**
   * @type {!ydn.crm.sugarcrm.Record}
   */
  this.record = record;
  /**
   * @type {!ContactEntry}
   */
  this.entry = entry || /** @type {!ContactEntry} */ ({});
};


/**
 * @typedef {{
 *   domain: string,
 *   module: ydn.crm.sugarcrm.ModuleName,
 *   record_id: string,
 *   entry_id: string
 * }}
 * entry_id: gdata entry id
 */
ydn.crm.sync.SyncPair.KeyComponents;


/**
 * Make key for `YdnCrm.SyncRecord`.
 * @param {string} domain sugarcrm domain.
 * @param {ydn.crm.sugarcrm.ModuleName} mn module name.
 * @param {string} rid sugarcrm record id.
 * @param {string} gmail gdata account user email. may or may not be URI encoded.
 * @param {ydn.gdata.Kind} kind gdata kind
 * @param {string} eid gdata single id
 * @return {string}
 */
ydn.crm.sync.SyncPair.makeKey = function(domain, mn, rid, gmail, kind, eid) {
  if (!domain || !mn || !rid || !gmail || !kind || !eid) {
    throw new Error('Invalid key parts');
  }
  if (ydn.crm.sugarcrm.PEOPLE_MODULES.indexOf(mn) == -1) {
    throw new Error('Invalid module name: ' + mn);
  }
  gmail = gmail.replace('%40', '@');
  if (gmail.indexOf('@') == -1) {
    throw new Error('Invalid gmail: ' + gmail);
  }
  if (kind != ydn.gdata.Kind.M8_CONTACT) {
    throw new Error('Unsupported kind: ' + kind);
  }
  return domain + '/' + mn + '/' + rid + '/' + gmail + '/' + kind + '/' + eid;
};


/**
 * Parse `YdnCrm.SyncRecord into sugarcrm record identifer and gdata entry
 * identifier.
 * @param {string} key
 * @return {ydn.crm.sync.SyncPair.KeyComponents}
 */
ydn.crm.sync.SyncPair.parseKey = function(key) {
  var parts = key.split('/');
  if (parts.length != 6) {
    throw new Error('Invalid SyncRecord key ' + key);
  }
  var gmail = parts[3];
  var kind = parts[4];
  var sid = parts[5];
  // NOTE: this construction only true for contact and group kind.
  // see ydn.gdata.m8.utils.buildFeedUri()
  var eid = 'http://www.google.com/m8/feeds/' + kind + 's/' +
      gmail.replace('@', '%40') + '/base/' + sid;
  return {
    domain: parts[0],
    module: /** @type {ydn.crm.sugarcrm.ModuleName} */ (parts[1]),
    record_id: parts[2],
    entry_id: eid
  };
};


/**
 * @typedef {{
 *   sync: YdnCrm.SyncRecord,
 *   entry: ContactEntry,
 *   record: SugarCrm.Record
 * }}
 */
ydn.crm.sync.EntryRecordPair;
