/**
 * @fileoverview String template utilities using ES6.
 *
 * The main reason keeping out ES6 template is, fixjsstyle mess up them.
 */


goog.provide('ydn.crm.templ');


/**
 * @param {Object} r
 * @return {string}
 * @private
 */
ydn.crm.templ.getRecordLabel_ = function(r) {
  if (!r) {
    return '""';
  }
  return '"' + r['name'] + ' (' + r['id'] + ') [modified on: ' + r['date_modified'] + ']"';
};


/**
 * Render UpdatedRecord Audit.
 * @param {string} mn
 * @param {string} chk_lower
 * @param {string} chk_upper
 * @param {Array} arr
 * @return {string} HTML.
 */
ydn.crm.templ.renderUpdatedRecordAudit = function(mn, chk_lower, chk_upper, arr) {
  var meta = arr[0] || {};
  var last_updated_count = meta['last-update-count'] || 0;
  var sync_ts = new Date(meta['updated']).toLocaleString();
  var lower = arr[1];
  var lower_str = ydn.crm.templ.getRecordLabel_(lower);
  var upper = arr[2];
  var upper_str = ydn.crm.templ.getRecordLabel_(upper);
  var total = arr[3];
  var lower_chk_record = arr[4];
  var lower_sync_str = ydn.crm.templ.getRecordLabel_(lower_chk_record);
  var upper_chk_record = arr[5];
  var upper_sync_str = ydn.crm.templ.getRecordLabel_(upper_chk_record);
  var count = arr[6];
  var server_total = arr[7];
  var server_total_inc_deleted = arr[8];
  var server_lower = arr[9];
  var server_lower_str = ydn.crm.templ.getRecordLabel_(server_lower);
  var server_upper = arr[10];
  var server_upper_str = ydn.crm.templ.getRecordLabel_(server_upper);

  return `
  <p>${server_total} (${server_total_inc_deleted} with deleted) ${mn} records on server.
  First modified record: ${server_lower_str}, Last modified record ${server_upper_str}</p>
  <p>${total} ${mn} records cached in browser. First modified record: ${lower_str}, Last modified record ${upper_str}</p>
  <p>${count} records cached in browser are in synced from ${lower_sync_str} to ${upper_sync_str}</p>
  <p>${last_updated_count} records updated from last sync on ${sync_ts}.
  Modified checkpoint lower: ${chk_lower}, upper: ${chk_upper}</p>`;
};


ydn.crm.templ.renderUpdateOptionDialog = function(mn) {

  return `
  <div>
    <p>Record cache update strategy</p>
    <div class="update-strategy">
      <label title="All non-deleted records will be cached in browser."><input type="radio" name="strategy" value="full"/> Full</label>
      <label title="Last 25 recently modified and downloaded records will be cached in browser."><input type="radio" name="strategy" value="partial"/> Recent only</label>
      <label title="Records already downloaded are cached."><input type="radio" name="strategy" value="none"/> Opportunistic</label>
    </div>
  </div>
  <div class="info">Getting info...</div>
  <div>
    <button name="clear" title="Removed downloaded records from cache">Clear cache</button>
    <button name="reset" title="Clear sync checkpoint">Reset checkpoint</button>
    <button name="update" title="Update records from server to cache">Update now</button>
  </div>`;
};


/**
 * @param {string} symbol module symbol, e.g: 'Ac'
 * @param {string} label module label, e.g: 'Accounts'
 * @return {string} HTML.
 */
ydn.crm.templ.renderSugarCrmRecordTile = function(symbol, label) {
  return `<div class="record-tile bg-color" title="View ${label}">
    <span class="symbol" title="View My ${label}">${symbol}</span>
    <div class="favorite" title="View My Favorite ${label}"><svg width="20px" height="20px" viewBox="0 0 24 24">
    <polygon fill="gold" points="12,17.273 18.18,21 16.545,13.971 22,9.244 14.809,8.627 12,2 9.191,8.627 2,9.244 7.455,13.971 5.82,21 "/></svg></div>
  </div>
  <div class="label" title="View All ${label}">${label}</div>`;
};


/**
 * @param {string} symbol module symbol, e.g: 'Ac'
 * @param {string} label module label, e.g: 'Accounts'
 * @return {string} HTML.
 */
ydn.crm.templ.renderSugarCrmModule = function(symbol, label) {
  return `<div class="head">
    <span class="symbol">${symbol}</span>
    <span name="filter"></span>
  </div>
  <div class="content"></div>`;
};


/**
 *
 * @param {string} mn module name, e.g: 'Accounts'
 * @param {string} symbol module symbol, e.g: 'Ac'
 * @return {string} HTML.
 */
ydn.crm.templ.renderRecordListItem = function(mn, symbol) {
  return `<div class="record-item ${mn}">
    <div class="record-header flex-bar">
      <span class="icon">${symbol}</span>
      <span class="center title"></span>
    </div>
    <div class="content">
      <span class="center summary"></span>
    </div>
  </div>`;
};


ydn.crm.templ.renderTrackingLauncher = function() {
  return `<div>
    <span class="opens" title="in last 24 hours">0</span> emails open,
    <span class="clicks" title="in last 24 hours">0</span> links click
    [<a href="#tracking-result" name="view">view</a>]
  </div>`;
};


/**
 * Render SugarCRM setting.
 */
ydn.crm.templ.renderSugarCrmSetting = function() {
  return `<h4>SugarCRM setting</h4>
  <section class="sync-setting-panel"></section>
 `;
};


/**
 * Render SugarCRM setting.
 */
ydn.crm.templ.renderSugarCrmSettingSync = function() {
  return `
    <details name="sync">
      <summary>Synchronization</summary>
      <label><input type="checkbox" name="sync-by-group"/> Synchronize by a Gmail Contact Group</label>

      <select name="sync-group"></select>
      <div name="menu" style="display: none;">
        <p><em>Record context menu options</em></p>
        <label><input type="checkbox" name="export-to-sugarcrm" checked/> Show menu item for exporting Gmail Contacts to SugarCRM Contacts</label>
        <br/>
        <label><input type="checkbox" name="export-to-gdata" checked/> Show menu item for exporting to SugarCRM Contacts to Gmail Contacts</label>
        <br/>
      </div>
      <div>
        <p><button name="sync-reset">Restore default</button></p>
        <p>
          <button name="sync-save">Save</button>
          <button style="display: none;" name="sync-cancel"
            title="Cancel current changes">Reset</button>
        </p>
      </div>
    </details>`;
};
