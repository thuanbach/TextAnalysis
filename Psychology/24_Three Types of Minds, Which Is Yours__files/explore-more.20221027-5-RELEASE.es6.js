/*! 20221027-5-RELEASE */

(()=>{const e="tbl-exm-appearance",t="tbl-exm-history",o=80;class i{constructor(e,t){TRC.util.sendSupplyFeature(i.SUPPLY_FEATURE_TYPE,"AVAILABLE"),this.enableIosWebviewFix=TRC.util.isTrue(e.global["enable-ios-back-fix"]),this.timeToStopWaitingForLoad=+e.global["tbl-stop-waiting-loading"]||60,this.stopWaitingForLoad=!1,this.trcManager=e,this.feedIsVisible=!1,this.maxPopupAppearanceNumber=3,this.referrer=this.trcManager.getReferrer(),this.isGoogleTraffic=this.wasReferredFromGoogle(),this.url=window.location.href,this.localStorage=TRC.pageManager.getLocalStorageImplementation("strict-w3c-storage"),this.isDesktop=!TRC.Device.isTouchDevice,TRC.ExploreMorePlacement=t.exm.placement,this.setOptions(t),this.setCSS(),TRC.dispatch("ExploreMoreReady",this),this.googleTrafficActivationFeatureEnabled&&this.isGoogleTraffic?this.googleTrafficInitWrapper():this.iosWebviewHashAndGesture(),TRC.MetricsManager.sendMetricsEvent(TRC,e,{name:"ExploreMore",value:"1",type:"counter"},null)}iosWebviewHashAndGesture(){if(this.enableIosWebviewFix){if(this.navigation=i.initNavigator(),this.hashNeeded=i.isHashNeeded(),i.isGestureNeeded())return this.inspectGesture();if(this.hashNeeded)return this.waitForLoadToEnd()}this.init()}getLocalStorageValue(e){return this.localStorage&&this.localStorage.getValue&&this.localStorage.getValue(e)}setLocalStorageValue(e,t){return this.localStorage&&this.localStorage.setValue&&this.localStorage.setValue(e,t)}static initNavigator(){if(window.performance&&window.performance.getEntriesByType){const e=performance.getEntriesByType("navigation");if(e&&e.length>0)return e[0]}if(window.performance&&window.performance.timing)return window.performance.timing}waitForLoadToEnd(e=!0){let t;if(e&&(t=TRC.Timeout.set(()=>this.stopWaitingForLoad=!0,1e3*this.timeToStopWaitingForLoad)),this.stopWaitingForLoad)return this.init();0===this.navigation.loadEventEnd?TRC.Timeout.set(()=>this.waitForLoadToEnd(!1)):(TRC.Timeout.clear(t),this.init())}inspectGesture(){const e=()=>{this.waitForLoadToEnd(),TRC.dom.off(window,"touchend",e),TRC.dom.off(window,"mousedown",e)};TRC.dom.on(window,"touchend",e),TRC.dom.on(window,"mousedown",e)}static isHashNeeded(){const e=navigator.userAgent.toLowerCase();return e.indexOf("apple")>-1&&e.indexOf("iphone")>-1&&e.indexOf("webkit")>-1&&(navigator.userAgent.indexOf("FBAN")>-1||navigator.userAgent.indexOf("FBAV")>-1)&&-1===e.indexOf("safari")&&-1===e.indexOf("firefox")&&-1===e.indexOf("chrome")&&!location.hash}static isGestureNeeded(){const e=navigator.userAgent.toLowerCase();return 1===history.length&&e.indexOf("apple")>-1&&e.indexOf("macintosh")>-1&&e.indexOf("webkit")>-1&&e.indexOf("chrome")>-1}setOptions(e){const{exm:o,drp:r}=e;let s=null;const{global:a}=this.trcManager;this.titleText=i.getTranslatedTextBySiteLanguage(o.title,"TITLE_TEXT"),this.css=o.css||"",this.popupBackgroundColor=o.popupBackgroundColor||"#0279f5",this.popupTextColor=o.popupTextColor||"#ffffff",this.popupTextMessage=i.getTranslatedTextBySiteLanguage(o.popupText,"POPUP_TEXT"),this.headerSelector=o.headerSelector||"header",this.enableHideHeaderFeature=TRC.util.isEnabledByDefault(a["explore-more-enable-hide-all-but-header"])&&!this.isDesktop,this.enablePositionCorrection=TRC.util.isEnabledByDefault(a["explore-more-enable-position-correction"])&&!this.isDesktop,this.siteHeader=this.enforceMaxHeight(this.headerSelector),this.hideAllButHeader=this.enableHideHeaderFeature&&this.siteHeader,this.shouldNotCopyPublisherHeaderHtml=o.shouldNotCopyPublisherHeaderHtml||!1,this.feedContainer=o.container?document.getElementById(o.container):null,this.feedContainerWidth=`${o.feedContainerWidth||"85"}%`,r&&r["explore-more"]&&(s=__trcUnJSONify(r["explore-more"]));const l=a["enable-explore-more-state-check"],n=a["set-explore-more-state-check-interval-time"];if(o.addStateCheck=l||o.addStateCheck,o.stateCheckIntervalTime=n||o.stateCheckIntervalTime,this.stateCheck={enable:o.addStateCheck||!1,IntervalTime:o.stateCheckIntervalTime||200,intervalId:0},this.enableExploreMoreVideo=s&&s["enable-explore-more-video"]||a["enable-explore-more-video"],this.disableExploreMoreVideoReset=s&&s["disable-explore-more-video-reset"]||a["disable-explore-more-video-reset"],this.disableHistoryCheck=s&&s["disable-explore-more-history-check"]||a["disable-explore-more-history-check"],!this.disableHistoryCheck){if(window.sessionStorage){const e=sessionStorage.getItem(t);this.sessionHistory=e?__trcUnJSONify(e):{}}i.updateReloadState()}this.googleTrafficActivationFeatureEnabled=i.isGoogleTrafficFeatureEnabled(s),this.googleTrafficActivationFeatureEnabled&&this.isGoogleTraffic&&(s=s||{},this.googleModeActivateByClick=TRC.util.isTrue(s.googleModeActivateByClick),this.googleModeActivateByTimer=void 0===s.googleModeActivateByTimer||TRC.util.isTrue(s.googleModeActivateByTimer),this.googleModeActivationTimerLength=1e3*parseInt(s.googleModeActivationTimerLengthInSeconds,10)||1e3*parseInt(a["explore-more-google-timer"],10)||2e4)}static updateReloadState(){const e={count:0};if(history.state)if(void 0===history.state.count){const{state:t}=history;let o={};e.count++,o=TRC.util.merge(o,t,e),history.replaceState(o,"")}else{const{state:e}=history;e.count++,history.replaceState(e,"")}else e.count++,history.replaceState(e,"")}static getTranslatedTextBySiteLanguage(e,t){return e||(TRC.translationManager.getLabel({feature:"explore-more",label:t})||e)}googleTrafficInitWrapper(){this.googleModeActivateByClick&&this.activateClickListener(),this.googleModeActivateByTimer&&this.startTimer()}startTimer(){this.activationTimer=TRC.Timeout.set(this.timeoutHandler.trcBind(this),this.googleModeActivationTimerLength)}activateExploreMoreAndTurnOffListeners(){this.clearGoogleTrafficTriggers(),this.init()}clickHandler(){this.activateExploreMoreAndTurnOffListeners()}timeoutHandler(){this.activateExploreMoreAndTurnOffListeners()}activateClickListener(){this.boundClickHandler=this.clickHandler.trcBind(this),TRC.dom.on(window,"click",this.boundClickHandler)}clearGoogleTrafficTriggers(){this.googleModeActivateByClick&&TRC.dom.off(window,"click",this.boundClickHandler),this.googleModeActivateByTimer&&TRC.Timeout.clear(this.activationTimer)}static isGoogleTrafficFeatureEnabled(e){return null===e||void 0===e.googleTrafficActivationFeatureEnabled||TRC.util.isTrue(e.googleTrafficActivationFeatureEnabled)}wasReferredFromGoogle(){const e=this.getHostname(),t=/^(.+\.|(.+)?\/)?google\./;return null!==e.match(t)}getHostname(){let e=this.referrer.indexOf("//")>-1?this.referrer.split("/")[2]:this.referrer.split("/")[0];return[e]=e.split(":"),[e]=e.split("?"),e}setCSS(){const{headerSelector:e,popupBackgroundColor:t,popupTextColor:o,feedContainerWidth:i}=this,r=this.createStyleToHideAllButHeader();TRC.dom.injectStyle(`#tbl-explore-more-container { display: none; position: relative; margin-top: 0; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; } #tbl-explore-more-container .tbl-explore-more-site-header { z-index: 2147483647; left: 0; right: 0; } #tbl-explore-more-container .tbl-feed-header { display: none; } #tbl-explore-more-container #tbl-explore-more-title { font-weight: bold; font-size: 20px; padding: 10px 8px; color: #222222; } #tbl-explore-more-container .tbl-explore-more-popup { transition: all 0.5s ease; opacity: 0; transform: translateY(-1200px); position: absolute; width: 100%; left: 0; z-index: 999999999; background: ${t}; } #tbl-explore-more-container .tbl-explore-more-popup.tbl-explore-more-popup-show { transform: translateY(2px); opacity: 1; } #tbl-explore-more-container .tbl-explore-more-popup .tbl-explore-more-popup-text { padding: 13px 35px 13px 9px; font-size: 13.5px; color: ${o}; } #tbl-explore-more-container .tbl-explore-more-popup .tbl-explore-more-triangle { display: block; position: absolute; bottom: -11px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 12px solid; color: ${t}; } #tbl-explore-more-container .tbl-explore-more-popup .tbl-explore-more-popup-closeBtn-wrapper { -ms-transform: translateY(-50%); transform: translateY(-50%); position: absolute; top: 50%; right: 11px; width: 11px; z-index: 2; color: ${o}; } #tbl-explore-more-container.tbl-exm-desktop .trc_multi_widget_container { padding-bottom: 22px; } #tbl-explore-more-container.tbl-exm-desktop .tbl-explore-more-popup.tbl-explore-more-popup-show { z-index: 1; } #tbl-explore-more-container.tbl-exm-desktop .tbl-explore-more-popup.tbl-explore-more-popup-show, #tbl-explore-more-container.tbl-exm-desktop #tbl-explore-more-title { width: 100%; } #tbl-explore-more-container.tbl-exm-desktop .tbl-explore-more-popup-show { transform: translateY(0px); opacity: 1; bottom: 10px; text-align: center; top: inherit; } #tbl-explore-more-container.tbl-exm-desktop .tbl-title-and-pop-wrp { position: relative; } #tbl-explore-more-container.tbl-exm-desktop .tbl-title-and-pop-wrp, #tbl-explore-more-container.tbl-exm-desktop .tbl-feed-card, #tbl-explore-more-container.tbl-exm-desktop .tbl-loading-cards-placeholder { width: ${i}; max-width: 1000px; min-width: 800px; margin-right: auto; margin-left: auto; clear: both; }body.tbl-show-explore-more.tbl-explore-more-show-original-header > *:not(#tbl-explore-more-container):not(${e}):not(.trc_popover_aug_container) { display: none; }body.tbl-show-explore-more.tbl-explore-more-hide-original-header > *:not(#tbl-explore-more-container):not([id='_cm-css-reset']):not(.trc_popover_aug_container) { display: none; }body.tbl-show-explore-more.tbl-explore-more-hide-original-header > *:not([id='_cm-css-reset']):not(.trc_popover_aug_container) { display: none; }body.tbl-show-explore-more .tbl-stories-container { display: none; }body.tbl-show-explore-more #tbl-explore-more-container { display: block; } ${this.css} ${r}`,null),this.feedContainer&&TRC.dom.removeClass(this.feedContainer,"tbl-invisible")}shouldAddToHistory(){const{state:e}=history;if(e&&e.tblShouldDisplayFeed&&"number"==typeof e.count&&e.count>0)return!1;const t=this.sessionHistory&&this.sessionHistory[this.url],o=!e||void 0===e.feedViewEventName;return this.disableHistoryCheck||!t&&o}static checkHistoryState(){history.state&&"feed-view-init"===history.state.feedViewEventName&&history.go(-1)}init(){this.feedContainer?(this.shouldAddToHistory()?this.addNewHistoryEntries():i.checkHistoryState(),this.listenToPopState(),this.createAndInjectNewHtml(),this.handleFeedContainerAndPublisherHeaderStyle()):__trcWarn("ExploreMoreModule: TryingToInitializeExploreMoreExperienceButNoFeedFound")}createAndInjectNewHtml(){this.isDesktop&&this.exploreMoreOnDesktop(),this.feedContainer.insertAdjacentHTML("afterbegin",this.createNewElements()),this.addEventsListenersToInjectedElements()}exploreMoreOnDesktop(){TRC.dom.addClass(this.feedContainer,"tbl-exm-desktop")}handleFeedContainerAndPublisherHeaderStyle(){if(this.shouldNotCopyPublisherHeaderHtml)return;const e=this.getSiteHeaderStyle();if(e&&"fixed"!==e.position&&"absolute"!==e.position){const e=getComputedStyle(this.feedContainer).paddingLeft,t=this.feedContainer.querySelector(this.headerSelector);t&&(t.style=`margin-left: -${e}; margin-right: -${e};`)}}createNewElements(){const e=`<div id="tbl-explore-more-title">${this.titleText}</div>`,t=this.shouldDisplayPopupMessage()?this.createPopUpMessageElement():"";let o=`${t} ${e}`;const i=this.shouldCreateHeaderPlaceholder()?this.createHeaderPlaceholderElement():"",r=this.enableHideHeaderFeature?"":this.tryGetPublisherHeaderHtml();return this.isDesktop&&(o=`<div class="tbl-title-and-pop-wrp">${t} ${e}</div>`),`${r} ${i} ${o}`}tryGetPublisherHeaderHtml(){return this.siteHeader&&this.siteHeader.outerHTML?(TRC.dom.addClass(this.siteHeader,i.CSS_CLASSES.SITE_HEADER),this.siteHeader.outerHTML):""}addEventsListenersToInjectedElements(){this.popup=this.feedContainer.querySelector(`.${i.CSS_CLASSES.POPUP}`),this.popup&&TRC.dom.on(this.popup,"click",this.handlePopupCloseBtnClick.trcBind(this))}getSiteHeaderStyle(){return void 0!==this.siteHeaderStyle?this.siteHeaderStyle:this.siteHeaderStyle=this.siteHeader&&getComputedStyle(this.siteHeader)}createHeaderPlaceholderElement(){const e=this.getHeaderAbsoluteHeight(this.siteHeader),t=`width: ${this.getSiteHeaderStyle().width}; height: ${e}`;return`<div class="${i.CSS_CLASSES.HEADER_PLACEHOLDER}" style="${t}"></div>`}shouldCreateHeaderPlaceholder(){return this.siteHeader&&"fixed"===this.getSiteHeaderStyle().position}createPopUpMessageElement(){return`\n              <div class=${i.CSS_CLASSES.POPUP}>\n                  <div class=${i.CSS_CLASSES.POPUP_TEXT}>${this.popupTextMessage}</div>\n                  <div class=${i.CSS_CLASSES.POPUP_TRIANGLE}></div>\n                  <div class=${i.CSS_CLASSES.CLOSE_BTN_WRAPPER}> \n                      ${this.getCloseButtonMarkup()}\n                  </div>\n              </div>\n          `}handlePopupCloseBtnClick(){TRC.dom.removeClass(this.popup,i.CSS_CLASSES.SHOW_POPUP)}getVisibilityCounterDataFromLocalStorage(){return __trcUnJSONify(this.getLocalStorageValue(e))||{visibleCounter:0}}shouldDisplayPopupMessage(){const{publisherId:e,visibleCounter:t}=this.getVisibilityCounterDataFromLocalStorage();return e!==TRC.publisherId||e===TRC.publisherId&&t<3}updatePopupMessageCounterOnLocalStorage(){let{visibleCounter:t}=this.getVisibilityCounterDataFromLocalStorage();t<this.maxPopupAppearanceNumber&&(t=t?++t:1,this.setLocalStorageValue(e,JSON.stringify({publisherId:TRC.publisherId,visibleCounter:t})))}shouldDisplayFeed(){return history.state&&history.state.tblShouldDisplayFeed&&!this.feedIsVisible}shouldHideFeed(){return history.state&&history.state.tblOriginalState&&this.feedIsVisible}setHistoryModified(e){window.sessionStorage&&(this.sessionHistory[this.url]=e,sessionStorage.setItem(t,JSON.stringify(this.sessionHistory)))}markOriginalState(){const e={tblOriginalState:!0};this.originalPublisherHistoryState?this.originalPublisherHistoryState.tblOriginalState=!0:this.originalPublisherHistoryState=e}addNewHistoryEntries(){this.hashNeeded&&this.enableIosWebviewFix&&(location.hash=i.generateUniqueId());const{DISPLAY_FEED_PAGE:e}=i.HISTORY_STATE;this.originalPublisherHistoryState=history.state,i.isFacebookAndroid()?history.pushState(e,""):history.replaceState(e,""),this.markOriginalState(),history.pushState(this.originalPublisherHistoryState,""),this.setHistoryModified(!0),TRC.util.sendSupplyFeature(i.SUPPLY_FEATURE_TYPE,"CLICKABLE","back button enabled, history changed.",`tblOriginalState: ${history.state.tblOriginalState}`)}static generateUniqueId(){return Date.now().toString(36)+Math.random().toString(36).substring(2)}listenToPopState(){TRC.dom.on(window,"popstate",this.handlePopstateEvent.trcBind(this)),i.isPageLoading()&&this.stateCheck.enable&&this.startStateIntervalCheck(this.handlePopstateEvent.trcBind(this))}handleBeforeUnload(){this.duration=`${((new Date).getTime()-this.duration)/1e3} sec`,TRC.util.sendSupplyFeature(i.SUPPLY_FEATURE_TYPE,"INTERACTION","explore more page view duration.",`explore more duration time is ${this.duration}`),this.setHistoryModified(!1)}static isPageLoading(){return"complete"!==document.readyState}static isFacebookAndroid(e){const t=e||navigator.userAgent||navigator.vendor||window.opera;return(t.indexOf("FBAN")>-1||t.indexOf("FBAV")>-1)&&t.indexOf("Android")>-1}startStateIntervalCheck(e){this.stateCheck.intervalId=TRC.Interval.set(()=>{i.isPageLoading()||(this.stateCheck.enable=!1,TRC.Interval.clear(this.stateCheck.intervalId)),history.state&&history.state.tblShouldDisplayFeed&&this.stateCheck.enable&&(e(),TRC.Interval.clear(this.stateCheck.intervalId))},this.stateCheck.IntervalTime)}handlePopstateEvent(){this.stateCheck.enable=!1,this.shouldDisplayFeed()?(this.displayFeed(),TRC.dom.on(window,"beforeunload",this.handleBeforeUnload.trcBind(this))):this.shouldHideFeed()&&this.hideFeed(),TRC.util.sendSupplyFeature(i.SUPPLY_FEATURE_TYPE,"CLICKED","back/forward button clicked.")}getExploreMoreClassBody(){const e=this.hideAllButHeader?i.CSS_CLASSES.SHOW_ORIGINAL_HEADER_HIDE_ALL:i.CSS_CLASSES.HIDE_ORIGINAL_HEADER;return`${i.CSS_CLASSES.SHOW} ${e}`}addExploreMoreClassToBody(){TRC.dom.addClass(document.body,this.getExploreMoreClassBody())}removeExploreMoreClassFromBody(){const e=this.getExploreMoreClassBody().split(" ");e.forEach(e=>TRC.dom.removeClass(document.body,e))}static initScrollTop(){TRC.Timeout.set(()=>{const{scrollBehavior:e}=getComputedStyle(document.body);document.body.style.scrollBehavior="auto",document.body.scrollTop=document.documentElement.scrollTop=0,document.body.style.scrollBehavior=e},0)}hideFeed(){this.removeExploreMoreClassFromBody(),i.initScrollTop(),this.feedIsVisible=!1}displayFeed(){if(this.feedContainer){if(TRC.dispatch("ExploreMoreLoaded",this),this.disableExploreMoreVideoReset||TRC.dispatch("videoReset"),this.enableExploreMoreVideo){const e={eventName:"exploreMore",containerSelector:`#${this.feedContainer.id}`,placement:TRC.ExploreMorePlacement};TRC.dispatch("feedContainerChanged",e)}this.addExploreMoreClassToBody(),i.initScrollTop(),i.hideDfpIfExist(),this.enablePositionCorrection&&this.initPositionCorrection(),this.handlePopupMessage(),this.feedIsVisible=!0,TRC.util.sendSupplyFeature(i.SUPPLY_FEATURE_TYPE,"VISIBLE","explore more is visible now."),this.duration=(new Date).getTime()}else this.trcManager.sendAbTestEvent("noFeedToShow","noFeedToShow")}handlePopupMessage(){this.popup&&TRC.Timeout.set(()=>{TRC.dom.addClass(this.popup,i.CSS_CLASSES.SHOW_POPUP),this.updatePopupMessageCounterOnLocalStorage()},200)}getCloseButtonMarkup(){return`<div class="${i.CSS_CLASSES.CLOSE_BTN}">\n                      <svg width="11" height="11" viewBox="0 0 11 11">\n                          <path fill=${this.popupTextColor}  fill-rule="evenodd" d="M10.34.038L5.5 4.878.66.038.038.66l4.84 4.84-4.84 4.84.622.622 4.84-4.84 4.84 4.84.622-.622-4.84-4.84 4.84-4.84z"></path>\n                      </svg>\n                  </div>`}static shouldSkipPlacement(e,t,o){return e.fpl&&t.trc.f[e.fpl]&&t.trc.f[e.fpl].exm&&!o.feeds[e.fpl]}static shouldSkipPushedRequest(e){return TRC.ExploreMorePlacement=TRC.ExploreMorePlacement||"Explore More",TRC.ExploreMore.exploreMoreIsVisible()&&!e[TRC.ExploreMorePlacement]}static exploreMoreIsVisible(){return document.body.className.indexOf(i.CSS_CLASSES.SHOW)>-1}static hideDfpIfExist(){const e=document.querySelector(".adsbygoogle-noablate[data-anchor-status]");e&&(e.style.display="none",i.resetBodyPaddingAndMargin())}static resetBodyPaddingAndMargin(){const e=window.getComputedStyle(document.body);"0px"!==e.paddingTop&&(document.body.style.paddingTop="0px"),"0px"!==e.marginTop&&(document.body.style.marginTop="0px")}enforceMaxHeight(e){if(!e)return null;const t=document.querySelector(e);if(!t)return null;const i=this.getHeaderAbsoluteHeight(t);return this.enableHideHeaderFeature&&i>o?null:(this.trcManager.sendAbTestEvent("explore-more","header found"),t)}createStyleToHideAllButHeader(){if(!this.hideAllButHeader)return"";const e="tbl-explore-more-container",t="tbl-feed-view-container",o="trc_popover_aug_container",r=`:not(#${e}):not(#${t}):not([id='_cm-css-reset']):not(.${o})`,{SHOW:s,SHOW_ORIGINAL_HEADER_HIDE_ALL:a}=i.CSS_CLASSES;return i.createStyleToHideAllButOneElement({el:this.siteHeader,extraBodyClass:`.${s}.${a}`,excludeAlso:r})}static createStyleToHideAllButOneElement({el:e,extraBodyClass:t,excludeAlso:o}){let r=null,s="";const a=`body${t}`,l=e=>{if("body"===e.localName)return s+=`${a} > *${o}:not(${r}){display: none}`;const t=i.getElementSelector(e);return t?(r&&(s+=`${a} ${t} > *:not(${r}){display: none} `),r=t,l(e.parentElement)):null};return l(e)}static getElementSelector(e){return e.id?`#${e.id}`:e.classList[0]?`.${e.classList[0]}`:null}getHeaderAbsoluteHeight(e){if(e){const t=this.siteHeader?this.getSiteHeaderStyle():window.getComputedStyle(e),o=parseFloat(t.marginTop)+parseFloat(t.marginBottom),i=parseFloat(t.height),r=Math.ceil(i+o);return 0===r?this.getHeaderAbsoluteHeight(e.firstElementChild):r}return o+1}initPositionCorrection(){TRC.Timeout.set(()=>{this.checkIfHeaderIsHidingFeedAndFix(),this.addNegativeMarginIfFeedPushedDown()},0)}checkIfHeaderIsHidingFeedAndFix(){if(this.siteHeader){const e=this.getHeaderAbsoluteHeight(this.siteHeader,!0),t=i.checkElementDistanceFromTop(this.siteHeader),o=e+t,r=i.checkElementDistanceFromTop(this.feedContainer);if(o!==r){const e=o-r;this.feedContainer.style.marginTop=`${e}px`,this.feedContainer.style.zIndex=99999999999}}}addNegativeMarginIfFeedPushedDown(){if(!this.siteHeader){const e=i.checkElementDistanceFromTop(this.feedContainer);e>0&&(this.feedContainer.style.marginTop=`-${e}px`)}}static checkElementDistanceFromTop(e){try{return e="string"==typeof e?document.querySelector(e):e,window.pageYOffset+e.getBoundingClientRect().top}catch(e){__trcWarn("checkElementDistanceFromTop: element did not found")}}}i.SUPPLY_FEATURE_TYPE="EXPLORE_MORE",i.CSS_CLASSES={SHOW:"tbl-show-explore-more",SHOW_POPUP:"tbl-explore-more-popup-show",POPUP:"tbl-explore-more-popup",POPUP_TEXT:"tbl-explore-more-popup-text",POPUP_TRIANGLE:"tbl-explore-more-triangle",HEADER_PLACEHOLDER:"tbl-explore-more-fixed-header-placeholder",CLOSE_BTN:"tbl-explore-more-popup-closeBtn",CLOSE_BTN_WRAPPER:"tbl-explore-more-popup-closeBtn-wrapper",SHOW_ORIGINAL_HEADER:"tbl-explore-more-show-original-header",HIDE_ORIGINAL_HEADER:"tbl-explore-more-hide-original-header",SITE_HEADER:"tbl-explore-more-site-header",SHOW_ORIGINAL_HEADER_HIDE_ALL:"tbl-explore-more-show-original-header-hide-all"},i.HISTORY_STATE={ORIGINAL_PAGE:{tblPreExploreMoreExperience:!0},DISPLAY_FEED_PAGE:{tblShouldDisplayFeed:!0}},i.MESSAGES={TITLE_TEXT:"Keep on reading",POPUP_TEXT:"More stories to check out before you go"},TRC._translationQueue=TRC._translationQueue||[],TRC._translationQueue.push({"explore-more":i.MESSAGES}),TRC.ExploreMore=i})();