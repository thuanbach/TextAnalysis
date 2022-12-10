(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
var p=this||self;function aa(a){a=a.u;const b=encodeURIComponent;let c="";a.platform&&(c+="&uap="+b(a.platform));a.platformVersion&&(c+="&uapv="+b(a.platformVersion));a.uaFullVersion&&(c+="&uafv="+b(a.uaFullVersion));a.architecture&&(c+="&uaa="+b(a.architecture));a.model&&(c+="&uam="+b(a.model));a.bitness&&(c+="&uab="+b(a.bitness));a.fullVersionList&&(c+="&uafvl="+b(a.fullVersionList.map(d=>b(d.brand)+";"+b(d.version)).join("|")));"undefined"!==typeof a.wow64&&(c+="&uaw="+Number(a.wow64));return c}
function ba(a,b){return a.g?a.l.slice(0,a.g.index)+b+a.l.slice(a.g.index):a.l+b}function ca(a){let b="&act=1&ri=1";a.h&&a.u&&(b+=aa(a));return ba(a,b)}function da(a,b){return a.h&&a.i||a.s?1==b?a.h?a.i:ba(a,"&dct=1"):2==b?ba(a,"&ri=2"):ba(a,"&ri=16"):a.l}
var ea=class{constructor({url:a,U:b}){this.l=a;this.u=b;b=/[?&]dsh=1(&|$)/.test(a);this.h=!b&&/[?&]ae=1(&|$)/.test(a);this.s=!b&&/[?&]ae=2(&|$)/.test(a);if((this.g=/[?&]adurl=([^&]*)/.exec(a))&&this.g[1]){let c;try{c=decodeURIComponent(this.g[1])}catch(d){c=null}this.i=c}}};function q(a){var b;a:{if(b=p.navigator)if(b=b.userAgent)break a;b=""}return-1!=b.indexOf(a)};var t=class{constructor(a,b){this.g=b===r?a:""}toString(){return this.g.toString()}};t.prototype.i=!0;t.prototype.h=function(){return this.g.toString()};function fa(a){return a instanceof t&&a.constructor===t?a.g:"type_error:SafeUrl"}var ha=/^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i,r={},ka=new t("about:invalid#zClosurez",r);function la(a,b){a:{const c=a.length,d="string"===typeof a?a.split(""):a;for(let e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:"string"===typeof a?a.charAt(b):a[b]};/*

 SPDX-License-Identifier: Apache-2.0
*/
function ma(a){let b=!1,c;return function(){b||(c=a(),b=!0);return c}};function na(a,b){b instanceof t||b instanceof t||(b="object"==typeof b&&b.i?b.h():String(b),ha.test(b)||(b="about:invalid#zClosurez"),b=new t(b,r));a.href=fa(b)};class oa{constructor(a){this.ca=a}}function u(a){return new oa(b=>b.substr(0,a.length+1).toLowerCase()===a+":")}const pa=new oa(a=>/^[^:]*([/?#]|$)/.test(a));var qa=u("http"),ra=u("https"),sa=u("ftp"),ta=u("mailto"),ua=u("intent"),va=u("market"),wa=u("itms"),xa=u("itms-appss");const ya=[u("data"),qa,ra,ta,sa,pa];function za(a,b=ya){for(let c=0;c<b.length;++c){const d=b[c];if(d instanceof oa&&d.ca(a))return new t(a,r)}}function Aa(a,b=ya){return za(a,b)||ka};function Ba(){return q("iPhone")&&!q("iPod")&&!q("iPad")};function Ca(a){Ca[" "](a);return a}Ca[" "]=function(){};var Da=Ba(),Ea=q("iPad");var Fa=Ba()||q("iPod"),Ha=q("iPad");var Ia={},Ja=null;
function Ka(a,b){void 0===b&&(b=0);if(!Ja){Ja={};for(var c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),d=["+/=","+/","-_=","-_.","-_"],e=0;5>e;e++){var f=c.concat(d[e].split(""));Ia[e]=f;for(var g=0;g<f.length;g++){var h=f[g];void 0===Ja[h]&&(Ja[h]=g)}}}b=Ia[b];c=Array(Math.floor(a.length/3));d=b[64]||"";for(e=f=0;f<a.length-2;f+=3){var l=a[f],k=a[f+1];h=a[f+2];g=b[l>>2];l=b[(l&3)<<4|k>>4];k=b[(k&15)<<2|h>>6];h=b[h&63];c[e++]=g+l+k+h}g=0;h=d;switch(a.length-f){case 2:g=
a[f+1],h=b[(g&15)<<2]||d;case 1:a=a[f],c[e]=b[a>>2]+b[(a&3)<<4|g>>4]+h+d}return c.join("")};var La="undefined"!==typeof Uint8Array,Ma={};let Na;var Oa=class{constructor(a){if(Ma!==Ma)throw Error("illegal external caller");this.V=a;if(null!=a&&0===a.length)throw Error("ByteString should be constructed with non-empty values");}};const v=Symbol(void 0);function w(a,b){Object.isFrozen(a)||(v?a[v]|=b:void 0!==a.v?a.v|=b:Object.defineProperties(a,{v:{value:b,configurable:!0,writable:!0,enumerable:!1}}))}function Pa(a,b){Object.isExtensible(a)&&(v?a[v]&&(a[v]&=~b):void 0!==a.v&&(a.v&=~b))}function x(a){let b;v?b=a[v]:b=a.v;return null==b?0:b}function y(a,b){v?a[v]=b:void 0!==a.v?a.v=b:Object.defineProperties(a,{v:{value:b,configurable:!0,writable:!0,enumerable:!1}})}function z(a){w(a,1);return a}
function Qa(a){w(a,17);return a}function A(a){return a?!!(x(a)&2):!1}function B(a){w(a,2);return a}function C(a){w(a,16);return a}function Ra(a){if(!Array.isArray(a))throw Error("cannot mark non-array as shared mutably");Pa(a,16)}function Sa(a,b){y(b,(x(a)|0)&-51)}function Ta(a,b){y(b,(x(a)|18)&-33)};var Ua={};function D(a){return A(a.j)}function Va(a){return null!==a&&"object"===typeof a&&!Array.isArray(a)&&a.constructor===Object}let Wa;var Xa=Object,Ya=Xa.freeze,Za=[];w(Za,3);var $a=Ya.call(Xa,Za);function ab(a){if(D(a))throw Error("Cannot mutate an immutable Message");}var bb=class{constructor(a){this.h=0;this.g=a}next(){return this.h<this.g.length?{done:!1,value:this.g[this.h++]}:{done:!0,value:void 0}}[Symbol.iterator](){return this}};function cb(a,b,c){let d=!1;if(null!=a&&"object"===typeof a&&!(d=Array.isArray(a))&&a.F===Ua)return a;if(d)return new b(a);if(c)return new b}function ib(a,b,c=!1){if(Array.isArray(a))return new b(c?C(a):a)};function jb(a,b){return new F(b,a.l,a.i,a.u)}function kb(a){return Array.from(a.g.keys()).sort(lb)}function nb(a,b=ob){const c=kb(a);for(let d=0;d<c.length;d++){const e=c[d],f=a.g.get(c[d]);c[d]=[b(e),b(f)]}return c}function pb(a,b=ob){const c=[];a=a.g.entries();for(var d;!(d=a.next()).done;)d=d.value,d[0]=b(d[0]),d[1]=b(d[1]),c.push(d);return c}
var F=class{constructor(a,b,c,d=qb){c=x(a);c|=32;y(a,c);this.h=c;this.i=(this.l=b)?rb:sb;this.u=d;this.g=b=new Map;for(d=0;d<a.length;d++)c=a[d],b.set(c[0],c[1]);this.size=b.size}entries(){const a=kb(this);for(let b=0;b<a.length;b++){const c=a[b];a[b]=[c,this.get(c)]}return new bb(a)}keys(){const a=kb(this);return new bb(a)}values(){const a=kb(this);for(let b=0;b<a.length;b++)a[b]=this.get(a[b]);return new bb(a)}forEach(a,b){const c=kb(this);for(let d=0;d<c.length;d++){const e=c[d];a.call(b,this.get(e),
e,this)}}set(a,b){if(this.h&2)throw Error("Cannot mutate an immutable Map");const c=this.g;if(null==b)return c.delete(a),this;c.set(a,this.i(b,this.l,!1,this.s));this.size=c.size;return this}get(a){const b=this.g;if(b.has(a)){var c=b.get(a),d=this.h,e=this.l;e&&Array.isArray(c)&&d&16&&C(c);d=this.i(c,e,!!(d&2),this.s);d!==c&&b.set(a,d);return d}}has(a){return this.g.has(a)}[Symbol.iterator](){return this.entries()}};function lb(a,b){a=""+a;b=""+b;return a>b?1:a<b?-1:0}
function rb(a,b,c,d){a=cb(a,b,!0);c?B(a.j):d&&(a=tb(a));return a}function sb(a){return a}function qb(a){return a}function ob(a){return a};function ub(a){switch(typeof a){case "number":return isFinite(a)?a:String(a);case "object":if(a&&!Array.isArray(a)){if(La&&null!=a&&a instanceof Uint8Array)return Ka(a);if(a instanceof Oa){const b=a.V;return null==b?"":"string"===typeof b?b:a.V=Ka(b)}if(a instanceof F)return nb(a)}}return a};function vb(a,b,c,d){if(null!=a){if(Array.isArray(a))a=wb(a,b,c,void 0!==d);else if(Va(a)){const e={};for(let f in a)e[f]=vb(a[f],b,c,d);a=e}else a=b(a,d);return a}}function wb(a,b,c,d){d=d?!!(x(a)&16):void 0;const e=Array.prototype.slice.call(a);c(a,e);for(a=0;a<e.length;a++)e[a]=vb(e[a],b,c,d);return e}function xb(a){return vb(a,yb,zb)}function yb(a){return a.F===Ua?a.toJSON():a instanceof F?nb(a,xb):ub(a)}function Ab(a){return vb(a,Bb,zb)}
function Bb(a){if(!a)return a;if("object"===typeof a){if(La&&null!=a&&a instanceof Uint8Array)return new Uint8Array(a);if(a instanceof F)return a.size?jb(a,C(pb(a,Ab))):[];if(a.F===Ua)return Cb(a)}return a}function zb(){};function G(a,b,c=!1){return-1===b?null:b>=a.B?a.m?a.m[b]:void 0:c&&a.m&&(c=a.m[b],null!=c)?c:a.j[b+a.A]}function H(a,b,c,d=!1,e=!1){e||ab(a);a.g&&(a.g=void 0);if(b>=a.B||d)return(a.m||(a.m=a.j[a.B+a.A]={}))[b]=c,a;void 0!==a.m&&a.B>=a.j.length?(d=a.j.length-1,e=b+a.A,e>=d?(a.j[d]=void 0,a.j[e]=c,a.j.push(a.m)):a.j[e]=c):a.j[b+a.A]=c;void 0!==a.m&&b in a.m&&delete a.m[b];return a}
function Db(a,b,c,d){let e=G(a,b,d);Array.isArray(e)||(e=$a);const f=x(e);f&1||z(e);D(a)?(f&2||B(e),c&1||Object.freeze(e)):e===$a||!(c&1&&c&2)&&f&2?(e=z(Array.prototype.slice.call(e)),H(a,b,e,d)):!(c&2)&&f&16&&Ra(e);return e}function Eb(a,b){let c=Db(a,b,1,!1);if(c.length&&!(x(c)&4)){Object.isFrozen(c)&&(c=z(c.slice()),H(a,b,c,!1,!0));let d=b=0;for(;b<c.length;b++){const e=c[b];null!=e&&(c[d++]=e)}d<b&&(c.length=d);w(c,5)}D(a)&&!Object.isFrozen(c)&&(B(c),Object.freeze(c));return c}
function Fb(a,b,c){a=G(a,b);return null==a?c:a}let Gb;
function Hb(a,b,c){b:{var d=G(a,b),e=D(a),f=!1;if(null==d){if(e){b=Gb||(Gb=new F(B([])));break b}d=[]}else if(d.constructor===F){if(0==(d.h&2)||e){b=d;break b}d=pb(d)}else Array.isArray(d)?f=A(d):d=[];if(e){if(!d.length){b=Gb||(Gb=new F(B([])));break b}f||(f=!0,B(d))}else if(f)for(f=!1,d=Array.prototype.slice.call(d),e=0;e<d.length;e++){const g=d[e]=Array.prototype.slice.call(d[e]);Array.isArray(g[1])&&(g[1]=B(g[1]))}f||(x(d)&32?Ra(d):x(a.j)&16&&C(d));f=new F(d,c);H(a,b,f,!1,!0);b=f}null==b?a=b:(!D(a)&&
c&&(b.s=!0),a=b);return a}function J(a,b,c){const d=G(a,c,!1);b=cb(d,b);b!==d&&null!=b&&(H(a,c,b,!1,!0),w(b.j,x(a.j)&-33));return b}function N(a,b,c){b=J(a,b,c);if(null==b)return b;D(b)&&!D(a)&&(b=tb(b),H(a,c,b,!1));return b}
function Ib(a,b,c,d,e=!0){a.o||(a.o={});let f=a.o[c],g=Db(a,c,3,d);const h=D(a);if(f)h||(Object.isFrozen(f)?e||(f=Array.prototype.slice.call(f),a.o[c]=f):e&&Object.freeze(f));else{f=[];const k=!!(x(a.j)&16),n=A(g);!h&&n&&(g=z(Array.prototype.slice.call(g)),H(a,c,g,d));d=n;for(let m=0;m<g.length;m++){var l=g[m];d=d||A(l);l=ib(l,b,k);void 0!==l&&(f.push(l),n&&B(l.j))}a.o[c]=f;a=g;Object.isFrozen(a)||(b=x(a)|33,y(a,d?b&-9:b|8));(h||e&&n)&&B(f);(h||e)&&Object.freeze(f)}return f}
function Jb(a,b,c,d=!1){var e=D(a);b=Ib(a,b,c,d,e);a=Db(a,c,3,d);if(e=!e&&a){if(!a)throw Error("cannot check mutability state of non-array");e=!(x(a)&8)}if(e){for(e=0;e<b.length;e++)(c=b[e])&&D(c)&&(b[e]=tb(b[e]),a[e]=b[e].j);w(a,8)}return b}function Kb(a,b,c,d){ab(a);let e;if(null!=c){e=z([]);let f=!1;for(let g=0;g<c.length;g++)e[g]=c[g].j,f=f||A(e[g]);a.o||(a.o={});a.o[b]=c;c=e;f?Pa(c,8):w(c,8)}else a.o&&(a.o[b]=void 0),e=$a;return H(a,b,e,d)}function Lb(a,b){return null==a?b:a}
function O(a,b){return Lb(G(a,b),"")}function Q(a,b){a=G(a,b);return Lb(null==a?a:!!a,!1)};function Mb(a){if(A(a)&&Object.isFrozen(a))return a;const b=Array.prototype.map.call(a,Nb,void 0);Ta(a,b);Object.freeze(b);return b}function Ob(a,b){if(null!=a){if(La&&a instanceof Uint8Array)return a.length?new Oa(new Uint8Array(a)):Na||(Na=new Oa(null));if(Array.isArray(a)){if(A(a))return a;b&&(b=x(a),b=!(b&32)&&(!!(b&16)||0===b));return b?(B(a),a):wb(a,Ob,Ta)}return a.F===Ua?Nb(a):a instanceof F?jb(a,B(pb(a,Ob))):a}}function Nb(a){if(D(a))return a;a=Pb(a);B(a.j);return a}
function Pb(a){const b=new a.constructor;a.C&&(b.C=a.C.slice());const c=a.j,d=!!(x(c)&16);for(let k=0;k<c.length;k++){var e=c[k];if(k===c.length-1&&Va(e))for(const n in e){var f=+n;if(Number.isNaN(f))(b.m||(b.m=b.j[b.B+b.A]={}))[f]=e[f];else{var g=b,h=e[n],l=d;const m=a.o&&a.o[f];m?Kb(g,f,Mb(m),!0):H(g,f,Ob(h,l),!0)}}else g=b,f=k-a.A,h=d,(l=a.o&&a.o[f])?Kb(g,f,Mb(l),!1):H(g,f,Ob(e,h),!1)}return b};function tb(a){if(D(a)){var b=Pb(a);b.g=a;a=b}return a}function Cb(a){var b=wb(a.j,Bb,Sa);C(b);Qb=b;b=new a.constructor(b);Qb=null;Rb(b,a);return b}function Sb(a){Wa=!0;try{return JSON.stringify(a.toJSON(),Tb)}finally{Wa=!1}}
var R=class{constructor(a,b,c){null==a&&(a=Qb);Qb=null;var d=this.constructor.g||0,e=0<d,f=this.constructor.h,g=!1;if(null==a){var h=f?[f]:[];w(h,48);a=h;h=!0}else{if(!Array.isArray(a))throw Error();if(h=!!(x(a)&16))g=x(a),y(a,g|32),g=!!(g&32)}e&&0<a.length&&Va(a[a.length-1])&&"g"in a[a.length-1]&&(d=0);this.A=(f?0:-1)-d;this.o=void 0;this.j=a;a:{f=this.j.length;d=f-1;if(f&&(f=this.j[d],Va(f))){this.m=f;b=Object.keys(f);0<b.length&&Array.prototype.every.call(b,isNaN,void 0)?this.B=Number.MAX_VALUE:
this.B=d-this.A;break a}void 0!==b&&-1<b?(this.B=Math.max(b,d+1-this.A),this.m=void 0):this.B=Number.MAX_VALUE}if(!e&&this.m&&"g"in this.m)throw Error('Unexpected "g" flag in sparse object of message that is not a group type.');if(c)for(e=h&&!g?Qa:z,b=0;b<c.length;b++)h=c[b],(g=G(this,h))?Array.isArray(g)&&e(g):H(this,h,$a,!1,!0)}toJSON(){const a=this.j;return Wa?a:wb(a,yb,zb)}};R.prototype.F=Ua;R.prototype.toString=function(){return this.j.toString()};function Tb(a,b){return ub(b)}
function Rb(a,b){b.C&&(a.C=b.C.slice());const c=b.o;if(c){const f=b.m;for(let g in c)if(b=c[g]){var d=!(!f||!f[g]),e=+g;if(Array.isArray(b)){if(b.length)for(d=Jb(a,b[0].constructor,e,d),e=0;e<Math.min(d.length,b.length);e++)Rb(d[e],b[e])}else throw a=typeof b,Error("unexpected object: type: "+("object"!=a?a:b?Array.isArray(b)?"array":a:"null")+": "+b);}}}let Qb;var Ub=class extends R{constructor(a){super(a)}},Vb=class extends R{constructor(a){super(a)}};var Xb=class extends R{constructor(a){super(a,-1,Wb)}},Yb=class extends R{constructor(a){super(a)}D(){return O(this,3)}T(a){H(this,5,a)}},S=class extends R{constructor(a){super(a)}D(){return O(this,1)}T(a){H(this,2,a)}},Zb=class extends R{constructor(a){super(a)}},Wb=[6,7];var ac=class extends R{constructor(a){super(a,-1,$b)}},$b=[17];var bc=class extends R{constructor(a){super(a)}};var cc=class extends R{constructor(){super()}};var dc={capture:!0},ec={passive:!0},fc=ma(function(){let a=!1;try{const b=Object.defineProperty({},"passive",{get:function(){a=!0}});p.addEventListener("test",null,b)}catch(b){}return a});function gc(a){return a?a.passive&&fc()?a:a.capture||!1:!1}function T(a,b,c,d){a.addEventListener&&a.addEventListener(b,c,gc(d))};function hc(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)};var ic=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function jc(a){var b=a.indexOf("#");0>b&&(b=a.length);var c=a.indexOf("?");if(0>c||c>b){c=b;var d=""}else d=a.substring(c+1,b);return[a.slice(0,c),d,a.slice(b)]}function kc(a,b){return b?a?a+"&"+b:b:a}function lc(a,b){if(!b)return a;a=jc(a);a[1]=kc(a[1],b);return a[0]+(a[1]?"?"+a[1]:"")+a[2]}
function mc(a,b,c){if(Array.isArray(b))for(var d=0;d<b.length;d++)mc(a,String(b[d]),c);else null!=b&&c.push(a+(""===b?"":"="+encodeURIComponent(String(b))))}function nc(a){var b=[],c;for(c in a)mc(c,a[c],b);return b.join("&")}var oc=/#|$/;
function pc(a,b){var c=a.search(oc);a:{var d=0;for(var e=b.length;0<=(d=a.indexOf(b,d))&&d<c;){var f=a.charCodeAt(d-1);if(38==f||63==f)if(f=a.charCodeAt(d+e),!f||61==f||38==f||35==f)break a;d+=e+1}d=-1}if(0>d)return null;e=a.indexOf("&",d);if(0>e||e>c)e=c;d+=b.length+1;return decodeURIComponent(a.slice(d,-1!==e?e:0).replace(/\+/g," "))}
function uc(a,b){a=jc(a);var c=a[1],d=[];c&&c.split("&").forEach(function(e){var f=e.indexOf("=");b.hasOwnProperty(0<=f?e.slice(0,f):e)||d.push(e)});a[1]=kc(d.join("&"),nc(b));return a[0]+(a[1]?"?"+a[1]:"")+a[2]};function vc(a,b){if(a)for(const c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(a[c],c,a)}var wc=a=>{a.preventDefault?a.preventDefault():a.returnValue=!1};let xc=[];const yc=()=>{const a=xc;xc=[];for(const b of a)try{b()}catch(c){}};
var zc=a=>{xc.push(a);1==xc.length&&(window.Promise?Promise.resolve().then(yc):window.setImmediate?setImmediate(yc):setTimeout(yc,0))},Ac=a=>{var b=U;"complete"===b.readyState||"interactive"===b.readyState?zc(a):b.addEventListener("DOMContentLoaded",a)},Bc=a=>{var b=window;"complete"===b.document.readyState?zc(a):b.addEventListener("load",a)};function Cc(a=document){return a.createElement("img")};function Dc(a,b,c=null,d=!1){Ec(a,b,c,d)}function Ec(a,b,c,d){a.google_image_requests||(a.google_image_requests=[]);const e=Cc(a.document);if(c||d){const f=g=>{c&&c(g);if(d){g=a.google_image_requests;const h=Array.prototype.indexOf.call(g,e,void 0);0<=h&&Array.prototype.splice.call(g,h,1)}e.removeEventListener&&e.removeEventListener("load",f,gc());e.removeEventListener&&e.removeEventListener("error",f,gc())};T(e,"load",f);T(e,"error",f)}e.src=b;a.google_image_requests.push(e)}
function Fc(a,b){var c;if(c=a.navigator)c=a.navigator.userAgent,c=/Chrome/.test(c)&&!/Edge/.test(c)?!0:!1;c&&a.navigator.sendBeacon?a.navigator.sendBeacon(b):Dc(a,b,void 0,!1)};let Gc=0;function Hc(a){return(a=Ic(a,document.currentScript))&&a.getAttribute("data-jc-version")||"unknown"}function Ic(a,b=null){return b&&b.getAttribute("data-jc")===String(a)?b:document.querySelector(`[${"data-jc"}="${a}"]`)}
function Jc(a){if(!(.01<Math.random())){const b=Ic(a,document.currentScript);a=`https://${b&&"true"===b.getAttribute("data-jc-rcd")?"pagead2.googlesyndication-cn.com":"pagead2.googlesyndication.com"}/pagead/gen_204?id=jca&jc=${a}&version=${Hc(a)}&sample=${.01}`;Fc(window,a)}};var U=document,V=window;function Kc(a){return fa(a)};const Lc=[qa,ra,ta,sa,pa,va,wa,ua,xa];function Mc(a,b){if(a instanceof t)return a;const c=Aa(a,Lc);c===ka&&b(a);return new t(Kc(c),r)}var Nc=a=>{var b=`${"http:"===V.location.protocol?"http:":"https:"}//${"pagead2.googlesyndication.com"}/pagead/gen_204`;return c=>{c=nc({id:"unsafeurl",ctx:a,url:c});c=lc(b,c);navigator.sendBeacon&&navigator.sendBeacon(c,"")}};var Oc=a=>{var b=U;try{return b.querySelectorAll("*["+a+"]")}catch(c){return[]}};class Pc{constructor(a,b){this.error=a;this.context=b.context;this.msg=b.message||"";this.id=b.id||"jserror";this.meta={}}};const Qc=RegExp("^https?://(\\w|-)+\\.cdn\\.ampproject\\.(net|org)(\\?|/|$)");var Rc=class{constructor(a,b){this.g=a;this.h=b}},Sc=class{constructor(a,b){this.url=a;this.S=!!b;this.depth=null}};function Tc(a,b){const c={};c[a]=b;return[c]}function Uc(a,b,c,d,e){const f=[];vc(a,function(g,h){(g=Vc(g,b,c,d,e))&&f.push(h+"="+g)});return f.join(b)}
function Vc(a,b,c,d,e){if(null==a)return"";b=b||"&";c=c||",$";"string"==typeof c&&(c=c.split(""));if(a instanceof Array){if(d=d||0,d<c.length){const f=[];for(let g=0;g<a.length;g++)f.push(Vc(a[g],b,c,d+1,e));return f.join(c[d])}}else if("object"==typeof a)return e=e||0,2>e?encodeURIComponent(Uc(a,b,c,d,e+1)):"...";return encodeURIComponent(String(a))}function Wc(a){let b=1;for(const c in a.h)b=c.length>b?c.length:b;return 3997-b-a.i.length-1}
function Xc(a,b,c){b=b+"//pagead2.googlesyndication.com"+c;let d=Wc(a)-c.length;if(0>d)return"";a.g.sort(function(f,g){return f-g});c=null;let e="";for(let f=0;f<a.g.length;f++){const g=a.g[f],h=a.h[g];for(let l=0;l<h.length;l++){if(!d){c=null==c?g:c;break}let k=Uc(h[l],a.i,",$");if(k){k=e+k;if(d>=k.length){d-=k.length;b+=k;e=a.i;break}c=null==c?g:c}}}a="";null!=c&&(a=e+"trn="+c);return b+a}class Yc{constructor(){this.i="&";this.h={};this.l=0;this.g=[]}};function Zc(){var a=$c,b=window.google_srt;0<=b&&1>=b&&(a.g=b)}function ad(a,b,c,d=!1,e){if((d?a.g:Math.random())<(e||.01))try{let f;c instanceof Yc?f=c:(f=new Yc,vc(c,(h,l)=>{var k=f;const n=k.l++;h=Tc(l,h);k.g.push(n);k.h[n]=h}));const g=Xc(f,a.h,"/pagead/gen_204?id="+b+"&");g&&Dc(p,g)}catch(f){}}class bd{constructor(){this.h="http:"===V.location.protocol?"http:":"https:";this.g=Math.random()}};let cd=null;function dd(){const a=p.performance;return a&&a.now&&a.timing?Math.floor(a.now()+a.timing.navigationStart):Date.now()}function ed(){const a=p.performance;return a&&a.now?a.now():null};class fd{constructor(a,b){var c=ed()||dd();this.label=a;this.type=b;this.value=c;this.duration=0;this.uniqueId=Math.random();this.taskId=this.slotId=void 0}};const W=p.performance,gd=!!(W&&W.mark&&W.measure&&W.clearMarks),hd=ma(()=>{var a;if(a=gd){var b;if(null===cd){cd="";try{a="";try{a=p.top.location.hash}catch(c){a=p.location.hash}a&&(cd=(b=a.match(/\bdeid=([\d,]+)/))?b[1]:"")}catch(c){}}b=cd;a=!!b.indexOf&&0<=b.indexOf("1337")}return a});function id(a){a&&W&&hd()&&(W.clearMarks(`goog_${a.label}_${a.uniqueId}_start`),W.clearMarks(`goog_${a.label}_${a.uniqueId}_end`))}
class jd{constructor(){var a=window;this.h=[];this.i=a||p;let b=null;a&&(a.google_js_reporting_queue=a.google_js_reporting_queue||[],this.h=a.google_js_reporting_queue,b=a.google_measure_js_timing);this.g=hd()||(null!=b?b:1>Math.random())}start(a,b){if(!this.g)return null;a=new fd(a,b);b=`goog_${a.label}_${a.uniqueId}_start`;W&&hd()&&W.mark(b);return a}end(a){if(this.g&&"number"===typeof a.value){a.duration=(ed()||dd())-a.value;var b=`goog_${a.label}_${a.uniqueId}_end`;W&&hd()&&W.mark(b);!this.g||
2048<this.h.length||this.h.push(a)}}};function kd(a){let b=a.toString();a.name&&-1==b.indexOf(a.name)&&(b+=": "+a.name);a.message&&-1==b.indexOf(a.message)&&(b+=": "+a.message);if(a.stack){a=a.stack;var c=b;try{-1==a.indexOf(c)&&(a=c+"\n"+a);let d;for(;a!=d;)d=a,a=a.replace(RegExp("((https?:/..*/)[^/:]*:\\d+(?:.|\n)*)\\2"),"$1");b=a.replace(RegExp("\n *","g"),"\n")}catch(d){b=c}}return b}
function ld(a,b,c){let d,e;try{a.g&&a.g.g?(e=a.g.start(b.toString(),3),d=c(),a.g.end(e)):d=c()}catch(f){c=!0;try{id(e),c=a.u(b,new Pc(f,{message:kd(f)}),void 0,void 0)}catch(g){a.s(217,g)}if(c){let g,h;null==(g=window.console)||null==(h=g.error)||h.call(g,f)}else throw f;}return d}function md(a,b){var c=nd;return(...d)=>ld(c,a,()=>b.apply(void 0,d))}
class od{constructor(a=null){this.i=$c;this.h=null;this.u=this.s;this.g=a;this.l=!1}pinger(){return this.i}s(a,b,c,d,e){e=e||"jserror";let f;try{const K=new Yc;var g=K;g.g.push(1);g.h[1]=Tc("context",a);b.error&&b.meta&&b.id||(b=new Pc(b,{message:kd(b)}));if(b.msg){g=K;var h=b.msg.substring(0,512);g.g.push(2);g.h[2]=Tc("msg",h)}var l=b.meta||{};b=l;if(this.h)try{this.h(b)}catch(I){}if(d)try{d(b)}catch(I){}d=K;l=[l];d.g.push(3);d.h[3]=l;d=p;l=[];let Ga;b=null;do{var k=d;try{var n;if(n=!!k&&null!=k.location.href)b:{try{Ca(k.foo);
n=!0;break b}catch(I){}n=!1}var m=n}catch(I){m=!1}m?(Ga=k.location.href,b=k.document&&k.document.referrer||null):(Ga=b,b=null);l.push(new Sc(Ga||""));try{d=k.parent}catch(I){d=null}}while(d&&k!=d);for(let I=0,qc=l.length-1;I<=qc;++I)l[I].depth=qc-I;k=p;if(k.location&&k.location.ancestorOrigins&&k.location.ancestorOrigins.length==l.length-1)for(m=1;m<l.length;++m){var E=l[m];E.url||(E.url=k.location.ancestorOrigins[m-1]||"",E.S=!0)}var L=l;let db=new Sc(p.location.href,!1);k=null;const eb=L.length-
1;for(E=eb;0<=E;--E){var M=L[E];!k&&Qc.test(M.url)&&(k=M);if(M.url&&!M.S){db=M;break}}M=null;const Ed=L.length&&L[eb].url;0!=db.depth&&Ed&&(M=L[eb]);f=new Rc(db,M);if(f.h){L=K;var P=f.h.url||"";L.g.push(4);L.h[4]=Tc("top",P)}var fb={url:f.g.url||""};if(f.g.url){var gb=f.g.url.match(ic),ia=gb[1],rc=gb[3],sc=gb[4];P="";ia&&(P+=ia+":");rc&&(P+="//",P+=rc,sc&&(P+=":"+sc));var tc=P}else tc="";ia=K;fb=[fb,{url:tc}];ia.g.push(5);ia.h[5]=fb;ad(this.i,e,K,this.l,c)}catch(K){try{ad(this.i,e,{context:"ecmserr",
rctx:a,msg:kd(K),url:f&&f.g.url},this.l,c)}catch(Ga){}}return!0}};class pd{};let $c,nd;const X=new jd;var qd=()=>{window.google_measure_js_timing||(X.g=!1,X.h!=X.i.google_js_reporting_queue&&(hd()&&Array.prototype.forEach.call(X.h,id,void 0),X.h.length=0))};(a=>{$c=null!=a?a:new bd;"number"!==typeof window.google_srt&&(window.google_srt=Math.random());Zc();nd=new od(X);nd.h=b=>{const c=Gc;0!==c&&(b.jc=String(c),b.shv=Hc(c))};nd.l=!0;"complete"==window.document.readyState?qd():X.g&&T(window,"load",()=>{qd()})})();
var Y=(a,b)=>md(a,b),rd=a=>{var b=pd,c="R";b.R&&b.hasOwnProperty(c)||(c=new b,b.R=c);b=[];!a.eid&&b.length&&(a.eid=b.toString());ad($c,"gdn-asoch",a,!0)};function sd(a=window){return a};var td=(a,b)=>{b=O(a,2)||b;if(!b)return"";if(Q(a,13))return b;const c=/[?&]adurl=([^&]+)/.exec(b);if(!c)return b;const d=[b.slice(0,c.index+1)];Hb(a,4).forEach((e,f)=>{d.push(encodeURIComponent(f)+"="+encodeURIComponent(e)+"&")});d.push(b.slice(c.index+1));return d.join("")},ud=(a,b=[])=>{b=0<b.length?b:Oc("data-asoch-targets");a=Hb(a,1,Xb);const c=[];for(let h=0;h<b.length;++h){var d=b[h].getAttribute("data-asoch-targets"),e=d.split(","),f=!0;for(let l of e)if(!a.has(l)){f=!1;break}if(f){f=a.get(e[0]);
for(d=1;d<e.length;++d){var g=a.get(e[d]);f=Cb(f).toJSON();g=g.toJSON();const l=Math.max(f.length,g.length);for(let k=0;k<l;++k)null==f[k]&&(f[k]=g[k]);f=new Xb(f)}e=Hb(f,4);null!=G(f,5,!1)&&e.set("nb",Fb(f,5,0).toString());c.push({element:b[h],data:f})}else rd({type:1,data:d})}return c},wd=(a,b,c,d)=>{c=td(b,c);if(0!==c.length){var e=pc(c,"ase");if("1"===e||"2"===e){if(609===d)var f=4;else{var g;f=(null==(g=U.featurePolicy)?0:g.allowedFeatures().includes("attribution-reporting"))?6:5}"1"===e?(g=
Z(c,"asr","1"),a.setAttribute("attributionsrc",g),c=Z(c,"nis",f.toString())):"2"===e&&(vd(c)?(f=Z(ca(new ea({url:c})),"nis",f.toString()),a.setAttribute("attributionsrc",f)):(a.setAttribute("attributionsrc",""),c=Z(c,"nis",f.toString())))}na(a,Mc(c,Nc(d)));a.target||(a.target=null!=G(b,11)?O(b,11):"_top")}},xd=a=>{for(const b of a)if(a=b.data,"A"==b.element.tagName&&!Q(a,1)){const c=b.element;wd(c,a,c.href,609)}},vd=a=>!/[?&]dsh=1(&|$)/.test(a)&&/[?&]ae=1(&|$)/.test(a),yd=a=>{const b=p.oneAfmaInstance;
if(b)for(const c of a)if((a=c.data)&&void 0!==J(a,Zb,8)){const d=O(N(a,Zb,8),4);if(d){b.fetchAppStoreOverlay(d,void 0,O(N(a,Zb,8),6));break}}},zd=(a,b=500)=>{const c=[],d=[];for(var e of a)(a=e.data)&&void 0!==J(a,S,12)&&(d.push(N(a,S,12)),c.push(N(a,S,12).D()));e=(f,g)=>{if(g)for(const h of d)g[h.D()]&&h.T(!0)};a=p.oneAfmaInstance;for(const f of c){let g;null==(g=a)||g.canOpenAndroidApp(f,e,()=>{},b)}},Bd=(a,b,c,d,e)=>{if(!b||void 0===J(b,Zb,8))return!1;const f=N(b,Zb,8);let g=O(f,2);Hb(b,10).forEach((l,
k)=>{var n=g;k=encodeURIComponent(k);const m=encodeURIComponent(l);l=new RegExp("[?&]"+k+"=([^&]+)");const E=l.exec(n);console.log(E);k=k+"="+m;g=E?n.replace(l,E[0].charAt(0)+k):n.replace("?","?"+k+"&")});Ad(b)&&Q(b,15)&&!/[?&]label=/.test(c)&&(c=Z(c,"label","deep_link_fallback"));b=l=>d.openStoreOverlay(l,void 0,O(f,6));const h=l=>Fc(V,l);return d.redirectForStoreU2({clickUrl:c,trackingUrl:O(f,3),finalUrl:g,pingFunc:e?h:d.click,openFunc:(null==a?0:Q(a,1))?b:d.openIntentOrNativeApp})},Dd=(a,b,c,d,
e,f,g,h=!1)=>{e=Q(e,15);const l=vd(f);!a||!b||e&&l||(f=h?Cd(f):Cd(f,g.click));f&&f.startsWith("intent:")?g.openIntentOrNativeApp(f):c?d?g.openBrowser(f):g.openChromeCustomTab(f):g.openSystemBrowser(f,{useFirstPackage:!0,useRunningProcess:!0})},Cd=(a,b=null)=>{if(null!==b){const c=new ea({url:a});if(c.h&&c.i||c.s)return b(ca(c)),da(c,1)}else return{U:b}={},b=new ea({url:a,U:b}),b.h&&b.i||b.s?navigator.sendBeacon?navigator.sendBeacon(ca(b),"")?da(b,1):da(b,2):da(b,0):a;return a},Fd=(a,b=!0,c=!1)=>{let d=
!1;c&&V.navigator&&V.navigator.sendBeacon&&(d=V.navigator.sendBeacon(a));d||(b&&V.fetch?V.fetch(a,{method:"GET",keepalive:!0,mode:"no-cors"}).then(e=>{e.ok||Dc(V,a)}):Dc(V,a))},Z=(a,b,c)=>{b=encodeURIComponent(String(b));c=encodeURIComponent(String(c));return a.replace("?","?"+b+"="+c+"&")},Ad=a=>{for(const b of Jb(a,Yb,7))if(3===Fb(b,1,0)&&O(b,2))return!0;return!1};function Gd(a,b){return H(a,2,b)}function Hd(a,b){return H(a,3,b)}function Id(a,b){return H(a,4,b)}function Jd(a,b){return H(a,5,b)}function Kd(a,b){return H(a,9,b)}function Ld(a,b){return Kb(a,10,b)}function Md(a,b){return H(a,11,b)}function Nd(a,b){return H(a,1,b)}function Od(a,b){return H(a,7,b)}var Qd=class extends R{constructor(){super(void 0,-1,Pd)}},Rd=class extends R{constructor(){super()}},Pd=[10,6];const Sd="platform platformVersion architecture model uaFullVersion bitness fullVersionList wow64".split(" ");function Td(a){let b;return null!=(b=a.google_tag_data)?b:a.google_tag_data={}}function Ud(a){let b,c;return"function"===typeof(null==(b=a.navigator)?void 0:null==(c=b.userAgentData)?void 0:c.getHighEntropyValues)}
function Vd(){var a=window;if(!Ud(a))return null;const b=Td(a);if(b.uach_promise)return b.uach_promise;a=a.navigator.userAgentData.getHighEntropyValues(Sd).then(c=>{null!=b.uach||(b.uach=c);return c});return b.uach_promise=a}
function Wd(a){let b;return Md(Ld(Jd(Gd(Nd(Id(Od(Kd(Hd(new Qd,a.architecture||""),a.bitness||""),a.mobile||!1),a.model||""),a.platform||""),a.platformVersion||""),a.uaFullVersion||""),(null==(b=a.fullVersionList)?void 0:b.map(c=>{var d=new Rd;d=H(d,1,c.brand);return H(d,2,c.version)}))||[]),a.wow64||!1)}function Xd(){let a,b;return null!=(b=null==(a=Vd())?void 0:a.then(c=>Wd(c)))?b:null};function Yd(a){for(const b of a)if("A"==b.element.tagName){a=b.element;const c=b.data;null==G(c,2)&&H(c,2,a.href)}}function Zd(a,b){return la(a,c=>c.element===b)}function $d(a){Ac(Y(556,()=>{new ae(a||{})}))}
function be(a,b,c,d){if(!Q(d,13)){var e=c.href;var f=/[?&]adurl=([^&]+)/.exec(e);e=f?[e.slice(0,f.index),e.slice(f.index)]:[e,""];for(na(c,Mc(e[0],Nc(557)));!c.id;)if(f="asoch-id-"+hc(),!U.getElementById(f)){c.id=f;break}f=c.id;"function"===typeof window.xy&&window.xy(b,c,U.body);"function"===typeof window.mb&&window.mb(c);"function"===typeof window.bgz&&window.bgz(f);"function"===typeof window.ja&&window.ja(f,d?Fb(d,5,0):0);"function"===typeof window.vti&&window.vti(f);a.s&&"function"===typeof window.ss&&
(a.O?window.ss(f,1,a.s):window.ss(a.s,1));0<e.length&&(a=0<a.H.length&&(null==d||null==G(d,19))?c.href+"&uach="+encodeURIComponent(a.H)+e[1]:c.href+e[1],na(c,Mc(a,Nc(557))))}}async function ce(a,b,c,d){let e="";var f=p.oneAfmaInstance;if(f&&(b.preventDefault(),e=await f.appendClickSignalsAsync(c.href)||"",a.L&&(f=await f.getNativeClickMeta()))){if(f.customClickGestureEligible)return;e=Z(e,"nas",f.encodedNas)}de(a,b,c,d,e)}
function de(a,b,c,d,e){const f=Q(a.h,2),g=f&&300<Date.now()-a.N,h=p.oneAfmaInstance;h?(wc(b),(()=>{let l=h.logScionEventAndAddParam(e);if(!a.G&&d&&void 0!==J(d,S,12)){var k=N(d,S,12).D();if(0<Jb(d,Yb,7).length)for(const n of Jb(d,Yb,7));Q(N(d,S,12),2)?(h.click(l),h.openAndroidApp(k),k=!0):k=!1}else k=!1;k||Bd(a.u,d,l,h,a.X)||Dd(f,g,a.Z,a.G,d,l,h,a.Y)})()):(Q(a.h,21)&&c.href&&"_blank"!==c.target&&(a.l=pc(c.href,"ai")||"")&&(a.i="clicked"),b=window,a.W&&b.pawsig&&"function"===typeof b.pawsig.clk?b.pawsig.clk(c):
g&&(b="2"===pc(c.href,"ase")&&vd(c.href)?Cd(c.href,()=>{}):a.aa?Cd(c.href,l=>{V.fetch(l,{method:"GET",keepalive:!0,mode:"no-cors"})}):Cd(c.href),b!==c.href&&na(c,Mc(b,Nc(599)))));g&&(a.N=Date.now());Jc(a.M)}
var ae=class{constructor(a){this.G=Fa||Da||Ha||Ea;var b=Oc("data-asoch-meta");if(1!==b.length)rd({type:2,data:b.length});else{this.M=70;this.h=new ac(JSON.parse(b[0].getAttribute("data-asoch-meta"))||[]);this.K=a["extra-meta"]?new ac(JSON.parse(a["extra-meta"])):null;this.L="true"===a["is-fsn"];this.u=a["ios-store-overlay-config"]?new bc(JSON.parse(a["ios-store-overlay-config"])):null;this.Z="true"===a["use-cct-over-browser"];this.X="true"===a["send-ac-click-ping-by-js"];this.P="true"===a["correct-redirect-url-for-och-15-click"];
this.Y="true"===a["send-click-ping-by-js-in-och"];this.W="true"===a["enable-paw"];this.aa="true"===a["async-using-fetch"];this.H=this.i=this.l="";b=Xd();null!=b&&b.then(d=>{d=Sb(d);for(var e=[],f=0,g=0;g<d.length;g++){var h=d.charCodeAt(g);255<h&&(e[f++]=h&255,h>>=8);e[f++]=h}this.H=Ka(e,3)});this.g=ud(this.h);this.ba=Number(a["deeplink-and-android-app-validation-timeout"])||500;this.N=-Infinity;this.s=O(this.h,5)||"";this.O=Q(this.h,11);this.K&&(this.O=Q(this.K,11));this.J=this.I=null;Q(this.h,3)||
(xd(this.g),H(this.h,3,!0));Yd(this.g);a=p.oneAfmaInstance;!this.G&&a&&zd(this.g,this.ba);var c;if(a&&(null==(c=this.u)?0:Q(c,2)))switch(c=()=>{const d=Lb(G(this.u,4),0);0<d?p.setTimeout(()=>{yd(this.g)},d):yd(this.g)},Fb(this.u,3,0)){case 1:a.runOnOnShowEvent(c);break;case 2:Bc(c);break;default:yd(this.g)}T(U,"click",Y(557,d=>{a:if(!d.defaultPrevented||this.I===d){for(var e,f,g=d.target;(!e||!f)&&g;){f||"A"!=g.tagName||(f=g);var h=g.hasAttribute("data-asoch-targets"),l=g.hasAttribute("data-asoch-fixed-value");
if(!e)if(l)e=new Xb(JSON.parse(g.getAttribute("data-asoch-fixed-value"))||[]);else if("A"==g.tagName||h)if(h=h&&"true"===g.getAttribute("data-asoch-is-dynamic")?ud(this.h,[g]):this.g,h=Zd(h,g))e=h.data;g=g.parentElement}if(g=e&&!Q(e,1)){if(d.defaultPrevented){var k=f;if(this.I===d&&this.J){var n=new Ub(this.J);f=O(e,9);var m="";switch(Fb(n,4,1)){case 2:if(Lb(G(n,2),0))m="blocked_fast_click";else if(O(n,1)||O(n,7))m="blocked_border_click";break;case 3:m=U,m=m.getElementById?m.getElementById("common_15click_anchor"):
null,"function"===typeof window.copfcChm&&m&&(e=Cb(e),H(e,5,12),Hb(e,4).set("nb",(12).toString()),(g=Zd(this.g,m))?g.data=e:this.g.push({element:m,data:e}),!this.P&&k&&(be(this,d,k,e),H(e,2,k.href)),window.copfcChm(d,td(e,m.href),null,void 0!==J(n,Vb,10)?Sb(N(n,Vb,10)):null),this.P&&be(this,d,m,e)),m="onepointfiveclick_first_click"}f&&m&&Fd(f+"&label="+m,!1);Jc(this.M)}break a}h=e;for(m of Eb(h,6))Fd(m)}if(f&&g){e=g?e:null;(m=Zd(this.g,f))?m=m.data:(m=new Xb,H(m,2,f.href),H(m,11,f.target||"_top"),
this.g.push({element:f,data:m}));wd(f,e||m,O(m,2),557);be(this,d,f,e);for(n of Eb(this.h,17))m=n,g=U.body,h={},"function"===typeof window.CustomEvent?l=new CustomEvent(m,h):(l=document.createEvent("CustomEvent"),l.initCustomEvent(m,!!h.bubbles,!!h.cancelable,h.detail)),g.dispatchEvent(l);if(null==e?0:null!=G(e,19))n=O(e,19),m=null!=G(e,20,!1)?Lb(G(e,20),0):null,g=this.H,h=sd(p),l=new cc,H(l,1,n),null!==m&&H(l,2,m),null!==g&&H(l,3,g),null==h||null==(k=h.fence)||k.reportEvent({eventType:"click",eventData:JSON.stringify(l),
destination:["buyer"]});Q(this.h,16)||this.L?ce(this,d,f,e):(k="",(n=p.oneAfmaInstance)&&(k=n.appendClickSignals(f.href)),de(this,d,f,e,k))}}}),dc);!a&&Q(this.h,21)&&(T(V,"pagehide",Y(1037,()=>{this.l&&this.i&&(this.i+="+pagehide")})),T(U,"visibilitychange",Y(1067,()=>{if("visible"===U.visibilityState)this.l=this.i="";else if("hidden"===U.visibilityState&&this.i&&this.l){var d={id:"visibilityhidden",payload:this.i,isios:this.G,clickstring:this.l};var e=hc();e=null!=e?"="+encodeURIComponent(String(e)):
"";e=lc("https://pagead2.googlesyndication.com/pagead/gen_204","zx"+e);Fd(uc(e,d),!1,!0)}})));this.s&&"function"===typeof window.ss&&T(U.body,"mouseover",Y(626,()=>{window.ss(this.s,0)}),ec);"function"===typeof window.ivti&&window.ivti(window);c=window;c.googqscp&&"function"===typeof c.googqscp.registerCallback&&c.googqscp.registerCallback((d,e)=>{this.I=d;this.J=e})}}};var ee=Y(555,a=>$d(a));Gc=70;const fe=Ic(70,document.currentScript);if(null==fe)throw Error("JSC not found 70");const ge={},he=fe.attributes;for(let a=he.length-1;0<=a;a--){const b=he[a].name;0===b.indexOf("data-jcp-")&&(ge[b.substring(9)]=he[a].value)}ee(ge);}).call(this);