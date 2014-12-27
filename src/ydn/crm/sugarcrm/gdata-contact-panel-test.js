goog.provide('ydn.crm.sugarcrm.GDataContactPanelTest');
goog.setTestOnly('ydn.crm.sugarcrm.GDataContactPanelTest');

goog.require('goog.testing.asserts');
goog.require('goog.testing.jsunit');
goog.require('ydn.crm.sugarcrm.GDataContactPanel');
goog.require('ydn.crm.test');


var resultData = {};

function setUp() {
  ydn.crm.test.initPipe();
  loadData('email_match');
}


var loadData = function(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'fixture/' + name + '.json', false);
  xhr.onload = function() {
    resultData[name] = JSON.parse(xhr.responseText);
  };
  xhr.send();
};


function testEnrichEmailMatch() {
  var res = ydn.crm.sugarcrm.GDataContactPanel.enrich(resultData['email_match']);
  assertEquals(0, res[ydn.crm.sugarcrm.ModuleName.ACCOUNTS].length);
  assertEquals(1, res[ydn.crm.sugarcrm.ModuleName.CONTACTS].length);
  assertEquals(0, res[ydn.crm.sugarcrm.ModuleName.LEADS].length);
  var arr = res[ydn.crm.sugarcrm.ModuleName.CONTACTS];
  assertEquals(1, arr[0].score);
}






