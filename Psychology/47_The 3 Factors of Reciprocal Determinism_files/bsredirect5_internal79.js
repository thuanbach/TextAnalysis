function dv_rolloutManager(handlersDefsArray, baseHandler) {
    this.handle = function () {
        var errorsArr = [];

        var handler = chooseEvaluationHandler(handlersDefsArray);
        if (handler) {
            var errorObj = handleSpecificHandler(handler);
            if (errorObj === null) {
                return errorsArr;
            }
            else {
                var debugInfo = handler.onFailure();
                if (debugInfo) {
                    for (var key in debugInfo) {
                        if (debugInfo.hasOwnProperty(key)) {
                            if (debugInfo[key] !== undefined || debugInfo[key] !== null) {
                                errorObj[key] = encodeURIComponent(debugInfo[key]);
                            }
                        }
                    }
                }
                errorsArr.push(errorObj);
            }
        }

        var errorObjHandler = handleSpecificHandler(baseHandler);
        if (errorObjHandler) {
            errorObjHandler['dvp_isLostImp'] = 1;
            errorsArr.push(errorObjHandler);
        }
        return errorsArr;
    };

    function handleSpecificHandler(handler) {
        var request;
        var errorObj = null;

        try {
            request = handler.createRequest();
            if (request && !request.isSev1) {
                var url = request.url || request;
                if (url) {
                    if (!handler.sendRequest(url)) {
                        errorObj = createAndGetError('sendRequest failed.',
                            url,
                            handler.getVersion(),
                            handler.getVersionParamName(),
                            handler.dv_script);
                    }
                } else {
                    errorObj = createAndGetError('createRequest failed.',
                        url,
                        handler.getVersion(),
                        handler.getVersionParamName(),
                        handler.dv_script,
                        handler.dvScripts,
                        handler.dvStep,
                        handler.dvOther
                    );
                }
            }
        }
        catch (e) {
            errorObj = createAndGetError(e.name + ': ' + e.message, request ? (request.url || request) : null, handler.getVersion(), handler.getVersionParamName(), (handler ? handler.dv_script : null));
        }

        return errorObj;
    }

    function createAndGetError(error, url, ver, versionParamName, dv_script, dvScripts, dvStep, dvOther) {
        var errorObj = {};
        errorObj[versionParamName] = ver;
        errorObj['dvp_jsErrMsg'] = encodeURIComponent(error);
        if (dv_script && dv_script.parentElement && dv_script.parentElement.tagName && dv_script.parentElement.tagName == 'HEAD') {
            errorObj['dvp_isOnHead'] = '1';
        }
        if (url) {
            errorObj['dvp_jsErrUrl'] = url;
        }
        if (dvScripts) {
            var dvScriptsResult = '';
            for (var id in dvScripts) {
                if (dvScripts[id] && dvScripts[id].src) {
                    dvScriptsResult += encodeURIComponent(dvScripts[id].src) + ":" + dvScripts[id].isContain + ",";
                }
            }
            
            
            
        }
        return errorObj;
    }

    function chooseEvaluationHandler(handlersArray) {
        var config = window._dv_win.dv_config;
        var index = 0;
        var isEvaluationVersionChosen = false;
        if (config.handlerVersionSpecific) {
            for (var i = 0; i < handlersArray.length; i++) {
                if (handlersArray[i].handler.getVersion() == config.handlerVersionSpecific) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }
        else if (config.handlerVersionByTimeIntervalMinutes) {
            var date = config.handlerVersionByTimeInputDate || new Date();
            var hour = date.getUTCHours();
            var minutes = date.getUTCMinutes();
            index = Math.floor(((hour * 60) + minutes) / config.handlerVersionByTimeIntervalMinutes) % (handlersArray.length + 1);
            if (index != handlersArray.length) { 
                isEvaluationVersionChosen = true;
            }
        }
        else {
            var rand = config.handlerVersionRandom || (Math.random() * 100);
            for (var i = 0; i < handlersArray.length; i++) {
                if (rand >= handlersArray[i].minRate && rand < handlersArray[i].maxRate) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }

        if (isEvaluationVersionChosen == true && handlersArray[index].handler.isApplicable()) {
            return handlersArray[index].handler;
        }
        else {
            return null;
        }
    }
}

function dv_GetParam(url, name, checkFromStart) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = (checkFromStart ? "(?:\\?|&|^)" : "[\\?&]") + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results == null)
        return null;
    else
        return results[1];
}

function dv_SendErrorImp(serverUrl, errorsArr) {
    for (var j = 0; j < errorsArr.length; j++) {
        var errorQueryString = '';
        var errorObj = errorsArr[j];
        for (key in errorObj) {
            if (errorObj.hasOwnProperty(key)) {
                if (key.indexOf('dvp_jsErrUrl') == -1) {
                    errorQueryString += '&' + key + '=' + errorObj[key];
                }
                else {
                    var params = ['ctx', 'cmp', 'plc', 'sid'];
                    for (var i = 0; i < params.length; i++) {
                        var pvalue = dv_GetParam(errorObj[key], params[i]);
                        if (pvalue) {
                            errorQueryString += '&dvp_js' + params[i] + '=' + pvalue;
                        }
                    }
                }
            }
        }

        var sslFlag = '&ssl=1';
        var errorImp = 'https://' + serverUrl + sslFlag + errorQueryString;
        dv_sendRequest(errorImp);
    }
}

function dv_getDVErrorGlobalScope(elm) {
    var uniqueKey = dv_getDVUniqueKey(elm);
    return uniqueKey && window._dv_win && window._dv_win[uniqueKey] && window._dv_win[uniqueKey].globalScopeVerifyCErrorHandler || {};
}

function dv_getBsErrAddress(config) {
    return config && config.bsErrAddress || 'rtb0.doubleverify.com'
}

function dv_getDVUniqueKey(elm) {
    return elm && elm.getAttribute('data-uk');
}

function dv_onLoad(elm) {
    var globalScope = dv_getDVErrorGlobalScope(elm);
    if (globalScope) {
        var scriptSRC = dv_getScriptSRC(elm);
        if (!globalScope.isJSONPCalled) {
            setTimeout(function onTimeout(){
                globalScope.onTimeout(scriptSRC);
            }, globalScope.msTillJSONPCalled);
        }
    }
}

