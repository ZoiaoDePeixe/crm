goog.provide('ydn.social.MetaContactTest');
goog.setTestOnly('ydn.social.MetaContactTest');

goog.require('goog.testing.asserts');
goog.require('goog.testing.jsunit');
goog.require('ydn.crm.test');
goog.require('ydn.social.MetaContact');



var metaContactData = {};


function setUp() {
  ydn.crm.test.initPipe();
}


var loadData = function(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'fixture/' + name + '.json', false);
  xhr.onload = function() {
    metaContactData[name] = JSON.parse(xhr.responseText);
  };
  xhr.send();
};


function setUpPage() {
  loadData('brat');
  loadData('jeremy');
  loadData('joe');
  loadData('yossi');
}


function testGetSources() {
  var meta = new ydn.social.MetaContact(metaContactData.brat);
  var tw = new ydn.social.MetaProfile(meta, ydn.social.Network.TWITTER);
  var pt = new ydn.social.MetaProfile(meta, ydn.social.Network.PINTEREST);
  assertEquals(2, tw.count());
  assertEquals('FullContact', tw.getProfile(0).getSourceName());
  assertEquals('Pipl', tw.getProfile(1).getSourceName());
  assertEquals('userId', tw.getProfile(0).getUserId(), tw.getProfile(1).getUserId());
  assertEquals(2, pt.count());
  assertEquals('userId', pt.getProfile(0).getUserId(), pt.getProfile(1).getUserId());
}


function testUserId() {
  var meta = new ydn.social.MetaContact(metaContactData.brat);
  var tw = new ydn.social.MetaProfile(meta, ydn.social.Network.TWITTER).getProfile();
  var gp = new ydn.social.MetaProfile(meta, ydn.social.Network.G_PLUS).getProfile();
  var fb = new ydn.social.MetaProfile(meta, ydn.social.Network.FACEBOOK).getProfile();
  var pt = new ydn.social.MetaProfile(meta, ydn.social.Network.PINTEREST).getProfile();
  assertEquals('5998422', tw.getUserId());
  assertEquals('114426306375480734745', gp.getUserId());
  assertEquals('651620441', fb.getUserId());
  assertEquals('lorangb', pt.getUserId());
}


function testScreenName() {
  var meta = new ydn.social.MetaContact(metaContactData.brat);
  var tw = new ydn.social.MetaProfile(meta, ydn.social.Network.TWITTER).getProfile();
  var gp = new ydn.social.MetaProfile(meta, ydn.social.Network.G_PLUS).getProfile();
  var fb = new ydn.social.MetaProfile(meta, ydn.social.Network.FACEBOOK).getProfile();
  var pt = new ydn.social.MetaProfile(meta, ydn.social.Network.PINTEREST).getProfile();
  assertEquals('bartlorang', tw.getScreenName());
  assertEquals('114426306375480734745', gp.getScreenName());
  assertEquals('bart.lorang', fb.getScreenName());
  assertEquals('lorangb', pt.getScreenName());
}


function testUserIdPiplNoMatch() {
  var meta = new ydn.social.MetaContact(metaContactData.joe);
  var lkn = new ydn.social.MetaProfile(meta, ydn.social.Network.LINKED_IN).getProfile();
  assertNull(lkn);
}


function testUserIdPipl() {
  var meta = new ydn.social.MetaContact(metaContactData.yossi);
  var fb = new ydn.social.MetaProfile(meta, ydn.social.Network.FACEBOOK).getProfile();
  var lkn = new ydn.social.MetaProfile(meta, ydn.social.Network.LINKED_IN).getProfile();
  assertEquals('Pipl', lkn.getSourceName());
  assertEquals('590949588', fb.getUserId());
}


function testPhotoUrl() {
  var meta = new ydn.social.MetaContact(metaContactData.brat);
  var tw = new ydn.social.MetaProfile(meta, ydn.social.Network.PINTEREST).getProfile();
  var fb = new ydn.social.MetaProfile(meta, ydn.social.Network.TWITTER).getProfile(1);
  assertTrue(!!tw.getPhotoUrl());
  assertTrue(!!fb.getPhotoUrl());
}





