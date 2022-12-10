!function(){"use strict";function n(n){return function(n){if(Array.isArray(n))return e(n)}(n)||function(n){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(n))return Array.from(n)}(n)||function(n,t){if(!n)return;if("string"==typeof n)return e(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);"Object"===r&&n.constructor&&(r=n.constructor.name);if("Map"===r||"Set"===r)return Array.from(n);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return e(n,t)}(n)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(n,e){(null==e||e>n.length)&&(e=n.length);for(var t=0,r=new Array(e);t<e;t++)r[t]=n[t];return r}var t="\n    color: #FFF;\n    background: #005EE3;\n    border-radius: 2px;\n    padding: 2px 4px;\n  ",r="\n    color: #444;\n    background: yellow;\n    border-radius: 2px;\n    padding: 2px 4px;\n  ",o="\n    color: #FFF;\n    background: red;\n    border-radius: 2px;\n    padding: 2px 4px;\n  ",a=function(){var n=!1;if("undefined"!=typeof window){var e="undefined"!=typeof sessionStorage;if(e){var t=sessionStorage.getItem("atomik_debug");null!==t&&(n=JSON.parse(t))}window.location.search.includes("atomik_debug=true")&&(n=!0,e&&sessionStorage.setItem("atomik_debug",JSON.stringify(!0))),window.location.search.includes("atomik_debug=false")&&(n=!1,e&&sessionStorage.setItem("atomik_debug",JSON.stringify(!1)))}return n}(),c=function(n){var e;if(a){for(var t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];(e=console).log.apply(e,["%cAtomik",n].concat(r))}},i=function(e,t){return function(r){var o;if(a){for(var c=arguments.length,i=new Array(c>1?c-1:0),u=1;u<c;u++)i[u-1]=arguments[u];(o=console).log.apply(o,["%cAtomik%c ".concat(e.join("")),r,""].concat(n(t),i))}}},u=function(n,e,t){var r=[],o=[];return e||(r.push("%c "),o.push("")),n.forEach((function(n,e,a){var c="%c".concat(n);t&&0===e?o.push("\n    color: #444;\n    background: #dcedc8;\n    border-radius: 2px;\n    padding: 2px 4px;\n  "):o.push("\n    color: #444;\n    background: #eceff1;\n    border-radius: 2px;\n    padding: 2px 4px;\n  "),e!==a.length-1&&(c+="%c ",o.push("")),r.push(c)})),{tags:r,tagStyles:o}},d=function(){for(var e=[],a=[],d=c,s=arguments.length,f=new Array(s),l=0;l<s;l++)f[l]=arguments[l];if(f.length>=1){var g=u(f,!0,!0);e=g.tags,a=g.tagStyles,d=i(e,a)}return{debug:function(){for(var n=arguments.length,e=new Array(n),r=0;r<n;r++)e[r]=arguments[r];d.apply(void 0,[t].concat(e))},debugWithTags:function(){for(var r=arguments.length,o=new Array(r),c=0;c<r;c++)o[c]=arguments[c];return function(){for(var r=u(o,e.length<=0,!1),c=arguments.length,d=new Array(c),s=0;s<c;s++)d[s]=arguments[s];i([].concat(n(e),n(r.tags)),[].concat(n(a),n(r.tagStyles))).apply(void 0,[t].concat(d))}},warn:function(){for(var n=arguments.length,e=new Array(n),t=0;t<n;t++)e[t]=arguments[t];d.apply(void 0,[r].concat(e))},warnWithTags:function(){for(var t=arguments.length,o=new Array(t),c=0;c<t;c++)o[c]=arguments[c];return function(){for(var t=u(o,e.length<=0,!1),c=arguments.length,d=new Array(c),s=0;s<c;s++)d[s]=arguments[s];i([].concat(n(e),n(t.tags)),[].concat(n(a),n(t.tagStyles))).apply(void 0,[r].concat(d))}},error:function(){for(var n=arguments.length,e=new Array(n),t=0;t<n;t++)e[t]=arguments[t];d.apply(void 0,[o].concat(e))},errorWithTags:function(){for(var t=arguments.length,r=new Array(t),c=0;c<t;c++)r[c]=arguments[c];return function(){for(var t=u(r,e.length<=0,!1),c=arguments.length,d=new Array(c),s=0;s<c;s++)d[s]=arguments[s];i([].concat(n(e),n(t.tags)),[].concat(n(a),n(t.tagStyles))).apply(void 0,[o].concat(d))}}}}("LOADER SCRIPTS"),s=function(n){if(void 0===n.id)return!1;for(var e=document.getElementsByTagName("script"),t=0;t<e.length;++t)if("mc-loader-data"!==e[t].id&&(n.src&&-1!==e[t].src.indexOf(n.src)||n.text&&-1!==e[t].text.indexOf(n.text)))return!1;var r=document.getElementById(n.id);r&&r.remove(),r=document.createElement("script"),Object.keys(n).map((function(e){r[e]=n[e]})),n.type||(r.type="text/javascript"),n.async||(r.async=!1),n.defer||(r.defer=!1),setTimeout((function(){document.head.appendChild(r),(null==n?void 0:n.debugMessage)&&d.debug(null==n?void 0:n.debugMessage)}),1)},f=JSON.parse(document.getElementById("mc-loader-data").text),l=f.configuration,g=l.delayTime,m=l.disableLazy,p=f.scripts,y=p.filter((function(n){return m||!n.lazy})),v=p.filter((function(n){return n.lazy&&("time"===n.lazyType||"both"===n.lazyType)})),h=p.filter((function(n){return n.lazy&&("action"===n.lazyType||"both"===n.lazyType)})),b=[],w=function(n){n&&Array.isArray(n)&&n.forEach((function(n){b.includes(n.id)||(b.push(n.id),function(n){s(n)}(n))}))};w(y),m||(setTimeout((function(){return w(v)}),g),document.addEventListener("click",(function(){return w(h)}),!1),document.removeEventListener("click",(function(){return w(h)}),!1),document.addEventListener("touchmove",(function(){return w(h)}),!1),document.removeEventListener("touchmove",(function(){return w(h)}),!1),document.addEventListener("scroll",(function(){return w(h)}),!1),document.removeEventListener("scroll",(function(){return w(h)}),!1),document.addEventListener("resize",(function(){return w(h)}),!1),document.removeEventListener("resize",(function(){return w(h)}),!1),document.addEventListener("keydown",(function(){return w(h)}),!1),document.removeEventListener("keydown",(function(){return w(h)}),!1),document.addEventListener("auxclick",(function(){return w(h)}),!1),document.removeEventListener("auxclick",(function(){return w(h)}),!1),document.addEventListener("mousemove",(function(){return w(h)}),!1),document.removeEventListener("mousemove",(function(){return w(h)}),!1),document.addEventListener("wheel",(function(){return w(h)}),!1),document.removeEventListener("wheel",(function(){return w(h)}),!1))}();