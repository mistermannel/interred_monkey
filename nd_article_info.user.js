// ==UserScript==
// @name ND Article ID
// @namespace ND
// @author Netdoktor.de GmbH
// @include http://www.netdoktor.de/*
// @include https://www.netdoktor.de/*
// @include http://stage.netdoktor.de/*
// @include https://stage.netdoktor.de/*
// @include /^.*cms\.nd\-intern:.*/
// @downloadURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_info.user.js
// @updateURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_info.user.js
// @version 2.10
// @grant none
// ==/UserScript==

(function() {
    'use strict';
    
    var ndirmFunctions = window.ndirmFunctions = {};
	var ndirmVersion = "2.10"

    /*
     * article navigation
     */
    ndirmFunctions.gotoArticle = function () {
        var articleId = document.getElementById("ndirm-goto-id").value;
        window.location.href="http://www.netdoktor.de/content/" + articleId;
    };

    /*
     * page type
     */
    var pageType = 'n/a';
    var pageId = 'n/a';
    if(dataLayer[0].page.pageType == 'interred') {
        pageType = 'IR article';
        try {
            pageId = dataLayer[0].page.articleID;
        } catch(error) {}
    } else {
        pageType = 'CMS page';
        try {
            pageId = dataLayer[0].page.cmsPageId;
        } catch(error) {}
    }

    /*
     * meta info
     */
    var metaInfo = '';
    if(dataLayer[0].page.pageType == 'interred') {
        var csId = 'n/a';
        try {
            csId = dataLayer[0].page.content.csId === undefined ? 'not set' : dataLayer[0].page.content.csId;
        } catch(error) {}
        var articleTopic = 'n/a';
        try {
            var topics = [];
            for (var key in dataLayer[0].page.topic.main) {
                topics.push(dataLayer[0].page.topic.main[key]);
            }
            if(topics.length > 0) {
                articleTopic = '<span class="ndirm-selectall">'+topics.join('</span>&nbsp;/ <span class="ndirm-selectall">')+'</span>';
            }
        } catch(error) {}
        var interredType = 'no type';
        try {
            interredType = dataLayer[0].page.articleType.interredType;
        } catch(error) {}
        var articleType = 'no type';
        try {
            articleType = dataLayer[0].page.articleType.type;
            if(dataLayer[0].page.articleType.subType !== undefined) {
                articleType = articleType + '&nbsp;| '+dataLayer[0].page.articleType.subType;
            }
        } catch(error) {}
        // infos
        metaInfo =
            '  <div>' +
            '    <md-divider></md-divider><div class="ndirm-acc-head ndirm-infohead ndirm-link ndirm-icons-down">Meta Info</div>' +
            '    <div class="ndirm-acc-panel-open ndirm-infocontent">' +
            '    <strong>cs-id: </strong>'+csId+'<br />' +
            '    <strong>main topic: </strong>'+articleTopic+'<br />' +
            '    <strong>source: </strong>interred<br />' +
            '    <strong>interred-type: </strong>'+interredType+'<br />' +
            '    <strong>article-type: </strong>'+articleType+'<br />' +
            '    </div>' +
            '  </div>';
    } else {
        var pageCsId = 'n/a';
        try {
            pageCsId = dataLayer[0].page.content.csId;
        } catch(error) {}
        var pageDate = 'n/a';
        try {
            pageDate = dataLayer[0].page.publishDate;
        } catch(error) {}
        metaInfo =
            '  <div>' +
            '    <md-divider></md-divider><div class="ndirm-acc-head ndirm-infohead ndirm-link ndirm-icons-down">Meta Info</div>' +
            '    <div class="ndirm-acc-panel-open ndirm-infocontent">' +
            '    <strong>cs-id: </strong>'+pageCsId+'<br />' +
            '    <strong>created: </strong>'+pageDate+'<br />' +
            '    </div>' +
            '  </div>';
    }

    /*
     * sourcepoint
     */
    // method to set sourcepoint environment to stage or public
    ndirmFunctions.setSourcepointEnv = function (envName) {
        if((envName == 'stage') || (envName == 'public')) {
            document.getElementById("sourcepointEnvIFrame").src='http://ressource1.netdoktor.de/mms/qa_set_env?env=' + envName;
        }
    };
    // controls to set sourcepoint env
    var codeSourcePoint =
        '  <div>' +
        '    <md-divider></md-divider><div class="ndirm-acc-head ndirm-infohead ndirm-link ndirm-icons-down">SourcePoint</div>' +
        '    <div class="ndirm-acc-panel-open ndirm-infocontent">' +
        '      <iframe id="sourcepointEnvIFrame" height="0" width="0" border="0" style="border:0px;"></iframe>' +
        '      <strong>sourcepoint: </strong><a onClick="javascript:window.ndirmFunctions.setSourcepointEnv(\'stage\');" href="#" style="font-size:14px;">stage</a> | <a onClick="javascript:window.ndirmFunctions.setSourcepointEnv(\'public\');" href="#" style="font-size:14px;">public</a>' +
        '    </div>' +
        '  </div>';

    /*
     * main object
     */
    var editorialInfoDiv = document.createElement('div');
    editorialInfoDiv.className = "article-icd";
    editorialInfoDiv.innerHTML = '<div class="ndirm-infobox"><div class="ndirm-acc-head ndirm-infotitle ndirm-icons-down"><span class="ndirm-link">'+pageType+'</span> (id:<span class="ndirm-selectall">'+pageId+'</span>)</div>' +
        '<div class="ndirm-acc-panel">' +
        '<input id="ndirm-goto-id" class="ndirm-input" placeholder="Enter article id" type="text" style="width:100px;" onClick=""></input>&nbsp;&nbsp;<a href="#" onClick="javascript:window.ndirmFunctions.gotoArticle()" class="ndirm-link">Go to article</a>' +
        metaInfo +
        codeSourcePoint +
        '<md-divider></md-divider>' +
        '<div class="ndirm-image-box">' +
        '<div class="ndirm-signature">Yours sincerely</div>' +
        '<img class="ndirm-image" src="https://cdn.netdoktor.de/images/internal/ir-monkey.jpg" width="180px" />' +
        '<div class="ndirm-name">Interred Monkey</div>' +
        '</div>' +
        '<div class="ndirm-footer">v '+ndirmVersion+'</div>' +
        '</div>';

    var pageBodyTags = document.getElementsByTagName('body');
    if((pageBodyTags !== 'undefined') && (pageBodyTags[0] !== 'undefined')) {
        var pageBody = pageBodyTags[0];
        pageBody.insertBefore(editorialInfoDiv, pageBody.firstChild);
        // style
        var editorialInfoStyle = document.createElement('style');
        editorialInfoStyle.innerHTML = '.ndirm-selectall { -webkit-user-select: all; -moz-user-select: all; -ms-user-select: all; user-select: all; }' +
            '.ndirm-infobox { z-index:99; margin:10px; padding:8px 16px 8px 16px; background-color: #ffffff; background-color: var(--white); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5); position: fixed; top: 0;px left: 0; width: 300px; background: #fff; opacity: 0.9; font-family:Roboto, sans-serif; font-size:14px; line-height:23.8px; text-size-adjust:100%; -webkit-font-smoothing:antialiased; -webkit-tap-highlight-color:rgba(0, 0, 0, 0); }' +
            '.ndirm-infotitle { margin-top:8px; margin-left:0px; margin-bottom:8px; }' +
            '.ndirm-infohead { margin-top:8px; margin-left:0px; margin-bottom:8px; }' +
            '.ndirm-infocontent { margin-top:0px; margin-left:8px; margin-bottom:8px; }' +
            '.ndirm-input { width: 100px; margin-bottom:8px; margin-left:8px; font-size:14px; }' +
            '.ndirm-acc-panel { display: none; }' +
            '.ndirm-acc-panel-open { display: block; }' +
            '.ndirm-icons-down::after { content:\'keyboard_arrow_down\'; color:#00bef7; float: right; font-family: "Material Icons"; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; }' +
            '.ndirm-icons-up::after { content:\'keyboard_arrow_up\'; color:#00bef7; float: right; font-family: "Material Icons"; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; }' +
            '.ndirm-signature { font-size:16px; text-align: center; margin: 32px 0px 16px 0px; }' +
            '.ndirm-name { font-size:16px; text-align: center; font-weight: 600; margin: 16px 0px 0px 0px; }' +
            '.ndirm-image-box {  }' +
            '.ndirm-image { width:180px; border-radius:50%; display: block; margin-left: auto; margin-right: auto; }' +
            '.ndirm-footer { font-size: 8px; }' +
            '.ndirm-link { font-weight:500; color:#00bef7; font-size: 14px; }';
        pageBody.insertBefore(editorialInfoStyle, pageBody.firstChild);
    }

    var acc = document.getElementsByClassName("ndirm-acc-head");
    var i;
    console.log(acc);
    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function(){
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle("ndirm-icons-up");
            this.classList.toggle("ndirm-icons-down");

            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            panel.classList.toggle("ndirm-acc-panel");
            panel.classList.toggle("ndirm-acc-panel-open");
        };
    }
})();
