// ==UserScript==
// @name Interred Monkey
// @namespace ND
// @author Netdoktor.de GmbH
// @include /^https?://www\.netdoktor\.de/
// @include /^https?://stage\.netdoktor\.de/
// @include /^https?://cms\.nd\-intern:\d+/
// @include /^https?://(.*\.)?netdoktor\.dev/
// @include /^https?://(.*\.)?netdoktor\.localhost/
// @include /^https?://10.14.6.23:\d+/
// @downloadURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_info.user.js
// @updateURL https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/nd_article_info.user.js
// @version 2.23
// @grant none
// ==/UserScript==

(function () {
    'use strict';
    var ndirmFunctions = window.ndirmFunctions = {};
    var ndirmVersion = "2.23";

    /*
     * article navigation
     */
    ndirmFunctions.gotoArticle = function () {
        var articleId        = document.getElementById("ndirm-goto-id").value;
        window.location.href = window.location.origin + "/content/" + articleId;
    };

    /*
     * env navigation
     */
    ndirmFunctions.gotoEnvironment = function (envName) {
        var envDomain = 'https://www.netdoktor.de';
        if(envName == 'stage') envDomain = 'https://stage.netdoktor.de';
        else if(envName == 'test') {
            var domainPort = document.getElementById("ndirm-testenv-port").value;
            if(/^[0-9]+$/.exec(domainPort) !== null) {
                setCookie('ndirm-port', domainPort, 90);
                envDomain = 'https://cms.nd-intern:' + domainPort;
            }
        }
        window.location.href = envDomain + window.location.pathname;
    };

    /*
     * show iq test ads
     */
    function getAdTestUrl(env) {
        var queryString = env == 'mobile' ? '?iqadtest=iq_tests_nd,pm_2_1_mob,pm_3_1_mob,pm_4_1_mob,pm_6_1_mob,pm_halfpage_ad_mob,pm_high_impact_ad_mob,pm_premium_rectangle_mob' : '?iqadtest=iq_tests_nd,pm_medrec,pm_halfpage_ad,pm_sky,pm_billboard,pm_billboard_ros,pm_4_1,pm_10_1';

        return location.href.replace(location.search, queryString);
    }

    /*
     * page type
     */
    var pageType = 'n/a';
    var pageId   = 'n/a';
    if (dataLayer[0].page.pageType === 'interred') {
        pageType = 'InterRed';
        try {
            pageId = dataLayer[0].page.articleID;
        } catch (error) {
        }
    } else {
        pageType = 'CMS';
        try {
            pageId = dataLayer[0].page.cmsPageId;
        } catch (error) {
        }
    }

    /*
     * meta info
     */
    var metaInfo = '';
    if (dataLayer[0].page.pageType === 'interred') {
        var articleTopic = 'n/a';
        try {
            var topics = [];
            for (var key in dataLayer[0].page.topic.main) {
                topics.push(dataLayer[0].page.topic.main[key]);
            }
            if (topics.length > 0) {
                articleTopic = '<span class="ndirm-selectall">' + topics.join('</span>&nbsp;/ <span class="ndirm-selectall">') + '</span>';
            }
        } catch (error) {
        }
        var interredType = 'no type';
        try {
            interredType = dataLayer[0].page.articleType.interredType;
        } catch (error) {
        }
        var articleType = 'no type';
        var articleTypeLabel = 'article-type';
        try {
            if(interredType == 'nd_module_wrapper') {
                articleType = dataLayer[0].page.module_type;
                articleTypeLabel = 'module-type';
            } else {
                articleType = dataLayer[0].page.articleType.type;
                if (dataLayer[0].page.articleType.subType !== undefined) {
                    articleType = articleType + '&nbsp;| ' + dataLayer[0].page.articleType.subType;
                }
            }
        } catch (error) {
        }
        // infos
        metaInfo =
            '  <div>' +
            '    <md-divider></md-divider><div class="ndirm-acc-head ndirm-infohead ndirm-link ndirm-icons-down">Meta Info</div>' +
            '    <div class="ndirm-acc-panel-open ndirm-infocontent">' +
            '    <strong>master-id: </strong><span class="ndirm-selectall">' + pageId + '</span><br />' +
            '    <strong>main topic: </strong>' + articleTopic + '<br />' +
            '    <strong>source: </strong>interred<br />' +
            '    <strong>interred-type: </strong>' + interredType + '<br />' +
            '    <strong>' + articleTypeLabel + ': </strong>' + articleType + '<br />' +
            '    </div>' +
            '  </div>';
    } else {
        var pageDate = 'n/a';
        try {
            pageDate = dataLayer[0].page.publishDate;
        } catch (error) {
        }
        metaInfo =
            '  <div>' +
            '    <md-divider></md-divider><div class="ndirm-acc-head ndirm-infohead ndirm-link ndirm-icons-down">Meta Info</div>' +
            '    <div class="ndirm-acc-panel-open ndirm-infocontent">' +
            '    <strong>created: </strong>' + pageDate + '<br />' +
            '    </div>' +
            '  </div>';
    }

    /*
     * sales info
     */
    var csId = 'n/a';
    try {
        csId = dataLayer[0].page.content.csId === undefined ? 'not set' : dataLayer[0].page.content.csId;
    } catch (error) {
    }
    var handle = 'n/a';
    var level2 = 'n/a';
    var level3 = 'n/a';
    var level4 = 'n/a';
    var keywords = 'n/a';
    try {
        handle = ndConfig.iqdigital.$handle === undefined ? 'not set' : ndConfig.iqdigital.$handle;
        level2 = ndConfig.iqdigital.level2 === undefined ? 'not set' : ndConfig.iqdigital.level2;
        level3 = ndConfig.iqdigital.level3 === undefined ? 'not set' : ndConfig.iqdigital.level3;
        level4 = ndConfig.iqdigital.level4 === undefined ? 'not set' : ndConfig.iqdigital.level4;
        keywords = ndConfig.iqdigital.keywords === undefined ? 'not set' : ndConfig.iqdigital.keywords;
    } catch (error) {
    }
    // infos
    var salesInfo =
        '  <div>' +
        '    <md-divider></md-divider><div class="ndirm-acc-head ndirm-infohead ndirm-link ndirm-icons-down">IQ Info</div>' +
        '    <div class="ndirm-acc-panel-open ndirm-infocontent">' +
        '    <strong>cs-id: </strong><span class="ndirm-selectall">' + csId + '</span><br />' +
        '    <strong>$handle: </strong><span class="ndirm-selectall">' + handle + '</span><br />' +
        '    <strong>level2: </strong><span class="ndirm-selectall">' + level2 + '</span><br />' +
        '    <strong>level3: </strong><span class="ndirm-selectall">' + level3 + '</span><br />' +
        '    <strong>level4: </strong><span class="ndirm-selectall">' + level4 + '</span><br />' +
        '    <strong>keywords: </strong><span class="ndirm-selectall">' + keywords + '</span><br />' +
        '    show test ads <a href="' + getAdTestUrl('desktop') + '" style="font-size:14px;">desktop</a> | <a href="' + getAdTestUrl('mobile') + '" style="font-size:14px;">mobile</a><br />' +
        '    </div>' +
        '  </div>';

    /*
     * env switch
     */
    // controls to set env
    var lastPort = getCookie('ndirm-port') === undefined ? '' : getCookie('ndirm-port');
    var codeEnvironmentSelector =
            '  <div>' +
            '    <md-divider></md-divider><div class="ndirm-acc-head ndirm-infohead ndirm-link ndirm-icons-down">Switch Environment</div>' +
            '    <div class="ndirm-acc-panel-open ndirm-infocontent">' +
            '<form id="ndirm-envForm" onsubmit="window.ndirmFunctions.gotoEnvironment(\'test\'); return false;">' +
            '<a onClick="window.ndirmFunctions.gotoEnvironment(\'prod\');" href="javascript:void(0);" style="font-size:14px;">prod</a> | ' +
            '<a onClick="window.ndirmFunctions.gotoEnvironment(\'stage\');" href="javascript:void(0);" style="font-size:14px;">stage</a> | ' +
            '<input id="ndirm-testenv-port" class="ndirm-input" value="' + lastPort + '" placeholder="Port" type="number" style="width:50px;" required/>&nbsp;&nbsp;' +
            '<a href="javascript:void(0);" onClick="window.ndirmFunctions.gotoEnvironment(\'test\'); return false;" class="ndirm-link">nd-intern</a>' +
            '    </form>' +
            '    </div>' +
            '  </div>';

    /*
     * sourcepoint
     */
    // method to set sourcepoint environment to stage or public
    ndirmFunctions.setSourcepointEnv = function (envName) {
        if ((envName === 'stage') || (envName === 'public')) {
            document.getElementById("sourcepointEnvIFrame").src = 'https://ressource1.netdoktor.de/mms/qa_set_env?env=' + envName;
        }
    };
    // controls to set sourcepoint env
    var codeSourcePoint              =
            '  <div>' +
            '    <md-divider></md-divider><div class="ndirm-acc-head ndirm-infohead ndirm-link ndirm-icons-down">SourcePoint</div>' +
            '    <div class="ndirm-acc-panel-open ndirm-infocontent">' +
            '      <iframe id="sourcepointEnvIFrame" height="0" width="0" style="border:0;"></iframe>' +
            '      <strong>set environment: </strong>' +
            '<a onClick="window.ndirmFunctions.setSourcepointEnv(\'stage\');" href="javascript:void(0);" style="font-size:14px;">stage</a> | ' +
            '<a onClick="window.ndirmFunctions.setSourcepointEnv(\'public\');" href="javascript:void(0);" style="font-size:14px;">public</a>' +
            '    </div>' +
            '  </div>';

    /*
     * main object
     */
    var editorialInfoDiv       = document.createElement('div');
    editorialInfoDiv.className = "article-icd";
    editorialInfoDiv.innerHTML = '<div class="ndirm-infobox-collapsed"><div id="ndirm-header" class="ndirm-acc-head ndirm-infotitle ndirm-icons-down"><span class="ndirm-link">' + pageType +
        '</span> (<span class="ndirm-selectall">' + pageId + '</span>)</div>' +
        '<div class="ndirm-acc-panel"><form id="ndirm-articleForm" onsubmit="window.ndirmFunctions.gotoArticle(); return false;">' +
        '<input id="ndirm-goto-id" class="ndirm-input" placeholder="Enter article id" type="number" style="width:100px; margin-left:8px;" required/>&nbsp;&nbsp;' +
        '<a href="javascript:void(0);" onClick="window.ndirmFunctions.gotoArticle();" class="ndirm-link">Go to article</a></form>' +
        metaInfo +
        salesInfo +
        codeEnvironmentSelector +
        codeSourcePoint +
        '<md-divider></md-divider>' +
        '<div class="ndirm-image-box">' +
        '<div class="ndirm-signature">Yours sincerely</div>' +
        '<img class="ndirm-image" src="https://cdn.netdoktor.de/images/internal/ir-monkey.jpg" width="180px" />' +
        '<div class="ndirm-name">Interred Monkey</div>' +
        '</div>' +
        '<div class="ndirm-footer">v ' + ndirmVersion + '</div>' +
        '</div>';

    var pageBodyTags = document.getElementsByTagName('body');
    if ((pageBodyTags !== 'undefined') && (pageBodyTags[0] !== 'undefined')) {
        var pageBody = pageBodyTags[0];
        pageBody.insertBefore(editorialInfoDiv, pageBody.firstChild);
        // style
        var editorialInfoStyle       = document.createElement('style');
        editorialInfoStyle.innerHTML = '.ndirm-selectall { -webkit-user-select: all; -moz-user-select: all; -ms-user-select: all; user-select: all; }' +
            '.ndirm-infobox { z-index:1000000; margin:10px; padding:8px 16px 8px 16px; background-color: #ffffff; background-color: var(--white); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5); position: fixed; top: 0;px left: 0; width: 300px; background: #fff; opacity: 0.9; font-family:Roboto, sans-serif; font-size:14px; line-height:23.8px; text-size-adjust:100%; -webkit-font-smoothing:antialiased; -webkit-tap-highlight-color:rgba(0, 0, 0, 0); }' +
            '.ndirm-infobox-collapsed { z-index:1000000; margin:10px 60px 10px 60px; padding:8px 16px 8px 16px; background-color: #ffffff; background-color: var(--white); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5); position: fixed; top: 0;px left: 0; width: 200px; background: #fff; opacity: 0.9; font-family:Roboto, sans-serif; font-size:14px; line-height:23.8px; text-size-adjust:100%; -webkit-font-smoothing:antialiased; -webkit-tap-highlight-color:rgba(0, 0, 0, 0); }' +
            '.ndirm-infotitle { margin-top:8px; margin-left:0px; margin-bottom:8px; }' +
            '.ndirm-infohead { margin-top:8px; margin-left:0px; margin-bottom:8px; }' +
            '.ndirm-infocontent { margin-top:0px; margin-left:8px; margin-bottom:8px; }' +
            '.ndirm-input { margin-bottom:8px; font-size:14px; }' +
            '.ndirm-acc-panel { display: none; }' +
            '.ndirm-acc-panel-open { display: block; }' +
            '.ndirm-icons-down::after { content:url(/svg/material-icons/00bef7/keyboard_arrow_down.svg); float: right; }' +
            '.ndirm-icons-up::after { content:url(/svg/material-icons/00bef7/keyboard_arrow_up.svg); float: right;}' +
            '.ndirm-signature { font-size:16px; text-align: center; margin: 32px 0px 16px 0px; }' +
            '.ndirm-name { font-size:16px; text-align: center; font-weight: 600; margin: 16px 0px 0px 0px; }' +
            '.ndirm-image-box {  }' +
            '.ndirm-image { width:180px; border-radius:50%; display: block; margin-left: auto; margin-right: auto; }' +
            '.ndirm-footer { font-size: 8px; }' +
            '.ndirm-link { /*font-weight:500;*/ color:#00bef7; font-size: 14px; cursor: pointer; }' +
            '.ndirm-acc-head { cursor: pointer; }' +
            'input.ndirm-input[type=number]::-webkit-inner-spin-button, \n' +
            'input.ndirm-input[type=number]::-webkit-outer-spin-button {\n -webkit-appearance: none; }' +
            'input.ndirm-input[type=number] { -moz-appearance:textfield; }';
        pageBody.insertBefore(editorialInfoStyle, pageBody.firstChild);
    }

    var acc = document.getElementsByClassName("ndirm-acc-head");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].onclick = function () {
            /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
            this.classList.toggle("ndirm-icons-up");
            this.classList.toggle("ndirm-icons-down");
            if (this.id == 'ndirm-header') {
                this.parentElement.classList.toggle("ndirm-infobox");
                this.parentElement.classList.toggle("ndirm-infobox-collapsed");
            }

            /* Toggle between hiding and showing the active panel */
            var panel = this.nextElementSibling;
            panel.classList.toggle("ndirm-acc-panel");
            panel.classList.toggle("ndirm-acc-panel-open");
        };
    }

    /*
    * Utils
    */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

})();
