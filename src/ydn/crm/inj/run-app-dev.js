/**
 * Created by kyawtun on 28/12/13.
 */


// ydn.debug.log('ydn.msg', 'finest');
ydn.debug.log('ydn.crm', 'finer');
ydn.debug.log('ydn.crm.inj.App', 'finest');
// ydn.msg.Pipe.DEBUG = true;

var app = ydn.crm.inj.App.runApp();


document.getElementById('go-email').onclick = function(e) {
  var main = document.querySelector('table[role="presentation"]');
  if (main) {
    main.parentElement.removeChild(main);
    location.hash = '';
  } else {
    main = document.createElement('div');
    main.innerHTML = '<table role="presentation"><tr>' +
        '<td></td><td></td><td style="height: 624px;">' +
        '<table><tbody><tr><td><img jid="some@example.com"/>' +
        '</td></tr></tbody>' +
        '</table></td></tr></table>';
    document.body.appendChild(main);
    location.hash = 'inbox/2345675435';
  }
}



