/**
 * @fileoverview Test loader.
 *
 * @suppress {accessControls}
 */


goog.provide('ydn.crm.test');
goog.setTestOnly('ydn.crm.test');
goog.require('ydn.msg.MockPipe');
goog.require('ydn.crm.base');
goog.require('ydn.testing.mockExtension');

ydn.crm.base.SVG_PAGE = '/cwork/image/all-icons.svg';

/**
 * var main = ydn.msg.getChannel();
 */
ydn.crm.test.main = {};


/**
 *
 */
ydn.crm.test.sugar = {};


ydn.crm.test.sugar['about'] = {
  "baseUrl": "https://cjokmo3316.trial.sugarcrm.com",
  "domain": "cjokmo3316.trial.sugarcrm.com",
  "userName": "jane",
  "isLogin": true,
  "hostPermission": true
};


/**
 * main.send('login-info').addBoth(function(x) {console.log(JSON.stringify(x, null, 2))})
 */
ydn.crm.test.main['login-info'] = {
  "Id": {
    "type": "GAE_USER_ID",
    "$t": "114726852735554931402"
  },
  "email": "kyawtun@yathit.com",
  "is_login": true,
  "logout_url": "https://yathit-app.appspot.com/_ah/logout?continue=https://www.google.com/a…://fmhdpfhfppingdiiefgnanjceieflpkj/crm-ex/option-page.html%26service%3Dah",
  "updated": 1407314883814
};


ydn.crm.test.main['list-sugarcrm'] = [
  ydn.crm.test.sugar['about']
];


/**
 * sugar.send('login-user').addBoth(function(x) {console.log(JSON.stringify(x, null, 2))})
 */
ydn.crm.test.sugar['login-user'] = {
  "modified_by_name": "Jen Smith",
  "created_by_name": "Jen Smith",
  "id": "68792b39-91f1-273c-caa7-523cf941d004",
  "user_name": "jane",
  "user_hash": "",
  "system_generated_password": "0",
  "pwd_last_changed": "2013-09-28 20:37:43",
  "authenticate_id": "",
  "sugar_login": "1",
  "picture": "baf1b7f7-8b46-b296-766d-52462d420862",
  "first_name": "Jane",
  "last_name": "Fitzpatrick",
  "full_name": "Jane Fitzpatrick",
  "name": "Jane Fitzpatrick",
  "is_admin": "0",
  "external_auth_only": "0",
  "receive_notifications": "1",
  "description": "",
  "date_entered": "2013-09-21 01:44:05",
  "date_modified": "2013-09-28 20:37:43",
  "modified_user_id": "1",
  "created_by": "1",
  "title": "VP Marketing",
  "department": "Marketing",
  "phone_home": "",
  "phone_mobile": "",
  "phone_work": "",
  "phone_other": "",
  "phone_fax": "",
  "status": "Active",
  "address_street": "Wiltshire Road",
  "address_city": "",
  "address_state": "California",
  "address_country": "USA",
  "address_postalcode": "",
  "UserType": "",
  "default_team": "1",
  "team_id": "1",
  "team_set_id": "1",
  "team_count": "",
  "team_name": "Global",
  "deleted": "0",
  "portal_only": "0",
  "show_on_employees": "1",
  "employee_status": "Active",
  "messenger_id": "",
  "messenger_type": "",
  "reports_to_id": "",
  "reports_to_name": "",
  "email1": "jane@example.com",
  "email": [
    {
      "email_address": "jane@example.com",
      "email_address_caps": "JANE@EXAMPLE.COM",
      "invalid_email": "0",
      "opt_out": "0",
      "date_created": "2013-09-24 18:08:43",
      "date_modified": "2013-09-24 18:08:43",
      "id": "b970d281-8b99-967a-135a-5241d5d1c63d",
      "email_address_id": "b98e09f7-889a-d580-d735-5241d551ba62",
      "bean_id": "68792b39-91f1-273c-caa7-523cf941d004",
      "bean_module": "Users",
      "primary_address": "1",
      "reply_to_address": "0",
      "deleted": "0"
    }
  ],
  "email_link_type": "",
  "is_group": "0",
  "c_accept_status_fields": "",
  "m_accept_status_fields": "",
  "accept_status_id": "",
  "accept_status_name": "",
  "accept_status_calls": "",
  "accept_status_meetings": "",
  "preferred_language": "en_us"
};


/**
 * Initialize mock pipe.
 */
ydn.crm.test.initPipe = function() {

  ydn.msg.main_ = new ydn.msg.MockPipe(ydn.msg.ChannelName.DEV, ydn.crm.test.main,
      ydn.crm.test.sugar);

  var sugars = ydn.crm.test.main['list-sugarcrm'];
  var ch = new ydn.msg.Channel(ydn.msg.main_, ydn.msg.Group.SUGAR, sugars[0].domain);
  ydn.msg.main_.sub_channels_ = {};
  ydn.msg.main_.sub_channels_[ch.id] = ch;
  ydn.msg.Message.counter_ = 0;
};


/**
 * Initialize DOM mock.
 */
ydn.crm.test.initUi = function() {
  ydn.crm.ui.svg_doc_ = document.implementation.createDocument(
      'http://www.w3.org/2000/svg', 'svg', null);
};


/**
 * Initialize all mock.
 */
ydn.crm.test.init = function() {
// jstestdriver.plugins.async.CallbackPool.TIMEOUT = 3;
  ydn.crm.test.initPipe();
  ydn.crm.test.initUi();
};


/**
 * Load data.
 * @param {string} name JSON file name.
 * @return {!Object}
 */
