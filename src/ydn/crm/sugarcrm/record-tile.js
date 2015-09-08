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
 * @fileoverview SugarCRM Record tile inside SugarCRM home page.
 *
 * A tile dispatch click event to Desktop.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.su.ui.RecordTile');
goog.require('goog.ui.Component');
goog.require('ydn.crm.su');
goog.require('ydn.crm.templ');
goog.require('ydn.crm.ui.events');



/**
 * SugarCRM Record tile.
 * @param {!ydn.crm.su.model.Sugar} sugar
 * @param {ydn.crm.su.ModuleName} name module name.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 */
ydn.crm.su.ui.RecordTile = function(sugar, name, opt_dom) {
  goog.base(this, opt_dom);
  /**
   * @type {ydn.crm.su.ModuleName}
   * @protected
   */
  this.name = name;
  this.setModel(sugar);
};
goog.inherits(ydn.crm.su.ui.RecordTile, goog.ui.Component);


/**
 * @return {ydn.crm.su.model.Sugar}
 * @override
 */
ydn.crm.su.ui.RecordTile.prototype.getModel;


/**
 * @inheritDoc
 */
ydn.crm.su.ui.RecordTile.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  root.classList.add('tile-container');
  root.classList.add(this.name);
  var symbol = ydn.crm.su.toModuleSymbol(this.name);
  var model = this.getModel();
  root.innerHTML = ydn.crm.templ.renderSugarCrmRecordTile(symbol, this.name);
  if (!model.isVersion7()) {
    var fav = root.querySelector('.favorite');
    goog.style.setElementShown(fav, false);
  }
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.RecordTile.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var el = this.getElement();
  var tile = el.querySelector('.record-tile');
  var label = el.querySelector('.label');
  this.getHandler().listen(tile, 'click', this.onTileClick_);
  this.getHandler().listen(label, 'click', this.onLabelClick_);

  var act = ydn.crm.su.ACTIVITY_MODULES.indexOf(this.name) >= 0;
  if (act) {
    var delay = Math.random() * 1000;
    setTimeout((function() {
      this.updateUpcoming();
    }).bind(this), delay);
  }

  /**
   * @type {ydn.crm.su.model.Sugar}
   */
  var sugar = this.getModel();
  var av = sugar.getAvailableModule(this.name);
  var can_use = sugar.shouldUseFavoriteEnabled();
  if (av && av.module_label) {
    label.textContent = av.module_label;
    if ((can_use && av.favorite_enabled === false) || sugar.isActionAllow(this.name, 'view') === false) {
      goog.style.setElementShown(el, false);
    }
  }
};


/**
 * @param {goog.events.BrowserEvent} ev
 * @private
 */
ydn.crm.su.ui.RecordTile.prototype.onTileClick_ = function(ev) {
  ev.preventDefault();
  var filter = '';
  var el = ev.target;
  if (el instanceof Element) {
    if (el.classList.contains('count')) {
      filter = ydn.crm.su.RecordFilter.UPCOMING;
    } else if (el.tagName == 'svg' || el.tagName == 'polygon' ||
        el.classList.contains('favorite')) {
      filter = ydn.crm.su.RecordFilter.FAVORITE;
    } else if (el.classList.contains('symbol')) {
      filter = ydn.crm.su.RecordFilter.MY;
    } else if (el.classList.contains('label')) {
      filter = ydn.crm.su.RecordFilter.ALL;
    }
  }
  var data = {
    'module': this.name,
    'filter': filter
  };
  ev.stopPropagation();
  var se = new ydn.crm.ui.events.ShowPanelEvent(
      ydn.crm.ui.PageName.MODULE_HOME, data, this);
  this.dispatchEvent(se);
};


/**
 * @param {goog.events.BrowserEvent} ev
 * @private
 */
ydn.crm.su.ui.RecordTile.prototype.onLabelClick_ = function(ev) {
  var data = {
    'module': this.name,
    'filter': ydn.crm.su.RecordFilter.ALL
  };
  ev.stopPropagation();
  var se = new ydn.crm.ui.events.ShowPanelEvent(
      ydn.crm.ui.PageName.MODULE_HOME, data, this);
  this.dispatchEvent(se);
};


/**
 * Indicate upcoming count as notify number.
 * @param {number} cnt
 */
ydn.crm.su.ui.RecordTile.prototype.dispCount = function(cnt) {
  var count = cnt ? cnt + '' : 'No';

  var root = this.getElement().querySelector('.record-tile');
  var el = root.querySelector('.count');
  if (cnt > 0) {
    if (!el) {
      el = document.createElement('span');
      el.classList.add('count');
      root.appendChild(el);
    }
    if (cnt > 9) {
      el.textContent = '*';
    } else {
      el.textContent = cnt;
    }
    var label;
    if (this.name == ydn.crm.su.ModuleName.CASES) {
      label = chrome.i18n.getMessage('Cases_assign', [count]);
    } else {
      label = chrome.i18n.getMessage('Upcoming_count', [count, this.name]);
    }
    el.setAttribute('title', label);
  } else {
    if (el) {
      root.removeChild(el);
    }
  }
};


/**
 * Update upcoming activities count.
 * This is applicable only for activities modules.
 */
ydn.crm.su.ui.RecordTile.prototype.updateUpcoming = function() {
  goog.asserts.assert(ydn.crm.su.ACTIVITY_MODULES.indexOf(this.name) >= 0);
  this.getModel().getUpcomingActivities(this.name).addCallbacks(function(ans) {
    var query_result = /** @type {Array<!SugarCrm.Record>} */ (ans);
    this.dispCount(query_result.length);
  }, function(e) {
    window.console.error(e);
  }, this);
};
