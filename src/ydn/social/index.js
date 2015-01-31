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
  BLOGGER: 'blogger',
  FACEBOOK: 'facebook',
  G_PLUS: 'googleplus',
  LINKED_IN: 'linkedin',
  MEETUP: 'meetup',
  MYSPACE: 'myspace',
  PINTEREST: 'pinterest',
  TUMBLR: 'tumblr',
  YATHOO: 'yahoo',
  TWITTER: 'twitter',
  YELP: 'yelp'
};


/**
 * @const
 * @type {Object<string>}
 */
ydn.social.network2name = {};
ydn.social.network2name[ydn.social.Network.ANGLE_LIST] = 'AngelList';
ydn.social.network2name[ydn.social.Network.BLOGGER] = 'Blogger';
ydn.social.network2name[ydn.social.Network.FACEBOOK] = 'Facebook';
ydn.social.network2name[ydn.social.Network.G_PLUS] = 'Google+';
ydn.social.network2name[ydn.social.Network.LINKED_IN] = 'LinkedIn';
ydn.social.network2name[ydn.social.Network.MEETUP] = 'Meetup';
ydn.social.network2name[ydn.social.Network.MYSPACE] = 'MySpace';
ydn.social.network2name[ydn.social.Network.PINTEREST] = 'Pinterest';
ydn.social.network2name[ydn.social.Network.TUMBLR] = 'Tumblr';
ydn.social.network2name[ydn.social.Network.TWITTER] = 'Twitter';
ydn.social.network2name[ydn.social.Network.YELP] = 'Yelp';


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

