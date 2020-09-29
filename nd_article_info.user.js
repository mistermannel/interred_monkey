// ==UserScript==
// @name        Interred Monkey
// @namespace   ND
// @author      Netdoktor.de GmbH
// @include     /^https?://www\.netdoktor\.de/
// @include     /^https?://stage\.netdoktor\.de/
// @include     /^https?://(.*)-nd\.nerddoktor\.de/
// @include     /^https?://(.*\.)?netdoktor\.dev/
// @include     /^https?://(.*\.)?netdoktor\.localhost/
// @downloadURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_info.user.js
// @updateURL   https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_info.user.js
// @version     3.2
// @grant       none
// @require     https://vuejs.org/js/vue.min.js
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @require     https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/article_info/app.js
// @run-at      document-body
// @noframes
// ==/UserScript==

window.jq = $.noConflict(true);

(function () {
    'use strict';
    vueMonkey.isReady(function () {
        vueMonkey.startApp();
    });
})();
