goog.provide('ydn.crm.su.UtilTest');
goog.setTestOnly('ydn.crm.su.UtilTest');

goog.require('goog.testing.asserts');
goog.require('goog.testing.jsunit');
goog.require('goog.testing.AsyncTestCase');
goog.require('ydn.crm.su.option');

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();


function setUpPage() {
  var obj = {};
  obj[ydn.crm.base.ChromeSyncKey.SUGAR_CACHING_OPTION] = null;
  chrome.storage.sync.set(obj);
}


function testGetCatchOption() {
  asyncTestCase.waitForAsync('get');
  ydn.crm.su.option.getCacheOption(ydn.crm.su.ModuleName.CONTACTS).addBoth(function(x) {
    assertEquals(ydn.crm.su.CacheOption.FULL, x);
    asyncTestCase.continueTesting();
  });
}






