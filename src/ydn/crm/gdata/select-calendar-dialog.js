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
 * @fileoverview Create or select a new calendar dialog.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.gdata.SelectCalendarDialog');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.ui.MessageDialog');



/**
 * Create or select a new calendar dialog.
 * @param {GApps.CalendarList} list
 * @param {?string} id
 * @constructor
 * @extends {ydn.ui.MessageDialog}
 */
ydn.crm.gdata.SelectCalendarDialog = function(list, id) {
  goog.base(this, 'Select a Google calendar to Sync with SugarCRM Meetings events',
      '', ydn.ui.MessageDialog.createOKCancelButtonSet());

  /**
   * @type {GApps.CalendarList}
   * @private
   */
  this.cal_list_ = list;

  /**
   * Selected calender.
   * @type {?string}
   * @private
   */
  this.cal_id_ = id;

  this.render_();

};
goog.inherits(ydn.crm.gdata.SelectCalendarDialog, ydn.ui.MessageDialog);


/**
 * Render.
 * @private
 */
ydn.crm.gdata.SelectCalendarDialog.prototype.render_ = function() {
  var temp = ydn.ui.getTemplateById('select-calendar-template').content;
  var content = this.getContentElement();
  content.appendChild(temp.cloneNode(true));

  this.renderSelector_();

  var new_btn = content.querySelector('button[name="new-calendar"]');
  new_btn.onclick = this.onNewCalender_.bind(this);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.gdata.SelectCalendarDialog.prototype.onNewCalender_ = function(e) {
  var name = window.prompt('Enter new Google calendar name:', 'SugarCRM');
  if (name) {
    var data = {
      'summary': name,
      'description': 'SugarCRM Meetings events synchronized by Yathit'
    };
    ydn.msg.getChannel().send(ydn.crm.ch.Req.GAPPS_NEW_CAL, data).addCallbacks(function(x) {
      // Note: x is {GApps.Calendar} type.
      var cal = /** @type {GApps.CalendarListEntry} */(x);
      if (cal) {
        var mid = ydn.crm.msg.Manager.addStatus('A new calendar ', ' created.');
        ydn.crm.msg.Manager.setLink(mid, 'https://www.google.com/calendar/',
            cal.summary, 'Open Google Calendar');
        cal.accessRole = 'owner';
        this.cal_list_.items.push(cal);
        this.dialog.close(cal.summary);
      } else {
        ydn.crm.msg.Manager.addStatus('fail to create calendar');
      }
    }, function(e) {
      window.console.log(e);
      ydn.crm.msg.Manager.addStatus(e.message || e);
    }, this);
  }
};


/**
 * Clean up reference.
 * @protected
 */
ydn.crm.gdata.SelectCalendarDialog.prototype.dispose = function() {
  var content = this.getContentElement();
  var new_btn = content.querySelector('button[name="new-calendar"]');
  new_btn.onclick = null;
  ydn.crm.gdata.SelectCalendarDialog.base(this, 'dispose');
};


/**
 * Show modal dialog and clean up on closing.
 * @param {ydn.crm.ui.UserSetting} us
 * @param {GApps.CalendarList} list if user created a record, it will be updated.
 * @param {?string} id calendar id.
 * @return {!goog.async.Deferred<?string>} return calendar id.
 */
ydn.crm.gdata.SelectCalendarDialog.showModal = function(us, list, id) {
  var dialog = new ydn.crm.gdata.SelectCalendarDialog(list, id);
  var df = new goog.async.Deferred();
  var bar = dialog.dialog.querySelector('.button-bar');
  var default_btn = bar.querySelector('button.default');

  dialog.dialog.onclose = function(event) {
    var new_id = dialog.dialog.querySelector('select').value;
    if (dialog.cal_id_ != new_id) {
      if (new_id) {
        ydn.crm.msg.Manager.addStatus('Setting sync calendar to "' +
            new_id + '".');
      } else {
        ydn.crm.msg.Manager.addStatus('Removing sync calendar');
      }
      var patch = /** @type {YdnCrm.UserSettingGoogle} */({});
      patch.syncCalId = /** @type {string} */(new_id);
      us.patchSettingOnServer(
          ydn.crm.base.KeyCLRecordOnServer.USER_SETTING_SUGARCRM,
          patch).addCallbacks(function(x) {
        df.callback(new_id);
      }, function(e) {
        df.errback(e);
      }, this);
    }
    dialog.dispose();
  };
  dialog.dialog.showModal();
  return df;

};


/**
 * Render select element.
 * @return {boolean} `true` if selected calendar is in the list selected.
 * @private
 */
ydn.crm.gdata.SelectCalendarDialog.prototype.renderSelector_ = function() {
  var select = this.getContentElement().querySelector('select');
  select.innerHTML = '';

  var sync = false;
  for (var i = 0; i < this.cal_list_.items.length; i++) {
    var cal = this.cal_list_.items[i];
    var option = document.createElement('option');
    option.value = cal.summary;
    option.textContent = cal.summary;
    option.setAttribute('title', cal.primary ? 'My Calendar' : cal.description);

    if (cal.accessRole != 'owner') {
      option.setAttribute('disabled', 'disabled');
    }
    select.appendChild(option);
    if (this.cal_id_ == cal.summary) {
      select.selectedIndex = i;
      sync = true;
    }
  }
  if (!sync) {
    select.selectedIndex = -1;
  }
  return sync;
};


