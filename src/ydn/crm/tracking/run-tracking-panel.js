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
 * @fileoverview Demo for tracking panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


var panel = new ydn.crm.TrackingPanel();

var div = document.createElement('div');
document.body.appendChild(div);
panel.render(div);

var data = [{
  recipients: 'A@sere.com',
  subject: 'OK',
  sentDate: new Date(1384963200000),
  opens: 3,
  clicks: 5,
  cities: 2,
  lastOpen: new Date(1351689200000)
}, {
  recipients: 'B@sere.com',
  subject: 'Re: new',
  sentDate: new Date(1351699200000),
  opens: 6,
  clicks: 32,
  cities: 2,
  lastOpen: new Date(1351599200000)
}];
panel.setData(data);