ydn.crm.test.getData = function(name) {
  var data;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/cwork/crm/src/ydn/crm/test/' + name + '.json', false);
  xhr.onload = function() {
    data = JSON.parse(xhr.responseText);
  };
  xhr.send(null);
  return data;
};


/**
 * Get mocked pipe.
 * @returns {!ydn.msg.MockPipe}
 */
ydn.crm.test.getMain = function() {
  if (!ydn.msg.main_) {
    ydn.crm.test.initPipe();
  }
  return ydn.msg.main_;
};


/**
 * @return {ydn.crm.sugarcrm.model.GDataSugar}
 */
ydn.crm.test.createGDataSugar = function() {

  var about = ydn.crm.test.sugar.about;
  var modules_info_arr = [];
  for (var x in ydn.crm.test.sugar.modules_info) {
    modules_info_arr.push(ydn.crm.test.sugar.modules_info[x]);
  }
  return new ydn.crm.sugarcrm.model.GDataSugar(about, modules_info_arr, 'test@yathit.com');
};


/**
 * @param {string=} opt_account gmail, default: kyawtun@yathit.com
 * @param {string=} opt_id contact id, default: '1'
 * @returns {{gd$etag: string, id: {$t: string}, updated: {$t: string}, app$edited: {xmlns$app: string, $t: string}, category: {scheme: string, term: string}[], title: {$t: string}, link: *[], gd$name: {gd$fullName: {$t: string}, gd$givenName: {$t: string}, gd$familyName: {$t: string}}, gd$email: {rel: string, address: string, primary: string}[], ydn$emails: string[], ydn$externalIds: Array}}
 */
ydn.crm.test.createGDataContact = function(opt_account, opt_id) {
  var account = opt_account ? opt_account.replace('@', '%40') : 'kyawtun%40yathit.com';
  var encoded_account = account.replace('@', '%40');
  var id = opt_id || '1';
  var val = {"gd$etag": "\"SHg4cTVSLit7I2A9WhJaF0kPTgE.\"",
    "id": {"$t": "http://www.google.com/m8/feeds/contacts/" + encoded_account + "/base/" + id},
    "updated": {"$t": "2012-10-09T01:25:59.639Z"},
    "title": {"$t": "Kyaw Tun"}, "gd$name": {"gd$fullName": {"$t": "Kyaw Tun"}, "gd$givenName": {"$t": "Kyaw"}, "gd$familyName": {"$t": "Tun"}},
    "gd$email": [
    {"rel": "http://schemas.google.com/g/2005#other", "address": account, "primary": "true"}
  ]};

  return val;
};


/**
 * @return {ydn.crm.sugarcrm.model.Sugar}
 */
ydn.crm.test.createSugar = function() {

  var about = ydn.crm.test.sugar.about;
  var modules_info_arr = [];
  for (var x in ydn.crm.test.sugar.modules_info) {
    modules_info_arr.push(ydn.crm.test.sugar.modules_info[x]);
  }
  return new ydn.crm.sugarcrm.model.Sugar(about, modules_info_arr);
};


/**
 * @return {SugarCrm.Record}
 */
ydn.crm.test.createContactSugarCrmRecord = function() {
  var obj = ydn.crm.test.getData('contact');
  return JSON.parse(JSON.stringify(obj));
};


/**
 * @param {ydn.crm.sugarcrm.model.Sugar=} opt_sugar
 * @param {SugarCrm.Record=} opt_obj provide `{}` to create a empty record.
 * @return {ydn.crm.sugarcrm.model.Record}
 */
ydn.crm.test.createContactRecord = function(opt_sugar, opt_obj) {
  var sugar = opt_sugar || ydn.crm.test.createSugar();
  /**
   * @type {ydn.crm.sugar.ModuleName}
   */
  var m_name = 'Contacts';
  var obj = opt_obj || ydn.crm.test.createContactSugarCrmRecord();
  var r = new ydn.crm.sugarcrm.Record(sugar.getDomain(), m_name, obj);
  return new ydn.crm.sugarcrm.model.Record(sugar, r);
};


/**
 * <pre>
 *   ydn.crm.test.createRecord(null, 'Calls');
 * </pre>
 * @param {ydn.crm.sugarcrm.model.Sugar=} opt_sugar
 * @param {ydn.crm.sugar.ModuleName=} opt_mn
 * @param {(SugarCrm.Record|string)=} opt_obj provide `{}` to create a empty record.
 * use file name for load from file.
 * @return {ydn.crm.sugarcrm.model.Record}
 */
ydn.crm.test.createRecord = function(opt_sugar, opt_mn, opt_obj) {
  var sugar = opt_sugar || ydn.crm.test.createSugar();
  /**
   * @type {ydn.crm.sugarcrm.ModuleName}
   */
  var m_name = opt_mn || ydn.crm.sugarcrm.ModuleName.CONTACTS;
  var obj = opt_obj;
  if (opt_obj) {
    if (goog.isString(opt_obj)) {
      obj = ydn.crm.test.getData(opt_obj);
    }
  } else {
    if (m_name == ydn.crm.sugarcrm.ModuleName.CALLS) {
      obj = ydn.crm.test.getData('call');
    } else if (m_name == ydn.crm.sugarcrm.ModuleName.CONTACTS) {
      obj = ydn.crm.test.getData('contact');
    }
  }
  var r = new ydn.crm.sugarcrm.Record(sugar.getDomain(), m_name, obj);
  return new ydn.crm.sugarcrm.model.Record(sugar, r);
};


ydn.crm.test.sugar['list-module'] = ydn.crm.test.getData('list-module');


ydn.crm.test.sugar.modules_info = ydn.crm.test.getData('module_info');





