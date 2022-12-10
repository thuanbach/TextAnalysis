var webVitals=function(e){"use strict";var n,t,i,r,a,o=-1,c=function(e){addEventListener("pageshow",(function(n){n.persisted&&(o=n.timeStamp,e(n))}),!0)},u=function(){return window.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0]},f=function(){var e=u();return e&&e.activationStart||0},s=function(e,n){var t=u(),i="navigate";return o>=0?i="back-forward-cache":t&&(i=document.prerendering||f()>0?"prerender":document.wasDiscarded?"restore":t.type.replace(/_/g,"-")),{name:e,value:void 0===n?-1:n,rating:"good",delta:0,entries:[],id:"v3-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:i}},d=function(e,n,t){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){var i=new PerformanceObserver((function(e){Promise.resolve().then((function(){n(e.getEntries())}))}));return i.observe(Object.assign({type:e,buffered:!0},t||{})),i}}catch(e){}},l=function(e,n){var t=function t(i){"pagehide"!==i.type&&"hidden"!==document.visibilityState||(e(i),n&&(removeEventListener("visibilitychange",t,!0),removeEventListener("pagehide",t,!0)))};addEventListener("visibilitychange",t,!0),addEventListener("pagehide",t,!0)},v=function(e,n,t,i){var r,a;return function(o){n.value>=0&&(o||i)&&((a=n.value-(r||0))||void 0===r)&&(r=n.value,n.delta=a,n.rating=function(e,n){return e>n[1]?"poor":e>n[0]?"needs-improvement":"good"}(n.value,t),e(n))}},p=function(e){requestAnimationFrame((function(){return requestAnimationFrame((function(){return e()}))}))},m=function(e){document.prerendering?addEventListener("prerenderingchange",(function(){return e()}),!0):e()},h=-1,g=function(){return"hidden"!==document.visibilityState||document.prerendering?1/0:0},y=function(e){"hidden"===document.visibilityState&&h>-1&&(h="visibilitychange"===e.type?e.timeStamp:0,E())},T=function(){addEventListener("visibilitychange",y,!0),addEventListener("prerenderingchange",y,!0)},E=function(){removeEventListener("visibilitychange",y,!0),removeEventListener("prerenderingchange",y,!0)},C=function(){return h<0&&(h=g(),T(),c((function(){setTimeout((function(){h=g(),T()}),0)}))),{get firstHiddenTime(){return h}}},L=function(e,n){n=n||{},m((function(){var t,i=[1800,3e3],r=C(),a=s("FCP"),o=d("paint",(function(e){e.forEach((function(e){"first-contentful-paint"===e.name&&(o.disconnect(),e.startTime<r.firstHiddenTime&&(a.value=Math.max(e.startTime-f(),0),a.entries.push(e),t(!0)))}))}));o&&(t=v(e,a,i,n.reportAllChanges),c((function(r){a=s("FCP"),t=v(e,a,i,n.reportAllChanges),p((function(){a.value=performance.now()-r.timeStamp,t(!0)}))})))}))},b=function(e,n){n=n||{},m((function(){var t,i=[.1,.25],r=s("CLS"),a=-1,o=0,u=[],f=function(n){a>-1&&e(n)},m=function(e){e.forEach((function(e){if(!e.hadRecentInput){var n=u[0],i=u[u.length-1];o&&e.startTime-i.startTime<1e3&&e.startTime-n.startTime<5e3?(o+=e.value,u.push(e)):(o=e.value,u=[e]),o>r.value&&(r.value=o,r.entries=u,t())}}))},h=d("layout-shift",m);h&&(t=v(f,r,i,n.reportAllChanges),L((function(e){a=e.value,r.value<0&&(r.value=0,t())})),l((function(){m(h.takeRecords()),t(!0)})),c((function(){o=0,a=-1,r=s("CLS",0),t=v(f,r,i,n.reportAllChanges),p((function(){return t()}))})))}))},w={passive:!0,capture:!0},S=new Date,P=function(e,r){n||(n=r,t=e,i=new Date,F(removeEventListener),I())},I=function(){if(t>=0&&t<i-S){var e={entryType:"first-input",name:n.type,target:n.target,cancelable:n.cancelable,startTime:n.timeStamp,processingStart:n.timeStamp+t};r.forEach((function(n){n(e)})),r=[]}},A=function(e){if(e.cancelable){var n=(e.timeStamp>1e12?new Date:performance.now())-e.timeStamp;"pointerdown"==e.type?function(e,n){var t=function(){P(e,n),r()},i=function(){r()},r=function(){removeEventListener("pointerup",t,w),removeEventListener("pointercancel",i,w)};addEventListener("pointerup",t,w),addEventListener("pointercancel",i,w)}(n,e):P(n,e)}},F=function(e){["mousedown","keydown","touchstart","pointerdown"].forEach((function(n){return e(n,A,w)}))},M=function(e,i){i=i||{},m((function(){var a,o=[100,300],u=C(),f=s("FID"),p=function(e){e.startTime<u.firstHiddenTime&&(f.value=e.processingStart-e.startTime,f.entries.push(e),a(!0))},m=function(e){e.forEach(p)},h=d("first-input",m);a=v(e,f,o,i.reportAllChanges),h&&l((function(){m(h.takeRecords()),h.disconnect()}),!0),h&&c((function(){var c;f=s("FID"),a=v(e,f,o,i.reportAllChanges),r=[],t=-1,n=null,F(addEventListener),c=p,r.push(c),I()}))}))},D=0,k=1/0,B=0,x=function(e){e.forEach((function(e){e.interactionId&&(k=Math.min(k,e.interactionId),B=Math.max(B,e.interactionId),D=B?(B-k)/7+1:0)}))},R=function(){return a?D:performance.interactionCount||0},H=function(){"interactionCount"in performance||a||(a=d("event",x,{type:"event",buffered:!0,durationThreshold:0}))},N=0,O=function(){return R()-N},_=[],j={},q=function(e){var n=_[_.length-1],t=j[e.interactionId];if(t||_.length<10||e.duration>n.latency){if(t)t.entries.push(e),t.latency=Math.max(t.latency,e.duration);else{var i={id:e.interactionId,latency:e.duration,entries:[e]};j[i.id]=i,_.push(i)}_.sort((function(e,n){return n.latency-e.latency})),_.splice(10).forEach((function(e){delete j[e.id]}))}},V=function(e,n){n=n||{},m((function(){var t=[200,500];H();var i,r=s("INP"),a=function(e){e.forEach((function(e){(e.interactionId&&q(e),"first-input"===e.entryType)&&(!_.some((function(n){return n.entries.some((function(n){return e.duration===n.duration&&e.startTime===n.startTime}))}))&&q(e))}));var n,t=(n=Math.min(_.length-1,Math.floor(O()/50)),_[n]);t&&t.latency!==r.value&&(r.value=t.latency,r.entries=t.entries,i())},o=d("event",a,{durationThreshold:n.durationThreshold||40});i=v(e,r,t,n.reportAllChanges),o&&(o.observe({type:"first-input",buffered:!0}),l((function(){a(o.takeRecords()),r.value<0&&O()>0&&(r.value=0,r.entries=[]),i(!0)})),c((function(){_=[],N=R(),r=s("INP"),i=v(e,r,t,n.reportAllChanges)})))}))},z={},G=function(e,n){n=n||{},m((function(){var t,i=[2500,4e3],r=C(),a=s("LCP"),o=function(e){var n=e[e.length-1];if(n){var i=Math.max(n.startTime-f(),0);i<r.firstHiddenTime&&(a.value=i,a.entries=[n],t())}},u=d("largest-contentful-paint",o);if(u){t=v(e,a,i,n.reportAllChanges);var m=function(){z[a.id]||(o(u.takeRecords()),u.disconnect(),z[a.id]=!0,t(!0))};["keydown","click"].forEach((function(e){addEventListener(e,m,{once:!0,capture:!0})})),l(m,!0),c((function(r){a=s("LCP"),t=v(e,a,i,n.reportAllChanges),p((function(){a.value=performance.now()-r.timeStamp,z[a.id]=!0,t(!0)}))}))}}))},J=function e(n){document.prerendering?m((function(){return e(n)})):"complete"!==document.readyState?addEventListener("load",(function(){return e(n)}),!0):setTimeout(n,0)},K=function(e,n){n=n||{};var t=[800,1800],i=s("TTFB"),r=v(e,i,t,n.reportAllChanges);J((function(){var a=u();if(a){var o=a.responseStart;if(o<=0||o>performance.now())return;i.value=Math.max(o-f(),0),i.entries=[a],r(!0),c((function(){i=s("TTFB",0),(r=v(e,i,t,n.reportAllChanges))(!0)}))}}))};return e.getCLS=b,e.getFCP=L,e.getFID=M,e.getINP=V,e.getLCP=G,e.getTTFB=K,e.onCLS=b,e.onFCP=L,e.onFID=M,e.onINP=V,e.onLCP=G,e.onTTFB=K,Object.defineProperty(e,"__esModule",{value:!0}),e}({});