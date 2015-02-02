/**
 * @fileoverview Social module.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.social');


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
 * @type {Object<string>} list of supported network names. The list is ordered
 * by preferred network coming first.
 */
ydn.social.network2name = {};
ydn.social.network2name[ydn.social.Network.TWITTER] = 'Twitter';
ydn.social.network2name[ydn.social.Network.FACEBOOK] = 'Facebook';
ydn.social.network2name[ydn.social.Network.LINKED_IN] = 'LinkedIn';
ydn.social.network2name[ydn.social.Network.G_PLUS] = 'Google+';
ydn.social.network2name[ydn.social.Network.ANGLE_LIST] = 'AngelList';
ydn.social.network2name[ydn.social.Network.PINTEREST] = 'Pinterest';
ydn.social.network2name[ydn.social.Network.TUMBLR] = 'Tumblr';
ydn.social.network2name[ydn.social.Network.BLOGGER] = 'Blogger';
ydn.social.network2name[ydn.social.Network.MEETUP] = 'Meetup';
ydn.social.network2name[ydn.social.Network.MYSPACE] = 'MySpace';
ydn.social.network2name[ydn.social.Network.YELP] = 'Yelp';
ydn.social.network2name['reddit'] = 'Reddit';
ydn.social.network2name['instagram'] = 'Instagram';
ydn.social.network2name['github'] = 'Github';
ydn.social.network2name['foursquare'] = 'Foursquare';
ydn.social.network2name['flickr'] = 'Flickr';
ydn.social.network2name['youtube'] = 'Youtube';
ydn.social.network2name['friendfeed'] = 'Friendfeed';
ydn.social.network2name['wordpress'] = 'Wordpress';
ydn.social.network2name['quora'] = 'Quora';
ydn.social.network2name['yahoo'] = 'Yahoo!';
ydn.social.network2name['delicious'] = 'Delicious';
ydn.social.network2name['vimeo'] = 'Vimeo';
ydn.social.network2name['klout'] = 'Klout';


/**
 * @param {ydn.social.Network} network
 * @return {string} domain name of the network
 */
ydn.social.network2domain = function(network) {
  return network + '.com';
};


/**
 * List of default networks.
 * @type {Array<ydn.social.Network>}
 */
ydn.social.defaultNetworks = [ydn.social.Network.TWITTER,
  ydn.social.Network.FACEBOOK, ydn.social.Network.G_PLUS,
  ydn.social.Network.LINKED_IN, ydn.social.Network.ANGLE_LIST];


/**
 * @enum {string} list of source.
 */
ydn.social.Source = {
  FullContact: 'fc',
  Pipl: 'pp',
  ClearBit: 'cb',
  TowerData: 'td'
};

