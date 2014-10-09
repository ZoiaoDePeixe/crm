// Copyright 2014 YDN Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Widget application rendererd render inside gmail widget panel.
 *
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.inj.WidgetRenderer');
goog.require('goog.ui.Popup');
goog.require('ydn.crm.inj.AppRenderer');



/**
 * Widget application renderer;
 * @param {Element} ele
 * @constructor
 * @struct
 * @extends {ydn.crm.inj.AppRenderer}
 */
ydn.crm.inj.WidgetRenderer = function(ele) {
  goog.base(this, ele);
};
goog.inherits(ydn.crm.inj.WidgetRenderer, ydn.crm.inj.AppRenderer);


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.WidgetRenderer.ID_TOGGLE_BTN = 'btn-show-panel';


/**
 * @inheritDoc
 */
ydn.crm.inj.WidgetRenderer.prototype.attach = function() {
  if (this.isAttached()) {
    return;
  }
  goog.base(this, 'attach');
  var me = this;
  var tid1 = window.setInterval(function() {
    // this footer is loaded very lately.
    var ready = !!document.querySelector('a[href="http://mail.google.com/mail/help/terms.html"]') ||
        !!document.querySelector('a[href="http://mail.google.com/mail/help/program_policies.html"]');
    if (ready) {
      window.clearTimeout(tid1);
      window.clearTimeout(tid2);
      me.attach_();
    }
  }, 500);

  var tid2 = window.setTimeout(function() {
    // after 15 sec, we will load anyways
    window.clearTimeout(tid1);
    me.attach_();
  }, 15000);
};


/**
 * Attach
 * @private
 */
ydn.crm.inj.WidgetRenderer.prototype.attach_ = function() {
  if (ydn.crm.inj.AppRenderer.DEBUG) {
    window.console.log('Attaching panel');
  }
  var btn = document.createElement('div');
  btn.id = ydn.crm.inj.WidgetRenderer.ID_TOGGLE_BTN;
  btn.title = 'Yathit - Gmail to SugarCRM';

  // sniff left panel, tablist element
  var tablists = document.querySelectorAll('div[role=tablist]');
  // should be only one, but make sure what we are getting
  var tablist = null;
  for (var i = tablists.length - 1; i >= 0; i--) {
    // child element should be tabid with 'chat' or 'gadgets'
    for (var j = tablists[i].childElementCount - 1; j >= 0; j--) {
      var tabid = tablists[i].children[j].getAttribute('tabid');
      if (['chat', 'gadgets'].indexOf(tabid) >= 0) {
        tablist = tablists[i];
        break;
      }
    }
  }
  // console.log(this.ele_root);
  if (this.ele_root.parentElement) {
    this.ele_root.parentElement.removeChild(this.ele_root);
  }
  if (tablist) {
    var panel_container_ = tablist.parentElement;
    tablist.appendChild(btn);
    panel_container_.insertBefore(this.ele_root, panel_container_.firstElementChild);
  } else {
    // failback anchor point
    if (ydn.crm.inj.AppRenderer.DEBUG) {
      window.console.log('tablist not found, attach in failback position');
    }
    this.logger.warning('tablist not found.'); // todo: this problem should send back to server
    var panel_container_ = document.createElement('div');
    document.body.appendChild(panel_container_);
    panel_container_.className = 'tabbar tabbar-failback';
    panel_container_.appendChild(btn);
    goog.dom.classlist.add(this.ele_root, 'root-panel-failback');
    document.body.appendChild(this.ele_root);
  }

  btn.appendChild(document.createElement('div'));

  var tabbar = btn.parentElement;
  goog.events.listen(tabbar, 'click', this.togglePanel_, true, this);
};


/**
 * Toggle panel, when user click the toggle button on the widget panel.
 * @param {Element} e
 * @private
 */
ydn.crm.inj.WidgetRenderer.prototype.togglePanel_ = function(e) {
  // this.logger.finest('togglePanel_');
  var is_ydn = e.target.id == ydn.crm.inj.WidgetRenderer.ID_TOGGLE_BTN ||
      e.target.parentElement.id == ydn.crm.inj.WidgetRenderer.ID_TOGGLE_BTN;
  var shown = goog.style.isElementShown(this.ele_root);
  var is_correct = (is_ydn && shown) || (!is_ydn && !shown);
  if (is_correct) {
    return;
  }
  var panel_container_ = this.ele_root.parentElement;
  for (var i = 0, n = panel_container_.childElementCount - 1; i < n; i++) {
    var ele = panel_container_.children[i];
    if (ele.getAttribute('role') == 'tablist') {
      break;
    }
    var is_ydn_panel = ele.id == ydn.crm.inj.AppRenderer.ID_ROOT_ELE;
    if (is_ydn_panel) {
      goog.style.setElementShown(ele, is_ydn);

    } else {
      if (is_ydn) {
        goog.style.setElementShown(ele, false);
      }
    }
  }
};
