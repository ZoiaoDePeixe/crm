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
}


function testGetSources() {
  var meta = new ydn.social.MetaContact(metaContactData.brat);
  var tw = new ydn.social.MetaProfile(meta, ydn.social.Network.TWITTER);
  var pt = new ydn.social.MetaProfile(meta, ydn.social.Network.PINTEREST);
  assertArrayEquals(['fc', 'pp'], tw.getSources());
  assertArrayEquals(['pp'], pt.getSources());
}


function testScreenName() {
  var meta = new ydn.social.MetaContact(metaContactData.brat);
  var tw = new ydn.social.MetaProfile(meta, ydn.social.Network.TWITTER);
  var gp = new ydn.social.MetaProfile(meta, ydn.social.Network.G_PLUS);
  var fb = new ydn.social.MetaProfile(meta, ydn.social.Network.FACEBOOK);
  var pt = new ydn.social.MetaProfile(meta, ydn.social.Network.PINTEREST);
  assertEquals('@bartlorang', tw.getScreenName());
  assertEquals('114426306375480734745', gp.getScreenName());
  assertEquals('bart.lorang', fb.getScreenName());
  assertEquals('lorangb', pt.getScreenName());
}






