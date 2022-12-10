var conchkXml;
// MP-8869 Audio-descriptor internal concept marker display in DV mode
var capValue =false;
var ADValue = false;
var SPPQuizInternal = (function() {

    var media = SmartPearsonPlayer.properties.media;
    var internalConChkData = [],internalCConChkData = [],
        tempConceptCheckData = [],
        index, shapeIndex, videoWidth = SPPUtility.videoWidth,
        videoHeight = SPPUtility.videoHeight;
    var controlWrapper = document.getElementById("wrapper");

    var internalConChkBkBtnData = [],
        mezzanineVideoHeight, mezzanineVideoWidth, mezVideoAspectRatio;
    var videoWrapper = document.getElementById("videoWrapper"),
        bkBtnSeekTime, currentInternalCCJumptime = "";
    var conChkDots = document.getElementsByClassName("conchk-dot");
    
    
    
    initQuiz();
     
    function Deferred() {
        this._done = [];
        this._fail = [];
    }
    Deferred.prototype = {
        execute: function(list, args) {
            var i = list.length;

            // convert arguments to an array
            // so they can be sent to the
            // callbacks via the apply method
            args = Array.prototype.slice.call(args);

            while (i--) list[i].apply(null, args);
        },
        resolve: function() {
            this.execute(this._done, arguments);
        },
        reject: function() {
            this.execute(this._fail, arguments);
        },
        done: function(callback) {
            this._done.push(callback);
        },
        fail: function(callback) {
            this._fail.push(callback);
        }
    }

    var clipNavFunctionality = null;

    var setVal = function(value) {
        var d = new Deferred();
        clipNavFunctionality = value;
        SPPUtility.setClipData(value);
        d.resolve(this);
        return d;
    };
    var ADconcept = false;
    var adStarttime = " ";
    var jumptime = " ";
    var descriptionBtn = document.getElementById("descriptionBtn");
    var descriptionBtnn = " ";
    if(descriptionBtn) {
        descriptionBtnn = document.getElementById("descriptionBtn").value;
    }
    function initQuiz() {
        SPPUtility.log("internal concept check.....");

        //Request from Chapter XML

        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            conchkAjax = new XMLHttpRequest();

        } else {
            // code for IE6, IE5
            conchkAjax = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var kk,gg,kkk,ff ;
        var idd = 0;
        
        conchkAjax.onreadystatechange = function() {
            var self = this;
            if (conchkAjax.readyState == 4 && conchkAjax.status == 200) {

                if (conchkAjax.responseXML) {
                    conchkXml = conchkAjax.responseXML;
                    var conceptchecks = conchkXml.getElementsByTagName("conceptcheck");
                    var cchecks = conchkXml.getElementsByTagName("audiodescription");
                    var backButton = conchkXml.getElementsByTagName("back");
                    var clipNavButtons = conchkXml.getElementsByTagName("clipnav");
                    if (clipNavButtons && clipNavButtons.length > 0) {
                        if (SPPUtility.playerType != 1) {
                            var resizeVideoHeight = ((parseFloat(SmartPearsonPlayer.properties.media.clientHeight) - (parseFloat(document.getElementById("progressBar").clientHeight) + parseFloat(document.getElementById("wrapper").clientHeight))) / parseFloat(SmartPearsonPlayer.properties.media.clientHeight)) * 100;
                            SmartPearsonPlayer.properties.media.style.height = resizeVideoHeight + "%";
                        } else if (SPPUtility.playerType == 1) {
                            if (document.getElementById("controls").value != 2) {
                                document.getElementById("controls").value = 2;
                                SmartPearsonPlayer.controlRackPosition(document.getElementById("controls"));
                            }
                        }
                        if(descriptionBtnn == "Turn Off Video Description") {
                            clipInfo = SPPUtility.getParameterByName('tt', media.currentSrc); 
                        } else {
                            clipInfo = SPPUtility.getParameterByName('t', media.currentSrc);
                        }
                        //clipInfo = SPPUtility.getParameterByName('t', media.currentSrc);
                        if(clipInfo == ''){
                            document.getElementById("setControlRack").style.display = "none";
                            //document.getElementsByClassName("captionType")[0].value = "2";
                            document.getElementById("captionsOptionsWrapper").style.display = "none";
                        }
                        //document.getElementsByClassName("captionType")[0].value = "2";
                        //document.getElementById("captionsOptionsWrapper").style.display = "none";
                        var clipFn = new martinGay(conchkXml);
                        setVal(clipFn);
                    }
                    // MP-8869 Audio-descriptor internal concept marker display in DV mode
                    // MP-8931 - Audio-descriptor internal concept marker timing fix
                    for (var i = 0; i < cchecks.length; i++) {
                        for (var attr = 0; attr < cchecks[i].childNodes.length; attr++) { 
                            if(cchecks[i].childNodes[attr].nodeName == "conceptcheck" ) {
                                ADconcept = true;                                
                                adStarttime += "AD"+cchecks[i].childNodes[attr].attributes.starttime.value;
                                jumptime += "JU"+cchecks[i].childNodes[attr].attributes.jumptime.value;
                            }
                        }
                    }
                    
                    //Save XML in an array
                    for (var i = 0; i < conceptchecks.length; i++) {
                        internalConChkData[i] = [];
                        var isExternalQuiz = 0;
                        for (var attr = 0; attr < conceptchecks[i].attributes.length; attr++) {
                            if (conceptchecks[i].attributes[attr].name == "question")
                                isExternalQuiz = 1;
                            internalConChkData[i][conceptchecks[i].attributes[attr].name] = conceptchecks[i].attributes[attr].value;
                        }
                        if (isExternalQuiz == 0) {
                            internalConChkData[i]['content'] = [];
                            var flag = 0;
                            for (var content = 0; content < conceptchecks[i].childNodes.length; content++) {
                                if (((typeof(conceptchecks[i].childNodes[content]) != "undefined") || (typeof(conceptchecks[i].childNodes[content]) != "null")) && conceptchecks[i].childNodes[content].nodeType == 1) {
                                    var childNode = conceptchecks[i].childNodes[content];
                                    internalConChkData[i]['content'][flag] = [];
                                    internalConChkData[i]['content'][flag]['shape'] = childNode.nodeName;
                                    for (var j = 0; j < childNode.attributes.length; j++)
                                        internalConChkData[i]['content'][flag][childNode.attributes[j].name] = childNode.attributes[j].value;
                                        
                                        
                                    flag++;
                                }
                            }
                            var leftAttr = 0;
                           // preset all the clip info so that the player will act accordingly...
                           if (clipInfo != "") {
                                var clipStarttime       = parseFloat(clipInfo.split(",")[0]);
                                var clipEndtime         = parseFloat(clipInfo.split(",")[1]);
                                var clipsTotalTime      = clipEndtime - clipStarttime;
                                var clipConceptChecktime = parseFloat(SPPUtility.parseTime(conceptchecks[i].attributes.starttime.value));
                                if(clipConceptChecktime >clipStarttime && clipConceptChecktime < clipEndtime){
                                 var newclipConceptChecktime = parseFloat(clipConceptChecktime - clipStarttime);
                                 leftAttr = parseFloat((newclipConceptChecktime / clipsTotalTime) * 100);
                                }
                            } else {
                                if(ADconcept == true && descriptionBtnn == "Turn Off Video Description") {
                                    if(adStarttime != SPPUtility.parseTime(conceptchecks[i].attributes.starttime.value)) {
                                        leftAttr = parseFloat((parseFloat(SPPUtility.parseTime(conceptchecks[i].attributes.starttime.value)) / media.duration) * 100);
                                    }
                                } else {
                                    if(adStarttime != SPPUtility.parseTime(conceptchecks[i].attributes.starttime.value) ) {
                                        leftAttr = parseFloat((parseFloat(SPPUtility.parseTime(conceptchecks[i].attributes.starttime.value)) / media.duration) * 100);
                                    } 
                                }
                            }
                            // MP-8869 Audio-descriptor internal concept marker display in DV mode
                            if(leftAttr > 0 && ADconcept == true && descriptionBtnn == "Turn Off Video Description"
                                && adStarttime != SPPUtility.parseTime(conceptchecks[i].attributes.starttime.value) ){
                                var newIndicator = document.createElement("div");
                                var str = conceptchecks[i].attributes.starttime.value;
                                var strValue = str.replace(/[^a-z0-9áéíóúñü \.,:;()_-]/gim,"");
                                var matches = adStarttime.match(str);       
                                if (matches == null) {
                                    ADValue = true;
                                }  
                                if(ADValue == true) {                         
                                    newIndicator.innerHTML = '<a class="conchk-dot internal conchk-num-' + (i + 1) + '"\n' +' time="'+strValue+'"'+ 'style="left:' + leftAttr + '%;display:block;"></a>';
                                    document.getElementById("progressBar").appendChild(newIndicator);
                                    
                                    if(document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-1')[0]) {
                                        var DVinternal = document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-1')[0];
                                        DVinternal.parentNode.remove(newIndicator);
                                    }
                                    if(document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-2')[0] && i != 1) {
                                        var DVinternal = document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-2')[0];
                                        DVinternal.parentNode.remove(newIndicator);
                                    }
                                    newIndicator.getElementsByClassName('conchk-dot')[0].addEventListener("click",function(e){
                                    e.stopPropagation();
                                    SPPUtility.log("External quiz Seek ----- " + this.getAttribute("time"));
                                    media.currentTime = SPPUtility.parseTime(this.getAttribute("time"));
                                });
                                } 
                            } else {
                                // MP-8869 Audio-descriptor internal concept marker display in DV mode
                                if(leftAttr > 0  && descriptionBtnn != "Turn Off Video Description" && ADconcept == true
                                    && adStarttime != SPPUtility.parseTime(conceptchecks[i].attributes.starttime.value) ) {
                                    var newIndicator = document.createElement("div");
                                    var str = conceptchecks[i].attributes.starttime.value;
                                    var matches = adStarttime.match(str);
                                    if (matches != null) {
                                        capValue = true;
                                    } 
	                                if(capValue == false) {
                                        var strValue = str.replace(/[^a-z0-9áéíóúñü \.,:;()_-]/gim,"");                       
                                        newIndicator.innerHTML = '<a class="conchk-dot internal conchk-num-' + (i + 1) + '"\n' +' time="'+strValue+'"'+ 'style="left:' + leftAttr + '%;display:block;"></a>';
                                        document.getElementById("progressBar").appendChild(newIndicator);
                                        
                                        if(document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-3')[0]) {
                                            var NormalInternal = document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-3')[0];
                                            NormalInternal.parentNode.remove(newIndicator);
                                        } 
                                        if(document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-4')[0]) {
                                            var NormalInternal = document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-4')[0];
                                            NormalInternal.parentNode.remove(newIndicator);
                                        }
                                        if(document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-2')[0] && i != 1) {
                                            var NormalInternal = document.getElementById("progressBar").getElementsByClassName('conchk-dot internal conchk-num-2')[0];
                                            NormalInternal.parentNode.remove(newIndicator);
                                        }                      
                                        newIndicator.getElementsByClassName('conchk-dot')[0].addEventListener("click",function(e){
                                         e.stopPropagation();
                                        SPPUtility.log("External quiz Seek ----- " + this.getAttribute("time"));
                                        media.currentTime = SPPUtility.parseTime(this.getAttribute("time"));
                                        });
                                    }
                                }
                            }
                            // MP-8869 Audio-descriptor internal concept marker display in DV mode
                            if((leftAttr > 0 && descriptionBtnn == " " && ADconcept == false) || (leftAttr > 0 && clipInfo != "")) {
                                var newIndicator = document.createElement("div");
                                //MP-7204
                                var str = conceptchecks[i].attributes.starttime.value;
                                var strValue = str.replace(/[^a-z0-9áéíóúñü \.,:;()_-]/gim,"");
                                newIndicator.innerHTML = '<a class="conchk-dot internal conchk-num-' + (i + 1) + '"\n' +' time="'+strValue+'"'+ 'style="left:' + leftAttr + '%;display:block;"></a>';
                                //addNewIndicator(newIndicator, conceptCheckData[i].starttime);
                                document.getElementById("progressBar").appendChild(newIndicator);
                                newIndicator.getElementsByClassName('conchk-dot')[0].addEventListener("click",function(e){
                                    e.stopPropagation();
                                    SPPUtility.log("External quiz Seek ----- " + this.getAttribute("time"));
                                    media.currentTime = SPPUtility.parseTime(this.getAttribute("time"));
                                }); 
                            }


                        } else {
                            internalConChkData[i] = [];
                        }
                    }
                    // MP-8931 - Audio-descriptor internal concept marker timing fix
                    if (tempConceptCheckData.length == 0 && internalConChkData[0] && internalConChkData[0].content && internalConChkData[0].content.length > 0) {
                        tempConceptCheckData = [];
                        var idx = 0;
                        var isCapValue = false;
                        internalConChkData.forEach(function(key, value) {
                            key.content.forEach(function(ansKey, ansVal) {
                                tempConceptCheckData[idx] = [];
                                
                                if (ansKey.starttime && ansKey.endtime && idx < 6 && descriptionBtnn != "Turn Off Video Description"  && jumptime.length > 14) {
                                    tempConceptCheckData[idx]['duration'] = SPPUtility.parseTime(ansKey.endtime) - SPPUtility.parseTime(ansKey.starttime);
                                    tempConceptCheckData[idx]['starttime'] = SPPUtility.parseTime(ansKey.starttime);
                                    tempConceptCheckData[idx]['endtime'] = SPPUtility.parseTime(ansKey.endtime);
                                    if (ansKey.backbtnseektime)
                                        tempConceptCheckData[idx]['backbtnseektime'] = ansKey.backbtnseektime;
                                    //idx++;
                                } else if (ansKey.starttime && ansKey.endtime && idx < 3 && descriptionBtnn != "Turn Off Video Description" && jumptime.length == 14) {
                                        tempConceptCheckData[idx]['duration'] = SPPUtility.parseTime(ansKey.endtime) - SPPUtility.parseTime(ansKey.starttime);
                                        tempConceptCheckData[idx]['starttime'] = SPPUtility.parseTime(ansKey.starttime);
                                        tempConceptCheckData[idx]['endtime'] = SPPUtility.parseTime(ansKey.endtime);
                                        if (ansKey.backbtnseektime)
                                            tempConceptCheckData[idx]['backbtnseektime'] = ansKey.backbtnseektime;
                                } else if (ansKey.starttime && ansKey.endtime && idx >= 3 && descriptionBtnn == "Turn Off Video Description" && jumptime.length == 14) {
                                            tempConceptCheckData[idx]['duration'] = SPPUtility.parseTime(ansKey.endtime) - SPPUtility.parseTime(ansKey.starttime);
                                            tempConceptCheckData[idx]['starttime'] = SPPUtility.parseTime(ansKey.starttime);
                                            tempConceptCheckData[idx]['endtime'] = SPPUtility.parseTime(ansKey.endtime);
                                            if (ansKey.backbtnseektime)
                                                tempConceptCheckData[idx]['backbtnseektime'] = ansKey.backbtnseektime;
                                } else if (ansKey.starttime && ansKey.endtime && idx >= 6 && descriptionBtnn == "Turn Off Video Description" && jumptime > 14) {
                                    tempConceptCheckData[idx]['duration'] = SPPUtility.parseTime(ansKey.endtime) - SPPUtility.parseTime(ansKey.starttime);
                                    tempConceptCheckData[idx]['starttime'] = SPPUtility.parseTime(ansKey.starttime);
                                    tempConceptCheckData[idx]['endtime'] = SPPUtility.parseTime(ansKey.endtime);
                                    if (ansKey.backbtnseektime)
                                        tempConceptCheckData[idx]['backbtnseektime'] = ansKey.backbtnseektime;
                                } else if(descriptionBtnn == " " && ADconcept == false) {
                                    tempConceptCheckData[idx]['duration'] = SPPUtility.parseTime(ansKey.endtime) - SPPUtility.parseTime(ansKey.starttime);
                                    tempConceptCheckData[idx]['starttime'] = SPPUtility.parseTime(ansKey.starttime);
                                    tempConceptCheckData[idx]['endtime'] = SPPUtility.parseTime(ansKey.endtime);
                                    if (ansKey.backbtnseektime)
                                        tempConceptCheckData[idx]['backbtnseektime'] = ansKey.backbtnseektime;

                                }
                                else if (ansKey.seektime && ansKey.endtime) {
                                    tempConceptCheckData[idx]['duration'] = SPPUtility.parseTime(ansKey.endtime) - SPPUtility.parseTime(ansKey.seektime);
                                    tempConceptCheckData[idx]['starttime'] = SPPUtility.parseTime(ansKey.seektime);
                                    tempConceptCheckData[idx]['endtime'] = SPPUtility.parseTime(ansKey.endtime);
                                    if (ansKey.backbtnseektime)
                                        tempConceptCheckData[idx]['backbtnseektime'] = ansKey.backbtnseektime;
                                    idx++;

                                }
                                idx++;
                            });
                        });
                        tempConceptCheckData.sort(
                            function(a, b) {
                                return a['duration'] > b['duration'] ? 1 : -1;
                            }
                        );


                        if (backButton.length > 0) {
                            for (var backbtn = 0; backbtn < backButton.length; backbtn++) {
                                for (var i = 0; i < backButton[backbtn].attributes.length; i++) {
                                    var bkbtn = backButton[backbtn];
                                    internalConChkBkBtnData[bkbtn.attributes[i].name] = bkbtn.attributes[i].value;
                                }
                            }
                        }

                        SPPUtility.log(internalConChkData);
                        if (typeof backButton != "undefined" && backButton != "undefined" && typeof backButton[0] != "undefined" && backButton[0] != "undefined" && typeof backButton[0].attributes[0].value != "undefined" && backButton[0].attributes[0].value != "undefined") {
                            if (internalConChkData[0]['content'][0]['backbtnseektime']) {
                                bkBtnSeekTime = internalConChkData[0]['content'][0]['backbtnseektime'];
                            }
                        }
                        SPPUtility.buttonWrapper = document.createElement("div");
                        SPPUtility.buttonWrapper.setAttribute("class", "buttonWrapper");
                        videoWrapper.appendChild(SPPUtility.buttonWrapper);
                    }
                }
            }
        }
        //var quizUrl;
        conchkAjax.open("GET", quizUrl, true);
        if(assetTransfered)
        {
            conchkAjax.setRequestHeader("Access-Control-Allow-Origin", "*");
            conchkAjax.setRequestHeader("Access-Control-Allow-Credentials", "true");
            conchkAjax.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            conchkAjax.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        }
        conchkAjax.send();
    }




    function onMediaPlaying() {
		
        if (typeof internalConChkBkBtnData != "undefined" && internalConChkBkBtnData != "undefined" && typeof internalConChkBkBtnData.value != "undefined" && internalConChkBkBtnData.value != "undefined") {
            if (!document.getElementById("bkBtn")) {
                //MP-7204
                var str = internalConChkBkBtnData.value;
                var strValue = str.replace(/[^a-z0-9áéíóúñü \.,:;()_-]/gim,"");
 
                var node = document.createElement("button");
                node.setAttribute("class", "conChkBkBtn btn boxable off");
                node.setAttribute("id", "bkBtn");
                node.setAttribute("role", "button");
                node.setAttribute("aria-label", strValue);
                node.innerHTML = strValue;
                node.setAttribute("href", "#");
                node.setAttribute("tabindex", "3");
                node.setAttribute("title-hidden", strValue);
                node.setAttribute("showtime", internalConChkBkBtnData.showtime);
                node.setAttribute("hidetime", internalConChkBkBtnData.hidetime);
                node.setAttribute("seektime", bkBtnSeekTime);
                node.setAttribute("currenttime", media.currentTime);
                node.style.display = "none";
                SPPUtility.buttonWrapper.appendChild(node);

                node.addEventListener("click", function(e) {
                    // rm the hotspot and shape 
                    var shapes = document.getElementsByClassName("shape");
                    var hotSpots = document.getElementsByClassName("hotSpot");
                    if (shapes.length > 0) {
                        var i = 0;
                        while (i < shapes.length) {
                            shapes[i].parentNode.removeChild(shapes[i]);
                        }
                    }
                    if (hotSpots.length > 0) {
                        var i = 0;
                        while (i < hotSpots.length) {
                            hotSpots[i].parentNode.removeChild(hotSpots[i]);
                        }
                    }
                    var bkBtn = node;
                    media.currentTime = SPPUtility.parseTime(this.getAttribute('seektime'));
                    var singleton = 0;
                    setTimeout(function() {
                        var currentTime = document.getElementById("bkBtn").getAttribute("currenttime");
                        tempConceptCheckData.forEach(function(key, value) {

                            if (SPPUtility.between(media.currentTime, key.starttime - buffer, key.endtime - buffer)) {
                                if (singleton == 0) {

                                    bkBtnSeekTime = key.backbtnseektime;
                                    if (bkBtnSeekTime.split(":").length == 2)
                                        bkBtnSeekTime = "00:" + bkBtnSeekTime + ":00";
                                    else if (bkBtnSeekTime.split(":").length == 3)
                                        bkBtnSeekTime = bkBtnSeekTim + ":00";
                                    else if (bkBtnSeekTime.split(":").length == 1)
                                        bkBtnSeekTime = "00:00:" + bkBtnSeekTime + ":00";
                                    bkBtn.setAttribute("seektime", bkBtnSeekTime);
                                    singleton = 1;
                                }
                            }
                        });
                    }, 1000);
                });

            } else {
                if (SPPUtility.between(media.currentTime, SPPUtility.parseTime(document.getElementById("bkBtn").getAttribute('showtime')),
                        SPPUtility.parseTime(document.getElementById("bkBtn").getAttribute('hidetime')))) {
                    document.getElementById("bkBtn").style.display = "inline-block";
                } else {
                    document.getElementById("bkBtn").style.display = "none";
                }
            }
        }
        if (internalConChkData.length > 0) {
            buffer = .20;
            if (SmartPearsonPlayer.properties.currentSpeedRate) {
                    buffer = buffer * SmartPearsonPlayer.properties.currentSpeedRate;
            }
            // MP-8931 - Audio-descriptor internal concept marker timing fix
            var tempConChk = 0;
            var isDVvalue = false;
            for (var conChk = 0; conChk < internalConChkData.length; conChk++) {
                if ((internalConChkData[conChk].starttime &&
                        SPPUtility.between(media.currentTime, SPPUtility.parseTime(internalConChkData[conChk].starttime) - buffer,
                            SPPUtility.parseTime(internalConChkData[conChk].starttime) + buffer)) || (internalConChkData[conChk].showtime && SPPUtility.between(media.currentTime, SPPUtility.parseTime(internalConChkData[conChk].showtime) - buffer,
                        SPPUtility.parseTime(internalConChkData[conChk].showtime) + buffer))) {
                    tempConChk = conChk;
                    var conceptChecktime = SPPUtility.parseTime(internalConChkData[conChk].starttime);
                    var matches = adStarttime.match(internalConChkData[conChk].starttime);       
                    if (matches != null) {
                          isDVvalue = true;
                    }
                    
                    if(descriptionBtn) {
                        descriptionBtnn = document.getElementById("descriptionBtn").value;
                    }
                    //Check whether particular concept check is already open
                    SPPUtility.log(SPPUtility.between(media.currentTime, conceptChecktime - buffer, conceptChecktime + buffer));
                    SPPUtility.log(media.currentTime + "--------" + conceptChecktime);
                    // Pause video @ concept check point
                    if (SPPUtility.between(media.currentTime, conceptChecktime - buffer, conceptChecktime + buffer) && (isDVvalue == true  && descriptionBtnn == "Turn Off Video Description" ) || ( isDVvalue == false  && (descriptionBtnn == "DV- Turn On Video Description" || descriptionBtnn == "Turn On Video Description" )) 
                    || (descriptionBtnn == " " && ADconcept == false) || (clipInfo != "" && ADconcept != "")) 
                    { 
                        if (media.paused == false) {
                            SmartPearsonPlayer.pause();
                        }
                    }

                    // to fix the IE10 trigsted animation issue    
                            if(SPPUtility.getIEVersion() == 10) {  // line number 294 
                                setTimeout(function(){
                                    document.getElementsByClassName("pvp-overlay")[0].classList.add("pvp-quiz-state");
                                 }, 1000);
                            }

                    // preset and calculate to find out the difference between original video size and the rendered video size
                    // find out original video's aspect ratio
                    mezzanineVideoHeight = internalConChkData[conChk].videoheight;
                    mezzanineVideoWidth = internalConChkData[conChk].videowidth;
                    mezVideoAspectRatio = (mezzanineVideoWidth / mezzanineVideoHeight);

                    // find out rendered video's aspect ratio
                    var rendVideoAspectRatio = (media.clientWidth / media.clientHeight);
                    var renderedVideoWidth = media.clientWidth;
                    var renderedVideoHeight = media.clientHeight,
                        paddingTop = 0,
                        paddingLeft = 0;

                    if (rendVideoAspectRatio > mezVideoAspectRatio) {
                        renderedVideoWidth = media.clientHeight * mezVideoAspectRatio;
                        paddingLeft = (media.clientWidth - renderedVideoWidth) / 2;
                    } else if (rendVideoAspectRatio < mezVideoAspectRatio) {
                        renderedVideoHeight = media.clientWidth * (internalConChkData[conChk].videoheight / internalConChkData[conChk].videowidth);
                        paddingTop = (media.clientHeight - renderedVideoHeight) / 2;
                    }
                    var tempInternalCCWidth = media.clientWidth;
                    var tempInternalCCHeight = media.clientHeight;
                    // MP-8931 - Audio-descriptor internal concept marker timing fix
                    media.currentTime = media.currentTime + .4;
                    for (var j = 0; j < internalConChkData[conChk].content.length; j++) {
                        var shapeXml = internalConChkData[conChk].content[j];
                        if (internalConChkData[conChk].jumptime && internalConChkData[conChk].jumptime != "")
                            var matches = jumptime.match(internalConChkData[conChk].jumptime);
                            var isJumpValue = false;       
                            if (matches != null) {
                                isJumpValue = true;
                            }   
                            if(descriptionBtn) {
                                descriptionBtnn = document.getElementById("descriptionBtn").value;
                            }
                            if((isJumpValue == true  && descriptionBtnn == "Turn Off Video Description" ) || ( isJumpValue == false  && (descriptionBtnn == "DV- Turn On Video Description" || descriptionBtnn == "Turn On Video Description" )) || (descriptionBtnn == " " && ADconcept == false) || (clipInfo != "" && ADconcept != "")) {
                                currentInternalCCJumptime = internalConChkData[conChk].jumptime; 
                            }
                            //currentInternalCCJumptime = internalConChkData[conChk].jumptime;
                        // find out the aspect ratio based on the screen size with the original video size.
                        var shapeX = ((shapeXml.xvalue / internalConChkData[conChk].videowidth) * renderedVideoWidth) + paddingLeft;
                        var shapeY = ((shapeXml.yvalue / internalConChkData[conChk].videoheight) * renderedVideoHeight) + paddingTop;
                        var shapeWidth, shapeHeight, shapeLeft, shapeTop, givenHeight, givenWidth, requiredCSS = "",
                            hotSpotLeft;
                        var isButton = 0;
                        switch (shapeXml.shape) {
                            case "rectangle":
                                givenHeight = shapeXml.height;
                                givenWidth = shapeXml.width;
                                isButton = 1;
                                break;
                            case "circle":
                                givenHeight = shapeXml.radius;
                                givenWidth = shapeXml.radius;
                                requiredCSS = "border-radius:100%;";
                                isButton = 1;
                                break;
                            case "button":
                                var buttons = document.getElementsByClassName("conChkBtn");
                                var present = 0;
                                for (var i = 0; i < buttons.length; i++) {
                                    if (buttons[i].innerHTML == shapeXml.value) {
                                        present = 1;
                                    }
                                }
                                if (present == 0) {
                                    SPPUtility.log(shapeXml);
                                    var node = document.createElement("button");
                                    //MP-7204
                                    var str = shapeXml.value;
                                    var strValue = str.replace(/[^a-z0-9áéíóúñü \.,:;()_-]/gim,"");

                                    node.setAttribute("class", "conChkBtn btn boxable off");
                                    node.setAttribute("role", "button");
                                    node.setAttribute("aria-label", strValue);
                                    node.setAttribute("href", "#");
                                    node.setAttribute("tabindex", "3");
                                    node.setAttribute("title-hidden", strValue);
                                    node.setAttribute("seektime", shapeXml.seektime);
                                    node.setAttribute("showtime", shapeXml.showtime);
                                    node.setAttribute("endtime", shapeXml.endtime);
                                    // if content provider missed to give hidetime then generate the hidetime 1 minute from the starttime.
                                    var btnHideTime = shapeXml.hidetime;
                                    if (!btnHideTime && shapeXml.showtime) {
                                        shapeXml.hidetime = shapeXml.showtime;
                                        var splitTime = shapeXml.showtime.split(":");
                                        if (splitTime.length == 4) {
                                            btnHideTime = (parseInt(splitTime[2]) + 1) > 9 ? (parseInt(splitTime[2]) + 1) : "0" + (parseInt(splitTime[2]) + 1);
                                            shapeXml.hidetime = shapeXml.hidetime.replace(splitTime[2], btnHideTime);
                                        }
                                    }
                                    node.setAttribute("hidetime", shapeXml.hidetime);
                                    node.setAttribute("backbtnseektime", shapeXml.backbtnseektime);
                                    node.innerHTML = strValue;
                                    SPPUtility.buttonWrapper.appendChild(node);
                                    node.addEventListener("click", function(e) {

                                        // play the video
                                        if (media.paused == true) {
                                            SmartPearsonPlayer.play();
                                        }
                                        if (typeof this.getAttribute('backbtnseektime') != "undefined" && this.getAttribute('backbtnseektime') != "undefined")
                                            document.getElementById("bkBtn").setAttribute('seektime', this.getAttribute('backbtnseektime'));
                                        media.currentTime = SPPUtility.parseTime(this.getAttribute("seektime"));
                                        currentInternalCCAnsEndTime = SPPUtility.parseTime(this.getAttribute('endtime'));
                                    });

                                }

                                isButton = 1;
                                break;
                            default:
                                break;
                        }
                        if (internalConChkData[conChk].content[j].shape != "button") {
                            shapeWidth = Math.round((parseInt(givenWidth) / internalConChkData[conChk].videowidth) * renderedVideoWidth);
                            shapeHeight = Math.round((parseInt(givenHeight) / internalConChkData[conChk].videoheight) * renderedVideoHeight);
                            // form the user clickable area. 
                            shapeLeft = ((Math.round(parseInt(shapeXml.xvalue) - (givenWidth / 2)) / internalConChkData[conChk].videowidth) * renderedVideoWidth) + paddingLeft;
                            shapeTop = ((Math.round(parseInt(shapeXml.yvalue) - (givenHeight / 2)) / internalConChkData[conChk].videoheight) * renderedVideoHeight) + paddingTop;
                            var shape = document.createElement("div");
                            shape.setAttribute("class", "shape");
                            shape.setAttribute("style", requiredCSS + "height:" + shapeHeight + "px;width:" + shapeWidth + "px;position:absolute;left:" + shapeLeft + "px;top:" + shapeTop + "px;cursor:pointer;z-index:5001;'");
                            shape.setAttribute("starttime", internalConChkData[conChk].content[j].starttime);
                            shape.setAttribute("endtime", internalConChkData[conChk].content[j].endtime);
                            shape.setAttribute("backbtnseektime", internalConChkData[conChk].content[j].backbtnseektime);
                            videoWrapper.appendChild(shape);
                            var hotSpot = document.createElement("div");
                            hotSpot.setAttribute("class", "hotSpot");
                            hotSpotLeft = Math.round((parseInt(parseInt(internalConChkData[conChk].content[j].xoffset)) / internalConChkData[conChk].videoheight) * renderedVideoHeight) + paddingLeft;
                            hotSpot.setAttribute("style", "height:0px;width:0px;padding:0px;top:" + shapeY + "px;left:" + hotSpotLeft + "px;");
                            hotSpot.setAttribute("shapetop", shapeY);
                            hotSpot.setAttribute("shapeleft", hotSpotLeft);
                            hotSpot.setAttribute("shapewidth", shapeWidth);
                            hotSpot.setAttribute("shapeheight", shapeHeight);
                            videoWrapper.appendChild(hotSpot);

                        }
                    }

                    var bindShapeEvents = document.getElementsByClassName("shape");
                    // to be written
                    Array.prototype.forEach.call(bindShapeEvents, function(eachShape, index) {

                        var timerObj, size, circle;

                        function close(circle) {
                            if (circle) {
                                circle.style.padding = "0px";
                                circle.style.width = "0px";
                                circle.style.height = "0px";
                                circle.style.top = circle.getAttribute("shapetop") + "px";
                                circle.style.left = circle.getAttribute("shapeLeft") + "px";
                            }
                        }

                        function open(circle) {
                            if (circle) {
                                circle.style.padding = "0px";
                                circle.style.width = size;
                                circle.style.height = size;
                                circle.style.top = circle.getAttribute("shapetop") - (size / 2) + "px";
                                circle.style.left = circle.getAttribute("shapeleft") - (size / 2) + "px";
                            }
                        }

                        function animateHotSpot(obj) {
                            circle = obj;
                            size = 90;
                            timerObj = setInterval(function() {
                                if (circle.clientWidth < (size - 1)) {
                                    open(circle);
                                } else {
                                    close(circle);
                                }
                            }, 700);
                        }

                        eachShape.addEventListener("mouseover", function(e) {
                            animateHotSpot(this.nextSibling);
                        });

                        eachShape.addEventListener("mouseout", function(e) {
                            clearInterval(timerObj);
                            if (this.nextSibling) {
                                close(this.nextSibling);
                                this.nextSibling.style.padding = "0px";
                            }
                        });
                        eachShape.addEventListener("click", function(e) {

                            if (typeof this.getAttribute("backbtnseektime") != "undefined" && this.getAttribute("backbtnseektime") != "undefined" && document.getElementById("bkBtn"))
                                document.getElementById("bkBtn").setAttribute("seektime", this.getAttribute("backbtnseektime"));
                            var shapes = document.getElementsByClassName("shape");
                            var hotSpots = document.getElementsByClassName("hotSpot");
                            if (shapes.length > 0) {
                                var i = 0;
                                while (i < shapes.length) {
                                    shapes[i].parentNode.removeChild(shapes[i]);
                                }
                            }
                            if (hotSpots.length > 0) {
                                var i = 0;
                                while (i < hotSpots.length) {
                                    hotSpots[i].parentNode.removeChild(hotSpots[i]);
                                }
                            }
                            //close(this.nextSibling);
                            // to uncomment
                            // document.getElementsByClassName("conChkBkBtn")[0].setAttribute("seektime",this.getAttribute("backbtnseektime"));
                            if (media.paused == true) {
                                SmartPearsonPlayer.play();
                            }
                            media.currentTime = SPPUtility.parseTime(this.getAttribute("starttime"));
                            currentInternalCCAnsEndTime = SPPUtility.parseTime(this.getAttribute("endtime"));

                            //when end time reached remove the back button and move the header to first
                            var clipData = SPPUtility.getClipData();
                            if (clipData && clipData.MediaControl && clipData.MediaControl.timeData && clipData.MediaControl.timeData.length > 0) {
                                // clipData.BookModule.checkAndShowCustomButton(index,currentInternalCCAnsEndTime);
                                clipData.BookModule.stopCC(currentInternalCCAnsEndTime);
                            }
                        });
                    });

                }
            }
            if (typeof(currentInternalCCAnsEndTime) != 'undefined' && SPPUtility.between(media.currentTime, currentInternalCCAnsEndTime - buffer, currentInternalCCAnsEndTime + buffer)) {
                if (currentInternalCCJumptime != "")
                    media.currentTime = SPPUtility.parseTime(currentInternalCCJumptime);
                else {
                    if (media.paused == false)
                        SmartPearsonPlayer.pause();
                }
            }
        }
        // internal concept check :: remove the buttons when it is not needed
        var conChkBtns = document.getElementsByClassName("conChkBtn");
        // to be written
        Array.prototype.forEach.call(conChkBtns, function(eachBtn) {
            if (!SPPUtility.between(media.currentTime, SPPUtility.parseTime(eachBtn.getAttribute('showtime')) - buffer,
                    SPPUtility.parseTime(eachBtn.getAttribute('hidetime')) + buffer)) {
                eachBtn.parentNode.removeChild(eachBtn);
            }
        });

    }
    // bind the play back progress
    media.addEventListener("timeupdate", onMediaPlaying);
    videoResize = function() {
        resizeQuizElements();
        videoHeight = media.clientHeight;
        videoWidth = media.clientWidth;
    };
    window.addEventListener("resize", function() {
        setTimeout(function() {
            videoResize();
        }, 210);
    });

    resizeQuizElements = function() {
        var shapes = document.getElementsByClassName("shape");
        var clipData = SPPUtility.getClipData();
        if (clipData && clipData.MediaControl && clipData.MediaControl.timeData && clipData.MediaControl.timeData.length > 0) {
            var resizeCheck =clipData.BookModule._fullscreenEnabled()
            if(resizeCheck){
                clipData.BookModule.bogusBtnDisplayed=false;
            }
            else{
                clipData.BookModule.bogusBtnDisplayed=true;
            }
            clipData.BookModule.clipVideoResize();
            if (!shapes)
                return;
        }

        // resize shapes and hotspots relative to the video
        var shapeHeight, shapeWidth, shapeLeft, shapeTop;
        var tempPrevVideoWidth = videoWidth,
            tempPrevVideoHeight = videoHeight;
        Array.prototype.forEach.call(shapes, function(eachShape) {
            var videoAspectRatio = (mezzanineVideoWidth / mezzanineVideoHeight);
            var screenAspectRatio = (media.clientWidth / media.clientHeight),
                videoRenderedWidth = media.clientWidth,
                videoRenderedHeight = media.clientHeight,
                paddingTop = 0,
                paddingLeft = 0;
            if (screenAspectRatio > videoAspectRatio) {
                videoRenderedWidth = media.clientHeight * videoAspectRatio;
                paddingLeft = (media.clientWidth - videoRenderedWidth) / 2;
            } else if (screenAspectRatio < videoAspectRatio) {
                videoRenderedHeight = media.clientWidth * (mezzanineVideoHeight / mezzanineVideoWidth);
                paddingTop = (media.clientHeight - videoRenderedHeight) / 2;
            }
            var previousVideoAspectRatio = (tempPrevVideoWidth / tempPrevVideoHeight),
                retainPaddingLeft = 0,
                retainPaddingTop = 0;
            if (previousVideoAspectRatio > videoAspectRatio) {
                videoWidth = videoHeight * videoAspectRatio;
                retainPaddingLeft = (tempPrevVideoWidth - videoWidth) / 2;
            } else if (previousVideoAspectRatio < videoAspectRatio) {
                videoHeight = videoWidth * (mezzanineVideoHeight / mezzanineVideoWidth);
                retainPaddingTop = (tempPrevVideoHeight - videoHeight) / 2;
            }

            var newShapeHeight = (parseFloat(eachShape.style.height) / videoHeight) * videoRenderedHeight;
            var newShapeWidth = (parseFloat(eachShape.style.width) / videoWidth) * videoRenderedWidth;
            var newShapeTop = (((parseFloat(eachShape.style.top) - retainPaddingTop) / videoHeight) * videoRenderedHeight) + paddingTop;
            var newShapeLeft = (((parseFloat(eachShape.style.left) - retainPaddingLeft) / videoWidth) * videoRenderedWidth) + paddingLeft;



            eachShape.setAttribute("style", "height:" + newShapeHeight + "px;width:" + newShapeWidth + "px;position:absolute;left:" + newShapeLeft + "px;top:" + newShapeTop + "px;cursor:pointer;z-index:5001;'");
            var newShapeY = (((parseFloat(eachShape.nextSibling.getAttribute("shapetop")) - retainPaddingTop) / videoHeight) * videoRenderedHeight) + paddingTop;
            var newShapeX = (((parseFloat(eachShape.nextSibling.getAttribute("shapeleft")) - retainPaddingLeft) / videoWidth) * videoRenderedWidth) + paddingLeft;

            eachShape.nextSibling.setAttribute("style", "height:0px;width:0px;padding:0px;left:" + newShapeX + "px;top:" + newShapeY + "px");
            eachShape.nextSibling.setAttribute("shapeleft", newShapeX);
            eachShape.nextSibling.setAttribute("shapetop", newShapeY);
            eachShape.nextSibling.setAttribute("shapewidth", newShapeWidth);
            eachShape.nextSibling.setAttribute("shapeheight", newShapeHeight);

        });

    };

    return {
        videoResize: videoResize,
        martinGayFn: clipNavFunctionality
    }


})();

    function martinGay(data) {


    if (arguments.callee._singletonInstance) {
        return arguments.callee._singletonInstance;
    }

    arguments.callee._singletonInstance = this;

    var xmlDoc = conchkXml;

    //console.log("",)xmlDoc.getElementsByTagName("navigation")[0].childNodes[0].nodeValue
    //xmlDoc.getElementsByTagName("chapter").length

    /*  BOOKS contain SECTIONS
    SECTION contain CLIPS
    CLIPS contain SUBCLIPS
     */
	//TimePause Blog UI Icon
	var timePauseIcon = document.getElementById('timePauseIcon'); 
	var timePauseUI = document.getElementById('timePauseUI'); 
	var submitBtnIn = document.getElementById('submitBtnIn'); 
	var closeBtn = document.getElementById('closeBtn'); 
	var hours = document.getElementById('hours'); 
	var minutes = document.getElementById('minutes'); 
	var seconds = document.getElementById('seconds'); 
	var hoursVal, minutesVal, secondsVal; 
	
	//Create pausetime blog array
	var pausetimeblog = [];

    var chapterArray = [];
	function onMediaPlaying() {
	 console.log("media playing");
	}

    function Book() {
        this.Sections = [];
        this.videoHeight = '';
        this.videoWidth = '';
        this.skipStartTime = '';
        this.skipEndtime = '';
        this.pauseTime = [];
        this.navButtons = [];
        this.videoHeight = '';
        this.videoWidth = '';
        this.customBtnHandler = [];
    }

    function Section() {
        this.name = '';
        this.description = '';
        this.clips = [];
        this.timeStamps = [];
        this.backBtnHandler = [];
    }

    function Clip() {
        this.subClips = [];
        this.startTime = '';
        this.endTime = '';
        this.description = "";
        this.subClipIDs = [];

    }

    function SubClip() {
        this.name = '';
        this.id = '';
        this.startTime = '';
        this.endTime = '';
        this.parentClipId = '';
    }

    function ConceptCheck() {
        this.description = '';
        this.startTime = '';
        this.endTime = '';
        this.ConceptMarkers = [];
    }

    function ConceptMarker() {
        this.buttonShape = '';
        this.startTime = '';
        this.endTime = '';
        this.x = '';
        this.y = '';
        this.width = '';
        this.height = '';
        this.backbtnSeekTime = '';
        this.backBtnHandler = [];
    }

    function mediaButton() {
        this.value = "";
        this.x = '';
        this.className = '';
        this.y = '';
        this.src = '';
        this.width = '';
        this.height = ''
        this.action = '';
        this.showTime = "";
        this.seekTime = "";
        this.hideTime = '';
        this.bgcolor = '';
        this.fgcolor = '';
        this.border = '';
    }

    var ControlMedia = {
        x: 200,
        y: 400,
        clipIndex: null,
        timeData: [],
        userActive: false,
        drawCanvas: function(data) {
            this.media = document.getElementsByTagName('video')[0];
            this.setSourceData(data);
            // preset all the clip info so that the player will act accordingly...
            if (clipInfo == "") {
                this.drawClipNavigation();
            } 
            this.addHandlers();
            var self = this;
            var seekFlag = false;
            //this.media.addEventListener("seeking", (function(){ return function(evt){alert('event'+evt)}})());
            this.media.addEventListener("seeking", (function(){
                    return function(){
                       // seekFlag = true;
                    }
            })(self));

            this.media.addEventListener("seeked", (function(self) {
                return function() {
                    console.log('inside seeked event 729');
                     if(currentBook.pauseTime.length > 0 && Book.playVideoEvent !== true){
                         //Loop through the array and check and update the current
                         //var tmpArray = currentBook.pauseTime.map(function(elem){return Book.convertToSeconds(elem)})

                          var tempIndex = currentBook.pauseTime.curr ;
                         if(SmartPearsonPlayer.properties['media'].currentTime < Book.convertToSeconds(currentBook.pauseTime[0]) && Book.PauseEventListener !== ""){
                            currentBook.pauseTime.curr = 0;
                             Book.pauseVideoTrigger(currentBook.pauseTime[currentBook.pauseTime.curr]);
                         }
                         else if(SmartPearsonPlayer.properties['media'].currentTime > Book.convertToSeconds(currentBook.pauseTime[currentBook.pauseTime.length-1])){
                            //MP-6114 if condition added
                            if (typeof (Book.PauseEventListener) != 'undefined' && Book.PauseEventListener != null && Book.PauseEventListener != '') {
                                self.media.removeEventListener("timeupdate",Book.PauseEventListener,false);
                                Book.PauseEventListener = "";
                            }
                         }
                         else
                         {
                             for (var i=0,j=1;i<currentBook.pauseTime.length-1;i++,j++){
                                if(SPPUtility.between(SmartPearsonPlayer.properties['media'].currentTime,Book.convertToSeconds(currentBook.pauseTime[i]),
                                        Book.convertToSeconds(currentBook.pauseTime[j]))){ 

                                       // if(currentBook.pauseTime.curr < currentBook.pauseTime.length*1-1 )
                                         //   currentBook.pauseTime.next();
                                         currentBook.pauseTime.curr = j;
                                         console.log("CURRENT is", currentBook.pauseTime.curr);
                                        break;
                                }
                            }
                            //MP-6114 if condition added
                            if (typeof (Book.PauseEventListener) != 'undefined' && Book.PauseEventListener != null && Book.PauseEventListener != '') {
                                self.media.removeEventListener("timeupdate",Book.PauseEventListener,false);
                                Book.PauseEventListener = "";
                            }
                            Book.pauseVideoTrigger(currentBook.pauseTime[currentBook.pauseTime.curr]);
                         }
                }
                Book.playVideoEvent = false;

                    var currBtnObj = currentBook.customBtnHandler[0];
                    if (currentBook.customBtnHandler[0] !== "" && currentBook.customBtnHandler.length>0 && Book.BogusBtnListener == null && Book.BogusCloseBtnListener !== null && (document.getElementById('restart') !== "")) {

                        if (SmartPearsonPlayer.properties['media'].currentTime < Book.convertToSeconds(currBtnObj.showTime) ||
                            SmartPearsonPlayer.properties['media'].currentTime > Book.convertToSeconds(currBtnObj.endTime)
                        ) {
                            this.removeEventListener('timeupdate', Book.BogusCloseBtnListener, false);
                            Book.BogusCloseBtnListener = null;

                            var element = document.getElementById('restart');
                            if (element !== null)
                                element.parentNode.removeChild(element);
                            Book.bogusBtnDisplayed = false;
                            Book.BogusBtnListener = null;
                            Book.BogusCloseBtnListener = null;

                            Book.showCustomBackButton(currBtnObj);
                            Book.checkAndDrawBogusBtn('#customBtnHolder',currBtnObj);
                           
                        }
                    } else if (currentBook.customBtnHandler[0] !== "" && currentBook.customBtnHandler.length>0  && Book.BogusBtnListener == null) {
                        Book.showCustomBackButton(currBtnObj);
                        if(Book.bogusBtnDisplayed ==false){
                            Book.checkAndDrawBogusBtn('#customBtnHolder',currBtnObj);
                        }
                    }

                   //console.log("getCurrFrameAndDisplayPrevAndNext SEEKING Condition IS",self.timeData.curr);                
                    self.getCurrFrameAndDisplayPrevAndNext();
                }
            })(self));
        },
        setUserActive: function(bool) {
            this.userActive = bool;
        },
        getUserActive: function(bool) {
            return this.userActive;
        },
        showClipControl: function(value) {
            var mediaPlayer = document.querySelector('#mediaControl');
            mediaPlayer.style.display = value;

        },

        addMultipleListeners: function(element, events, handler, useCapture, args) {
            if (!(events instanceof Array)) {
                throw 'addMultipleListeners: ' +
                'please supply an array of eventstrings ' +
                '(like ["click","mouseover"])';
            }
            //create a wrapper for to be able to use additional arguments
            var handlerFn = function(e) {
                handler.apply(this, args && args instanceof Array ? args : []);
            }
            for (var i = 0; i < events.length; i += 1) {
                element.addEventListener(events[i], handlerFn, useCapture);
            }
        },


        hideAndshowClipNavControl: function() {
            var mediaPlayer = document.querySelector('#videoWrapper');
            if (SmartPearsonPlayer.properties['media'].currentTime > 0 && !SmartPearsonPlayer.properties['media'].paused && !SmartPearsonPlayer.properties['media'].ended && SmartPearsonPlayer.properties['media'].readyState > 2) {
                var interval = 1;
                var checkIdleEvent = '';

                function IdleCheckerFn() {
                    checkIdleEvent = setInterval(function() {

                        if (interval == 5) {
                            /* if intervall reaches 5 the user is inactive hide element/s */

                            document.querySelector('#mediaControl').style.display = 'none';
                            interval = 1;
                        }
                        interval = interval + 1;

                    }, 1000);
                }

                IdleCheckerFn();
                this.addMultipleListeners(document.querySelector('#videoWrapper'), ['mousemove', 'keypress'], (function(self) {
                    return function() {
                        document.querySelector('#mediaControl').style.display = 'block';
                        interval = 1;
                        //Restart Trigger again
                        clearInterval(checkIdleEvent);
                        IdleCheckerFn();
                    }
                })(this))
            }
        },
        getCssValuePrefix: function(fgcolor, bgcolor) {
            var rtrnVal = ''; //default to standard syntax
            var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

            // Create a temporary DOM object for testing
            var dom = document.createElement('div');

            for (var i = 0; i < prefixes.length; i++) {
                // Attempt to set the style
                dom.style.background = prefixes[i] + 'liner-gradient(#000000, #ffffff)';

                // Detect if the style was successfully set
                if (dom.style.background) {
                    rtrnVal = prefixes[i];
                }
            }

            dom = null;
            delete dom;

            return rtrnVal;
        },

        drawClipNavigation: function() {
            var self = this;
            currentBook.navButtons.forEach(function(index) {
                if (index.action == 'Main') {
                    var iDiv = document.createElement('div');
                    iDiv.id = 'returnBtn';
                    iDiv.className = index.className;
                    iDiv.innerHTML = index.value;

                    iDiv.style.lineHeight = index.height + 'px';
                    //iDiv.style.color=index.fgcolor;
                    iDiv.style.background = index.bgcolor;
                    iDiv.setAttribute("aria-label", index.value + " Button");
                    iDiv.setAttribute("tabindex", 18);
                    iDiv.setAttribute("role","Button");

                    document.querySelector('#homeBtnHolder').appendChild(iDiv);
                    self.positionNavButtons('#homeBtnHolder',index);
                } else if (index.action == 'left') {
                    var iDiv = document.createElement('div');
                    iDiv.id = 'prevTime';
                    iDiv.className = index.className;
                    iDiv.style.background = index.bgcolor;
                    iDiv.style.width = index.width;
                    iDiv.style.height = index.height;
                    iDiv.setAttribute("aria-label", "Seek Previous Section");
                    iDiv.setAttribute("tabindex", 18);
                    iDiv.style.lineHeight = index.height + "px";
                    iDiv.style.background = index.bgcolor;
                    iDiv.setAttribute("role","button");

                    document.querySelector('#prevBtnHolder').appendChild(iDiv);

                    self.positionNavButtons('#prevBtnHolder',index);
                   

                } else if (index.action == 'right') {

                    var iDiv = document.createElement('div');
                    iDiv.id = 'nxtTime';
                    iDiv.className = index.className;
                    iDiv.style.width = index.width;
                    iDiv.style.height = index.height;
                    iDiv.style.lineHeight = index.height + "px";
                    iDiv.style.background = index.bgcolor;
                    iDiv.setAttribute("aria-label", "Seek Next Section");
                    iDiv.setAttribute("tabindex", 18);
                    iDiv.setAttribute("role","button");
                    //iDiv.style.background = index.bgcolor;


                    document.querySelector('#nextBtnHolder').appendChild(iDiv);
                    self.positionNavButtons('#nextBtnHolder',index);
                 

                } else if (index.action == 'Custom') {

                    var currentSectionBack = new ButtonBack();
                    currentSectionBack.showTime = index.showTime;
                    currentSectionBack.seekTime = index.seekTime;
                    currentSectionBack.endTime = index.hideTime;
                    currentSectionBack.value = index.value;
                    currentSectionBack.width = index.width;
                    currentSectionBack.height = index.height;
                    currentSectionBack.arialabel = index.value + " Button";
                    currentSectionBack.tabindex = 18;
                    currentSectionBack.fgcolor = index.fgcolor;
                    currentSectionBack.bgcolor = index.bgcolor;
                    currentSectionBack.xvalue = index.x;
                    currentSectionBack.yvalue = index.y;
                    currentSectionBack.className = index.className;
                    currentSectionBack.color = index.color;
                    currentSectionBack.role="button";

                    currentBook.customBtnHandler.push(currentSectionBack);
                }

            }, self)
        },

        positionNavButtons:function(placeHolder,btnObj){
            document.querySelector(placeHolder).style.left = (btnObj.x / currentBook.videoWidth) * this.media.clientWidth + "px";
            document.querySelector(placeHolder).style.top = (btnObj.y / currentBook.videoHeight) * this.media.clientHeight + "px";
            document.querySelector(placeHolder).style.lineHeight = btnObj.height + "px";
            document.querySelector(placeHolder).style.width = (btnObj.width / currentBook.videoWidth) * this.media.clientWidth + "px";
            document.querySelector(placeHolder).style.height = (btnObj.height / currentBook.videoHeight) * this.media.clientHeight + "px";
        },
        setSourceData: function(data) {
            var self = this;
            this.data = data;			
            this.data.map(function(obj) {				
                if (obj.clips.subClips !== undefined && obj.clips.subClips !== null) {
                    if (obj.clips.subClips.length > 0) {
                        var temp = {
                            description: obj.clips.description,
                            parentClipId: obj.clips.parentClipId,
                            type: 'parentClip',
                            endTime: obj.clips.endTime,
                            startTime: obj.clips.startTime,
                            chapterEndtime: obj.clips.endTime
                        }
                        self.timeData.push(temp);
                        self.timeData.push(obj.clips.subClips);
                    }
                } else {
                    var temp = {
                        description: obj.clips.name,
                        type: 'conceptCheck',
                        endTime: obj.clips.ConceptMarkers[obj.clips.ConceptMarkers.length - 1].endTime,
                        startTime: obj.clips.startTime,
                        ConceptEndtime: obj.clips.endTime
                    }
                    self.timeData.push(temp);
                }
            });

            var mergedTime = [].concat.apply([], this.timeData);
            var tempTime = [];

            tempTime.push.apply(tempTime, mergedTime);
            this.timeData = this.iterifyArr(tempTime);

        },

        iterifyArr: function(arr) {
            arr.curr = 0;
            arr.next = (function() {
                return (++arr.curr >= this.length) ? false : this[arr.curr];
            });
            arr.prev = (function() {
                return (--arr.curr < 0) ? false : this[arr.curr];
            });
            return arr;
        },

        getIndexIfObjWithOwnAttr: function(array, attr, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        },

        syncTimeData: function() {
            function parentIDfilter(obj) {
                return obj.parentClipId == this.parentClipID;
            }
            var filtered = this.timeData.filter(parentIDfilter);
            var self = this;

            if (this.clipIndex == null) {
                this.clipIndex = this.getIndexIfObjWithOwnAttr(this.timeData, 'parentClipId', this.parentClipID);
                this.timeData.curr = this.clipIndex;
            }
		},

        setParentclipID: function(id) {
            this.parentClipID = id;
        },

        goPrevious: function(evt) {
			var media = document.getElementsByTagName('video')[0]; //Bug MP-5699			
            var currTimeIndex = '';
            var me = this.timeData.some(function(obj, index) {
                     if(obj.type !=='parentClip'){
						//Bug MP-5699 : Section Menu is disappearing ( when you are in the last section, the previous section button is not working) 
						var objEndTime = (obj.endTime =='00:00:00:00') ? media.duration : Book.convertToSeconds(obj.endTime);
						//
                        if (SmartPearsonPlayer.properties['media'].currentTime > Book.convertToSeconds(obj.startTime) && 
								SmartPearsonPlayer.properties['media'].currentTime < objEndTime ) {
								currTimeIndex = index;
								return currTimeIndex;
						}
											
						
                 }
            })
            //MP-6107 starts
            if(currTimeIndex == "" ){
                var me = this.timeData.some(function(obj, index) {
                    if(obj.type !=='parentClip'){
                        currTimeIndex = index;
                    }
                })
            }
            //MP-6107 ends
            
            if (Book.conceptChoiceArray.length > 0) {
                Book.emptyConceptChoiceArray();
            }

            this.timeData.curr = currTimeIndex;
            var prev = this.timeData.prev();
            if(prev.type == 'parentClip'){
                prev = this.timeData.prev();
            }

            if(currentBook.pauseTime.length>0){
                if(Book.PauseEventListener !== ""){ 
                           this.media.removeEventListener("timeupdate",Book.PauseEventListener,false);
                           Book.PauseEventListener = "";
                }
            }

            Book.playVideo(prev.startTime);

            if (this.timeData.curr <= this.timeData.length * 1 - 2 && this.timeData.curr > 0) {
                document.querySelector('#nextBtnHolder').style.display = 'inline-block';
            }
        },
        getCurrFrameAndDisplayPrevAndNext: function(flag) {

            // To check the navigation button availability to pauseTime to work independently from the Martin-Gay navigation buttons 
            if(currentBook.navButtons.length  == 0){
                return false;
            }

            if(this.media.duration == this.media.currentTime){
                 document.querySelector('#nextBtnHolder').style.display = 'none';
                document.querySelector('#prevBtnHolder').style.display = 'none';
                return;
            }
            
            var currTimeIndex = '';            
            var self = this;
            var me = self.timeData.some(function(obj, index) {
                 if(obj.type !=='parentClip'){
                     // console.log('checking currentINDEX inside',index,'obj',Book.convertToSeconds(obj.startTime),"SmartPearsonPlayer.properties['media'].currentTime ",SmartPearsonPlayer.properties['media'].currentTime ,'obj',Book.convertToSeconds(obj.endTime));
                    if (SmartPearsonPlayer.properties['media'].currentTime > Book.convertToSeconds(obj.startTime) && SmartPearsonPlayer.properties['media'].currentTime < Book.convertToSeconds(obj.endTime)) {
                        currTimeIndex = index;
                       // console.log('checking currentINDEX inside',currTimeIndex);
                        return currTimeIndex;
                    }
                 }
            })

            if (currTimeIndex !== "")
                this.timeData.curr = currTimeIndex;
            else
                this.timeData.curr = 0;

            //if currentTime is less than second clip starttime - dont show previous
            //if in the last but one clip - dont show next button

            if (this.timeData.curr == this.timeData.length * 1 - 1 && this.timeData.curr > 0) {
                document.querySelector('#nextBtnHolder').style.display = 'none';
                document.querySelector('#prevBtnHolder').style.display = 'inline-block';
            } else if (this.timeData.curr == 0 && SmartPearsonPlayer.properties['media'].currentTime < Book.convertToSeconds(this.timeData[2].startTime)) {
                document.querySelector('#prevBtnHolder ').style.display = 'none';
                document.querySelector('#nextBtnHolder').style.display = 'inline-block';
            } 
			else {	
			   if(SmartPearsonPlayer.properties['media'].currentTime >= Book.convertToSeconds(this.timeData[1].endTime)) 
				   document.querySelector('#prevBtnHolder').style.display = 'inline-block';
			   else
				   document.querySelector('#prevBtnHolder').style.display = 'none';
			   
                document.querySelector('#nextBtnHolder').style.display = 'inline-block';
            }
			if (Book.conceptChoiceArray.length > 0) {
                Book.emptyConceptChoiceArray();
            }

        },
        goNext: function(evt) {           

            var currTimeIndex = '';
            var me = this.timeData.some(function(obj, index) {
                if(obj.type !=='parentClip'){
                    if (SmartPearsonPlayer.properties['media'].currentTime > Book.convertToSeconds(obj.startTime) && SmartPearsonPlayer.properties['media'].currentTime < Book.convertToSeconds(obj.endTime)) {
                        currTimeIndex = index;
                        return currTimeIndex;
                    }
                }
            })


             
            if (Book.conceptChoiceArray.length > 0) {
                Book.emptyConceptChoiceArray();
            }

            //var next = this.timeData.next();
            this.timeData.curr = currTimeIndex;

          
            
            var next = this.timeData.next();
            if(next.type == 'parentClip'){
                next = this.timeData.next();
            }
             
            if(currentBook.pauseTime.length > 0){
                if(Book.PauseEventListener !== ""){                         
                         console.log('call from goNEXT');
                           this.media.removeEventListener("timeupdate",Book.PauseEventListener,false);
                           Book.PauseEventListener = "";
                }
            }


            Book.playVideo(next.startTime);
             
            if (this.timeData.curr == this.timeData.length * 1 - 1 && this.timeData.curr > 0) {
                document.querySelector('#nextBtnHolder').style.display = 'none';
                document.querySelector('#prevBtnHolder').style.display = 'inline-block';				
            }

            if (currentBook.customBtnHandler[0] == "" && currentBook.customBtnHandler.length>0 ) {
                return;
            }
            //No more active triggers for showing bogus butn
            if (Book.BogusBtnListener !== null) {
                return;
            }
            

        },
        goHome: function() {
            if (SmartPearsonPlayer.properties['media'].currentTime == '0' && this.media.paused == true) {
                return;
            }
            document.querySelector('#prevBtnHolder').style.display = 'none';
            SmartPearsonPlayer.properties['media'].currentTime = 0;
            SmartPearsonPlayer.pause(true);
            SPPChaptering.toggleChapter();
            this.timeData.curr = 0;
            var progress = document.getElementById("progress");
            var scrubber = document.getElementById("progressBarHandle");
            var captionText = document.getElementsByClassName("captionText")[0];
            //MP-6623 timeCounter variable added
            var timeCounter = document.getElementById("counter-time");
            captionText.innerHTML="";
            scrubber.style.left = 0;
            progress.style.width = 0;
            //MP-6623 
            timeCounter.innerHTML = SPPUtility.convertVideoTime(SmartPearsonPlayer.properties['media'].currentTime);      
            Book.emptyConceptChoiceArray();
            document.querySelector('#returnBtn').style.display = "inline-block";
            //MP-6623
            this.media.load();
            this.media.setAttribute('poster', this.media.getAttribute('poster'));
        },

        addHandlers: function() {
            var self = this;

            function prevHandler() {
                self.goPrevious();
            }

            function nextHandler() {
                self.goNext();
            }

            function restartAgain() {
                self.goHome();
            }

            function ClickHandler(e) {
                var that = document.activeElement;
                that.parentNode.setAttribute('data-double', 0);
                setTimeout(function() {
                    var dblclick = parseInt(that.parentNode.getAttribute('data-double'), 10)
                    if (dblclick > 0) {
                        that.setAttribute('data-double', dblclick - 1);
                    } else {
                        //prevHandler.call(that, e);
                        that.handlerParam.call(that, e);
                    }
                }, 300)
            }

            if(document.querySelector('#prevTime')){
                document.querySelector('#prevTime').addEventListener('click', ClickHandler);
                document.querySelector('#prevTime').addEventListener('keyup', function(e) {
                    if (e.keyCode == 13)
                        ClickHandler(e);
                });
                document.querySelector('#prevTime').handlerParam = prevHandler;
            }

            if(document.querySelector('#nxtTime')){
                document.querySelector('#nxtTime').addEventListener('click', ClickHandler);
                document.querySelector('#nxtTime').addEventListener('keyup', function(e) {
                    if (e.keyCode == 13)
                        ClickHandler(e);
                });
                document.querySelector('#nxtTime').handlerParam = nextHandler;
            }

            if(document.querySelector('#returnBtn')){
                document.querySelector('#returnBtn').addEventListener('click', ClickHandler);
                document.querySelector('#returnBtn').addEventListener('keyup', function(e) {
                    if (e.keyCode == 13)
                        ClickHandler(e);
                });
                document.querySelector('#returnBtn').handlerParam = restartAgain;
            }

            /* document.querySelector('#nxtTime').addEventListener('click',function(e){
                 var that = this;
                 that.parentNode.setAttribute('data-double',0);
                 setTimeout(function(){
                     var dblclick = parseInt(that.parentNode.getAttribute('data-double'),10);
                     if (dblclick > 0) {
                         that.setAttribute('data-double',dblclick-1);
                     } else {
                         nextHandler.call(that, e);
                     }
                 },300)
             }); 
             
             document.querySelector('#returnBtn').addEventListener('click',function(e){
                 var that = this;
                 that.parentNode.setAttribute('data-double',0);
                 setTimeout(function(){
                     var dblclick = parseInt(that.parentNode.getAttribute('data-double'),10)
                     if (dblclick > 0) {
                         that.setAttribute('data-double',dblclick-1);
                     } else {
                         restartAgain.call(that, e);
                     }
                 },300)
             }); 
             */
         if(document.querySelector('#nxtTime')){
                document.getElementById('nxtTime').addEventListener('dblclick', function(evt) {
                    this.parentNode.setAttribute('data-double', 2);
                    evt.stopPropagation();
                    evt.preventDefault();
                });
          }
          if(document.querySelector('#returnBtn')){
            document.getElementById('returnBtn').addEventListener('dblclick', function(evt) {
                this.parentNode.setAttribute('data-double', 2);
                evt.stopPropagation();
                evt.preventDefault();
            });
          }
          if(document.querySelector('#prevTime')){
            document.getElementById('prevTime').addEventListener('dblclick', function(evt) {
                this.parentNode.setAttribute('data-double', 2);
                evt.stopPropagation();
                evt.preventDefault();
            });
          }
        },
    }

    function logArrayElements(element, index, array) {
        console.log('a[' + index + '] = ' + element);
    }

    var currentBook = new Book();

    /* Pause time block starts here */
    submitBtnIn.addEventListener("click", function () {
        
        hoursVal = hours.value;
        minutesVal = minutes.value;
        secondsVal = seconds.value;
        hoursVal = (hoursVal < 10) ? ("0" + hoursVal) : hoursVal;
        minutesVal = (minutesVal < 10) ? ("0" + minutesVal) : minutesVal;
        secondsVal = (secondsVal < 10) ? ("0" + secondsVal) : secondsVal;
                                
        var pauseTimeBlogVal = hoursVal+":"+minutesVal+":"+secondsVal+":00";
        currentBook.pauseTime.push(pauseTimeBlogVal);
        currentBook.pauseTime.sort();
        console.log(currentBook.pauseTime);
        if (timePauseUI.style.display=="block" || timePauseUI.style.display != "none") {
            hours.value = "0";
            minutes.value = "0";
            seconds.value = "0";
            timePauseUI.style.display = "none";
        }
    });
    
    // MP-7741 - Added keyup for TPB button for keyboard access
    timePauseIcon.addEventListener("keyup", function (e) {
        if (e.keyCode == 13 || e.keyCode == 32) {
            if (timePauseUI.style.display=="" || timePauseUI.style.display == "none") {
				var chapterMenu = document.getElementsByClassName("chapter-menu")[0];
				var chapterIcon = document.getElementsByClassName("chapter-icon")[0];
				if (chapterMenu) {
					SPPUtility.chapterSlideUp = true;
					chapterMenu.classList.add("closed");
					SPPAccessibility.toggleChapterAccessibility(false);
                }
                //MP-6585 & MP-6590
                if( SPPUtility.getIEVersion() == 11 ){
                    SPPUtility.log("Delected IE browser ~>10 v"+SPPUtility.getIEVersion());
                    document.getElementById('submitBtnIn').style.marginTop = "-17px";
                }else{
                    SPPUtility.log("Detected non IE browser or IE v11");
                }
                //MP-6585
				timePauseUI.style.display = "block";
			} else {
				hours.value = "0";
				minutes.value = "0";
				seconds.value = "0";
				timePauseUI.style.display = "none";
			}
        }
    });
	timePauseIcon.addEventListener("click", function () {
			
			if (timePauseUI.style.display=="" || timePauseUI.style.display == "none") {
				var chapterMenu = document.getElementsByClassName("chapter-menu")[0];
				var chapterIcon = document.getElementsByClassName("chapter-icon")[0];
				if (chapterMenu) {
					SPPUtility.chapterSlideUp = true;
					chapterMenu.classList.add("closed");
					SPPAccessibility.toggleChapterAccessibility(false);
                }
                //MP-6585 & MP-6590
                if( SPPUtility.getIEVersion() == 11 ){
                    SPPUtility.log("Delected IE browser ~>10 v"+SPPUtility.getIEVersion());
                    document.getElementById('submitBtnIn').style.marginTop = "-17px";
                }else{
                    SPPUtility.log("Detected non IE browser or IE v11");
                }
                //MP-6585
				timePauseUI.style.display = "block";
			} else {
				hours.value = "0";
				minutes.value = "0";
				seconds.value = "0";
				timePauseUI.style.display = "none";
			}
		});
		
		closeBtn.addEventListener("click", function () {
			
			if (timePauseUI.style.display=="block" || timePauseUI.style.display != "none") {
				hours.value = "0";
				minutes.value = "0";
				seconds.value = "0";
				timePauseUI.style.display = "none";
			}
		});

    /* Pause time block ends here */

    var clips = xmlDoc.getElementsByTagName("clip");
    var tempClip = [];
    Array.prototype.forEach.call(clips, function(index, content, array) {
        //check for section description and it exists in clip name , push they are in the same;
        // the sort it by count
        // first one parent the rest child
        var tempSubclip = new SubClip();
        tempSubclip.name = index.getAttribute('name');
        tempSubclip.id = index.getAttribute('id');
        Array.prototype.forEach.call(index.childNodes, function(inner, con, arr) {
            if (inner.nodeType !== 1) return;

            if (inner.nodeName == 'in')
                tempSubclip.startTime = inner.textContent;
            else if (inner.nodeName == 'out')
                tempSubclip.endTime = inner.textContent;

        })
        tempClip.push(tempSubclip);
    })

    var clipNavButtons = xmlDoc.getElementsByTagName("clipnav");
    var clipNavArray = Array.prototype.slice.call(clipNavButtons);
    currentBook.videoHeight = clipNavButtons[0].getAttribute('videoHeight');
    currentBook.videoWidth = clipNavButtons[0].getAttribute('videoWidth');
    clipNavArray.forEach(function(index, arr, content) {
        Array.prototype.forEach.call(index.childNodes, function(innerButton, index, content) {
            if (innerButton.nodeType == 1 && innerButton.nodeName !=="pauseTime") {
                var conceptNavButton = new mediaButton();
                conceptNavButton.x = innerButton.getAttribute('xvalue');
                conceptNavButton.y = innerButton.getAttribute('yvalue');
                conceptNavButton.width = innerButton.getAttribute('width');
                conceptNavButton.border = innerButton.getAttribute('border');
                conceptNavButton.bgcolor = innerButton.getAttribute('bgcolor');
                conceptNavButton.fgcolor = innerButton.getAttribute('fgcolor');
                conceptNavButton.height = innerButton.getAttribute('height');
                conceptNavButton.className = innerButton.getAttribute('className');
                conceptNavButton.src = innerButton.getAttribute('src');
                conceptNavButton.value = innerButton.getAttribute('value');
                conceptNavButton.action = innerButton.getAttribute('prop');
                conceptNavButton.showTime = innerButton.getAttribute('showTime');
                conceptNavButton.seekTime = innerButton.getAttribute('backbtnseektime');
                conceptNavButton.hideTime = innerButton.getAttribute('endTime');
                currentBook.navButtons.push(conceptNavButton);
            }

            if (innerButton.nodeType == 1 && innerButton.nodeName =="pauseTime") {
               //Create a Pause Object.
               currentBook.pauseTime.push(innerButton.getAttribute('starttime'));
            }
			
		   function arrayUnique(array) {
			var a = array.concat();
			for(var i=0; i<a.length; ++i) {
				for(var j=i+1; j<a.length; ++j) {
					if(a[i] === a[j])
						a.splice(j--, 1);
				}
			}
		
			return a;
			}
			
		})
    })

    var sections = xmlDoc.getElementsByTagName("section");
    var ConceptBackButton = xmlDoc.getElementsByTagName("back");

    function ButtonBack() {
        this.showTime = '';
        this.seekTime = '';
        this.endTime = '';
        this.width = '';
        this.height = '';
        this.value = '';
        this.fgcolor = '';
        this.bgcolor = '';
        this.xvalue = '';
        this.yvalue = '';
        this.className = '';
        this.color = '';
    }

    Array.prototype.forEach.call(sections, function(index, content, array) {
        
        var section = new Section();
        section.name = index.getAttribute('name');
        var TimeElements = index.getElementsByTagName('time');
        var Description = index.getElementsByTagName('description');

        for (var key in Description) {
            if (Description.hasOwnProperty(key)) {
                section.description = Description[key].textContent;
                break;
            }
        }

       // var subclipArray = samePropertyChecker(section.description);
        //
        var subclipArray =[];
        var clip = new Clip();

        //clip.subClips = subclipArray;
        //subclipArray.map(function(obj) {
           // obj.parentClipId = firstSubClip[0].id;
       // })


        for (var key in TimeElements) {
            if (TimeElements.hasOwnProperty(key) && TimeElements[key].textContent != undefined && TimeElements[key].textContent != null  ) {
                section.timeStamps.push(TimeElements[key].textContent);
            }
        }
        if(section.timeStamps.length>0 && section.name != 'Concept Check'){
            for (var i=0,j=1;i<section.timeStamps.length;i++,j++){
                var clipItem = new SubClip();
                    clipItem.name= index.getAttribute('name');
                    clipItem.id= content;
                    clipItem.startTime=section.timeStamps[i];
                   if(section.timeStamps[j] != undefined && section.timeStamps[j] != null){
                        clipItem.endTime=section.timeStamps[j]
                    }
                    else{
                         if (typeof(array[content+1]) != "undefined" && array[content+1] != null){
                            clipItem.endTime=array[content+1].getElementsByTagName("time")[0].childNodes[0].nodeValue;
                        }
                        else{
                            clipItem.endTime=array[0].getElementsByTagName("time")[0].childNodes[0].nodeValue;
                        }
                    }
                   subclipArray.push(clipItem);
            }
        }

        if(section.timeStamps.length==1 && section.name == 'Concept Check'){
            var clipItem = new SubClip();
                clipItem.name= index.getAttribute('name');
                clipItem.id= content;
                clipItem.startTime=section.timeStamps[0];
                clipItem.endTime=array[0].getElementsByTagName("time")[0].childNodes[0].nodeValue;
                subclipArray.push(clipItem);
        }

        clip.subClips = subclipArray;
        var firstSubClip=[];
         if (subclipArray.length !== 0) {
            clip.startTime = subclipArray[0].startTime;
            clip.endTime = subclipArray[subclipArray.length-1].endTime;
            clip.description = section.description;
            clip.parentClipId = content;
            clip.subClipIDs = [];
        }

        clip.type = '';
        section.clips = clip;


       /* if (section.name == 'Concept Check') {
            var conceptclip = tempClip.filter(function(obj) {
                if (obj.name.indexOf('Concept Check') !== -1)
                    return obj;
            })
            section.startTime = conceptclip[0].startTime;
        }*/
        currentBook.Sections.push(section);
        //currentBook.clips.push(currentClip);
    })


    function SectionChecker(clipObj) {
        for (var i in currentBook) {
            if (i == clipObj)
                return true;
        }
        return false;
    }

    function samePropertyChecker(property) {
        var result = tempClip.filter(function(obj) {
            return obj.name == property;
        });
        return result;
    }

    var concept = xmlDoc.getElementsByTagName("conceptcheck");
    if (concept !== null) {
        Array.prototype.forEach.call(concept, function(index, content, array) {
            var currentClip = new ConceptCheck(); //Parent Concept Object
            currentClip.startTime = index.getAttribute('starttime');
            currentClip.endTime = index.getAttribute('endtime');

            Array.prototype.forEach.call(index.childNodes, function(markers, content, array) {
                    if (markers.nodeType == 1) {
                        var currentConceptMarker = new ConceptMarker(); //Parent Concept Object
                        currentConceptMarker.type = markers.nodeName;
                        currentConceptMarker.startTime = markers.getAttributeNode('starttime').nodeValue;
                        currentConceptMarker.endTime = markers.getAttributeNode('endtime').nodeValue;
                        currentConceptMarker.x = markers.getAttributeNode('xvalue').nodeValue;
                        currentConceptMarker.y = markers.getAttributeNode('yvalue').nodeValue;

                        if (currentConceptMarker.backbtnSeekTime !== null) {
                            if (ConceptBackButton.length > 0) {
                                var newBtn = new ButtonBack();
                                newBtn.height = ConceptBackButton[0].getAttribute('height');
                                newBtn.width = ConceptBackButton[0].getAttribute('width');
                                newBtn.fgcolor = ConceptBackButton[0].getAttribute('fgcolor');
                                newBtn.bgcolor = ConceptBackButton[0].getAttribute('bgcolor');
                                newBtn.xvalue = ConceptBackButton[0].getAttribute('xvalue');
                                newBtn.yvalue = ConceptBackButton[0].getAttribute('yvalue');
                                newBtn.value = ConceptBackButton[0].getAttribute('value');
                                newBtn.color = ConceptBackButton[0].getAttribute('color');
                            }
                        }


                        currentConceptMarker.backBtnHandler.push(newBtn)
                            //currentConceptMarker.buttonShape =
                        currentClip.ConceptMarkers.push(currentConceptMarker);
                    }
                })
                //find where in currentBook which has concept check as section
                // and replace it there;
                //currentBook.conceptChecks.push(currentClip);

            var result = currentBook.Sections.map(function(obj) {
                if (obj.name == 'Concept Check') {
                    obj.clips = currentClip;
                }
            });
        })
    }

    var Book = {
        init: function(data) {
            this.conceptData = null;
            this.clipIndex = null;
            this.playVideoEvent = false;
            this.BogusBtnListener = null;
            this.BogusCloseBtnListener = null;
            this.PauseEventListener = null,
            this.videoFrame = document.querySelector("#videoWrapper");
            this.media = document.getElementsByTagName('video')[0];
            this.currentHeight = this.media.clientHeight;
            this.currentWidth = this.media.clientWidth;
            this.setCurrentHeightandWidth(this.currentHeight, this.currentWidth);
            this.resizableElements = [];
            this.populateData(data);
            this.parentClipID = '';
            this.populatePauseArray();
            this.pauseArray = [];
            this.eventQueue = new Array();
            this.conceptChoiceArray = [];
            ControlMedia.drawCanvas(this.data.Sections);
            this.bogusBtnDisplayed = false;
        },


        populateData: function(data) {
            this.data = data;
        },
        populatePauseArray:function(){
            this.pauseArray = ControlMedia.iterifyArr(currentBook.pauseTime);
        },
        getTitles: function() {
            var titles = [];
            for (var i = 0; i < this.data.Sections.length; i++) {
                //  titles.push(this.data.clips[i].description);
                titles['' + this.data.Sections[i].name] = this.data.Sections[i];
            }
            return titles;
        },
        createRectangle: function(x, y, width, height, top) {
            var canvas = document.createElement('canvas'); //Create a canvas element
            canvas.width = width;
            canvas.height = height;
            //Position canvas
            canvas.style.position = 'absolute';
            canvas.style.left = 0;
            canvas.style.top = 0;
            canvas.style.zIndex = 100000;
            canvas.style.pointerEvents = 'none'; //Make sure you can click 'through' the canvas
            return canvas;
        },

        getObjectByTitle: function(index, title) {
            var found = false;
            for (var i = 0; i < this.data.Sections.length; i++) {
                if (this.data.Sections[i].description == title) {
                    found = true;
                    return this.data.Sections[i];
                } else {
                    found = false;
                }
            }
            return false;
        },

        playVideo: function(startTime, endTimeString) {
            var starttimeoffset = this.convertToSeconds(startTime);
            SmartPearsonPlayer.properties['media'].currentTime = starttimeoffset;
            
            SmartPearsonPlayer.play();
        },

        pauseVideo: function() {
            // SmartPearsonPlayer.play();
            SmartPearsonPlayer.pause();
            //var mediaPlayer = document.querySelector('#ChapterList');
            //mediaPlayer.style.display = 'none';
        },

        convertToSeconds: function(t) {
            if (typeof(t) == 'number') return t;
            if( t != undefined && t != null){			
				var r = t.split(":");
				if (r.length == 3) {
					a = r[0] * 60;
					b = r[1] * 1;
					return a + b;
				} else if (r.length == 4) {
					a = r[0] * 3600;
					b = r[1] * 60;
					c = r[2] * 1;
					d = r[3] * 1;
					return a + b + c;
				}
			}
			else
				return 0;
        },



        hideDetails: function(index, titles) {
            document.querySelector('#posterDetails').innerHTML = '';
        },

        showDetails: function(index, titles) {
            //var currObj = this.getObjectByTitle(index, titles);
            document.querySelector('#posterDetails').innerHTML = this.data.Sections[index].description;
        },

        showBackBtnatATime: function(handler, time) {
            var wrapped = function() {
                if (this.currentTime >= time) {
                    this.removeEventListener('timeupdate', wrapped, false);
                    return handler.apply(this, arguments);
                }
            }
            return wrapped;
        },

        startBackBtnTrigger: function(showtime, endTime, seektime, concepts) {
            var showTimeStart = this.convertToSeconds(showtime);
            var self = this;

            function showBackButton(eventName) {
                var element = document.createElement("input");
                //Assign different attributes to the element.
                element.type = 'button';
                element.id = 'restart';
                element.style.width = '100';
                element.style.height = '50';
                element.style.position = 'absolute';
                element.style.top = '100',
                    element.style.left = '300',
                    element.value = concepts.value; // Really? You want the default value to be the type string?
                element.name = 'restart'; // And the name too?
                element.onclick = function() { // Note this is a function
                    this.removeEventListener('timeupdate', clipEvent, false);
                    this.removeEventListener('timeupdate', backBtnCloseEvent, false);
                    this.eventQueue = [];
                    var element = document.getElementById('restart');
                    element.parentNode.removeChild(element);
                    self.playVideo(seektime);
                    self.startBackBtnTrigger(showtime, endTime, seektime);
                };

                document.querySelector('#videoWrapper').appendChild(element);
            }

            // var clipEvent = this.media.addEventListener("timeupdate", this.showBackBtnatATime(showBackButton, showTimeStart));
            var backBtnCloseEvent = this.media.addEventListener("timeupdate", this.showBackBtnatATime(closeBackBtn, this.convertToSeconds(endTime)));
            this.eventQueue.push(clipEvent, backBtnCloseEvent);

            function closeBackBtn(eventName) {
                var element = document.getElementById('restart');
                element.parentNode.removeChild(element);
                this.removeEventListener('timeupdate', clipEvent, false);
                this.removeEventListener('timeupdate', backBtnCloseEvent, false);
            }
        },

        showCustomBackButton: function(obj) {
            var self = this;
            var backBtnCloseEvent = '';
            var backupBogusBtnListener = '';
            var backupCloseBogusBtnListener = '';
            //self.bogusBtnDisplayed= false;

            self.BogusBtnListener = function() {
                if (SmartPearsonPlayer.properties['media'].currentTime >= self.convertToSeconds(obj.showTime) &&
                    SmartPearsonPlayer.properties['media'].currentTime <= self.convertToSeconds(obj.endTime)
                ) {
                    this.removeEventListener('timeupdate', self.BogusBtnListener, false);
                    self.BogusBtnListener = null;
                    customNavigator();
                }
            };

            self.BogusCloseBtnListener = function() {
                if (SmartPearsonPlayer.properties['media'].currentTime >= self.convertToSeconds(obj.endTime)) {
                    this.removeEventListener('timeupdate', self.BogusCloseBtnListener, false);
                    self.BogusCloseBtnListener = null;
                    closeCustomButon();
                }
            };

            backupBogusBtnListener = self.BogusBtnListener;
            backupCloseBogusBtnListener = self.BogusCloseBtnListener;



            function customNavigator() {
                var element = document.createElement("input");
                //Assign different attributes to the element.
                element.type = 'button';
                element.id = 'restart';
                element.style.position = 'absolute';
               // element.style.width = obj.width + 'px';
                //element.style.height = obj.height + 'px';
                element.style.position = 'relative';
                element.style.top = obj.yvalue + 'px';
                element.style.left = obj.xvalue + 'px';
                element.style.backgroundColor = obj.bgcolor;
                element.style.border = '1px solid' + obj.fgcolor;
                element.style.textAlign='center';
                element.style.color = obj.fgcolor;
                //element.style.paddingTop = 0;
                // element.style.paddingLeft = 0;
                element.value = obj.value; // Really? You want the default value to be the type string?
                element.name = 'restart'; // And the name too?
                element.onclick = function() { // Note this is a function
                    var element = document.getElementById('restart');
                    //self.bogusBtnDisplayed = true;
                    element.parentNode.removeChild(element);
                    element.style.width = obj.width + 'px';
                    element.style.height = obj.height + 'px';
                    this.removeEventListener('timeupdate', self.BogusCloseBtnListener, false);
                    self.BogusBtnListener = backupBogusBtnListener;
                    self.playVideo(self.convertToSeconds(obj.seekTime));
                    self.media.addEventListener("timeupdate", self.BogusBtnListener);
                };


                document.querySelector('#customBtnHolder').style.display = 'inline-block';
                document.querySelector('#customBtnHolder').appendChild(element);
                var resizeDone = false;
                var customBtnSize = document.getElementById('customBtnHolder');
                if(parseFloat(customBtnSize.style.height)>obj.height &&(parseFloat(customBtnSize.style.width)>obj.width ))
                    resizeDone = true;

            var eachShape = document.querySelector('#customBtnHolder');
                if ((parseFloat(SmartPearsonPlayer.properties.media.clientHeight) > Book.data.videoHeight ||
                        parseFloat(SmartPearsonPlayer.properties.media.clientWidth) > Book.data.videoWidth) && self.bogusBtnDisplayed == false && !resizeDone) {
                    self.customButtonVideoResize();
                    self.bogusBtnDisplayed = true;
                }
                self.BogusCloseBtnListener = backupCloseBogusBtnListener;
                self.media.addEventListener("timeupdate", self.BogusCloseBtnListener);
            }

            if (self.BogusBtnListener !== null)
                removeEventListener('timeupdate', self.BogusBtnListener, false);

            self.media.addEventListener("timeupdate", self.BogusBtnListener);

            function closeCustomButon(eventName) {
                console.log('closeBackBtn' + obj.endTime);
                var element = document.getElementById('restart');
                if (element !== null & element !== undefined)
                    element.parentNode.removeChild(element);
                this.removeEventListener('timeupdate', self.BogusBtnListener, false);
                self.BogusBtnListener = null;
                self.bogusBtnDisplayed = false;
            }
        },


        navigateFrames: function(param1, titles) {
            var currIndex = param1;
            var titles = this.getTitles();
            if (currIndex == undefined || currIndex == "") {
                var currTimeIndex;
                var me = ControlMedia.timeData.some(function(obj, index) {
                     if(obj.type !=='parentClip'){
                         if (SmartPearsonPlayer.properties['media'].currentTime > Book.convertToSeconds(obj.startTime) && SmartPearsonPlayer.properties['media'].currentTime < Book.convertToSeconds(obj.endTime)) {
                            currTimeIndex = index;
                            currIndex = obj.parentClipId;
                            return currTimeIndex;
                         }
                     }
                   
                }, currIndex)
                if (currTimeIndex !== undefined || currTimeIndex !== "") {
                    ControlMedia.timeData.curr = currTimeIndex;
                }

                if (currIndex == undefined || currIndex == "") {
                    currIndex = 0;
                    ControlMedia.timeData.curr = 0;
                }
            }

            var currTitle = titles[this.data.Sections[currIndex].name];
            ControlMedia.setParentclipID(currTitle.clips.parentClipId);
            this.setSectionID(currTitle.clips.parentClipId);
            ControlMedia.syncTimeData();
            if (currTitle.name == 'Concept Check') {
                document.querySelector('#nextBtnHolder').style.display = 'none';
            } else {
                if (currTitle.backBtnHandler !== null && currTitle.backBtnHandler.length > 0) {
                    this.startBackBtnTrigger(currTitle.backBtnHandler[0].showTime, currTitle.backBtnHandler[0].endTime, currTitle.backBtnHandler[0].seekTime, currTitle.backBtnHandler[0]);
                } else {
                    this.startBackBtnLookupTrigger(currTitle);
                }
            }

              var currBtnObj = currentBook.customBtnHandler[0];
                if(currBtnObj !== null && currBtnObj !== undefined){
                   this.checkAndDrawBogusBtn('#customBtnHolder',currBtnObj);
            }

            if (Book.BogusBtnListener == "" && currentBook.customBtnHandler[0] !== "" && currentBook.customBtnHandler.length>0  && currentBook.customBtnHandler[0] !== undefined && SmartPearsonPlayer.properties['media'].currentTime < 1) {
                this.showCustomBackButton(currBtnObj);
            }


            //if (SmartPearsonPlayer.properties['media'].currentTime == 0)
            // ControlMedia.getCurrFrameAndDisplayPrevAndNext();

                if (currIndex == 0) {
                    document.querySelector('#prevBtnHolder').style.display = 'none';
                    document.querySelector('#nextBtnHolder').style.display = 'inline-block';
                    this.clipFrameCheckerTrigger(currTitle.timeStamps[1]);
                }


             if(currentBook.pauseTime.length>0){
                currentBook.pauseTime.curr = 0;
                this.pauseVideoTrigger(currentBook.pauseTime[currentBook.pauseTime.curr]);
            }

            var self = this;
            //this.storeIntialDimensions();

            function resizeInscreenElements() {
                setTimeout(function() {
                    //self.bogusBtnDisplayed= true;            
                    var media = document.getElementsByTagName('video')[0];
                    self.currentHeight = media.clientHeight;
                    self.currentWidth = media.clientWidth;

                    self.clipVideoResize();
                }, 210);
            }
            clearInterval(resizeInscreen);

            var resizeInscreen = window.addEventListener("resize", resizeInscreenElements, false);
        },


 _fullscreenEnabled :function() {
    // FF provides nice flag, maybe others will add support for this later on?
    if(window['fullScreen'] !== undefined) {
      return window.fullScreen;
    }
    // 5px height margin, just in case (needed by e.g. IE)
    var heightMargin = 5;

    return screen.width == window.innerWidth &&
        Math.abs(screen.height - window.innerHeight) < heightMargin;
  },


        checkAndDrawBogusBtn:function(placeHolder,currObj){ 
                    document.querySelector(placeHolder).style.left = currObj.xvalue + 'px';
                    document.querySelector(placeHolder).style.top = currObj.yvalue + 'px';
                    document.querySelector(placeHolder).style.width = currObj.width + 'px';
                    document.querySelector(placeHolder).style.height = currObj.height + 'px';
            
        },
        setCurrentHeightandWidth: function(h, w) {
            this.currentHeight = h;
            this.currentWidth = w;
        },
        getCurrentHeightandWidth: function(h, w) {
            return [this.currentHeight, this.currentWidth];
        },


        customButtonVideoResize: function() {
            var eachShape = document.querySelector('#customBtnHolder');
             console.log('starting width'+eachShape.style.width);
            var media = document.getElementsByTagName('video')[0];

            var videoHeight = this.currentHeight;
            var videoWidth = this.currentWidth;

            var shapeHeight, shapeWidth, shapeLeft, shapeTop;
            var tempPrevVideoWidth = this.currentHeight,
                tempPrevVideoHeight = this.currentWidth;
            var parentnode = document.querySelector('#return');
            var mezzanineVideoWidth = this.data.videoWidth;
            var mezzanineVideoHeight = this.data.videoHeight;
            // Array.prototype.forEach.call(parentnode.childNodes, function(eachShape) {
            //if (eachShape.nodeType == 1) {
            var videoAspectRatio = (mezzanineVideoWidth / mezzanineVideoHeight);
            var screenAspectRatio = (media.clientWidth / media.clientHeight),
                videoRenderedWidth = media.clientWidth,
                videoRenderedHeight = media.clientHeight,
                paddingTop = 0,
                paddingLeft = 0;
                console.log(' before condition videoRenderWidth'+videoRenderedWidth);
            if (screenAspectRatio > videoAspectRatio) {
                videoRenderedWidth = media.clientHeight * videoAspectRatio;
                paddingLeft = (media.clientWidth - videoRenderedWidth) / 2;
                console.log('inside condiiton videoRenderWidth'+videoRenderedWidth);
            } else if (screenAspectRatio < videoAspectRatio) {
                videoRenderedHeight = media.clientWidth * (mezzanineVideoHeight / mezzanineVideoWidth);
                paddingTop = (media.clientHeight - videoRenderedHeight) / 2;
            }
            var previousVideoAspectRatio = (tempPrevVideoWidth / tempPrevVideoHeight),
                retainPaddingLeft = 0,
                retainPaddingTop = 0;

            /*  if (previousVideoAspectRatio > videoAspectRatio) {
            videoWidth = videoHeight * videoAspectRatio;
            retainPaddingLeft = (tempPrevVideoWidth - videoWidth) / 2;
            } else if (previousVideoAspectRatio < videoAspectRatio) {
            videoHeight = videoWidth * (mezzanineVideoHeight / mezzanineVideoWidth);
            retainPaddingTop = (tempPrevVideoHeight - videoHeight) / 2;
            }*/
            console.log('paddingLeft'+paddingLeft);
             console.log('eachShape.style.width'+eachShape.style.width);

            var newShapeHeight = (parseFloat(eachShape.style.height) / mezzanineVideoHeight) * videoRenderedHeight;
            var newShapeWidth = (parseFloat(eachShape.style.width) / mezzanineVideoWidth) * videoRenderedWidth;
            var newShapeTop = (((parseFloat(eachShape.style.top) - retainPaddingTop) / videoHeight) * videoRenderedHeight) + paddingTop;
            var newShapeLeft = (((parseFloat(eachShape.style.left) - retainPaddingLeft) / videoWidth) * videoRenderedWidth) + paddingLeft;
            eachShape.setAttribute("style", "height:" + newShapeHeight + "px;lineHeight:" + newShapeHeight + "px;width:" + newShapeWidth + "px;position:absolute;left:" + newShapeLeft + "px;top:" + newShapeTop + "px;cursor:pointer;z-index:5001;'");


            /*if (eachShape.firstChild !== null) {
            var newShapeY = (((parseFloat(eachShape.firstChild.style.paddingTop) - retainPaddingTop) / videoHeight) * videoRenderedHeight) + paddingTop;
            var newShapeX = (((parseFloat(eachShape.firstChild.style.paddingLeft) - retainPaddingLeft) / videoWidth) * videoRenderedWidth) + paddingLeft;

            eachShape.firstChild.style.paddingTop = newShapeY + "px";
            eachShape.firstChild.style.paddingLeft = newShapeX + "px";
            eachShape.firstChild.style.width = newShapeWidth + "px";
            eachShape.firstChild.style.height = newShapeHeight + "px";
            eachShape.firstChild.style.lineHeight = newShapeHeight + "px";
            }*/
            // }
            // }
            // );
            this.setCurrentHeightandWidth(videoHeight, videoWidth);
            // ControlMedia.getCurrFrameAndDisplayPrevAndNext(true);

        },


        clipVideoResize: function(flag) {

            if (parseFloat(SmartPearsonPlayer.properties.media.clientHeight) < Book.data.videoHeight &&
                        parseFloat(SmartPearsonPlayer.properties.media.clientWidth) < Book.data.videoWidth) {
                this.bogusBtnDisplayed = false;
            }

            var media = document.getElementsByTagName('video')[0];
            var currentDimensions = this.getCurrentHeightandWidth();
            var videoHeight = this.currentHeight;
            var videoWidth = this.currentWidth;

            var shapeHeight, shapeWidth, shapeLeft, shapeTop;
            var tempPrevVideoWidth = videoWidth,
                tempPrevVideoHeight = videoHeight;

            var parentnode = document.querySelector('#mediaCtrl');
            var mezzanineVideoWidth = this.data.videoWidth;
            var mezzanineVideoHeight = this.data.videoHeight;
            Array.prototype.forEach.call(parentnode.childNodes, function(eachShape) {
                if (eachShape.nodeType == 1) {
                    var videoAspectRatio = (mezzanineVideoWidth / mezzanineVideoHeight);
                    var screenAspectRatio = (media.clientWidth / media.clientHeight),
                        videoRenderedWidth = media.clientWidth,
                        videoRenderedHeight = media.clientHeight,
                        paddingTop = 0,
                        paddingLeft = 0;
                    if (screenAspectRatio > videoAspectRatio) {
                        videoRenderedWidth = media.clientHeight * videoAspectRatio;
                        paddingLeft = (media.clientWidth - videoRenderedWidth) / 2;
                    } else if (screenAspectRatio < videoAspectRatio) {
                        videoRenderedHeight = media.clientWidth * (mezzanineVideoHeight / mezzanineVideoWidth);
                        paddingTop = (media.clientHeight - videoRenderedHeight) / 2;
                    }
                    var previousVideoAspectRatio = (tempPrevVideoWidth / tempPrevVideoHeight),
                        retainPaddingLeft = 0,
                        retainPaddingTop = 0;
                    if (typeof flag == "undefined") {
                        if (previousVideoAspectRatio > videoAspectRatio) {
                            videoWidth = videoHeight * videoAspectRatio;
                            retainPaddingLeft = (tempPrevVideoWidth - videoWidth) / 2;
                        } else if (previousVideoAspectRatio < videoAspectRatio) {
                            videoHeight = videoWidth * (mezzanineVideoHeight / mezzanineVideoWidth);
                            retainPaddingTop = (tempPrevVideoHeight - videoHeight) / 2;
                        }
                    }

                    var newShapeHeight = (parseFloat(eachShape.style.height) / videoHeight) * videoRenderedHeight;
                    var newShapeWidth = (parseFloat(eachShape.style.width) / videoWidth) * videoRenderedWidth;
                    var newShapeTop = (((parseFloat(eachShape.style.top) - retainPaddingTop) / videoHeight) * videoRenderedHeight) + paddingTop;
                    var newShapeLeft = (((parseFloat(eachShape.style.left) - retainPaddingLeft) / videoWidth) * videoRenderedWidth) + paddingLeft;

                    eachShape.setAttribute("style", "height:" + newShapeHeight + "px;width:" + newShapeWidth + "px;position:absolute;left:" + newShapeLeft + "px;top:" + newShapeTop + "px;cursor:pointer;z-index:5001;'");


                    if (eachShape.firstChild !== null) {
                        var newShapeY = (((parseFloat(eachShape.firstChild.style.paddingTop) - retainPaddingTop) / videoHeight) * videoRenderedHeight) + paddingTop;
                        var newShapeX = (((parseFloat(eachShape.firstChild.style.paddingLeft) - retainPaddingLeft) / videoWidth) * videoRenderedWidth) + paddingLeft;

                        eachShape.firstChild.style.paddingTop = newShapeY + "px";
                        eachShape.firstChild.style.paddingLeft = newShapeX + "px";
                        eachShape.firstChild.style.width = newShapeWidth + "px";
                        eachShape.firstChild.style.height = newShapeHeight + "px";
                        eachShape.firstChild.style.lineHeight = newShapeHeight + "px";
                    }
                }
            });
            this.setCurrentHeightandWidth(media.clientHeight, media.clientWidth);
            ControlMedia.getCurrFrameAndDisplayPrevAndNext(true);

        },

        clipFrameCheckerTrigger: function(timeStamp) {
            function showNavigationControl() {
                //document.querySelector('#prevTime').style.display='none';
                if(document.querySelector('#prevTime'))
                    document.querySelector('#prevTime').style.display = 'inline-block';
                this.removeEventListener('timeupdate', clipEventChecker, false);

            }
            var clipEventChecker = this.media.addEventListener("timeupdate", this.showBackBtnatATime(showNavigationControl, this.convertToSeconds(timeStamp)));
        },


        setSectionID: function(id) {
            this.parentClipID = id;
        },
        getSectionID: function(id) {
            return this.parentClipID;
        },

        getNextSectionByCurrentId: function(id) {
            if (typeof id !== "undefined" || (typeof(id) != "null")) return null;
            var self = this;
            var nextId = id * 1 + 1;
            var nextObj = null;


            function sectionCompare(obj) {
                if (obj.clips.parentClipId == nextId) {
                    nextObj = obj;
                    return true;
                }
            }

            if (this.data.Sections[nextId].name == 'Concept Check') {
                return this.data.Sections[nextId];
            } else {
                Array.prototype.map.call(this.data.Sections, sectionCompare);
                return nextObj;
            }
        },

        checkConceptCheck: function(currid) {
            var nextId = currid * 1 + 1;
            var nextObj = null;

            if (this.data.Sections[currid].name == 'Concept Check') {
                return this.data.Sections[currid];
            } else {
                return nextObj;
            }
        },

        startConceptTrigger: function(endTime, seektime, concepts) {
            var self = this;
            var conceptCheckArrowEvent = this.media.addEventListener("timeupdate", this.showBackBtnatATime(closeBackBtn, this.convertToSeconds(endTime)));

            function closeBackBtn(eventName) {
                // var element = document.getElementById('restart');
                //element.parentNode.removeChild(element);
                document.querySelector('#nextBtnHolder').style.display = 'none';
                this.removeEventListener('timeupdate', conceptCheckArrowEvent, false);

            }
        },

        startBackBtnLookupTrigger: function(titles) {
            function checkForSection(titles) {
                var nextSection = self.getNextSectionByCurrentId(self.parentClipID);

                // ControlMedia.getCurrFrameAndDisplayPrevAndNext();

                //all sections except Concept Check
                if (nextSection !== null && nextSection.name !== 'Concept Check') {
                    this.removeEventListener('timeupdate', sectionEvent, false);
                    self.setSectionID((self.parentClipID * 1) + 1);
                    var endTime = ControlMedia.timeData.filter(sectionFilter);
                    if (nextSection.backBtnHandler !== null && nextSection.backBtnHandler.length > 0) {
                        self.startBackBtnTrigger(nextSection.backBtnHandler[0].showTime, nextSection.backBtnHandler[0].endTime, nextSection.backBtnHandler[0].seekTime, nextSection.backBtnHandler[0]);
                    }

                    sectionEvent = self.media.addEventListener("timeupdate", self.showBackBtnatATime(checkForSection, self.convertToSeconds(endTime[0].chapterEndtime)));
                }
                if (nextSection == null) return;

                if (nextSection.clips instanceof ConceptCheck) {
                    this.removeEventListener('timeupdate', sectionEvent, false);
                    self.startConceptTrigger(nextSection.startTime, nextSection.clips);

                    return;
                }
            }

            var self = this;
            var currSection = this.getSectionID();
            var nextId = self.getSectionID() * 1 + 1;

            function sectionFilter(obj, index) {
                if (obj.parentClipId == self.getSectionID() && obj.type == 'parentClip') {
                    var currId = self.getSectionID();
                    if (self.data.Sections[self.getSectionID()].name !== 'Concept Check') {
                        return obj.chapterEndtime;
                    } else {
                        obj.chapterEndtime = self.data.Sections[self.getSectionID()].startTime;
                        return obj;
                    }
                }
            }
            var endTime = ControlMedia.timeData.filter(sectionFilter);
            //Trigger starts here , will run the function at the start of the next chapter
            var sectionEvent = self.media.addEventListener("timeupdate", this.showBackBtnatATime(checkForSection, this.convertToSeconds(endTime[0].chapterEndtime)));
        },

        runAtTime: function(handler, data, time) {
            this.setConceptCheckData(data);
            var self = this;
            var wrapped = function() {
                if (this.currentTime >= time) {
                    this.removeEventListener('timeupdate', wrapped, false);
                    this.pause();

                    return handler.apply(this, [data, self]);
                }
            }
            return wrapped;
        },

         round: function(value, precision, mode) {
              //  discuss at: http://phpjs.org/functions/round/
              // original by: Philip Peterson
              //  revised by: Onno Marsman
              //  revised by: T.Wild
              //  revised by: Rafał Kukawski (http://blog.kukawski.pl/)
              //    input by: Greenseed
              //    input by: meo
              //    input by: William
              //    input by: Josep Sanz (http://www.ws3.es/)
              // bugfixed by: Brett Zamir (http://brett-zamir.me)
              //        note: Great work. Ideas for improvement:
              //        note: - code more compliant with developer guidelines
              //        note: - for implementing PHP constant arguments look at
              //        note: the pathinfo() function, it offers the greatest
              //        note: flexibility & compatibility possible
              //   example 1: round(1241757, -3);
              //   returns 1: 1242000
              //   example 2: round(3.6);
              //   returns 2: 4
              //   example 3: round(2.835, 2);
              //   returns 3: 2.84
              //   example 4: round(1.1749999999999, 2);
              //   returns 4: 1.17
              //   example 5: round(58551.799999999996, 2);
              //   returns 5: 58551.8

              var m, f, isHalf, sgn; // helper variables
              precision |= 0; // making sure precision is integer
              m = Math.pow(10, precision);
              value *= m;
              sgn = (value > 0) | -(value < 0); // sign of the number
              isHalf = value % 1 === 0.5 * sgn;
              f = Math.floor(value);

              if (isHalf) {
                switch (mode) {
                  case 'PHP_ROUND_HALF_DOWN':
                    value = f + (sgn < 0); // rounds .5 toward zero
                    break;
                  case 'PHP_ROUND_HALF_EVEN':
                    value = f + (f % 2 * sgn); // rouds .5 towards the next even integer
                    break;
                  case 'PHP_ROUND_HALF_ODD':
                    value = f + !(f % 2); // rounds .5 towards the next odd integer
                    break;
                  default:
                    value = f + (sgn > 0); // rounds .5 away from zero
                }
              }

              return (isHalf ? value : Math.round(value)) / m;
    },
        
        pauseVideoTrigger : function(endTime){
            var self = this;
            this.PauseEventListener = pauseEventCallback(self);

             var buffer = .14;
                if (SmartPearsonPlayer.properties.currentSpeedRate) {
                        buffer = buffer * SmartPearsonPlayer.properties.currentSpeedRate;
                }

                
            function pauseEventCallback(context) {
                var self = this;
                var params ={time:context.convertToSeconds(endTime),handler:pauseEventResponse,buffer:buffer}
                var wrapped = function() {
                    //console.log(this.round((this.currentTime - 1)- buffer,0),'params.time',params.time);
                    if (this.round((this.currentTime - 1)- buffer,0) == params.time){                      
                        this.removeEventListener('timeupdate', wrapped, false);
                        return params.handler.apply(this, arguments);
                    }
                }
                return wrapped;
            }

            this.media.context = this;
            this.media.round = this.round;
            this.media.addEventListener("timeupdate", this.PauseEventListener);


           function pauseEventResponse(params1,params2) {  
                //console.log('pauseEventResponse',params1);
				
				var middlewrapper = document.getElementsByClassName("pvp-middle-wrapper")[0];
				
				if(middlewrapper.style.display=="none")
				{
					//Middle Wrapper fadein code start here
					middlewrapper.style.display="block";	
					middlewrapper.style.opacity = 0.9;
					middlewrapper.style.transition = "opacity 1.5s";
					//Middle Wrapper fadein code ends here
				}
          
                SmartPearsonPlayer.pause();
                self.media.removeEventListener("timeupdate", self.PauseEventListener);
                self.PauseEventListener = "";
                
                var fn = function(evt){
                    if(evt.target.id !=='playBtn'){
                        self.playVideoEvent=true;
                        self.playVideo(endTime);
                    }
                    else{
                       self.playVideoEvent=true;
                       self.media.currentTime = self.convertToSeconds(endTime);
                       SmartPearsonPlayer.play();
                    }

                 //check the pauseArray and start the next Pause;
                if(currentBook.pauseTime.curr < currentBook.pauseTime.length-1){
                    self.pauseVideoTrigger(currentBook.pauseTime.next());
                }
                    
                    document.body.removeEventListener('click', fn, true);
                    evt.preventDefault();
                    evt.stopPropagation();
                    return;
                }
				
				var spacebarfn = function(evt){
                    var media = document.getElementsByTagName('video')[0];				
                    if(evt.keyCode == 32 && media.paused == true && middlewrapper.style.display=="block"){
                        self.playVideoEvent=true;
                        self.playVideo(media.currentTime);
				
						if(middlewrapper.style.display=="block")
						   {					
							//Middle Wrapper fadeout code start here
							middlewrapper.style.opacity = 0;
							middlewrapper.style.transition = "opacity 1.5s";
							middlewrapper.style.display="none";
							//Middle Wrapper fadeout code ends here
						   }
                    }
					

                 //check the pauseArray and start the next Pause;
                if(currentBook.pauseTime.curr < currentBook.pauseTime.length-1){
                    self.pauseVideoTrigger(currentBook.pauseTime.next());
                }
                    
                    document.body.removeEventListener('keyup', fn, true);
                    evt.preventDefault();
                    evt.stopPropagation();
                    return;
                }
                document.body.addEventListener('click', fn, true);
				document.body.addEventListener('keyup', spacebarfn, true);
				
            }

        },
        //To Restart the Video again after completion of  the selected choice answer video
        restartAgain: function(endTime) {
            var endTimeOffset = this.convertToSeconds(endTime);
            var self = this;
            this.media.addEventListener("timeupdate", this.showBackBtnatATime(function() {
                self.navigateFrames(0), ControlMedia.goHome();
                if(document.querySelector('#nxtTime'))
                    document.querySelector('#nxtTime').style.display = 'none';
            }, endTimeOffset));
        },

        //To Restart the Video again after completion of  the selected choice answer video
        stopCC: function(endTime) {
            var endTimeOffset = this.convertToSeconds(endTime);
            var self = this;
            this.media.addEventListener("timeupdate", this.showBackBtnatATime(function() {
                if(document.querySelector('#prevTime'))
                    document.querySelector('#prevTime').style.display = 'none';
                self.media.pause()
            }, endTimeOffset));
        },


        populateConceptChoiceArray: function(arr) {
            this.conceptChoiceArray = arr;
        },
        emptyConceptChoiceArray: function(arr) {
            if (this.conceptChoiceArray.length == 0) return;
            this.conceptChoiceArray.forEach(function(obj) {
                var element = document.getElementById(obj.id);
                if (element !== null) {
                    element.parentNode.removeChild(element);
                }
            })
        },

        setConceptCheckData: function(data) {
            if (this.conceptData == null)
                this.conceptData = data;
            else
                return;
        }
    }
    Book.init(currentBook);
    Book.clipVideoResize(1);
    return {
        BookModule: Book,
        MediaControl: ControlMedia,
        clipVideoResize: Book.clipVideoResize
    };

}