function dv_onResponse(elm) {
    var globalScope = dv_getDVErrorGlobalScope(elm);
    if (globalScope) {
        var scriptSRC = dv_getScriptSRC(elm);
        if (!globalScope.isJSONPCalled) {
            globalScope.onResponse(scriptSRC);
        }
    }
}

function dv_getScriptSRC(elm) {
    return elm && elm.src || '';
}

function dv_onError(elm) {
    var globalScope = dv_getDVErrorGlobalScope(elm);
    if (globalScope) {
        globalScope.reportError('VerifyCFailedToLoad', dv_getScriptSRC(elm), true);
    }
}

function dv_onError_evaluation(elm) {
    var globalScope = dv_getDVErrorGlobalScope(elm);
    if (globalScope) {
        globalScope.onError(dv_getScriptSRC(elm));
    }
}

function dv_sendRequest(url, onLoad, onError, uniqueKey) {
    var emptyFunction = function(){};
    onLoad = onLoad || emptyFunction;
    onError = onError || emptyFunction;
    document.write('<scr' + 'ipt data-uk="' + uniqueKey + '" onerror="(' + onError + ')(this);" onload="(' + onLoad + ')(this);" type="text/javascript" src="' + url + '"></scr' + 'ipt>');
}

function dv_GetRnd() {
    return ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 16);
}

function doesBrowserSupportHTML5Push() {
    "use strict";
    return typeof window.parent.postMessage === 'function' && window.JSON;
}

