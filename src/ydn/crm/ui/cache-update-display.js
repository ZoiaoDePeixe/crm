/**
 * @fileoverview Display sugarcrm cache update process.
 */


goog.provide('ydn.crm.ui.CacheUpdateDisplay');
goog.require('ydn.crm.shared');
goog.require('ydn.crm.su');
goog.require('ydn.msg');



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
  this.body_.innerHTML = '<h3>Cache statistics in this browser</h3>' +
      '<ul></ul>';

  this.handler.listen(ydn.msg.getMain(), ydn.crm.ch.BReq.SUGARCRM_CACHE_UPDATE,
      this.onMessage_);
  this.handler.listen(this.head_, 'click', this.onBtnClick_);
  this.handler.listen(this.body_, 'click', this.onBodyClick_);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.CacheUpdateDisplay.prototype.onBodyClick_ = function(e) {
  if (e.target.tagName == 'A') {
    e.preventDefault();
    var a = e.target;
    var mn = a.getAttribute('data-module');
    var val = 0;
    if (mn) {
      var ch = ydn.msg.getMain().findChannel(ydn.msg.Group.SUGAR);
      if (ch) {
        val = 1;
        a.textContent = 'updating...';
        a.href = '';
        var data = {'module': mn};
        ch.send(ydn.crm.ch.SReq.UPDATE_NOW, data).addCallbacks(function(x) {
          a.textContent = 'updated';
          this.showDetails_();
        }, function(e) {
          a.textContent = 'failed';
        }, this);
      }
    }
    ydn.crm.shared.logAnalyticValue('ui.cache-update', 'updateNow.click', mn,
        val);
  }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.CacheUpdateDisplay.prototype.onBtnClick_ = function(e) {
  var showing = goog.style.isElementShown(this.body_);
  goog.style.setElementShown(this.body_, !showing);
  if (!showing) {
    this.showDetails_();
  }
};


ydn.crm.ui.CacheUpdateDisplay.prototype.showDetails_ = function() {
  var ch = ydn.msg.getMain().findChannel(ydn.msg.Group.SUGAR);
  if (!ch) {
    goog.style.setElementShown(this.body_, false);
    this.head_.querySelector('.label').textContent = '';
    this.head_.setAttribute('title', 'No SugarCRM instance.');
    return;
  }
  return ch.send(ydn.crm.ch.SReq.STATS).addCallback(function(arr) {
    this.renderDetail_(arr);
  }, this);
};


/**
 * @param {ydn.msg.Event} ev
 * @private
 */
ydn.crm.ui.CacheUpdateDisplay.prototype.onMessage_ = function(ev) {
  var data = ev.mesage ? ev.mesage['data'] : null;
  if (data) {
    this.refreshHead_(data);

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
  var title = data['module'] + ' module';
  if (data['ok']) {
    title += ' updated on ' + new Date(data['end']).toLocaleTimeString();
  } else {
    title += ' updating fail on ' + new Date(data['end']).toLocaleTimeString();
  }
  this.head_.setAttribute('title', title);
};


/**
 * @param {Array<Object>} arr
 * @private
 */
ydn.crm.ui.CacheUpdateDisplay.prototype.renderDetail_ = function(arr) {
  console.log(arr);
  var ul = this.body_.querySelector('UL');
  ul.innerHTML = '';
  for (var i = 0; i < arr.length; i++) {
    var li = document.createElement('LI');
    ydn.crm.su.renderCacheStats(li, arr[i], true);
    ul.appendChild(li);
  }
};


