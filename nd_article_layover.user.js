// ==UserScript==
// @name BFA Layover
// @namespace ND
// @author Netdoktor.de GmbH
// @include /^https?://www\.netdoktor\.de/
// @include /^https?://stage\.netdoktor\.de/
// @include /^https?://(.*)-nd\.nerddoktor\.de/
// @include /^https?://(.*\.)?netdoktor\.dev/
// @include /^https?://(.*\.)?netdoktor\.localhost/
// @downloadURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_layover.user.js
// @updateURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_layover.user.js
// @version 2.2
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    // add layer for sections
    let allSections = document.querySelectorAll('section.section');
    for (var i = 0; i < allSections.length; i++) {
        allSections[i].style.border = "1px solid #dddddd99";
        allSections[i].style.backgroundColor = "#dddddd55";

        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = "no:"+getSectionNumber(allSections[i])+" type:"+getSectionType(allSections[i]);
        titleDiv.style.position = "absolute";
        titleDiv.style.top = "0";
        titleDiv.style.backgroundColor = "#eee";
        titleDiv.style.color = "#000";
        titleDiv.style.fontFamily = "Courier New";
        titleDiv.style.fontSize = "12px";

        let articleGridDiv = allSections[i].firstChild;
        articleGridDiv.style.position = "relative";
        // articleGridDiv.insertBefore(titleDiv, articleGridDiv.firstChild);
        articleGridDiv.appendChild(titleDiv);
    }

    function getSectionType(sectionNode) {
        let classNames = Array.prototype.slice.call(sectionNode.classList);
        let sectionTypeClass = classNames.filter(x => (""+x).startsWith("section-type-"));
        if(sectionTypeClass.length > 0) {
            return sectionTypeClass[0];
        }
        return "n/a";
    }

    function getSectionNumber(sectionNode) {
        let classNames = Array.prototype.slice.call(sectionNode.classList);
        let sectionTypeClass = classNames.filter(x => ("" + x).startsWith("section-") && !("" + x).startsWith("section-type-"));
        if (sectionTypeClass.length > 0) {
            return (""+sectionTypeClass[0]).substr(8);
        }
    }

    // add layer for ads
    let allAds = document.getElementsByTagName('nd-advertisement');
    for (let i = 0; i < allAds.length; i++) {
        allAds[i].style.border = "1px solid #00bef799";
        allAds[i].style.minHeight="32px";
        allAds[i].style.backgroundColor = "#00bef755";

        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = allAds[i].id;
        titleDiv.style.position = "absolute";
        titleDiv.style.top = "16px";
        titleDiv.style.backgroundColor = "#eee";
        titleDiv.style.color = "#000";
        titleDiv.style.fontFamily = "Courier New";
        titleDiv.style.fontSize = "12px";
        allAds[i].insertBefore(titleDiv, allAds[i].firstChild);
    }

}());
