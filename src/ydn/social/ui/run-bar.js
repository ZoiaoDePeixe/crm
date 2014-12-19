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
    var btn = bar.createButton_('twitter');
    var detail = btn.querySelector('.' + ydn.social.ui.Bar.CSS_CLASS_DETAIL);
    var json = JSON.parse(xhr.responseText);
    document.getElementById('result').appendChild(detail);
    ydn.social.ui.Bar.renderTwitterProfile(detail, json);
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
    ydn.social.ui.Bar.renderTweet(detail, json);
  };
  xhr.send();
};

ydn.social.MetaContact.DEBUG =  true;