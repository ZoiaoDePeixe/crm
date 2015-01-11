/**
 * @fileoverview Define SugarCRM meta data.
 */


goog.provide('ydn.crm.sugarcrm');


/**
 * @define {boolean} running in raw mode.
 */
ydn.crm.sugarcrm.RAW = false;


/**
 * @define {string} version major.
 */
ydn.crm.sugarcrm.VERSION_MAJOR = '';


/**
 * @define {string} version minor.
 */
ydn.crm.sugarcrm.VERSION_MINOR = '';


/**
 * @define {string} version patch.
 */
ydn.crm.sugarcrm.VERSION_PATCH = '';


/**
 * @const
 * @type {string}
 */
ydn.crm.sugarcrm.version = ydn.crm.sugarcrm.VERSION_MAJOR + '.' +
    ydn.crm.sugarcrm.VERSION_MINOR + '.' +
    ydn.crm.sugarcrm.VERSION_PATCH;


/**
 * @const
 * @type {string}
 */
ydn.crm.sugarcrm.VER = '0.12.4';


/**
 * @enum {string}
 */
ydn.crm.sugarcrm.Version = {
  PREVIOUS: '0.10.17',
  STABLE: ydn.crm.sugarcrm.VER,
  RC: ydn.crm.sugarcrm.VER,
  BETA: ydn.crm.sugarcrm.VER,
  EDGE: 'edge'
};


/**
 * @enum {string}
 */
ydn.crm.sugarcrm.ModuleName = {
  ACCOUNTS: 'Accounts',
  CALLS: 'Calls',
  CAMPAIGNS: 'Campaigns',
  CONTACTS: 'Contacts',
  DOCUMENTS: 'Documents',
  MEETINGS: 'Meetings',
  EMAILS: 'Emails',
  EMAIL_TEXT: 'EmailText',
  EMAIL_TEMPLATES: 'EmailTemplates',
  EMPLOYEES: 'Employees',
  LEADS: 'Leads',
  NOTES: 'Notes',
  OPPORTUNITIES: 'Opportunities',
  TASKS: 'Tasks',
  TEAMS: 'Teams',
  TEAM_SETS: 'TeamSets',
  USERS: 'Users'
};


/**
 * List of modules used in this app.
 * @type {Array.<ydn.crm.sugarcrm.ModuleName>}
 */
ydn.crm.sugarcrm.Modules = [ydn.crm.sugarcrm.ModuleName.ACCOUNTS,
  ydn.crm.sugarcrm.ModuleName.CALLS,
  ydn.crm.sugarcrm.ModuleName.CAMPAIGNS,
  ydn.crm.sugarcrm.ModuleName.CONTACTS,
  ydn.crm.sugarcrm.ModuleName.DOCUMENTS,
  ydn.crm.sugarcrm.ModuleName.MEETINGS,
  ydn.crm.sugarcrm.ModuleName.EMAILS,
  // Note: EMAIL_TEXT is not a separate module but part of EMAILS module
  ydn.crm.sugarcrm.ModuleName.EMAIL_TEMPLATES,
  ydn.crm.sugarcrm.ModuleName.EMPLOYEES,
  ydn.crm.sugarcrm.ModuleName.LEADS,
  ydn.crm.sugarcrm.ModuleName.NOTES,
  ydn.crm.sugarcrm.ModuleName.OPPORTUNITIES,
  ydn.crm.sugarcrm.ModuleName.TASKS,
  ydn.crm.sugarcrm.ModuleName.TEAMS,
  ydn.crm.sugarcrm.ModuleName.TEAM_SETS,
  ydn.crm.sugarcrm.ModuleName.USERS];


/**
 * @param {string} name
 * @return {ydn.crm.sugarcrm.ModuleName}
 */
ydn.crm.sugarcrm.assertModuleName = function(name) {
  goog.asserts.assert(ydn.crm.sugarcrm.Modules.indexOf(name) >= 0, name);
  return /** @type {ydn.crm.sugarcrm.ModuleName} */ (name);
};


/**
 * List of modules that sync. Synchronization will queue in this order.
 * @type {Array.<ydn.crm.sugarcrm.ModuleName>}
 */
