/**
 * Created by kyawtun on 28/12/13.
 */


// ydn.msg.Pipe.DEBUG = true;

location.hash = '';
var app = ydn.crm.inj.App.runInjApp();
var mock_content = document.getElementById('mock-content');
ydn.debug.log('ydn.crm', 'finer');
// ydn.debug.log('ydn.crm.inj.App', 'finest');
ydn.debug.captureOnConsole(true);

ydn.gmail.Utils.gmail_df_ = goog.async.Deferred.succeed('kyawtun@yathit.com');

// ydn.crm.inj.SugarCrmApp.DEBUG =  true;
// ydn.msg.Pipe.DEBUG =  true;
// ydn.crm.gmail.GmailObserver.DEBUG =  true;
// ydn.crm.tracking.Tracker.DEBUG =  true;
// ydn.cs.ReplyPanelManager.DEBUG =  true;
// ydn.crm.su.ui.record.Record.DEBUG =  true;



var perturb_data_tooltip = function() {
  var imgs = document.querySelectorAll('img[data-tooltip="Show details"]');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    img.setAttribute('data-tooltip', 'Show details');
  }
  imgs = document.querySelectorAll('div[data-tooltip="' + ydn.cs.gmail.ReplyPanelWrapper.MSG_TYPE_OF_RESPONSE + '"]');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    setTimeout(function() {
      img.setAttribute('data-tooltip', ydn.cs.gmail.ReplyPanelWrapper.MSG_TYPE_OF_RESPONSE);
    }, 100);
    break;
  }
};


var loadContent = function(url) {
  var xhr = new XMLHttpRequest();
  console.log(url);
  xhr.open('GET', url, true);
  xhr.onload = function() {
    mock_content.innerHTML = xhr.responseText;
    var ydn_el = mock_content.querySelector('#sticky-hud-base');
    if (ydn_el) {
      ydn_el.parentElement.removeChild(ydn_el);
    }
    if (sel_goto.value == 'gmail-inbox') {
      location.hash = '';
    } else {
      location.hash = 'inbox/2345675435';
    }
    perturb_data_tooltip();
  };
  xhr.send();
};


var sel_goto = document.getElementById('goto');
sel_goto.onchange = function(e) {
  var url = 'fixture/' + sel_goto.value + '.html';
  loadContent(url);
};

setTimeout(function() {
  loadContent('fixture/gmail-inbox.html');
}, 1000);



