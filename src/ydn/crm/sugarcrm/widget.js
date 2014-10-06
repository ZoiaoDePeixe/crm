/**
 * @fileoverview SugarCRM credential widget.
 */


goog.provide('ydn.crm.sugarcrm.Widget');
goog.require('ydn.crm.sugarcrm.WidgetModel');



/**
 * GData credential widget.
 * @param {ydn.crm.sugarcrm.WidgetModel} model
 * @param {boolean=} opt_hide_title
 * @constructor
 * @struct
 */
ydn.crm.sugarcrm.Widget = function(model, opt_hide_title) {
  /**
   * @protected
   * @type {ydn.crm.sugarcrm.WidgetModel}
   */
  this.model = model;
  /**
   * @type {Element}
   */
  this.root = document.createElement('div');
  this.hide_title_ = !!opt_hide_title;
  /**
   * Display number of records in cached modules.
   * @type {boolean}
   */
  this.show_stats = false;
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.sugarcrm.Widget.DEBUG = true;


/**
 * @return {ydn.crm.sugarcrm.WidgetModel}
 */
ydn.crm.sugarcrm.Widget.prototype.getModel = function() {
  return this.model;
};


/**
 * @param {ydn.crm.sugarcrm.WidgetModel} model
 */
ydn.crm.sugarcrm.Widget.prototype.setModel = function(model) {
  this.model = model;
  this.refresh();
};


/**
 * @param {Element} ele
 */
ydn.crm.sugarcrm.Widget.prototype.render = function(ele) {

  var template = ydn.ui.getTemplateById('sugarcrm-template').content;
  this.root.appendChild(template.cloneNode(true));

  var a_revoke = this.root.querySelector('a[name=remove]');
  a_revoke.addEventListener('click', this.remove_.bind(this), true);

  var a_grant = this.root.querySelector('#grant-host-permission > button');
  a_grant.onclick = this.handleHostPermissionRequest_.bind(this);

  var input_domain = this.root.querySelector('input[name=domain]');
  input_domain.onblur = this.onDomainBlur.bind(this);

  var input_baseurl = this.root.querySelector('input[name=baseurl]');
  input_baseurl.value = '';

  var btn_new_sugar = this.root.querySelector('button');
  btn_new_sugar.onclick = this.handleLogin.bind(this);
  var me = this;
  this.root.addEventListener('keypress', function(e) {
    if (e.keyCode == 13) {
      me.handleLogin(e);
    }
  }, false);

  if (this.hide_title_) {
    this.root.querySelector('h3').style.display = 'none';
  }

  ele.appendChild(this.root);

  this.refresh();
};


/**
 * Handle on domain blur.
 * @param {Event} e
 */
ydn.crm.sugarcrm.Widget.prototype.onDomainBlur = function(e) {
  var input = this.root.querySelector('input[name="domain"]');
  var ele_message = input.nextElementSibling;
  ele_message.textContent = '';
  ele_message.className = '';
  var domain = input.value.trim();
  if (!domain) {
    return;
  }

  this.model.setInstanceUrl(domain).addCallbacks(function(info) {
    var input_baseurl = this.root.querySelector('input[name=baseurl]');
    input_baseurl.value = '';
    ele_message.textContent = 'SugarCRM ' + info.flavor + ' ' + info.version;
    ele_message.className = '';
    if (info['baseUrl']) {
      input_baseurl.value = info['baseUrl'];
    }
    ele_message.removeAttribute('title');
  }, function(e) {
    ele_message.textContent = e.name;
    ele_message.className = 'error';
    ele_message.setAttribute('title', e.message || '');
  }, this);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.sugarcrm.Widget.prototype.handleHostPermissionRequest_ = function(e) {
  e.preventDefault();
  this.model.requestHostPermission(function(grant) {
    if (grant) {
      var a = this.root.querySelector('#grant-host-permission');
      a.style.display = 'none';
    }
  }, this);

};


/**
 * Revoke credential.
 * @param {Event} e
 * @private
 */
ydn.crm.sugarcrm.Widget.prototype.remove_ = function(e) {
  e.preventDefault();
  var a = e.target;
  var domain = this.model.getDomain();
  ydn.msg.getChannel().send('remove-sugar', domain).addCallback(function(data) {
    this.root.style.display = 'none';
    window.location.reload();
  }, this);
  a.href = '';
  a.onclick = null;
  a.textContent = 'removing...';
};


/**
 * Refresh the data.
 */
ydn.crm.sugarcrm.Widget.prototype.refresh = function() {
  var h3 = this.root.querySelector('h3');
  if (!this.model.getDomain()) {
    h3.textContent = 'Add a new SugarCRM instance';
  } else {
    h3.textContent = 'SugarCRM';
  }
  var about = this.model.getDetails();
  var login_panel = this.root.querySelector('div[name=login-panel]');
  var info_panel = this.root.querySelector('div[name=info-panel]');
  var remove_panel = this.root.querySelector('div[name=remove-panel]');
  var permission_panel = this.root.querySelector('#grant-host-permission');
  if (ydn.crm.sugarcrm.Widget.DEBUG) {
    window.console.log('refreshing', about);
  }
  if (about) {
    if (about.isLogin) {
      var a = info_panel.querySelector('a[name=instance]');
      a.textContent = about.baseUrl;
      a.href = about.baseUrl;
      a.target = about.domain;
      info_panel.querySelector('span[name=user]').textContent = about.userName;
      this.model.getInfo().addCallback(function(info) {
        var info_div = info_panel.querySelector('span[name=instance-info]');
        if (info && !(info instanceof Error)) {
          info_div.textContent = info.version + ' ' + info.flavor;
        }
        this.showStats();
      }, this);
      this.model.hasHostPermission(function(grant) {
        permission_panel.style.display = grant ? 'none' : '';
      }, this);
      login_panel.style.display = 'none';
      info_panel.style.display = '';
      remove_panel.style.display = '';
    } else {
      // baseUrl ?
      login_panel.querySelector('#sugarcrm-domain').value = about.baseUrl;
      login_panel.querySelector('#sugarcrm-username').value = about.userName;
      login_panel.style.display = '';
      permission_panel.style.display = 'none';
      info_panel.style.display = 'none';
      remove_panel.style.display = '';
    }
  } else {
    login_panel.style.display = '';
    info_panel.style.display = 'none';
    remove_panel.style.display = 'none';
  }
};


/**
 * Display number of records in cached modules.
 * @param {boolean=} opt_val
 */
ydn.crm.sugarcrm.Widget.prototype.showStats = function(opt_val) {
  if (goog.isDef(opt_val)) {
    this.show_stats = opt_val;
  }
  var stats = this.root.querySelector('div[name=stats-panel]');
  if (this.show_stats && this.model.isLogin()) {
    this.model.getChannel().send(ydn.crm.Ch.SReq.STATS).addCallback(function(arr) {
      var ul = stats.querySelector('ul');
      ul.innerHTML = '';
      console.log(arr);
      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        var li = document.createElement('li');
        var span = document.createElement('span');
        span.textContent = obj['count'] + ' ' + obj['module'];
        li.appendChild(span);
        var last = new Date(obj['updated']);
        if (last.getTime()) {
          var last_span = document.createElement('span');
          last_span.textContent = ', checked on ' + last.toLocaleString();
          last_span.setAttribute('title', 'Last synchronized time');
          li.appendChild(last_span);
        }
        var modified = new Date(obj['modified']);
        if (modified.getTime()) {
          var modify_span = document.createElement('span');
          modify_span.textContent = ', last updated on ' + modified.toLocaleString();
          modify_span.setAttribute('title', 'Last updated time in server');
          li.appendChild(modify_span);
        }
        ul.appendChild(li);
      }
    }, this);
    goog.style.setElementShown(stats, true);
  } else {
    goog.style.setElementShown(stats, false);
  }
};


/**
 * Handle login button click.
 * @param {Event} e
 */
ydn.crm.sugarcrm.Widget.prototype.handleLogin = function(e) {
  var root = this.root;
  var ele_msg = root.querySelector('.message');
  ele_msg.textContent = '';

  var url = root.querySelector('input[name="domain"]').value;
  var username = root.querySelector('input[name="username"]').value;
  var password = root.querySelector('input[name="password"]').value;
  var baseurl = root.querySelector('input[name="baseurl"]').value;
  if (baseurl) {
    url = baseurl;
  }

  var btn_new_sugar = this.root.querySelector('button');
  btn_new_sugar.textContent = 'logging in...';
  btn_new_sugar.setAttribute('disabled', '1');

  var model = this.model;
  chrome.permissions.request(this.model.getPermissionObject(), function(grant) {
    console.log('grant ' + grant);
    model.login(url, username, password).addCallbacks(function(info) {
      window.location.reload();
    }, function(e) {
      btn_new_sugar.removeAttribute('disabled');
      btn_new_sugar.textContent = 'Login';
      ele_msg.textContent = e.name + ': ' + e.message;
    }, this);
  });


};