ydn.crm.sugarcrm.CacheModules = [ydn.crm.sugarcrm.ModuleName.USERS,
  ydn.crm.sugarcrm.ModuleName.ACCOUNTS,
  ydn.crm.sugarcrm.ModuleName.CONTACTS,
  ydn.crm.sugarcrm.ModuleName.DOCUMENTS,
  ydn.crm.sugarcrm.ModuleName.EMAIL_TEMPLATES,
  ydn.crm.sugarcrm.ModuleName.LEADS,
  ydn.crm.sugarcrm.ModuleName.NOTES,
  ydn.crm.sugarcrm.ModuleName.TASKS,
  ydn.crm.sugarcrm.ModuleName.MEETINGS,
  ydn.crm.sugarcrm.ModuleName.CALLS,
  ydn.crm.sugarcrm.ModuleName.OPPORTUNITIES,
  ydn.crm.sugarcrm.ModuleName.EMAILS
];


/**
 * Primary modules are those direct relationship with contact entry.
 * @const
 * @type {Array.<ydn.crm.sugarcrm.ModuleName>}
 */
ydn.crm.sugarcrm.PRIMARY_MODULES = [ydn.crm.sugarcrm.ModuleName.ACCOUNTS,
  ydn.crm.sugarcrm.ModuleName.CONTACTS,
  ydn.crm.sugarcrm.ModuleName.LEADS];


/**
 * Secondary modules are those having relationship with primary modules.
 * @const
 * @type {Array.<ydn.crm.sugarcrm.ModuleName>}
 */
ydn.crm.sugarcrm.SECONDARY_MODULES = [ydn.crm.sugarcrm.ModuleName.NOTES,
  ydn.crm.sugarcrm.ModuleName.TASKS];


/**
 * Modules represent to people.
 * Note: Ordering is determined by priority of record type when an email identifier
 * is matched among multiple record types.
 * @see on ydn.crm.sugarcrm.model.GDataSugar#updateContext_
 * @const
 * @type {Array.<ydn.crm.sugarcrm.ModuleName>}
 */
ydn.crm.sugarcrm.PEOPLE_MODULES = [
  ydn.crm.sugarcrm.ModuleName.CONTACTS,
  ydn.crm.sugarcrm.ModuleName.LEADS,
  ydn.crm.sugarcrm.ModuleName.ACCOUNTS];


/**
 * Modules showed in inbox sidebar.
 * @const
 * @type {Array.<ydn.crm.sugarcrm.ModuleName>}
 */
ydn.crm.sugarcrm.PANEL_MODULES = [ydn.crm.sugarcrm.ModuleName.CONTACTS,
  ydn.crm.sugarcrm.ModuleName.LEADS];


/**
 * Modules represent simple module.
 * @const
 * @type {Array.<ydn.crm.sugarcrm.ModuleName>}
 */
ydn.crm.sugarcrm.SIMPLE_MODULES = [ydn.crm.sugarcrm.ModuleName.NOTES];


/**
 * Modules supporting edit function.
 * @const
 * @type {Array.<ydn.crm.sugarcrm.ModuleName>}
 */
ydn.crm.sugarcrm.EDITABLE_MODULES = [ydn.crm.sugarcrm.ModuleName.ACCOUNTS,
  ydn.crm.sugarcrm.ModuleName.CONTACTS,
  ydn.crm.sugarcrm.ModuleName.LEADS,
  ydn.crm.sugarcrm.ModuleName.NOTES,
  ydn.crm.sugarcrm.ModuleName.TASKS,
  ydn.crm.sugarcrm.ModuleName.MEETINGS,
  ydn.crm.sugarcrm.ModuleName.CALLS,
  ydn.crm.sugarcrm.ModuleName.OPPORTUNITIES];


/**
 * Modules in activity stream.
 * SugarCE-Full-6.5.16/service/v3/SugarWebServiceUtilv3.php/get_upcoming_activities
 * @const
 * @type {Array.<ydn.crm.sugarcrm.ModuleName>}
 */
ydn.crm.sugarcrm.ACTIVITY_MODULES = [ydn.crm.sugarcrm.ModuleName.MEETINGS,
  ydn.crm.sugarcrm.ModuleName.CALLS,
  ydn.crm.sugarcrm.ModuleName.TASKS,
  ydn.crm.sugarcrm.ModuleName.OPPORTUNITIES
];


/**
 * @param {string} name
 * @return {ydn.crm.sugarcrm.ModuleName}
 */
