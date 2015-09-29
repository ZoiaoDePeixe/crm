/**
 * @fileoverview About this file
 */


goog.provide('ydn.gmail.Utils');
goog.provide('ydn.gmail.Utils.GmailViewState');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
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
 * @const
 * @type {string} attribute for message id.
 */
ydn.gmail.Utils.ATTR_MESSAGE_ID = 'data-mid';


/**
 * @const
 * @type {string} attribute for email message header was injected.
 */
ydn.gmail.Utils.ATTR_INJECTED = 'ydn-widget';


/**
 * @const
 * @type {string} attribute for document id.
 * @deprecated no used
 */
ydn.gmail.Utils.ATTR_DOCUMENT_ID = 'data-document-id';


/**
 * @const
 * @type {string} attribute for document id.
 * @deprecated no used
 */
ydn.gmail.Utils.ATTR_DOCUMENT_NAME = 'data-document-name';


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
 * @type {string}
 * @private
 */
ydn.gmail.Utils.gmail_ = '';


/**
 * @type {goog.async.Deferred<string>}
 * @private
 */
ydn.gmail.Utils.gmail_df_ = null;


/**
 * Sniff current gmail address.
 * @return {!goog.async.Deferred<string>}
 */
ydn.gmail.Utils.sniffUserEmail = function() {
  if (!ydn.gmail.Utils.gmail_df_) {
    if (location.origin != 'https://mail.google.com') {
      if (ydn.gmail.Utils.DEBUG) {
        window.console.log('not in gmail');
      }
      ydn.gmail.Utils.gmail_df_ = goog.async.Deferred.fail(null);
    } else if (ydn.gmail.Utils.isOfflineGmailApp()) {
      // Note: Sniffing work only when gmail was loaded.

      var email = ydn.gmail.Utils.getOfflineUserEmail();
      ydn.gmail.Utils.gmail_df_ = goog.async.Deferred.succeed(email);
    } else {
      // var email_span = document.querySelector('span[name="me"][email]');
      ydn.gmail.Utils.gmail_df_ = ydn.gmail.Utils.sniffGmail_(3).addErrback(function(e) {
        return ydn.gmail.Utils.getUserEmailByFeed();
      });
    }

    ydn.gmail.Utils.gmail_df_.addCallback(function(x) {
      ydn.gmail.Utils.gmail_ = x;
    });
  }

  return ydn.gmail.Utils.gmail_df_.branch();
};


/**
 * Get user gmail address.
 * @return {string}
 * @see #sniffUserEmail must already called and its promise has been resolved.
 */
ydn.gmail.Utils.getUserEmail = function() {
  return ydn.gmail.Utils.gmail_;
};


/**
 * Check current web app is an offline Gmail app.
 * @return {boolean}
 */
ydn.gmail.Utils.isOfflineGmailApp = function() {
  return !!document.querySelector('html').getAttribute('manifest');
};


/**
 * Sniff user gmail address of offline Gmail app.
 * @return {?string}
 * @see ydn.gmail.Utils.sniffUserEmail for sniffing current gmail address.
 */
ydn.gmail.Utils.getOfflineUserEmail = function() {
  var m = document.head.innerHTML.match(/USER_EMAIL\s=\s"([^"]+)"/);
  if (m) {
    return m[1];
  } else {
    return null;
  }
};


/**
 * Gmail interface language.
 * @type {?string}
 * @private
 */
ydn.gmail.Utils.lang_ = null;


/**
 * Heuristically detect language used in Gmail interface.
 * The value is cached for life time, since it cannot be changed.
 * @return {?string} ISO 639 two letter language code, e.g: 'us', 'de'.
 */
