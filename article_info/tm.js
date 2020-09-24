// ==UserScript==
// @name         Interred Vue Monkey
// @version      0.1
// @author Netdoktor.de GmbH
// @include /^https?://www\.netdoktor\.de/
// @include /^https?://stage\.netdoktor\.de/
// @include /^https?://(.*)-nd\.nerddoktor\.de/
// @include /^https?://(.*\.)?netdoktor\.dev/
// @include /^https?://(.*\.)?netdoktor\.localhost/
// @include /^https?://10.14.6.23:\d+/
// @updateURL    https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/article_info/tm.js
// @downloadURL  https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/article_info/tm.js
// @require      https://vuejs.org/js/vue.min.js
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @ require      https://raw.githubusercontent.com/NetDoktorDE/interred_monkey/master/article_info/app.js
// @run-at       document-body
// @noframes
// ==/UserScript==


(function (window) {
    let appTemplate = `<style>
  .vue-monkey {
    display: none;
    z-index: 1000001;
    border-radius: 25px;
    position: fixed; top: 10px; left: 10px;
    width: 50px;
    font-family:Roboto, sans-serif; font-size:14px; -webkit-font-smoothing:antialiased; -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
  }
  .vue-monkey .hidden {
    display: none;
  }
  .vue-monkey .shown {
    display: block;
  }
  .vue-monkey .closed-layer {
    margin-left: auto; margin-right: auto;
  }
  .vue-monkey .closed-layer .image {
    width: 50px;
    height: 50px;
    border-radius:50%;
    background-size: 50px 50px;
    display: block;
  }
  .vue-monkey .closed-layer .image.standard {
    background-image: url('https://cdn.netdoktor.de/images/internal/ir-monkey.jpg');
  }
  .vue-monkey .closed-layer .image.campaign {
    background-image: url('https://cdn.netdoktor.de/images/internal/ir_monkey_gold.png');
  }
  .vue-monkey .closed-layer .id-label {
    text-align: center;
    margin-top: 4px;
    width: 50px; height: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    display: none;
  }
  .vue-monkey .closed-layer .id-label .id-text {
    font-family:Roboto, sans-serif; font-size:10px; -webkit-font-smoothing:antialiased; -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
  }
  .vue-monkey .open-layer {
    width: 500px;
    height: 500px;
    background-color: rgba(255, 255, 255, 0.8);
    color: rgba(0, 0, 0, 0.8);
    margin-left: auto; margin-right: auto;
  }
  .vue-monkey .info-block {
    padding: 16px 16px 8px 16px;
  }
  .vue-monkey .info-block .title {
    font-weight: 600;
  }
  .vue-monkey .info-block .info-block-detail {
    padding: 8px 4px 0 4px;
  }
  .vue-monkey .info-block .info-block-detail .label {
  }
  .vue-monkey .info-block .info-block-detail .value {
    padding-left: 16px;
  }
</style>
<div id="vue-monkey-app" class="vue-monkey" :style="{ display: mountDisplay }">
  <div class="closed-layer" :class="[isClosed ? 'shown' : 'hidden']">
    <div v-on:click="toggle" class="image" :class="{ standard: !isCampaign, campaign: isCampaign }"></div>
    <div class="id-label" :style="{ display: labelStyle }"><span class="id-text">{{message}}<span></div>
  </div>
  <div class="open-layer" :class="[!isClosed ? 'shown' : 'hidden']" v-on:click="toggle">

    <info-block
      v-for="post in posts"
      v-bind:post="post"
    ></info-block>

  </div>
</div>`;

    let vueMonkeyApp = new Vue({
        data: {
            didMount: false,
            message: "",
            styleButtonBackground: "'https://cdn.netdoktor.de/images/internal/ir-monkey.jpg'",
            isCampaign: false,
            labelStyle: "none",
            isClosed: true,
            mountDisplay: "none",
            posts: [
                { title: 'Meta', info: [
                    { label: 'last update', value: '2020-09-07 08:39:59' },
                    { label: 'master-id', value: '203378' },
                    { label: 'main topic', value: 'krankheiten / bandscheibenvorfall' },
                ] },
                { title: 'BFA', info: [
                    { label: 'last update', value: '2020-09-07 08:39:59' },
                    { label: 'master-id', value: '203378' },
                    { label: 'main topic', value: 'krankheiten / bandscheibenvorfall' },
                ] },
                { title: 'Random', info: [
                    { label: 'last update', value: '2020-09-07 08:39:59' },
                    { label: 'master-id', value: '203378' },
                    { label: 'main topic', value: 'krankheiten / bandscheibenvorfall' },
                ] }
            ],
        },
        mounted: function () {
            console.log("vue monkey mounted")

            // reference dataLayer
            var gtm = google_tag_manager["GTM-K9WTNF"];
            this.dataLayer = gtm.dataLayer;

            // page id
            this.message = contentId(this.dataLayer);

            // cs id
            this.isCampaign = isCampaignDataLayer(this.dataLayer);

            this.labelStyle = "block";
            this.mountDisplay = "block";
        },
        created: function () {
            console.log("vue monkey created");
        },
        methods: {
            toggle: function (event) {
                console.log("toggled");
                this.isClosed = !this.isClosed;
            }
        }
    });

    Vue.component('info-block', {
        props: ['post'],
        template: `<div class="info-block"><span class="title">{{ post.title }}</span><info-block-label v-for="info in post.info" v-bind:info="info"></info-block-label></div>`
    });

    Vue.component('info-block-label', {
        props: ['info'],
        template: `<div class="info-block-detail"><span class="label">{{ info.label }}:</span><span class="value">{{ info.value }}</span></div>`
    });

    function contentId(dataLayer) {
        if(dataLayer.get("page.pageType") == "interred") {
            return dataLayer.get("page.articleID");
        } else if(dataLayer.get("page.pageType") == "cms") {
            return "cms "+dataLayer.get("page.cmsPageId");
        }
        return "no id"
    }

    function isCampaignDataLayer(dataLayer) {
        return (dataLayer.get("page.content.csId") !== undefined) && (dataLayer.get("page.content.csId") != "")
    }

    window.vueMonkey = {
        isReady(successCallBack) {
            jq(document).ready(function(){
                successCallBack();
            });
        },
        appendToBody() {
            jq('body').append(appTemplate);
        },
        // addStyle() {
            // jq('head').append(`<style type="text/css">#github-info-app div,#github-info-app span,#github-info-app p,#github-info-app h1,#github-info-app h2,#github-info-app h3,#github-info-app h4,#github-info-app a,#github-info-app img,#github-info-app b{color:#fff;font-family:HelveticaNeue,Helvetica,Arial,"Microsoft Yahei",sans-serif;font-size:12px;margin:0;padding:0;border:0;box-sizing:border-box;text-align:left}#github-info-app{position:fixed;left:-55px;top:40%;z-index:100}#peppa-img{position:fixed;left:-55px;top:40%;width:95px;transition:all .3s ease-out;-moz-transition:all .3s ease-out;-webkit-transition:all .3s ease-out;-o-transition:all .3s ease-out}#peppa-img:hover{left:-40px;transform:rotate(-10deg);-ms-transform:rotate(-10deg);-moz-transform:rotate(-10deg);-webkit-transform:rotate(-10deg);-o-transform:rotate(-10deg);cursor:pointer}#peppa-img:hover + .pig-say{visibility:visible;width:auto}#peppa-img:hover + .pig-say .pig-email{visibility:hidden}#github-info-app .pig-say{visibility:collapse;width:0}#github-info-app .pig-say:hover{visibility:visible}#github-info-app .pig-info{height:100px;margin-left:123px;margin-top:-35px;background-color:#D40082;border:2px solid #D40082;color:#fff;padding:6px;padding-left:10px;padding-right:10px;width:220px;-moz-border-radius:12px;-webkit-border-radius:12px;border-radius:12px;text-shadow:2px 2px 5px #333;line-height:20px}#github-info-app .pig-info a{text-decoration:none}#github-info-app .pig-info a:hover{text-decoration:underline}#github-info-app .pig-info label{font-size:.5em}#github-info-app .pig-info-arrow{margin-left:110px;margin-top:20px;width:0;height:0;border-top:13px solid transparent;border-right:26px solid #D40082;border-bottom:13px solid transparent}#github-info-app .pig-info .action-header{border-bottom:1px solid rgba(255,255,255,0.6);width:100px}#github-info-app .pig-info h3{margin-top:12px;font-size:14px;font-weight:600}#github-info-app a.action-link{text-decoration:none;font-size:12px}#github-info-app a.action-link:hover{cursor:pointer;text-decoration:underline}#github-info-app .pig-info-more{visibility:collapse}#github-info-app .pig-info:hover .pig-info-more{visibility:visible}#github-info-app .action-footer p,#github-info-app .action-footer a{position:relative;margin-top:5px;margin-bottom:0;font-size:10px;color:rgba(255,255,255,0.8)}#github-info-app .action-footer a{cursor:pointer}#github-info-app .action-footer a:hover{text-decoration:underline}#github-info-app a:hover{cursor:pointer}</style>`);
        // },
        startApp() {
            this.appendToBody();
            setTimeout(() => {
                vueMonkeyApp.$mount('#vue-monkey-app');
            }, 1000);
        }
    };
})(window);

window.jq = $.noConflict(true);

(function () {
    'use strict';
    vueMonkey.isReady(function () {
        vueMonkey.startApp();
    });
})();

