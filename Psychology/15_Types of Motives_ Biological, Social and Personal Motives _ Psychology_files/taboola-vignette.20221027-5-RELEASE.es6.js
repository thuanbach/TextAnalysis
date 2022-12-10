/*! 20221027-5-RELEASE */

(()=>{const t={openBtn:"Learn More",closeBtn:"Close",sponsored:"Sponsored"};TRC._translationQueue=TRC._translationQueue||[],TRC._translationQueue.push({vignette:t});const{TaboolaUnit:e}=TRC;class n extends e{constructor(t){super(t.config.placementName);try{const{_CONSTANTS:e,config:n}=t;if(this.vignetteEl=this.productContainer,!this.vignetteEl)return;if(this.vignetteItem=this.getVignetteItem(),!this.vignetteItem)return;this.trcManager=t.trcManager,this.placementData=t.placementData,this.constants=e,this.vignetteManager=t,this.options=this.getOptions(n),this.SessionHandler=this.getSessionHandler(),this.hasOpportunity=this.shouldShowVignette(),this.vignetteParent=this.vignetteEl.parentElement,this.firstShowOfVignette=!0,this.linkCount=0,this.reportData={includedUrls:[],excludedUrls:[],linksCount:0,anchors:[]},this.xButtonShow=this.getClientProperty("vignette-xButtonShow"),this.init()}catch(e){t.onError("constructor",e.message)}}static getDynamicConfig(t){return e.getAllDynamicConfig(t,"dynamicConfigOverride")}getClientProperty(t){const e=this.placementData&&this.placementData.m,n=e&&this.trcManager.getProperty(e,t);return n}setCssProperties(){const{CSS_PROPERTIES:t}=this.constants;let e="";t.forEach(t=>{const n=this.getClientProperty(t);n&&(e+=`--${t}: ${n};`)}),e&&n.setMultipleCssVariables(e)}setXBtnPosition(){const t=this.getClientProperty("vignette-xButtonPosition"),e="left"===t,i=e?"--vignette-xButtonLeft: 0":"--vignette-xButtonRight:0";n.setMultipleCssVariables(i)}getOptions(t){const e=n.getDynamicConfig(t),{placementName:i,basePath:o,internalLinksOnly:s,excludeBySelector:r,excludeUrls:a,frequencyCapping:l,blockClickTime:c,mixpanelSample:g,actionButtons:h,blockClicks:d,scInNewTab:b,closeVignetteAfterRedirect:p,showDespiteStorageIssue:u}=e;return{placementName:i,basePath:o||"body a",internalLinksOnly:n.isEnabledByDefault(s),excludeBySelector:TRC.util.isDefined(r)?r:this.constants.DEFAULT_EXCLUDE_BY_SELECTORS,excludeUrls:a||[],frequencyCapping:TRC.util.getPositiveNumber(l,1),blockClickTime:TRC.util.getPositiveNumber(c,1e3),mixpanelSample:TRC.util.getPositiveNumber(g,.01),actionButtons:n.handleActionButtonConfig(h),blockClicks:TRC.util.isEnabledByDefault(d),scInNewTab:TRC.util.isTrue(b),closeVignetteAfterRedirect:TRC.util.isTrue(p),showDespiteStorageIssue:n.isEnabledByDefault(u)}}getSessionHandler(){const{MODULE_NAME:t}=this.constants,{showDespiteStorageIssue:e,frequencyCapping:n}=this.options,{EVENTS:i}=this.constants,o=TRC.pageManager.sessionStorageIsSupported();return o||this.vignetteManager.sendEvent(i.SESSION_STORAGE_UNSUPPORTED),{pm:TRC.pageManager,get(){if(!o)return e?0:n+1;const i=this.pm.sessionStorageGetValue(t);return i?parseInt(i,10):0},set(){const e=this.get();this.pm.sessionStorageSetValue(t,e+1)},remove(){this.pm.sessionStorageRemoveKey(t)}}}static handleActionButtonConfig(t){t||(t={open:{},close:{}});const{open:{openBtnColor:e="#000000",openBtnColorText:i="#fff",openBtnText:o=n.getTextByLang("openBtn")},close:{closeBtnColor:s="rgba(255,255,255,0)",closeBtnColorText:r="#6B6666",closeBtnText:a=n.getTextByLang("closeBtn")}}=t;return{open:{btnColor:e,btnTextColor:i,btnText:o},close:{btnColor:s,btnTextColor:r,btnText:a}}}shouldShowVignette(){this.displayInSession=this.SessionHandler.get();const t=this.displayInSession<this.options.frequencyCapping;if(this.isGoogleVignetteRendered||(this.isGoogleVignetteRendered=this.isGoogleVignetteLoaded()),!t||this.isGoogleVignetteRendered){const t=this.isGoogleVignetteRendered?"google vignette":"already have been displayed on session";this.missedReasonData={missedReason:t,displayInSession:this.displayInSession}}return t&&!this.isGoogleVignetteRendered||!!this.vignetteManager.forceDebugMode}isGoogleVignetteLoaded(){const t=document.querySelector('[data-vignette-loaded="true"]');return!!t&&(this.vignetteManager.forceDebugMode&&console.log(`%c TABOOLA VIGNETTE DEBUG MODE!! SKIP VIGNETTE (google vignette)`,"color: white; font-style: italic; background-color: red;padding: 2px"),!0)}init(){try{const{MODULE_NAME:t,SELECTORS:e,EVENTS:i}=this.constants;TRC.historyApi.currentState()===t&&TRC.historyApi.back(),this.handlingBfCache(),this.rboxContainer=this.vignetteEl.querySelector(`.${e.RBOX_CONTAINER}`),TRC.dom.addClass(this.vignetteEl,e.CONTAINER),this.handleAllAnchors(),this.hasOpportunity&&(TRC.dom.addClass(this.vignetteEl,e.OPPORTUNITY_VIGNETTE),this.handleBackground()),this.vignetteManager.forceDebugMode&&this.handleDebugMode(),n.injectStyle(),this.setCssProperties(),this.setXBtnPosition(),this.vignetteManager.sendEvent(i.SCRIPT_LOADED,{timeFromLoad:n.getTimeFromLoad(),links:this.linkCount})}catch(t){this.vignetteManager.onError("init",t.message,t.stack)}}handleAllAnchors(){const t=this.getAnchorsSelectors(),e=document.querySelectorAll(t);TRC.util.toArray(e).forEach(t=>this.handleAnchor(t))}getAnchorsSelectors(){const{basePath:t,excludeBySelector:e}=this.options,n=e.map(t=>`:not(${t})`).join("");return[t,n].join("")}handleAnchor(t){const{SELECTORS:e}=this.constants,i=t.getAttribute("href");this.shouldExcludeLink(i,t.host)?this.vignetteManager.forceDebugMode&&this.reportData.excludedUrls.push(i):(Object.keys(e.TABOOLA_LINKS).forEach(n=>{TRC.dom.containsClass(t,e.TABOOLA_LINKS[n])&&(t.taboolaAnchor=!0)}),this.vignetteManager.forceDebugMode&&(n.highlightVignetteAnchor(t),this.updateReportData(t)),this.linkCount++,TRC.dom.on(t,"click",t=>this.handleAnchorClick(t)))}shouldExcludeLink(t,e){const{excludeUrls:n,internalLinksOnly:i}=this.options;let o=!t||"#"===t[0]||n.indexOf(t)>-1;return i&&!o&&(o=e!==window.location.host),o}static injectStyle(){TRC.dom.injectStyle(`:root { --vignette-closeButtonBackgroundColor: #ffffff00; --vignette-closeButtonFontColor: #6B6666; --vignette-closeButtonFontFamily: Arial; --vignette-closeButtonHoverColor: rgba(234, 234, 234, 0.07); --vignette-openButtonBackgroundColor: #000000; --vignette-openButtonFontColor: #fff; --vignette-openButtonFontFamily: Arial; --vignette-openButtonHoverColor: #313131; --vignette-backgroundOpacity: 0.8; --vignette-backgroundColor: #fff; --vignette-buttonsTopSpacing: none; }body.tbl-vignette-show { overflow: auto !important; }.tbl-vignette { /*simple solution for forcing the image to be rendered */ display: block; visibility: hidden; height: 100% !important; width: 100% !important; top: auto !important; left: auto !important; right: -1200% !important; bottom: auto !important; clear: none !important; float: none !important; margin: 0 !important; max-height: none !important; max-width: none !important; opacity: 1 !important; overflow: visible !important; padding: 0 !important; position: fixed !important; vertical-align: baseline !important; z-index: 2147483647 !important; background: rgba(52, 58, 65, 0.6); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); font-family: Arial, Helvetica, sans-serif; } .tbl-vignette.trc_related_container .trc_header_ext .attribution-disclosure-link-sponsored a { font-size: 15px; font-weight: normal; color: #6B6666; } .tbl-vignette.tbl-vignette-show { right: 0 !important; top: 0 !important; visibility: visible; } .tbl-vignette * { visibility: inherit !important; } .tbl-vignette.tbl-vignette-opportunity { display: -webkit-box !important; display: -webkit-flex !important; display: -ms-flexbox !important; display: flex !important; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; } .tbl-vignette .tbl-vignette-background { position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%; width: 100%; background-color: #fff; opacity: 0.8; background-color: var(--vignette-backgroundColor); opacity: var(--vignette-backgroundOpacity); } .tbl-vignette .tbl-vignette-background.tbl-vignette-background-image { -webkit-filter: blur(10px); -moz-filter: blur(10px); -ms-filter: blur(10px); -o-filter: blur(10px); filter: blur(10px); } .tbl-vignette .tbl-vignette-close-btn-wrp { -webkit-box-sizing: initial; -moz-box-sizing: initial; -ms-box-sizing: initial; -o-box-sizing: initial; box-sizing: initial; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; position: absolute; z-index: 1; width: auto; top: 0; height: 15px; background: #000; right: 0; height: var(--vignette-xButtonSize, 15px); padding: 15px 10px; background: var(--vignette-xButtonBackgroundColor, #000000); left: var(--vignette-xButtonLeft); right: var(--vignette-xButtonRight); } .tbl-vignette .tbl-vignette-close-btn-wrp:focus { outline: none; } .tbl-vignette .tbl-vignette-close-btn-wrp.tbl-vignette-loader-wrp svg { width: var(--vignette-xButtonSize, 15px)10px; height: var(--vignette-xButtonSize, 15px)10px; margin: 0; } .tbl-vignette .tbl-vignette-close-btn-wrp a { color: #fff; font-weight: 400; font-size: 14px; padding: 0 10px; } .tbl-vignette .tbl-vignette-close-btn-wrp a:hover { color: #fff; text-decoration: none; } .tbl-vignette .tbl-vignette-close-btn-wrp svg { width: inherit; height: inherit; vertical-align: initial; margin: 10px; } .tbl-vignette .tbl-vignette-close-btn-wrp #tbl-vignette-close-btn path { stroke: var(--vignette-xButtonColor, #ffffff); } @media (min-width: 1280px) { .tbl-vignette .tbl-vignette-close-btn-wrp #tbl-vignette-close-btn:hover { cursor: pointer; } } .tbl-vignette .trc_rbox_container { height: 100%; width: 100%; display: -webkit-box !important; display: -webkit-flex !important; display: -ms-flexbox !important; display: flex !important; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; -webkit-box-align: baseline; -webkit-align-items: baseline; -ms-flex-align: baseline; align-items: baseline; } .tbl-vignette .trc_rbox_container .trc_rbox_outer { margin: 0; } .tbl-vignette .trc_rbox_container .trc_rbox_header .trc_header_ext .attribution-disclosure-link-sponsored { margin-bottom: 5px; } .tbl-vignette .trc_rbox_container .videoCube { margin: 0 auto; width: 100%; /* todo: the brand team should find a solution to disable cta on specific mode for now we will hide it */ } .tbl-vignette .trc_rbox_container .videoCube .video-label-box-cta { height: unset !important; } .tbl-vignette .trc_rbox_container .videoCube .video-cta-href { display: none; } .tbl-vignette .trc_rbox_container .videoCube .trc-widget-footer { display: flex; margin-bottom: 5px; } .tbl-vignette .trc_rbox_container .videoCube .tbl-vignette-attribution { font-size: 15px; color: #6B6666; display: inline-block; margin-bottom: 5px; width: 100%; } .tbl-vignette .trc_rbox_container .videoCube .tbl-vignette-attribution:hover { cursor: default; text-decoration: none; } .tbl-vignette .trc_rbox_container .trc_rbox { padding: 20px; position: relative; margin-top: 7vh; } .tbl-vignette .trc_rbox_container .trc_rbox_div { max-width: 70vh; } .tbl-vignette .tbl-vignette-btns-wrp { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-pack: justify; -webkit-justify-content: space-between; -ms-flex-pack: justify; justify-content: space-between; margin-bottom: 20px; margin-top: var(--vignette-buttonsTopSpacing); } @media (min-width: 1280px) { .tbl-vignette .tbl-vignette-btns-wrp { -webkit-box-pack: justify; -webkit-justify-content: flex-end; -ms-flex-pack: justify; justify-content: flex-end; } } .tbl-vignette .tbl-vignette-btns-wrp .tbl-vignette-btn { -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; -ms-box-sizing: border-box; -o-box-sizing: border-box; box-sizing: border-box; -webkit-border-radius: 7px; -moz-border-radius: 7px; -ms-border-radius: 7px; -o-border-radius: 7px; border-radius: 7px; -webkit-box-shadow: 0 2px 4px rgba(134, 140, 150, 0.65); -moz-box-shadow: 0 2px 4px rgba(134, 140, 150, 0.65); -ms-box-shadow: 0 2px 4px rgba(134, 140, 150, 0.65); -o-box-shadow: 0 2px 4px rgba(134, 140, 150, 0.65); box-shadow: 0 2px 4px rgba(134, 140, 150, 0.65); font-size: 15px; font-weight: 400; text-align: center; padding: 2vh 4vw; border: none; cursor: pointer; width: 45%; display: flex; } @media (min-width: 1280px) { .tbl-vignette .tbl-vignette-btns-wrp .tbl-vignette-btn { padding: 1.3vh 2vw; margin-inline-start: 20px; width: unset; } } .tbl-vignette .tbl-vignette-btns-wrp .tbl-vignette-btn[disabled] { opacity: 0.5; cursor: not-allowed; } .tbl-vignette .tbl-vignette-btns-wrp .tbl-vignette-btn.tbl-vignette-btn-open { background-color: #000000; color: #fff; background-color: var(--vignette-openButtonBackgroundColor); color: var(--vignette-openButtonFontColor); font-family: var(--vignette-openButtonFontFamily); } .tbl-vignette .tbl-vignette-btns-wrp .tbl-vignette-btn.tbl-vignette-btn-close { background-color: rgba(255, 255, 255, 0); color: #6B6666; background-color: var(--vignette-closeButtonBackgroundColor); color: var(--vignette-closeButtonFontColor); font-family: var(--vignette-closeButtonFontFamily); } @media (min-width: 1280px) { .tbl-vignette .tbl-vignette-btns-wrp .tbl-vignette-btn.tbl-vignette-btn-open:hover { background: var(--vignette-openButtonHoverColor); } .tbl-vignette .tbl-vignette-btns-wrp .tbl-vignette-btn.tbl-vignette-btn-close:hover { background: var(--vignette-closeButtonHoverColor); } } @media (min-width: 1280px) { .tbl-vignette .tbl-vignette-btns-wrp .tbl-vignette-btn:hover { -webkit-box-shadow: 0 1px 2px rgba(134, 140, 150, 0.65); -moz-box-shadow: 0 1px 2px rgba(134, 140, 150, 0.65); -ms-box-shadow: 0 1px 2px rgba(134, 140, 150, 0.65); -o-box-shadow: 0 1px 2px rgba(134, 140, 150, 0.65); box-shadow: 0 1px 2px rgba(134, 140, 150, 0.65); } }`)}static getTimeFromLoad(){try{const{responseEnd:t}=window.performance.timing,e=Date.now();return e-t}catch(t){return"time from load not supported"}}getOrganicClickData(){try{const{placement:t,mode:e}=this.currentTarget.parentElement.video_data;return{placement:t,mode:e}}catch(t){this.vignetteManager.onError(`GetOrganicClickData`,t.message,null,__trcWarn)}}isTaboolaAnchor(){return!!this.currentTarget.taboolaAnchor}handleAnchorClick(t){const{displayInSession:e,constants:n}=this,{EVENTS:i}=n;let o;this.currentTarget=t.currentTarget,this.hasOpportunity=this.shouldShowVignette(!0),this.isTaboolaAnchor()&&(o=this.getOrganicClickData()),this.vignetteManager.sendEvent(i.LINK_CLICKED,{displayInSession:e,showVignette:this.hasOpportunity,organicClickData:o}),this.hasOpportunity?this.showVignette(t):this.skipVignette()}showVignette(t){t.stopPropagation(),t.preventDefault(),this.SessionHandler.set();const{EVENTS:e}=this.constants;this.handleHistory(),this.firstShowOfVignette&&this.handleVignetteOnFirstShow(),this.toggleClasses("addClass"),this.blockUnintentionalClicks(),this.vignetteManager.sendEvent(e.CONTAINER_VISIBLE),TRC.MetricsManager.sendMetricsEvent(TRC,this.trcManager,{name:"VignetteShown",value:"1",type:"counter"},null)}skipVignette(){const{EVENTS:t}=this.constants;this.vignetteManager.sendEvent(t.MISSED,this.missedReasonData)}handleHistory(){const{MODULE_NAME:t}=this.constants;TRC.historyApi.pushState(t),TRC.historyApi.onPopState(()=>this.closeVignette("browser back"),{stateCheck:e=>e[t]})}handleVignetteOnFirstShow(){const{vignetteItem:t,vignetteEl:e}=this,n=this.options.scInNewTab?"_blank":"_self";this.firstShowOfVignette=!1,t&&t.video_data&&(this.xButtonShow&&this.handleXBtn(),this.handleCloseBgClick(),this.handleActionBtns(),this.handleVignetteElement(e,n),this.trcManager&&this.trcManager.global&&!TRC.util.isTrue(this.trcManager.global["remove-old-vignette-disclosure"])?this.handleAttribution():this.removeRBoxClickHandlerFromDisclosureLink())}removeRBoxClickHandlerFromDisclosureLink(){TRCImpl.sendAbTestEvent("new-global-disclosure",{url:location.href});const{SELECTORS:t}=this.constants,e=this.rboxContainer.querySelectorAll(t.DESKTOP_DISCLOSURE);TRC.util.toArray(e).forEach(t=>t.onclick=null)}handleVignetteElement(t,e){n.setTarget(t,e),TRC.dom.on(t,"click",()=>{TRC.Timeout.set(()=>{this.handleCloseVignetteAfterNewTab()})})}getVignetteItem(){try{return this.vignetteEl.getElementsByClassName("videoCube")[0]}catch(t){this.vignetteManager.onError(`getVignetteItem`,t.message,null,__trcWarn)}}handleXBtn(){const{SELECTORS:t}=this.constants,e=this.currentTarget.href;this.closeBtnContainer=TRC.dom.createHTMLElement("div",{className:t.CLOSE_BUTTON.WRAPPER}),this.closeBtnContainer.insertAdjacentHTML("afterbegin",this.getXBtnLayout()),TRC.dom.on(this.closeBtnContainer,"click",()=>this.redirectToNextPage(e,"close btn")),this.vignetteEl.insertAdjacentElement("afterbegin",this.closeBtnContainer)}handleAttribution(){const t=TRC.implClasses.TRCRBox.prototype.getPopupUrl.bind(this.vignetteItem.rbox),e=n.getTextByLang("sponsored"),i=TRC.dom.createHTMLElement("a",{className:`${this.constants.SELECTORS.ATTRIBUTION}`,innerText:e,target:"_blank",href:`https://${t()}`});this.vignetteItem.insertAdjacentElement("afterbegin",i)}getXBtnLayout(){const{SELECTORS:t}=this.constants,e=15;return`<svg id="${t.CLOSE_BUTTON.SVG}" width="${e}" height="${e}" viewBox="0 0 ${e} ${e}" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M0 0 0 0L${e} ${e}" stroke="#ffffff" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>\n            <path d="M${e} 0 ${e} 0L0 ${e}" stroke="#ffffff" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>`}handleBackground(){const{vignetteItem:t,vignetteEl:e}=this,{thumbnail:n}=t.video_data;n&&e.insertAdjacentHTML("afterbegin",this.getBackgroundLayout(n))}getBackgroundLayout(t){const{SELECTORS:e}=this.constants;return`\n            <div class="${e.BACKGROUND.CONTAINER}">\n                <img class="${e.BACKGROUND.IMG} ${e.BACKGROUND.BASE}" src="${t}" alt="backgroung image">\n                <div class="${e.BACKGROUND.SCREEN} ${e.BACKGROUND.BASE}"></div>\n            </div>`}handleCloseBgClick(){const{SELECTORS:t}=this.constants;TRC.dom.on(this.vignetteEl,"click",e=>{if(e.stopPropagation(),"DIV"===e.target.tagName&&n.targetContainsClass(e,["trc_related_container",t.BACKGROUND.BASE,t.ACTION_BUTTON.WRAPPER])){const t=this.currentTarget.href;this.redirectToNextPage(t,"background")}})}static isDisclosureAnchor(t){return TRC.dom.closest(t,".attribution-disclosure-link-sponsored")&&TRC.dom.closest(t,".trc_header_ext")}static setTarget(t,e){const n=t.getElementsByTagName("a");TRC.util.toArray(n).forEach(t=>{this.isDisclosureAnchor(t)?TRCImpl.sendAbTestEvent("new-global-disclosure",{url:location.href}):t.target=e})}handleActionBtns(){const{SELECTORS:t}=this.constants,e=TRC.dom.createHTMLElement("div",{className:t.ACTION_BUTTON.WRAPPER});this.openBtn=this.getActionButton("open"),this.closeBtn=this.getActionButton("close"),e.appendChild(this.openBtn),e.appendChild(this.closeBtn),this.rboxContainer.insertAdjacentElement("beforeend",e)}getActionButton(t){const{vignetteItem:e,currentTarget:i,options:o,constants:s}=this,{btnText:r,btnTextColor:a,btnColor:l}=o.actionButtons[t],{SELECTORS:c}=s,g=this.getClientProperty(`vignette-${t}ButtonText`),h="string"==typeof g&&g||r;let d=i.href,b="_self";"open"===t&&(d=e.video_data.logger_url,this.options.scInNewTab&&(b="_blank"));const p=TRC.dom.createHTMLElement("button",{className:`${c.ACTION_BUTTON.BASE} ${c.ACTION_BUTTON[t.toUpperCase()]}`,innerText:h});return TRC.dom.on(p,"click",()=>this.redirectToNextPage(d,`${t} btn`,b)),n.setCssValue(`${t}BtnColor`,l),n.setCssValue(`${t}BtnColorText`,a),p}static setCssValue(t,e){e&&document.documentElement.style.setProperty(`--${t}`,e)}static setMultipleCssVariables(t){t&&(document.documentElement.style.cssText+=t)}blockUnintentionalClicks(){super.blockUnintentionalClicks(this.options.blockClickTime)}closeVignette(t){const{EVENTS:e}=this.constants;this.vignetteManager.sendEvent(e.CLOSE,{trigger:t}),this.toggleClasses("removeClass")}toggleClasses(t){const{SELECTORS:e}=this.constants;TRC.dom[t](document.body,e.SHOW_VIGNETTE),TRC.dom[t](this.vignetteEl,e.SHOW_VIGNETTE)}static getTextByLang(e){const n=TRC.translationManager.getLabel({feature:"vignette"});return n[e]||t[e]}static targetContainsClass(t,e){return e.some(e=>TRC.dom.containsClass(t.target,e))}handleCloseVignetteAfterNewTab(){if(!this.options.closeVignetteAfterRedirect)return;const{EVENTS:t}=this.constants;this.toggleClasses("removeClass"),n.handleLinkRedirect(this.currentTarget.href,"_self"),this.vignetteManager.sendEvent(t.CLOSE,"open-in-new-tab")}static handleLinkRedirect(t,e){Object.assign(document.createElement("a"),{target:e,href:t}).click()}showPreloader(){const{SELECTORS:t}=this.constants;this.closeBtnContainer.querySelector(`#${t.CLOSE_BUTTON.SVG}`).remove(),TRC.dom.addClass(this.closeBtnContainer,t.LOADER.WRP),this.closeBtnContainer.insertAdjacentHTML("beforeend",this.getLoadingLayout())}blockClicksAfterFirstClick(){const{SELECTORS:t}=this.constants;this.options.blockClicks&&(TRC.dom.addClass(this.vignetteParent,t.BLOCK_CLICKS),this.blockClicks=!0,this.openBtn.disabled=!0,this.closeBtn.disabled=!0)}redirectToNextPage(t=this.currentTarget.href,e,i="_self"){try{const{EVENTS:o}=this.constants;if(this.blockClicks)return;"_self"===i&&(this.showPreloader(),this.blockClicksAfterFirstClick()),this.vignetteManager.sendEvent(o.REDIRECT,{trigger:e}),TRC.Timeout.set(()=>{n.handleLinkRedirect(t,i),this.handleCloseVignetteAfterNewTab()})}catch(t){this.vignetteManager.onError("redirectToNextPage",t.message)}}getLoadingLayout(){const{SELECTORS:t}=this.constants;return`<svg id="${t.LOADER.SVG}" xmlns="http://www.w3.org/2000/svg" style="shape-rendering: auto;" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">\n                        <circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">\n                          <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>\n                        </circle>\n                    <</svg>`}static isEnabledByDefault(t){return!TRC.util.isDefined(t)||TRC.util.isTrue(t)}static isDisabledByDefault(t){return!!TRC.util.isDefined(t)&&TRC.util.isTrue(t)}handlingBfCache(){TRC.dom.on(window,"pageshow",t=>{t.persisted&&this.closeVignette()})}logDataReportToConsole(){const{includedUrls:t,excludedUrls:e,anchors:i}=this.reportData,o={anchors:{links:i,style:"color: white; font-style: italic; background-color: #39579A; padding: 2px"},includedUrls:{links:t,style:"color: white; font-style: italic; background-color: green; padding: 2px"},excludedUrls:{links:e,style:"color: white; font-style: italic; background-color: #ffbf00 ;padding: 2px"}};Object.keys(o).forEach(t=>{const{links:e,style:i}=o[t];n.logLinkTypesToConsole(t,e,i)})}static logLinkTypesToConsole(t,e,n){console.log(`%c TABOOLA VIGNETTE DEBUG MODE!! ${t} LINKS COUNT: ${e.length}`,n,e)}getElementValidAnchors(t){const e=t.querySelectorAll&&t.querySelectorAll(this.getAnchorsSelectors());return e?TRC.util.toArray(e):null}handleElementAnchors(t){const e=this.getElementValidAnchors(t);e&&e.length&&this.handleDebugAnchors(e)}handleDebugAnchors(t){t.forEach(t=>{const e=t.getAttribute("href");e&&(this.shouldExcludeLink(e,t.host)?this.reportData.excludedUrls.push(e):(n.highlightVignetteAnchor(t),this.updateReportData(t)))})}handleMutations(t){t.forEach(t=>{const e=t.addedNodes;e&&e.length&&TRC.util.toArray(e).forEach(this.handleElementAnchors.trcBind(this))})}debugModeInitObserving(){this.handleElementAnchors(document.body),this.isLiteMode&&this.handleFeed(),this.observeElForLinks(document.body)}observeElForLinks(t){const e=window.MutationObserver&&new MutationObserver(this.handleMutations.trcBind(this));e&&e.observe(t,{childList:!0,subtree:!this.isLiteMode})}handleFeed(){const t=".tbl-feed-container",e=document.querySelectorAll(t);TRC.util.toArray(e).forEach(t=>{this.observeElForLinks(t)})}handleDebugMode(){this.isLiteMode=this.getIsLiteMode();const t=n.getIsSessionHandlerOn();this.logDataReportToConsole(),!t&&this.SessionHandler.remove(),this.debugModeInitObserving()}updateReportData(t){const{includedUrls:e,anchors:n}=this.reportData;this.reportData.linksCount++,n.push(t),e.push(t.href)}getIsLiteMode(){const t=TRC.URL.prototype.getParameter.call(window.location.search,this.constants.FORCE_PARAM);return"lite"===t}static getIsSessionHandlerOn(){const t="session-handler",e=TRC.URL.prototype.getParameter.call(window.location.search,t);return"on"===e}static highlightVignetteAnchor(t){t.style.border="1px dotted red",t.style.backgroundColor="#8080804a",t.taboolaAnchor&&(t.style.display="flex")}}TRC.TaboolaVignette=n})();