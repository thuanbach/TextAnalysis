function whichTransitionEndEvent(){var e,t=document.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(e in i)if(void 0!==t.style[e])return i[e]}function readCookie(e){for(var t=e+"=",i=document.cookie.split(";"),n=0;n<i.length;n++){for(var o=i[n];" "===o.charAt(0);)o=o.substring(1,o.length);if(0===o.indexOf(t))return o.substring(t.length,o.length)}return null}function createCookie(e,t,i){var n,o="";i&&((n=new Date).setTime(n.getTime()+24*i*60*60*1e3),o="; expires="+n.toGMTString()),document.cookie=e+"="+t+o+"; domain=hbr.org; path=/"}function dismissIntromercial(){function e(){t.removeEventListener(i,e),t.style.display="none",n.style.overflow="auto",n.className=n.className.replace(/ intromercial-off|intromercial-off/g,"")}var t=document.getElementById("intromercial-handle"),i=whichTransitionEndEvent(),n=document.getElementsByTagName("body")[0];t.addEventListener(i,e),t.style.opacity=0,n.className=n.className.replace("intromercial-on","intromercial-off"),void 0===i&&setTimeout(e,100)}function prepareIntromercial(){document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin",'<section id="intromercial-handle" class="hide intromercial-wrapper window-block">\t<div class="intromercial-background window-block" onClick="javascript:dismissIntromercial();"></div>\t<div class="intromercial-container has-white-bg absolute">\t\t<div class="intromercial-header">\t\t\t<div class="ad-label font-size-10 font-gt-america text-center">\t\t\t\tADVERTISEMENT\t\t\t</div>\t\t\t<div class="close-icon absolute" onClick="javascript:dismissIntromercial();">\t\t\t\t<svg class="svg-ie"><use  xlink:href="/resources/css/images/icons.svg#x"></use></svg>\t\t\t</div>\t\t</div>\t\t<div class="intromercial-iframe" style="overflow:hidden;">\t\t\t<div id=\'div-gpt-ad-1443707360480-0\'></div>\t\t</div>\t</div></section>'),isAdobeSync()&&googletag.cmd.push(function(){googletag.display("div-gpt-ad-1443707360480-0")})}function displayPopup(){prepareIntromercial()}function showIntormercial(){var e=-1===document.location.href.indexOf("cm_mmc=email-_-rtb")&&-1===document.location.href.indexOf("cm_mmc=email-_-so")&&-1===document.location.href.indexOf("cm_mmc=cpc")&&-1===document.location.href.indexOf("hideIntromercial=true")&&-1===document.location.href.indexOf("voucher_code="),t=null!=readCookie("_pc_pso"),t="/"==document.location.pathname&&t,i=document.querySelector("meta[name='intromercial']");i&&"protected"===i.content||!e||t||readCookie("marketing_interruption")||displayPopup(),console.info("intromercial has been generated"),_satellite.track("hbrIntromercialDisplay")}window.displayIntromercial=function(){var e,t="div-gpt-ad-1443707360480-0";null!=document.querySelector("#"+t+" iframe")&&"none"!=window.getComputedStyle(document.querySelector("#"+t)).display&&(t=document.getElementById("intromercial-handle"))&&((e=document.getElementsByTagName("body")[0]).style.overflow="hidden",e.className+=" intromercial-on",t.classList.remove("hide"),setTimeout(dismissIntromercial,3e4),createCookie("marketing_interruption","overlay",.5))},window.generateIntromercial=function(){window.googlefc=window.googlefc||{},window.googlefc.ccpa=window.googlefc.ccpa||{},window.googlefc.callbackQueue=window.googlefc.callbackQueue||[],googlefc.callbackQueue.push({CONSENT_DATA_READY:function(){function o(e,t){var i=e.gdprApplies,n=e.eventStatus;!0===t&&"tcloaded"===n&&!0===i&&(t=e.purpose.consents,n=Object.values(t).reduce(function(e,t){return-1==e.indexOf(t)&&e.push(t),e},[]),__tcfapi("removeEventListener",2,function(e){e&&console.info("Removing Listener")},e.listenerId),1===n.length&&!0===n[0]?showIntormercial():console.error("intromercial has been blocked")),e.hasOwnProperty("gdprApplies")&&void 0===e.gdprApplies?__tcfapi("addEventListener",2,o):!1===i&&showIntormercial()}__tcfapi("addEventListener",2,o)}})};