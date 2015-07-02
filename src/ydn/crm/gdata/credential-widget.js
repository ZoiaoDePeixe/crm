/**
 * @fileoverview Google GData credential widget.
 */


goog.provide('ydn.crm.gdata.CredentialWidget');
goog.require('ydn.msg');
goog.require('ydn.ui');



/**
 * GData credential widget.
 * @param {boolean=} opt_hide_title
 * @constructor
 * @struct
 */
ydn.crm.gdata.CredentialWidget = function(opt_hide_title) {
  /**
   * @protected
   * @type {Element}
   */
  this.root = document.createElement('div');
  this.hide_title_ = !!opt_hide_title;
};


/**
 * @param {Element} ele
 */
ydn.crm.gdata.CredentialWidget.prototype.render = function(ele) {

  var temp = ydn.ui.getTemplateById('gdata-credentail-template').content;
  this.root.appendChild(temp.cloneNode(true));
  ele.appendChild(this.root);

  var a_revoke = this.root.querySelector('a[name=gdata-token-revoke]');
  a_revoke.addEventListener('click', this.revoke_.bind(this), true);

  if (this.hide_title_) {
    this.root.querySelector('h3').style.display = 'none';
  }

};


/**
 * Revoke credential.
 * @param {Event} e
 * @return {boolean} true
 * @private
 */
ydn.crm.gdata.CredentialWidget.prototype.revoke_ = function(e) {
  e.preventDefault();
  var a_revoke = this.root.querySelector('a[name=gdata-token-revoke]');
  var ok = window.confirm('Are you sure you want to revoke your Google offline access token in YDN server?');
  if (ok) {
    ydn.msg.getChannel().send(ydn.crm.ch.Req.TOKEN_REVOKE_GDATA).addCallbacks(function() {
      a_revoke.textContent = 'Done';
      a_revoke.setAttribute('title', 'successfully revoked');
      a_revoke.removeAttribute('href');
    }, function(e) {
      a_revoke.setAttribute('title', 'Fail to revoke, click here to manage in your Google account');
      a_revoke.textContent = 'Manage';
      a_revoke.classList.add('error');
      a_revoke.href = 'https://security.google.com/settings/security/permissions';
    }, this);
  }
  return true;
};


/**
 * Refresh the data.
 * @param {function(this: T, boolean)=} opt_cb return true if has token.
 * @param {T=} opt_scope
 * @template T
 */
ydn.crm.gdata.CredentialWidget.prototype.refresh = function(opt_cb, opt_scope) {
  ydn.msg.getChannel().send(ydn.crm.ch.Req.TOKEN_GDATA, window.location.href).addCallback(function(data) {
    var token = /** @type {YdnApiToken} */ (data);

    var authorize_panel = this.root.querySelector('.authorize');
    var display_panel = this.root.querySelector('.display');

    if (token.has_token) {
      var email = display_panel.querySelector('span[name=email]');
      email.textContent = token.owner_email;
      var scopes = display_panel.querySelector('span[name=scopes]');
      scopes.textContent = token.Scopes.join(', ');
      display_panel.style.display = '';
      authorize_panel.style.display = 'none';
      var admin_manage_token = token.type == 'ENT';
      var el_provider = display_panel.querySelector('[name=auth-provider]');
      var el_revoke = display_panel.querySelector('[name=gdata-token-revoke]');
      if (admin_manage_token) {
        el_provider.textContent = 'Your admin';
        el_revoke.style.display = 'none';
      } else {
        el_provider.textContent = 'You';
        el_revoke.style.display = '';
      }
      if (opt_cb) {
        opt_cb.call(opt_scope, true);
      }
    } else {
      var btn = authorize_panel.querySelector('a');
      if (token.authorize_url) {
        btn.href = token.authorize_url;
        authorize_panel.style.display = '';
      }
      display_panel.style.display = 'none';
      if (opt_cb) {
        opt_cb.call(opt_scope, false);
      }
    }
  }, this);
};


/**
 * Check gdata token.
 * This has to be query only after refresh.
 * @return {boolean}
 */
ydn.crm.gdata.CredentialWidget.prototype.hasCredential = function() {
  var authorize_panel = this.root.querySelector('.authorize');
  return !!authorize_panel.style.display;
};
