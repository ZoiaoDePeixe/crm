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


var grid = new pear.ui.Grid();
var config = {
  AllowColumnResize: true,
  AllowAlternateRowHighlight: true,
  ShowCellBorder: false
};
config = grid.setConfiguration(config);

grid.setWidth(800);
grid.setHeight(400);
var columns = [
  new pear.data.Column('Recipients', 'recipients', 'recipients', 75, pear.data.Column.DataType.TEXT),
  new pear.data.Column('Subject', 'subject', 'subject', 115, pear.data.Column.DataType.TEXT),
  new pear.data.Column('Sent Date', 'sentdate', 'sentDate', 75, pear.data.Column.DataType.DATETIME),
  new pear.data.Column('Opens', 'opens', 'opens', 75, pear.data.Column.DataType.NUMBER),
  new pear.data.Column('Clicks', 'clicks', 'clicks', 75, pear.data.Column.DataType.NUMBER),
  new pear.data.Column('Cities', 'cities', 'cities', 75, pear.data.Column.DataType.NUMBER),
  new pear.data.Column('Last Open', 'lastopen', 'lastOpen', 75, pear.data.Column.DataType.DATETIME)
];
grid.setColumns(columns);
var data = [{
  recipients: 'A@sere.com',
  subject: 'OK',
  sentDate: '11/21/2013',
  opens: 3,
  clicks: 5,
  cities: 2,
  lastOpen: '11/21/2013'
}];
grid.setDataRows(data);

var div = document.createElement('div');
document.body.appendChild(div);
grid.render(div);