ydn.crm.sugarcrm.toModuleName = function(name) {
  var idx = ydn.crm.sugarcrm.Modules.indexOf(name);
  goog.asserts.assert(idx >= 0, 'Invalid module name ' + name);
  return ydn.crm.sugarcrm.Modules[idx];
};


/**
 * Check support valid module name.
 * @param {string} name
 * @return {boolean}
 */
ydn.crm.sugarcrm.isValidModule = function(name) {
  return ydn.crm.sugarcrm.Modules.indexOf(name) >= 0;
};


/**
 * Convert SugarCRM boolean string to boolean.
 * @param {SugarCrm.Boolean} value
 * @return {boolean}
 */
ydn.crm.sugarcrm.toBoolean = function(value) {
  if (value == '1') {
    return true;
  } else {
    return false;
  }
};


/**
 * Get url for contact entry of given id for sugarcrm version 6
 * @param {string} base_url
 * @param {string} m_name
 * @param {string} id
 * @return {string}
 */
ydn.crm.sugarcrm.getViewLinkV6 = function(base_url, m_name, id) {
  return base_url + '/index.php?module=' + m_name +
      '&action=DetailView&record=' + id;
};


/**
 * Get url for contact entry of given id for sugarcrm version 7
 * @param {string} base_url
 * @param {string} m_name
 * @param {string} id
 * @return {string}
 */
ydn.crm.sugarcrm.getViewLinkV7 = function(base_url, m_name, id) {
  return base_url + '#' + m_name + '/' + id;
};


/**
 * Convert to two letter module symbol, such as, Co, Le.
 * @param {ydn.crm.sugarcrm.ModuleName} m_name module name.
 * @return {string} module symbol.
 */
ydn.crm.sugarcrm.toModuleSymbol = function(m_name) {
  return m_name ? m_name.substr(0, 2) : '';
};


/**
 * @const
 * @type {ydn.crm.sugarcrm.ModuleName} Default module when no module name
 * is defined in new record panel, etc.
 */
ydn.crm.sugarcrm.DEFAULT_MODULE = ydn.crm.sugarcrm.ModuleName.LEADS;


/**
 * SugarCRM module has nasty habit of not declearing group name if previous
 * field name is similar to previous field name.
 * Also name, first_name, and last_name, full_name are not into name group.
 * email, email1, email2, etc are gorup into email.
 * @param {SugarCrm.ModuleInfo} info
 */
ydn.crm.sugarcrm.fixSugarCrmModuleMeta = function(info) {
  var last_field_name = '';
  var last_group = '';
  for (var name in info.module_fields) {
    /**
     * @type {SugarCrm.ModuleField}
     */
    var mf = info.module_fields[name];

    // fix calculated field
    if (['created_by', 'created_by_name', 'date_entered', 'date_modified',
      'deleted', 'modified_user_id', 'modified_by_name',
      'id'].indexOf(name) >= 0) {
      mf.calculated = true;
    }

    // fix group assignment
    if ([ydn.crm.sugarcrm.ModuleName.CALLS, ydn.crm.sugarcrm.ModuleName.MEETINGS,
          ydn.crm.sugarcrm.ModuleName.TASKS].indexOf(info.module_name) >= 0 &&
        ['date_start', 'date_end', 'date_due', 'duration_hours', 'duration_minutes'
        ].indexOf(name) >= 0) {
      mf.group = 'appointment';
    } else if (['salutation', 'name', 'last_name', 'first_name', 'full_name'
    ].indexOf(name) >= 0) {
      mf.group = 'name';
    } else if (['assigned_user_name'].indexOf(name) >= 0) {
      mf.group = 'assigned_user_name';
    } else if (/^email\d?$/.test(name)) {
      mf.group = 'email';
    } else if (/^phone?/.test(name)) {
      mf.group = 'phone';
    } else if (!mf.group && goog.string.startsWith(name, last_field_name)) {
      mf.group = last_group;
      continue;
    }
    last_field_name = name;
    last_group = mf.group;

  }
  // fix link field that does not have module name
  for (var name in info.link_fields) {
    /**
     * @type {SugarCrm.LinkField}
     */
    var lf = info.link_fields[name];
    if (name == 'contact' && !lf.module) {
      lf.module = 'Contacts';
    }
  }
  // console.log(info);
};
