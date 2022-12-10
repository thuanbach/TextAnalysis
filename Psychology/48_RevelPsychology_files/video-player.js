var SPPUtility = (function () {
    var currentSeekToTime = 0, totalDuration;
    var setSeekBack = false;
    /*MP-6879 - altered smallPlayerHeight from 300 to 100*/
    var smallPlayerHeight = 100,smallPlayerChapterHeight = 100, controlRackHeight = 52, playerHeightBelowCntRack = 0, legacyVideoWidth = 640, legacyVideoHeight = 480;
    var videoWidth, videoHeight, buttonWrapper, fixedControlRack = false, playerType = 1; // player type 1. standalone 2. embed
    var SPPCookie = "SPPCookie", fullScreen = false, fullScreenForIE = false, chapterSlideUp = false;
    var frameRate=0,controlRackPosition;
var clipData='';
    var fullScreenEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled ? true : false;;
    var setClipData= function (data){
        clipData = data;    
    }
    var getClipData = function(){
        return clipData;
    }
    var getParameterByName = function (name, url) {
        var assetUrl = url.split("/");
        if (assetUrl.length > 0) {
            var assetName = assetUrl[assetUrl.length - 1];
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(url);
        }
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    } 

    //MP-7204
    var locationPathname = location.pathname;
    var locationSearch = location.search;

    function isClipExists(name)
    {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexString = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexString);
        var found = regex.exec(window.locationSearch);
        if (found === null)
            return "";
        else
            return decodeURIComponent(found[1].replace(/\+/g, " "));
    }
    
    var isDebug = getParameterByName('debug', locationPathname + locationSearch);
    var log = function(msgOrObj) {
    	if(isDebug == "true"){
	        if( typeof(window.console) != 'undefined' ){
	            try {  invalidfunctionthrowanerrorplease(); }
	            catch(err) {  var logStack = err.stack;  }
	            var fullTrace = logStack.split('\n');
	            for( var i = 0 ; i < fullTrace.length ; ++i ){
	                fullTrace[i] = fullTrace[i].replace(/\s+/g, ' ');
	            }
	            var caller = fullTrace[1],
	                callerParts = caller.split('@'),
	                line = '';

	            //CHROME & SAFARI
	            if( callerParts.length == 1 ){
	                callerParts = fullTrace[2].split('('), caller = false;
	                //we have an object caller
	                if( callerParts.length > 1 ){
	                    caller = callerParts[0].replace('at Object.','');
	                    line = callerParts[1].split(':');
	                    line = line[2];
	                }
	                //called from outside of an object
	                else {
	                    callerParts[0] = callerParts[0].replace('at ','');
	                    callerParts = callerParts[0].split(':');
	                    caller = callerParts[0]+callerParts[1];
	                    line = callerParts[2];
	                }
	            }
	            //FIREFOX
	            else {
	                var callerParts2 = callerParts[1].split(':');
	                line = callerParts2.pop();
	                callerParts[1] = callerParts2.join(':');
	                caller = (callerParts[0] == '') ? callerParts[1] : callerParts[0];
	            }
	            console.log( ' ' );
	            console.warn( 'Console log: '+ caller + ' ( line '+ line +' )' );
	            console.log( msgOrObj );
	            console.log({'Full trace:': fullTrace });
	        } else {
	            shout('This browser does not support console.log!')
	        }
    	}	
    }
 
    var parseTime = function (timeString) {
        if (timeString != null) {
            timeString = timeString.replace(",", ".");
            var parts = timeString.split(':');
            var time = 0;
            if (parts[3])
                time = time + parseFloat(parts[3]) * 10;
            if (parts[2])
                time = time + parseFloat(parts[2]) * 1000;
            if (parts[1])
                time = time + parseFloat(parts[1]) * 60 * 1000;
            if (parts[0])
                time = time + parseFloat(parts[0]) * 60 * 60 * 1000;
            return time / 1000;
        }
    }

    var setPlayerCookie = function (cookieName, cookieValue) {
        var d = new Date();
        var Obj = {};
        d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));

        //Splitting Cookie Value to array for fontFamily Fonts
        if(cookieValue.indexOf(",") > -1){
            cookieValue=cookieValue.split(",");
        }
        
        var result = document.cookie.match(new RegExp(SPPCookie + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        if (result) {
            Obj = result;
        }
        Obj[cookieName] = cookieValue;
        log(Obj);
        var expires = "expires=" + d.toUTCString();
        setCookie = SPPCookie + "=" + JSON.stringify(Obj) + ";" + expires + ";domain.=" + window.location.host.toString();
        document.cookie = setCookie;
    }

    var getPlayerCookie = function (cookieName) {
        var result = document.cookie.match(new RegExp(SPPCookie + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        if (result != null && result[cookieName] != null) {
            return result[cookieName];
        } else {
            return null;
        }
        return result;
    }

    var between = function (x, min, max) {
        return x >= min && x <= max;
    }

    var convertVideoTime = function (time) {
        if (isNaN(time) == false) {
            var mins = Math.floor(time / 60);
            var secs = Math.floor(time - mins * 60);
            if (secs < 10) {
                secs = "0" + secs;
            }
            if (mins < 10) {
                mins = "0" + mins;
            }
        } else {
            mins = 00;
            secs = 00;
        }
        return mins + ":" + secs;
    }
    var convertMStoHMS = function (seconds) {
        if (isNaN(seconds) == false) { 
            var hours = parseInt( seconds / 3600 ); 
            var seconds = seconds % 3600; 
            var minutes = parseInt( seconds / 60 ); 
            seconds = parseInt(seconds % 60);

            if (hours < 10) {
                hours = "0" + hours;
            }           
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            return hours+":"+minutes+":"+seconds+":00";
        } else {
            return 00+":"+00+":"+00+":"+00;
        }     
    }
    function getIEVersion(){    // line number 144
        var agent = navigator.userAgent;
        var reg = /MSIE\s?(\d+)(?:\.(\d+))?/i;
        var regFr11 = /Trident|Edge/i; // IE 11 or 12 (Edge)

        var matches = agent.match(reg);
        var matchesFr11 = agent.match(regFr11);

        if (matches != null) {
            return matches[1];
        }else if(matchesFr11 != null){
            if( matchesFr11 == 'Trident'){
                return 11;
            }else{
                return 12;
            }
        }else{
            return 0;
        }
    }

    return {
        chapterSlideUp: chapterSlideUp,
        fullScreenForIE: fullScreenForIE,
        fullScreenEnabled: fullScreenEnabled,
        playerType: playerType,
        langParams:JSON.parse(langParams),
        fullScreen: fullScreen,
        currentSeekToTime: currentSeekToTime,
        videoWidth: videoWidth,
        videoHeight: videoHeight,
        buttonWrapper: buttonWrapper,
        fixedControlRack: fixedControlRack,
        parseTime: parseTime,
        convertVideoTime: convertVideoTime,
        setPlayerCookie: setPlayerCookie,
        getPlayerCookie: getPlayerCookie,
        setClipData:setClipData,
        getClipData:getClipData,
        getParameterByName: getParameterByName,
        isClipExists: isClipExists,
        getIEVersion : getIEVersion,   // line number 182
        between: between,
        smallPlayerHeight: smallPlayerHeight,
        smallPlayerChapterHeight: smallPlayerChapterHeight,
        playerHeightBelowCntRack: playerHeightBelowCntRack,
        controlRackHeight: controlRackHeight,
        totalDuration: totalDuration,
        legacyVideoWidth: legacyVideoWidth,
        legacyVideoHeight: legacyVideoHeight,
        log: log,
        convertHMSTimeFormat: convertMStoHMS
    }
})();
//var clipStarttime=0, clipEndtime, currentTime = 0, clipEnded = 0, clipInfo;
var clipStarttime=0, clipEndtime, currentTime = 0, clipEnded = 0, clipInfo,clipVideo;
//Accessibility
var SPPAccessibility = (function () {
    var accessDiv = document.getElementById("non-visual-status");
    var playButton = document.getElementById("playBtn");
    var progressBar = document.getElementById("progressBar");
    var videoWrapper = document.getElementById("videoWrapper");
    var timelineUI = document.getElementsByClassName("pvp-timeline")[0];
    var toolTip = document.getElementById("tooltip");
    var chapters = document.getElementsByClassName("chapter");
    var playlist = document.getElementsByClassName("pvp-playlist");
    var timeCounter = document.getElementById("counter-time");
    var duration = document.getElementById("duration");
    var langParams=SPPUtility.langParams;

    // Tab Index values
    var chapterTabIndex = 26;
    var playlistTabIndex = 5;
    var playlistCloseTabIndex = 5;

    var media = document.getElementsByTagName('video')[0];
    media.addEventListener('play', play);
    media.addEventListener('pause', pause);

    // MP-7153 added 
    volumeBar.addEventListener('blur', function (e) {
        if(navigator.appVersion.indexOf("Edge") != -1){
        }
        else{
            setTimeout(function(){
                volumeBar.setAttribute('aria-valuetext', (media.volume * 100).toFixed(0) + "%");
                volumeBar.setAttribute('title', (media.volume * 100).toFixed(0) + "%");
                volumeBar.setAttribute('aria-valuenow', (media.volume * 100).toFixed(0));
            }, 5000);
        }
    });
        
    function initAccessibility() {
        if(navigator.userAgent.indexOf("MSIE") || navigator.userAgent.indexOf("trident")){
            accessDiv.setAttribute("aria-live","polite");
        }
        videoWrapper.addEventListener("keyup", function (e) {
            // MP-7155 get focused last active element
            document.getElementById('lastActiveEle').value = document.activeElement.id;
            if(document.getElementById('lastActiveEle').value!=''){
                // MP-7155 hided display block and none
                // wrapper.style.display = "block";
                document.getElementById(document.getElementById('lastActiveEle').value).focus();
            }
            
            if (e.keyCode == 9) {
                e.preventDefault();
                if (document.activeElement.style != "none") {
                    // MP-7155 hided display block and none
                    // wrapper.style.display = "block";
                    wrapper.classList.remove("pvp-controls-hide");
                    wrapper.classList.add("pvp-controls-show");
                    //MP-6281 - Added - allow all browsers
                    // if(navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./) || navigator.appVersion.indexOf("Edge") != -1){
                        // if(document.activeElement.id == "fs" || document.activeElement.id == "settings"){
                            if(document.getElementById("conChkQIconId")){
                                document.getElementById("conChkQIconId").style.outline = "none";
                            }
                    //     }
                    // }
                    
                    setTimeout(function () {
                        if (typeof previousElement != "undefined") {
                            //MP-6660 start
                            if(previousElement.id === "chapterFwdBtn" && wrapper.style.display === "none"){
                                // MP-7155 hided display block and none
                                //  wrapper.style.display = "block";
                                 wrapper.classList.remove("pvp-controls-hide");
                                 wrapper.classList.add("pvp-controls-show");
                                 document.getElementById("playBtn").focus();
                            }
                            else if (previousElement.id === "fs" && document.getElementById("chapterFwdBtn") === null 
                            && wrapper.style.display === "none") {
                                    // MP-7155 hided display block and none
                                    //    wrapper.style.display = "block";
                                   wrapper.classList.remove("pvp-controls-hide");
                                   wrapper.classList.add("pvp-controls-show");
                                   document.getElementById("playBtn").focus();
                            } 
                            else if(previousElement.id=="playBtn" && document.activeElement.id=="progressBar" && wrapper.style.display === "none"){
                                // MP-7155 hided display block and none
                                // wrapper.style.display = "block";
                                wrapper.classList.remove("pvp-controls-hide");
                                wrapper.classList.add("pvp-controls-show");
                                document.getElementById("playBtn").focus();
                            }
                            //MP-6660 end
                            
                            previousElement.style.outline = "none";
                            //MP-6026 start
                            if(document.getElementById("fs").classList.contains("on") == true){
                                // Hided for MP-6026 to check IE
                                //fix for IE full-screen issue
                                // if(navigator.userAgent.indexOf("MSIE") || navigator.userAgent.indexOf("trident")){
                                //     if(previousElement == document.activeElement){
                                //         document.getElementById("playBtn").focus();
                                //     }
                                // }
                                if(navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
                                    //MP-6731 revert MP-6026 code
                                    // if (previousElement == document.activeElement && document.getElementsByClassName("chapter-menu")[0] != "undefined" && previousElement.id != 'fs') {
                                    //     document.getElementById("playBtn").focus();
                                    // }
                                    // else
                                     if (previousElement == document.activeElement){
                                        document.getElementById("playBtn").focus();
                                    }
                                }
                            }
                            //MP-6026 end
                            //MP-6731
                        }//MP-6660 else condition added
                        else{
                            //MP-6731 altered MP-6660 code 
                            // if(document.activeElement.id=='fs'){
                            //     document.getElementById("fs").focus();
                            // }
                            // else
                            //MP-6731 added wrapper style condition
                            if(document.activeElement.id=="progressBar" && wrapper.style.display === "none"){
                                // MP-7155 hided display block and none
                                // wrapper.style.display = "block";
                                wrapper.classList.remove("pvp-controls-hide");
                                wrapper.classList.add("pvp-controls-show");
                                document.getElementById("playBtn").focus();
                            }
                        }
                        
                        /*MP-7334 - Replace 2px solid yellow with 2px solid red */
                        if (document.activeElement.type == "range") {
                            document.activeElement.parentElement.style.outline = "2px solid red";
                        } else if(document.activeElement.type == "" && document.activeElement.classList.contains("chapter") == true) {
                            document.activeElement.style.border = "2px solid red";
                            document.activeElement.style.outline="none";
                        } else {
                            document.activeElement.style.outline = "2px solid red";
                        } 

                        previousElement = document.activeElement;
                        previousElement.addEventListener("blur", function () {
                            if (previousElement.type == "range") {
                                this.parentElement.style.outline = "none";
                            }else if(previousElement.type == "" && previousElement.classList.contains("chapter") == true) {
                                this.style.border = "0px";
                            }else {
                                this.style.outline = "none";
                            }
                        });

                    }, 50);
                }
            }
            if(e.keyCode == 32){
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }, false);
 
    videoWrapper.addEventListener("mousedown",function(e){
        if(e.button ==2){
            //e.preventDefault();
            return false;
        }
    });



        function timelineTooltip(e) {
            var seekPosWidth = e.offsetX == undefined ? e.layerX : e.offsetX;
            var seekPercentage = seekPosWidth / progressBar.clientWidth * 100;
            var toolTipLimit = progressBar.clientWidth - 40;
            if (toolTipLimit < seekPosWidth)
                seekPosWidth = toolTipLimit;
            toolTip.style.left = seekPosWidth;
            toolTip.style.display = "block";
            var seekTime = seekPercentage / 100 * SPPUtility.totalDuration;
            //MP-5884
            if( seekTime > 0 ){
                toolTip.innerHTML = SPPUtility.convertVideoTime(seekTime);
            }
            //MP-5884
        }

        progressBar.addEventListener("mousemove", function (e) {
            if (e.target.id == "progressBar") {
                timelineTooltip(e);
            }
        });

        progress.addEventListener("mousemove", function (e) {
            if (e.target.id == "progress") {
                timelineTooltip(e);
            }
        });

        progressBar.addEventListener("mouseout", function (e) {
            toolTip.style.display = "none";
        });

        progress.addEventListener("mouseout", function (e) {
            toolTip.style.display = "none";
        });

        if (navigator.platform != "Win32") {
            accessDiv.style.display = "block";
        }

    }

    initAccessibility();
	 window.addEventListener('click', function(e) {
		//var elem = document.getElementById('video');
		//alert(e.clientX+" == "+e.clientY);	
		//return false;
	 });


    function toggleChapterAccessibility(option) {
        //set tab-index , true = set tabindex and false = remove tabindex
        var tabIndex = (option == true) ? chapterTabIndex : -1;
        for (i = 0; i < chapters.length; i++) {
            chapters[i].setAttribute("tabindex", tabIndex);
        }
    }

    function togglePlaylistAccessibility(option) {
        //set tab-index , true = set tabindex and false = remove tabindex
        var playlistCloseButton = document.getElementById("closeButton");
        var tabIndex = (option == true) ? playlistTabIndex : -1;
        for (i = 0; i < playlist.length; i++) {
            playlist[i].setAttribute("tabindex", tabIndex);
        }
        playlistCloseButton.setAttribute("tabindex", tabIndex);
    }

    function toggleTabIndex(ele, option) {
        try{
            var childNodes = ele.getElementsByTagName("*");
            for (var i = 0; i < childNodes.length; i++) {
                //MP-7786 - Replace tabindex-value to data-tabindexvalue
                if (childNodes[i].hasAttribute("data-tabindexvalue")) {
                    var tabIndex = (option == true) ? childNodes[i].getAttribute("data-tabindexvalue") : -1;					
                    childNodes[i].setAttribute("tabindex", tabIndex);
                }
            }
        }catch(e){
            
        }
    }

    function convertTimelinetxt(time) {
        if (isNaN(time) == false) {
            var mins = Math.floor(time / 60);
            var secs = Math.floor(time - mins * 60);
            if (secs < 10) {
                secs = "0" + secs;
            }
            if (mins < 10) {
                mins = "0" + mins;
            }
        } else {
            mins = 00;
            secs = 00;
        }
        return mins + " minutes and " + secs + " seconds";
    }

    function updateTimelineUI() {
        var mediaCurrentTime=(clipStarttime > 0)?media.currentTime - clipStarttime : media.currentTime;
        var mediaEndTime= (clipEndtime > 0) ? clipEndtime - clipStarttime :media.duration;
        progressBar.setAttribute("aria-valuemin",0);
        /*MP-7474 - update aria-valemax to aria-valuemax*/ 
        progressBar.setAttribute("aria-valuemax",mediaEndTime);
        progressBar.setAttribute("aria-valuenow",media.currentTime);
        /*MP-8540 - added aria-label attribute*/
        progressBar.setAttribute("aria-label",'ProgressBar');
       // timelineUI.setAttribute("aria-label", convertTimelinetxt(mediaCurrentTime) + "  out of " + convertTimelinetxt(mediaEndTime));
       // timelineUI.setAttribute("title", convertTimelinetxt(mediaCurrentTime) + "  out of " + convertTimelinetxt(mediaEndTime));
    }


    function updateStatus(msg) {
        accessDiv.innerHTML = msg;
        accessDiv.style.display = "block";
        if (navigator.platform == "Win32") {
            setTimeout(function () { accessDiv.style.display = "none"; }, 500);
        }
    }


    function play() {
        if(SPPUtility.getIEVersion() == 10) {
            overlay.classList.remove("pvp-quiz-state");
        }
       // playButton.setAttribute("aria-label", langParams.pause.ariaLabel);
		playButton.setAttribute("title", langParams.pause.title);
        updateStatus(langParams.msg.mediaPlay);
    }

    function pause() {
        //playButton.setAttribute("aria-label", langParams.play.ariaLabel);
		playButton.setAttribute("title", langParams.play.title);
        updateStatus(langParams.msg.mediaPaused);
    }

    return {
        updateStatus: function (msg) {
            updateStatus(msg);
        },

        updateTimelineUI: updateTimelineUI,
        toggleChapterAccessibility: function (option) {
            toggleChapterAccessibility(option);
        },
        toggleTabIndex: function (ele, option) {
            toggleTabIndex(ele, option);
        },
        togglePlaylistAccessibility: function (option) {
            togglePlaylistAccessibility(option);
        },
    }
})();
var SmartPearsonPlayer = (function () {

    var media = document.getElementsByTagName('video')[0];
    SPPUtility.log("Media element is " + media);
    media.addEventListener('seeking', eventSeeking);
    media.addEventListener('seeked', eventSeeked);
    media.addEventListener('loadedmetadata', loadedmetadata);
    media.addEventListener('loadeddata', loadeddata);
    media.addEventListener('loadstart', loadstart);
    media.addEventListener('progress', progress);
    media.addEventListener('suspend', suspend);
    media.addEventListener('error', error);
    media.addEventListener('emptied', emptied);
    media.addEventListener('stalled', stalled);
    media.addEventListener('play', play);
    media.addEventListener('pause', pause);
    media.addEventListener('waiting', waiting);
    media.addEventListener('playing', playing);
    media.addEventListener('canplay', canplay);
    media.addEventListener('canplaythrough', canplaythrough);
    media.addEventListener('ended', ended);
    media.addEventListener("volumechange", volumechange);
    media.addEventListener('ratechange', ratechange);
    // Update the seek bar as the video plays
    media.addEventListener("timeupdate", onMediaPlaying);
    var sources = video.getElementsByTagName('source');
    // var HOST_URL = location.protocol + "//" + location.hostname + "/assets/_pmd.true/";
    var HOST_URL = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + "/assets/_pmd.true/"; //MP-6105
    var mimeTypeParams = "mimeType=mpeg4";
    var SIZE = "size=";
    var BITRATE = "bitrate=";
    var videoType = "videoType=";
    var FRAMES="_frames.true";
    var autoplay=false;
    var langParams=SPPUtility.langParams;


    // Buttons
    var playButton = document.getElementById("playBtn");
    var infoBtn = document.getElementById("infoBtn");
    var muteButton = document.getElementById("muteBtn");
    var fullScreenButton = document.getElementById("fs");
    var settingsButton = document.getElementById("settings");
    var timeCounter = document.getElementById("counter-time");
    var progress = document.getElementById("progress");
    var scrubber = document.getElementById("progressBarHandle");
    var duration = document.getElementById("duration");
    var videoWrapper = document.getElementById("videoWrapper");
    var playerWrapper = document.getElementById("playerWrapper");
    var buffered = document.getElementById("buffered");
    var capText = document.getElementsByClassName("captionText")[0];
    //var caption = document.getElementById("captionBtn");
    //var captionWrapper = document.getElementById("captionWrapper");
    var speedRate = document.getElementById("speed-rate");
    var speedBar = document.getElementById("speedBar");
    // List Option
    var renditionList = document.getElementById("rendition-change");

    // Sliders
    var seekBar = document.getElementById("progressBar");

    //Accessbility
    var progressText = document.getElementById("progressText");
    var fullscreenLabel = document.getElementById("fullscreen-label");
    var timelineUI = document.getElementsByClassName("pvp-timeline")[0];
    var playlist = document.getElementsByClassName("pvp-playlist");

    // overlay icon
    var overlay = document.getElementsByClassName("pvp-overlay")[0];
    var waitingOverlay = document.getElementById("overlay");

    var chapterMenu = document.getElementsByClassName("chapter-menu")[0];


    //Quality Box
    var renditionBox = document.getElementById('renditions-popup');
    var langBox=document.getElementById("lang");

    //Video title and description
    var TitleDescriptionWrapper = document.getElementsByClassName("pvp-title-description-wrapper")[0];
    var copyright=document.getElementById("copyrihgt");
    var chkTranscript = document.getElementById("chkTranscript");
    var pvpControls = document.getElementsByClassName("pvp-controls")[0];
    var capText = document.getElementsByClassName("captionText")[0];

    // Looping the video
    var loopingVideo = document.getElementById("looping-video");

    //described video button
    var descriptionBtn = document.getElementById("descriptionBtn");
    var isClipVideo = SPPUtility.getParameterByName('t', media.currentSrc);
    var isClipADVideo = SPPUtility.getParameterByName('tt', media.currentSrc);

    var clipExist = SPPUtility.isClipExists('clip');
     if(!isClipVideo){
        isClipVideo = document.getElementById("clip-timings").value;
     }

     //MP-6644 start
     descriptionBtnClick = "";
     if (descriptionBtn) {
        descriptionBtn.addEventListener('click', function (e) {
            descriptionBtnClick = 1;
        });
     }

     if(!isClipADVideo && descriptionBtnClick != ''){
        isClipVideo = document.getElementById("clip-timings").value;
     }
     //MP-6644 end
    
    //Flags
    var scrubberOffX, speedChange = 0;
    var isTimelineDrag = false;
    var showOverlay = true;
    var seekingTime = 5;
    var timeout;
    var fullScreenChange = "";
    var jsonMsg = "";
    var captionMenuFlag = false;
    var settingOn = false;
    var ieFullScreen = false;
    var standaloneVideoHeight; //for standalone <IE11
    var isMediaPlaying = false; // for more info
    var chapterLoaded = false;
    var externalLoaded = false;
    var currentSpeedRate = 1;
    
    var volumeStyle = document.createElement("STYLE");
    //currentTime for rendition change and other changes

    //storage for poster image 
    var originalPosterUrl = "";

    //bad flag, should remove
    var wasPaused = false;

	//Timepauseblog variables start
	var timePauseIcon = document.getElementById('timePauseIcon'); 
	var timePauseUI = document.getElementById('timePauseUI'); 
	//Timepauseblog variables end

    //MP-7204
    var locationPathname = window.location.pathname;
    var locationSearch = window.location.search;
    var locationHref = window.location.href;

	var storedVolumeVal = 0.5;
    videoWrapper.style.display = "block";

    // to get the feature list options for this assets
    var settingsOptions = document.getElementById('speed-control-need').value;
    if(settingsOptions){
            settingsOptions = JSON.parse(settingsOptions);
    }
    //include described video file
    if (descriptionBtn) {
        var dvJs = document.createElement("script");
        dvJs.type = "text/javascript";
        dvJs.src = "/html5/"+SPPVersion+"/js/desktop/described-video.js";
        document.body.appendChild(dvJs);
    }

    function loadCreditLineLibraries() {
        var CLjs = document.createElement("script");
        CLjs.type = "text/javascript";
        CLjs.src = "/html5/"+SPPVersion+"/js/desktop/credit-lines.js";
        document.body.appendChild(CLjs);
    }
    if(settingsOptions.annotationOption){
        loadCreditLineLibraries();  
    }

    function loadAnotateLibraries() {
        var Ajs = document.createElement("script");
        Ajs.type = "text/javascript";
        Ajs.src = "/html5/"+SPPVersion+"/js/desktop/anotate.js";
        document.body.appendChild(Ajs);
    }

    if(settingsOptions.annotateOption){
        loadAnotateLibraries();
    }

    function loadCaptionLibraries() {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "/html5/"+SPPVersion+"/js/desktop/video-caption.js";
        document.body.appendChild(js);

        var transcriptJs = document.createElement("script");
        transcriptJs.type = "text/javascript";
        transcriptJs.src = "/html5/"+SPPVersion+"/js/desktop/transcript.js";
        document.body.appendChild(transcriptJs);
    }

    function loadChapterLibraries() {
        // hide overlay on loading chapters.
        // MP-8691 Added loadchapter new element id 
        var elem = document.getElementById("extChapJs");
        if(elem != null){
            elem.parentNode.removeChild(elem);
        }
        var overlay = document.getElementsByClassName("pvp-overlay")[0];
        overlay.style.opacity = 0;
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.setAttribute("id", "extChapJs");
        js.src = "/html5/"+SPPVersion+"/js/desktop/chapter.js";
        document.body.appendChild(js);
        //check if this auto play and hide chapters
        if(autoplay == true){
                var chapterMenu = document.getElementsByClassName("chapter-menu")[0];
                var chapterIcon = document.getElementsByClassName("chapter-icon")[0];
                if(chapterMenu && chapterMenu.classList.contains("closed") == false){
                    media.pause();
                    SPPUtility.chapterSlideUp = true;
                    chapterMenu.classList.add("closed");
                    SPPAccessibility.toggleChapterAccessibility(true);
                    chapterIcon.setAttribute("title", langParams['show-chapters']['title']);
                    /* MP-7830 - Added aria-label dynamic */
                    chapterIcon.setAttribute("aria-label", langParams['show-chapters']['title']);
                    media.play();
                }
        }
    }

    function loadPlaylistLibraries() {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "/html5/"+SPPVersion+"/js/desktop/playlist.js";
        document.body.appendChild(js);
    }

    function loadRxFfLibraries() {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "/html5/"+SPPVersion+"/js/desktop/rewind-fastforward.js";
        document.body.appendChild(js);
    }
    
    if(settingsOptions.rxffOption){
      loadRxFfLibraries();
    }

    function loadCaption() {
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            var xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var captionData = xmlhttp.responseText;
                if (captionData != null && captionData != undefined && captionData.length > 1 && captionData != "") {

                    document.getElementById("captionWrapper").innerHTML = captionData;
                    document.getElementById("captions-off").innerHTML  = langParams['transcript']['off'];  
                    if (!stripUrlComponents[1] || captionData != '')
                        document.getElementsByClassName("transcriptChkWrapper")[0].style.display = "block";
                    var captionsMenu = document.getElementsByClassName("pvp-captions-menu")[0];
                    var captionBtn = document.getElementById("captionBtn");
                    captionBtn.setAttribute('title', langParams['closed-caption-on']['title']);
                    //captionBtn.setAttribute('aria-label', langParams['closed-caption-on']['ariaLabel']);
                    captionBtn.addEventListener('click', function (e) {
                        captionsMenu.style.display = (captionsMenu.style.display == 'block' ? 'none' : 'block');
                        if (captionsMenu.style.display == 'block') {
                            captionBtn.setAttribute('title', langParams['closed-caption-off']['title']);
                            // MP-7965 - Removed aria-expanded
                            // captionBtn.setAttribute('aria-expanded', 'true');
                            //captionBtn.setAttribute('aria-label', langParams['closed-caption-off']['ariaLabel']);
                        } else {
                            captionBtn.setAttribute('title', langParams['closed-caption-on']['title']);
                            // MP-7965 - Removed aria-expanded
                            // captionBtn.setAttribute('aria-expanded', 'false');
                            //captionBtn.setAttribute('aria-label', langParams['closed-caption-on']['ariaLabel']);
                        }
                        SmartPearsonPlayer.properties.renditionBox.style.display = "none";
                        settingsButton.setAttribute("title", langParams['settings-on']['title']);
                        settingsButton.setAttribute("aria-label", langParams['settings-on']['ariaLabel']);
                    });
                    document.addEventListener('keypress', function (e) {
                        if (e.keyCode == 99) {
                            captionsMenu.style.display = (captionsMenu.style.display == 'block' ? 'none' : 'block');
                            SmartPearsonPlayer.properties.renditionBox.style.display = "none";
                        }
                    });
                    loadCaptionLibraries();

                }
            }
        }

        var url = locationHref;
        var parseUrl = url.split("?");
        var stripUrlComponents = url.split("?");
        var guidValue = parseUrl[0].split("/");
        var hasQryStr = url.indexOf("?"), carryQryStr = "";
        if (hasQryStr > -1) {
            carryQryStr = "&" + url.substr(hasQryStr + 1, url.length - 1);
        }
        //xmlhttp.open("POST", "/html5/classes/fetch-caption.php?fetchCaption=1&GUID=" + guidValue[guidValue.length - 1] + carryQryStr, true);
        var referenceId;
        if(assetTransfered)
        {    
            referenceId = "GUID=" + guidValue[guidValue.length - 1];
        }else{
            referenceId = "GUID=" + mediaId;
            
        }
        xmlhttp.open("POST", "/html5/classes/fetch-caption.php?fetchCaption=1&"+ referenceId + carryQryStr+ '&migrated=' +assetTransfered, true);
        xmlhttp.send();
        
    }

    loadCaption();

   /*media.addEventListener("mousedown",function(e){
        
        if(e.button ==2){
            //e.preventDefault();
            return false;
        }
    });*/


    /*function checkSpeedAccess(){
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlSpeedAccess = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlSpeedAccess = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlSpeedAccess.onreadystatechange = function () {
            if (xmlSpeedAccess.readyState == 4 && xmlSpeedAccess.status == 200) {

                if(xmlSpeedAccess.responseText == false){
                    if(window.innerWidth > 680){
                        document.getElementsByClassName("speed-txt-wrapper")[0].style.display="inline-block";
                    } else {
                        document.getElementById("speedDiv").style.display="block";
                        document.getElementsByClassName("speed-txt")[0].style.display="none";
                   }
                } else {
                    document.getElementsByClassName("speed-txt-wrapper")[0].style.display="none";
                }
            }
        }
        var url = window.location.href;
        var guidValue = url.split("/");
        var guid=guidValue[guidValue.length-1].split("?");
        xmlSpeedAccess.open("POST", "/html5/classes/fetch-speed.php?fetchSpeed=1&GUID=" + guid[0] + "", true);
        xmlSpeedAccess.send();
    } */
    function checkSpeedAccess(){
		var speedtxtwrapper = document.getElementsByClassName("speed-txt-wrapper")[0];
		var speedtxt = document.getElementsByClassName("speed-txt")[0];
        var speeddivwrapper = document.getElementsByClassName("speedDiv");
		
        if(settingsOptions.speedCntOption){
            if(window.innerWidth > 680){
				if(speedtxtwrapper)
                speedtxtwrapper.style.display="inline-block";
            } else {
				if(speeddivwrapper.length!=0)
                speeddivwrapper.style.display="block";
				if(speedtxt)
                speedtxt.style.display="none";
           }
        } else {
			if(speedtxtwrapper)
            speedtxtwrapper.style.display="none";
        } 
    }

    function loadChapters(dv) {
        // MP-8691 Added audiodescription condition
        if(dv == undefined){
            dv=false;
        }
        //if(chapterLoaded ==true)return;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            var xmlhttpChapters = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttpChapters = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttpChapters.onreadystatechange = function () {
            if (xmlhttpChapters.readyState == 4 && xmlhttpChapters.status == 200) {

                var chapterData = xmlhttpChapters.responseText.split("[THIS-TO-SPLIT]");
                if (chapterData != null && chapterData != undefined && chapterData.length > 1 && chapterData != "") {
                    document.getElementById("player-features").innerHTML = chapterData[0];
                    var chapterMenu = document.getElementsByClassName("chapter-menu")[0];
                    if (chapterMenu) {
                        document.getElementById("pvp-chaptering").innerHTML = "<div class='pvp-chaptering-control'><button aria-label='"+langParams['pre-chapter']['ariaLabel']+"' type='button' tabindex='27' class='pvp-chaptering-bwd' id='chapterPreBtn' title='"+langParams['pre-chapter']['title']+"' role='button' name='skipPrevious' aria-disabled='true'> </button></div>" +
						"<div class='pvp-chaptering-control'><span id='nav_text' style='color:white; font-size: 14px;'></span></div>" +
						"<div class='pvp-chaptering-control'><button aria-label='"+langParams['next-chapter']['ariaLabel']+"' type='button' tabindex='27' class='pvp-chaptering-fwd' id='chapterFwdBtn' role='button' name='skipForward'  title='"+langParams['next-chapter']['title']+"' aria-disabled='false'>  </button></div>";
                        var chapterIcon = document.getElementsByClassName("chapter-icon")[0];
                        chapterIcon.setAttribute("title", langParams['hide-chapters']['title']);
                        /* MP-7830 - Added aria-label dynamic */
                        chapterIcon.setAttribute("aria-label", langParams['hide-chapters']['title']);
                    }
                    // MP-8691 Added audiodescription condition
                    // MP-8904 Audio-descriptor external concept marker
                    //var chap = document.getElementById("chapter-dot-container").getElementsByClassName("conchk-dot")[0];
                    //var elem = document.getElementById("extQuizJs"); 
                    if (descriptionBtnClick != '' && externalLoaded == false) {
                        document.getElementById("chapter-dot-container").innerHTML = chapterData[1];
                    }
                    else {
                        document.getElementById("chapter-dot-container").innerHTML += chapterData[1];
                    }
                    //document.getElementById("chapter-dot-container").innerHTML += chapterData[1];
                    loadChapterLibraries();
                }
            }
        }

        var url = locationHref;
        var parseUrl = url.split("?");
        var guidValue = parseUrl[0].split("/");
        var hasQryStr = url.indexOf("?"), carryQryStr = "";
        if (hasQryStr > -1) {
            carryQryStr = "&" + url.substr(hasQryStr + 1, url.length - 1);
        }

        xmlhttpChapters.open("POST", "/html5/classes/fetch-chapters.php?fetchChapter=1&GUID=" + guidValue[guidValue.length - 1] +"&DV="+dv + carryQryStr + '&migrated=' + assetTransfered +"&xml=" + chapterXml, true);
        xmlhttpChapters.send();
        
        chapterLoaded = true;
    }
    //MP-8764 Marker and Concept check functionalities in clip
    //if (media.clientHeight > SPPUtility.smallPlayerChapterHeight && isClipVideo == "" && clipExist == "" && window.location.href.indexOf(FRAMES) == -1) {
    if (media.clientHeight > SPPUtility.smallPlayerChapterHeight  && window.location.href.indexOf(FRAMES) == -1) {
        loadChapters();
    }

    function loadPlaylist() {
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            var xmlPlaylist = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlPlaylist = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlPlaylist.onreadystatechange = function () {
            if (xmlPlaylist.readyState == 4 && xmlPlaylist.status == 200) {
                var createPlaylistDiv = document.createElement("div");
                createPlaylistDiv.id = "playlist";
                createPlaylistDiv.classList.add("slider");
                createPlaylistDiv.classList.add("closed");
                createPlaylistDiv.innerHTML = xmlPlaylist.responseText;
                document.getElementById("videoWrapper").appendChild(createPlaylistDiv);
                var playlistVideos = document.getElementsByClassName("pvp-playlist");
                if (playlistVideos.length > 0) {
                    document.getElementById("playlist").style.display = "inline-block";
                    loadPlaylistLibraries();
                }
            }
        }
        var url = locationHref;
        var guidValue = url.split("/");
        var guid=guidValue[5].split("?");
        console.log(assetTransfered);
        if(!assetTransfered){
            xmlPlaylist.open("POST", "/html5/classes/fetch-playlist.php?fetchPlaylist=1&GUID=" + guid[0] + "", true);
            xmlPlaylist.send();
        }else{
            xmlPlaylist.open("POST", "/html5/classes/fetch-playlist.php?fetchPlaylist=1&playlist=" + playlistId + "", true);
            xmlPlaylist.send();
        }
    }

    if (locationHref.indexOf("playlist") > -1) {
        loadPlaylist();
    }

    
    function loadFrames(){
         if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            var xmlFrames = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlFrames = new ActiveXObject("Microsoft.XMLHTTP");
        }


        xmlFrames.onreadystatechange = function () {
            if (xmlFrames.readyState == 4 && xmlFrames.status == 200) {
                var frameRate = xmlFrames.responseText;
                SPPUtility.frameRate=frameRate;
                //include External quizzing
                var framesJs = document.createElement("script");
                framesJs.type = "text/javascript";
                framesJs.src = "/html5/"+SPPVersion+"/js/desktop/frame-by-frame.js";
                document.body.appendChild(framesJs);
            }
        }

        var url = locationHref;
        var guidValue = url.split("/");
        var guid=guidValue[5].split("?");
        if(!assetTransfered){
            xmlFrames.open("POST", "/html5/classes/fetch-framerate.php?fetchFrames=1&GUID=" + guid[0] + "", true);
            xmlFrames.send();
        }else if(parseFloat(frameRate) > 0){
            console.log(parseFloat(frameRate));
            SPPUtility.frameRate=frameRate;
            //include External quizzing
            var framesJs = document.createElement("script");
            framesJs.type = "text/javascript";
            framesJs.src = "/html5/"+SPPVersion+"/js/desktop/frame-by-frame.js";
            document.body.appendChild(framesJs);
        }
    }

    function loadExternalQuizLibraries() {
        // MP-6258
        // remove the existing External quizing
        var elem = document.getElementById("extQuizJs");
        if(elem != null){
            elem.parentNode.removeChild(elem);
        }

        //include External quizzing
        var extQuizJs = document.createElement("script");
        extQuizJs.type = "text/javascript";
        extQuizJs.setAttribute("id", "extQuizJs");
        extQuizJs.src = "/html5/"+SPPVersion+"/js/desktop/quiz-external.js";
        document.body.appendChild(extQuizJs);
    }
    // MP-8869 Audio-descriptor internal concept marker display in DV mode
    function loadInternalLibraries (dv) {
        var elem = document.getElementById("extintJs");
        if(elem != null){
            elem.parentNode.removeChild(elem);
        }
        //include Internal Quizzing
        var intQuizJs = document.createElement("script");
        intQuizJs.type = "text/javascript";
        intQuizJs.setAttribute("id", "extintJs");
        intQuizJs.setAttribute("id", "true");
        intQuizJs.src = "/html5/"+SPPVersion+"/js/desktop/quiz-internal.js";
        document.body.appendChild(intQuizJs);
    
    }

    // MP-6258
    function loadExternalQuiz(dv) {
        // MP-6285
        // code for IE7+
        if(dv == undefined){
            dv=false;
        }
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            var xmlhttpExternalQuiz = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttpExternalQuiz = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttpExternalQuiz.onreadystatechange = function () {
            if (xmlhttpExternalQuiz.readyState == 4 && xmlhttpExternalQuiz.status == 200) {
                var externalQuizData = xmlhttpExternalQuiz.responseText.split("[THIS-TO-SPLIT]");
                if (externalQuizData != null && externalQuizData != undefined && externalQuizData.length > 1 && externalQuizData != "") {
                    document.getElementById("external-quiz-wrapper").innerHTML = externalQuizData[0];
                    externalLoaded = true;
                    // MP-6258
                    // MP-6644 if condition added for DV button click action
                    if (descriptionBtnClick != '') {
                        document.getElementById("chapter-dot-container").innerHTML = externalQuizData[1];
                    }
                    else {
                        document.getElementById("chapter-dot-container").innerHTML += externalQuizData[1];
                    }
                    loadExternalQuizLibraries();
                    //MP-6586
                    var chapterExist = document.getElementById("chapter-dot-container").getElementsByClassName("chapter-dot")[0];
                    if (typeof (chapterExist) != 'undefined' && chapterExist != null) {
                        setTimeout(function () {
                            loadChapterLibraries();
                        }, 3000);
                        loadChapterLibraries();
                    }
                }
            }
        }
        var url = locationHref;
        var parseUrl = url.split("?");
        var guidValue = parseUrl[0].split("/");
        var hasQryStr = url.indexOf("?"), carryQryStr = "";
        if (hasQryStr > -1) {
            carryQryStr = "&" + url.substr(hasQryStr + 1, url.length - 1);
        }
        
        xmlhttpExternalQuiz.open("POST", "/html5/classes/fetch-external-quiz.php?fetchQuiz=1&GUID=" + guidValue[guidValue.length - 1]+"&DV="+dv + carryQryStr + '&xml=' + chapterXml +'&migrated=' + assetTransfered, true);
        xmlhttpExternalQuiz.send();
        
        
    }


    function getStoredVolume() {
        try {
            if (typeof (Storage) !== "undefined") {
                if (localStorage.storedVolume) {
                    var temp = Number(localStorage.storedVolume);
                    SPPUtility.log("Return with stored vol : " + temp);
                    if (temp && temp > 0) {
                        return temp;
                    } else {
                        return 0;
                    }
                } else {
                    localStorage.setItem("storedVolume", 0.5);
                    return 0.5;
                }
            } else {
                SPPUtility.log("Unable to retrieve stored volume!");
                return 0.5;
            }
        } catch (e) {
            SPPUtility.log("Error - Unable to retrieve stored volume!");
            return 0.5;
        }
    }
    function storeVolume(volume) {
        try {
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem("storedVolume", volume);
            } else {
                SPPUtility.log("Unable to set stored volume!");
            }
        } catch (e) {
            SPPUtility.log("Error - Unable to set stored volume!");
        }
    }
    var isScriptEmbed = SPPUtility.getParameterByName('scriptEmbed', locationPathname + locationSearch);
    var playerWidth = SPPUtility.getParameterByName('width', locationPathname + locationSearch);
    var playerHeight = SPPUtility.getParameterByName('height', locationPathname + locationSearch);
    if (isScriptEmbed == "true" && (playerWidth == "" || playerHeight == "")) {
		playerWidth = (playerWidth == "") ? SPPUtility.legacyVideoWidth : playerWidth;
		playerHeight = (playerHeight == "") ? SPPUtility.legacyVideoHeight : playerHeight;
        var params = JSON.stringify({
            "type": "view",
            "method": "set",
            "payload": {
                "width": playerWidth,
                "overrideExapnd": true,
                "height": playerHeight,
                "supporFullscreen": 1
            }

        });
        window.parent.postMessage(params, '*');
    }
    storedVolumeVal = getStoredVolume();

    var initialized = false;

    // All needed for clip functionality..
    //MP-7204
    function initPlayer() {
//piSession = window['piSession'];

//piSession.initialize("Gs5nCGqoqwdiccJSkVYAivHK65PCbQ0m", {"useJwt":true});
//piSession.getToken(function(result,token){
  //  debugger;
//alert(result);
//});
        if (initialized) {
            return;
        }
        overlay.style.display = "block";
        overlay.style.opacity = 0;
        var langParams=SPPUtility.langParams;

        SPPUtility.videoWidth = media.clientWidth;
        SPPUtility.videoHeight = media.clientHeight;

        SPPUtility.totalDuration = media.duration;
        initialized = true;
        SPPUtility.log("Player initialized for AssetID - " + assetId);

        // identify if there are clips for the video
        //MP-8730 clip video  rendering in normal and DV mode.
        //clipInfo = SPPUtility.getParameterByName('t', media.currentSrc);
        if(descriptionBtnClick != "") {
            clipInfo = SPPUtility.getParameterByName('tt', media.currentSrc); 
        } else {
            clipInfo = SPPUtility.getParameterByName('t', media.currentSrc);
        }

        // preset all the clip info so that the player will act accordingly...
       if (clipInfo != "") {
            clipStarttime = clipInfo.split(",")[0];
            clipEndtime = clipInfo.split(",")[1];
            SPPUtility.totalDuration = clipEndtime - clipStarttime;
            if (clipStarttime > 0)
                media.currentTime = clipStarttime;
        }

        //Check if speed control is needed
        checkSpeedAccess();
       
    // load internal concept check JS
    //if (document.getElementsByClassName("internalConchk")[0]) {
        //include Internal Quizzing
        //if (document.getElementsByClassName("internalConchk")[0]) {
        //var intQuizJs = document.createElement("script");
        //intQuizJs.type = "text/javascript";
        //intQuizJs.setAttribute("id", "extintJs");
        //intQuizJs.setAttribute("id", "true");
        //intQuizJs.src = "/html5/"+SPPVersion+"/js/desktop/quiz-internal.js";
        //document.body.appendChild(intQuizJs);
        //}
        
        if (media.clientHeight > SPPUtility.smallPlayerHeight)
            loadExternalQuiz();
        // MP-8869 Audio-descriptor internal concept marker display in DV mode
        if (media.clientHeight > SPPUtility.smallPlayerHeight)
            loadInternalLibraries();
		
        if(window.location.href.indexOf(FRAMES) > -1){
            loadFrames();
        }


        //hack for IE range issue
        if (navigator.userAgent.toLowerCase().indexOf("trident") > -1)
            volumeBar.className = volumeBar.className + " ie";
        else if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1)
            volumeBar.className = volumeBar.className + " -moz";
        else
            volumeBar.className = volumeBar.className + " -webkit";
        //Update Values
        SPPUtility.log("media duration : " + SPPUtility.totalDuration);
        if (SPPUtility.totalDuration === Number.POSITIVE_INFINITY || SPPUtility.totalDuration === Number.NEGATIVE_INFINITY || isNaN(SPPUtility.totalDuration)) {
            SPPUtility.totalDuration = 0;
        } else {
            // change the total duration if the video contains the clips
            duration.innerHTML = (clipEndtime && clipStarttime) ? SPPUtility.convertVideoTime(clipEndtime - clipStarttime) : SPPUtility.convertVideoTime(SPPUtility.totalDuration);
        }

        //set Time for Accessibility
        setTimeout(function () {
            SPPAccessibility.updateTimelineUI(media.currentTime);
        }, 3000);


        media.volume = storedVolumeVal;
        if (media.volume == 0) {
            muteButton.className = muteButton.className.replace("pvp-volume-on", "pvp-volume-off");
            muteButton.setAttribute("title", langParams['volume-off']['title']);            
        } else {
            muteButton.setAttribute("title", langParams['volume-on']['title']);
        }
        volumeBar.value = storedVolumeVal * 100;
        volumeBar.style.display = "block";
        muteButton.style.display = "inline-block";
        volumeBar.setAttribute("aria-valuetext", volumeBar.value + "%");
        volumeBarStyleForWebkit();
        pause = function () {
            /*
             var clipData = SPPUtility.getClipData();
            var element = document.getElementById('restart');
            if(clipData.BookModule.eventQueue != null   && element !==null){
                       // element.parentNode.removeChild(element);
                       // clipData.BookModule.eventQueue =[];
            }*/


            if (media.paused == false) {
                // Pause the video
                media.pause();
                SPPUtility.log("Pause");
                //MP-7155 added wrapper
                wrapper.classList.remove("pvp-controls-hide");
                wrapper.classList.add("pvp-controls-show");
                progressBar.classList.remove("miniMode");
                // Update the button text to 'Play'
                playButton.className = playButton.className.replace("pvp-pause-state", "pvp-play-state");
               // playButton.setAttribute('aria-label', langParams['play']['ariaLabel']);
                playButton.setAttribute('title', langParams['play']['title']);
                if (showOverlay == true)
                    overlayicon();
					overlay.setAttribute("aria-label", 'Click overlay icon for play the video');
					overlay.removeAttribute("tabindex");
            }
        }

        play = function () {
           /* var clipData = SPPUtility.getClipData();
            var element = document.getElementById('restart');
            if(clipData.BookModule.eventQueue != null   && element !==null){
                        //element.parentNode.removeChild(element);
                       // clipData.BookModule.eventQueue =[];
        }*/

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
            if (media.paused == true) {
                // reset all the presets needed for the clipping
                if (clipInfo != "" && clipEnded == 1) {
                    clipStarttime = clipInfo.split(",")[0];
                    clipEndtime = clipInfo.split(",")[1];
                    SPPUtility.totalDuration = clipEndtime - clipStarttime;
                    media.currentTime = clipStarttime;
                    clipEnded = 0;
                }

                if (playlist && playlist.length > 0) {
                    SPPPlaylist.closePlaylist();
                }
                // Play the video
                var cTime = media.currentTime;
                media.play();
                SPPUtility.log("Play");
                playButton.className = playButton.className.replace("pvp-play-state", "pvp-pause-state");
                //playButton.setAttribute('aria-label', langParams['pause']['ariaLabel']);
                playButton.setAttribute('title', langParams['pause']['title']);
				
				var middlewrapper = document.getElementsByClassName("pvp-middle-wrapper")[0];
				
				if(middlewrapper.style.display=="block")
				   {					
					//Middle Wrapper fadeout code start here
					middlewrapper.style.opacity = 0;
					middlewrapper.style.transition = "opacity 1.5s";
					middlewrapper.style.display="none";
					//Middle Wrapper fadeout code ends here
				   }

                if (showOverlay == true)
                    overlayicon();
				    overlay.setAttribute("aria-label", 'Click overlay icon for pause the video');
					overlay.removeAttribute("tabindex");
                //overlay.className = "pvp-overlay pvp-pause-state";
                // Update the button text to 'Pause'
            }
			if(timePauseUI)
			timePauseUI.style.display = "none";
			if(timePauseIcon)
			timePauseIcon.style.display = "none";			
        }
		
        togglePlay = function () {
            
            if (media.error) {
                switch (media.error.code) {
                    case 1:
                        SPPUtility.log("Video stopped - trying to reload video.");
                        break;
                    case 2:
                        SPPUtility.log("Network error - trying to reload video.");
                        break;
                    case 3:
                        SPPUtility.log("Video is broken - trying to reload video.");
                        break;
                    case 4:
                        SPPUtility.log("Unsupported format - trying to reload video.");
                        break;
                    default:
                        SPPUtility.log("MediaError - trying to reload video.");
                }
                media.load();
                media.play();
                SPPUtility.log("Video reloaded.");
            } else 
			(media.paused == true) ? play() : pause();
            if(media.paused ==false){
                var clipData = SPPUtility.getClipData();
                if(clipData && clipData.MediaControl && clipData.MediaControl.timeData && clipData.MediaControl.timeData.length>0){
                    clipData.MediaControl.showClipControl('block');
                    clipData.BookModule.navigateFrames(0);
                  
                }
            }
			
        }
		// auto play if its required.
		if(SPPUtility.getParameterByName('autoplay', (locationPathname + locationSearch).toLowerCase()) == "true"){
			togglePlay();
            autoplay=true;
        }

        // Event listener for the play/pause button
        playButton.addEventListener("click", function (event) {
           // var x = event.x || event.clientX;
            //var y = event.y || event.clientY;
            //SPPUtility.log(x + "----" + y);
            //if (x && y) {   
                togglePlay();
				/*timePauseUI.style.display = "none";
				timePauseIcon.style.display = "none";*/
                event.stopPropagation();
            //}
        });


        //Fix for Esc key IE10 full screen
        if (SPPUtility.fullScreenEnabled == false) {
            window.addEventListener("keydown", function (e) {
                if (e.keyCode == 27 && ieFullScreen == true) {
                    toggleFullScreen();
                }
            });
        }



        var timeoutActive = false;

        function toggleAutoHide() {
            // MP-7155 get focused last active element
            if(document.activeElement.id != ''){
                document.getElementById('lastActiveEle').value = document.activeElement.id;
            }
            // MP-7155 set focus last active element
            // document.getElementById('lastActiveEle').value!='playerWrapper' 
            // && document.getElementById('lastActiveEle').value!='fs' && document.getElementById('lastActiveEle').value!='chapterFwdBtn'){
            if(navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
                if(document.getElementById('lastActiveEle').value!='' && document.getElementById('lastActiveEle').value=='play'){
                    // MP-7155 hided display block and none
                    // wrapper.style.display = "block";
                    // document.getElementById(document.getElementById('lastActiveEle').value).focus();
                }
            }else { 
                if(document.getElementById('lastActiveEle').value!=''){
                    document.getElementById(document.getElementById('lastActiveEle').value).focus();
                }
            }
            
            if (!SPPUtility.fixedControlRack) {
                document.body.style.cursor = 'default';
                //wrapper.style.opacity = 1;
                // MP-8355 - hide the 7252 code
                //MP-7252
                // document.getElementById('progressBar').setAttribute('aria-hidden', 'true');

                // MP-7155 hided display block and none
                // wrapper.style.display = "block";
				wrapper.classList.remove("pvp-controls-hide");
                wrapper.classList.add("pvp-controls-show");

                capText.classList.remove("capHide");
                capText.classList.add("capShow");

                progressBar.classList.remove("miniMode");
                scrubber.style.opacity = 1;

                settingOn = (renditionBox.style.display == "none") ? false : true;

                if (!timeoutActive) {
                    timeoutActive = true;
                    timeout = setTimeout(function () {
                        if (!(media.paused || media.ended || media.seeking || settingOn)) {
                            document.body.style.cursor = 'default';
                            if (!SPPUtility.fixedControlRack) {
                                progressBar.classList.add("miniMode");
                                //wrapper.style.opacity = 0;
                                // MP-7155 hided display block and none
								// wrapper.style.display = "none";
                                wrapper.classList.remove("pvp-controls-show");
                                wrapper.classList.add("pvp-controls-hide");
                                scrubber.style.opacity = 0;
                            }

                            capText.classList.remove("capShow");
                            capText.classList.add("capHide");
                            //if(SPPUtility.buttonWrapper) {
                            //SPPUtility.buttonWrapper.style.opacity = 0;
                            //}	
                            if (renditionBox.style.display != "none") {
                                toggleQualityBox();
                            }
                        }
                        timeoutActive = false;
                        clearTimeout(timeout);
                    }, 3000);
                }
            }
        }

        videoWrapper.addEventListener("mousemove", toggleAutoHide);
        wrapper.addEventListener("mousemove", toggleAutoHide);
        window.addEventListener("keydown", toggleAutoHide);
        window.addEventListener("keypress", toggleAutoHide);


        if(langBox){
            langBox.addEventListener("change",function (){
                SPPUtility.setPlayerCookie("lang", langBox.value);

                //If language directly set by URL
                if(locationSearch.indexOf("lang=true") == -1){
                    var matches=locationSearch.match(/lang=[a-z][a-z]_[a-z][a-z]/);
                    var newLocation=locationPathname+locationSearch.replace(matches[0],"lang="+langBox.value);
                    window.location=newLocation;
                }else{
                    location.reload();
                }
                
            });
        }


        if (renditionList) {
            renditionList.addEventListener("change", function () {
                /* MP-7171 Added focus*/
                document.getElementById("settings").focus();

                toggleQualityBox();
                SPPUtility.setSeekBack = true;
                showOverlay = false;
                waitingOverlay.style.display = "block";
                wasPaused = media.paused;
                pause();
                SPPUtility.currentSeekToTime = media.currentTime;
                SPPUtility.log("In rendition change, current time is : " + SPPUtility.currentSeekToTime);

                //change background to a black image, after saving the poster url
                //originalPosterUrl=media.getAttribute('poster');
                //media.setAttribute('poster', "/html5/images/black.jpg");
                if(Math.round(SPPUtility.currentSeekToTime)==0)
				media.setAttribute('poster', media.getAttribute("poster"));

                var currMediaId = "";
                var dvMediaId = "";
                var _videoType = "";
                //get current media url
                var sources = video.getElementsByTagName('source');
                var url = media.src;
                var keysValues = url.split(/[\?&]+/);
                for (i = 0; i < keysValues.length; i++) {
                    var keyValue = keysValues[i].split("=");
                    if (keyValue[0] == "currMediaId") {
                        currMediaId = keyValue[1];
                    }
                    if (keyValue[0] == "dvMediaId") {
                        dvMediaId = keyValue[1];
                    }
                    if (keyValue[0] == "videoType") {
                        _videoType = keyValue[1];
                    }

                }

                var selectedRendition = this.value;

                
                // MP-9067 - OL Migration, on rendition selection, select necessary URL
                if(assetTransfered)
                {
                    var srcUrl;
                    var descriptionDvBtn = document.getElementById("descriptionBtn");
                    if(descriptionDvBtn == null || descriptionDvBtn.className == 'pvp-dv description-off')
                    {
                        for (j = 0; j <= Object.keys(renditionObject).length; j++)
                        {
                            if(selectedRendition == renditionObject[j].Height)
                            {
                                srcUrl = renditionObject[j].URI;
                                break;
                            }
                        }
                    }else{
                        for (j = 0; j <= Object.keys(dvBitrates).length; j++)
                        {
                            if(selectedRendition == dvBitrates[j].Height)
                            {
                                srcUrl = dvBitrates[j].URI;
                                break;
                            }
                        }
                    }

                    try {
                        showOverlay = false;
                        media.src = srcUrl;
                        media.load();
                        media.playbackRate = currentSpeedRate;
                        SPPUtility.setPlayerCookie("selected_rendition", selectedRendition);
                        SPPAccessibility.updateStatus(langParams['msg']['video-quality'] + selectedValues[0].trim() + " pixels");
                    } catch (e) {
                        SPPUtility.log(e);
                    }
                }else{
                    var feedId = SPPUtility.getParameterByName('feedId', locationPathname + locationSearch);
                    var playerAccount = SPPUtility.getParameterByName('playerAccount', locationPathname + locationSearch);
                    var accoununtDetails = (feedId && feedId != "") ? "&feedId=" + feedId : "";
                    var byType = SPPUtility.getParameterByName('by', locationPathname + locationSearch);
                    var fetchBy = (byType && byType != "") ? "&by=" + byType : "";

                    //Check if selected value is auto
                    if (selectedRendition == "AUTO HLS") {
                        SPPUtility.setPlayerCookie("selected_rendition", "AUTO");
                        SPPAccessibility.updateStatus(langParams['msg']['autoMode']);
                        try {
                            accoununtDetails += (playerAccount && playerAccount != "") ? "&playerAccount=" + playerAccount : "";
                            var assetName, assetUrl = locationPathname.split("/");
                            if (assetUrl.length > 0)
                                assetName = assetUrl[assetUrl.length - 1];
                            if (assetName != "") {
                                var srcLink = HOST_URL + assetName + "?" + mimeTypeParams + "&currMediaId=" + currMediaId + fetchBy + "&dvMediaId=" + dvMediaId + "&" + SIZE + "700" + "&" + BITRATE + "400" + accoununtDetails + "&manifest=m3u";
                                showOverlay = false;
                                media.src = srcLink;
                                media.load();
                                //media.playbackRate = speedRate[speedRate.selectedIndex].value;
                                media.playbackRate = currentSpeedRate;
                                SPPUtility.setPlayerCookie("selected_rendition", selectedValues[0].trim());
                                SPPAccessibility.updateStatus(langParams['msg']['video-quality'] + selectedValues[0].trim() + " pixels");
                            }
                        } catch (e) {
                            SPPUtility.log(e);
                        }
                        return;
                    } else {
                        var selectedValues = selectedRendition.split("-");
                    }

                    try {
                        accoununtDetails += (playerAccount && playerAccount != "") ? "&playerAccount=" + playerAccount : "";
                        var assetName, assetUrl = locationPathname.split("/");
                        if (assetUrl.length > 0)
                            assetName = assetUrl[assetUrl.length - 1];
                        if (assetName != "") {
                            var srcLink = HOST_URL + assetName + "?" + mimeTypeParams + "&currMediaId=" + currMediaId + fetchBy + "&dvMediaId=" + dvMediaId + "&" + (_videoType ? videoType + _videoType + "&" : '') + SIZE + selectedValues[0].trim() + "&" + BITRATE + selectedValues[1].trim() + accoununtDetails;
                            showOverlay = false;
                            media.src = srcLink;
                            media.load();
                            //media.playbackRate = speedRate[speedRate.selectedIndex].value;
                            media.playbackRate = currentSpeedRate;
                            SPPUtility.setPlayerCookie("selected_rendition", selectedValues[0].trim());
                            SPPAccessibility.updateStatus(langParams['msg']['video-quality'] + selectedValues[0].trim() + " pixels");
                        }
                    } catch (e) {
                        SPPUtility.log(e);
                    }
                }
            });
        }

        // Visible speed control only for media wigth > 480 devices only
        /*if(window.innerWidth > 680){
           document.getElementById("speedDiv").style.display="none";
           document.getElementsByClassName('speed-txt')[0].style.display = "inline-block";
        } else {
            document.getElementsByClassName('speed-txt')[0].style.display = "none";
            document.getElementById("speedDiv").style.display="block";
        }*/

        if(speedRate)
		{
			speedRate.addEventListener("change", function () {
                /* MP-7665 Added focus*/
                document.getElementById("settings").focus();

				currentSpeedRate = this.value;
				media.playbackRate = this.value;
				speedChange = 0;
				SPPAccessibility.updateStatus(langParams['msg']['video-speed'] + this.value);
				renditionBox.style.display = "none";
				settingOn = false;
				settingsButton.setAttribute("title", langParams['settings-on']['title']);
				settingsButton.setAttribute("aria-label", langParams['settings-on']['ariaLabel']);
				document.getElementById("speed-rate-label").innerHTML = "Video speed changed to "+this.value;
			});
		}

        // Visible Speed Control
        if (speedBar) {
            speedBar.addEventListener("change", function () {
                //MP-7468 - Settings issue fixed
                // document.getElementById("settings").focus();
                currentSpeedRate   = this.value;
                media.playbackRate = speedBar.value;
                speedBar.setAttribute("title", media.playbackRate);
				document.getElementById("speed-txt-label").innerHTML = "Video speed changed to "+this.value;
            });
        }
        // controls rack positioning
        if (document.getElementById("controls")) {
            var controlRackPositionOption = document.getElementById("controls");
            controlRackPosition = function (ele) {
                /* MP-7171 Added focus*/
                document.getElementById("settings").focus();
                
            	var curElement = (typeof ele != "undefined" && ele.type != "change") ? ele : this;
                SPPUtility.setPlayerCookie("control_rack_position", curElement.value);
                if (curElement.value == 2) {
                    // fix the control rack below the video..
                    // modify the control racks to adjust for the settings
                    SPPUtility.controlRackHeight = wrapper.clientHeight + progress.clientHeight;
                    if (SPPUtility.fullScreen == false) {
                        videoWrapper.style.height = videoWrapper.clientHeight + SPPUtility.controlRackHeight + "px";
                    }
                    video.style.height = 100 - ((SPPUtility.controlRackHeight / videoWrapper.clientHeight) * 100) + "%";
                    if (document.getElementById("transcriptText")) {
                        document.getElementById("transcriptText").style.height = "20%";
                    }
                    SPPUtility.fixedControlRack = true;
                    SPPAccessibility.updateStatus(langParams['msg']['control-below']);
					
					/*document.getElementsByClassName("speed-txt")[0].classList.remove("speed-txt-above");
					document.getElementsByClassName("speed-txt")[0].classList.add("speed-txt-below");*/
					
                } else {
                    // fix the control rack overlay on the video..
                    // modify the control racks to adjust for the settings
                    if (SPPUtility.fullScreen == false)
                        videoWrapper.style.height = SPPUtility.playerHeightBelowCntRack - SPPUtility.controlRackHeight + "px";
                    video.style.height = 100 + "%";
                    if (document.getElementById("transcriptText")) {
                        document.getElementById("transcriptText").style.height = "25%";
                    }
                    SPPUtility.fixedControlRack = false;
                    SPPAccessibility.updateStatus(langParams['msg']['control-above']);
					
					/*document.getElementsByClassName("speed-txt")[0].classList.remove("speed-txt-below");
					document.getElementsByClassName("speed-txt")[0].classList.add("speed-txt-above");*/
				
                }
                renditionBox.style.display = "none";
                //MP-6731 revert MP-6026 code
                // document.getElementById("settings").focus(); //MP-6026
                settingsButton.setAttribute("title", langParams['settings-on']['title']);
                settingsButton.setAttribute("aria-label", langParams['settings-on']['ariaLabel']);
                if (typeof SPPQuizInternal.videoResize === "function")
                    SPPQuizInternal.videoResize();
            }
            /* if(! SPPUtility.getPlayerCookie("control_rack_position")){
                // fix the control rack below the video..
                // modify the control racks to adjust for the settings
                SPPUtility.controlRackHeight = wrapper.clientHeight + progress.clientHeight;
                if (SPPUtility.fullScreen == false) {
                    videoWrapper.style.height = videoWrapper.clientHeight + SPPUtility.controlRackHeight + "px";
                }
                video.style.height = 100 - ((SPPUtility.controlRackHeight / videoWrapper.clientHeight) * 100) + "%";
                if (document.getElementById("transcriptText")) {
                    document.getElementById("transcriptText").style.height = "20%";
                }
                SPPUtility.fixedControlRack = true;
                SPPAccessibility.updateStatus(langParams['msg']['control-below']);
                
                // document.getElementsByClassName("speed-txt")[0].classList.remove("speed-txt-above");
                // document.getElementsByClassName("speed-txt")[0].classList.add("speed-txt-below");
            } */
            controlRackPositionOption.addEventListener("change", controlRackPosition);
        }

        //Event listener for Settings Button
        if (settingsButton) {
            settingsButton.addEventListener('click', function () {
                //MP-6894 - CC button issue fixed
                var captionBtn = document.getElementById("captionBtn");
                if(captionBtn){
                    // MP-7965 - Removed aria-expanded
                    // captionBtn.setAttribute('aria-expanded', 'false');
                }
                toggleQualityBox(); 
                //close caption option if opened
                var captionsOptions = document.getElementById("pvp-captions-options-main");
                if (captionsOptions) {
                    if (captionsOptions.style.display == "table") {
                        captionsOptions.style.display = "none";
                        captionBtn.setAttribute('title', langParams['closed-caption-on']['title']);
                        //captionBtn.setAttribute('aria-label', langParams['closed-caption-on']['ariaLabel']);
                    }
                }
            });

            
        }

        function toggleQualityBox() {
            if (renditionBox.style.display == "none") {
                renditionBox.style.display = "inline-block";
                settingsButton.setAttribute("title", langParams['settings-off']['title']);
                settingsButton.setAttribute("aria-label", langParams['settings-off']['ariaLabel']);
                SPPAccessibility.updateStatus(langParams['msg']['settings-show']);
                try {
                    var captionsMenu = document.getElementsByClassName("pvp-captions-menu")[0];
                    if (captionsMenu){
                        captionsMenu.style.display = "none";
                        captionBtn.setAttribute('title', langParams['closed-caption-on']['title']);
                        //captionBtn.setAttribute('aria-label', langParams['closed-caption-on']['ariaLabel']);
                        }
                } catch (e) {
                    SPPUtility.log(e);
                }
                settingOn = true;
            } else {
                renditionBox.style.display = "none";
                settingOn = false;
                settingsButton.setAttribute("title", langParams['settings-on']['title']);
                settingsButton.setAttribute("aria-label", langParams['settings-on']['ariaLabel']);
                SPPAccessibility.updateStatus(langParams['msg']['settings-hide']);
            }
        }
        function onWindowKeypress(e) {
            sendMessage(e.which);
            SPPUtility.fullScreen = document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen ? true : false;
            if (e.which == 27) {
                if (SPPUtility.fullScreen == false){
                    //MP-6155
                    if( media.playbackRate == 1 ){
                        speedRate.value = '1.0';
                    }else{
                        speedRate.value = parseFloat(media.playbackRate);
                    }
                    speedBar.value = media.playbackRate;
                    speedBar.setAttribute("title", media.playbackRate);
                    document.getElementById("speed-txt-label").innerHTML = "Video speed changed to "+media.playbackRate;
                    //MP-6155
                    videoWrapper.classList.remove("fullscreen");
                    fullScreenButton.classList.remove('on');
                    fullScreenButton.classList.add('off');
                }
            }
        }
        window.addEventListener("keyup", onWindowKeypress);
        document.addEventListener('fullscreenchange', exitHandler);
		document.addEventListener('webkitfullscreenchange', exitHandler);
		document.addEventListener('mozfullscreenchange', exitHandler);
		document.addEventListener('MSFullscreenChange', exitHandler);

		function exitHandler() {
			
			var fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement;
			if (!fullscreenElement) {
                //alert('Leaving full-screen mode...');
                //MP-6155
                if( media.playbackRate == 1 ){
                    speedRate.value = '1.0';
                }else{
                    speedRate.value = parseFloat(media.playbackRate);
                }
                speedBar.value = media.playbackRate;
                speedBar.setAttribute("title", media.playbackRate);
                document.getElementById("speed-txt-label").innerHTML = "Video speed changed to "+media.playbackRate;
                //MP-6155
				videoWrapper.classList.remove("fullscreen");
				fullScreenButton.classList.remove('on');
                fullScreenButton.classList.add('off');
                //MP-6434
                if(document.getElementById("captionBtn")){
                    document.getElementById("transcriptChkWrapper").style.display="block";
                }
			}			
		}
		
        // Event listener for the full-screen button
        if (fullScreenButton) {
            fullScreenButton.addEventListener("click", function () {
                toggleFullScreen();
            });
        }

        var toggleFullScreen = function () {
			//MP-5894
			// full-screen available?
            if(SPPUtility.fullScreenEnabled == true) {
				
				var speeddivwrapper = document.getElementsByClassName("speed-txt")[0];
				var speedtxtwrapper = document.getElementsByClassName("speed-txt-wrapper")[0];
		
				if(settingsOptions.speedCntOption){	
                    //MP-6155
                    if( media.playbackRate == 1 ){
                        speedRate.value = '1.0';
                    }else{
                        speedRate.value = parseFloat(media.playbackRate);
                    }
                    speedBar.value = media.playbackRate;
                    speedBar.setAttribute("title", media.playbackRate);
                    document.getElementById("speed-txt-label").innerHTML = "Video speed changed to "+media.playbackRate;
                    //MP-6155
					speedtxtwrapper.style.display="inline-block";
					speeddivwrapper.style.display="inline-block";
				}
			}
			//
            // full-screen available?
            if (SPPUtility.fullScreenEnabled == true) {
                SPPUtility.fullScreen = document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen ? true : false;
                //var videoSize = "90%";
                SPPUtility.log("Toggle Full Screen:" + SPPUtility.fullScreen);
                if (SPPUtility.fullScreen == false) {
                    //videoSize = "93%";
                    videoWrapper.classList.add("fullscreen");
                    if (playerWrapper.msRequestFullscreen) {
                        playerWrapper.msRequestFullscreen();
                        fullScreenChange = document.msFullscreenElement;
                    } else if (playerWrapper.mozRequestFullScreen) {
                        playerWrapper.mozRequestFullScreen(); // Firefox
                        fullScreenChange = document.mozFullScreen;
                    } else if (playerWrapper.webkitRequestFullscreen) {
                        playerWrapper.webkitRequestFullscreen(); // Chrome and Safari
                        fullScreenChange = document.webkitfullscreenchange;
                    }
                    else if (playerWrapper.requestFullScreen) {
                        playerWrapper.requestFullScreen(); // Chrome and Safari
                        fullScreenChange = document.FullscreenElement;
                    }
                    fullScreenButton.classList.remove('off');
                    fullScreenButton.classList.add('on');
/*					document.getElementById('timePauseIcon').classList.add('fullscreen');
					document.getElementById('timePauseUI').classList.add('fullscreen');
*/					if(timePauseIcon) {
					timePauseIcon.classList.add('fullscreen');
					}
					if(timePauseUI) {
					timePauseUI.classList.add('fullscreen');
					}
					document.getElementById("transcriptChkWrapper").style.display="none";
                    fullScreenButton.focus();
                    //	sendMessage("setToFullSceen");

                } else {
                    if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen(); // Firefox
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen(); // Chrome and Safari
                    }
                    
                    fullScreenButton.classList.remove('on');
                    fullScreenButton.classList.add('off');
/*					document.getElementById('timePauseIcon').classList.remove('fullscreen');
					document.getElementById('timePauseUI').classList.remove('fullscreen');
*/					if(timePauseIcon) {
					timePauseIcon.classList.remove('fullscreen');
					}
					if(timePauseUI) {
					timePauseUI.classList.remove('fullscreen');
					}
					if(document.getElementById("captionBtn")) //MP-5887
					    document.getElementById("transcriptChkWrapper").style.display="block";
                    //	sendMessage("backToNormalScreen");
                }
                if (SPPUtility.fixedControlRack) {
                    SPPUtility.videoHeight = media.clientHeight;
                }
            } else {
                //for stand alone player 1- standalone 2- embed 
                if (SPPUtility.playerType == 1) {
                    if (!ieFullScreen) {
                        standaloneVideoHeight = videoWrapper.style.width;
                        videoWrapper.style.height = "100%";
                        videoWrapper.style.width = "100%";
                        playerWrapper.style.marginTop = "0px";
                        fullscreenLabel.innerHTML = langParams['exit-fs']['title'];
                        //MP-8295 Fullscreen title issue change
                        //fullScreenButton.setAttribute("title", langParams['exit-fs']['title']);
                        fullScreenButton.setAttribute("ariaLabel", langParams['exit-fs']['title']);
                        SPPAccessibility.updateStatus(langParams['msg']['fs-on']);
                        sendMessage("setToFullSceen");
                        ieFullScreen = true;
                    } else {
                        videoWrapper.style.height = "";
                        videoWrapper.style.width = standaloneVideoHeight;
                        playerWrapper.style.marginTop = "";
                        resizeVideoElements();
                        fullscreenLabel.innerHTML = langParams['enter-fs']['title'];
                        //MP-8295 Fullscreen title issue change
                        //fullScreenButton.setAttribute("title", langParams['enter-fs']['title']);
                        fullScreenButton.setAttribute("ariaLabel", langParams['enter-fs']['title']);
                        SPPAccessibility.updateStatus(langParams['msg']['fs-off']);
                        sendMessage("backToNormalScreen");
                        ieFullScreen = false;
                    }
                } else {
                    var chkTranscript = document.getElementById("chkTranscript");
                    var transcriptText = document.getElementById("transcriptText");
                    if (!ieFullScreen) {
                        fullscreenLabel.innerHTML = langParams['exit-fs']['title'];
                        //MP-8295 Fullscreen title issue change
                        //fullScreenButton.setAttribute("title", langParams['exit-fs']['title']);
                        fullScreenButton.setAttribute("ariaLabel", langParams['exit-fs']['title']);
                        SPPAccessibility.updateStatus(langParams['msg']['fs-on']);
                        if (transcriptText) {
                            transcriptText.style.display = "none";
                            document.getElementById("videoWrapper").classList.remove("transcriptVideo");
                        }
                        ieFullScreen = true;
                        SPPUtility.fullScreenForIE = true;
                        sendMessage("setToFullSceen");

                    } else {
                        fullscreenLabel.innerHTML = langParams['enter-fs']['title'];
                        //MP-8295 Fullscreen title issue change
                        //fullScreenButton.setAttribute("title", langParams['enter-fs']['title']);
                        fullScreenButton.setAttribute("ariaLabel", langParams['enter-fs']['title']);
                        SPPAccessibility.updateStatus(langParams['msg']['fs-off']);
                        if (transcriptText) {
                            if(chkTranscript){
                                if (chkTranscript.checked) {
                                    transcriptText.style.display = "block";
                                    videoWrapper.classList.add("transcriptVideo");
                                }
                            }
                        }
                        ieFullScreen = false;
                        SPPUtility.fullScreenForIE = false;
                        sendMessage("backToNormalScreen");
                    }
                }
            }
        }

        var resizeVideoElements = function () {
            if (SPPUtility.fullScreen == true) {
                videoWrapper.classList.add("fullscreen");
                videoWrapper.style.width = "100%";
                playerWrapper.style.marginTop = "0px";
                if (fullScreenButton) {
                    fullscreenLabel.innerHTML = langParams['exit-fs']['title'];
                    //MP-8295 Fullscreen title issue change
                    //fullScreenButton.setAttribute("title", langParams['exit-fs']['title']);
                    fullScreenButton.setAttribute("ariaLabel", langParams['exit-fs']['title']);
                    SPPAccessibility.updateStatus(langParams['msg']['fs-on']);
                }
            } else {
                videoWrapper.classList.remove("fullscreen");
                if (SPPUtility.playerType == 1) {
                    if (SPPUtility.fullScreenEnabled == true) {
                        videoWrapper.style.width = SPPUtility.videoWidth;
                        playerWrapper.style.marginTop = "2em";
                    }
                    if (document.getElementById("transcriptText"))
                        document.getElementById("transcriptText").style.width = SPPUtility.videoWidth;
                }
                if (fullScreenButton) {
                    fullscreenLabel.innerHTML = langParams['enter-fs']['title'];
                    //MP-8295 Fullscreen title issue change
                    //fullScreenButton.setAttribute("title", langParams['enter-fs']['title']);
                    fullScreenButton.setAttribute("ariaLabel", langParams['enter-fs']['title']);
                    SPPAccessibility.updateStatus(langParams['msg']['fs-off']);
                }
            }
            scrubber.style.left = progress.clientWidth;
            if (SPPUtility.fixedControlRack) {
                if (SPPUtility.playerHeightBelowCntRack > 0 && SPPUtility.fullScreen == false && SPPUtility.playerType == 1) {
                    if (SPPUtility.getPlayerCookie("control_rack_position") == 2) {
                        videoWrapper.style.height = SPPUtility.playerHeightBelowCntRack + "px";
                        video.style.height = 100 - ((SPPUtility.controlRackHeight / SPPUtility.playerHeightBelowCntRack) * 100) + "%";
                    }
                }
                SPPUtility.videoHeight = media.clientHeight;
            } else {
                if (SPPUtility.playerHeightBelowCntRack > 0 && SPPUtility.fullScreen == false && SPPUtility.playerType == 1) {
                    if (SPPUtility.getPlayerCookie("control_rack_position") == 1) {
                        videoWrapper.style.height = (SPPUtility.playerHeightBelowCntRack - SPPUtility.controlRackHeight) + "px";
                        video.style.height = 100 + "%";
                    }
                }
            }
            // MP-9176 - Revert the 7966 change
            // MP-7966 - Added fullscreen focus
            //setTimeout(function(){
            //    document.getElementById("fs").focus();
            //}, 1000);
        }
        window.addEventListener("resize", function () {
            setTimeout(function () {
                SPPUtility.fullScreen = document.msFullscreenElement || document.mozFullScreen || document.webkitIsFullScreen ? true : false;
                resizeVideoElements();
            }, 200);
        });
        seekBar.addEventListener('keydown', function (e) {
            if(SPPUtility.totalDuration < 6){
                seekingTime = 1;
            } 
            if (e.keyCode == 37 || e.keyCode == 66) {
                SPPUtility.log('Seeking Video Back 10 secs--' + media.currentTime);
                media.currentTime -= seekingTime;
            } else if (e.keyCode == 39 || e.keyCode == 70) {
                var seekTime = media.currentTime + seekingTime;
                SPPUtility.log('Seeking Video Fwd 10 secs');
                if (seekTime > SPPUtility.totalDuration) {
                    seekTime = SPPUtility.totalDuration;
                    playButton.className = playButton.className.replace("pvp-pause-state", "pvp-play-state");
                }
                media.currentTime += seekingTime;
            }
            
            //avoid scrubber to navigate beyond video
            if(e.keyCode !== 9){
                var mediaCurrentTime=(clipStarttime > 0)?media.currentTime - clipStarttime : media.currentTime;
                var seekPer = mediaCurrentTime / SPPUtility.totalDuration * 100;
                progress.style.width = seekPer + "%";
                setTimeout(function () {
                    if(progress.clientWidth == progressBar.clientWidth){
                        scrubber.style.left = progress.clientWidth - scrubber.clientWidth;
                    }else{
                        scrubber.style.left = progress.clientWidth;
                    }
                }, 300);
            }
        });


        // Update the seek bar as the video plays
        media.addEventListener("timeupdate", onMediaPlaying);
        var currentTime;
        var els = document.getElementsByClassName("caption-txt");

        media.onplaying = function (e) {

            Array.prototype.forEach.call(els, function (el) {
                currentTime = SPPUtility.convertVideoTime(media.currentTime);
                if (el.className.indexOf(currentTime) > -1) {
                    if (el.previousElementSibling)
                        el.previousElementSibling.className = el.previousElementSibling.className.replace(/selected/g, "");
                    el.className = el.className + " selected";
                }
                SPPUtility.log(el.tagName);
            });

        }
        // Pause the video when the seek handle is being dragged
        seekBar.addEventListener("click", function (e) {
            if (!e)
                e = window.event;
            if (isTimelineDrag == false) {
                var seekPosWidth = e.offsetX == undefined ? e.layerX : e.offsetX;
                var seekPercentage = seekPosWidth / progressBar.clientWidth * 100;
                progress.style.width = seekPercentage + "%";
                scrubber.style.left = seekPosWidth;
                var seekTime = seekPercentage / 100 * SPPUtility.totalDuration;
                SPPUtility.log('Timeline Seek---' + seekTime);

                currentTime = seekPercentage / 100 * SPPUtility.totalDuration;
                media.currentTime=(clipInfo != "") ? addClipTime(currentTime) : currentTime;
                timeCounter.innerHTML = SPPUtility.convertVideoTime(currentTime);
				if(document.getElementById("fastForward")){		
					//SmartPearsonPlayer.pause();		
					var startSystemTime = new Date().getTime();		
					var startVideoTime = media.currentTime = (clipInfo != "") ? addClipTime(currentTime) : currentTime;							
				}
                //clipStarttime = 0;
            }
        });

        //Event Listeners for TimeLine Seek
        scrubber.addEventListener('mousedown', function (e) {
            if (!e)
                e = window.event;
            isTimelineDrag = true;
            SPPUtility.log('Video Seeking---------');
            window.addEventListener('mousemove', scrubberMove, true);
            scrubberOffX = e.clientX - parseInt(scrubber.offsetLeft);
        });


        function addClipTime(seekTime){
            return parseFloat(seekTime)+parseFloat(clipStarttime);
        }

        function scrubberMove(e) {
            if (!e)
                e = window.event;
            if (isTimelineDrag == true) {
                var startInit = 0;
                var endPoint = progressBar.clientWidth - scrubber.clientWidth;
                var offX = e.clientX - parseInt(scrubber.offsetLeft);
                scrubber.style.position = 'absolute';
                var seekTimelinePosWidth = e.clientX - scrubberOffX;
                var seekPercentage = seekTimelinePosWidth / progressBar.clientWidth * 100;
                if (seekPercentage <= 100 && seekPercentage >= 0) {
                    setSeek(seekPercentage, 0);

                }
            }
        }

        window.addEventListener('mouseup', function (e) {
            if (isTimelineDrag == true) {
                window.removeEventListener('mousemove', scrubberMove, true);
                var seekTimelinePosWidth = e.clientX - scrubberOffX;
                var seekPercentage = seekTimelinePosWidth / progressBar.clientWidth * 100;
                // if (seekPercentage <= 100 && seekPercentage >= 0) {
                if(1){
                    progress.style.width = seekPercentage + "%";
                   
                    currentTime = seekPercentage / 100 * SPPUtility.totalDuration;
                    media.currentTime=(clipInfo != "") ? addClipTime(currentTime) : currentTime;
                    //MP-5569
                    var convertVideoTime = SPPUtility.convertVideoTime(currentTime); 
                    timeCounter.innerHTML = (seekPercentage >= 0) ? convertVideoTime : "00:00";
                    // timeCounter.innerHTML = SPPUtility.convertVideoTime(currentTime);
                    //MP-5569
                    setTimeout(function () {
                        isTimelineDrag = false
                    }, 2000);
					if(document.getElementById("fastForward")){		
						//SmartPearsonPlayer.pause();		
						startSystemTime = new Date().getTime();		
						startVideoTime = media.currentTime = (clipInfo != "") ? addClipTime(currentTime) : currentTime;							
					}
                }
                SPPUtility.log('Video Seeking Ended---------');
            }
        });

        //setting tooltip for volume scrubber first time on page load
        volumeBar.setAttribute('title', (media.volume * 100).toFixed(0) + "%");

        function getVolume(){
            media.volume = volumeBar.value / 100;
            // MP-7153 added if condition for existing code
            if(navigator.appVersion.indexOf("Edge") != -1){
                volumeBar.setAttribute('aria-valuenow', media.volume * 100);
                volumeBar.setAttribute('aria-valuetext', media.volume * 100 + "%");
                volumeBar.setAttribute('title', (media.volume * 100).toFixed(0) + "%");
                volumeBar.setAttribute("aria-valuetext", volumeBar.value + "%");
            }
                        
            storeVolume(media.volume);
            if (media.volume == 0) {
                muteButton.className = muteButton.className.replace("pvp-volume-on", "pvp-volume-off");
                muteButton.setAttribute("title", langParams['volume-off']['title']);                
            } else {
                storedVolumeVal = media.volume;
            }
            // MP-7153 Hided    
            // volumeBar.setAttribute("aria-valuetext", volumeBar.value + "%");
            //MP-7622 - Added title attribute
            volumeBar.setAttribute('title', (media.volume * 100).toFixed(0) + "%");
            SPPAccessibility.updateStatus(langParams['msg']['volume-change']+" "+volumeBar.value+"%");
            volumeBarStyleForWebkit();
        }

        volumeBar.addEventListener("input", getVolume);
        volumeBar.addEventListener("change", getVolume);


        function volumeBarStyleForWebkit(){
            volumeStyle.innerHTML = '';
            var percent = Math.ceil(((volumeBar.value - volumeBar.getAttribute('aria-valuemin')) / (volumeBar.getAttribute('aria-valuemax') - volumeBar.getAttribute('aria-valuemin'))) * 100);
            volumeStyle.appendChild(document.createTextNode('.pvp-volume input[type=range]::-webkit-slider-runnable-track  { background: -webkit-linear-gradient(left, #00B6FF 0%, #00B6FF ' + percent + '%, grey ' + percent + '%) }'));
            document.head.appendChild(volumeStyle);
        }

        // CHANGED - was "dblclick". Changed to "click" for mute. Hide/show of volume slider disabled below.
        muteButton.addEventListener("click", function () {
            if (muteButton.className.indexOf("pvp-volume-on") > -1) {
                toggleMute(true);
                volumeBarStyleForWebkit();
                SPPAccessibility.updateStatus(langParams['msg']['muted']);
            } else {
                toggleMute();
                volumeBarStyleForWebkit();
                SPPAccessibility.updateStatus(langParams['msg']['v-reset']);

            }
        });

        TitleDescriptionWrapper.classList.add("closed-title");

        infoBtn.addEventListener("click", function () {
            if (TitleDescriptionWrapper.style.display == "none") {
                TitleDescriptionWrapper.style.display = "block";
            }
            var chapterMenu = document.getElementsByClassName("chapter-menu")[0];
            var chapterIcon = document.getElementsByClassName("chapter-icon")[0];
            if (chapterMenu) {
                SPPUtility.chapterSlideUp = true;
                chapterMenu.classList.add("slider");
                chapterMenu.classList.add("closed");
                SPPAccessibility.toggleChapterAccessibility(false);
                chapterIcon.setAttribute("title", langParams['show-chapters']['title']);
                /* MP-7830 - Added aria-label dynamic */
                chapterIcon.setAttribute("aria-label", langParams['show-chapters']['title']);
            }
            if (playlist && playlist.length > 0) {
                SPPPlaylist.closePlaylist();
            }
            if (this.className == "more-info info-on") {
                isMediaPlaying = (media.paused) ? false : true;
                TitleDescriptionWrapper.classList.remove("closed-title")
                TitleDescriptionWrapper.classList.add("slider-title");
                SPPAccessibility.toggleTabIndex(TitleDescriptionWrapper, true);
                SPPAccessibility.toggleTabIndex(copyright,true);
                this.className = "more-info info-off";
                /*MP-7564 - Info title issue fixed */
                this.setAttribute("title", "Info: " + langParams['hide-title']['title']);
                sendMessage("InfoVisible");
                //this.setAttribute("aria-label", langParams['hide-title']['ariaLabel']);
                SPPAccessibility.updateStatus(langParams['msg']['title-show']);
                if (isMediaPlaying) {
                    media.pause();
                    SPPUtility.log("Pause");
                    // Update the button text to 'Play'
                    playButton.className = playButton.className.replace("pvp-pause-state", "pvp-play-state");
                    //playButton.setAttribute('aria-label', langParams['play']['ariaLabel']);
                    playButton.setAttribute('title', langParams['play']['title']);
                    if (showOverlay == true)
                        overlayicon();
                }
                //MP-6886 - Background content issue is fixed
                TitleDescriptionWrapper.setAttribute('aria-hidden', 'false');
            } else {
                TitleDescriptionWrapper.classList.remove("slider-title")
                TitleDescriptionWrapper.classList.add("closed-title");
                SPPAccessibility.toggleTabIndex(TitleDescriptionWrapper, false);
                SPPAccessibility.toggleTabIndex(copyright,false);
                SPPAccessibility.updateStatus(langParams['msg']['title-hidden']);
                this.className = "more-info info-on";
                 /*MP-7564 - Info title issue fixed */
                this.setAttribute("title", "Info: " + langParams['show-title']['title']);
                sendMessage("InfoHidden");
                //this.setAttribute("aria-label", langParams['show-title']['ariaLabel']);
                if (isMediaPlaying) {
                    media.play();
                    SPPUtility.log("Play");
                    playButton.className = playButton.className.replace("pvp-play-state", "pvp-pause-state");
                   // playButton.setAttribute('aria-label', langParams['pause']['ariaLabel']);
                    playButton.setAttribute('title', langParams['pause']['title']);
                    if (showOverlay == true)
                        overlayicon();
                }
                // MP-6886 - Background content issue is fixed
                TitleDescriptionWrapper.setAttribute('aria-hidden', 'true');
            }
        });
		
		
    }

    function setSeek(seekWidth, forceSeek) {
        seekWidth = (isClipVideo != "" && seekWidth >= 100) ? 0 : seekWidth;
        // MP-6103
        progress.style.width = (seekWidth != 0 && isClipVideo != "") ? (seekWidth) + "%" : seekWidth + "%";
        // MP-6103
        if (progress.clientWidth <= seekBar.clientWidth - scrubber.clientWidth && parseInt(scrubber.clientLeft) < media.clientWidth - scrubber.clientWidth) {
            scrubber.style.left = seekBar.clientWidth * seekWidth / 100;
        }
        if (parseInt(scrubber.style.left) > media.clientWidth - scrubber.clientWidth)
            scrubber.style.left = seekBar.clientWidth - scrubber.clientWidth;
        if (forceSeek == 1)
            scrubber.style.left = seekBar.clientWidth * seekWidth / 100;
    }

    function setBuffered(bufferedStart, bufferedEnd) {
        //buffered.style.left = bufferedStart + "%";
        buffered.style.width = (bufferedEnd) + "%";
    }

    function activateAccessibility() {
        // wrapper.style.opacity = 1;
        wrapper.classList.remove("pvp-controls-hide");
        wrapper.classList.add("pvp-controls-show");

        progressBar.classList.remove("miniMode");
        scrubber.style.opacity = 1;
        document.body.style.cursor = 'default';
        capText.classList.remove("capHide");
        capText.classList.add("capShow");
    }

    function toggleMute(mute) {
        if (mute) {
            media.muted = true;
            storeVolume(0);
            sendMessage("mediaMute");
            volumeBar.value = 0 * 100;
            storedVolumeVal = media.volume;
            media.volume = 0;
            muteButton.className = muteButton.className.replace("pvp-volume-on", "pvp-volume-off");
            muteButton.setAttribute("title", langParams['volume-off']['title']);            
            volumeBar.setAttribute('title', (media.volume * 100).toFixed(0) + "%");
        } else {
            media.muted = false;
            if (storedVolumeVal != 0)
                media.volume = storedVolumeVal;
            else
                media.volume = 0.5;
            storeVolume(media.volume);
            sendMessage("mediaUnmute");
            muteButton.className = muteButton.className.replace("pvp-volume-off", "pvp-volume-on");
            muteButton.setAttribute("title",langParams['volume-on']['title']);
            SPPUtility.log(media.volume);
            volumeBar.value = media.volume * 100;
            volumeBar.setAttribute('title', (media.volume * 100).toFixed(0) + "%");
        }
        volumeBar.setAttribute("aria-valuetext", volumeBar.value + "%");
    }

    window.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 9:  //Tab
                activateAccessibility();
                break;
			case 13:  //Enter key for Play/Pause
				if(document.activeElement.id=="progressIcon")
				{
					(media.paused == true) ? play() : pause();
					overlay.removeAttribute("tabindex");
				}
                break;	
            case 80: // P for Play/Pause
                (media.paused == true) ? play() : pause();
				overlay.removeAttribute("tabindex");
                break;
            case 32: //SpaceBar for Play/Pause
                e.preventDefault();
                e.stopPropagation();
				if(document.activeElement.id=="playBtn" || document.activeElement.id=="progressIcon")
				{
					(media.paused == true) ? play() : pause();
					if(media.paused !==true){
						var clipData = SPPUtility.getClipData();
						if(clipData && clipData.MediaControl && clipData.MediaControl.timeData && clipData.MediaControl.timeData.length>0){
						clipData.MediaControl.showClipControl('block');
						clipData.BookModule.navigateFrames();
						}
					}
                }
                break;
            /*case 35: //End Key for Seek for Timeline
                pause();
                SPPUtility.log('Seeking to End');
                media.currentTime=(clipInfo != "") ? parseFloat(clipEndtime) : SPPUtility.totalDuration;
               // media.currentTime = SPPUtility.totalDuration;
                progress.style.width = '100%';
                scrubber.style.left = progress.clientWidth - scrubber.clientWidth;
                overlay.style.opacity=1;

                //Force browsers like IE to fire END event and load from first
                if(media.ended == false && (navigator.userAgent.indexOf("MSIE") || navigator.userAgent.indexOf("trident"))){
                   media.play();
                   setTimeout(function(){
                    if(media.load()){
                        media.currentTime=(clipInfo != "") ? parseFloat(clipStarttime) : 0;
                    }
                   },1000);
                }
                break;*/ 
            case 35: //End Key for Seek for Timeline
                var selectedElement = document.activeElement;
                if(selectedElement.id && selectedElement.id == 'volumeBar'){
                    return false;
                }
                ended();
                SPPUtility.log('Seeking to End');                
                //Force browsers like IE to fire END event and load from first
               /*if(media.ended == false && (navigator.userAgent.indexOf("MSIE") || navigator.userAgent.indexOf("trident"))){
                   media.load();
                   setTimeout(function(){
                    if(media.load()){
                        media.currentTime=(clipInfo != "") ? parseFloat(clipStarttime) : 0;        
                    }
                   },1000);
                }*/
              
                break;
            case 36: // Home key to seek begining
                var selectedElement = document.activeElement;
                if(selectedElement.id && selectedElement.id == 'volumeBar'){
                    return false;
                }
                pause();
                currentTime = 0;
                media.currentTime=(clipInfo != "") ? currentTime+parseFloat(clipStarttime) : currentTime;
                timeCounter.innerHTML = SPPUtility.convertVideoTime(currentTime);
                //SPPUtility.log('Seeking to Home');
                progress.style.width = '0%';
                scrubber.style.left = progress.clientWidth;
                play();
                break;
            default:
        }
    });

    playBtn.addEventListener('focus', function (e) {
        capText.classList.remove("capHide");
        capText.classList.add("capShow");
        activateAccessibility();
    });

    wrapper.addEventListener('focus', function (e) {

    });
    // overlay play/pause icon	
    var lock = 0;
    overlayicon = function (e) {
        // hide volume treating a its on blur
        // volumeContainer.style.display = "none";
        // lock if the animation in progress.
        if (lock == 0) {
            overlay.className = overlay.className.replace("pvp-replay-state", "");
            //toggle the icon
            overlay.style.opacity = 0;
            overlay.style.transform = "scale(0.7)";

            overlay.className = (overlay.className.indexOf("pvp-pause-state") > -1) ?
			overlay.className.replace("pvp-pause-state", "pvp-play-state") :
			overlay.className.replace("pvp-play-state", "pvp-pause-state");
            // first time click								
            if (overlay.className.indexOf("pvp-pause-state") == -1
			&& overlay.className.indexOf("pvp-play-state") == -1
			|| (overlay.className.indexOf("pvp-replay-state") > -1))
                overlay.className = "pvp-overlay pvp-play-state";

            var opacity = 0, scale = 0.7, flag = 1;
            lock = 1;
            overlayfade(flag);
            // click play only if its not play icon
            if (e && e.currentTarget && (e.currentTarget == video || e.currentTarget == overlay) && initialized)
                togglePlay();
        }

        renditionBox.style.display = "none";
        settingOn = false;
        settingsButton.setAttribute("title", langParams['settings-on']['title']);
        settingsButton.setAttribute("aria-label", langParams['settings-on']['ariaLabel']);

        function overlayfade(flag) {
            if (opacity < 1 && flag == 1) {
                opacity += .1;
                scale += .03;
                setTimeout(function () {
                    overlayfade(1)
                }, 50);
                overlay.style.cursor = "auto";
            } else if (opacity > 0) {
                opacity -= .3;
                scale = 1.1;
                setTimeout(function () {
                    overlayfade(2)
                }, 100);
                overlay.style.cursor = "auto";
            } else
                lock = 0;
            overlay.style.transform = "scale(" + scale + ")";

            //Avoid Hiding If media is ended
            if(overlay.classList.contains("pvp-replay-state") == false)
                overlay.style.opacity = opacity;

        }
    }
    media.addEventListener("click", overlayicon);
    overlay.addEventListener("click", overlayicon);
    var clipNonStarttime=0,clipNonEndtime=0;
    var isClipADonly = false;
    function onMediaPlaying(state) {
        // Update the slider value
        // set the current time of the media based on the clips information 
        // if there is no clips then start as usual
        //MP-8751 clip video different timing
        //MP-8730 clip video  rendering in normal and DV mode.
        if(isClipADVideo != " " && descriptionBtnClick != " " && media.currentTime == 0 ) {
            
            isClipADonly = true;
            clipStarttime = isClipADVideo.split(",")[0];
            clipEndtime = isClipADVideo.split(",")[1];
            SPPUtility.totalDuration = clipEndtime - clipStarttime;
            media.duration = SPPUtility.totalDuration;
            media.currentTime = clipStarttime;
        
        }
        if(isClipVideo != "") {
            clipNonStarttime = isClipVideo.split(",")[0];
            clipNonEndtime = isClipVideo.split(",")[1];
        }
        
        ////MP-8730 clip video  rendering in norma and DV mode.    
        if(clipNonStarttime == '0' &&  clipNonEndtime == '0' && media.currentTime > 0 && !isClipADonly
         && isClipVideo != "" ) {
            
            clipStarttime = clipNonStarttime;
            clipEndtime = clipNonEndtime;
            SPPUtility.totalDuration = clipEndtime - clipStarttime;
            media.duration = SPPUtility.totalDuration;
                                     
            media.currentTime = clipNonStarttime;
                       
        }

        if(isClipADVideo != ""){
            clipVideo = isClipADVideo.split(",")[0];
        }
        //MP-8730 clip video  rendering in normal and DV mode.
        if(clipStarttime < media.currentTime && clipVideo == media.currentTime && isClipVideo != "") {
            clipStarttime = isClipVideo.split(",")[0];
            clipEndtime = isClipVideo.split(",")[1];
            SPPUtility.totalDuration = clipEndtime - clipStarttime;
            media.duration = SPPUtility.totalDuration;
            media.currentTime = clipStarttime;
        }
        
        if (clipEnded == 0)
            currentTime = (clipStarttime && clipStarttime != "" && clipEndtime && clipEndtime != "") ? (media.currentTime - clipStarttime) : media.currentTime;

        // stimulate the media end event when the clip ends
        if (currentTime >= SPPUtility.totalDuration && clipEnded == 0) {
            currentTime = 0;
            ended();
            return false;
        }
        
        if (clipEnded == 1)
            currentTime = SPPUtility.totalDuration;
        // reset the timer once video reaches the ending
        if (currentTime == SPPUtility.totalDuration)
            currentTime = 0;
            
        // MP-8978 Facing issue in skip Previous button 
        if(isNaN(SPPUtility.totalDuration)) {
            if(clipStarttime == "" || clipEndtime == "") {
                SPPUtility.totalDuration = media.duration;
            }
        }
    
        timeCounter.innerHTML = SPPUtility.convertVideoTime(currentTime);
        SPPAccessibility.updateTimelineUI();
        if (currentTime > 0) {
            var percentage = currentTime * (100 / SPPUtility.totalDuration);
            progressText.innerHTML = "Playback " + parseInt(percentage) + "% complete";
            if (isTimelineDrag == false) {
                setSeek(percentage, 0);
            }
            if (currentTime == SPPUtility.totalDuration) {
                playButton.className = playButton.className.replace("pvp-pause-state", "pvp-play-state");
            }


            try {
                var className = Math.round(currentTime) / 100;
                document.getElementsByClassName(className).setAttribute("class", "selected");
            } catch (e) {

            }
            sendMessage("eventTime");
        }

    }
    function appendLog(text) {
        SPPUtility.log(text);
    }
    function getSeeking() {
        SPPUtility.log("Seeking value: " + media.seeking);
    }
    function getTime() {
        SPPUtility.log("currentTime value: " + media.currentTime);
    }
    function doSeek(time) {
        media.currentTime = time;
    }
    function eventSeeking() {
        //buffered.style.display = "none";
        sendMessage("mediaSeek");
        SPPUtility.log("Seeking event fired (seeking=" + media.seeking + ", currentTime=" + media.currentTime + ")");
    }
    function eventSeeked() {
        sendMessage("mediaProgress");

        waitingOverlay.style.display = "none";
        SPPUtility.log("Seeked event fired (seeking=" + media.seeking + ", currentTime=" + media.currentTime + ")");
    }
    function loadedmetadata() {
        lateInit();
        SPPUtility.log("Metadata Loaded...");
    }
    function loadeddata() {
        sendMessage("mediaReady");
        SPPUtility.log("Data for playback loaded");
    }
    function loadstart() {
        SPPUtility.log("Looking for Media data");
    }
    function progress() {
        buffered.style.display = "block";
        //get the buffered ranges data
        var ranges = [];
        for (var i = 0; i < media.buffered.length; i++) {
            ranges.push([
			media.buffered.start(i),
			media.buffered.end(i)
            ]);
        }

        if (media.buffered.length > 0 && typeof ranges[media.buffered.length - 1] != "undefined") {
            for (var i = 0; i < ranges.length; i++) {
                if (media.currentTime == 0 || media.currentTime < ranges[i][1] && media.currentTime > ranges[i][0]) {
                    setBuffered(Math.round((ranges[i][0] / media.duration) * (100)),
					Math.round((ranges[i][1] / media.duration) * (100)));
                }
            }
        }
        SPPUtility.log("Downloading video...");
    }
    function suspend() {
        //		SPPUtility.log("Player suspended");
    }
    function error() {
        SPPUtility.log("Player error");
    }
    function emptied() {
        SPPUtility.log("Emptied!");
    }
    function stalled() {
        SPPUtility.log("stalled!!!");
    }
    function play() {
        //media.playbackRate = speedRate[speedRate.selectedIndex].value;
        media.playbackRate = currentSpeedRate;
        if (media.currentTime > 1) {
            sendMessage("mediaResume");
        } else {
            sendMessage("mediaPlay");
        }
        SPPUtility.log("Play starting...");
        // hide if title and description opened.
        TitleDescriptionWrapper.classList.remove("slider-title")
        TitleDescriptionWrapper.classList.add("closed-title");
        SPPAccessibility.toggleTabIndex(TitleDescriptionWrapper, false);
        SPPAccessibility.toggleTabIndex(copyright,false);
        infoBtn.className = "more-info info-on";
        /*MP-7323 - added info text in title attribute*/
        infoBtn.setAttribute("title", "Info: " + langParams['show-title']['title']);

    }
    function pause() {
        sendMessage("mediaPause");
        SPPUtility.log("Player paused");
    }
    function volumechange() {
        if (media.volume == 0) {
            sendMessage("mediaMute");
            SPPUtility.log("Volume Muted");
        } else {
            sendMessage("mediaVolumeChange");
            media.muted = false;
            muteButton.className = muteButton.className.replace("pvp-volume-off", "pvp-volume-on");
            muteButton.setAttribute("title", langParams['volume-on']['title']);
            SPPUtility.log("Volume Change");
        }
    }
    function waiting() {
        SPPUtility.log("Player waiting");
    }
    function playing() {
        SPPUtility.log("Player playing");
        waitingOverlay.style.display = "none";
        showOverlay = true;
    }
    function canplay() {
        lateInit();
        SPPUtility.log("Can play with disruptions");
    }
    function canplaythrough() {
        lateInit();
    }
    function ended() {
        timeCounter.innerHTML = SPPUtility.convertVideoTime(media.currentTime);
        // Update the button text to 'Play'
        media.pause();
        playButton.classList.remove("pvp-pause-state");
        playButton.classList.add("pvp-play-state");

        playButton.setAttribute('title', langParams['play']['title']);
        overlay.classList.remove("pvp-play-state");
        //overlay.classList.add("pvp-pause-state");
        overlay.classList.add("pvp-replay-state");
		overlay.setAttribute("aria-label", 'Click overlay icon for play the video again');
		overlay.setAttribute("tabindex", 26);
        setBuffered(0, 0);
        setSeek(0, 1);
        overlay.style.opacity = 0;
        // do this action when clips are involved. Simulate the media end event.
        if (clipEndtime) {
            //media.currentTime = media.duration;
            clipEnded = 1;
        }
        if (playlist && playlist.length > 0) {
            SPPPlaylist.openPlaylist();
        }
        // reset the video progress timer
        //Remove captions 
        document.getElementsByClassName('captionText')[0].innerHTML = "";
        sendMessage("mediaEnd");
        SPPUtility.log("playback ended");
        media.setAttribute("poster", originalPosterUrl);
        timeCounter.innerHTML = SPPUtility.convertVideoTime(0);
		
		//After end of video chapter count reset code start
		var chapterMenu = document.getElementsByClassName("chapter-menu")[0];
        if(chapterMenu) {
    		var chapters = chapterMenu.getElementsByTagName("li");
    		var currentChapter = 0;
    		var chapterCounts = chapters.length;
    		var nav_text = document.getElementById("nav_text");
    		nav_text.innerHTML = "" + (currentChapter + 1) + " / " + chapterCounts + "";
    		//After end of video chapter count reset code end
		}
        media.load();

        //MP-6779 - Clip video repeat play in IE added if condition
        if(navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
            if(loopingVideo.value == 1){
                playButton.classList.remove("pvp-play-state");
                playButton.classList.add("pvp-pause-state");
            }
            media.onloadeddata = function() {
                // Looping the video based on the user input
                if(loopingVideo.value == 1){
                    //MP-5888
                    clipEnded = 0;
                    if( media.currentTime !== clipStarttime ){
                        media.currentTime = clipStarttime;
                    }
                    //
                    media.play();
                    playButton.classList.remove("pvp-play-state");
                    playButton.classList.add("pvp-pause-state");
                    //overlay.classList.remove("pvp-pause-state");
                    overlay.classList.remove("pvp-replay-state");
                    overlay.removeAttribute("tabindex");
                    overlay.style.opacity = 0;
                }
            };
        }
        else{
          
            // Looping the video based on the user input
            if(loopingVideo.value == 1){
                //MP-5888
                clipEnded = 0;
                if( media.currentTime !== clipStarttime ){
                    media.currentTime = clipStarttime;
                }
                //
                media.play();
                playButton.classList.remove("pvp-play-state");
                playButton.classList.add("pvp-pause-state");
                //overlay.classList.remove("pvp-pause-state");
                overlay.classList.remove("pvp-replay-state");
                overlay.removeAttribute("tabindex");
                overlay.style.opacity = 0;
            }
        }
        
    }

    loopingVideo.addEventListener("change",function(){
            document.getElementById("renditions-popup").style.display= "none";
            /* MP-7171 Added focus*/
            document.getElementById("settings").focus();
    });

    function ratechange() {
        sendMessage("mediaPlaybackRateChange");
        SPPUtility.log("Play Back rate Changed");
    }

    //Generate UUID
    function generateUUID() {
        var d = new Date().getTime();
        var guuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        var uuid = guuid;
        SPPUtility.log("UUID Generated:" + guuid);
        return guuid;
    }

    function sendMessage(playerEvent) {
        var uuid = generateUUID();
        var jsonMsg = {
            "messageID": uuid,
            "timestamp": new Date().getTime(),
            "type": "media_message",
            "source": "spp",
            "method": "media_publish",
            "topic": "media_lifecycle",
            "topicData": {
                "event": "oninteraction",
                "interactionSpecifier": playerEvent,
                "item": {
                    "activitiyID": uuid
                }
            },
            "message": {
                "title": assetId,
                "resolution": "",
                "bitrate": "",
                "supportFullscreen": true,
                "time": media.currentTime
            }
        };
        SPPUtility.log("Send Message:" + JSON.stringify(jsonMsg));
        window.parent.postMessage(JSON.stringify(jsonMsg), "*");
    }

    // listem for message from the parent page
    function listenMessage(message) {
        //we dont do this stuff, get out!
        if (typeof message.data == "object") {
            SPPUtility.log("Unsupported message!  Send strings instead of objects! : " + JSON.stringify(message.data));
            return;
        }

        var msg = {};

        // convert the stringified JSON back to JSON object

        //@Muthukumar Velayutham: MP-6014 Audio Player | Captions | Caption is not Displayed 
        msg.data = (message.data.length > 0) ? JSON.parse(message.data) : [];

        if (msg.data.method) {
            SPPUtility.log("Processing message in SPP  - " + message.data);
            if (window != window.top)
                activateAccessibility();

            switch (msg.data.method) {
                case "play":
                    if (media.paused == true) {
                        playButton.className = playButton.className.replace("pvp-play-state", "pvp-pause-state");
                        overlayicon();
                        media.play();
                        if (chapterMenu != null) {
                            SPPUtility.log(chapterMenu);
                            chapterMenu.style.display = "none";
                        }
                    }
                    break;
                case "pause":
                case "stop":
                    if (media.paused == false) {
                        playButton.className = playButton.className.replace("pvp-pause-state", "pvp-play-state");
                        overlayicon();
                        media.pause();
                    }
                    break;
                case "mute":
                    toggleMute(true);
                    break;
                case "unMute":
                    toggleMute();
                    break;
                case "setVolume":
                    var percent = msg.data.payload.percent;
                    var volVal = Math.round(parseFloat(percent / 100));

                    media.volume = volVal;
                    storeVolume(media.volume);
                    storedVolumeVal = media.volume;
                    volumeBar.value = percent;
                    volumeBar.setAttribute('title', percent + "%");
                    volumeBarStyleForWebkit();

                    if (percent > 0) {
                        muteButton.className = muteButton.className.replace("pvp-volume-off", "pvp-volume-on");
                        muteButton.setAttribute("title", langParams['volume-on']['title']);
                        media.muted = false;
                    }
                    break;
                case "seek":
                    var seekPoint = msg.data.payload.percent * (SPPUtility.totalDuration / 100);
                    media.currentTime = seekPoint;
                    break;
                case "speedChange":
                    if (media && msg.data.payload.speedValue
                    && (!isNaN(msg.data.payload.speedValue) &&
                    Number(msg.data.payload.speedValue) == msg.data.payload.speedValue
                    && !isNaN(msg.data.payload.speedValue, 10)))
                        speedChange = media.playbackRate = msg.data.payload.speedValue;
                    break;
                case "orientation":
                    //TODO
                    break;
                case "resized":
                    if (media.clientHeight > SPPUtility.smallPlayerChapterHeight && isClipVideo == "") {
                        loadChapters();
                        if(media.clientHeight > SPPUtility.smallPlayerHeight){
                            loadExternalQuiz();
                        }
                    }
                    break;
                default:
                    SPPUtility.log("Unknown Msg - " + message.data);
            }
        }
    }

    // bind the message listeners
    if (window.addEventListener) {
        window.addEventListener("message", listenMessage, false);
    } else {
        window.attachEvent("onmessage", listenMessage);
    }

    var retryLimit = 500;
    var retryCount = 0;

    function lateInit() {
        SPPUtility.log('In lateInit - Ready state:' + media.readyState + "--" + retryCount);
        if (media.readyState > 0) {
            if (SPPUtility.setSeekBack) {
                SPPUtility.setSeekBack = false;
                // commented out because chrome shows the image temporarily before starting playback
                // if (SPPUtility.currentSeekToTime > .1)
                //     media.currentTime = SPPUtility.currentSeekToTime;
                // if (!wasPaused)
                //     setTimeout(play(), 2000);
                // pause();
                if (SPPUtility.currentSeekToTime > .1)
                    var ua = navigator.userAgent.toLowerCase();
                
                if (ua.indexOf('safari') != -1) {
                    if (ua.indexOf('chrome') > -1) {
                        if(isClipVideo == "")  {
                            media.currentTime = SPPUtility.currentSeekToTime;
                        }
                    }else{
                        media.addEventListener('canplay', function(){
                            media.currentTime = SPPUtility.currentSeekToTime;
                        })    
                    }
                }else{
                    media.currentTime = SPPUtility.currentSeekToTime;
                }
                    
                if (!wasPaused)
                    play();
            } else {
                initPlayer();
            }

            showOverlay = true;
            waitingOverlay.style.display = "none";
            originalPosterUrl = media.getAttribute("poster");
        } else {
            if (++retryCount < retryLimit) {
                setTimeout(lateInit, 500);
                waitingOverlay.style.display = "block";
            } else {
                SPPUtility.log("Giving up!  Unable to initialize media at this time!");
            }
        }
    }
    try {
        if (window.self !== window.top) {
            playerWrapper.classList.remove("standalone");
            playerWrapper.classList.add("embedVideo");
            videoWrapper.classList.remove("standalone");
            videoWrapper.classList.add("embedVideo");
            setControlRack.style.display = "none";
        }
    } catch (e) {
        //alert(true);
    }
	
    SPPUtility.playerType = (videoWrapper.classList.contains('standalone')) ? 1 : 2;
    if (SPPUtility.playerType == 1) {
        videoWrapper.style.width = videoWrapper.clientHeight * videoAspectRatio;
        videoWrapper.style.height = videoWrapper.clientWidth * 1 / videoAspectRatio;
        SPPUtility.playerHeightBelowCntRack = videoWrapper.clientHeight + SPPUtility.controlRackHeight;
        if (SPPUtility.getPlayerCookie("control_rack_position") == 2) {
            videoWrapper.style.height = SPPUtility.playerHeightBelowCntRack + "px";
            video.style.height = 100 - ((SPPUtility.controlRackHeight / SPPUtility.playerHeightBelowCntRack) * 100) + "%";
            if (document.getElementById("transcriptText"))
                document.getElementById("transcriptText").style.height = "20%";
            SPPUtility.fixedControlRack = true;
			
			/*document.getElementsByClassName("speed-txt")[0].classList.remove("speed-txt-above");
			document.getElementsByClassName("speed-txt")[0].classList.add("speed-txt-below");*/
        }
		else if (SPPUtility.getPlayerCookie("control_rack_position") == 1)
		{
			/*document.getElementsByClassName("speed-txt")[0].classList.remove("speed-txt-below");
			document.getElementsByClassName("speed-txt")[0].classList.add("speed-txt-above");*/
		}
    }


    //force to be control rack under video
   if(window.location.href.indexOf(FRAMES) > -1 && SPPUtility.getPlayerCookie("control_rack_position") !== 1){
        videoWrapper.style.height = SPPUtility.playerHeightBelowCntRack + "px";
            video.style.height = 100 - ((SPPUtility.controlRackHeight / SPPUtility.playerHeightBelowCntRack) * 100) + "%";
            SPPUtility.fixedControlRack = true;
            document.getElementById("controls").value=2;
   }
		
    if (media.getAttribute('poster') == "") {
        var findPoster = false;
        var currVideoHieght = media.clientHeight;
        if (videoHeightList.length > 0) {
            for (var i = 0; i <= videoHeightList.length - 1; i++) {
                if (videoHeightList[i] >= currVideoHieght) {
                    media.setAttribute('poster', videoPosterList[i]);
                    findPoster = true;
                    break;
                }
            }
            if (!findPoster) {
                media.setAttribute('poster', videoPosterList[videoPosterList.length - 1]);
            }
        }
    }
    //check if audio is loaded already!
    lateInit();
    //public methods
    return {
        // public variables
        properties: {
            captionBtn: document.getElementById("captionBtn"),
            captionsMenu: document.getElementsByClassName("pvp-captions-menu")[0],
            renditionBox: renditionBox,
            speedRate: speedRate,
            currentSpeedRate: currentSpeedRate,
            media: media,
            captionTXT: document.getElementsByClassName("captionText")[0]
        },
        loadExternalQuiz: function(dv){
            loadExternalQuiz(dv);
        },
        // MP-8869 Audio-descriptor internal concept marker display in DV mode
        loadInternalLibraries: function(dv){
            loadInternalLibraries(dv);
        },
        // MP-8691 Added loadchapter method
        loadChapters: function(dv){
            loadChapters(dv);
        },
        play: function () {
            play();
        },
        pause: function () {
            pause();
        },
        sendMessage: function (msg) {
            sendMessage(msg);
        },
		controlRackPosition: function(param) {
			controlRackPosition(param);
		}
    }
})();