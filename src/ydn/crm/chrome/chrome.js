/**
 * @fileoverview Utilities page for Chrome extension.
 *                                                 `
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.chrome');


/**
 * Setup optional host permission request via page action.
 * Page action can only be used for injecting host permission.
 */
ydn.crm.chrome.setupOptionalContentScriptInjection = function() {
  var hosts = ['mail.google.com'];
  if (!chrome.pageAction || !chrome.declarativeContent) {
    if (goog.DEBUG) {
      throw new Error('invalid manifest for optional content script injection');
    }
    return;
  }
  chrome.runtime.onInstalled.addListener(function(details) {
    var rules = [];
    for (var i = 0; i < hosts.length; i++) {
      var host = hosts[i];
      rules[i * 2] = {
        id: host,
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { 'hostEquals': host, 'schemes': ['https', 'http'] }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      };

      rules[i * 2 + 1] = {
        id: 'inject ' + host,
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { 'hostEquals': host, 'schemes': ['https', 'http'] }
          })
        ],
        actions: [new chrome.declarativeContent.RequestContentScript({
          'js': ['js/run-content-script.js']
        })]
      };
    }
    chrome.declarativeContent.onPageChanged.removeRules(null, function() {
      chrome.declarativeContent.onPageChanged.addRules(rules);
    });
  });

  chrome.pageAction.onClicked.addListener(function(tab) {
    var rule_id = tab.url.match(/\/\/(.+?)\//)[1];
    if (tab.url.indexOf(rule_id) >= 0) {
      var tid = tab.id;
      var perm = {
        origins: [tab.url]
      };
      chrome.permissions.request(perm, function(ok) {
        if (ok) {
          chrome.declarativeContent.onPageChanged.removeRules([rule_id], function() {
            chrome.pageAction.hide(tid);
          });
          chrome.tabs.executeScript(tid, {file: 'js/run-content-script.js'});
        }
      });
    }
  });

};

