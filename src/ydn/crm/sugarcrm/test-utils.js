goog.provide('ydn.crm.su.UtilTest');
goog.setTestOnly('ydn.crm.su.UtilTest');

goog.require('goog.testing.asserts');
goog.require('goog.testing.jsunit');
goog.require('goog.testing.AsyncTestCase');
goog.require('ydn.crm.su.option');

var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();


function resetOption() {
  var obj = {};
  obj[ydn.crm.base.ChromeSyncKey.SUGAR_CACHING_OPTION] = null;
  chrome.storage.sync.set(obj);
}

function setUp() {
  resetOption();
}


function tearDownPage() {
  resetOption();
}


function testGetCatchOption() {
  asyncTestCase.waitForAsync('full');
  ydn.crm.su.option.getCacheOption(ydn.crm.su.ModuleName.CONTACTS).addBoth(function(x) {
    assertEquals(ydn.crm.su.CacheOption.FULL, x);
    asyncTestCase.continueTesting();
    asyncTestCase.waitForAsync('partial');
    ydn.crm.su.option.getCacheOption(ydn.crm.su.ModuleName.CASES).addBoth(function(x) {
      assertEquals(ydn.crm.su.CacheOption.PARTIAL, x);
      asyncTestCase.continueTesting();
      asyncTestCase.waitForAsync('opp');
      ydn.crm.su.option.getCacheOption(ydn.crm.su.ModuleName.PROSPECTS).addBoth(function(x) {
        assertEquals(ydn.crm.su.CacheOption.OPPORTUNISTIC, x);
        asyncTestCase.continueTesting();
      });
    });
  });
}


function testSetCatchOption() {
  asyncTestCase.waitForAsync('full');
  ydn.crm.su.option.setCacheOption(ydn.crm.su.ModuleName.CONTACTS, ydn.crm.su.CacheOption.PARTIAL).addBoth(function(x) {
    assertTrue('has set', x);
    ydn.crm.su.option.getCacheOption(ydn.crm.su.ModuleName.CONTACTS).addBoth(function(x) {
      assertEquals(ydn.crm.su.CacheOption.PARTIAL, x);
      asyncTestCase.continueTesting();
      resetOption();
    });

  });
}