function dvBsrType() {
    'use strict';
    var that = this;
    var eventsForDispatch = {};

    this.pubSub = new function () {

        var subscribers = [];

        this.subscribe = function (eventName, uid, actionName, func) {
            if (!subscribers[eventName + uid])
                subscribers[eventName + uid] = [];
            subscribers[eventName + uid].push({Func: func, ActionName: actionName});
        };

        this.publish = function (eventName, uid) {
            var actionsResults = [];
            if (eventName && uid && subscribers[eventName + uid] instanceof Array)
                for (var i = 0; i < subscribers[eventName + uid].length; i++) {
                    var funcObject = subscribers[eventName + uid][i];
                    if (funcObject && funcObject.Func && typeof funcObject.Func == "function" && funcObject.ActionName) {
                        var isSucceeded = runSafely(function () {
                            return funcObject.Func(uid);
                        });
                        actionsResults.push(encodeURIComponent(funcObject.ActionName) + '=' + (isSucceeded ? '1' : '0'));
                    }
                }
            return actionsResults.join('&');
        };
    };

    this.domUtilities = new function () {
        this.addImage = function (url, parentElement) {
            url = appendCacheBuster(url);
            if (typeof(navigator.sendBeacon) === 'function') {
                navigator.sendBeacon(url);
                return;
            }
            var image = new Image();
            image.src = url;
        };

        this.addScriptResource = function (url, parentElement) {
            var scriptElem = parentElement.ownerDocument.createElement("script");
            scriptElem.type = 'text/javascript';
            scriptElem.src = appendCacheBuster(url);
            parentElement.insertBefore(scriptElem, parentElement.firstChild);
        };

        this.addScriptCode = function (srcCode, parentElement) {
            var scriptElem = parentElement.ownerDocument.createElement("script");
            scriptElem.type = 'text/javascript';
            scriptElem.innerHTML = srcCode;
            parentElement.insertBefore(scriptElem, parentElement.firstChild);
        };

        this.addHtml = function (srcHtml, parentElement) {
            var divElem = parentElement.ownerDocument.createElement("div");
            divElem.style = "display: inline";
            divElem.innerHTML = srcHtml;
            parentElement.insertBefore(divElem, parentElement.firstChild);
        };
    };

    this.resolveMacros = function (str, tag) {
        var viewabilityData = tag.getViewabilityData();
        var viewabilityBuckets = viewabilityData && viewabilityData.buckets ? viewabilityData.buckets : {};
        var upperCaseObj = objectsToUpperCase(tag, viewabilityData, viewabilityBuckets);
        var newStr = str.replace('[DV_PROTOCOL]', upperCaseObj.DV_PROTOCOL);
        newStr = newStr.replace('[PROTOCOL]', upperCaseObj.PROTOCOL);
        newStr = newStr.replace(/\[(.*?)\]/g, function (match, p1) {
            var value = upperCaseObj[p1];
            if (value === undefined || value === null)
                value = '[' + p1 + ']';
            return encodeURIComponent(value);
        });
        return newStr;
    };

    this.settings = new function () {
    };

    this.tagsType = function () {
    };

    this.tagsPrototype = function () {
        this.add = function (tagKey, obj) {
            if (!that.tags[tagKey])
                that.tags[tagKey] = new that.tag();
            for (var key in obj)
                that.tags[tagKey][key] = obj[key];
        };
    };

    this.tagsType.prototype = new this.tagsPrototype();
    this.tagsType.prototype.constructor = this.tags;
    this.tags = new this.tagsType();

    this.tag = function () {
    };

    this.tagPrototype = function () {
        this.set = function (obj) {
            for (var key in obj)
                this[key] = obj[key];
        };

        this.getViewabilityData = function () {
        };
    };

    this.tag.prototype = new this.tagPrototype();
    this.tag.prototype.constructor = this.tag;

    this.getTagObjectByService = function (serviceName) {
        for (var impressionId in this.tags) {
            if (typeof this.tags[impressionId] === 'object'
                && this.tags[impressionId].services
                && this.tags[impressionId].services[serviceName]
                && !this.tags[impressionId].services[serviceName].isProcessed) {
                this.tags[impressionId].services[serviceName].isProcessed = true;
                return this.tags[impressionId];
            }
        }

        return null;
    };

    this.addService = function (impressionId, serviceName, paramsObject) {
        if (!impressionId || !serviceName)
            return;

        if (!this.tags[impressionId])
            return;
        else {
            if (!this.tags[impressionId].services)
                this.tags[impressionId].services = {};

            this.tags[impressionId].services[serviceName] = {
                params: paramsObject,
                isProcessed: false
            };
        }
    };

    this.Enums = {
        BrowserId: {Others: 0, IE: 1, Firefox: 2, Chrome: 3, Opera: 4, Safari: 5},
        TrafficScenario: {OnPage: 1, SameDomain: 2, CrossDomain: 128}
    };

    this.CommonData = {};

    var runSafely = function (action) {
        try {
            var ret = action();
            return ret !== undefined ? ret : true;
        } catch (e) {
            return false;
        }
    };

    var objectsToUpperCase = function () {
        var upperCaseObj = {};
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    upperCaseObj[key.toUpperCase()] = obj[key];
                }
            }
        }
        return upperCaseObj;
    };

    var appendCacheBuster = function (url) {
        if (url !== undefined && url !== null && url.match("^http") == "http") {
            if (url.indexOf('?') !== -1) {
                if (url.slice(-1) == '&')
                    url += 'cbust=' + dv_GetRnd();
                else
                    url += '&cbust=' + dv_GetRnd();
            }
            else
                url += '?cbust=' + dv_GetRnd();
        }
        return url;
    };

    
    var messagesClass = function () {
        var waitingMessages = [];

        this.registerMsg = function(dvFrame, data) {
            if (!waitingMessages[dvFrame.$frmId]) {
                waitingMessages[dvFrame.$frmId] = [];
            }

            waitingMessages[dvFrame.$frmId].push(data);

            if (dvFrame.$uid) {
                sendWaitingEventsForFrame(dvFrame, dvFrame.$uid);
            }
        };

        this.startSendingEvents = function(dvFrame, impID) {
            sendWaitingEventsForFrame(dvFrame, impID);
            
        };

        function sendWaitingEventsForFrame(dvFrame, impID) {
            if (waitingMessages[dvFrame.$frmId]) {
                var eventObject = {};
                for (var i = 0; i < waitingMessages[dvFrame.$frmId].length; i++) {
                    var obj = waitingMessages[dvFrame.$frmId].pop();
                    for (var key in obj) {
                        if (typeof obj[key] !== 'function' && obj.hasOwnProperty(key)) {
                            eventObject[key] = obj[key];
                        }
                    }
                }
                that.registerEventCall(impID, eventObject);
            }
        }

        function startMessageManager() {
            for (var frm in waitingMessages) {
                if (frm && frm.$uid) {
                    sendWaitingEventsForFrame(frm, frm.$uid);
                }
            }
            setTimeout(startMessageManager, 10);
        }
    };
    this.messages = new messagesClass();

    this.dispatchRegisteredEventsFromAllTags = function () {
        for (var impressionId in this.tags) {
            if (typeof this.tags[impressionId] !== 'function' && typeof this.tags[impressionId] !== 'undefined')
                dispatchEventCalls(impressionId, this);
        }
    };

    var dispatchEventCalls = function (impressionId, dvObj) {
        var tag = dvObj.tags[impressionId];
        var eventObj = eventsForDispatch[impressionId];
        if (typeof eventObj !== 'undefined' && eventObj != null) {
            var url = 'https://' + tag.ServerPublicDns + "/bsevent.gif?impid=" + impressionId + '&' + createQueryStringParams(eventObj);
            dvObj.domUtilities.addImage(url, tag.tagElement.parentElement);
            eventsForDispatch[impressionId] = null;
        }
    };

    this.registerEventCall = function (impressionId, eventObject, timeoutMs) {
        addEventCallForDispatch(impressionId, eventObject);

        if (typeof timeoutMs === 'undefined' || timeoutMs == 0 || isNaN(timeoutMs))
            dispatchEventCallsNow(this, impressionId, eventObject);
        else {
            if (timeoutMs > 2000)
                timeoutMs = 2000;

            var dvObj = this;
            setTimeout(function () {
                dispatchEventCalls(impressionId, dvObj);
            }, timeoutMs);
        }
    };

    this.createEventCallUrl = function(impId, eventObject) {
        var tag = this.tags && this.tags[impId];
        if (tag && typeof eventObject !== 'undefined' && eventObject !== null) {
            return ['https://', tag.ServerPublicDns, '/bsevent.gif?impid=', impId, '&', createQueryStringParams(eventObject)].join('');
        }
    }

    var dispatchEventCallsNow = function (dvObj, impressionId, eventObject) {
        addEventCallForDispatch(impressionId, eventObject);
        dispatchEventCalls(impressionId, dvObj);
    };

    var addEventCallForDispatch = function (impressionId, eventObject) {
        for (var key in eventObject) {
            if (typeof eventObject[key] !== 'function' && eventObject.hasOwnProperty(key)) {
                if (!eventsForDispatch[impressionId])
                    eventsForDispatch[impressionId] = {};
                eventsForDispatch[impressionId][key] = eventObject[key];
            }
        }
    };

    if (window.addEventListener) {
        window.addEventListener('unload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
        window.addEventListener('beforeunload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onunload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
        window.attachEvent('onbeforeunload', function () {
            that.dispatchRegisteredEventsFromAllTags();
        }, false);
    }
    else {
        window.document.body.onunload = function () {
            that.dispatchRegisteredEventsFromAllTags();
        };
        window.document.body.onbeforeunload = function () {
            that.dispatchRegisteredEventsFromAllTags();
        };
    }

    var createQueryStringParams = function (values) {
        var params = '';
        for (var key in values) {
            if (typeof values[key] !== 'function') {
                var value = encodeURIComponent(values[key]);
                if (params === '')
                    params += key + '=' + value;
                else
                    params += '&' + key + '=' + value;
            }
        }

        return params;
    };
}

function dv_baseHandler(){function K(b,c,d,e,g){d=encodeURIComponent(d||"MsgIsEmpty");var f=window&&window._dv_win||{};f=f.dv_config=f.dv_config||{};f=dv_getBsErrAddress(f);var k=[m.getVersionParamName(),m.getVersion()].join("=");d=["dvp_jsErrMsg",d].join("=");b=["dvp_venm",b].join("=");c=["dvp_verv",c].join("=");c=[k,"ssl=1",d,b,c];e&&c.push("dvp_isLostImp=1");e="https://"+f+"/verifyc.js?ctx=818052&cmp=1619415&"+c.join("&")+(g?"&"+g:"");(new Image(1,1)).src=e}function ba(b){var c=window._dv_win.dvRecoveryObj;
if(c){var d=dv_GetParam(b.dvparams,"ctx",!0);c=c[d]?c[d].RecoveryTagID:c._fallback_?c._fallback_.RecoveryTagID:1;1===c&&b.tagsrc?document.write(b.tagsrc):2===c&&b.altsrc&&document.write(b.altsrc);return!0}return!1}function ca(){var b=window._dv_win.dv_config&&window._dv_win.dv_config.isUT?window._dv_win.bsredirect5ScriptsInternal[window._dv_win.bsredirect5ScriptsInternal.length-1]:window._dv_win.bsredirect5ScriptsInternal.pop();window._dv_win.bsredirect5Processed.push(b);return b}function da(b){var c=
window._dv_win.dv_config=window._dv_win.dv_config||{};c.cdnAddress=c.cdnAddress||"cdn.doubleverify.com";return'<html><head><script type="text/javascript">('+function(){try{window.$dv=window.$dvbsr||parent.$dvbsr,window.$dv.dvObjType="dvbsr"}catch(d){}}.toString()+')();\x3c/script></head><body><script type="text/javascript">('+(b||"function() {}")+')("'+c.cdnAddress+'");\x3c/script><script type="text/javascript">setTimeout(function() {document.close();}, 0);\x3c/script></body></html>'}function L(b,
c,d){d=d||150;var e=window._dv_win||window;if(e.document&&e.document.body)return c&&c.parentNode?c.parentNode.insertBefore(b,c):e.document.body.insertBefore(b,e.document.body.firstChild),!0;if(0<d)setTimeout(function(){L(b,c,--d)},20);else return!1}function ea(b){var c=null;try{if(c=b&&b.contentDocument)return c}catch(d){}try{if(c=b.contentWindow&&b.contentWindow.document)return c}catch(d){}try{if(c=window._dv_win.frames&&window._dv_win.frames[b.name]&&window._dv_win.frames[b.name].document)return c}catch(d){}return null}
function fa(){function b(c){d++;var g=c.parent==c;return c.mraid||g?c.mraid:20>=d&&b(c.parent)}var c=window._dv_win||window,d=0;try{return b(c)}catch(e){}}function M(b,c,d,e,g,f,k,h,l){var p=dv_GetRnd(),u=window.parent.postMessage&&window.JSON;var W=(/iPhone|iPad|iPod|\(Apple TV|iOS|Coremedia|CFNetwork\/.*Darwin/i.test(navigator.userAgent)||navigator.vendor&&"apple, inc."===navigator.vendor.toLowerCase())&&!window.MSStream;var G=b.rand,X="__verify_callback_"+G;G="__tagObject_callback_"+G;ha(X,b);
ia(G,k,b);b.dvregion=0;var q=window._dv_win.$dvbsr.CommonData;if(void 0!=q.BrowserId&&void 0!=q.BrowserVersion&&void 0!=q.BrowserIdFromUserAgent)k={ID:q.BrowserId,version:q.BrowserVersion,ID_UA:q.BrowserIdFromUserAgent};else{var r=[{id:4,brRegex:"OPR|Opera",verRegex:"(OPR/|Version/)"},{id:1,brRegex:"MSIE|Trident/7.*rv:11|rv:11.*Trident/7|Edge/|Edg/",verRegex:"(MSIE |rv:| Edge/|Edg/)"},{id:2,brRegex:"Firefox",verRegex:"Firefox/"},{id:0,brRegex:"Mozilla.*Android.*AppleWebKit(?!.*Chrome.*)|Linux.*Android.*AppleWebKit.* Version/.*Chrome",
verRegex:null},{id:0,brRegex:"AOL/.*AOLBuild/|AOLBuild/.*AOL/|Puffin|Maxthon|Valve|Silk|PLAYSTATION|PlayStation|Nintendo|wOSBrowser",verRegex:null},{id:3,brRegex:"Chrome",verRegex:"Chrome/"},{id:5,brRegex:"Safari|(OS |OS X )[0-9].*AppleWebKit",verRegex:"Version/"}];k=null;for(var y="",t=navigator.userAgent,m=0;m<r.length;m++)if(null!=t.match(new RegExp(r[m].brRegex))){k=r[m].id;if(null==r[m].verRegex)break;t=t.match(new RegExp(r[m].verRegex+"[0-9]*"));null!=t&&(y=t[0].match(new RegExp(r[m].verRegex)),
y=t[0].replace(y[0],""));break}r=ja();4==k&&(r=k);k={ID:r,version:r===k?y:"",ID_UA:k};q.BrowserId=k.ID;q.BrowserVersion=k.version;q.BrowserIdFromUserAgent=k.ID_UA}r=y=q=m="";try{t=d;for(var v=0;10>v&&t!=window.top;)v++,t=t.parent;d.depth=v;a:{try{var A;if(!(A=k.ID==$dvbsr.Enums.BrowserId.IE)){if(d==window._dv_win.top)var B=$dvbsr.Enums.TrafficScenario.OnPage;else{t=d;try{for(v=0;window._dv_win.top!=t&&10>=v;){var C=t.parent;if(!C.document)break;t=C;v++}}catch(D){}B=t==window._dv_win.top?$dvbsr.Enums.TrafficScenario.SameDomain:
$dvbsr.Enums.TrafficScenario.CrossDomain}A=B!=$dvbsr.Enums.TrafficScenario.CrossDomain}if(A){var n=null;break a}d.performance&&d.performance.mark&&d.performance.mark("dv_str_html_start");if(c){var E=c.toString().match(/^(?:https?:\/\/)?[\w\-\.]+\/[a-zA-Z0-9]/gi);if(E&&0<E.length){n=null;break a}}var z=d.document;if(z&&z.referrer){var K=z.referrer.replace(/\//g,"\\/").replace(/\./g,"\\."),P=new RegExp('(?:w{0,4}=")?'+K+"[^&\"; %,'\\$\\\\\\|]+","gi");A=/banner|adprefs|safeframe|sandbox|sf\.html/gi;
B=/^\w{0,4}="/gi;var N=Y(z,"script","src",P,A,B);if(!N){var L=z.referrer;C="";var Q=z.getElementsByTagName("script");if(Q)for(E=0;!C&&E<Q.length;){var R=Q[E].innerHTML;if(R&&-1!=R.indexOf(L)){var M=R.match(P);C=Z(M,A,B)}E++}(N=C)||(N=Y(z,"a","href",P,A,B))}z=htmlUrl=N;b:{if(d.performance&&d.performance.mark&&d.performance.measure&&d.performance.getEntriesByName){d.performance.mark("dv_str_html_end");d.performance.measure("dv_str_html","dv_str_html_start","dv_str_html_end");var S=d.performance.getEntriesByName("dv_str_html");
if(S&&0<S.length){var J=S[0].duration.toFixed(2);break b}}J=null}n={url:z,depth:-1,duration:J};break a}}catch(D){}n=null}n&&n.duration&&(r="&dvp_strhd="+n.duration+"&dvpx_strhd="+n.duration);n&&n.url||(n=ka(d));n&&n.url&&(q="&aUrl="+encodeURIComponent(n.url),y="&aUrlD="+n.depth);m=d.depth+e;g&&d.depth--}catch(D){r=y=q=m=d.depth=""}e=window._dv_win&&window._dv_win.dv_config&&window._dv_win.dv_config.verifyJSCURL?dvConfig.verifyJSCURL+"?":"https://rtb"+b.dvregion+".doubleverify.com/verifyc.js?";a:{g=
window._dv_win;n=0;try{for(;10>n;){if(g.maple&&"object"===typeof g.maple){var T=!0;break a}if(g==g.parent){T=!1;break a}n++;g=g.parent}}catch(D){}T=!1}b=e+b.dvparams+"&num=5&srcurlD="+d.depth+"&callback="+X+"&jsTagObjCallback="+G+"&ssl=1"+(W?"&dvf=0":"")+(T?"&dvf=1":"")+"&refD="+m+"&htmlmsging="+(u?"1":"0")+"&guid="+p;c="dv_url="+encodeURIComponent(c);f&&(b=b+"&dvp_isBodyExistOnLoad=1"+("&dvp_isOnHead="+(f?"1":"0")));fa()&&(b+="&ismraid=1");h&&(b+="&urlsrc=sf");l&&(b+="&sfe=1");navigator&&navigator.maxTouchPoints&&
5==navigator.maxTouchPoints&&(b+="&touch=1");navigator&&navigator.platform&&(b+="&nav_pltfrm="+navigator.platform);if((f=window[U("=@42E:@?")][U("2?46DE@C~C:8:?D")])&&0<f.length){h=[];h[0]=window.location.protocol+"//"+window.location.hostname;for(l=0;l<f.length;l++)h[l+1]=f[l];f=h.reverse().join(",")}else f=null;f&&(c+="&ancChain="+encodeURIComponent(f));f=4E3;/MSIE (\d+\.\d+);/.test(navigator.userAgent)&&7>=new Number(RegExp.$1)&&(f=2E3);q.length+y.length+b.length<=f&&(b+=y,c+=q);k&&(b+="&brid="+
k.ID+"&brver="+k.version+"&bridua="+k.ID_UA);r&&(b+=r);"prerender"===window._dv_win.document.visibilityState&&(b+="&prndr=1");(h=la())&&(b+="&m1="+h);(h=ma())&&0<h.f&&(b+="&bsig="+h.f,b+="&usig="+h.s);try{var aa=V();h=0;var H=aa.document;aa==window.top&&""==H.title&&!H.querySelector("meta[charset]")&&H.querySelector('div[style*="background-image: url("]')&&(H.querySelector('script[src*="j.pubcdn.net"]')||H.querySelector('span[class="ad-close"]'))&&(h+=Math.pow(2,6));var I=h}catch(D){I=null}0<I&&(b+=
"&hdsig="+I);I=b;try{var F="&fcifrms="+window.top.length;window.history&&(F+="&brh="+window.history.length);var w=V(),O=w.document;if(w==window.top){F+="&fwc="+((w.FB?1:0)+(w.twttr?2:0)+(w.outbrain?4:0)+(w._taboola?8:0));try{O.cookie&&(F+="&fcl="+O.cookie.length)}catch(D){}w.performance&&w.performance.timing&&0<w.performance.timing.domainLookupStart&&0<w.performance.timing.domainLookupEnd&&(F+="&flt="+(w.performance.timing.domainLookupEnd-w.performance.timing.domainLookupStart));O.querySelectorAll&&
(F+="&fec="+O.querySelectorAll("*").length)}var x=F}catch(D){x=""}b=I+x;x=na();b+="&vavbkt="+x.vdcd;b+="&lvvn="+x.vdcv;""!=x.err&&(b+="&dvp_idcerr="+encodeURIComponent(x.err));x="&eparams="+encodeURIComponent(U(c));return b=b.length+x.length<=f?b+x:b+"&dvf=3"}function na(){var b=[],c=function(b){e(b,null!=b.AZSD,9);e(b,b.location.hostname!=b.encodeURIComponent(b.location.hostname),10);e(b,null!=b.cascadeWindowInfo,11);e(b,null!=b._rvz,32);e(b,null!=b.FO_DOMAIN,34);e(b,null!=b.va_subid,36);e(b,b._GPL&&
b._GPL.baseCDN,40);e(b,d(b,"__twb__")&&d(b,"__twb_cb_"),43);e(b,null!=b.landingUrl&&null!=b.seList&&null!=b.parkingPPCTitleElements&&null!=b.allocation,45);e(b,d(b,"_rvz",function(b){return null!=b.publisher_subid}),46);e(b,null!=b.cacildsFunc&&null!=b.n_storesFromFs,47);e(b,b._pcg&&b._pcg.GN_UniqueId,54);e(b,d(b,"__ad_rns_")&&d(b,"_$_"),64);e(b,null!=b.APP_LABEL_NAME_FULL_UC,71);e(b,null!=b._priam_adblock,81);e(b,b.supp_ads_host&&b.supp_ads_host_overridden,82);e(b,b.uti_xdmsg_manager&&b.uti_xdmsg_manager.cb,
87);e(b,b.LogBundleData&&b.addIframe,91);e(b,b.xAdsXMLHelperId||b.xYKAffSubIdTag,95);e(b,b.__pmetag&&b.__pmetag.uid,98);e(b,b.CustomWLAdServer&&/(n\d{1,4}adserv)|(1ads|cccpmo|epommarket|epmads|adshost1)/.test(b.supp_ads_host_overridden),100)},d=function(b,c,d){for(var e in b)if(-1<e.indexOf(c)&&(!d||d(b[e])))return!0;return!1},e=function(c,d,e){d&&-1==b.indexOf(e)&&b.push((c==window.top?-1:1)*e)};try{return function(){for(var b=window,d=0;10>d&&(c(b),b!=window.top);d++)try{b.parent.document&&(b=b.parent)}catch(k){break}}(),
{vdcv:28,vdcd:b.join(","),err:void 0}}catch(g){return{vdcv:28,vdcd:"-999",err:g.message||"unknown"}}}function J(b){var c=0,d;for(d in b)b.hasOwnProperty(d)&&++c;return c}function oa(b,c){a:{var d={};try{if(b&&b.performance&&b.performance.getEntries){var e=b.performance.getEntries();for(b=0;b<e.length;b++){var g=e[b],f=g.name.match(/.*\/(.+?)\./);if(f&&f[1]){var k=f[1].replace(/\d+$/,""),h=c[k];if(h){for(var l=0;l<h.stats.length;l++){var p=h.stats[l];d[h.prefix+p.prefix]=Math.round(g[p.name])}delete c[k];
if(!J(c))break}}}}var u=d;break a}catch(W){}u=void 0}if(u&&J(u))return u}function ia(b,c,d){var e=window._dv_win.document.visibilityState;window[b]=function(b){try{var f={protocol:"https:",ssl:"1",dv_protocol:"https:"};f.serverPublicDns=b.ServerPublicDns;f.ServerPublicDns=b.ServerPublicDns;f.tagElement=c;f.redirect=d;f.impressionId=b.ImpressionID;window._dv_win.$dvbsr.tags.add(b.ImpressionID,f);if(c.dvFrmWin){var g=window._dv_win.$dvbsr;c.dvFrmWin.$uid=b.ImpressionID;g.messages&&g.messages.startSendingEvents&&
g.messages.startSendingEvents(c.dvFrmWin,b.ImpressionID)}(function(){function c(){var f=window._dv_win.document.visibilityState;"prerender"===e&&"prerender"!==f&&"unloaded"!==f&&(e=f,window._dv_win.$dvbsr.registerEventCall(b.ImpressionID,{prndr:0}),window._dv_win.document.removeEventListener(d,c))}if("prerender"===e)if("prerender"!==window._dv_win.document.visibilityState&&"unloaded"!==visibilityStateLocal)window._dv_win.$dvbsr.registerEventCall(b.ImpressionID,{prndr:0});else{var d;"undefined"!==
typeof window._dv_win.document.hidden?d="visibilitychange":"undefined"!==typeof window._dv_win.document.mozHidden?d="mozvisibilitychange":"undefined"!==typeof window._dv_win.document.msHidden?d="msvisibilitychange":"undefined"!==typeof window._dv_win.document.webkitHidden&&(d="webkitvisibilitychange");window._dv_win.document.addEventListener(d,c,!1)}})();var h=oa(window,{verifyc:{prefix:"vf",stats:[{name:"duration",prefix:"dur"}]}});h&&window._dv_win.$dvbsr.registerEventCall(b.ImpressionID,h)}catch(l){}}}
function ha(b,c){window[b]=function(b){try{v.setIsJSONPCalled(!0)}catch(e){}try{if(void 0==b.ResultID)document.write(1!=b?c.tagsrc:c.altsrc);else switch(b.ResultID){case 1:b.Passback?document.write(decodeURIComponent(b.Passback)):document.write(c.altsrc);break;case 2:case 3:document.write(c.tagsrc)}}catch(e){}}}function Z(b,c,d){var e="";if(b&&0<b.length)for(var g=0;g<b.length;g++){var f=b[g];f.length>e.length&&null==f.match(c)&&0!=f.indexOf('src="')&&0!=f.indexOf('turl="')&&(e=f.replace(d,""))}return e}
function Y(b,c,d,e,g,f){b=b.querySelectorAll(c+"["+d+'*="'+b.referrer+'"]');var k="";if(b)for(c=0;!k&&c<b.length;)k=b[c][d].match(e),k=Z(k,g,f),c++;return k}function ka(b){try{if(1>=b.depth)return{url:"",depth:""};var c=[];c.push({win:window.top,depth:0});for(var d,e=1,g=0;0<e&&100>g;){try{if(g++,d=c.shift(),e--,0<d.win.location.toString().length&&d.win!=b)return 0==d.win.document.referrer.length||0==d.depth?{url:d.win.location,depth:d.depth}:{url:d.win.document.referrer,depth:d.depth-1}}catch(h){}var f=
d.win.frames.length;for(var k=0;k<f;k++)c.push({win:d.win.frames[k],depth:d.depth+1}),e++}return{url:"",depth:""}}catch(h){return{url:"",depth:""}}}function U(b){new String;var c=new String,d;for(d=0;d<b.length;d++){var e=b.charAt(d);var g="!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".indexOf(e);0<=g&&(e="!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".charAt((g+47)%94));c+=e}return c}function ja(){try{if(null!=
window._phantom||null!=window.callPhantom)return 99;if(document.documentElement.hasAttribute&&document.documentElement.hasAttribute("webdriver")||null!=window.domAutomation||null!=window.domAutomationController||null!=window._WEBDRIVER_ELEM_CACHE)return 98;if(void 0!=window.opera&&void 0!=window.history.navigationMode||void 0!=window.opr&&void 0!=window.opr.addons&&"function"==typeof window.opr.addons.installExtension)return 4;if(void 0!=window.chrome&&"function"==typeof window.chrome.csi&&"function"==
typeof window.chrome.loadTimes&&void 0!=document.webkitHidden&&(1==document.webkitHidden||0==document.webkitHidden))return 3;if(void 0!=window.mozInnerScreenY&&"number"==typeof window.mozInnerScreenY&&void 0!=window.mozPaintCount&&0<=window.mozPaintCount&&void 0!=window.InstallTrigger&&void 0!=window.InstallTrigger.install)return 2;var b=!1;try{var c=document.createElement("p");c.innerText=".";c.style="text-shadow: rgb(99, 116, 171) 20px -12px 2px";b=void 0!=c.style.textShadow}catch(d){}return(0<
Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")||window.webkitAudioPannerNode&&window.webkitConvertPointFromNodeToPage)&&b&&void 0!=window.innerWidth&&void 0!=window.innerHeight?5:null}catch(d){return null}}function la(){try{var b=0,c=function(c,d){d&&32>c&&(b=(b|1<<c)>>>0)},d=function(b,c){return function(){return b.apply(c,arguments)}},e="svg"===document.documentElement.nodeName.toLowerCase(),g=function(){return"function"!==typeof document.createElement?document.createElement(arguments[0]):
e?document.createElementNS.call(document,"http://www.w3.org/2000/svg",arguments[0]):document.createElement.apply(document,arguments)},f=["Moz","O","ms","Webkit"],k=["moz","o","ms","webkit"],h={style:g("modernizr").style},l=function(b,c){function d(){f&&(delete h.style,delete h.modElem)}var e;for(e=["modernizr","tspan","samp"];!h.style&&e.length;){var f=!0;h.modElem=g(e.shift());h.style=h.modElem.style}var k=b.length;for(e=0;e<k;e++){var l=b[e];~(""+l).indexOf("-")&&(l=cssToDOM(l));if(void 0!==h.style[l])return d(),
"pfx"==c?l:!0}d();return!1},p=function(b,c,e){var g=b.charAt(0).toUpperCase()+b.slice(1),h=(b+" "+f.join(g+" ")+g).split(" ");if("string"===typeof c||"undefined"===typeof c)return l(h,c);h=(b+" "+k.join(g+" ")+g).split(" ");for(var p in h)if(h[p]in c){if(!1===e)return h[p];b=c[h[p]];return"function"===typeof b?d(b,e||c):b}return!1};c(0,!0);c(1,p("requestFileSystem",window));c(2,window.CSS?"function"==typeof window.CSS.escape:!1);c(3,p("shapeOutside","content-box",!0));return b}catch(u){return 0}}
function V(){var b=window,c=0;try{for(;b.parent&&b!=b.parent&&b.parent.document&&!(b=b.parent,10<c++););}catch(d){}return b}function ma(){try{var b=V(),c=0,d=0,e=function(b,e,f){f&&(c+=Math.pow(2,b),d+=Math.pow(2,e))},g=b.document;e(14,0,b.playerInstance&&g.querySelector('script[src*="ads-player.com"]'));e(14,1,(b.CustomWLAdServer||b.DbcbdConfig)&&(a=g.querySelector('p[class="footerCopyright"]'),a&&a.textContent.match(/ MangaLife 2016/)));e(15,2,b.zpz&&b.zpz.createPlayer);e(15,3,b.vdApp&&b.vdApp.createPlayer);
e(15,4,g.querySelector('body>div[class="z-z-z"]'));e(16,5,b.xy_checksum&&b.place_player&&(b.logjwonready&&b.logContentPauseRequested||b.jwplayer));e(17,6,b==b.top&&""==g.title?(a=g.querySelector('body>object[id="player"]'),a&&a.data&&1<a.data.indexOf("jwplayer")&&"visibility: visible;"==a.getAttribute("style")):!1);e(17,7,g.querySelector('script[src*="sitewebvideo.com"]'));e(17,8,b.InitPage&&b.cef&&b.InitAd);e(17,9,b==b.top&&""==g.title?(a=g.querySelector("body>#player"),null!=a&&null!=(null!=a.querySelector('div[id*="opti-ad"]')||
a.querySelector('iframe[src="about:blank"]'))):!1);e(17,10,b==b.top&&""==g.title&&b.InitAdPlayer?(a=g.querySelector('body>div[id="kt_player"]'),null!=a&&null!=a.querySelector('div[class="flash-blocker"]')):!1);e(17,11,null!=b.clickplayer&&null!=b.checkRdy2);e(19,12,b.instance&&b.inject&&g.querySelector('path[id="cp-search-0"]'));e(20,13,function(){try{if(b.top==b&&0<b.document.getElementsByClassName("asu").length)for(var c=b.document.styleSheets,d=0;d<c.length;d++)for(var e=b.document.styleSheets[d].cssRules,
f=0;f<e.length;f++)if("div.kk"==e[f].selectorText||"div.asu"==e[f].selectorText)return!0}catch(q){}}());a:{try{var f=null!=g.querySelector('div[id="kt_player"][hiegth]');break a}catch(u){}f=void 0}e(21,14,f);a:{try{var k=b.top==b&&null!=b.document.querySelector('div[id="asu"][class="kk"]');break a}catch(u){}k=void 0}e(22,15,k);a:{try{var h=g.querySelector('object[data*="/VPAIDFlash.swf"]')&&g.querySelector('object[id*="vpaid_video_flash_tester_el"]')&&g.querySelector('div[id*="desktopSubModal"]');
break a}catch(u){}h=void 0}e(25,16,h);var l=navigator.userAgent;if(l&&-1<l.indexOf("Android")&&-1<l.indexOf(" wv)")&&b==window.top){var p=g.querySelector('img[src*="dealsneartome.com"]')||(b.__cads__?!0:!1)||0<g.querySelectorAll('img[src*="/tracker?tag="]').length;e(28,17,p||!1)}return{f:c,s:d}}catch(u){return null}}var m=this,v=function(){function b(b,c,d){var f=[];c&&k.forEach(function(b){var d=dv_GetParam(c,b);""!==d&&null!==d&&f.push(["dvp_"+b,d].join("="))});f.push(["dvp_scln",c&&c.length||0].join("="));
K(g,e,b,d,f.join("&"))}function c(c){var d="AdRenderedUponVerifyFailure";if(m&&m.redirect&&m.redirect.tagsrc)try{document.write(m.redirect.tagsrc)}catch(u){d+="__DocumentWrite__"+encodeURIComponent(u.message)}else m?m.redirect?m.redirect.tagsrc||(d+="__HandlerRedirectTagsrc__Undefined"):d+="__HandlerRedirect__Undefined":d+="__Handler__Undefined";b(d,c,!1)}var d=!1,e,g,f=[m.constructor&&m.constructor.name||"UKBS","__",dv_GetRnd()].join(""),k=["ctx","cmp","plc","sid"],h={onResponse:function(e){d||(b("VerifyCallbackFailed",
e,!0),c(e))},onError:function(d){b("VerifyFailedToLoad",d,!0);c(d)}};h.reportError=b;h.isJSONPCalled=d;window&&(window._dv_win=window._dv_win||{},window._dv_win[f]={globalScopeVerifyCErrorHandler:h});return{setVersionData:function(b,c){g=b;e=c},setIsJSONPCalled:function(b){d=b},getIsJSONPCalled:function(){return d},onLoad:dv_onResponse,onError:dv_onError_evaluation,uniqueKey:f}}();this.createRequest=function(){window.performance&&window.performance.mark&&window.performance.mark("dv_create_req_start");
var b=!1,c=window,d=0,e=!1;try{for(dv_i=0;10>=dv_i;dv_i++)if(null!=c.parent&&c.parent!=c)if(0<c.parent.location.toString().length)c=c.parent,d++,b=!0;else{b=!1;break}else{0==dv_i&&(b=!0);break}}catch(p){b=!1}a:{try{var g=c.$sf;break a}catch(p){}g=void 0}var f=c.location&&c.location.ancestorOrigins,k=f&&f[f.length-1];if(0==c.document.referrer.length)b=c.location;else if(b)b=c.location;else{b=c.document.referrer;a:{try{var h=c.$sf&&c.$sf.ext&&c.$sf.ext.hostURL&&c.$sf.ext.hostURL();break a}catch(p){}h=
void 0}if(h&&(!f||0==h.indexOf(k))){b=h;var l=!0}e=!0}if(!window._dv_win.bsredirect5ScriptsInternal||!window._dv_win.bsredirect5Processed||0==window._dv_win.bsredirect5ScriptsInternal.length)return{isSev1:!1,url:null};this.dv_script_obj=f=ca();f=this.dv_script=f.script;if((k=f.src.replace(/^.+?callback=(.+?)(&|$)/,"$1"))&&(this.redirect=eval(k+"()"))&&!this.redirect.done){this.redirect.done=!0;if(ba(this.redirect))return{isSev1:!0};c=M(this.redirect,b,c,d,e,f&&f.parentElement&&f.parentElement.tagName&&
"HEAD"===f.parentElement.tagName,f,l,g);c+="&"+this.getVersionParamName()+"="+this.getVersion();window.performance&&window.performance.mark&&window.performance.measure&&window.performance.getEntriesByName&&(window.performance.mark("dv_create_req_end"),window.performance.measure("dv_creqte_req","dv_create_req_start","dv_create_req_end"),(d=window.performance.getEntriesByName("dv_creqte_req"))&&0<d.length&&(c+="&dvp_exetime="+d[0].duration.toFixed(2)));return{isSev1:!1,url:c}}};this.isApplicable=function(){return!0};
this.onFailure=function(){};this.sendRequest=function(b){if(v)try{v.setVersionData(this.getVersionParamName(),this.getVersion()),dv_sendRequest(b,v.onLoad,v.onError,v.uniqueKey)}catch(l){dv_sendRequest(b)}else dv_sendRequest(b);try{var c=da(this.dv_script_obj&&this.dv_script_obj.injScripts),d=document.createElement("iframe");d.name=d.id="iframe_"+dv_GetRnd();d.width=0;d.height=0;d.id=void 0;d.style.display="none";d.src="about:blank";d.id=d.name;var e=d.id.replace("iframe_","");d.setAttribute&&d.setAttribute("data-dv-frm",
e);L(d,this.dv_script);if(this.dv_script){var g=this.dv_script;a:{b=null;try{if(b=d.contentWindow){var f=b;break a}}catch(l){}try{if(b=window._dv_win.frames&&window._dv_win.frames[d.name]){f=b;break a}}catch(l){}f=null}g.dvFrmWin=f}var k=ea(d);if(k)k.open(),k.write(c);else{try{document.domain=document.domain}catch(l){}var h=encodeURIComponent(c.replace(/'/g,"\\'").replace(/\n|\r\n|\r/g,""));d.src='javascript: (function(){document.open();document.domain="'+window.document.domain+"\";document.write('"+
h+"');})()"}}catch(l){K(this.getVersionParamName(),this.getVersion(),"DvFrame: "+encodeURIComponent(l),!1)}return!0};window.debugScript&&(!window.minDebugVersion||10>=window.minDebugVersion)&&(window.DvVerify=M,window.createRequest=this.createRequest);this.getVersionParamName=function(){return"ver"};this.getVersion=function(){return"107"}};


function dv_bs5_main(dv_baseHandlerIns, dv_handlersDefs) {

    this.baseHandlerIns = dv_baseHandlerIns;
    this.handlersDefs = dv_handlersDefs;

    this.exec = function () {
        try {
            window._dv_win = (window._dv_win || window);
            window._dv_win.$dvbsr = (window._dv_win.$dvbsr || new dvBsrType());

            window._dv_win.dv_config = window._dv_win.dv_config || {};
            window._dv_win.dv_config.bsErrAddress = window._dv_win.dv_config.bsAddress || 'rtb0.doubleverify.com';

            var errorsArr = (new dv_rolloutManager(this.handlersDefs, this.baseHandlerIns)).handle();
            if (errorsArr && errorsArr.length > 0)
                dv_SendErrorImp(window._dv_win.dv_config.bsErrAddress + '/verifyc.js?ctx=818052&cmp=1619415&num=5', errorsArr);
        }
        catch (e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.bsErrAddress + '/verifyc.js?ctx=818052&cmp=1619415&num=5&dvp_isLostImp=1', {dvp_jsErrMsg: encodeURIComponent(e)});
            } catch (e) {
            }
        }
    }
}

try {
    window._dv_win = window._dv_win || window;
    var dv_baseHandlerIns = new dv_baseHandler();
	

    var dv_handlersDefs = [];

    if (!window.debugScript) {
    (new dv_bs5_main(dv_baseHandlerIns, dv_handlersDefs)).exec();
}
} catch (e) {
}