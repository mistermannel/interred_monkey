// ==UserScript==
// @name IQ Layover
// @namespace ND
// @author Netdoktor.de GmbH
// @include /^https?://www\.netdoktor\.de/
// @include /^https?://stage\.netdoktor\.de/
// @include /^https?://cms\.nd\-intern:\d+/
// @include /^https?://(.*\.)?netdoktor\.dev/
// @include /^https?://(.*\.)?netdoktor\.localhost/
// @include /^https?://10.14.6.23:\d+/
// @downloadURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_layover.user.js
// @updateURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_layover.user.js
// @version 1.2.2
// @grant none
// ==/UserScript==

(function () {
    'use strict';
    let mySections = document.querySelectorAll("div.section");
    for (let i = 0; i < mySections.length; i++) {
        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = getNarmalizedNameFromClass(mySections[i].className);
        titleDiv.style.position = "absolute";
        titleDiv.style.backgroundColor = "#999999";
        titleDiv.style.color = "#ffffff";
        mySections[i].insertBefore(titleDiv, mySections[i].firstChild);
    }
    mySections = document.querySelectorAll("div.section > div > div.left");
    for (let i = 0; i < mySections.length; i++) {
        mySections[i].style.border = "1px solid #dddddd99";
        mySections[i].style.backgroundColor = "#dddddd55";
    }
    mySections = document.getElementsByClassName("slot");
    for (let i = 0; i < mySections.length; i++) {
        mySections[i].style.border = "1px solid #00bef799";
        mySections[i].style.minHeight="32px";
        mySections[i].style.backgroundColor = "#00bef755";

        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = getNarmalizedNameFromClass(mySections[i].className);
        titleDiv.style.position = "absolute";
        titleDiv.style.backgroundColor = "#999999";
        titleDiv.style.color = "#ffffff";
        mySections[i].insertBefore(titleDiv, mySections[i].firstChild);
    }
    mySections = document.getElementsByTagName("iq-ad");
    for (let i = 0; i < mySections.length; i++) {
        let device = mySections[i].getAttribute('slot');
        let adType = '';
        if(
            ((window.innerWidth >= 768) && (device == 'desktop')) ||
            ((window.innerWidth < 768) && (device == 'mobile'))
        ) {
            adType = mySections[i].getAttribute('type');
            mySections[i].style.border = "1px solid #ee7f0099";
            mySections[i].style.minHeight="32px";
            mySections[i].style.backgroundColor = "#ee7f0055";

            let titleDiv = document.createElement('div');
            titleDiv.innerHTML = adType;
            titleDiv.style.position = "absolute";
            titleDiv.style.zIndex = "99999";
            titleDiv.style.backgroundColor = "#999999";
            titleDiv.style.color = "#ffffff";
            mySections[i].insertBefore(titleDiv, mySections[i].firstChild);
        }
    }

    function getNarmalizedNameFromClass(className) {
        let matching = className.match(/slot-section-((margin|container)-[0-9])/);
        if(matching !== null) {
            return matching[1];
        }
        matching = className.match(/(section-[0-9]+)/);
        if(matching !== null) {
            return matching[1];
        }
        return className;
    }
}());
