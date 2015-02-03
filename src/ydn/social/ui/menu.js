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
 * @fileoverview Main menu.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social.ui.Menu');
goog.require('ydn.social.ui.MetaProfile');
goog.require('ydn.ui.MessageDialog');



/**
 * Main menu.
 * @constructor
 * @struct
 */
ydn.social.ui.Menu = function() {
  /**
   * @final
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');

  /**
   * @protected
   * @type {ydn.social.MetaContact}
   */
  this.target = null;
  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
};


/**
 * @const
 * @type {string}
 */
ydn.social.ui.Menu.CSS_CLASS_SHOW_SOURCE = 'show-source';


/**
 * Render UI.
 * @param {Element} el
 */
ydn.social.ui.Menu.prototype.render = function(el) {
  var btn = document.createElement('div');
  var details = document.createElement('div');
  this.root_.className = ydn.social.ui.MetaProfile.CSS_CLASS_CONTAINER;
  btn.classList.add(ydn.social.ui.MetaProfile.CSS_CLASS_HOST);
  details.classList.add(ydn.social.ui.MetaProfile.CSS_CLASS_DETAIL);
  btn.classList.add(ydn.crm.ui.CSS_CLASS_SVG_BUTTON);
  var svg = ydn.crm.ui.createSvgIcon('menu');
  btn.appendChild(svg);
  this.root_.appendChild(btn);
  this.root_.appendChild(details);
  el.appendChild(this.root_);
  this.renderDetailPanel_();

  this.handler.listen(this.root_, 'click', this.onClicked_);
};


/**
 * Root element clicked.
 * @param {Event} e
 * @private
 */
ydn.social.ui.Menu.prototype.onClicked_ = function(e) {
  if (e.target instanceof Element) {
    if (e.target.classList.contains(ydn.social.ui.Menu.CSS_CLASS_SHOW_SOURCE)) {
      e.preventDefault();
      e.stopPropagation();
      var source = e.target.getAttribute('name');
      this.showSourceDialog_(/** @type {ydn.social.Source} */(source));
    }
  }
};


/**
 * Show source data.
 * @param {ydn.social.Source} type
 * @private
 */
ydn.social.ui.Menu.prototype.showSourceDialog_ = function(type) {
  var title = 'Raw data for ' + ydn.social.toSourceName(type);
  var content = document.createElement('div');
  content.className = 'raw-source-content';
  var pre = document.createElement('pre');
  if (type == ydn.social.Source.CB) {
    pre.textContent = JSON.stringify(this.target.data.cb, null, 2);
  } else if (type == ydn.social.Source.PP) {
    pre.textContent = JSON.stringify(this.target.data.pp, null, 2);
  } else if (type == ydn.social.Source.FC) {
    pre.textContent = JSON.stringify(this.target.data.fc, null, 2);
  }
  content.appendChild(pre);
  ydn.ui.MessageDialog.showModal(title, content);
};


/**
 * @private
 */
ydn.social.ui.Menu.prototype.renderDetailPanel_ = function() {
  var el = this.root_.querySelector('.' + ydn.social.ui.MetaProfile.CSS_CLASS_DETAIL);

  var tid = 'template-social-menu';
  var t = ydn.ui.getTemplateById(tid).content;

  el.innerHTML = '';
  el.appendChild(t.cloneNode(true));
  if (!this.target) {
    return;
  }
  var header = el.querySelector('.header');
  var content = el.querySelector('.social-start-menu > .content');
  var name = header.querySelector('.name');
  name.textContent = this.target.getFullName();
  header.querySelector('.description').textContent = this.target.getBio();
  var photo = this.target.getPhotoUrl();
  var img = header.querySelector('.logo img');
  if (photo) {
    img.src = photo;
  } else {
    img.removeAttribute('src');
  }

  el.querySelector('.location').textContent = this.target.getLocation();

  var emp_el = el.querySelector('.employment');
  var emp = this.target.getEmployment();
  if (emp) {
    if (emp.title) {
      emp_el.textContent = emp.title + ', ';
    }
    if (emp.companyUrl) {
      var a = document.createElement('a');
      a.textContent = emp.company;
      a.href = emp.companyUrl;
      a.setAttribute('target', '_blank');
      a.setAttribute('title', emp.companyTitle || '');
      emp_el.appendChild(a);
    } else if (emp.company) {
      emp_el.textContent += emp.company;
    }
  }

  var topics = this.target.getTopics();
  for (var key in topics) {
    var div = document.createElement('div');
    div.textContent = key + ': ' + topics[key];
    content.appendChild(div);
  }

  var sources = el.querySelector('.sources');
  var createSource = function(name) {
    var se = document.createElement('a');
    se.href = '#' + name;
    se.textContent = name.toUpperCase();
    se.className = ydn.social.ui.Menu.CSS_CLASS_SHOW_SOURCE;
    se.setAttribute('name', name);
    se.setAttribute('title', 'Show raw data for ' + ydn.social.toSourceName(name));
    sources.appendChild(se);
  };
  if (this.target.data.cb) {
    createSource(ydn.social.Source.CB);
  }
  if (this.target.data.fc) {
    createSource(ydn.social.Source.FC);
  }
  if (this.target.data.pp) {
    createSource(ydn.social.Source.PP);
  }
};


/**
 * @return {Element}
 */
ydn.social.ui.Menu.prototype.getContentElement = function() {
  return this.root_.querySelector('.content');
};


/**
 * Set target person.
 * @param {ydn.social.MetaContact} target
 */
ydn.social.ui.Menu.prototype.setTarget = function(target) {
  if (target == this.target) {
    return;
  }
  this.target = target;
  this.renderDetailPanel_();
};
