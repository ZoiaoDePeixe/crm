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
  assertEquals(3, tw.count());
  assertEquals('ClearBit', tw.getProfile(0).getSourceName());
  assertEquals('FullContact', tw.getProfile(1).getSourceName());
  assertEquals('Pipl', tw.getProfile(2).getSourceName());
  assertEquals(2, pt.count());
}


function testUserIdCb() {
  var brat = JSON.parse(JSON.stringify(metaContactData.brat));
  brat = {cb: brat.cb};
  var meta = new ydn.social.MetaContact(brat);
  var tw = new ydn.social.MetaProfile(meta, ydn.social.Network.TWITTER).getProfile();
  var gh = new ydn.social.MetaProfile(meta, ydn.social.Network.GITHUB).getProfile();
  var al = new ydn.social.MetaProfile(meta, ydn.social.Network.ANGLE_LIST).getProfile();
  assertEquals('966692022', tw.getUserId());
  assertEquals('lorangb', gh.getUserId());
  assertEquals('bartlorang', al.getUserId());
}


function testUserIdFc() {
  var brat = JSON.parse(JSON.stringify(metaContactData.brat));
  brat = {fc: brat.fc};
  var meta = new ydn.social.MetaContact(brat);
  var tw = new ydn.social.MetaProfile(meta, ydn.social.Network.TWITTER).getProfile();
  var gp = new ydn.social.MetaProfile(meta, ydn.social.Network.G_PLUS).getProfile();
  var fb = new ydn.social.MetaProfile(meta, ydn.social.Network.FACEBOOK).getProfile();
  var pt = new ydn.social.MetaProfile(meta, ydn.social.Network.PINTEREST).getProfile();
  assertEquals('5998422', tw.getUserId());
  assertEquals('114426306375480734745', gp.getUserId());
  assertEquals('651620441', fb.getUserId());
  assertEquals('lorangb', pt.getUserId());
}


function testScreenNameCb() {
  var brat = JSON.parse(JSON.stringify(metaContactData.brat));
  brat = {cb: brat.cb};
  var meta = new ydn.social.MetaContact(brat);
  var tw = new ydn.social.MetaProfile(meta, ydn.social.Network.TWITTER).getProfile();
  var gh = new ydn.social.MetaProfile(meta, ydn.social.Network.GITHUB).getProfile();
  var fb = new ydn.social.MetaProfile(meta, ydn.social.Network.FACEBOOK).getProfile();
  assertEquals('lorangb', tw.getScreenName());
  assertEquals('lorangb', gh.getScreenName());
  assertEquals('bart.lorang', fb.getScreenName());
}


function testScreenNameFc() {
  var brat = JSON.parse(JSON.stringify(metaContactData.brat));
  brat = {fc: brat.fc};
  var meta = new ydn.social.MetaContact(brat);
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
  var brat = JSON.parse(JSON.stringify(metaContactData.joe));
  brat = {pp: brat.pp};
  var meta = new ydn.social.MetaContact(brat);
  var lkn = new ydn.social.MetaProfile(meta, ydn.social.Network.LINKED_IN).getProfile();
  assertNull(lkn);
}


function testUserIdPipl() {
  var yossi = JSON.parse(JSON.stringify(metaContactData.yossi));
  yossi = {pp: yossi.pp};
  var meta = new ydn.social.MetaContact(yossi);
  var fb = new ydn.social.MetaProfile(meta, ydn.social.Network.FACEBOOK).getProfile();
  var lkn = new ydn.social.MetaProfile(meta, ydn.social.Network.LINKED_IN).getProfile();
  assertEquals('Pipl', lkn.getSourceName());
  assertEquals('590949588', fb.getUserId());
}


function testPhotoUrl() {
  assertTrue(!!new ydn.social.MetaContact(metaContactData.brat).getPhotoUrl());
  assertTrue(!!new ydn.social.MetaContact(metaContactData.jeremy).getPhotoUrl());
  assertFalse(!!new ydn.social.MetaContact(metaContactData.joe).getPhotoUrl());
}


function testProfilePhotoUrl() {
  var meta = new ydn.social.MetaContact(metaContactData.brat);
  var profiles = new ydn.social.MetaProfile(meta, ydn.social.Network.PINTEREST);
  for (var i = 0; i < profiles.count(); i++) {
    var p = profiles.getProfile(i);
    assertTrue(p.getSourceName(), !!p.getPhotoUrl());
  }
}