ydn.gmail.Utils.getLang = function() {
  if (!ydn.gmail.Utils.lang_) {
    // Find Privacy link, they are two or three links in raw.
    var a3 = document.querySelectorAll('a ~ a');
    for (var i = 0; i < a3.length; i++) {
      var href = a3[i].href || '';
      var m = href.match(/\/intl\/([^\/]+)\//);
      if (m && m[1]) {
        var parts = m[1].split('-'); // 'en-US'
        ydn.gmail.Utils.lang_ = parts[0]; // 'en'
        break;
      }
    }
  }
  return ydn.gmail.Utils.lang_ || null;
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
  var client = ydn.client.getDefaultClient();
  var req = client.request(data);
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
 * @type {number|undefined}
 * @private
 */
ydn.gmail.Utils.acui_ = undefined;


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
  if (!goog.isDef(ydn.gmail.Utils.acui_)) {
    var m = window.location.pathname.match(/^\/mail\/[^\/]+\/(\d+)\//);
    if (m) {
      var d = parseInt(m[1], 10);
      ydn.gmail.Utils.getGoogleAcui.acui_ = isNaN(d) ? 0 : d;
    } else {
      ydn.gmail.Utils.getGoogleAcui.acui_ = 0;
    }
  }

  return ydn.gmail.Utils.acui_ || 0;
};


/**
 * Get "Send" button in Gmail UI.
 * @param {Element} root
 * @return {Element}
 */
ydn.gmail.Utils.findSendButton = function(root) {
  var buttons = root.querySelectorAll('div[role="button"]');
  for (var i = buttons.length - 1; i >= 0; i--) {
    var btn = buttons[i];
    var aria_label = btn.getAttribute('aria-label');
    // it should be "Send ‪(⌘Enter)"
    // ‪(⌘Enter) work for any language
    if (aria_label && (aria_label.indexOf('Enter)') > 0 ||
        aria_label.indexOf('Send)') > 0)) {
      // todo: Only 'English' ?
      return btn;
    }
  }
  return null;
};


/**
 * @typedef {{
 *   fn: string,
 *   mime: string,
 *   document_id: (string|undefined),
 *   document_name: (string|undefined),
 *   url: string
 * }}
 */
ydn.gmail.Utils.AttachmentParts;


/**
 * Example:
 * <pre>
 *   {
 *     "from_addr": "chad@sugaroutfitters.com",
 *     "to_addrs": "kyawtun@yathit.com, kyaw@yathit.com",
 *     "date_sent": "2015-02-25T14:14:00.000Z",
 *     "download_urls": ["application/html:page.html:https://mail.google.com/mail/u/0/?page.html"]
 *     "html": "<div dir=\"ltr\">hahaha that is awesome. </div>",
 *     "mailbox_id": "kyawtun@yathit.com",
 *     "message_id": "14bc1172ff3a9a20",
 *     "subject": "Getting started material"
 *   }
   </pre>
 * @typedef {{
 *   from_addr: string,
 *   to_addrs: string,
 *   date_sent: Date,
 *   attachments: Array<ydn.gmail.Utils.AttachmentParts>,
 *   text: string,
 *   html: string,
 *   subject: string,
 *   mailbox_id: string,
 *   message_id: string
 * }}
 */
ydn.gmail.Utils.EmailInfo;


/**
 * Sniff message id from email content title Element
 * @param {Element} content_title parent element of email content element.
 * @return {string} message id empty string if fail to get message id.
 */
ydn.gmail.Utils.sniffMessageId = function(content_title) {
  // sniff message Id. it is in longest class name prefix with 'm'
  // className is something like: ii gt m14525197eea77a76 adP adO
  // where message id is: 14525197eea77a76
  var cls = content_title.className.split(/\s/);
  var len = cls.map(function(x) {return x.length;});
  var max = len.indexOf(Math.max.apply(Math, len));
  if (cls[max].length > 10) {
    var mail_id = cls[max].substring(1);
    if (cls[max].charAt(0) != 'm') {
      window.console.warn('not start with m? ' + cls[max]);
    }
    return mail_id;
  }
  return '';
};


/**
 * Gather email info for a given a starting element 'el'.
 * <pre>
 *   el = document.querySelector('div[data-tooltip=Reply]')
 *   ydn.gmail.Utils.gatherEmailInfo(el)
 * </pre>
 * Example output:
 * <pre>
 *   {
 *     "from_addr": "chad@sugaroutfitters.com",
 *     "to_addrs": "kyawtun@yathit.com, kyaw@yathit.com",
 *     "date_sent": "2015-02-25T14:14:00.000Z",
 *     "attachments": [],
 *     "html": "<div dir=\"ltr\">hahaha that is awesome. </div>",
 *     "mailbox_id": "kyawtun@yathit.com",
 *     "message_id": "14bc1172ff3a9a20",
 *     "subject": "Getting started material"
 *   }
 * </pre>
 * @param {Element} el An element under message heading node.
 * @return {?ydn.gmail.Utils.EmailInfo}
 */
ydn.gmail.Utils.gatherEmailInfo = function(el) {
  var from_addr = '';
  var to_addrs = '';
  var date_sent;
  var text = '';
  var html = '';
  var mail_id = '';
  var subject = '';
  // email header title row
  var tr_heading = goog.dom.getAncestorByTagNameAndClass(el, goog.dom.TagName.TR);
  var td0 = tr_heading.children[0]; // sender email address node
  var sender_span = td0.querySelector('span[email]');
  if (sender_span) {
    from_addr = sender_span.getAttribute('email');
  } else {
    if (ydn.gmail.Utils.DEBUG) {
      window.console.warn('cannot sniff sender email');
      window.console.log(el, tr_heading, td0);
    }
    return null;
  }
  var td1 = tr_heading.children[1]; // sent date node
  var date_span = td1.querySelector('span[alt]');
  if (date_span) {
    var date_str = date_span.getAttribute('alt');
    // something like: "Wed, Apr 2, 2014 at 1:06 AM"
    date_sent = new Date(date_str.replace(' at', ''));
  } else {
    if (ydn.gmail.Utils.DEBUG) {
      window.console.warn('cannot sniff date sent');
      window.console.log(el, tr_heading, td1);
    }
    return null;
  }

  var tr_addrs = tr_heading.nextElementSibling;
  if (!tr_addrs || tr_addrs.tagName != goog.dom.TagName.TR) {
    if (ydn.gmail.Utils.DEBUG) {
      window.console.warn('to email address TR expect after title TR');
      window.console.log(el, tr_heading, tr_addrs);
    }
    return null;
  }
  var email_spans = tr_addrs.querySelectorAll('span[email]');
  for (var i = 0; i < email_spans.length; i++) {
    if (to_addrs) {
      to_addrs += ', ';
    }
    to_addrs += email_spans[i].getAttribute('email');
  }

  var heading_table = goog.dom.getAncestorByTagNameAndClass(tr_heading, goog.dom.TagName.TABLE);

  var email_content_div = heading_table.parentElement.nextElementSibling;

  for (var i = 0; !!email_content_div && i < 10; i++) {
    var content = email_content_div.querySelector('div[style]');
    if (content) {
      // sniff message Id. it is in longest class name prefix with 'm'
      // className is something like: ii gt m14525197eea77a76 adP adO
      // where message id is: 14525197eea77a76
      var content_title = content.parentElement;
      mail_id = ydn.gmail.Utils.sniffMessageId(content_title);
      html = content.innerHTML;
      text = content.innerText;
      if (mail_id) {
        break;
      } else {
        email_content_div = email_content_div.nextElementSibling;
      }
    } else {
      email_content_div = email_content_div.nextElementSibling;
    }
  }

  var download_urls = [];
  if (email_content_div && email_content_div.nextElementSibling &&
      email_content_div.nextElementSibling.nextElementSibling) {
    var attachment_panel_el = email_content_div.nextElementSibling.nextElementSibling;
    var attachment_els = attachment_panel_el.querySelectorAll('[download_url]');
    for (var i = 0; i < attachment_els.length; i++) {
      var d_url = attachment_els[i].getAttribute('download_url');
      var parts = ydn.gmail.Utils.parseDownloadUrl(d_url);
      download_urls[i] = parts;
    }
  }

  var table_thread = goog.dom.getAncestorByTagNameAndClass(
      heading_table.parentElement, goog.dom.TagName.TABLE);
  for (var i = 0; !!table_thread && i < 10; i++) {
    if (table_thread.getAttribute('role') == 'presentation') {
      break;
    }
    table_thread = goog.dom.getAncestorByTagNameAndClass(table_thread, goog.dom.TagName.TABLE);
  }
  if (table_thread && table_thread.getAttribute('role') == 'presentation') {
    var h2 = table_thread.querySelector('h2');
    if (h2) {
      subject = h2.textContent;
    } else if (ydn.gmail.Utils.DEBUG) {
      window.console.warn('email subject cannot be sniff');
    }
  } else if (ydn.gmail.Utils.DEBUG) {
    window.console.warn('expect a presentation role TABLE');
  }

  return {
    from_addr: from_addr,
    to_addrs: to_addrs,
    date_sent: date_sent,
    html: html,
    text: text,
    mailbox_id: ydn.gmail.Utils.getUserEmail(),
    message_id: mail_id,
    subject: subject,
    attachments: download_urls
  };
};


/**
 * Sniff message from email attachment anchor.
 * <pre>
 *   var anchor = document.querySelector('span[download_url]');
 *   var mid = sniffMessageIdFromDownloadElement(anchor);
 * </pre>
 * @param {Element} anchor attachment anchor element which has download_url
 * attribute.
 * @return {string} message id
 */
ydn.gmail.Utils.sniffMessageIdFromDownloadElement = function(anchor) {
  var attachment_holder = anchor.parentElement;
  var attachment_panel = attachment_holder.parentElement;
  var separator = attachment_panel.previousElementSibling;
  var message_content_title = separator.previousElementSibling;
  return ydn.gmail.Utils.sniffMessageId(message_content_title);
};


/**
 * Parse attachment download url.
 * download_url is something like: `"application/octet-stream:
 * ydn.db-is-sql-e-cur-qry-text-dev.js.map:https://mail.google
 * .com/mail/u/0/?ui=2&ik=6356a677e5&view=att&th=149f91526d1dd46a&attid=
 * 0.2&disp=safe&realattid=f_i32a2b541&zw"`
 * <pre>
 *   var download_url = document.querySelect('[download_url]');
 *   ydn.gmail.Utils.parseDownloadUrl(download_url);
 * </pre>
 * @param {string} download_url
 * @return {ydn.gmail.Utils.AttachmentParts}
 */
ydn.gmail.Utils.parseDownloadUrl = function(download_url) {

  var parts = download_url.split(':');
  var fn = decodeURIComponent(parts[1]);
  var mime = parts[0];
  var url = parts[2] + ':' + parts[3];
  return {
    fn: fn,
    mime: mime,
    url: url
  };
};


/**
 * Sniff message id in Gmail notification area (center top in yellow box).
 * @return {string} gmail message id.
 * @private
 */
ydn.gmail.Utils.sniffNotifiedMessageId_ = function() {
  var link_vsm = document.getElementById('link_vsm');
  return link_vsm ? link_vsm.getAttribute('param') : '';
};


/**
 * @param {Function} cb
 * @param {number} max
 * @param {number} i
 * @private
 */
ydn.gmail.Utils.getNotifiedMessageId_ = function(cb, max, i) {
  var id = ydn.gmail.Utils.sniffNotifiedMessageId_();
  if (id || i > max) {
    cb(id);
    return;
  }
  setTimeout(function() {
    ydn.gmail.Utils.getNotifiedMessageId_(cb, max, ++i);
  }, 100);
};


/**
 * Get message id in Gmail notification area (center top in yellow box).
 * This notification appear only after sending an email.
 * @return {!goog.async.Deferred<string>} if no found in reasonable time,
 * return empty string.
 */
ydn.gmail.Utils.getNotifiedMessageId = function() {
  var df = new goog.async.Deferred();
  ydn.gmail.Utils.getNotifiedMessageId_(function(id) {
    df.callback(id);
  }, 20, 0);
  return df;
};
