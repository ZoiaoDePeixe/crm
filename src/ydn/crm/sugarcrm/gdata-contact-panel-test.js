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
  var res = ydn.crm.sugarcrm.GDataContactPanel.enrich('localhost', resultData['email_match']);
  assertEquals(1, res.length);
  assertEquals(1, res[0].score);
  assertEquals(ydn.crm.sugarcrm.ModuleName.CONTACTS, res[0].record.getModule());
}






