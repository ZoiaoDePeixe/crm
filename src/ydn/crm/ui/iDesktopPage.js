/**
 * @fileoverview Desktop page interface.
 *
 * @author Kyaw Tun<kyawtun@yathit.com>
*/


goog.provide('ydn.crm.ui.IDesktopPage');



/**
 * Desktop page interface.
 * @interface
 */
ydn.crm.ui.IDesktopPage = function() {};


/**
 * Method calling before page show.
 * @param {*} obj payload.
 */
ydn.crm.ui.IDesktopPage.prototype.onPageShow = function(obj) {};
