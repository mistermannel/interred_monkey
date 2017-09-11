// ==UserScript==
// @name ND Article ID
// @namespace ND
// @author Netdoktor.de GmbH
// @include http://www.netdoktor.de/*
// @include https://www.netdoktor.de/*
// @include http://stage.netdoktor.de/*
// @include https://stage.netdoktor.de/*
// @include /^.*dev\.cms\.nd\-intern:.*/
// @downloadURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_info.user.js
// @updateURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_info.user.js
// @version 2.6
// @grant none
// ==/UserScript==

(function() {
    'use strict';

    // method to set sourcepoint environment to stage or public
    window.setSourcepointEnv = function (envName) {
        if((envName == 'stage') || (envName == 'public')) {
            document.getElementById("sourcepointEnvIFrame").src='http://sp-messaging.netdoktor.de/mms/qa_set_env?env=' + envName;
        }
    };
    // controls to set sourcepoint env
    var codeSourcePoint = '<iframe id="sourcepointEnvIFrame" height="0" width="0" border="0" style="border:0px;"></iframe>' +
        '<strong>sourcepoint: </strong><a onClick="javascript:window.setSourcepointEnv(\'stage\');" href="#" style="font-size:14px;">stage</a> | <a onClick="javascript:window.setSourcepointEnv(\'public\');" href="#" style="font-size:14px;">public</a><br />';


    var displayInfo = false;
    var editorialInfoDiv = document.createElement('div');
    editorialInfoDiv.className = "article-icd";
    //font-family: 'Roboto', 'sans-serif'; font-size: 14px; line-height: 1.7;
    if(dataLayer[0].page.pageType == 'interred') {
        displayInfo = true;
        var articleId = 'n/a';
        try {
            articleId = dataLayer[0].page.articleID;
        } catch(error) {}
        var csId = 'n/a';
        try {
            csId = dataLayer[0].page.content.csId;
        } catch(error) {}
        var articleTopic = 'n/a';
        try {
            var topics = [];
            for (var key in dataLayer[0].page.topic.main) {
                topics.push(dataLayer[0].page.topic.main[key]);
            }
            articleTopic = '<span class="editorial-info">'+topics.join('</span>&nbsp;/ <span class="editorial-info">')+'</span>';
        } catch(error) {}
        var pageType = 'no type';
        try {
            pageType = dataLayer[0].page.pageType;
        } catch(error) {}
        var articleType = 'no type';
        try {
            articleType = dataLayer[0].page.articleType.interredType+'&nbsp;| '+dataLayer[0].page.articleType.type+'&nbsp;| '+dataLayer[0].page.articleType.subType;
        } catch(error) {}
        // infos
        editorialInfoDiv.innerHTML = '<details class="details-box">' +
            '<summary class="details-header"><strong>article id: </strong><span class="editorial-info">'+articleId+'</span> <strong>cs-id: </strong>'+csId+'</summary>' +
            '<div class="details-info">' +
            '<strong>topic: </strong>'+articleTopic+'<br />' +
            '<strong>source: </strong>interred<br />' +
            '<strong>type: </strong>'+articleType+'<br />' +
            '<br />' +
            codeSourcePoint +
            '<br />' +
            'Herzlichen Gru&szlig;,<br .>Euer Produktmanagement.' +
            '</div></details>';
    } else if(dataLayer[0].page.pageType == 'cms') {
        displayInfo = true;
        var pageId = 'n/a';
        try {
            pageId = dataLayer[0].page.cmsPageId;
        } catch(error) {}
        var pageCsId = 'n/a';
        try {
            pageCsId = dataLayer[0].page.content.csId;
        } catch(error) {}
        var pageDate = 'n/a';
        try {
            pageDate = dataLayer[0].page.publishDate;
        } catch(error) {}
        // infos
        editorialInfoDiv.innerHTML = '<details class="details-box">' +
            '<summary class="details-header"><strong>cms page id: </strong><span class="editorial-info">'+pageId+'</span> <strong>cs-id: </strong>'+pageCsId+'</summary>' +
            '<div class="details-info">' +
            '<strong>created: </strong>'+pageDate+'<br />' +
            '<br />' +
            codeSourcePoint +
            '<br />' +
            'Herzlichen Gru&szlig;,<br .>Euer Produktmanagement.' +
            '</div></details>';
    }
    var pageBodyTags = document.getElementsByTagName('body');
    if(displayInfo && (pageBodyTags !== 'undefined') && (pageBodyTags[0] !== 'undefined')) {
        var pageBody = pageBodyTags[0];
        pageBody.insertBefore(editorialInfoDiv, pageBody.firstChild);
        // style
        var editorialInfoStyle = document.createElement('style');
        editorialInfoStyle.innerHTML = '.editorial-info { -webkit-user-select: all; -moz-user-select: all; -ms-user-select: all; user-select: all; }' +
            '.card-style { background-color: #ffffff; background-color: var(--white); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5); }' +
            '.details-box { z-index:99; margin:10px; background-color: #ffffff; background-color: var(--white); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5); position: fixed; top: 0;px left: 0; width: 300px; background: #fff; opacity: 0.9; font-family:Roboto, sans-serif; font-size:14px; line-height:23.8px; text-size-adjust:100%; -webkit-font-smoothing:antialiased; -webkit-tap-highlight-color:rgba(0, 0, 0, 0); }' +
            '.details-header { margin-top:10px; margin-left:10px; margin-bottom:10px; }' +
            '.details-info { margin-top:3px; margin-left:25px; margin-bottom:10px; }';
        pageBody.insertBefore(editorialInfoStyle, pageBody.firstChild);
    }
})();
