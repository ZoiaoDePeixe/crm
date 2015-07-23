/**
 * @fileoverview SugarCRM credential page.
 */


goog.provide('ydn.crm.su.CredentialPage');
goog.require('goog.date.relative');
goog.require('ydn.crm.su.WidgetModel');



/**
 * GData credential widget.
 * @param {!ydn.crm.su.WidgetModel} model
 * @param {boolean=} opt_hide_title
 * @constructor
 * @struct
 */
ydn.crm.su.CredentialPage = function(model, opt_hide_title) {
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
ydn.crm.su.CredentialPage.DEBUG = false;


/**
 * @return {ydn.crm.su.WidgetModel}
 */
ydn.crm.su.CredentialPage.prototype.getModel = function() {
  return this.model;
};


/**
 * @param {goog.events.Event} e
 * @private
 */
ydn.crm.su.CredentialPage.prototype.onLogin_ = function(e) {
  this.refresh();
};


/**
 * @param {ydn.crm.su.WidgetModel} model
 */
ydn.crm.su.CredentialPage.prototype.setModel = function(model) {
  if (this.model === model) {
    return;
  }
  if (this.model) {
    goog.events.unlisten(this.model, ydn.crm.su.SugarEvent.LOGIN,
        this.onLogin_, false, this);
  }
  this.model = model;
  if (this.model) {
    goog.events.listen(this.model, ydn.crm.su.SugarEvent.LOGIN,
        this.onLogin_, false, this);
  }
  this.refresh();
};


/**
 * @param {Element} ele
 */
ydn.crm.su.CredentialPage.prototype.render = function(ele) {
  goog.asserts.assert(!!ele, 'widget el');
  this.root = document.createElement('div');

  var template = ydn.ui.getTemplateById('sugarcrm-template').content;
  this.root.appendChild(template.cloneNode(true));

  ele.appendChild(this.root);

  var a_revoke = this.root.querySelector('a[name=remove]');
  a_revoke.addEventListener('click', this.remove_.bind(this), true);

  var hp_btn = this.getHostPermissionBtn_();
  hp_btn.style.display = 'none';
  hp_btn.onclick = this.onHostPermissionBtnClick_.bind(this);

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

  this.refresh();
};


/**
 * @param {Event} ev
 * @private
 */
ydn.crm.su.CredentialPage.prototype.onClearCache_ = function(ev) {
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
ydn.crm.su.CredentialPage.prototype.onUpdateNow_ = function(ev) {
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
ydn.crm.su.CredentialPage.prototype.onDetailsClick_ = function(ev) {
  var is_open = !ev.currentTarget.hasAttribute('open');
  if (is_open) {
    this.showStats(true);
  }
};


/**
 * @param {string} domain
 * @private
 */
ydn.crm.su.CredentialPage.prototype.sniffServerInfo_ = function(domain) {
  var input = this.root.querySelector('input[name="domain"]');
  var ele_message = this.root.querySelector('.domain [name=message]');
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
ydn.crm.su.CredentialPage.prototype.getHostPermissionBtn_ = function() {
  return this.root.querySelector('[name="grant-host-permission"] button');
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.su.CredentialPage.prototype.onHostPermissionBtnClick_ = function(e) {
  var btn = e.target;
  var domain = btn.getAttribute('data-domain');
  var perm = domain ? this.getPermissionObject(domain) :
      this.model.getPermissionObject();

  if (!perm) {
    btn.style.display = 'none';
    return;
  }

  ydn.msg.getChannel().send(ydn.crm.ch.Req.REQUEST_HOST_PERMISSION,
      perm).addBoth(function(x) {
    var grant = x === true;
    btn.setAttribute('data-domain', domain);
    btn.style.display = grant ? 'none' : '';
    if (grant) {
      this.refresh();
    }
  }, this);
};


/**
 * Normalize object.
 * @param {string} url
 * @return {?chrome.permissions.Permissions} return null if not valid.
 */
ydn.crm.su.CredentialPage.prototype.getPermissionObject = function(url) {
  var uri = new goog.Uri(url);
  var sc = uri.getScheme();
  if (['http', 'https'].indexOf(sc) == -1) {
    return null;
  }
  uri.setPath('/*');
  return {
    'origins': [uri.toString()]
  };
};


/**
 * Handle on domain blur.
 * @param {Event} e
 */
ydn.crm.su.CredentialPage.prototype.onDomainBlur = function(e) {
  var input = this.root.querySelector('input[name="domain"]');

  var domain = input.value.trim();

  var perm = domain ? this.getPermissionObject(domain) :
      this.model.getPermissionObject();
  if (!perm) {
    return;
  }
  ydn.msg.getChannel().send(ydn.crm.ch.Req.REQUEST_HOST_PERMISSION,
      perm).addBoth(function(x) {
    var grant = x === true;

    this.sniffServerInfo_(domain);
    var btn = this.getHostPermissionBtn_();
    btn.setAttribute('data-domain', domain);
    btn.style.display = grant ? 'none' : '';

  }, this);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.su.CredentialPage.prototype.handleHostPermissionRequest_ = function(e) {
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
ydn.crm.su.CredentialPage.prototype.remove_ = function(e) {
  e.preventDefault();
  var a = e.target;
  var domain = this.model.getDomain();
  ydn.msg.getChannel().send(ydn.crm.ch.Req.REMOVE_SUGAR,
      domain).addCallback(function(data) {
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
ydn.crm.su.CredentialPage.prototype.renderDetail_ = function(about) {
  var login_panel = this.root.querySelector('div[name=login-panel]');
  var info_panel = this.root.querySelector('div[name=info-panel]');
  var remove_panel = this.root.querySelector('div[name=remove-panel]');
  var per_panel = this.root.querySelector('[name=grant-host-permission]');
  if (ydn.crm.su.CredentialPage.DEBUG) {
    window.console.log('refreshing', about);
  }
  if (about) {
    if (!about.hostPermission) {
      info_panel.querySelector('a[name=instance]').textContent = about.baseUrl;
      info_panel.querySelector('span[name=user]').textContent = about.userName;
      if (!about.isLogin) {
        info_panel.querySelector('span[name=instance-info]').textContent =
            ' (Not login)';
      }
      this.getHostPermissionBtn_().style.display = '';
      login_panel.style.display = 'none';
      per_panel.style.display = '';
      info_panel.style.display = '';
      remove_panel.style.display = 'none';
    } else if (about.isLogin) {
      var a = info_panel.querySelector('a[name=instance]');
      a.textContent = about.baseUrl;
      a.href = about.baseUrl;
      a.target = about.domain;
      info_panel.querySelector('span[name=user]').textContent = about.userName;
      this.model.getInfo().addCallback(function(info) {
        var info_div = info_panel.querySelector('span[name=instance-info]');
        if (info && !(info instanceof Error)) {
          info_div.textContent = 'SugarCRM ' + (info.version || '') + ' ' +
              (info.flavor || '');
        }
        var stats = this.root.querySelector('div[name=stats-panel]');
        goog.style.setElementShown(stats, true);
      }, this);
      per_panel.style.display = about.hostPermission ? 'none' : '';
      login_panel.style.display = 'none';
      info_panel.style.display = '';
      remove_panel.style.display = '';
    } else {
      // baseUrl ?
      login_panel.querySelector('.sugarcrm-domain').value = about.baseUrl;
      login_panel.querySelector('.sugarcrm-username').value = about.userName;
      login_panel.style.display = '';
      per_panel.style.display = 'none';
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
ydn.crm.su.CredentialPage.prototype.refresh = function() {
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
ydn.crm.su.CredentialPage.prototype.showStats = function(opt_val) {
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
        ydn.crm.su.renderCacheStats(li, obj);
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
ydn.crm.su.CredentialPage.prototype.handleLogin = function(e) {
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

  var model = this.model;
  var provider = root.querySelector('select[name="sugarcrm-auth"]').value;
  var force = !!e.altKey;
  var perm = this.getPermissionObject(url);
  if (!perm) {
    ele_msg.textContent = 'Invalid URL: ' + url;
    return;
  }

  var btn_new_sugar = this.root.querySelector('button');
  btn_new_sugar.textContent = 'logging in...';
  btn_new_sugar.setAttribute('disabled', 'disabled');

  var doLogin = function(grant) {
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
  };

  if (chrome.permissions) {
    ydn.crm.shared.requestPermission(perm, function(grant) {
      doLogin(grant);
    });
  } else {
    ydn.msg.getChannel().send(ydn.crm.ch.Req.REQUEST_HOST_PERMISSION,
        perm).addBoth(function(x) {
      doLogin(x === true);
    });
  }



};

