try {
    
    __adroll.load_adroll_tpc(__adroll.render_advertisable_cell);
}
catch(e) {}

try {
        function __adroll__(){this.version="2.0";this.exp=8760;this.eexp=720;this.pv=1E11*Math.random();this.__adc="__ar_v4";this._loaded=this._broken=!1;this._url=2E3;this._kwl=300;this._r={};this._logs=[];this.cm_urls=[];this.consent_networks={facebook:"f",linkedin:"linkedin"};this.pixelstart=this.session_time=0;this._init_idb();this._init_floc_trial();for(var a=Array(4),b=0;b<a.length;b++)a[b]=(Math.round(1E11*Math.random()).toString(16)+Array(9).join("0")).substr(0,8);this._set_global("adroll_sid",a.join(""));
this._has_global("adroll_adv_id")&&(this.load_experiment_js(),this.init_pixchk(),this.trigger_gtm_consent_event(),this.load_pixel_assistant(),["adroll_adv_id","adroll_pix_id"].forEach(function(a){window.hasOwnProperty(a)&&("string"===typeof window[a]||window[a]instanceof String)&&(window[a]=window[a].replace(/[^A-Z0-9_]/g,""))}));window.adroll=window.adroll||{};window.adroll.identify_email=this.identify_email.bind(this);this.is_under_experiment("pixel_timing")&&this._pixel_timing(!0,!0,null)};__adroll__.prototype.call_consent_check=function(){function a(){var a=["_s="+b.get_adroll_sid(),"_b=2"];"#_ar_gdpr="===(window.location.hash||"").substr(0,10)&&a.push("dbg="+unescape((window.location.hash||"").substr(10)));window.adroll_fpconsent&&a.push("_afc=1");a=b._srv("/consent/check/"+b._global("adroll_adv_id")+"?"+a.join("&"));b.add_script_element(a)}var b=this;this._is_defined(window.adroll_fpconsent)?a():window.setTimeout(a,100)};
__adroll__.prototype.call_consent_write=function(a){window.adroll_fpconsent&&(a+="&_afc=1");this.add_script_element(this._srv("/consent/write?"+a))};__adroll__.prototype._consent_cookie=function(a){return a?(this.set("__adroll_consent",a,8760),a):this.get("__adroll_consent")};__adroll__.prototype.load_consent_banner=function(){window.document.getElementById("__adroll_consent_banner_el")||this.add_script_element("s.adroll.com/j/consent_tcfv2.js",{id:"__adroll_consent_banner_el"})};
__adroll__.prototype.get_consent_params=function(){return this.get("__adroll_consent_params")};__adroll__.prototype.set_consent_params=function(a){this.set("__adroll_consent_params",a)};__adroll__.prototype.clear_consent_params=function(){this.del("__adroll_consent_params")};__adroll__.prototype.handle_null_consent=function(a){a||(a=this.get_consent_params())&&this.call_consent_write(a)};
__adroll__.prototype.save_first_party_consent=function(a){var b=(a||{}).euconsent;if((a=(a||{}).arconsent)||b)this._consent_cookie(a),window.localStorage.setItem("__adroll_consent_data",this.jsonStringify({arconsent:a,euconsent:b}))};
__adroll__.prototype.get_first_party_consent=function(){if(this._has_global("__adroll_consent_data"))return this._global("__adroll_consent_data");var a=null;try{if(window.localStorage){var b=window.localStorage.getItem("__adroll_consent_data");b&&(a=this.jsonParse(b))}}catch(c){}if(b=this._consent_cookie())a=a||{},a.arconsent=b;this._set_global("__adroll_consent_data",a);return a};
__adroll__.prototype.trigger_gtm_consent_event=function(a){function b(a,b,c){b=isNaN(Number(b))?"c:"+b:"tcf:"+b;!0!==c&&!1!==c&&(c="unknown");a[c][b]=1}function c(a){return","+k.object_keys(a).join(",")+","}if(!window.dataLayer||"function"===typeof window.dataLayer.push)if(window.dataLayer=window.dataLayer||[],a){var d=this._global("__adroll_consent"),e=this._global("__adroll_consent_data")||{},n=e.eucookie||{},p=n.max_vendor_id||e.max_vendor_id||0,m=e.networks||[],l=n.purposes_allowed||0,h={"true":{},
"false":{},unknown:{}},g={"true":{},"false":{},unknown:{}},f={"true":{},"false":{}},k=this,q;if("boolean"===typeof d){for(q=0;q<m.length;q++)b(h,m[q],d);for(q=1;q<p;q++)b(h,q,d),b(g,q,d);for(q=1;25>q;q++)f[d][q]=1}else{for(q in d)d.hasOwnProperty(q)&&b(h,q,d[q]);for(q=1;q<=p;q++)b(g,q,(n.vendor_consent||{})[q]);for(q=0;24>q;q++)f[!!(l&1<<q)][q+1]=1}window.dataLayer.push({event:a,nextrollVendorsConsent:c(h["true"]),nextrollVendorsConsentUnknown:c(h.unknown),nextrollVendorsConsentDenied:c(h["false"]),
nextrollVendorsRawConsent:c(g["true"]),nextrollVendorsRawConsentUnknown:c(g.unknown),nextrollVendorsRawConsentDenied:c(g["false"]),nextrollPurposesConsent:c(f["true"]),nextrollPurposesConsentUnknown:null,nextrollPurposesConsentDenied:c(f["false"]),nextrollgdpr:this._global("__adroll_consent_is_gdpr"),nextrolliab:e.euconsent})}else window.dataLayer.push({event:"nextroll-ready"})};
__adroll__.prototype.set_consent=function(a,b,c,d,e,n){if(0===arguments.length){if(!this._has_global("__adroll_consent"))return;a=this._global("__adroll_consent")}var p="nextroll-consent";this._has_global("__adroll_consent")&&(p="nextroll-consent-modified");this._set_global("__adroll_consent",a);this._set_global("__adroll_consent_is_gdpr",c);this._set_global("__adroll_consent_data",n||{});d&&this._set_global("__adroll_consent_user_country",d);e&&this._set_global("__adroll_consent_adv_country",e);
c&&("adroll"===(n||{}).banner||b)&&this.load_consent_banner();null===a?this.handle_null_consent(b):(this.save_first_party_consent(n),b||this.clear_consent_params(),this._install_cmp&&this._install_cmp(),this._trigger_consent_event&&this._trigger_consent_event(),!1!==a&&!1!==(a||{}).a&&(this._log_floc_cohort(),this._sync_fpid(),this.trigger_gtm_consent_event(p),this._load_black_crow(),this.call_next_tpc()))};
__adroll__.prototype._load_precheck_js=function(){this.add_script_element("https://s.adroll.com/j/pre/"+window.adroll_adv_id+"/"+window.adroll_pix_id+"/fpconsent.js")};__adroll__.prototype.cookieEnabled=function(){if(this._broken)return!1;this.set("_te_","1");return"1"===this.get("_te_")?(this.del("_te_"),!0):!1};__adroll__.prototype.get=function(a){var b=window.document.cookie;if(null===b)return this._broken=!0,null;var c;0>b.indexOf(a+"=")?b=null:(a=b.indexOf(a+"=")+a.length+1,c=b.indexOf(";",a),-1===c&&(c=b.length),b=b.substring(a,c),b=""===b?null:window.unescape(b));return b};
__adroll__.prototype.set=function(a,b,c){var d;c&&"number"===typeof c?(d=new Date,d.setTime(d.getTime()+36E5*c),c=d.toGMTString(),c="; expires="+c):c="";d="; domain="+window.location.hostname;b=window.escape(b);window.document.cookie=a+"="+b+c+"; path=/"+d+"; samesite=lax"};__adroll__.prototype.del=function(a){this.set(a,"",-8760)};
__adroll__.prototype.check_cookie=function(a,b){for(var c=a.split("|"),d=c.length-1;0<=d;d--)if(c[d]){var e=c[d].split(":");b===e[0]&&(e[2]=""+(parseInt(e[2])+1),c[d]=e.join(":"))}return c.join("|")};__adroll__.prototype.handle=function(a){var b=this.get(this.__adc)||"";-1!==b.indexOf(a)?this.set(this.__adc,this.check_cookie(b,a),this.exp):(a=[b,[a,this.get_date(this.eexp),"1"].join(":")].join("|"),this.set(this.__adc,a,this.exp))};
__adroll__.prototype.expire_old=function(){for(var a=this.get_date(!1),b=this.get(this.__adc),b=b?b.split("|"):[""],c=[],d=b.length-1;0<=d;d--)b[d]&&""!==b[d]&&b[d].split(":")[1]>a&&c.push(b[d]);this.set(this.__adc,c.join("|"),this.exp)};__adroll__.prototype.get_date=function(a){var b=new Date;a&&b.setTime(b.getTime()+36E5*a);a=""+b.getUTCFullYear();var c=b.getUTCMonth(),c=10<=c?c:"0"+c,b=b.getUTCDate();return[a,c,10<=b?b:"0"+b].join("")};
__adroll__.prototype.set_pixel_cookie=function(a,b){this.handle(a);this.handle(b);this.pixel_loaded()};__adroll__.prototype.consent_allowed=function(a){var b=this._global("__adroll_consent");return"object"===typeof b?b[a]:b};__adroll__.prototype.listenToEvent=function(a,b,c){a.addEventListener?a.addEventListener(b,this.wrapException(c),!1):a.attachEvent("on"+b,this.wrapException(c))};__adroll__.prototype._head=function(){return(window.document.getElementsByTagName("head")||[null])[0]||(window.document.getElementsByTagName("body")||[null])[0]||window.document.getElementsByTagName("script")[0].parentNode};__adroll__.prototype._body=function(){return window.document.body||(window.document.getElementsByTagName("body")||[null])[0]};
__adroll__.prototype.runCookieMatch=function(){var a=this.cm_urls.length;if(!(0>=a))for(var b=0;b<=a;b++)this.popAndSend()};__adroll__.prototype.matchesSelector=function(a,b){var c=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.msMatchesSelector||a.oMatchesSelector;return c&&c.call(a,b)};__adroll__.prototype.popAndSend=function(){if(!(0>=this.cm_urls.length)){var a=this.cm_urls.shift(),b=new Image;b.src=a;b.setAttribute("alt","")}};
__adroll__.prototype.add_param_to_url=function(a,b){var c=a.indexOf("?"),d="",e="";-1!==c?(d=a.slice(0,c+1),e="&"+a.slice(c+1)):(c=a.indexOf("#",-1===c?0:c),-1===c?d=a+"?":(d=a.slice(0,c)+"?",e=a.slice(c)));return d+b+e};
__adroll__.prototype._init_idb=function(){function a(){return b._adroll_idb.transaction("adroll","readwrite").objectStore("adroll")}var b=this,c=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(c&&!this._adroll_idb){this._adroll_idb=!0;var d=c.open("adroll",1);d.onupgradeneeded=function(){b._adroll_idb=d.result;b._adroll_idb.createObjectStore("adroll",{keyPath:"id"});b._adroll_idb.getStore=a};d.onsuccess=function(){b._adroll_idb=d.result;b._adroll_idb.getStore=
a};d.onblocked=function(){b._adroll_idb=null}}};__adroll__.prototype._get_idb_row=function(a,b,c){var d=this;if(this._adroll_idb)if(!0===this._adroll_idb)5>c?window.setTimeout(this._get_idb_row.call(this,a,b,(c||1)+1),100):b&&b.call(d,null);else{var e=b,n=window.setTimeout(function(){e&&e.call(d,null)},1E3);this._adroll_idb.getStore().get(a).onsuccess=function(){e=null;window.clearTimeout(n);b&&b.call(d,this.result)}}else b.call(this,null)};
__adroll__.prototype._set_idb_row=function(a,b,c){if("object"!==typeof b)throw Error("Row must be object");this._adroll_idb&&(!0===this._adroll_idb?5>c&&window.setTimeout(this._set_idb_row.call(this,a,b,(c||1)+1),100):(b.id=a,this._adroll_idb.getStore().put(b)))};
__adroll__.prototype.closest=function(a,b){if(a.closest)return a.closest(b);if(!b)return null;for(var c=a;null!==c;c=c.parentNode){var d=c.matches||c.webkitMatchesSelector||c.mozMatchesSelector||c.msMatchesSelector||c.oMatchesSelector;if(d&&d.call(c,b))return c}return null};__adroll__.prototype.dyno=function(a,b){if(a){var c=new XMLHttpRequest;c.onreadystatechange=function(){if(c.readyState===c.HEADERS_RECEIVED&&"recordUser"!==a){var d=this.parseDynoResponseHeader(c.getAllResponseHeaders());this._queueAndCallback("dyno",[a,b,d])}}.bind(this);var d={},e;for(e in b)b.hasOwnProperty(e)&&(d[e]="object"===typeof b[e]?this.jsonStringify(b[e]):b[e]);d=this.get_segment_path(this._global("adroll_adv_id"),this._global("adroll_pix_id"),d);e=this._srv("/segment"+d);c.open("GET",
e,!0);c.withCredentials=!0;c.send();this.is_ipv6()&&this.imgRequest(this._srv("/seg4"+d,!0))}};__adroll__.prototype.registerDynoCallback=function(a,b){this._registerCallback("dyno",a,b)};
__adroll__.prototype.parseDynoResponseHeader=function(a){var b={};if(!a)return b;a=a.split("\n");for(var c=0,d=a.length;c<d;c++){var e=a[c],n=e.indexOf(":");if(0<n){var p=e.substring(0,n).trim().toLowerCase();this.startsWith(p,"x-")&&(b[p]=e.substring(n+1).trim())}}b&&(b.hasOwnProperty("x-segment-eid")&&(window.adroll_seg_eid=b["x-segment-eid"]),b.hasOwnProperty("x-rule-type")&&(window.adroll_rule_type=b["x-rule-type"]));return b};__adroll__.prototype.is_under_experiment=function(a){return window.adroll_exp_list&&0<=window.adroll_exp_list.indexOf(a)};__adroll__.prototype.load_experiment_js=function(){var a=window.document.getElementById("adroll_scr_exp");return a?a:this.add_script_element("https://s.adroll.com/j/exp/"+window.adroll_adv_id+"/index.js",{id:"adroll_scr_exp",onError:"window.adroll_exp_list = [];"})};__adroll__.prototype.is_experiment_js_loaded=function(){return!!window.adroll_exp_list};
__adroll__.prototype.is_test_advertisable=function(){return"ADV_EID"===this._global("adroll_adv_id")};__adroll__.prototype.if_under_experiment_js=function(a,b,c,d){var e=this;this.load_experiment_js();this.on_experiment_loaded(function(){e.is_under_experiment(a)?"function"===typeof b&&b.call(e):"function"===typeof c&&c.call(e)},d)};
__adroll__.prototype.on_experiment_loaded=function(a,b){function c(){if(e.is_experiment_js_loaded()||e.is_test_advertisable())d=!0;d?a.call(e):window.setTimeout(c,10)}var d=!1,e=this;window.setTimeout(function(){d=!0},b||500);c()};__adroll__.prototype.external_data_to_qs=function(a,b){var c=[];if(!a)return null;for(var d in a)a.hasOwnProperty(d)&&this._is_defined(a[d])&&null!==a[d]&&c.push(this.normalize_var(window.escape(""+d)+"="+window.escape(""+a[d]),!1));c=c.join("&");b&&(c=window.escape(c));return"adroll_external_data="+c};
__adroll__.prototype.get_page_properties=function(){if(this._has_global("adroll_page_properties")){var a=this._global("adroll_page_properties"),b={},c;for(c in a)a.hasOwnProperty(c)&&"undefined"!==a[c]&&(b[c.toLowerCase()]=a[c]);return b}return null};
__adroll__.prototype.parse_conversion_attrs=function(a){if(!a)return null;for(var b={},c=["conv_value","conversion_value"],d=["adroll_currency","currency"],e=0;e<c.length;e++)if(a.hasOwnProperty(c[e])){b.conv_value=a[c[e]];break}for(c=0;c<d.length;c++)if(a.hasOwnProperty(d[c])){b.currency=a[d[c]];break}return 1<=Object.keys(b).length?b:null};
__adroll__.prototype.get_conversion_value=function(a){var b=this._ensure_global("adroll_currency",null),c=this._ensure_global("adroll_conversion_value",null),d=this._ensure_global("adroll_conversion_value_in_dollars",null);return(a=this.parse_conversion_attrs(a))?a:c?{conv_value:""+c,currency:b}:d?{conv_value:""+parseInt(100*d),currency:"USC"}:null};__adroll__.prototype._form_attach=function(){var a=this._form_els_allowed();if(a){var b=[],c;for(c in a)a.hasOwnProperty(c)&&"submit"===a[c].type&&b.push(c);this._adroll_submit_sels=b.join(",");a=window.document.querySelectorAll("input,select,textarea");for(b=0;b<a.length;b++)this._form_data(a[b]);a=this._body();this.listenToEvent(a,"blur",this._form_change.bind(this));this.listenToEvent(a,"change",this._form_change.bind(this));this.listenToEvent(a,"focusout",this._form_change.bind(this));this.listenToEvent(a,
"click",this._form_click.bind(this));this.listenToEvent(a,"submit",this._form_save.bind(this))}};__adroll__.prototype._form_els_allowed=function(){return 0===this.object_keys(this._ensure_global("adroll_form_fields",{})).length?null:this._global("adroll_form_fields")};
__adroll__.prototype._form_el_allowed=function(a){if(!a||!a.type||!this._form_els_allowed())return a._adroll_el_ok=!1;if(this._is_defined(a._adroll_el_ok))return a._adroll_el_ok;var b=a.type.toLowerCase(),c=(a.name||"").toLowerCase(),d=this._form_els_allowed(),e=this._desc_el(a);if("password"===b||"file"===b||c.match(/cc_number|credit_card|card_number|cv[cv]_code/))return a._adroll_el_ok=!1;if(this._is_defined(d.length)){if(0<=d.indexOf(e))return a._adroll_el_ok=!0;for(e=0;e<d.length;e++)if(this.closest(a,
d[e]))return a._adroll_el_ok=!0}else{if(d[e])return a._adroll_el_ok=d[e];for(e in d)if(d.hasOwnProperty(e)&&(b=this.closest(a,e))&&b===a)return a._adroll_el_ok=d[e]}return a._adroll_el_ok=!1};__adroll__.prototype._desc_el=function(a){if(!a)return"";var b=a.tagName.toLowerCase();a.id?b=b+"#"+a.id:a.getAttribute("name")?b=b+'[name="'+a.getAttribute("name")+'"]':a.className&&(b=b+"."+a.className.replace(/ /g,"."));return b};
__adroll__.prototype._form_data=function(a){var b="form"===a.tagName.toLowerCase(),c=this._desc_el(b?a:a.form);this._is_defined(this._adroll_form_data)||(this._adroll_form_data={});this._is_defined(this._adroll_form_data[c])||(this._adroll_form_data[c]={data:{},kind:{}});if(!b){b=this._form_el_allowed(a);if(!b)return null;var d=this._desc_el(a),e=a.value,n=b.auth||0;this._is_defined(a.options)&&this._is_defined(a.selectedIndex)?e=(a.options[a.selectedIndex]||{}).value:"button"===a.tagName.toLowerCase()&&
(e=e||a.textContent);e?(this._adroll_form_data[c].data[d]={val:e,auth:n},b.type&&(this._adroll_form_data[c].kind[b.type]={val:e,auth:n})):(delete this._adroll_form_data[c].data[d],b.type&&delete this._adroll_form_data[c].kind[b.type])}a={data:{},kind:this._adroll_form_data[c].kind};a.data[c]=this._adroll_form_data[c].data;return 0===this.object_keys(a.data[c]).length?null:a};__adroll__.prototype._form_change=function(a){a=a.target;this._form_el_allowed(a)&&this._form_data(a)};
__adroll__.prototype._form_click=function(a){a=a.target;this.closest(a,this._adroll_submit_sels)&&(a=this.closest(a,"form"))&&this._form_save(a)};
__adroll__.prototype._form_save=function(a){var b=this._form_data(a.target);a=this._redact_pci(JSON.stringify(b));b&&(b.kind.email&&b.kind.email.auth&&this.identify_email(b.kind.email.val),b=this._ensure_global("adroll_adv_id",""),b=this._srv("/form/"+b+"?pv="+encodeURIComponent(this.pv)),this._xhr({body:a,headers:{"Content-Type":"application/json"},method:"POST",url:b,withCredentials:!0}))};
__adroll__.prototype._redact_pci=function(a){a=a.split(/([\d\-\.\ ]+)/);for(var b=0;b<a.length;b++)this.is_luhn(a[b])&&(a[b]=" <PCI_REDACTED> ");return a.join("")};__adroll__.prototype._xhr=function(a){a=a||{};var b=new XMLHttpRequest;b.open(a.method||"GET",a.url,!1!==a.async);for(var c in a.headers||{})a.headers.hasOwnProperty(c)&&b.setRequestHeader(c,a.headers[c]);a.withCredentials&&(b.withCredentials=a.withCredentials);b.send(a.body||null)};__adroll__.prototype._has_global=function(a){return this._is_defined(this._global(a))};__adroll__.prototype._global=function(a){return window[a]};__adroll__.prototype._set_global=function(a,b){window[a]=b};__adroll__.prototype._unset_global=function(a){delete window[a]};__adroll__.prototype._ensure_global=function(a,b){this._has_global(a)||this._set_global(a,b);return this._global(a)};__adroll__.prototype.set_first_party_cookie=function(a){if(a=this.get_first_party_cookie()||a)return this.set("__adroll_fpc",a,8766),a;a=this.md5((new Date).getTime()+Math.round(1E11*Math.random())+window.navigator.userAgent.toLowerCase()+window.document.referrer)+"-"+(new Date).getTime();this.set("__adroll_fpc",a,8766);return a};
__adroll__.prototype.get_first_party_cookie=function(){try{var a=this.get("__adroll_fpc");if(a){var b=a.replace("-s2-","-").replace(/-$/,"");if("-"===b.charAt(32)&&b.substr(33).match(/\D/)&&Date.parse){var c=new Date(b.substr(33));if(c&&!isNaN(c.getTime()))return b.substr(0,33)+c.getTime()}return b}}catch(d){}return null};__adroll__.prototype._get_fpid_ls=function(){return window.localStorage.getItem("__adroll_fpc")};
__adroll__.prototype._set_fpid_ls=function(a){window.localStorage.setItem("__adroll_fpc",a)};__adroll__.prototype._get_fpid_idb=function(a){var b=this;this._get_idb_row("__adroll_fpc",function(c){a&&a.call(b,(c||{}).val)})};__adroll__.prototype._set_fpid_idb=function(a){this._set_idb_row("__adroll_fpc",{val:a})};
__adroll__.prototype._sync_fpid=function(){var a=this;this.if_under_experiment_js("fpidexp",function(){var b=a.get_first_party_cookie(),c=a._get_fpid_ls();a._get_fpid_idb(function(d){a._log_pex_event("fpidexp","load","","",{fpc:b||"",lsid:c||"",idbid:d||""});(d=b||c||d)?a.set_first_party_cookie(d):d=a.set_first_party_cookie();a._set_fpid_ls(d);a._set_fpid_idb(d)})},function(){this.set_first_party_cookie()})};__adroll__.prototype.jsonStringify=function(a){this.jsonStringifyFunc||this.initJsonStringify();return this.jsonStringifyFunc(a)};__adroll__.prototype.jsonParse=function(a){var b=this._global("JSON");return"function"===typeof b.parse?b.parse(a):eval("("+a+")")};
__adroll__.prototype.initJsonStringify=function(){var a=this._global("JSON");this.jsonStringifyFunc=a&&a.stringify&&"function"===typeof a.stringify?a.stringify:function(){function a(b){return e[b]||"\\u"+(b.charCodeAt(0)+65536).toString(16).substr(1)}var c=Object.prototype.toString,d=Array.isArray||function(a){return"[object Array]"===c.call(a)},e={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"},n=/[\\"\u0000-\u001F\u2028\u2029]/g;return function m(e){if(null===e)return"null";
if("number"===typeof e)return isFinite(e)?e.toString():"null";if("boolean"===typeof e)return e.toString();if("object"===typeof e){if("function"===typeof e.toJSON)return m(e.toJSON());if(d(e)){for(var h="[",g=0;g<e.length;g++)h+=(g?", ":"")+m(e[g]);return h+"]"}if("[object Object]"===c.call(e)){h=[];for(g in e)e.hasOwnProperty(g)&&h.push(m(g)+": "+m(e[g]));return"{"+h.join(", ")+"}"}}return'"'+e.toString().replace(n,a)+'"'}}()};__adroll__.prototype.serialize=function(a){if(a.length){for(var b=[],c=a.length-1;0<=c;c--)b.push(a[c].join("="));return b.join("&")}return""};__adroll__.prototype.endswith=function(a,b){return-1!==a.indexOf(b,a.length-b.length)};__adroll__.prototype.buildurl=function(a,b){var c=this.serialize(b),d=a.indexOf("?");return c?d===a.length-1?a+c:-1!==d?"&"===a[a.length-1]?a+c:a+"&"+c:a+"?"+c:a};__adroll__.prototype.md5=function(){function a(a,b){var c=(a&65535)+(b&65535);return(a>>16)+(b>>16)+(c>>16)<<16|c&65535}function b(b,c,d,e,f,k){c=a(a(c,b),a(e,k));return a(c<<f|c>>>32-f,d)}function c(a,c,d,e,f,k,n){return b(c&d|~c&e,a,c,f,k,n)}function d(a,c,d,e,f,k,n){return b(c&e|d&~e,a,c,f,k,n)}function e(a,c,d,e,f,k,n){return b(d^(c|~e),a,c,f,k,n)}function n(m,l){var h=m[0],g=m[1],f=m[2],k=m[3],h=c(h,g,f,k,l[0],7,-680876936),k=c(k,h,g,f,l[1],12,-389564586),f=c(f,k,h,g,l[2],17,606105819),g=c(g,
f,k,h,l[3],22,-1044525330),h=c(h,g,f,k,l[4],7,-176418897),k=c(k,h,g,f,l[5],12,1200080426),f=c(f,k,h,g,l[6],17,-1473231341),g=c(g,f,k,h,l[7],22,-45705983),h=c(h,g,f,k,l[8],7,1770035416),k=c(k,h,g,f,l[9],12,-1958414417),f=c(f,k,h,g,l[10],17,-42063),g=c(g,f,k,h,l[11],22,-1990404162),h=c(h,g,f,k,l[12],7,1804603682),k=c(k,h,g,f,l[13],12,-40341101),f=c(f,k,h,g,l[14],17,-1502002290),g=c(g,f,k,h,l[15],22,1236535329),h=d(h,g,f,k,l[1],5,-165796510),k=d(k,h,g,f,l[6],9,-1069501632),f=d(f,k,h,g,l[11],14,643717713),
g=d(g,f,k,h,l[0],20,-373897302),h=d(h,g,f,k,l[5],5,-701558691),k=d(k,h,g,f,l[10],9,38016083),f=d(f,k,h,g,l[15],14,-660478335),g=d(g,f,k,h,l[4],20,-405537848),h=d(h,g,f,k,l[9],5,568446438),k=d(k,h,g,f,l[14],9,-1019803690),f=d(f,k,h,g,l[3],14,-187363961),g=d(g,f,k,h,l[8],20,1163531501),h=d(h,g,f,k,l[13],5,-1444681467),k=d(k,h,g,f,l[2],9,-51403784),f=d(f,k,h,g,l[7],14,1735328473),g=d(g,f,k,h,l[12],20,-1926607734),h=b(g^f^k,h,g,l[5],4,-378558),k=b(h^g^f,k,h,l[8],11,-2022574463),f=b(k^h^g,f,k,l[11],16,
1839030562),g=b(f^k^h,g,f,l[14],23,-35309556),h=b(g^f^k,h,g,l[1],4,-1530992060),k=b(h^g^f,k,h,l[4],11,1272893353),f=b(k^h^g,f,k,l[7],16,-155497632),g=b(f^k^h,g,f,l[10],23,-1094730640),h=b(g^f^k,h,g,l[13],4,681279174),k=b(h^g^f,k,h,l[0],11,-358537222),f=b(k^h^g,f,k,l[3],16,-722521979),g=b(f^k^h,g,f,l[6],23,76029189),h=b(g^f^k,h,g,l[9],4,-640364487),k=b(h^g^f,k,h,l[12],11,-421815835),f=b(k^h^g,f,k,l[15],16,530742520),g=b(f^k^h,g,f,l[2],23,-995338651),h=e(h,g,f,k,l[0],6,-198630844),k=e(k,h,g,f,l[7],
10,1126891415),f=e(f,k,h,g,l[14],15,-1416354905),g=e(g,f,k,h,l[5],21,-57434055),h=e(h,g,f,k,l[12],6,1700485571),k=e(k,h,g,f,l[3],10,-1894986606),f=e(f,k,h,g,l[10],15,-1051523),g=e(g,f,k,h,l[1],21,-2054922799),h=e(h,g,f,k,l[8],6,1873313359),k=e(k,h,g,f,l[15],10,-30611744),f=e(f,k,h,g,l[6],15,-1560198380),g=e(g,f,k,h,l[13],21,1309151649),h=e(h,g,f,k,l[4],6,-145523070),k=e(k,h,g,f,l[11],10,-1120210379),f=e(f,k,h,g,l[2],15,718787259),g=e(g,f,k,h,l[9],21,-343485551);m[0]=a(h,m[0]);m[1]=a(g,m[1]);m[2]=
a(f,m[2]);m[3]=a(k,m[3])}var p="0123456789abcdef".split("");return function(a){var b=a;/[\x80-\xFF]/.test(b)&&(b=unescape(encodeURI(b)));var c=b.length;a=[1732584193,-271733879,-1732584194,271733878];var d;for(d=64;d<=b.length;d+=64){for(var e=b.substring(d-64,d),k=[],q=void 0,q=0;64>q;q+=4)k[q>>2]=e.charCodeAt(q)+(e.charCodeAt(q+1)<<8)+(e.charCodeAt(q+2)<<16)+(e.charCodeAt(q+3)<<24);n(a,k)}b=b.substring(d-64);e=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(d=0;d<b.length;d++)e[d>>2]|=b.charCodeAt(d)<<(d%
4<<3);e[d>>2]|=128<<(d%4<<3);if(55<d)for(n(a,e),d=0;16>d;d++)e[d]=0;e[14]=8*c;n(a,e);for(b=0;b<a.length;b++){c=a;d=b;e=a[b];k="";for(q=0;4>q;q++)k+=p[e>>8*q+4&15]+p[e>>8*q&15];c[d]=k}return a.join("")}}();__adroll__.prototype._init_floc_trial=function(){var a=window.document.createElement("meta");a.httpEquiv="origin-trial";a.content="A41wt2Lsq30A9Ox/WehogvJckPI4aY9RoSxhb8FMtVnqaUle1AtI6Yf7Wk+7+Wm0AfDDOkMX+Wn6wnDpBWYgWwYAAAB8eyJvcmlnaW4iOiJodHRwczovL2Fkcm9sbC5jb206NDQzIiwiZmVhdHVyZSI6IkludGVyZXN0Q29ob3J0QVBJIiwiZXhwaXJ5IjoxNjI2MjIwNzk5LCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ==";this._head().appendChild(a)};
__adroll__.prototype._log_floc_cohort=function(){var a=this._global("adroll_seg_eid")||"";if("function"===typeof window.document.interestCohort){var b=this;window.document.interestCohort().then(function(c){if(c){var d=c.id;c=c.version;d&&c&&b._log_pex_event("floc",d,c,{seg:a},null)}})["catch"](function(a){b.log("floc-error:"+a)})}};
__adroll__.prototype._log_pex_event=function(a,b,c,d,e){a=encodeURIComponent(a);b=encodeURIComponent(b);c=encodeURIComponent(c);var n=this._ensure_global("adroll_adv_id",""),p=this._ensure_global("adroll_pix_id","");e=e?"&ex="+encodeURIComponent(this.jsonStringify(e)):"";var m="";"object"===typeof d&&(m="&"+this.object_to_querystring(d));d=this._srv("/pex/"+n+"/"+p+"?ev="+a+"&es="+b+"&esv="+c+"&pv="+this.pv+m+e);"function"===typeof navigator.sendBeacon?navigator.sendBeacon(d):this.imgRequest(d)};
__adroll__.prototype._pixel_timing=function(a,b,c){function d(){m.session_time+=(new Date).getTime()-(c||0)}function e(a,b){var c=["f="+a];"undefined"!==typeof b&&c.push("ft="+b);c=m._srv("/onp/"+m._global("adroll_adv_id")+"/"+m._global("adroll_pix_id")+"?"+c.join("&"));"function"===typeof navigator.sendBeacon?navigator.sendBeacon(c):m.imgRequest(c)}function n(a,b){!b||!0!==window.__adroll_consent&&!0!==(window.__adroll_consent||{}).a||(d(),e(m.session_time,"preconsent"),"object"===typeof window.performance&&
e(m.pixelstart-window.performance.timing.domInteractive,"prepixel"))}function p(a){if("visible"===window.document.visibilityState||a.type in h)m._pixel_timing(!1,!1,l);else if("hidden"===window.document.visibilityState||a.type in g)!0===window.__adroll_consent||!0===(window.__adroll_consent||{}).a?(d(),e(m.session_time)):d()}var m=this,l=(new Date).getTime(),h=["focus","focusin","pageshow"],g=["blur","focusout","pagehide"];0===m.pixelstart&&(m.pixelstart=l);"function"===typeof window.__tcfapi&&!0===
b&&(b=!1,window.__tcfapi("addEventListener",2,n));!0!==window.__adroll_consent&&!0!==(window.__adroll_consent||{}).a?window.setTimeout(function(){m._pixel_timing(!0,b,l)},500):!0===a&&("hidden"in window.document?window.document.addEventListener("visibilitychange",p):"mozHidden"in window.document?window.document.addEventListener("mozvisibilitychange",p):"webkitHidden"in window.document?window.document.addEventListener("webkitvisibilitychange",p):"msHidden"in window.document?window.document.addEventListener("msvisibilitychange",
p):"onfocusin"in window.document?(window.document.addEventListener("focusin",p),window.document.addEventListener("focusout",p)):(window.document.addEventListener("pageshow",p),window.document.addEventListener("pagehide",p),window.document.addEventListener("focus",p),window.document.addEventListener("blur",p)))};__adroll__.prototype._gurl=function(){var a=window.location;return this.normalize_url(a.pathname+a.search)};__adroll__.prototype.get_dummy_product_for_facebook=function(a){return{product_id:"adroll_dummy_product",product_group:a,product_action:null,product_category:null}};__adroll__.prototype.facebook_dummy_product_enabled=function(){return!0};
__adroll__.prototype.extract_pid=function(a,b,c,d,e){a||(a={});var n=null,p=this._gurl(),n=null;if("2.0"!==this.get_version())return null;var n="productView"===b?"":b,m=null;c&&(m=c.products);m&&0!==m.length||(m=this.extract_product_from_rollcrawl_opts(a,p));(!m||0===m.length)&&c&&c.hasOwnProperty("product_id")&&c.product_id&&(m=[this.copyObj(c,["products"])]);a=[];if(m)for(p=0;p<m.length;p++){var l=m[p].product_id;null!==l&&""!==l&&"undefined"!==l&&a.push(m[p])}if(a&&0!==a.length)n={product_action:n,
product_list:a};else if(this.facebook_dummy_product_enabled()&&"facebook"===d)n=this.get_dummy_product_for_facebook(null);else return this._callUserEventEndpoint(b,c),null;e&&e(n);return n};
__adroll__.prototype.extract_product_from_rollcrawl_opts=function(a,b){function c(a){return a?(a=new RegExp(a,"gi"),!!a.exec(b)):null}var d=null,e=null,n=null;if(a.regexp_group&&!("string"===a.regexp_group&&a.regexp_group instanceof String)&&"html"===a.regexp_group.scheme){if(c(a.blacklist_regexp)||!0!==c(a.regexp))return"";d=this.get_product_id_from_dom(a.regexp_group)}else if(!d){if(c(a.blacklist_regexp))return"";d=this.get_product_id_from_url(b,a.regexp,a.regexp_group)}e||!a.product_group_group||
"string"===a.product_group_group&&a.product_group_group instanceof String||"html"!==a.product_group_group.scheme?e||a.product_group_regexp&&(e=this.get_product_id_from_url(b,a.product_group_regexp,a.product_group_group)):e=this.get_product_id_from_dom(a.product_group_group);if(d){var p={},n=[];p.product_id=d;p.product_group=e;n.push(p)}return n};
__adroll__.prototype.get_pid=function(a){var b=function(b,d){this.is_product_event(b)&&this.extract_pid(a,b,d,"adroll",function(a){if(a){var n=a.product_action,p=a.product_list;if(p&&0!==p.length){a=this.copyObj(d)||{};var m=[];n&&m.push(["adroll_product_action",this.normalize_var((n+"").toLowerCase(),!0)]);p&&(m.push(["adroll_products",window.encodeURIComponent(this.jsonStringify(p))]),a.products||(a.products=p));m.push(["adroll_version",this.get_version()]);(n=this.external_data_to_qs(d,!0))&&m.push([n]);
n=this._srv(this.buildurl("/p/"+this._global("adroll_adv_id")+"/",m));m=window.document.createElement("img");m.src=n;m.height=m.width=1;m.border=0;m.setAttribute("alt","");this._head().appendChild(m);this._callUserEventEndpoint(b,a)}}}.bind(this))}.bind(this);this.registerTrackCallback(b,"productEventCallback")};
__adroll__.prototype.get_product_id_from_dom=function(a){var b=null,c;a.path&&(window.jQuery?(c=window.jQuery(a.path),c.length&&(c=c.eq(0),b="text"===a.attribute?c.text():c.attr(a.attribute))):window.Prototype&&window.$$?(c=window.$$(a.path),c.length&&(c=c[0],b="text"===a.attribute?c.innerText&&!window.opera?c.innerText:c.innerHTML.stripScripts().unescapeHTML().replace(/[\n\r\s]+/g," "):c.readAttribute(a.attribute))):window.YUI?(c=window.YUI().use("node"),c.one&&(c=c.one(a.path),b=null,c&&(b="text"===
a.attribute?c.get("text"):c.getAttribute(a.attribute)))):window.MooTools&&window.$$&&(c=window.$$(a.path),c.length&&(c=c[0],b="text"===a.attribute?c.get("text"):c.getProperty(a.attribute))));if(b&&(b=b.replace(/^\s\s*/,"").replace(/\s\s*$/,""),a.regular_expression&&a.regular_expression_replace))if(c=new RegExp(a.regular_expression,"gi"),b=c.exec(b),null!==b){a=a.regular_expression_replace;for(c=0;c<b.length;c++)a=a.replace(new RegExp("\\\\"+c,"gi"),b[c]||"");b=a}else b="";return b};
__adroll__.prototype.get_product_id_from_url=function(a,b,c){var d=null;try{d=parseInt(c)}catch(e){}return null!==d&&!isNaN(d)&&b&&(a=(new RegExp(b,"gi")).exec(a),null!==a&&d in a)?a[d]:null};__adroll__.prototype.store_adroll_loaded_record=function(a,b){window.adroll_loaded=(window.adroll_loaded||[]).concat({version:this.version,ts:(new Date).getTime(),adroll_adv_id:a,adroll_pix_id:b})};__adroll__.prototype.get_segment_url=function(a,b,c){return this._srv("/segment"+this.get_segment_path(a,b,c))};
__adroll__.prototype.get_segment_path=function(a,b,c){this.expire_old();var d=this.get_keywords(),e=[];try{e.push("adroll_s_ref="+window.escape(window.document.referrer))}catch(f){}try{e.push("keyw="+window.escape(d))}catch(f){}try{var n=c.segment_name||c.adroll_segments;this.is_null_or_blank(n)||e.push("name="+window.escape(n.toLowerCase()))}catch(f){}try{var p=this.get_conversion_value(c);p.conv_value&&e.push("conv_value="+p.conv_value);p.currency&&e.push("adroll_currency="+p.currency)}catch(f){}try{var m=
c.adroll_email;if(!this.is_null_or_blank(m)){var m=m.replace(/^\s+|\s+$/g,""),l=m.toLowerCase();this.is_already_hashed(l)?e.push("hashed_email="+l):this.is_email_valid(m)?e.push("hashed_email="+this.md5(l)):(e.push("data_error=email"),e.push("data_error_message=invalid_format"))}}catch(f){}try{if(this._has_user_identifier()){var h=this._global("adroll_user_identifier"),h=h.replace(/^\s\s*/,"").replace(/\s\s*$/,"");e.push("user_identifier="+window.encodeURIComponent(h))}}catch(f){}try{var g=this.external_data_to_qs(c,
!0);g&&e.push(g)}catch(f){}e.push("adroll_version="+this.get_version());return this.get_base_url("",a,b,null,"",e)};
__adroll__.prototype.loadGlobalFunctions=function(){var a=this._global("adroll");if(a&&"object"===typeof a){var b=this;a.setProperties=function(){return b.setProperties.apply(b,arguments)};a.identify=function(){return b.identify.apply(b,arguments)};a.track=function(){return b.track.apply(b,arguments)};for(var c,d,e=0;e<a.length;e++)c=a[e][0],d=a[e][1],"setProperties"===c?this.setProperties.apply(this,d):"identify"===c?this.identify.apply(this,d):"track"===c&&this.track.apply(this,d)}};
__adroll__.prototype.get_base_url=function(a,b,c,d,e,n){var p=a.split("?");a=p[0]+"/"+b+"/"+c+(d?"/"+d:"")+(e?"/"+e:"");var m="?";p[1]&&(a+="?"+p[1],m="&");var p=m+"no-cookies=1",l="";this.cookieEnabled()?(l=window.escape(this.get_eids()),a+=m+"cookie="+l):a+=p;n&&(a+="&"+n.join("&"));a=this.add_tpc_to_url(a);if(a.length>this._url){try{this.del(this.__adc)}catch(h){}if(a.length-l.length>this._url)return a;this.log("Url was too big, shrinking it");return this.get_url(b,c,d,e,n)}this.log("Generated url: "+
a);return a};__adroll__.prototype.add_script_element=function(a,b){var c=window.document.createElement("script"),d=this._secure()?"https://":"http://";a.match(/^(\w+:)*\/\//)&&(d="");for(var e in b)b.hasOwnProperty(e)&&"src"!==e&&c.setAttribute(e,b[e]);c.type="text/javascript";c.src=d+a;this._head().appendChild(c);return c};__adroll__.prototype.get_url=function(a,b,c,d,e){var n=c?this._srv("/c"):this._srv("/r");return this.get_base_url(n,a,b,c,d,e)};
__adroll__.prototype.get_eids=function(){try{for(var a=this.get(this.__adc),b=a?a.split("|"):"",a=[],c=b.length-1;0<=c;c--)if(b[c]&&""!==b[c]){var d=b[c].split(":");a.push([d[0],d[2]].join(":"))}return a.join("|")}catch(e){return this.del(this.__adc),""}};__adroll__.prototype.add_pixel_load_callback=function(a){this._loaded&&a.call(this);this._load_cbs=(this._load_cbs||[]).concat(a)};
__adroll__.prototype.pixel_loaded=function(){this._loaded=!0;for(var a=this._load_cbs||[];0<a.length;){var b=a.shift();try{b.call(this)}catch(c){this.log("pixel_loaded callback error: "+c)}}};__adroll__.prototype.sha256=function(a){function b(a,b){return a>>>b|a<<32-b}var c=window.unescape(window.encodeURIComponent(a)),d=Math.pow(2,32),e,n="",p=[],m=8*c.length,l=[],h=[];e=0;for(var g={},f=2;64>e;f++)if(!g[f]){for(a=0;313>a;a+=f)g[a]=f;l[e]=Math.pow(f,.5)*d|0;h[e++]=Math.pow(f,1/3)*d|0}for(c+="\u0080";0!==c.length%64-56;)c+="\x00";for(a=0;a<c.length;a++){e=c.charCodeAt(a);if(e>>8)return null;p[a>>2]|=e<<(3-a)%4*8}p[p.length]=m/d|0;p[p.length]=m;for(e=0;e<p.length;){c=p.slice(e,e+=16);d=
l;l=l.slice(0,8);for(a=0;64>a;a++){var g=c[a-15],f=c[a-2],m=l[0],k=l[4],g=l[7]+(b(k,6)^b(k,11)^b(k,25))+(k&l[5]^~k&l[6])+h[a]+(c[a]=16>a?c[a]:c[a-16]+(b(g,7)^b(g,18)^g>>>3)+c[a-7]+(b(f,17)^b(f,19)^f>>>10)|0),m=(b(m,2)^b(m,13)^b(m,22))+(m&l[1]^m&l[2]^l[1]&l[2]),l=[g+m|0].concat(l);l[4]=l[4]+g|0}for(a=0;8>a;a++)l[a]=l[a]+d[a]|0}for(a=0;8>a;a++)for(e=3;e+1;e--)p=l[a]>>8*e&255,n+=(16>p?0:"")+p.toString(16);return n};__adroll__.prototype.record_user=function(a){a=a||{};try{this._unset_global("adroll_page_properties")}catch(b){}Object.keys(a).length&&this._set_global("adroll_page_properties",a);this.dyno("recordUser",a)};__adroll__.prototype.record_adroll_email=function(a){this._record_adroll_email(a,"/id")};__adroll__.prototype.record_adroll_private_email=function(a){this._record_adroll_email(a,"/idp")};
__adroll__.prototype._record_adroll_email=function(a,b){if(this._has_email()){var c=this._global("_adroll_email"),c=c.replace(/^\s+|\s+$/g,""),d,e,n=c.toLowerCase(),p=this.is_email_valid(c);this.is_already_hashed(n)?d=n:p&&(d=this.md5(n),e=this.sha256(n));c=(b||"/id")+"/"+this._global("adroll_adv_id")+"/";d={hashed_email:d,sha256_email:e};p&&(n=n.split("@")[1],d.email_domain=n);a&&(d.idsource=a);c+=this._reg_lpq("?epq",d);this.imgRequest(this._srv(c))}};
__adroll__.prototype._send_plain_text_identifiers=function(a,b,c){if((a||b)&&c){c={idsource:c};var d=(!1===window.adroll_sendrolling_cross_device?"/idp/":"/id/")+this._global("adroll_adv_id")+"/";if(a){a=a.replace(/^\s+|\s+$/g,"").toLowerCase();var e=a.split("@")[1];c.email=a;c.hashed_email=this.md5(a);c.sha256_email=this.sha256(a);c.email_domain=e}b&&(c.user_identifier=b);d+=this._reg_lpq("?epq",c);this.imgRequest(this._srv(d))}};__adroll__.prototype._has_email=function(){return this._has_global("_adroll_email")};
__adroll__.prototype._has_user_identifier=function(){return this._has_global("adroll_user_identifier")&&"example_user_id"!==this._global("adroll_user_identifier")};__adroll__.prototype.is_already_hashed=function(a){return/^[a-f0-9]{32}$/.test(a)};__adroll__.prototype.is_email_valid=function(a){return/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(a)};
__adroll__.prototype.identify=function(a,b){(a.email||a.userId)&&this._send_plain_text_identifiers(a.email,a.userId,b||"adroll-identify");a.email&&this._set_global("_adroll_email",a.email);var c=this.copyObj(a,["email","userId"]);c&&(c=this._srv("/uat/"+this._global("adroll_adv_id")+"/"+this._global("adroll_pix_id")+"/?user_attributes="+window.encodeURIComponent(this.jsonStringify(c))),b&&(c+="&idsource="+b),this.imgRequest(c));this._queueAndCallback("identify",[a,b])};
__adroll__.prototype.setProperties=function(a){if(this._has_global("adroll_page_properties")){var b=this._global("adroll_page_properties");this._unset_global("adroll_page_properties");this.extendObj(b,a);this._set_global("adroll_page_properties",b)}else this._set_global("adroll_page_properties",a)};__adroll__.prototype.appendPageProperties=function(a){this._has_global("adroll_page_properties")&&(a=this.extendObj(this._global("adroll_page_properties"),a));return a};
__adroll__.prototype._callUserEventEndpoint=function(a,b){var c=this._srv("/uev/"+this._global("adroll_adv_id")+"/"+this._global("adroll_pix_id")+"/?event_name="+window.encodeURIComponent(a)+"&adroll_version="+this.get_version()),d=this.copyObj(b);if(d){c+="&event_attributes="+window.encodeURIComponent(this.jsonStringify(d));try{var e=this.get_conversion_value(d);e.conv_value&&(c+="&conv_value="+window.encodeURIComponent(e.conv_value));e.currency&&(c+="&adroll_currency="+window.encodeURIComponent(e.currency))}catch(n){}}this.imgRequest(c)};
__adroll__.prototype.identify_email=function(a){var b=this;this.add_pixel_load_callback(function(){function c(){if(window.__adroll_idem0)window.__adroll_idem0(a,"adroll-identify-email");else if(0<d){--d;for(var e=window.document.querySelectorAll("script"),n=0;n<e.length;n++)if(e[n].src.match(/sendrolling/)){window.setTimeout(c,500);return}b.identify({email:a},"adroll-identify-email")}}var d=3;c()})};
__adroll__.prototype.track=function(a,b){this._track_pxl_assistant(a,b);a&&this._ensure_global("__adroll_consent",null)&&(b=b?this.appendPageProperties(b):this.get_page_properties(),"pageView"===a?this.dyno("fbDynoCallback",b):(this.is_product_event(a)?this.get_pid(this._global("adroll_rollcrawl_opts")):this._callUserEventEndpoint(a,b),this._queueAndCallback("track",[a,b])))};
__adroll__.prototype._reg_lpq=function(a,b){var c,d,e=[],n={},p=btoa(this.object_to_querystring(b));if(!p)return"";for(c=65;91>c;c++)e.push(String.fromCharCode(c));p=p.split("");e.push("-","_","\t");p=p.reverse();e.splice(13,0,"+","/","=");for(c=0;c<e.length-3;c++)d=e.concat(e)[c+e.length/2],n[e[c]]=d,n[e[c].toLowerCase()]=d.toLowerCase();return(e=p.map(function(a){return n[a]||a}).join("").trim())?a+"="+e:""};
__adroll__.prototype._registerCallback=function(a,b,c){this.callbacks=this.callbacks||{};this.callbackNames=this.callbackNames||[];this.callbacks[a]=this.callbacks[a]||[];if(!("function"!==typeof b||-1<this.callbackNames.indexOf(c))&&(this.callbackNames.push(c),this.callbacks[a].push(b),this.callbackQueues&&this.callbackQueues[a]&&this.callbackQueues[a].length))for(c=0;c<this.callbackQueues[a].length;c++)b.apply(null,this.callbackQueues[a][c])};
__adroll__.prototype._queueAndCallback=function(a,b){this.callbackQueues=this.callbackQueues||{};this.callbackQueues[a]=this.callbackQueues[a]||[];this.callbackQueues[a].push(b);if(this.callbacks&&this.callbacks[a]&&this.callbacks[a].length)for(var c=0;c<this.callbacks[a].length;c++)this.callbacks[a][c].apply(null,b)};__adroll__.prototype.registerIdentifyCallback=function(a,b){this._registerCallback("identify",a,b)};
__adroll__.prototype.registerTrackCallback=function(a,b){this._registerCallback("track",a,b)};__adroll__.prototype._track_pxl_assistant=function(a,b){this._has_global("__adroll_pxl_assistant_track")||this._set_global("__adroll_pxl_assistant_track",[]);this._global("__adroll_pxl_assistant_track").push({eventName:a,eventAttrs:b});if(this._nrpa_event_handler)try{this._nrpa_event_handler({track:this._global("__adroll_pxl_assistant_track")})}catch(c){}};__adroll__.prototype._is_defined=function(a){return"undefined"===a||"null"===a?!1:"undefined"!==typeof a};__adroll__.prototype.is_null_or_blank=function(a){return null===a||!this._is_defined(a)||""===a.trim()};__adroll__.prototype.normalize_var=function(a,b){if(!a)return"";a=a.toString().substr(0,this._kwl).replace(/,/gi,".");b&&(a=window.escape(a));return a};__adroll__.prototype.get_version=function(){return this._has_global("adroll_version")?this._global("adroll_version"):"2.0"};
__adroll__.prototype.is_product_event=function(a){return-1!==this.product_events.indexOf(a)};__adroll__.prototype.get_keywords=function(){try{var a=window.document.referrer||"";if(!a)return"";var b=this.parseUri(a);return-1!==b.host.indexOf("www.google.")?b.queryKey.q.substring(0,this._kwl):-1!==b.host.indexOf("bing.com")?b.queryKey.q.substring(0,this._kwl):""}catch(c){return""}};
__adroll__.prototype.parseUri=function(a){a=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(a);for(var b={queryKey:{}},c=14,d="source protocol authority userInfo user password host port relative path directory file query anchor".split(" ");c--;)b[d[c]]=a[c]||"";b[d[12]].replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(a,c,d){c&&(b.queryKey[c]=d)});return b};
__adroll__.prototype.has_param_in_url=function(a,b){var c=a.split("?");return 1<c.length&&-1!==("&"+c[1]).indexOf("&"+b+"=")};__adroll__.prototype._srv=function(a,b){a=this._is_defined(a)?a:"";var c="d.adroll.com";b&&(c="ipv4.d.adroll.com");c=this.add_tpc_to_url("https://"+c+a);if(!this.has_param_in_url(c,"arrfrr"))var d=this._get_arrfrr(),c=this.add_param_to_url(c,"arrfrr="+encodeURIComponent(d));this.has_param_in_url(c,"pv")||(c=this.add_param_to_url(c,"pv="+this.pv));return this.add_consent_to_url(this.add_fpc_to_url(c))};
__adroll__.prototype._get_arrfrr=function(a){a||(a=window.location.href);var b=a.split("#");a=b.shift();var b=b.length?"#"+b.join("#"):null,c=a.split("?"),d=this;if(1<c.length){var e=c[1].replace(/([^&=]+)=([^&]+)/g,function(a,b,c){return b.match(/cc_number|credit_card|card_number|cv[cv]_code/)||d.is_luhn(unescape(c))?b+"=NR_REDACT":b+"="+c});c[1]!==e&&(a=c[0]+"?"+e)}b&&(a+=b);return a};
__adroll__.prototype.is_luhn=function(a){if("string"!==typeof a)return!1;a=a.replace(/\D/g,"");if(13>a.length||19<a.length)return!1;for(var b=0,c=!1,d,e=a.length-1;0<=e;e--)d=parseInt(a.charAt(e),10),c&&(d*=2,9<d&&(d-=9)),b+=d,c=!c;return 0===b%10};__adroll__.prototype._cdn=function(a){a=this._is_defined(a)?a:"";return"https://s.adroll.com"+a};__adroll__.prototype.log=function(a){this._logs.push(a)};__adroll__.prototype.read_log=function(a){return this._logs.join(a?"\n":"<br>\n")};
__adroll__.prototype.normalize_url=function(a){return a.toLowerCase()};__adroll__.prototype.imgRequest=function(a){var b=new window.Image;b.src=this.add_tpc_to_url(a);b.setAttribute("width","1");b.setAttribute("height","1");b.setAttribute("border","0");b.setAttribute("alt","");return this._head().appendChild(b)};
__adroll__.prototype.b64toint=function(a){function b(a,c){if(1>c)return"";if(c%2)return b(a,c-1)+a;var d=b(a,c/2);return d+d}var c="",d;a=a.replace("-","+").replace("_","/");for(var e=0;e<a.length;e++)d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a[e]).toString(2),c=c+b("0",6-d.length)+d;return parseInt(c,2)};__adroll__.prototype.copyObj=function(a,b){if(!a)return null;var c={},d=0,e;for(e in a)!a.hasOwnProperty(e)||b&&-1!==b.indexOf(e)||(d++,c[e]=a[e]);return d?c:null};
__adroll__.prototype.extendObj=function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a};__adroll__.prototype.startsWith=function(a,b){return a.substring(0,b.length)===b};__adroll__.prototype.convert_to_map=function(a){if(null===a)return null;var b={},c;for(c in a)a.hasOwnProperty(c)&&"undefined"!==a[c]&&(b[c.toLowerCase()]=a[c]);return b};
__adroll__.prototype.object_keys=function(a){if(window.Object&&window.Object.keys)return Object.keys(a);if("object"===typeof a)return[];var b=[],c;for(c in a)a.hasOwnProperty(c)&&b.push(c);return b};__adroll__.prototype.wrapException=function(a){return function(b){try{return a(b)}catch(c){}}};
__adroll__.prototype.add_tpc_to_url=function(a){var b=this._global("adroll_tpc");if(!a||!b)return a;var c=a.substr(a.indexOf("://")+3).split("/")[0];return a.match(/[?&]adroll_tpc=/)&&"d.adroll.com"!==c?a:this.add_param_to_url(a,"adroll_tpc="+encodeURIComponent(b))};
__adroll__.prototype.add_fpc_to_url=function(a){var b=this.get_first_party_cookie();if(!a||!b)return a;var c=this.parseUri(a);return c.queryKey.adroll_fpc||"d.adroll.com"!==c.host&&"ipv4.d.adroll.com"!==c.host&&"d.adroll.com"!==c.host+":"+c.port&&"ipv4.d.adroll.com"!==c.host+":"+c.port?a:this.add_param_to_url(a,"adroll_fpc="+encodeURIComponent(b))};
__adroll__.prototype.add_consent_to_url=function(a){if(!a)return a;if(this.has_param_in_url(a,"_arc"))return a;var b=this.get_first_party_consent();if(!b||!b.arconsent)return a;var c=a.match(/^\w+:\/\/([^\/]+)/);return c&&"d.adroll.com"!==c[1]&&"ipv4.d.adroll.com"!==c[1]?a:this.add_param_to_url(a,"_arc="+encodeURIComponent(b.arconsent))};
__adroll__.prototype.getSafariVersion=function(){var a=/^Mozilla\/5\.0 \([^)]+\) AppleWebKit\/[^ ]+ \(KHTML, like Gecko\) Version\/([^ ]+)( Mobile\/[^ ]+)? Safari\/[^ ]+$/i.exec(navigator.userAgent);return a?a[1]:null};__adroll__.prototype.set_tpc=function(a,b){var c=this.tpc_callback();a&&b&&this._set_global("adroll_tpc",encodeURIComponent(a)+"="+encodeURIComponent(b));c&&c.call(this)};
__adroll__.prototype.tpc_callback=function(a){var b=window.adroll_tpc_callback,c=this;if(!a)return window.adroll_tpc_callback=a,b;window.adroll_tpc_callback=function(){if(b)try{b.call(c)}catch(d){c.log("tpc callback failed: "+d)}try{a.call(c)}catch(d){c.log("tpc callback failed: "+d)}};return null};__adroll__.prototype.call_next_tpc=function(){var a=this.tpc_callback();window.adroll_lex33_called?a&&a.call(this):(window.adroll_lex33_called=1,this._call_33across(a))};
__adroll__.prototype.extract_query_param=function(a,b){for(var c=b.split("&"),d=0;d<c.length;d++){var e=c[d].split("=");if(decodeURIComponent(e[0])===a)return decodeURIComponent(e[1])}return null};__adroll__.prototype.get_adroll_sid=function(){var a=this.get_consent_params();return a&&(a=this.extract_query_param("_s",a))?a:this._global("adroll_sid")};__adroll__.prototype.load_adroll_tpc=function(a){this.tpc_callback(a);if(this._consent_checked)return this.set_consent();this._consent_checked=!0;this.call_consent_check()};
__adroll__.prototype.get_tpc_decode_timeout=function(){return 1500};__adroll__.prototype._secure=function(){return!0};__adroll__.prototype.init_pixchk=function(){this.if_under_experiment_js("pixchk",function(){window.addEventListener("message",this.pixchk_handler,!1)},function(){},1E3)};
__adroll__.prototype.pixchk_handler=function(a){if(a.origin.match(/^https?:\/\/[^\/:]*\.adroll\.com\b/))try{var b=JSON.parse(a.data);"pixchk"===b.cmd&&a.source.postMessage(JSON.stringify({cmd:"pixrpl",adv_id:window.adroll_adv_id,pix_id:window.adroll_pix_id,token:b.token}),"*")}catch(c){}};
__adroll__.prototype.load_pixel_assistant=function(){if(!window.document.getElementById("adroll_nrpa_sdk")){var a=(window.location.hash||"").match("nrpa=([A-Z0-7]+)8([A-F0-9]+Z)"),b=Math.floor((new Date).getTime()/1E3)-3600;(window.sessionStorage.getItem("adroll_nrpa_sdk")||a&&a[1]===window.adroll_adv_id&&!(parseInt(a[2],16)<b))&&this.add_script_element("https://s.adroll.com/j/nrpa.js",{id:"adroll_nrpa_sdk"})}};
__adroll__.prototype.set_suspended=function(){this._set_global("__adroll_data_suspended",!0)};__adroll__.prototype.is_suspended=function(){return this._has_global("__adroll_data_suspended")};
__adroll__.prototype.object_to_querystring=function(a){var b=null;if("object"===typeof a&&("function"===typeof window.URLSearchParams&&(b=(new window.URLSearchParams(a)).toString(),"[object URLSearchParams]"===b&&(b=null)),null===b)){var b="",c;for(c in a)a.hasOwnProperty(c)&&(b=b+"&"+encodeURIComponent(c)+"="+encodeURIComponent(a[c]));b=b.substr(1)}return b};__adroll__.prototype._get_lex_timeout=function(){return 1E3};
__adroll__.prototype.is_ipv6=function(){return(this._global("__adroll_consent_data")||{}).isipv6};
__adroll__.prototype._call_33across=function(a){function b(){a&&a.call(c)}var c=this;if(!0===this._ensure_global("__adroll_consent_is_gdpr",null))b();else{var d=(this._global("__adroll_consent_data")||{}).ipgeo||{},e=(d.country_code||"").toLowerCase(),d=(d.region_name||"").toLowerCase();"us"!==e||"california"===d?b():(e=navigator.userAgent.toLowerCase(),-1===e.indexOf("safari/")||-1!==e.indexOf("chrome")?b():this.if_under_experiment_js("33across",function(){var d=c._ensure_global("adroll_adv_id",
""),e=c._ensure_global("adroll_pix_id",""),d=c._srv("/lex/"+d+"/"+e+"?id=${PUBTOK}&pv="+c.pv),d="https://lex.33across.com/ps/v1/pubtoken/?pid=115&event=rtg&us_privacy=&rnd=<RANDOM>&ru=<URL>".replace("<RANDOM>",c.pv).replace("<URL>",encodeURIComponent(d));window.adroll_lex_cb=a;window.adroll_lex_to=window.setTimeout(function(){window.adroll_lex_to=null;window.adroll_lex_cb=null;b()},c._get_lex_timeout());c.add_script_element(d)},function(){b()}))}};
__adroll__.prototype.set_lex_id=function(a){window.adroll_lex_to&&(window.clearTimeout(window.adroll_lex_to),window.adroll_lex_to=null);this.set_tpc("lx3",a);a=window.adroll_lex_cb;window.adroll_lex_cb=null;a&&a.call(this)};
__adroll__.prototype._load_black_crow=function(){var a=this;if(!0!==this._ensure_global("__adroll_consent_is_gdpr",null)){var b=(this._global("__adroll_consent_data")||{}).ipgeo||{},c=(b.country_code||"").toLowerCase(),b=(b.region_name||"").toLowerCase();"us"===c&&"california"!==b&&this.if_under_experiment_js("blackcrow",function(){window.blackcrow=window.blackcrow||[];window.blackcrow.push({app_name:"audience",bind:"scores_update",callback:function(b){a._log_pex_event("blackcrow","audience","scores_update",
"",{scores:b})}});var b=a._ensure_global("adroll_adv_id","adroll");this.add_script_element("https://init.blackcrow.ai/js/core/<ADV_EID>.js".replace("<ADV_EID>",b))})}};window.__adroll=window.__adroll||new __adroll__;

        (function(m){(function(c){function l(a){return null===a||void 0===a?a:!!a}function y(a,b){if(!b||!b.length)return a;for(var d={},e=0;e<b.length;e++)d[b[e]]=!!a[b[e]];return d}function k(a,b){if(!a&&0!==a)return a;for(var d={},e=0;e<b;e++)d[e+1]=!!(a&1),a>>=1;return d}function z(a){if(a&&a.length){for(var b={},d=0;d<a.length;d++)b[a[d]]=!0;return b}}if(c._has_global("__cmp")||c._has_global("__tcfapi")&&!c._has_global("_adroll_tcfapi_placeholder_installed"))c._install_cmp=function(){};else{c._cmp_calls=
[];c._set_global("__cmp",function(a,b,d){"ping"===a?d({gdprAppliesGlobally:!1,cmpLoaded:!1}):c._cmp_calls.push([a,b,d])});c._tcfapi_calls=[];c._set_global("__tcfapi",function(a,b,d,e){"ping"===a?d({gdprApplies:void 0,cmpLoaded:!1,cmpStatus:"loading",displayStatus:void 0,apiVersion:"2.0",cmpVersion:void 0,cmpId:void 0,gvlVersion:void 0,tcfPolicyVersion:void 0}):c._tcfapi_calls.push([a,e,d])});var m={getVendorConsents:function(a){var b=c._global("__adroll_consent"),d=c._global("__adroll_consent_data"),
e=c._global("__adroll_consent_is_gdpr");d=d.euconsent||"";var h=c.b64toint(d.substr(22,4)),A=c.b64toint(d.substr(26,3))>>2,k={},g={},f,l=c._is_defined;if(a&&a.length)for(f=0;f<a.length;f++)g[a[f]]=l(b[a[f]])?b[a[f]]:null;else{for(f in b)b.hasOwnProperty(f)&&(g[f]=b[f]);for(f=1;f<=A;f++)g[f]=l(b[f])?b[f]:null}for(f=1;24>=f;f++)k[f]=!(isNaN(h)||!(h&1<<24-f));return[{metadata:d.substr(0,18)+d.substr(20,2),gdprApplies:!!e,hasGlobalScope:!1,purposeConsents:k,vendorConsents:g},!0]},getConsentData:function(a){if(a&&
"1.1"!==String(a))return[null,!1];a=c._global("__adroll_consent_data");var b=c._global("__adroll_consent_is_gdpr");return[{consentData:a.euconsent||"",gdprApplies:!!b,hasGlobalScope:!1},!0]},ping:function(){return[{gdprAppliesGlobally:!1,cmpLoaded:!!c._global("__adroll_consent_data").euconsent},!0]}},q=!1,g={},w=0,v={getTCData:function(a){var b=l(c._global("__adroll_consent_is_gdpr")),d=c._global("__adroll_consent_data")||{},e=d.eucookie||{},h=e.publisher_tc||{};d=d.euconsent;var g=e.cmp_id,m=e.cmp_version,
q=l(e.is_service_specific),f=l(e.use_non_standard_stacks),v=e.publisher_iso_country,w=l(e.purpose_one_treatment),B={allowedVendors:z(e.allowed_vendors),disclosedVendors:z(e.disclosed_vendors)},C={consents:k(e.purposes_allowed,24),legitimateInterests:k(e.purposes_li_transparency,24)};a={consents:y(e.vendor_consent,a),legitimateInterests:y(e.vendor_legitimate_interest,a)};var D=k(e.special_feature_opt_ins,12),E=k(h.pub_purposes_consent,24),F=k(h.pub_purposes_li_transparency,24);h={consents:k(h.custom_purposes_consent,
h.num_custom_purposes),legitimateInterests:k(h.custom_purposes_li_transparency,h.num_custom_purposes)};if((e=e.publisher_restrictions)&&"object"===typeof e){var r={};for(n in e)if(e.hasOwnProperty(n)){var p=e[n]||{},t=p.purpose_id,u=p.vendors;p=p.restriction;if(t&&u&&u.length){r[t]=r[t]||{};for(var x=0;x<u.length;x++)r[t][u[x]]=p}}var n=r}else n=void 0;return[{tcString:d,tcfPolicyVersion:2,cmpId:g,cmpVersion:m,gdprApplies:b,cmpStatus:"loaded",isServiceSpecific:q,useNonStandardStacks:f,publisherCC:v,
purposeOneTreatment:w,outOfBand:B,purpose:C,vendor:a,specialFeatureOptins:D,publisher:{consents:E,legitimateInterests:F,customPurpose:h,restrictions:n}},!0]},ping:function(){var a=c._global("__adroll_consent_data"),b=l(c._global("__adroll_consent_is_gdpr"));a=a.eucookie||{};return[{gdprApplies:b,cmpLoaded:!0,cmpStatus:"loaded",displayStatus:b?"visible":"disabled",apiVersion:"2.0",cmpVersion:a.cmp_version,cmpId:a.cmp_id,gvlVersion:a.vendor_list_version,tcfPolicyVersion:a.tcf_policy_version},!0]},addEventListener:function(a){var b=
++w;g[b]=a;c._dispatch_consent_event(b)},removeEventListener:function(a,b){var d=!1;b in g&&(d=!0,delete g[b]);a(d)}};c._trigger_consent_event=function(){for(var a in g)g.hasOwnProperty(a)&&c._dispatch_consent_event(a)};c._dispatch_consent_event=function(a){if(a in g){var b=g[a],d=v.getTCData(),e="tcloaded",h=c._global("__adroll_consent"),k=c._global("__adroll_consent_banner")||{};null===h||"banner"===k.state?(e="cmpuishown",q=!0):q&&(e="useractioncomplete");d&&2===d.length?(d[0].eventStatus=e,d[0].listenerId=
a,b(d[0],d[1])):b({},!1)}};c._install_cmp=function(){c._set_global("__cmp",function(a,b,c){(a=m[a])&&c.apply(null,a(b))});var a=c._cmp_calls;c._cmp_calls=[];for(var b=0;b<a.length;b++)c._global("__cmp").apply(c,a[b]);c._set_global("__tcfapi",function(a,b,c,g){b=v[a];"addEventListener"===a||"removeEventListener"===a?b.call(null,c,g):c.apply(null,b(g))});a=c._tcfapi_calls||[];c._tcfapi_calls=[];for(b=0;b<a.length;b++)c._global("__tcfapi").apply(c,a[b])}}})(m)})(window.__adroll);


    window.adroll_sendrolling_cross_device = false;
    window.adroll_form_fields = {};

    __adroll__.prototype.render_advertisable_cell = function () {
        if (typeof __adroll._form_attach != 'undefined') {
            __adroll._form_attach();
        }

        __adroll.segment_map = JSON.parse("{\"4QG52RXNWBAXJKTHPBXEYZ\":{\"child\":\"4QG52RXNWBAXJKTHPBXEYZ\",\"type\":\"s\"},\"5OSOZCI7XNCL7NO2N2EE3W\":{\"child\":\"5OSOZCI7XNCL7NO2N2EE3W\",\"type\":\"s\"},\"AZ5SIZHPYBFJRCFLSFKOUS\":{\"child\":\"AZ5SIZHPYBFJRCFLSFKOUS\",\"type\":\"s\"},\"BEECM6CRDJFSXEHW54GVL2\":{\"child\":\"BEECM6CRDJFSXEHW54GVL2\",\"type\":\"s\"},\"BSWCXJLQ4FCMBKVDIKYGSU\":{\"child\":\"BSWCXJLQ4FCMBKVDIKYGSU\",\"type\":\"s\"},\"CPFKMCOFQFCD3HDR4JNNKS\":{\"child\":\"CPFKMCOFQFCD3HDR4JNNKS\",\"type\":\"s\"},\"EQAIKGRK2RF7PHAC4UW722\":{\"child\":\"EQAIKGRK2RF7PHAC4UW722\",\"type\":\"s\"},\"ESRZPTBODFDVPKH2SYIRFT\":{\"child\":\"ESRZPTBODFDVPKH2SYIRFT\",\"type\":\"s\"},\"H5T6IHFFUVHO7G36SY3GY4\":{\"child\":\"H5T6IHFFUVHO7G36SY3GY4\",\"type\":\"s\"},\"IJHBB6JEINHADNPEXD3LF7\":{\"child\":\"IJHBB6JEINHADNPEXD3LF7\",\"type\":\"s\"},\"IVVXWB2CJFBZVEFOBUSO5Q\":{\"child\":\"IVVXWB2CJFBZVEFOBUSO5Q\",\"type\":\"s\"},\"IWAOIKNYOFFQFFTT7PD7AC\":{\"child\":\"IWAOIKNYOFFQFFTT7PD7AC\",\"type\":\"s\"},\"J2UCDVEP2REFHPDWWRFHJR\":{\"child\":\"J2UCDVEP2REFHPDWWRFHJR\",\"type\":\"s\"},\"JZ3XZJB3TRC6PESFCQREL6\":{\"child\":\"JZ3XZJB3TRC6PESFCQREL6\",\"type\":\"c\"},\"KHLVFQJLT5GRRECUQMFTNR\":{\"child\":\"KHLVFQJLT5GRRECUQMFTNR\",\"type\":\"s\"},\"MTCHYOEFNRHABPYAZWLNIK\":{\"child\":\"MTCHYOEFNRHABPYAZWLNIK\",\"type\":\"s\"},\"SGMCV7HRQNGS5K5SGBY42V\":{\"child\":\"SGMCV7HRQNGS5K5SGBY42V\",\"type\":\"s\"},\"VKWF7KKYSVFVLJIPGN4DHZ\":{\"child\":\"VKWF7KKYSVFVLJIPGN4DHZ\",\"type\":\"s\"},\"WYS6DIGFKZEYFFTT73XQIM\":{\"child\":\"WYS6DIGFKZEYFFTT73XQIM\",\"type\":\"p\"},\"XWNVZYFE5FGFNHNT4AI7Z3\":{\"child\":\"XWNVZYFE5FGFNHNT4AI7Z3\",\"type\":\"s\"},\"YOKDKV4N6BDUNJ52KEICJM\":{\"child\":\"YOKDKV4N6BDUNJ52KEICJM\",\"type\":\"s\"},\"YTWAEG3YEZBIXAV3RCTILN\":{\"child\":\"YTWAEG3YEZBIXAV3RCTILN\",\"type\":\"s\"},\"Z2KSUWPY2ZCEJHHERVDVVJ\":{\"child\":\"Z2KSUWPY2ZCEJHHERVDVVJ\",\"type\":\"s\"}}");
        __adroll.product_events = ["productView", "addToCart", "cartView", "purchase", "productListView"];
        var scheme = (("https:" == document.location.protocol) ? "https" : "http");
        var adnxs_domain = 'secure.adnxs.com';
        var aol_domain = 'secure.leadback.advertising.com';

        if (scheme=='http') { adnxs_domain = 'ib.adnxs.com'; aol_domain = 'leadback.advertising.com';}
        var el = document.createElement("div");
        el.style["width"] = "1px";
        el.style["height"] = "1px";
        el.style["display"] = "inline";
        el.style["position"] = "absolute";

        if (__adroll.consent_allowed(__adroll.consent_networks.facebook)) {
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                document,'script','//connect.facebook.net/en_US/fbevents.js');
        }

        __adroll__._fbq_calls = [];
        function adrollFbqAsync(arguments) {
            __adroll__._fbq_calls.push(arguments);
        }

        function retryAdrollFbqApply(t) {
            setTimeout(function(){ adrollFbqApply(t * 2); }, t * 100);
        }

        function adrollFbqApply(t) {
            var calls = __adroll__._fbq_calls;
            // Sanity check: retry until at least a FB call is queued.
            if (calls.length === 0) {
                retryAdrollFbqApply(t);
                return;
            }
            if (typeof fbq != 'undefined') {
                __adroll__._fbq_calls = [];
                for (var i = 0; i < calls.length; i++) {
                    fbq.apply(null, calls[i]);
                }
                return;
            }
            retryAdrollFbqApply(t);
        }

        retryAdrollFbqApply(1);

        try {
                try {
                
(function() {
var rtb = document.createElement("div");
rtb.style["width"] = "1px";
rtb.style["height"] = "1px";
rtb.style["display"] = "inline";
rtb.style["position"] = "absolute";
rtb.innerHTML = ["/cm/b/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/g/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/index/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/n/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/o/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/outbrain/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/pubmatic/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/r/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/taboola/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/triplelift/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK","/cm/x/out?advertisable=C5TW6DU3DZDJHFGVY4GFZK"].reduce(function (acc, cmURL) {
    return acc + '<img height="1" width="1" style="border-style:none;" alt="" src="' + __adroll._srv(cmURL) + '"/>';
}, '');
__adroll._head().appendChild(rtb);
})();

                } catch(e) {}
                try {
                var func = function(eventName, eventAttrs, headers) {
    var fbLimitedDataUse = true;
    if (__adroll.consent_allowed(__adroll.consent_networks.facebook)) {
        var segment_eids = __adroll.segment_map[headers["x-segment-eid"]].child;
        var segment_type = __adroll.segment_map[headers["x-segment-eid"]].type;
        var external_data = __adroll.convert_to_map(eventAttrs);

        var product_id_list = [];
        var product_group_list = [];

        // parsing product json from external data
        if (external_data && external_data.hasOwnProperty("products")) {
            var products = external_data["products"];
            for (var i = 0; i < products.length; i++) {
                var product_id = products[i]["product_id"];
                var product_group = products[i]["product_group"];
                if (product_id && product_id.length != 0 ) {
                    product_id_list[i] = product_id;
                    product_group_list[i] = product_group;
                }
            }
        }
        if (typeof __adroll.fb === 'undefined'){
            if (fbLimitedDataUse) {
                adrollFbqAsync(['dataProcessingOptions', ['LDU'], 0, 0]);
            }
            adrollFbqAsync(['init', '781597545296762']);

            adrollFbqAsync(['set', 'autoConfig', 'false', '781597545296762']);
            __adroll.fb=true;

            var __fbcd = {segment_eid: segment_eids};
            for (var prop in external_data){
                if (prop === "products") {
                    __fbcd['ar_product_id'] = product_id_list;
                    __fbcd['ar_product_group'] = product_group_list;
                }
                else {
                    __fbcd['ar_' + prop] = external_data[prop];
                }
            }

            adrollFbqAsync(['track', "PageView", __fbcd]);

            if (segment_type === "c") {
                var suppress_conversion = (typeof adroll_shopify_dupe_conversion == 'boolean' && adroll_shopify_dupe_conversion) ||
                                          (typeof adroll_shopify_empty_referrer == 'boolean' && adroll_shopify_empty_referrer);

                if (!suppress_conversion) {
                    var conversion = __adroll.get_conversion_value(eventAttrs) || {conv_value: 0, currency: 'USD'};
                    var conversion_value = conversion['conv_value'];
                    var currency = conversion['currency'];
                    conversion_value = currency === 'USC' ? conversion_value / 100 : conversion_value;
                    currency = currency === 'USC' ? 'USD' : currency;

                    var fb_track_src = "https://www.facebook.com/tr/?id=781597545296762" +
                                      "&ev=Purchase" +
                                      "&cd[value]=" + conversion_value +
                                      "&cd[currency]=" + currency +
                                      "&cd[segment_eid]=" + encodeURIComponent(segment_eids);

                    if(typeof external_data == "object"){
                        for (var prop in external_data){
                            if (prop === "products") {
                                fb_track_src += "&cd[ar_product_id]=" + product_id_list + "&cd[ar_product_group]=" + product_group_list;
                            }
                            else {
                                fb_track_src += "&cd[ar_" + prop + "]=" + external_data[prop];
                            }
                        }
                    }

                    var img = document.createElement("img");
                    img.src = fb_track_src;
                    img.height = img.width = 1;
                    img.border = 0;
                    img.setAttribute("alt", "");
                    __adroll._head().appendChild(img);
                }
            }
        } else {
            var __fbcd = {event: "EventSegment", segment_eid: segment_eids};
            for (var prop in external_data){
                if (prop === "products") {
                    __fbcd['ar_product_id'] = product_id_list;
                    __fbcd['ar_product_group'] = product_group_list;
                }
                else {
                    __fbcd['ar_' + prop] = external_data[prop];
                }
            }

            adrollFbqAsync(['track', "CustomEvent", __fbcd]);
            if (segment_type === "c") {
                var suppress_conversion = (typeof adroll_shopify_dupe_conversion == 'boolean' && adroll_shopify_dupe_conversion) ||
                                          (typeof adroll_shopify_empty_referrer == 'boolean' && adroll_shopify_empty_referrer);

                if (!suppress_conversion) {
                    var conversion = __adroll.get_conversion_value(eventAttrs) || {conv_value: 0, currency: 'USD'};
                    var conversion_value = conversion['conv_value'];
                    var currency = conversion['currency'];
                    conversion_value = currency === 'USC' ? conversion_value / 100 : conversion_value;
                    currency = currency === 'USC' ? 'USD' : currency;

                    var fb_track_src = "https://www.facebook.com/tr/?id=781597545296762" +
                                      "&ev=Purchase" +
                                      "&cd[value]=" + conversion_value +
                                      "&cd[currency]=" + currency +
                                      "&cd[segment_eid]=" + encodeURIComponent(segment_eids);

                    if(typeof external_data == "object"){
                        for (var prop in external_data){
                            if (prop === "products") {
                                fb_track_src += "&cd[ar_product_id]=" + product_id_list + "&cd[ar_product_group]=" + product_group_list;
                            } else {
                                fb_track_src += "&cd[ar_" + prop + "]=" + external_data[prop];
                            }
                        }
                    }

                    var img = document.createElement("img");
                    img.src = fb_track_src;
                    img.height = img.width = 1;
                    img.border = 0;
                    img.setAttribute("alt", "");
                    __adroll._head().appendChild(img);
                }
            }
        }
    }
}
__adroll.registerDynoCallback(func, 'fbDynoCallback');

                } catch(e) {}
        } catch(e) {}

       __adroll.loadGlobalFunctions();

               __adroll._head().appendChild(el);
        if (typeof __adroll.set_pixel_cookie != 'undefined') {__adroll.set_pixel_cookie(adroll_adv_id, adroll_pix_id);}
    };
}
catch(e) {}

try {
    
    __adroll.load_adroll_tpc(__adroll.render_advertisable_cell);
}
catch(e) {}
