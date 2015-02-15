/**
 * @fileoverview Define SugarCRM meta data.
 */


goog.provide('ydn.crm.su');


/**
 * @define {boolean} running in raw mode.
 */
ydn.crm.su.RAW = false;


/**
 * @define {string} version major.
 */
ydn.crm.su.VERSION_MAJOR = '';


/**
 * @define {string} version minor.
 */
ydn.crm.su.VERSION_MINOR = '';


/**
 * @define {string} version patch.
 */
ydn.crm.su.VERSION_PATCH = '';


/**
 * @const
 * @type {string}
 */
ydn.crm.su.version = ydn.crm.su.VERSION_MAJOR + '.' +
    ydn.crm.su.VERSION_MINOR + '.' +
    ydn.crm.su.VERSION_PATCH;


/**
 * @const
 * @type {string}
 */
ydn.crm.su.VER = '0.12.4';


/**
 * @enum {string}
 */
ydn.crm.su.Version = {
  PREVIOUS: '0.10.17',
  STABLE: ydn.crm.su.VER,
  RC: ydn.crm.su.VER,
  BETA: ydn.crm.su.VER,
  EDGE: 'edge'
};


/**
 * @enum {string}
 */
ydn.crm.su.ModuleName = {
  ACCOUNTS: 'Accounts',
  CASES: 'Cases',
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
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.Modules = [ydn.crm.su.ModuleName.ACCOUNTS,
  ydn.crm.su.ModuleName.CALLS,
  ydn.crm.su.ModuleName.CAMPAIGNS,
  ydn.crm.su.ModuleName.CASES,
  ydn.crm.su.ModuleName.CONTACTS,
  ydn.crm.su.ModuleName.DOCUMENTS,
  ydn.crm.su.ModuleName.MEETINGS,
  ydn.crm.su.ModuleName.EMAILS,
  // Note: EMAIL_TEXT is not a separate module but part of EMAILS module
  ydn.crm.su.ModuleName.EMAIL_TEMPLATES,
  ydn.crm.su.ModuleName.EMPLOYEES,
  ydn.crm.su.ModuleName.LEADS,
  ydn.crm.su.ModuleName.NOTES,
  ydn.crm.su.ModuleName.OPPORTUNITIES,
  ydn.crm.su.ModuleName.TASKS,
  ydn.crm.su.ModuleName.TEAMS,
  ydn.crm.su.ModuleName.TEAM_SETS,
  ydn.crm.su.ModuleName.USERS];


/**
 * @param {string} name
 * @return {ydn.crm.su.ModuleName}
 */
ydn.crm.su.assertModuleName = function(name) {
  goog.asserts.assert(ydn.crm.su.Modules.indexOf(name) >= 0, name);
  return /** @type {ydn.crm.su.ModuleName} */ (name);
};


/**
 * List of modules that sync. Synchronization will queue in this order.
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.CacheModules = [ydn.crm.su.ModuleName.USERS,
  // sync template first, so that it is appear immediately after login.
  ydn.crm.su.ModuleName.EMAIL_TEMPLATES,
  ydn.crm.su.ModuleName.ACCOUNTS,
  ydn.crm.su.ModuleName.CONTACTS,
  ydn.crm.su.ModuleName.DOCUMENTS,
  ydn.crm.su.ModuleName.LEADS,
  ydn.crm.su.ModuleName.NOTES,
  ydn.crm.su.ModuleName.TASKS,
  ydn.crm.su.ModuleName.MEETINGS,
  ydn.crm.su.ModuleName.CALLS,
  ydn.crm.su.ModuleName.CASES,
  ydn.crm.su.ModuleName.OPPORTUNITIES,
  ydn.crm.su.ModuleName.EMAILS
];


/**
 * Primary modules are those direct relationship with contact entry.
 * @const
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.PRIMARY_MODULES = [ydn.crm.su.ModuleName.ACCOUNTS,
  ydn.crm.su.ModuleName.CONTACTS,
  ydn.crm.su.ModuleName.LEADS];


/**
 * Secondary modules are those having relationship with primary modules.
 * @const
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.SECONDARY_MODULES = [ydn.crm.su.ModuleName.NOTES,
  ydn.crm.su.ModuleName.TASKS];


/**
 * Modules represent to people.
 * Note: Ordering is determined by priority of record type when an email identifier
 * is matched among multiple record types.
 * @see on ydn.crm.su.model.GDataSugar#updateContext_
 * @const
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.PEOPLE_MODULES = [
  ydn.crm.su.ModuleName.CONTACTS,
  ydn.crm.su.ModuleName.LEADS,
  ydn.crm.su.ModuleName.ACCOUNTS];


/**
 * Modules showed in inbox sidebar.
 * @const
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.PANEL_MODULES = [ydn.crm.su.ModuleName.CONTACTS,
  ydn.crm.su.ModuleName.LEADS];


/**
 * Modules represent simple module.
 * @const
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.SIMPLE_MODULES = [ydn.crm.su.ModuleName.NOTES];


/**
 * Modules supporting edit function.
 * @const
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.EDITABLE_MODULES = [ydn.crm.su.ModuleName.ACCOUNTS,
  ydn.crm.su.ModuleName.CALLS,
  ydn.crm.su.ModuleName.CASES,
  ydn.crm.su.ModuleName.CONTACTS,
  ydn.crm.su.ModuleName.LEADS,
  ydn.crm.su.ModuleName.MEETINGS,
  ydn.crm.su.ModuleName.NOTES,
  ydn.crm.su.ModuleName.TASKS];


/**
 * Modules in activity stream.
 * SugarCE-Full-6.5.16/service/v3/SugarWebServiceUtilv3.php/get_upcoming_activities
 * @const
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.ACTIVITY_MODULES = [ydn.crm.su.ModuleName.MEETINGS,
  ydn.crm.su.ModuleName.CALLS,
  ydn.crm.su.ModuleName.TASKS,
  ydn.crm.su.ModuleName.CASES
];


/**
 * Related module from Contacts and Leads.
 * @const
 * @type {Array.<ydn.crm.su.ModuleName>}
 */
ydn.crm.su.relatedModules = [ydn.crm.su.ModuleName.MEETINGS,
  ydn.crm.su.ModuleName.CALLS,
  ydn.crm.su.ModuleName.TASKS,
  ydn.crm.su.ModuleName.CASES,
  ydn.crm.su.ModuleName.OPPORTUNITIES
];


/**
 * @param {string} name
 * @return {ydn.crm.su.ModuleName}
 */
ydn.crm.su.toModuleName = function(name) {
  var idx = ydn.crm.su.Modules.indexOf(name);
  goog.asserts.assert(idx >= 0, 'Invalid module name ' + name);
  return ydn.crm.su.Modules[idx];
};


/**
 * Check support valid module name.
 * @param {string} name
 * @return {boolean}
 */
ydn.crm.su.isValidModule = function(name) {
  return ydn.crm.su.Modules.indexOf(name) >= 0;
};


/**
 * Convert SugarCRM boolean string to boolean.
 * @param {SugarCrm.Boolean} value
 * @return {boolean}
 */
ydn.crm.su.toBoolean = function(value) {
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
ydn.crm.su.getViewLinkV6 = function(base_url, m_name, id) {
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
ydn.crm.su.getViewLinkV7 = function(base_url, m_name, id) {
  return base_url + '#' + m_name + '/' + id;
};


/**
 * Convert to two letter module symbol, such as, Co, Le.
 * @param {ydn.crm.su.ModuleName} m_name module name.
 * @return {string} module symbol.
 */
ydn.crm.su.toModuleSymbol = function(m_name) {
  return m_name ? m_name.substr(0, 2) : '';
};


/**
 * @const
 * @type {ydn.crm.su.ModuleName} Default module when no module name
 * is defined in new record panel, etc.
 */
ydn.crm.su.DEFAULT_MODULE = ydn.crm.su.ModuleName.LEADS;


/**
 * SugarCRM module has nasty habit of not declearing group name if previous
 * field name is similar to previous field name.
 * Also name, first_name, and last_name, full_name are not into name group.
 * email, email1, email2, etc are gorup into email.
 * @param {SugarCrm.ModuleInfo} info
 */
ydn.crm.su.fixSugarCrmModuleMeta = function(info) {
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

    // fix appointment group
    if (['date_start', 'date_end', 'date_due', 'duration_hours',
      'duration_minutes'].indexOf(name) >= 0) {
      mf.group = 'appointment';
    }

    // fix name group
    if ([ydn.crm.su.ModuleName.CONTACTS,
      ydn.crm.su.ModuleName.LEADS].indexOf(info.module_name) >= 0 &&
        ['salutation', 'name', 'last_name', 'first_name', 'full_name'
        ].indexOf(name) >= 0) {
      mf.group = 'name';
    }

    if ([ydn.crm.su.ModuleName.CONTACTS,
      ydn.crm.su.ModuleName.LEADS].indexOf(info.module_name) >= 0 &&
        ['assistant', 'assistant_phone'].indexOf(name) >= 0) {
      mf.group = 'assistant';
    }

    if (['amount', 'amount_usdollar', 'best_case', 'worst_case'].indexOf(name) >= 0) {
      mf.group = 'amount';
    } else if (['assigned_user_name'].indexOf(name) >= 0) {
      mf.group = 'assigned_user_name';
    } else if (['contact_name', 'contact_phone', 'contact_email', 'contact_id'].indexOf(name) >= 0) {
      mf.group = 'contact';
    } else if (['account_name', 'account_name1', 'account_id'].indexOf(name) >= 0) {
      mf.group = 'account';
    } else if (['parent_name', 'parent_type', 'parentt_id'].indexOf(name) >= 0) {
      mf.group = 'parent';
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


/**
 * Event types dispatch from sugar model.
 * @enum {string}
 */
ydn.crm.su.SugarEvent = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  HOST_ACCESS_GRANT: 'hag'
};
