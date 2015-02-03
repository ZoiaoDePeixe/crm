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
  GITHUB: 'github',
  INSTAGRAM: 'instagram',
  LINKED_IN: 'linkedin',
  MEETUP: 'meetup',
  MYSPACE: 'myspace',
  PINTEREST: 'pinterest',
  REDDIT: 'reddit',
  TUMBLR: 'tumblr',
  TWITTER: 'twitter',
  YATHOO: 'yahoo',
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
ydn.social.network2name[ydn.social.Network.REDDIT] = 'Reddit';
ydn.social.network2name[ydn.social.Network.YELP] = 'Instagram';
ydn.social.network2name[ydn.social.Network.INSTAGRAM] = 'Github';
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
 * List of network requires id.
 * @param {ydn.social.Network} network
 * @return {boolean} true if network require an id to be a valid record.
 * @final
 */
ydn.social.isIdRequired = function(network) {
  return [ydn.social.Network.ANGLE_LIST].indexOf(network) >= 0;
};


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
  FC: 'fc',
  PP: 'pp',
  CB: 'cb',
  TD: 'td'
};


/**
 * @param {ydn.social.Source} source
 * @return {string}
 */
ydn.social.toSourceName = function(source) {
  if (ydn.social.Source.PP == source) {
    return 'Pipl';
  } else if (ydn.social.Source.CB == source) {
    return 'ClearBit';
  } else if (ydn.social.Source.TD == source) {
    return 'TowerData';
  } else if (ydn.social.Source.FC == source) {
    return 'FullContact';
  } else {
    return '?';
  }
};

