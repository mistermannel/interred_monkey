// ==UserScript==
// @name UserGroup Manager
// @namespace ND
// @author Netdoktor.de GmbH
// @include /^https?://www\.netdoktor\.de/
// @include /^https?://stage\.netdoktor\.de/
// @include /^https?://(.*)-nd\.nerddoktor\.de/
// @include /^https?://(.*\.)?netdoktor\.dev/
// @include /^https?://(.*\.)?netdoktor\.localhost/
// @downloadURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_usergroup.user.js
// @updateURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_usergroup.user.js
// @version 1.0
// @grant none
// ==/UserScript==

(function () {
    'use strict';

    let groupId = getCurrentGroup();

    let groupSelectorDiv = document.createElement('div');
    groupSelectorDiv.style.zIndex = "100000000000";
    groupSelectorDiv.style.position = "absolute";
    groupSelectorDiv.style.top = "0px";
    groupSelectorDiv.style.right = "0px";
    groupSelectorDiv.style.backgroundColor = "#eee";

    let group0Div = document.createElement('a');
    group0Div.innerHTML = "Group 0";
    group0Div.style.margin = "4px";
    group0Div.style.color = "#000";
    group0Div.style.fontFamily = "Courier New";
    group0Div.style.fontSize = "12px";
    if(groupId == "0") {
        group0Div.style.textDecoration = "underline";
        group0Div.style.fontWeight = "600";
    }
    group0Div.href = "javascript:void(0);";
    group0Div.onclick = function () {
        joinGroup(0);
    };

    let group1Div = document.createElement('a');
    group1Div.innerHTML = "Group 1";
    group1Div.style.margin = "4px";
    group1Div.style.color = "#000";
    group1Div.style.fontFamily = "Courier New";
    group1Div.style.fontSize = "12px";
    if(groupId == "1") {
        group1Div.style.textDecoration = "underline";
        group1Div.style.fontWeight = "600";
    }
    group1Div.href = "javascript:void(0);";
    group1Div.onclick = function () {
        joinGroup(1);
    };

    groupSelectorDiv.appendChild(group0Div);
    groupSelectorDiv.appendChild(group1Div);
    document.body.appendChild(groupSelectorDiv);

    function joinGroup(groupId) {
        let groupQueryString = 'nd_groupid='+groupId;
        let oldUrl = window.location.href;
        if(oldUrl.split('?').length == 1) {
            window.location.href = oldUrl+'?'+groupQueryString;
        }
        let url = oldUrl.split('?')[0];
        var queryList = oldUrl.split('?')[1].split('&');
        queryList = queryList.filter(x => !x.startsWith('nd_groupid'));
        queryList.push(groupQueryString);
        console.log(url+'?'+queryList.join('&'));
        window.location.href = url+'?'+queryList.join('&');
    }

    function getCurrentGroup() {
        let groupInfo = window.dataLayer.filter(x => (x !== undefined) && (x["user"] !== undefined) && (x["user"]["testgroups"] !== undefined) && (x["user"]["testgroups"]["ndGroupId"] !== undefined))
        if (groupInfo.length == 0) {
            return undefined;
        }
        return ""+groupInfo[0]["user"]["testgroups"]["ndGroupId"];
    }
}());
