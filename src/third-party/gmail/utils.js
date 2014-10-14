/**
 * @fileoverview About this file
 */


goog.provide('ydn.gmail.Utils');
goog.provide('ydn.gmail.Utils.GmailViewState');
goog.require('ydn.client');



/**
 * Gmail utils.
 * @constructor
 */
ydn.gmail.Utils = function() {

};


/**
 * @define {boolean} debug flag.
 */
ydn.gmail.Utils.DEBUG = false;


/**
 * Gmail view state.
 * @enum {string}
 */
ydn.gmail.Utils.GmailViewState = {
  CONTACT: 'ct',
  CONTACT_DETAIL: 'cd',
  COMPOSE: 'cp',
  INBOX: 'in',
  EMAIL: 'em', // email thread
  UNKNOWN: 'un'
};


/**
 * @param {string=} opt_hash URL hash
 * @return {ydn.gmail.Utils.GmailViewState} return true if given URL hash is believe to be email thread.
 */
ydn.gmail.Utils.getState = function(opt_hash) {
  var hash = opt_hash || location.hash;
  if (hash.charAt(0) == '#') {
    hash = hash.substr(1);
  }
  if (/^contact(\/\[w\W]+)?\/[a-f\d]{2,18}$/.test(hash)) {
    return ydn.gmail.Utils.GmailViewState.CONTACT_DETAIL;
  } else if (/^contacts(\/\[w\W]+)?/.test(hash)) { // could either be #contacts or contact/id123
    return ydn.gmail.Utils.GmailViewState.CONTACT;
  } else if (/compose=new$/.test(hash)) { // compose new
    return ydn.gmail.Utils.GmailViewState.COMPOSE;
  } else if (/^(label\/)?[\w\+]+$/.test(hash)) {
    return ydn.gmail.Utils.GmailViewState.INBOX;
  } else if (/^(label\/)?[\w\+]+\/[a-f\d]{10,18}$/.test(hash)) {
    return ydn.gmail.Utils.GmailViewState.EMAIL;
  } else {
    return ydn.gmail.Utils.GmailViewState.UNKNOWN;
  }
};


/**
 * Find all email addresses appear on DOM. Note: the result is too noisy.
 * @return {Array.<string>} All email address in document.
 * @private
 */
ydn.gmail.Utils.sniffAllEmailsInDocumentByRegexp_ = function() {
  var text = document.body.innerHTML;
  var emails = text.match(/(\w+@[\w\.?]+\.\w+)/g);
  if (!emails) {
    return [];
  }
  var unique_emails = [];
  for (var i = 0; i < emails.length; i++) {
    var email = emails[i].toLowerCase();
    if (unique_emails.indexOf(email) == -1) {
      unique_emails.push(email);
    }
  }
  return unique_emails;
};


/**
 * Find all email addresses appear span Element with email attribute.
 * @return {Array.<string>} All email address in document.
 */
ydn.gmail.Utils.sniffAllEmailsInDocument = function() {
  var spans = document.querySelectorAll('span[email]');
  var emails = [];
  for (var i = spans.length - 1; i >= 0; i--) {
    var email = spans[i].getAttribute('email');
    if (emails.indexOf(email) == -1 &&
        email.indexOf('daemon@') == -1 &&
        email.indexOf('noreply@') == -1) {
      emails.push(email);
    }
  }
  return emails;
};


/**
 * Sniff login user gmail by SPAN Element with me attribute.
 * @param {number} retry retry count if fail.
 * @return {!goog.async.Deferred}
 * @private
 */
ydn.gmail.Utils.sniffGmail_ = function(retry) {
  // Note: Sniffing work only when gmail was loaded.
  var email_span = document.querySelector('span[name="me"][email]');
  if (email_span) {
    var email = email_span.getAttribute('email');
    if (ydn.gmail.Utils.DEBUG) {
      window.console.log('sniff as ' + email + ' by me span Element');
    }
    return goog.async.Deferred.succeed(email);
  }
  var m = document.title.match(/- (\S+@\S+\.\S+) -/);
  if (m) {
    if (ydn.gmail.Utils.DEBUG) {
      window.console.log('sniff as ' + email + ' by title');
    }
    return goog.async.Deferred.succeed(m[1]);
  }
  retry--;
  var df = new goog.async.Deferred();
  if (ydn.gmail.Utils.DEBUG) {
    window.console.log('sniff as will retry for ' + retry);
  }
  if (retry > 0) {
    setTimeout(function() {
      ydn.gmail.Utils.sniffGmail_(retry).chainDeferred(df);
    }, 500);
  } else {
    df.errback(null);
  }
  return df;
};


/**
 * Sniff current gmail address.
 * @return {!goog.async.Deferred}
 */
ydn.gmail.Utils.getUserEmail = function() {
  if (location.origin != 'https://mail.google.com') {
    if (ydn.gmail.Utils.DEBUG) {
      window.console.log('not in gmail');
    }
    return goog.async.Deferred.fail(null);
  }
  // Note: Sniffing work only when gmail was loaded.

  // var email_span = document.querySelector('span[name="me"][email]');
  return ydn.gmail.Utils.sniffGmail_(3).addErrback(function(e) {
    return ydn.gmail.Utils.getUserEmailByFeed();
  });


};


/**
 * Return default user gmail address by sending feed request in content script
 * of gmail. This is not same as in gmail when user is using multiple login.
 * @return {!goog.async.Deferred}
 */
ydn.gmail.Utils.getUserEmailByFeed = function() {
  if (location.origin != 'https://mail.google.com') {
    return goog.async.Deferred.fail('');
  }
  var url = 'https://mail.google.com/mail/feed/atom/bazinga';
  var data = new ydn.client.HttpRequestData(url, 'GET', {'zx': '124'});
  var req = ydn.client.getClient(ydn.http.Scopes.DEFAULT).request(data);
  var df = new goog.async.Deferred();
  var tid = window.setTimeout(function() {
    if (!df.hasFired()) {
      if (ydn.gmail.Utils.DEBUG) {
        window.console.log('sniff fail by feed timeout');
      }
      df.errback();
      df = null;
    }
  }, 2000);
  req.execute(function(json, raw) {
    if (!df) {
      return;
    }
    if (raw.isSuccess()) {
      var text = raw.getBody();
      var m = text.match(/<title>(.+?)(\S+)<\/title>/);
      if (m) {
        if (ydn.gmail.Utils.DEBUG) {
          window.console.log('sniff as ' + m[2] + ' by feed');
        }
        df.callback(m[2]);
      } else {
        if (ydn.gmail.Utils.DEBUG) {
          window.console.log('sniff fail by feed');
        }
        df.errback();
      }
    } else {
      df.errback();
    }
  });
  return /** @type {!goog.async.Deferred} */ (df);
};


/**
 * Sniff account choosing user id (acui) for Google multiple login.
 * This is selector index on Google service login @link
 * https://accounts.google.com/ServiceLogin
 * Current URI path should be like https://mail.google.com/mail/u/2/, then
 * this return 2.
 * @return {number}
 */
ydn.gmail.Utils.getGoogleAcui = function() {
  // location sould be: https://mail.google.com/mail/u/0/
  var m = window.location.pathname.match(/^\/mail\/[^\/]+\/(\d+)\//);
  if (m) {
    var d = parseInt(m[1], 10);
    return isNaN(d) ? 0 : d;
  } else {
    return 0;
  }
};

