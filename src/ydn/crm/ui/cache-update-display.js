/**
 * @fileoverview Display sugarcrm cache update process.
 */


goog.provide('ydn.crm.ui.CacheUpdateDisplay');
goog.require('ydn.msg');
goog.require('ydn.crm.su');



/**
 * Display sugarcrm cache update process.
 * @constructor
 * @struct
 */
ydn.crm.ui.CacheUpdateDisplay = function() {
  /**
   * @type {Element}
   * @private
   */
  this.head_ = document.createElement('div');
  /**
   * @type {Element}
   * @private
   */
  this.body_ = document.createElement('DIV');

  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
  /**
   * @final
   * @type {Array<ydn.crm.ui.CacheUpdateDisplay.Item>}
   */
  this.items = ydn.crm.su.CacheModules.map(function(name) {
    return new ydn.crm.ui.CacheUpdateDisplay.Item(name);
  });
};


/**
 * Render UI.
 * @param {Element} footer_el
 */
ydn.crm.ui.CacheUpdateDisplay.prototype.render = function(footer_el) {
  var button = footer_el.querySelector('.center-item');
  this.body_.style.display = 'none';
  button.appendChild(this.head_);
  this.head_.classList.add('cache-update-display');
  this.head_.setAttribute('title', 'Cache update process not observed.');
  this.head_.innerHTML = `
  <span class="label">-</span>
  <div class="count">
    <div class="sup"></div>
    <div class="sub"></div>
  </div>`;

  footer_el.appendChild(this.body_);
  this.body_.classList.add('cache-update-display-body');
  var ul = document.createElement('UL');
  this.body_.appendChild(ul);
  for (var i = 0; i < this.items.length; i++) {
    this.items[i].render(ul);
  }
  this.handler.listen(ydn.msg.getMain(), ydn.crm.ch.BReq.SUGARCRM_CACHE_UPDATE,
      this.onMessage_);
  this.handler.listen(this.head_, 'click', this.onBtnClick_);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.CacheUpdateDisplay.prototype.onBtnClick_ = function(e) {
  var showing = goog.style.isElementShown(this.body_);
  goog.style.setElementShown(this.body_, !showing);
};


/**
 * @param {ydn.msg.Event} ev
 * @private
 */
ydn.crm.ui.CacheUpdateDisplay.prototype.onMessage_ = function(ev) {
  var data = ev.mesage ? ev.mesage['data'] : null;
  if (data) {
    this.refreshHead_(data);
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].name == data['module']) {
        this.items[i].refresh(data);
      }
    }
  }
};


/**
 * @param {Object} data
 */
ydn.crm.ui.CacheUpdateDisplay.prototype.refreshHead_ = function(data) {

  if (!data['end']) {
    return;
  }
  var label = ydn.crm.su.toModuleSymbol(data['module']);
  this.head_.querySelector('.label').textContent = label;
  this.head_.querySelector('.sub').textContent = data['total'];
  this.head_.querySelector('.sup').textContent = data['count'];
  var title = 'Module ' + data['module'];
  if (data['ok']) {
    title += ' updated on ' + new Date(data['end']).toLocaleTimeString();
  } else {
    title += ' updating fail on ' + new Date(data['end']).toLocaleTimeString();
  }
  this.head_.setAttribute('title', title);
};


/**
 * Panel representing a module.
 * @param {string} mn item name, module name.
 * @constructor
 * @struct
 */
ydn.crm.ui.CacheUpdateDisplay.Item = function(mn) {
  /**
   * @final
   * @type {string}
   */
  this.name = mn;
  this.body_ = document.createElement('LI');
};


/**
 * Render UI.
 * @param {Element} body
 */
ydn.crm.ui.CacheUpdateDisplay.Item.prototype.render = function(body) {

  body.appendChild(this.body_);
  this.body_.classList.add('item-body');
  this.body_.innerHTML = `
  <span name="total"></span> <span>${this.name} records in cache. </span>
   <span name="status"></span>`;
};


/**
 * @param {Object} data
 */
ydn.crm.ui.CacheUpdateDisplay.Item.prototype.refresh = function(data) {
  console.log(data);
  var el_status = this.body_.querySelector('[name=status]');
  if (data['end']) {
    if (data['ok']) {
      el_status.textContent = data['count'] + ' records updated on ' +
          new Date(data['end']).toLocaleTimeString();
    } else {
      el_status.textContent = 'update failed on ' +
          new Date(data['end']).toLocaleTimeString();
    }
  } else {
    el_status.textContent = 'begin updating on ' +
        new Date(data['start']).toLocaleTimeString();
  }
  if (data['total']) {
    this.body_.querySelector('[name=total]').textContent = data['total'];
  }
};


