// Copyright 2014 YDN Authors. All Rights Reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


/**
 * @fileoverview Hover Context Panel, that how contact information on hovering
 * email on Email thread.
 *
 * Context contact info are display and provides creation of record using the
 * context.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */



goog.provide('ydn.crm.ui.HoverContextPanel');
goog.require('goog.ui.Button');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.Menu');
goog.require('goog.ui.Component');
goog.require('ydn.crm.su.ui.NewRecord');
goog.require('ydn.ui.FlyoutMenu');



/**
 * Hover Context Panel
 * @param {ydn.crm.su.model.Record} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 */
ydn.crm.ui.HoverContextPanel = function(model, opt_dom) {
  goog.base(this, opt_dom);

  var opt = {iconName: 'menu'};
  /**
   * Menu.
   * @type {ydn.ui.FlyoutMenu}
   * @private
   */
  this.menu_ = new ydn.ui.FlyoutMenu(opt, ydn.crm.ui.HoverContextPanel.MENU_ITEMS);

  /**
   * @type {goog.ui.CustomButton}
   * @protected
   */
  this.btn_add = new goog.ui.CustomButton(ydn.crm.ui.HoverContextPanel.getAddLabelFromCmd(
      ydn.crm.ui.HoverContextPanel.Cmd.ADD_CONTACTS));
  this.btn_add.setModel(ydn.crm.ui.HoverContextPanel.Cmd.ADD_CONTACTS);

  /**
   * @type {goog.ui.Menu}
   * @protected
   */
  this.cbm_add = new goog.ui.Menu();

  /**
   * @type {ydn.crm.su.ui.NewRecord}
   * @private
   */
  this.new_record_ = new ydn.crm.su.ui.NewRecord(model, opt_dom);
  this.addChild(this.new_record_, true);

  /**
   * @type {ydn.crm.inj.Context}
   * @private
   */
  this.context_ = null;
  /**
   * @private
   * @type {ydn.gdata.m8.ContactEntry}
   */
  this.gdata_ = null;
};
goog.inherits(ydn.crm.ui.HoverContextPanel, goog.ui.Component);


/**
 * @enum {string}
 */
ydn.crm.ui.HoverContextPanel.Cmd = {
  ADD_CONTACTS: 'add,' + ydn.crm.su.ModuleName.CONTACTS,
  CREATE_CONTACTS: 'new,' + ydn.crm.su.ModuleName.CONTACTS,
  ADD_LEADS: 'add,' + ydn.crm.su.ModuleName.LEADS,
  CREATE_LEADS: 'new,' + ydn.crm.su.ModuleName.LEADS,
  ADD_ACCOUNTS: 'add,' + ydn.crm.su.ModuleName.ACCOUNTS,
  CREATE_ACCOUNTS: 'new,' + ydn.crm.su.ModuleName.ACCOUNTS,
  NEW: 'new'
};


/**
 * @const
 * @type {Array<ydn.ui.FlyoutMenu.ItemOption>}
 */
ydn.crm.ui.HoverContextPanel.MENU_ITEMS = [{
  name: ydn.crm.ui.HoverContextPanel.Cmd.ADD_CONTACTS,
  label: 'Add to Contacts'
},{
  name: ydn.crm.ui.HoverContextPanel.Cmd.ADD_LEADS,
  label: 'Add to Leads'
},{
  name: ydn.crm.ui.HoverContextPanel.Cmd.ADD_ACCOUNTS,
  label: 'Add to Accounts'
},{
  name: ydn.crm.ui.HoverContextPanel.Cmd.NEW,
  label: 'Create...',
  children: [{
    name: ydn.crm.su.ModuleName.CONTACTS,
    label: 'Contacts'
  }, {
    name: ydn.crm.su.ModuleName.LEADS,
    label: 'Leads'
  }, {
    name: ydn.crm.su.ModuleName.ACCOUNTS,
    label: 'Accounts'
  }]
}];


/**
 * @param {ydn.crm.inj.Context} context
 */
ydn.crm.ui.HoverContextPanel.prototype.setContext = function(context) {
  this.context_ = context;
  this.refresh_();
};


/**
 * @return {ydn.crm.inj.Context} context
 */
