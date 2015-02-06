/**
 * @fileoverview Login task.
 */

goog.provide('ydn.crm.inj.task.Login');
goog.require('templ.ydn.crm.inj');
goog.require('ydn.crm.inj.Task');



/**
 * @extends {ydn.crm.inj.Task}
 * @param {ydn.crm.inj.SugarPanel} widget
 * @constructor
 */
ydn.crm.inj.task.Login = function(widget) {
  goog.base(this);
  /**
   * @type {ydn.crm.inj.SugarPanel}
   */
  this.parent = widget;
  /**
   * @protected
   * @type {Element}
   */
  this.root = document.createElement('div');
  goog.soy.renderElement(this.root, templ.ydn.crm.inj.loginTaskPanel);
  goog.style.setElementShown(this.root, false);
};
goog.inherits(ydn.crm.inj.task.Login, ydn.crm.inj.Task);


/**
 * Initialize ui.
 */
ydn.crm.inj.task.Login.prototype.init = function(ele) {
  goog.asserts.assert(!this.root.parentElement);
  ele.appendChild(this.root);
  this.refresh();
};


/**
 * Refresh login status.
 */
ydn.crm.inj.task.Login.prototype.refresh = function() {
  var msg = new ydn.msg.Message(ydn.crm.ch.Req.LOGIN_INFO, function(info) {
    var ele_domain = this.root.children[0].children[1];
    var ele_username = this.root.children[1].children[1];
    var ele_password = this.root.children[2].children[1];
    if (msg.isError()) {
      var dm = this.parent.getDomainName();
      if (dm) {
        ele_domain.textContent = 'https://' + dm;
        ele_domain.setAttribute('disable', '');
      } else {
        ele_domain.removeAttribute('disable');
      }
      goog.style.setElementShown(this.root, true);
    } else {
      ele_username.textContent = info['username'];
      goog.style.setElementShown(this.root, false);
    }
  }, this);
  this.parent.getChannel().send(msg);
};


/**
 * @inheritDoc
 */
ydn.crm.inj.task.Login.prototype.disposeInternal = function() {
  this.parent = null;
  this.root.parentElement.removeNode(this.root);
  this.root = null;
};

