/**
 * Created by kyawtun on 28/12/13.
 */


// ydn.debug.log('ydn.msg', 'finest');
ydn.debug.log('ydn.crm', 'finer');
ydn.debug.log('ydn.crm.inj.App', 'finest');
// ydn.msg.Pipe.DEBUG = true;

location.hash = '';
var app = ydn.crm.inj.App.runInjApp();
var mock_content = document.getElementById('mock-content');

ydn.crm.gmail.GmailObserver.DEBUG =  true;


var perturb_data_tooltip = function() {
  var imgs = document.querySelectorAll('img[data-tooltip="Show details"]');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    img.setAttribute('data-tooltip', 'Show details');
  }
};


document.getElementById('go-inbox').onclick = function(e) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'fixture/gmail-inbox.html', false);
  xhr.onload = function() {
    mock_content.innerHTML = xhr.responseText;
    location.hash = '';
  };
  xhr.send();
};

document.getElementById('go-thread').onclick = function(e) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'fixture/gmail-thread-2.html', false);
  xhr.onload = function() {
    mock_content.innerHTML = xhr.responseText;
    location.hash = 'inbox/2345675435';
    perturb_data_tooltip();
  };
  xhr.send();

};



