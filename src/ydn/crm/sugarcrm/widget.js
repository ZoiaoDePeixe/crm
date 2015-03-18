/**
 * @fileoverview SugarCRM credential widget.
 */


goog.provide('ydn.crm.su.Widget');
goog.require('goog.date.relative');
goog.require('ydn.crm.su.WidgetModel');



/**
 * GData credential widget.
 * @param {!ydn.crm.su.WidgetModel} model
 * @param {boolean=} opt_hide_title
 * @constructor
 * @struct
 */
ydn.crm.su.Widget = function(model, opt_hide_title) {
  /**
   * @protected
   * @type {ydn.crm.su.WidgetModel}
   */
  this.model = null;
  /**
   * @type {Element}
   */
  this.root = null;
  this.hide_title_ = !!opt_hide_title;
  /**
   * Display number of records in cached modules.
   * @type {boolean}
   */
  this.show_stats = false;
  this.setModel(model);
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.su.Widget.DEBUG = false;


/**
 * @return {ydn.crm.su.WidgetModel}
 */
ydn.crm.su.Widget.prototype.getModel = function() {
  return this.model;
};


/**
 * @param {goog.events.Event} e
 * @private
 */
ydn.crm.su.Widget.prototype.onLogin_ = function(e) {
  this.refresh();
};


/**
 * @param {ydn.crm.su.WidgetModel} model
 */
ydn.crm.su.Widget.prototype.setModel = function(model) {
  if (this.model === model) {
    return;
  }
  if (this.model) {
    goog.events.unlisten(this.model, ydn.crm.su.SugarEvent.LOGIN, this.onLogin_, false, this);
  }
  this.model = model;
  if (this.model) {
    goog.events.listen(this.model, ydn.crm.su.SugarEvent.LOGIN, this.onLogin_, false, this);
  }
  this.refresh();
};


/**
 * @param {Element} ele
 */
ydn.crm.su.Widget.prototype.render = function(ele) {
  this.root = document.createElement('div');

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

  var detail = this.root.querySelector('details');
  detail.addEventListener('click', this.onDetailsClick_.bind(this), false);

  var clear_cache = this.root.querySelector('button[name=clear-cache]');
  clear_cache.onclick = this.onClearCache_.bind(this);

  var update_now = this.root.querySelector('button[name=update-now]');
  update_now.onclick = this.onUpdateNow_.bind(this);

  ele.appendChild(this.root);

  var hp_btn = this.getHostPermissionBtn_();
  hp_btn.style.display = 'none';
  hp_btn.onclick = this.onHostPermissionBtnClick_.bind(this);

  this.refresh();
};


/**
 * @param {Event} ev
 * @private
 */
ydn.crm.su.Widget.prototype.onClearCache_ = function(ev) {
  var btn = ev.currentTarget;
  btn.setAttribute('disabled', 'disabled');
  this.getModel().getChannel().send(ydn.crm.ch.SReq.CLEAR_CACHE)
      .addBoth(function(e) {
        this.showStats(true).addBoth(function() {
          btn.removeAttribute('disabled');
        });
        if (e && e.message) {
          alert(e.message);
        }
      }, this);
};


/**
 * @param {Event} ev
 * @private
 */
ydn.crm.su.Widget.prototype.onUpdateNow_ = function(ev) {
  var btn = ev.currentTarget;
  btn.setAttribute('disabled', 'disabled');
  this.getModel().getChannel().send(ydn.crm.ch.SReq.UPDATE_NOW)
      .addBoth(function(e) {
        this.showStats(true).addBoth(function() {
          btn.removeAttribute('disabled');
        });
        if (e && e.message) {
          alert(e.message);
        }
      }, this);
};


/**
 * @param {Event} ev
 * @private
 */
ydn.crm.su.Widget.prototype.onDetailsClick_ = function(ev) {
  var is_open = !ev.currentTarget.hasAttribute('open');
  if (is_open) {
    this.showStats(true);
  }
};


/**
 * @param {string} domain
 * @private
 */
ydn.crm.su.Widget.prototype.sniffServerInfo_ = function(domain) {
  var input = this.root.querySelector('input[name="domain"]');
  var ele_message = this.root.querySelector('.domain .message');
  ele_message.textContent = '';
  ele_message.className = '';
  this.model.getServerInfo(domain).addCallbacks(function(info) {
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
 * @return {Element}
 * @private
 */
ydn.crm.su.Widget.prototype.getHostPermissionBtn_ = function() {
  return this.root.querySelector('#grant-host-permission');
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.su.Widget.prototype.onHostPermissionBtnClick_ = function(e) {
  var btn = e.target;
  var domain = btn.getAttribute('data-domain');
  if (!domain) {
    btn.style.display = 'none';
    return;
  }
  var perm = {
    origins: [domain]
  };
  chrome.permissions.request(perm, (function(grant) {
    btn.setAttribute('data-domain', domain);
    btn.style.display = grant ? 'none' : '';
    if (grant) {
      this.sniffServerInfo_(domain);
    }
  }).bind(this));
};


/**
 * Handle on domain blur.
 * @param {Event} e
 */
ydn.crm.su.Widget.prototype.onDomainBlur = function(e) {
  var input = this.root.querySelector('input[name="domain"]');

  var domain = input.value.trim();
  if (!domain) {
    return;
  }

  var perm = {
    origins: [domain]
  };
  chrome.permissions.request(perm, (function(grant) {
    this.sniffServerInfo_(domain);
    var btn = this.getHostPermissionBtn_();
    btn.setAttribute('data-domain', domain);
    btn.style.display = grant ? 'none' : '';
  }).bind(this));


};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.su.Widget.prototype.handleHostPermissionRequest_ = function(e) {
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
ydn.crm.su.Widget.prototype.remove_ = function(e) {
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
 * @param {SugarCrm.About} about
 * @private
 */
ydn.crm.su.Widget.prototype.renderDetail_ = function(about) {
  var login_panel = this.root.querySelector('div[name=login-panel]');
  var info_panel = this.root.querySelector('div[name=info-panel]');
  var remove_panel = this.root.querySelector('div[name=remove-panel]');
  var permission_panel = this.root.querySelector('#grant-host-permission');
  if (ydn.crm.su.Widget.DEBUG) {
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
          info_div.textContent = (info.version || '') + ' ' + (info.flavor || '');
        }
        var stats = this.root.querySelector('div[name=stats-panel]');
        goog.style.setElementShown(stats, true);
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
 * Refresh the data.
 */
ydn.crm.su.Widget.prototype.refresh = function() {
  if (!this.root) {
    return;
  }
  var h3 = this.root.querySelector('h3');
  if (!this.model.getDomain()) {
    h3.textContent = 'Add a new SugarCRM instance';
  } else {
    h3.textContent = 'SugarCRM';
  }

  var about = this.model.getAbout();
  if (about && !about.isLogin) {
    // in process of logging in.
    this.model.queryDetails().addCallback(function(details) {
      this.renderDetail_(details.about);
    }, this);
  }
  this.renderDetail_(about);
};


/**
 * Display number of records in cached modules.
 * @param {boolean=} opt_val
 * @return {goog.async.Deferred}
 */
ydn.crm.su.Widget.prototype.showStats = function(opt_val) {
  if (goog.isDef(opt_val)) {
    this.show_stats = opt_val;
  }
  var stats = this.root.querySelector('div[name=stats-panel]');
  if (this.show_stats && this.model.isLogin()) {
    goog.style.setElementShown(stats, true);
    var ch = this.model.getChannel();
    return ch.send(ydn.crm.ch.SReq.STATS).addCallback(function(arr) {
      var ul = stats.querySelector('ul');
      ul.innerHTML = '';
      // console.log(arr);
      for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        var li = document.createElement('li');
        var span = document.createElement('span');
        span.textContent = obj['count'] + ' ' + obj['module'];
        li.appendChild(span);
        var last = new Date(obj['updated']);
        var last_time = last.getTime();
        if (last_time) {
          var last_span = document.createElement('span');
          last_span.textContent = ', sync ' + goog.date.relative.format(last_time);
          last_span.setAttribute('title', 'Last synchronized time');
          li.appendChild(last_span);
        }
        var modified = new Date(obj['modified']);
        if (modified.getTime()) {
          var modify_span = document.createElement('span');
          modify_span.textContent = ', last modified on ' + modified.toLocaleString();
          modify_span.setAttribute('title', 'Last modified timestamp in server');
          li.appendChild(modify_span);
        }
        ul.appendChild(li);
      }
    }, this);
  } else {
    goog.style.setElementShown(stats, false);
    return goog.async.Deferred.succeed(null);
  }
};


/**
 * Handle login button click.
 * @param {Event} e
 */
ydn.crm.su.Widget.prototype.handleLogin = function(e) {
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
  btn_new_sugar.setAttribute('disabled', 'disabled');

  var model = this.model;
  var provider = root.querySelector('select[name="sugarcrm-auth"]').value;
  var force = !!e.altKey;
  chrome.permissions.request(this.model.getPermissionObject(), function(grant) {
    // console.log('grant ' + grant);
    if (!grant && !force) {
      ele_msg.textContent = 'Access permission to ' + url + ' is required.';
      return;
    }
    model.login(url, username, password, provider).addCallbacks(function(info) {
      window.location.reload();
    }, function(e) {
      btn_new_sugar.removeAttribute('disabled');
      btn_new_sugar.textContent = 'Login';
      ele_msg.textContent = e.name + ': ' + e.message;
    }, this);
  });


};

