// ==UserScript==
// @name IQ Layover
// @namespace ND
// @author Netdoktor.de GmbH
// @include /^https?://www\.netdoktor\.de/
// @include /^https?://stage\.netdoktor\.de/
// @include /^https?://cms\.nd\-intern:\d+/
// @include /^https?://(.*\.)?netdoktor\.dev/
// @include /^https?://10.14.6.23:\d+/
// @downloadURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_layover.user.js
// @updateURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_layover.user.js
// @version 1.0
// @grant none
// ==/UserScript==

(function () {
    'use strict';
    var mySections = document.querySelectorAll("div.section");
    for (i = 0; i < mySections.length; i++) {
      var titleDiv = document.createElement('div');
      titleDiv.innerHTML = mySections[i].className;
      titleDiv.style.position = "absolute";
      mySections[i].style.backgroundColor = "#999999";
      mySections[i].style.color = "#ffffff";
      mySections[i].insertBefore(titleDiv, mySections[i].firstChild);
    }
    var mySections = document.querySelectorAll("div.section > div > div.left");
    for (i = 0; i < mySections.length; i++) {
      mySections[i].style.border = "1px solid #dddddd99";
      mySections[i].style.backgroundColor = "#dddddd55";
    }
    mySections = document.getElementsByClassName("slot");
    for (i = 0; i < mySections.length; i++) {
      mySections[i].style.border = "1px solid #f4760099";
      mySections[i].style.minHeight="32px";
      mySections[i].style.backgroundColor = "#f4760055";
    }
  }());
