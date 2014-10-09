/**
 * @fileoverview Testing sidebar.
 */

ydn.debug.log('ydn.crm', 'finest');

var setData_ = function(span, data) {
  span.setAttribute('email', data.email);
  span.setAttribute('name', data.name);
  span.textContent = data.name;
};

var setData = function(data) {


  var img_identifier = document.querySelector('img[jid]');
  if (img_identifier) {
    img_identifier.setAttribute('jid', data.email);
  }
};
// check sniff contact data.
setData({
  name: 'Kyaw Tun',  // 'Chaw Su Thwin',
  email: 'kyawtun@gmail.com' // 'chawsuthwin@gmail.com'
});

location.hash = '';
app = ydn.crm.inj.App.runApp();
var tid = setInterval(function() {
    console.log('starting sniff update');
    clearTimeout(tid);
    location.hash = 'inbox/145b8562b36d1bb7';
}, 500);
