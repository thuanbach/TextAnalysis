(()=>{"use strict";function e(e){var i,d,n,t="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(e){var i=16*Math.random()|0;return("x"==e?i:3&i|8).toString(16)}));if(i=window.ID5&&!0===window.ID5.initialized&&window.ID5.userId?"&dsp=id5&dsp_uid="+ID5.userId:window.pbjs&&window.pbjs.getUserIds&&window.pbjs.getUserIds().id5id&&window.pbjs.getUserIds().id5id.uid?"&dsp=id5&dsp_uid="+window.pbjs.getUserIds().id5id.uid:"",d=window.localStorage&&window.localStorage._pubcid?"&dsp=pub_common&dsp_uid="+window.localStorage._pubcid:window.pbjs&&window.pbjs.getUserIds&&window.pbjs.getUserIds().pubcid?"&dsp=pub_common&dsp_uid="+window.pbjs.getUserIds().pubcid:"",window.__uid2&&window.__uid2.getAdvertisingTokenAsync)window.__uid2.getAdvertisingTokenAsync().then((function(e){e&&((new Image).src="https://s.cpx.to/sync?dsp=uid2&dsp_uid="+e+"&fid="+t)})),n="";else if(window.__uid2&&window.__uid2.getAdvertisingToken){var o=window.__uid2.getAdvertisingToken();o&&(n="&dsp=uid2&dsp_uid="+o)}else n="";var s=encodeURIComponent(document.referrer),r=encodeURIComponent(document.URL),c=window.captify_kw_query_12967?"&kw="+encodeURIComponent(captify_kw_query_12967):"",w="pid=12967&ref="+s+"&url="+r+"&hn_ver=40&fid="+t+c+(e?"&gcv="+e:"")+i+d+n,p=document.createElement("script");p.src="https://s.cpx.to/fire.js?"+w,document.head.appendChild(p)}!function(){if(window.__tcfapi)__tcfapi("addEventListener",2,(function(i,d){d&&(i.gdprApplies?"useractioncomplete"!==i.eventStatus&&"tcloaded"!==i.eventStatus||(e(i.tcString),__tcfapi("removeEventListener",2,(function(e){}),i.listenerId)):(e(""),__tcfapi("removeEventListener",2,(function(e){}),i.listenerId)))}));else if(window.__cmp)window.__cmp("getConsentData",null,(function(i,d){e(i&&i.consentData||"")}));else{for(var i=["euconsent","euconsent-v2","euconsent-v2_backup"],d=document.cookie.split(";"),n="",t=0;t<d.length;t++){var o=d[t].trim(),s=o.indexOf("="),r=o.slice(0,s),c=o.slice(s+1);if(i.includes(r)){n=c;break}}e(n||"")}}()})();