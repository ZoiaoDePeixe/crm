/**
 * @fileoverview Social module.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.so');
goog.provide('ydn.social');


/**
 * @const
 * @type {string} cache store name.
 */
ydn.so.STORE_NAME = 'Social';


/**
 * @enum {string}
 */
ydn.social.Network = {
  ANGLE_LIST: 'angellist',
  FACEBOOK: 'facebook',
  G_PLUS: 'googleplus',
  LINKED_IN: 'linkedin',
  MEETUP: 'meetup',
  PINTEREST: 'pinterest',
  TUMBLR: 'tumblr',
  YELP: 'yelp',
  BLOGGER: 'blogger',
  YATHOO: 'yahoo',
  MYSPACE: 'myspace',
  TWITTER: 'twitter'
};


/**
 * List of default networks.
 * @type {Array<ydn.social.Network>}
 */
ydn.social.defaultNetworks = [ydn.social.Network.ANGLE_LIST,
  ydn.social.Network.FACEBOOK, ydn.social.Network.G_PLUS,
  ydn.social.Network.LINKED_IN, ydn.social.Network.TWITTER];


/**
 * @enum {string} list of source.
 */
ydn.social.Source = {
  FullContact: 'fc',
  Pipl: 'pp',
  ClearBit: 'cb',
  TowerData: 'td'
};

