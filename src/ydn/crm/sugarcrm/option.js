/**
 * @fileoverview Utilities.
 */


goog.provide('ydn.crm.su.option');
goog.require('goog.async.Deferred');
goog.require('ydn.crm.base');
goog.require('ydn.crm.su');


/**
 * Get cache option for a sugarcrm module. Not set by user, default value
 * is applied.
 * @param {ydn.crm.su.ModuleName} m_name module name.
 * @return {goog.async.Deferred<ydn.crm.su.CacheOption>}
 */
ydn.crm.su.option.getCacheOption = function(m_name) {

  var key = ydn.crm.base.ChromeSyncKey.SUGAR_CACHING_OPTION;
  var df = new goog.async.Deferred();
  chrome.storage.sync.get(key, function(obj) {
    var option = !!obj[key] && typeof obj[key] == 'object' ? obj[key] : {};

    if ([ydn.crm.su.CacheOption.FULL, ydn.crm.su.CacheOption.PARTIAL,
          ydn.crm.su.CacheOption.OPPORTUNISTIC,
          ydn.crm.su.CacheOption.NONE].indexOf(option[m_name]) >= 0) {
      df.callback(option[m_name]);
    } else {
      // provide with default option.
      if (ydn.crm.su.SyncModules.indexOf(m_name) >= 0) {
        df.callback(ydn.crm.su.CacheOption.FULL);
      } else if (ydn.crm.su.PartialSyncModules.indexOf(m_name) >= 0) {
        df.callback(ydn.crm.su.CacheOption.PARTIAL);
      } else {
        df.callback(ydn.crm.su.CacheOption.OPPORTUNISTIC);
      }
    }
  });
  return df;
};


/**
 * Set cache option for a sugarcrm module.
 * @param {ydn.crm.su.ModuleName} m_name module name.
 * @param {ydn.crm.su.CacheOption} opt option.
 *  @return {goog.async.Deferred<boolean>} if setting changed.
 */
ydn.crm.su.option.setCacheOption = function(m_name, opt) {

  if ([ydn.crm.su.CacheOption.FULL, ydn.crm.su.CacheOption.PARTIAL,
        ydn.crm.su.CacheOption.OPPORTUNISTIC,
        ydn.crm.su.CacheOption.NONE].indexOf(opt) == -1) {
    throw new Error('invalid option ' + opt);
  }

  var key = ydn.crm.base.ChromeSyncKey.SUGAR_CACHING_OPTION;
  var df = new goog.async.Deferred();
  chrome.storage.sync.get(key, function(obj) {
    var option = !!obj[key] && typeof obj[key] == 'object' ? obj[key] : {};
    var to_def = false;
    if (opt == ydn.crm.su.CacheOption.FULL && ydn.crm.su.SyncModules.indexOf(m_name) >= 0) {
      to_def = true;
    } else if (opt == ydn.crm.su.CacheOption.PARTIAL && ydn.crm.su.PartialSyncModules.indexOf(m_name) >= 0) {
      to_def = true;
    } else if (opt == ydn.crm.su.CacheOption.OPPORTUNISTIC) {
      to_def = true;
    }
    if (option[m_name] != opt) {
      if (to_def) {
        delete option[m_name];
      } else {
        option[m_name] = opt;
      }
      obj[key] = option;
      chrome.storage.sync.set(obj, function() {
        df.callback(true);
      });
    } else {
      df.callback(false);
    }
  });
  return df;
};


/**
 * Get list of cache modules.
 * @return {goog.async.Deferred<Array<ydn.crm.su.ModuleName>>}
 */
ydn.crm.su.option.listCacheModule = function() {
  var key = ydn.crm.base.ChromeSyncKey.SUGAR_CACHING_OPTION;
  var df = new goog.async.Deferred();
  chrome.storage.sync.get(key, function(obj) {
    var option = !!obj[key] && typeof obj[key] == 'object' ? obj[key] : {};
    var arr = ydn.crm.su.SyncModules.concat(ydn.crm.su.PartialSyncModules);
    for (var mn in option) {
      var idx = arr.indexOf(mn);
      if (option[mn] == ydn.crm.su.CacheOption.FULL ||
          option[mn] == ydn.crm.su.CacheOption.PARTIAL) {
        if (idx == -1) {
          arr.push(mn);
        }
      } else {
        if (idx >= 0) {
          goog.array.removeAt(arr, idx);
        }
      }
    }
    df.callback(arr);
  });
  return df;
};

