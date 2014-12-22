/**
 * @fileoverview About this file
 */

// ydn.msg.Pipe.DEBUG = true;
ydn.crm.msg.Manager.addConsumer(new ydn.crm.msg.ConsoleStatusBar());
ydn.msg.initPipe(ydn.msg.ChannelName.DEV);
var bar;
ydn.ui.setTemplateDocument(
    chrome.extension.getURL(ydn.crm.base.INJ_TEMPLATE), function(x) {
      bar = new ydn.social.ui.Bar();
      bar.render(document.getElementById('bar'));
    });


var t_input = document.getElementById('target-input');
t_input.addEventListener('input', function(e) {
  bar.showByEmail(t_input.value);
}, false);


document.getElementById('twitter-profile').onclick = function(e) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'fixture/twitter-user-profile.json', true);
  xhr.onload = function() {
    var tw = new ydn.social.ui.Twitter();
    var result = document.getElementById('result');
    tw.render(result);
    var el = tw.getElement();
    result.removeChild(el);
    var detail = el.querySelector('.' + ydn.social.ui.Network.CSS_CLASS_DETAIL);
    result.appendChild(detail);
    var json = JSON.parse(xhr.responseText);
    ydn.social.ui.Twitter.renderTwitterProfile(detail, json);
  };
  xhr.send();
};


document.getElementById('tweet-btn').onclick = function(e) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'fixture/tweets.json', true);
  xhr.onload = function() {
    var tid = 'template-detail-' + ydn.social.Network.TWITTER;
    var t = ydn.ui.getTemplateById(tid).content;
    var result = document.getElementById('result');
    var div = document.createElement('div');
    div.className = 'tooltip-detail';
    div.appendChild(t.cloneNode(true));
    result.appendChild(div);
    var detail = div.querySelector('.tweets');
    var json = JSON.parse(xhr.responseText);
    ydn.social.ui.Twitter.renderTweet(detail, json);
  };
  xhr.send();
};

document.getElementById('gplus-btn').onclick = function(e) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'fixture/googleplus-person.json', true);
  xhr.onload = function() {
    var tw = new ydn.social.ui.GPlus();
    var result = document.getElementById('result');
    tw.render(result);
    var el = tw.getElement();
    result.removeChild(el);
    var detail = el.querySelector('.' + ydn.social.ui.Network.CSS_CLASS_DETAIL);
    result.appendChild(detail);
    var json = JSON.parse(xhr.responseText);
    ydn.social.ui.GPlus.renderGPlusProfile(detail, json);
  };
  xhr.send();
};

ydn.social.MetaContact.DEBUG =  true;
ydn.social.ui.Bar.DEBUG =  true;
// ydn.social.ui.Network.DEBUG =  true;
