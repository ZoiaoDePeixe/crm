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


var sel_goto = document.getElementById('goto');
sel_goto.onchange = function(e) {
  var xhr = new XMLHttpRequest();
  var url = 'fixture/' + sel_goto.value + '.html';
  console.log(url);
  xhr.open('GET', url, false);
  xhr.onload = function() {
    mock_content.innerHTML = xhr.responseText;
    if (sel_goto.value == 'gmail-inbox') {
      location.hash = '';
    } else {
      location.hash = 'inbox/2345675435';
    }
    perturb_data_tooltip();
  };
  xhr.send();
};