ydn.crm.ui.HoverContextPanel.prototype.getContext = function() {
  return this.context_;
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.HoverContextPanel.CSS_CLASS = 'hover-context-panel';


/**
 * @inheritDoc
 */
ydn.crm.ui.HoverContextPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.getDomHelper();
  var root = this.getElement();
  root.classList.add(ydn.crm.ui.HoverContextPanel.CSS_CLASS);
  var t = ydn.ui.getTemplateById('hover-context-panel-template').content;
  root.appendChild(t.cloneNode(true));
  var menu_el = root.querySelector('.header .menu-holder');
  this.menu_.render(menu_el);
  goog.style.setElementShown(root, false);
  goog.style.setElementShown(this.getContentElement(), false);

  var footer = root.querySelector('.footer');

  var btn_root = dom.createDom('div');
  footer.appendChild(btn_root);

  this.btn_add.render(btn_root);
  this.btn_add.addClassName('goog-custom-button-collapse-right');

  this.cbm_add.setId('ComboMenu');
  this.cbm_add.addChild(new goog.ui.MenuItem(
      ydn.crm.ui.HoverContextPanel.getAddLabelFromCmd(ydn.crm.ui.HoverContextPanel.Cmd.ADD_LEADS),
      ydn.crm.ui.HoverContextPanel.Cmd.ADD_LEADS), true);
  this.cbm_add.addChild(new goog.ui.MenuItem(
      ydn.crm.ui.HoverContextPanel.getAddLabelFromCmd(ydn.crm.ui.HoverContextPanel.Cmd.ADD_ACCOUNTS),
      ydn.crm.ui.HoverContextPanel.Cmd.ADD_ACCOUNTS), true);

  var cbmb1 = new goog.ui.MenuButton(null, this.cbm_add);
  cbmb1.setPositionElement(this.btn_add.getElement());
  cbmb1.addClassName('goog-menu-button-collapse-left');
  cbmb1.render(btn_root);
  
};


/**
 * @inheritDoc
 */
ydn.crm.ui.HoverContextPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();


  var btn = root.querySelector('.header .menu-holder');
  this.getHandler().listen(btn, 'click', this.onMenuClick_);

  this.getHandler().listen(this.cbm_add, goog.ui.Component.EventType.ACTION,
      this.onAddMenu_);
  this.getHandler().listen(this.btn_add, goog.ui.Component.EventType.ACTION,
      this.onAddButtonClick_);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.HoverContextPanel.prototype.getContentElement = function() {
  return this.getElement().querySelector('.content');
};


/**
 * @param {ydn.crm.ui.HoverContextPanel.Cmd} cmd
 * @return {string}
 */
