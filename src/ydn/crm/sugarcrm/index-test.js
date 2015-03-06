goog.provide('ydn.crm.su.IndexTest');
goog.setTestOnly('ydn.crm.su.IndexTest');

goog.require('goog.testing.asserts');
goog.require('goog.testing.jsunit');
goog.require('ydn.crm.su');



function setUp() {
}


function testParseViewLinkV6() {
  var url = 'http://128.199.156.92/sugarcrm//index.php?module=Calls&action=DetailView&record=17c3d18c-f741-41df-1be7-5414e1304f9b';
  var parts = ydn.crm.su.parseViewLinkV6(url);
  assertEquals('Calls', parts.moduleName);
  assertEquals('17c3d18c-f741-41df-1be7-5414e1304f9b', parts.id);
}


function testParseViewLinkV7() {
  var url = 'http://crmoutfitters1.sugarondemand.com/#Contacts/1003c661-4d12-09b9-3102-547fd5905f20';
  var parts = ydn.crm.su.parseViewLinkV7(url);
  assertEquals('Contacts', parts.moduleName);
  assertEquals('1003c661-4d12-09b9-3102-547fd5905f20', parts.id);
}