ydn.crm.ui.HoverContextPanel.getAddLabelFromCmd = function(cmd) {
  var parts = cmd.split(',');
  var prefix = parts[0] == 'new' ? 'Create as ' :
      parts[0] == 'add' ? 'Add as ' : '';
  if (parts[1] == ydn.crm.su.ModuleName.ACCOUNTS) {
    prefix += 'Accounts';
  } else if (parts[1] == ydn.crm.su.ModuleName.LEADS) {
    prefix += 'Leads';
  } else if (parts[1] == ydn.crm.su.ModuleName.CONTACTS) {
    prefix += 'Contacts';
  }
  return prefix;
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.onAddMenu_ = function(e) {
  if (e.target instanceof goog.ui.MenuItem) {
    var item = /** @type {goog.ui.MenuItem} */(e.target);
    var cmd = /** @type {ydn.crm.ui.HoverContextPanel.Cmd} */(item.getModel());
    var old_cmd = /** @type {ydn.crm.ui.HoverContextPanel.Cmd} */(this.btn_add.getModel());
    item.setContent(ydn.crm.ui.HoverContextPanel.getAddLabelFromCmd(old_cmd));
    item.setModel(this.btn_add.getModel());
    this.btn_add.setModel(cmd);
    this.btn_add.setContent(ydn.crm.ui.HoverContextPanel.getAddLabelFromCmd(cmd));
  }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.onAddButtonClick_ = function(e) {
  var cmd = /** @type {ydn.crm.ui.HoverContextPanel.Cmd} */(this.btn_add.getModel());
  this.executeCmd_(cmd);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.onMenuClick_ = function(e) {
  var cmd = this.menu_.handleClick(e);
  if (goog.isString(cmd)) {
    this.executeCmd_(/** @type {ydn.crm.ui.HoverContextPanel.Cmd} */(cmd));
    ydn.crm.shared.logAnalyticValue('ui.hover-context', 'menu.click', cmd);
  }
};


/**
 * @param {ydn.crm.ui.HoverContextPanel.Cmd} cmd
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.executeCmd_ = function(cmd) {
  var parts = cmd.split(',');
  if (parts[0] == 'add') {
    if (parts[1] == ydn.crm.su.ModuleName.CONTACTS) {
      this.addRecord_(ydn.crm.su.ModuleName.CONTACTS);
    } else if (parts[1] == ydn.crm.su.ModuleName.LEADS) {
      this.addRecord_(ydn.crm.su.ModuleName.LEADS);
    } else if (parts[1] == ydn.crm.su.ModuleName.ACCOUNTS) {
      this.addRecord_(ydn.crm.su.ModuleName.ACCOUNTS);
    }
  } else if (parts[0] == 'new') {
    if (parts[1] == ydn.crm.su.ModuleName.CONTACTS) {
      this.newRecord_(ydn.crm.su.ModuleName.CONTACTS);
    } else if (parts[1] == ydn.crm.su.ModuleName.LEADS) {
      this.newRecord_(ydn.crm.su.ModuleName.LEADS);
    } else if (parts[1] == ydn.crm.su.ModuleName.ACCOUNTS) {
      this.newRecord_(ydn.crm.su.ModuleName.ACCOUNTS);
    }
  }

};


/**
 * Apply context data to a new record.
 * @param {ydn.crm.su.ModuleName} mn module name.
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.applyContextToNewRecord_ = function(mn) {

  var domain = this.new_record_.getModel().getDomain();

  var record = new ydn.crm.su.Record(domain, mn);
  this.new_record_.createRecord(record);

  var patch = {
    'email1': this.context_.getEmail()
  };
  var name = this.context_.getFullName();
  var nm = this.new_record_.getModel();
  if (name) {
    patch['name'] = name;
    if (mn == ydn.crm.su.ModuleName.LEADS ||
        mn == ydn.crm.su.ModuleName.CONTACTS) {
      // expand to first_name, last_name, etc in name group.
      var name_group = /** @type {ydn.crm.su.model.NameGroup} */(
          this.new_record_.getModel().getGroupModel('name'));
      var name_patch = name_group.parseFullNameLabel(name);
      if (name_patch) {
        for (var nk in name_patch) {
          patch[nk] = name_patch[nk];
        }
      }
    }
  }
  this.new_record_.simulateEdit(patch);

};


/**
 * Create a new record from context data and save to server.
 * @param {ydn.crm.su.ModuleName} mn module name.
 * @return {!goog.async.Deferred}
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.addRecord_ = function(mn) {
  this.applyContextToNewRecord_(mn);
  return this.new_record_.doSave().addCallback(function(r) {
    var header = this.getElement().querySelector('.header');
    goog.style.setElementShown(header, false);
    goog.style.setElementShown(this.getContentElement(), true);
  }, this);
};


/**
 * Create a new record from context data.
 * @param {ydn.crm.su.ModuleName} mn module name.
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.newRecord_ = function(mn) {

  this.applyContextToNewRecord_(mn);
  this.new_record_.setEditMode(true);

  var header = this.getElement().querySelector('.header');
  goog.style.setElementShown(header, false);
  goog.style.setElementShown(this.getContentElement(), true);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.onTitleClick_ = function(e) {

};


/**
 * Refresh UI.
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.refresh_ = function() {

  var root = this.getElement();
  var content = root.querySelector('.header .header-content');
  var footer = root.querySelector('.footer');
  if (this.context_) {
    // do basic rendering.
    var name = this.context_.getFullName();
    var email = this.context_.getEmail();
    var icon = root.querySelector('.header .icon');
    var a = root.querySelector('.header a');
    goog.style.setElementShown(icon, false);
    a.removeAttribute('href');
    a.removeAttribute('title');
    if (name) {
      a.textContent = name;
      content.textContent = email;
    } else {
      content.textContent = '';
    }
    goog.style.setElementShown(content, !!email);
    goog.style.setElementShown(root, true);
  } else {
    goog.style.setElementShown(root, false);
  }
};

