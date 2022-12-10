function Playerer(){

}
var SPPPlaylist;
var SPPUtility = (function () {
    
    var currentSeekToTime = 0;
    var setSeekBack = false;
    var smallPlayerHeight = 300;

    var isMobile, videoWidth, videoHeight, buttonWrapper, fixedControlRack = false, playerType = 1, legacyAudioWidth = 400, legacyAudioHeight = 75; // player type 1. standalone 2. embed
    var SPPCookie = "SPPCookie", fullScreen, fullScreenForIE = false, chapterSlideUp = false;
    var fullScreenEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled ? true : false;;
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)){
        isMobile = 1;
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
    var isDebug = getParameterByName('debug', location.pathname + location.search);
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
        try{
            var d = new Date();
            var Obj = {};
            d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));
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
            return true;
        }catch(err){
            return false;
        }
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

    var convertAudioTime = function (time) {
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

    return {
        chapterSlideUp: chapterSlideUp,
        fullScreenForIE: fullScreenForIE,
        fullScreenEnabled: fullScreenEnabled,
        playerType: playerType,
        fullScreen: fullScreen,
        currentSeekToTime: currentSeekToTime,
        videoWidth: videoWidth,
        videoHeight: videoHeight,
        buttonWrapper: buttonWrapper,
        fixedControlRack: fixedControlRack,
        parseTime: parseTime,
        convertAudioTime: convertAudioTime,
        setPlayerCookie: setPlayerCookie,
        getPlayerCookie: getPlayerCookie,
        getParameterByName: getParameterByName,
        between: between,
        smallPlayerHeight: smallPlayerHeight,
        legacyAudioWidth: legacyAudioWidth,
        legacyAudioHeight: legacyAudioHeight,
        log: log,
        isMobile : isMobile
    }
})();


var SmartPearsonPlayer = (function () {
    var media = document.getElementsByTagName('audio')[0];
    SPPUtility.log("Media element is " + media);
    media.addEventListener('seeking', eventSeeking);
    media.addEventListener('seeked', eventSeeked);
    media.addEventListener('timeupdate', eventTime);
    media.addEventListener('loadedmetadata', loadedmetadata);
    media.addEventListener('loadeddata', loadeddata);
    media.addEventListener('loadstart', loadstart);
    media.addEventListener('progress', progress);
    media.addEventListener('suspend', suspend);
    media.addEventListener('error', error);
    media.addEventListener('emptied', emptied);
    media.addEventListener('stalled', stalled);
   // media.addEventListener('play', play);
    media.addEventListener('pause', pause);
    media.addEventListener('waiting', waiting);
    media.addEventListener('playing', playing);
    media.addEventListener('canplay', canplay);
    media.addEventListener('canplaythrough', canplaythrough);
    media.addEventListener('ended', ended);
    media.addEventListener("volumechange", volumechange);

    // Buttons
    var playButton = document.getElementById("playBtn");
    var muteButton = document.getElementById("muteBtn");
    var progress = document.getElementById("progress");
    var scrubber = document.getElementById("progressBarHandle");
    var volumeScrubber = document.getElementById("redBarHandle");
    var duration = document.getElementById("duration");
    var rightDiv = document.getElementsByClassName("right")[0];
    var middleDiv = document.getElementsByClassName("middle")[0];
    var captionWrapper = document.getElementById("captionWrapper");
    // Sliders
    var seekBar = document.getElementById("progressBar");
    var speedBar = document.getElementById("speedBar");
    var volumeRange = document.getElementById("volumeBar");
    var wrapper = document.getElementsByClassName('wrapper')[0];

    var topRow = document.getElementsByClassName('top-row')[0];
    var bottomRow = document.getElementsByClassName('bottom-row')[0];
    var rightMost = document.getElementsByClassName('rightmost')[0];
    var middle = document.getElementsByClassName('middle')[0];
    var right = document.getElementsByClassName('right')[0];
    var left = document.getElementsByClassName('left')[0];
    var duration = document.getElementsByClassName('duration')[0];
    var speedTxt = document.getElementsByClassName('speed-txt')[0];
    var volumeContainer = document.getElementById("volumeContainer");
    var speedBar = document.getElementById("speedBar");
    var playerType = document.getElementById("playerType").value;
    var isDevice = document.getElementById("isDevice").value;
    var captionBtn = document.getElementById("captionBtn");
    var captionsMenu = document.getElementById("pvp-captions-menu");
    //flags
    var durationFlag = false;
    var scrubberOffX;
    var volumeScrubberOffX;
    var isTimelineDrag = false;
    var isVolumeDrag = false;
    var seekingTime = 5;
    var volumeSeekTime = 0.1;
    var storedVolumeVal = 0.5;
    var setLimit = progressBar.clientWidth - scrubber.clientWidth;
    var jsonMsg = "";
    var increaseSpeed = true;

    //Accessbility
    var progressText = document.getElementById("progressText");
    var wrapper = document.getElementById("wrapper");
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);

    //MP-6657
    var ctime = 0;

	wrapper.addEventListener("keyup", function (e) {
        if (e.keyCode == 9) {
            if (document.activeElement.style != "none") {
                setTimeout(function () {
                    // MP-7725 - replaced yellow color with red
                    // document.activeElement.style.outline = "2px solid yellow";
                    //MP-7675 - replaced B30000 color with red(FF0000)
                    // MP-7874 - Replaced with new yellow
                    // document.activeElement.style.outline = "2px solid red";
                    // MP-7874 Added conditon
                    if(document.activeElement.id != 'volumeBar'){
                        document.activeElement.style.outline = "2px solid #FFFF00";
                    }
                        if (typeof previousElement != "undefined") {
                            previousElement.style.outline = "none";
                        }
                        
                        previousElement = document.activeElement;
                        previousElement.addEventListener("blur", function () {
                            this.style.outline = "none";
                        });
                    }, 50);
                
                //MP-7414
                if(e.shiftKey && e.keyCode == 9) { 
                        if(document.activeElement.id=='muteBtn' && previousElement.id=='muteBtn') {
                            document.getElementById("progressBarHandle").focus();
                        }
                }
            }
        }
    }, false);



	function cssForIEonStandaloneResize() {
	  if (window.innerWidth >= 450)
	  {
			wrapper.style.width = "450px";
			wrapper.style.left = "50%";
			wrapper.style.marginLeft = "-250px";
			wrapper.style.minWidth = "250px";
			right.style.maxWidth = "30%";
			progressBar.style.width = "80%";
			volumeContainer.style.width = "60px";
			cssForIE();
	  }
	   if (window.innerWidth >= 0 && window.innerWidth <= 450) {
			wrapper.style.width = "100%";
			wrapper.style.left = "0px";
			wrapper.style.marginLeft = "0px";
			wrapper.style.minWidth = "250px";
			volumeContainer.style.width = "35px";
			rightMost.style.marginRight = "3%";
			right.style.width = "20%";
		}
		if (window.innerWidth >= 0 && window.innerWidth <= 370) {
			middle.style.width = "50%";
			volumeContainer.style.width = "25px";
		}
		if (window.innerWidth >= 0 && window.innerWidth <= 300) {
			right.style.maxWidth = "30%";
			right.style.width = "27%";
			progressBar.style.width = "60%";
			middle.style.width = "35%";
			volumeContainer.style.width = "30px";
		}
  
		if (window.innerWidth >= 0 && window.innerWidth <= 250) {
			topRow.style.marginTop = "0px";
			right.style.maxWidth = "30%";
			volumeContainer.style.width = "30px";
		}
	}
    //Fix for IE @media
    function cssForIE() {
	console.log("Reset");
        wrapper.classList.add("audio-wrapper-ie");
        wrapper.style.height = window.innerHeight + "px";
        wrapper.style.backgroundColor = "#424242";
        topRow.style.position = "relative";
        topRow.style.top = "50%";
        topRow.style.marginTop = "-15px";
        if (captionBtn) {
            captionBtn.style.height = "25px";
            captionBtn.style.marginTop = "-1px";
        }

        if (speedBar) {
            speedBar.style.marginTop = "10px";
        }

        if (window.innerWidth < 200) {
            volumeContainer.style.display = "none";
            rightMost.style.display = "none";
            middle.style.marginLeft = "2%";
            middle.style.width = "60%";
            right.style.marginLeft = "10px";
            right.style.marginTop = "2px";
            right.style.width = "15%";
			seekBar.style.width = "65%";
        }
         if (window.innerWidth >= 200 && window.innerWidth <= 249) {
            rightMost.style.display = "none";
            bottomRow.style.display = "none";
            seekBar.style.width = "70%";
            middle.style.marginLeft = "0%";
            right.style.width = "15%";
            volumeContainer.style.display = "none";
            middle.style.width = "65%";
        }

		if (window.innerWidth >= 250 && window.innerWidth <= 299) {
            rightMost.style.display = "none";
            bottomRow.style.display = "none";
            seekBar.style.width = "65%";
            middle.style.marginLeft = "0%";
            middle.style.width = "47%";
            right.style.width = "37%";
            volumeContainer.style.width = "50%";
			if(speedTxt){
			speedTxt.style.width = "95%";
			speedTxt.style.background = "url('/html5/images/audio-speed-background.gif') no-repeat";
			speedTxt.style.backgroundSize = "100% 25px;";
			}
        }


		if (window.innerWidth >= 300 && window.innerWidth <= 349  ) {
            topRow.style.top = "0%";
            topRow.style.marginTop = "0px";
            right.style.width = "30%";
            rightMost.style.width = "10%";
            seekBar.style.width = "70%";
            middle.style.marginLeft = "0%";
            wrapper.style.backgroundColor = "rgba(255, 255, 255,0)";
			if(window.innerHeight < 65){
				rightMost.style.display = "none";
				middle.style.width = "52%";
			}
			if (window.innerHeight >= 65)
			{
				if(captionWrapper.innerHTML != ""){
					rightMost.style.display = "inline-block";
					middle.style.width = "45%";
				}else{
					rightMost.style.display = "none";
					middle.style.width = "55%";
				}
			}
        }
		
		if (window.innerWidth >= 350 && window.innerWidth <= 399) {
            topRow.style.top = "0%";
            topRow.style.marginTop = "0px";
            right.style.width = "27%";
            rightMost.style.width = "10%";
            seekBar.style.width = "75%";
            middle.style.marginLeft = "0%";
            wrapper.style.backgroundColor = "rgba(255, 255, 255,0)";
			if(window.innerHeight < 65){
				rightMost.style.display = "none";
				middle.style.width = "60%";
			}
			if (window.innerHeight >= 65)
			{
				
				if(captionWrapper.innerHTML != ""){
					rightMost.style.display = "inline-block";
					middle.style.width = "48%";
				}else{
					middle.style.width = "55%";	
				}
			}
        }
		
        if (window.innerWidth >= 400 && window.innerWidth <= 449) {
            topRow.style.top = "0%";
            topRow.style.marginTop = "0px";
            right.style.width = "25%";
            rightMost.style.width = "10%";
            seekBar.style.width = "75%";
            middle.style.marginLeft = "0%";
            wrapper.style.backgroundColor = "rgba(255, 255, 255,0)";
			if(window.innerHeight < 65){
				rightMost.style.display = "none";
				middle.style.width = "62%";
				seekBar.style.width = "82%";
			}
			if (window.innerHeight >= 65)
			{
				if(captionWrapper.innerHTML != ""){
					rightMost.style.display = "inline-block";
					middle.style.width = "52%";
				}else{
					seekBar.style.width = "80%";
					middle.style.width = "60%";
				}
			}
        }
        
		if (window.innerWidth >= 450 ) {
            topRow.style.top = "0%";
            topRow.style.marginTop = "0px";
            rightMost.style.display = "inline-block";
            right.style.width = "21%";			
            rightMost.style.width = "10%";
            seekBar.style.width = "75%";
            middle.style.width = "57%";
            middle.style.marginLeft = "0%";
            wrapper.style.backgroundColor = "rgba(255, 255, 255,0)";
			if(window.innerHeight < 65){
				rightMost.style.display = "none";
				middle.style.width = "67%";
				seekBar.style.width = "85%";
			}
			if (window.innerHeight >= 65)
			{
				if(captionWrapper.innerHTML != ""){
					rightMost.style.display = "inline-block";
					middle.style.width = "56%";
                                        rightMost.style.width = "15%";
				}else{
					seekBar.style.width = "85%";
					middle.style.width = "65%";
                                        rightMost.style.width = "10%";
				}
			}
        }
        
		if (playerType == "standalone") {
            if (captionWrapper.innerHTML != "") {
                right.style.width = "23%";
                middle.style.width = "50%";
		seekBar.style.width = "80%";
            }
            topRow.style.top = "0%";
            topRow.style.marginTop = "0px";
            wrapper.style.backgroundColor = "rgba(255, 255, 255,0)";
        }
    }

    if (msie > 0 || isIE11) {
        cssForIE();
		if (playerType == "standalone") {
			cssForIEonStandaloneResize();
		window.addEventListener("resize", cssForIEonStandaloneResize);}
    } else {
        if (playerType != "standalone" && ((captionWrapper.innerHTML == "" &&  window.location.href.indexOf("playlist") == -1) && window.innerWidth >= 400 )) {
                showPlayerWithoutCaption();
        }
    }

    function showPlayerWithoutCaption(){
        wrapper.style.height = window.innerHeight + "px";
        wrapper.style.backgroundColor = "#424242";
        topRow.style.position = "relative";
        topRow.style.top = "50%";
        topRow.style.marginTop = "-15px";
        volumeContainer.style.display = "inline-block";
        rightMost.style.display = "none";
        middle.style.marginLeft = "2%";
        /* middle.style.width = "80%"; */
        right.style.marginLeft = "10px";
        right.style.marginTop = "2px";
        right.style.width = "25%";
        seekBar.style.maxWidth = "80%";
        /* if (isDevice != "mobileCompat") {
            middle.setAttribute('style', 'width:60% !important');
            } */
    }

    //for standalone without captions
    if (playerType == "standalone") {
        if (captionWrapper.innerHTML == "" || captionWrapper.innerHTML.length < 1) {
            left.style.marginLeft = "2%";
            middle.setAttribute('style', 'width:55% !important');
            rightMost.style.display = "none";
        }
    }

	 if (((captionWrapper.innerHTML == "" || captionWrapper.innerHTML.length < 1) || (window.innerHeight < 65)) && window.innerWidth >= 300 ) {
		if(msie > 0 || isIE11){ } else{
            rightMost.style.display = "none";
            var width = middle.offsetWidth;
            var parentWidth = middle.parentNode.offsetWidth;
            var percent = ((100*width/parentWidth)+(10));
            if(window.innerWidth >= 450){
                percent = ( parseFloat(percent)  - parseFloat(13) );
            }
            middle.style.width = percent+"%";
        }
	 }
    //for mobile compatibilty
    if (isDevice == "mobileCompat" && window.innerWidth >= 250) {
        if (!speedBar && window.innerHeight >= 65) {
            middle.classList.add("PartialExtended");
            right.classList.add("PartialExtended");
        }
        if (!speedBar && window.innerHeight < 65) {
            middle.classList.add("fullExtended");
            right.classList.add("fullExtended");
        }
		if (playerType == "standalone") {
			if (captionWrapper.innerHTML == "" || captionWrapper.innerHTML.length < 1) {
				left.style.marginLeft = "2%";
				middle.setAttribute('style', 'width:70% !important');
				rightmost.setAttribute('style', 'display:none !important');
				if (!speedBar){
					middle.setAttribute('style', 'width:80% !important');
				}
			}
		}
    }

    wrapper.style.display = "block";
    
    /*
        Audio playlist starts here
    */

    function loadPlaylistLibraries() {
        //MP-8042 -Added SPP version in js and css url
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "/html5/"+SPPVersion+"/js/desktop/audio-playlist.js";
        document.body.appendChild(js);
    }

    function loadPlaylist() {
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlPlaylist = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlPlaylist = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlPlaylist.onreadystatechange = function () {
            if (xmlPlaylist.readyState == 4 && xmlPlaylist.status == 200) {
                var createPlaylistDiv = document.createElement("div");
                createPlaylistDiv.id = "playlist";
                createPlaylistDiv.innerHTML = xmlPlaylist.responseText;
                document.getElementById("playlistText").appendChild(createPlaylistDiv);
                var playlistAudios = document.getElementsByClassName("playlist-liks");
                if (playlistAudios.length > 0 ) {
                    var rightmostElem = document.getElementById("rightmost");
                    rightmostElem.style.display = "inline-block";
                    rightmostElem.classList.remove('rightmost');
                    rightmostElem.classList.add('rightmost-playlist');
                    document.getElementById('captionWrapper').style.cssFloat = 'left'; 
                    document.getElementById("playlistWrapper").style.display = "inline-block";
                    loadPlaylistLibraries();
                } else if(captionWrapper.innerHTML != "") {
                    showPlayerWithoutCaption();
                }
            }
        }
        if(!assetTransfered){
            var guid = document.getElementById('assetId').value;
            xmlPlaylist.open("POST", "/html5/classes/fetch-playlist.php?fetchPlaylist=1&GUID=" + guid +"&playlistFor=audio", true);
            xmlPlaylist.send();
        }else{
            xmlPlaylist.open("POST", "/html5/classes/fetch-playlist.php?fetchPlaylist=1&playlist=" + playlistId + "&playlistFor=audio&assetReferenceID=" + assetId, true);
            xmlPlaylist.send();
        }
    }

    if (window.location.href.indexOf("playlist") > -1 && window.innerHeight > 64 && window.innerWidth > 449) {
        loadPlaylist();
    }

    /*
        Audio playlist ends here
    */

    function loadCaptionLibraries() {
        //MP-8042 -Added SPP version in js and css url
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = "/html5/"+SPPVersion+"/js/desktop/audio-caption.js";
        document.body.appendChild(js);
    }
    if (document.getElementsByClassName("pvp-captions-menu")[0]) {
        var captionsMenu = document.getElementsByClassName("pvp-captions-menu")[0];
        if (playerType == "embedAudio") {
            var CcHeight = parseInt(window.innerHeight) - 30;
            //document.getElementsByClassName('bottom-row')[0].style.height = CcHeight + "px";
        } else {
            captionsMenu.classList.add("standalone");
        }
        var captionBtn = document.getElementById("captionBtn");
        captionBtn.addEventListener('click', function (e) {
            captionsMenu.style.display = (captionsMenu.style.display == 'block' ? 'none' : 'block');
            if (captionsMenu.style.display == 'block') {
                captionBtn.setAttribute('title', 'Hide Closed Captioning');
                //captionBtn.setAttribute('aria-label', 'Hide Closed Captioning');
            } else {
                captionBtn.setAttribute('title', 'Show Closed Captioning');
                //captionBtn.setAttribute('aria-label', 'Show Closed Captioning');
            }
        });
        document.addEventListener('keypress', function (e) {
            if (e.keyCode == 99) {
                captionsMenu.style.display = (captionsMenu.style.display == 'block' ? 'none' : 'block');
                SmartPearsonPlayer.properties.renditionBox.style.display = "none";
            }
        });

        loadCaptionLibraries();
    }

    

    //hack for IE range issue
    if (speedBar) {
        if (navigator.userAgent.toLowerCase().indexOf("trident") > -1)
            speedBar.classList.add("ie");
        else if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1)
            speedBar.classList.add("-moz");
        else
            speedBar.classList.add("-webkit");
    }


    if (volumeRange) {
        if (navigator.userAgent.toLowerCase().indexOf("trident") > -1)
            volumeRange.classList.add("ie");
        else if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1)
            volumeRange.classList.add("-moz");
        else
            volumeRange.classList.add("-webkit");

    }


    //hack for Non-IE browsers
    function volumeSetBkg() {
        var value = volumeRange.value;
        var remain = 100 - value;
        if (volumeRange.classList.contains("-webkit")) {
            // MP-7874- Modified color code
            // volumeRange.style.background = "linear-gradient(to right,#c7c7c7,#c7c7c7,#c7c7c7,#c7c7c7 " + value + "%,black,black,black,black " + remain + "%)";
            volumeRange.style.background = "linear-gradient(to right,#909090,#909090,#909090,#909090 " + value + "%,black,black,black,black " + remain + "%)";
        }
        if (volumeRange.classList.contains("-moz")) {
            if (value <= remain) {
                // MP-7874 - Modified color code
                // volumeRange.style.background = "-moz-linear-gradient(left,#c7c7c7,#c7c7c7,#c7c7c7 " + value + "%,black,black,black " + remain + "%)";
                volumeRange.style.background = "-moz-linear-gradient(left,#909090,#909090,#909090 " + value + "%,black,black,black " + remain + "%)";
            } else {
                // MP-7874 - Modified color code
                // volumeRange.style.background = "-moz-linear-gradient(right,black,black,black " + remain + "%,#c7c7c7,#c7c7c7,#c7c7c7 " + value + "%)";
                volumeRange.style.background = "-moz-linear-gradient(right,black,black,black " + remain + "%,#909090,#909090,#909090 " + value + "%)";
            }
        }
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

    //Check if audio player does not contain Speed Control
    if (muteButton.classList.contains("toggle")) {
        storedVolumeVal = getStoredVolume();
    } else {
        var result = document.cookie.match(new RegExp("SPPAudio" + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        if (result != null) {
            storedVolumeVal = result;
        } else {
            storedVolumeVal = 1;
        }
    }

    if (speedBar) {
        speedBar.value = media.playbackRate;
        speedBar.setAttribute("title", media.playbackRate);
        /* document.getElementById("wrapper").classList.add("speed"); */
    }

    var initialized = false;
    function initPlayer() {
        if (initialized) {
            return;
        }
        initialized = true;
        SPPUtility.log("Player initialized for AssetID - " + assetId);
       
        //Update Values
        appendLog("Video Duration:" + media.duration);
        window.setInterval(function (t) {
            if (media.readyState > 0) {
                if (durationFlag == false) {
                    if (media.duration === Number.POSITIVE_INFINITY || media.duration === Number.NEGATIVE_INFINITY || isNaN(media.duration)) {
                        media.duration = 0;
                    } else {
                        duration.innerHTML = convertVideoTime(media.duration);
                    }
                    durationFlag = true;
                    clearInterval(t);

                }
                
                /* MP-6657 start */
                if(typeof isIOS !== 'undefined'){
                    if(isIOS==1){
                        if(media.paused == false && media.currentTime>0){
                            if(ctime<media.currentTime && ctime != media.currentTime){
                                ctime = media.currentTime;
                            }
                            else{
                                media.pause();
                                playButton.setAttribute('title', 'Play Audio');
                                playButton.className = playButton.className.replace("pauseState", "playState");
                            }
                        }            
                    }
                }
                /* MP-6657 end */
            }
        }, 500);

        media.volume = storedVolumeVal;
        if (volumeRange) {
            volumeRange.value = storedVolumeVal * 100;
            volumeRange.setAttribute('aria-valuenow', parseFloat(storedVolumeVal * 100).toFixed(0));
            volumeRange.setAttribute('aria-valuetext', parseFloat(storedVolumeVal * 100).toFixed(0) + "%");
            volumeRange.setAttribute("title", parseFloat(storedVolumeVal * 100).toFixed(0) + "%");
            if (media.volume == 0) {
                muteButton.className = muteButton.className.replace("volumeOn", "volumeOff");
                muteButton.setAttribute("title", "Volume Off");
            }

            volumeRange.addEventListener("input", function (e) {
                media.volume = volumeRange.value / 100;
                storeVolume(media.volume);
                if (media.volume == 0) {
                    muteButton.className = muteButton.className.replace("volumeOn", "volumeOff");
                    muteButton.setAttribute("title", "Volume Off");
                    media.muted = true;
                } else {
                    media.muted = false;
                    if (media.volume == 0) {
                        media.volume = 0.5;
                    }

                    muteButton.className = muteButton.className.replace("volumeOff", "volumeOn");
                    muteButton.setAttribute("title", "Volume On");
                }
                volumeRange.setAttribute("title", parseFloat(media.volume * 100).toFixed(0) + "%");
                volumeRange.setAttribute('aria-valuenow', parseFloat(media.volume * 100).toFixed(0));
                volumeRange.setAttribute('aria-valuetext', parseFloat(media.volume * 100).toFixed(0) + "%");
                muteButton.setAttribute('aria-valuenow', parseFloat(media.volume * 100).toFixed(0));
                muteButton.setAttribute('aria-valuetext', parseFloat(media.volume * 100).toFixed(0) + "%");

            });
            if (volumeRange.classList.contains("ie") == false) {
                volumeRange.addEventListener("input", volumeSetBkg);
                volumeSetBkg();
            }
        }
        muteButton.setAttribute('aria-valuenow', parseFloat(storedVolumeVal * 100).toFixed(0));
        muteButton.setAttribute('aria-valuetext', parseFloat(storedVolumeVal * 100).toFixed(0) + "%");


        function togglePlay() {
            if (media.paused == true) {
                // Play the video
                media.play();
                appendLog("Play");
                //playButton.setAttribute('aria-label', 'Pause Audio');
                playButton.setAttribute('title', 'Pause Audio');
                // Update the button text to 'Pause'
                playButton.className = playButton.className.replace("playState", "pauseState");
				if(SPPPlaylist)	SPPPlaylist.closePlaylist();
            } else {
                // Pause the video
                media.pause();
                appendLog("Pause");
                //playButton.setAttribute('aria-label', 'Play Audio');
                playButton.setAttribute('title', 'Play Audio');

                // Update the button text to 'Play'
                playButton.className = playButton.className.replace("pauseState", "playState");
            }

        }
		// auto play if its required to play and dont play for mobile. As mobile wont support the autoplay feature.
		if(SPPUtility.isMobile != 1 && SPPUtility.getParameterByName('autoplay', (location.pathname + location.search).toLowerCase()) == "true")
			togglePlay();
		
        // Event listener for the play/pause button
        playButton.addEventListener("click", function (event) {
            //MP-7180 hided the condition
            // var x = event.x || event.clientX;
            // var y = event.y || event.clientY;
            // if (x && y) {
            //     togglePlay();
            // }
            togglePlay();
        });

        playButton.addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                togglePlay();
            }
        });

        document.addEventListener("keydown", function (e) {
            switch (e.keyCode) {
                case 80:
                    togglePlay();
                    break;
                case 32:
					if(document.activeElement.id=="playBtn") togglePlay();
                    break;
                case 35: //End Key for Seek for Timeline
                    var selectedElement = document.activeElement;
                    if(selectedElement.id && selectedElement.id == 'volumeBar'){
                        return false;
                    }
                    media.pause();
                    SPPUtility.log('Seeking to End');
                    media.currentTime = media.duration;
                    progress.style.width = '100%';
                    scrubber.style.left = progress.clientWidth;
                    break;
                case 36:
                    var selectedElement = document.activeElement;
                    if(selectedElement.id && selectedElement.id == 'volumeBar'){
                        return false;
                    }
                    media.pause();
                    media.currentTime = 0;
                    SPPUtility.log('Seeking to Home');
                    progress.style.width = '0%';
                    scrubber.style.left = '0px';
                    playButton.className = playButton.className.replace("playState", "pauseState");
                    media.play();
                    break;
                case 27:
                    if (media.paused == false) {
                        togglePlay();
                    }
                    break;
            }
        });


        // Update the seek bar as the video plays
        media.addEventListener("timeupdate", function () {
            //MP-5959 start
            if (SPPUtility.isMobile == 1) {
                if (media.paused == true) {
                    handleVisibilityChange();
                }
            }
            //MP-5959 end
            // Update the slider value
            progressText.innerHTML = "Playback " + parseInt(percentage) + "% complete";
            duration.innerHTML = convertVideoTime(media.currentTime);
            var percentage = media.currentTime * (100 / media.duration);
            setSeek(percentage);
            if (parseInt(scrubber.style.left) <= setLimit) {
                scrubber.setAttribute('aria-valuenow', parseInt(percentage));
                scrubber.setAttribute('aria-valuetext', parseInt(percentage) + "%");
                if (media.duration == media.currentTime) {
                    playButton.className = playButton.className.replace("pauseState", "playState");
                    media.pause();
                }
            }
        });

        function convertVideoTime(time) {
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

        // Pause the video when the seek handle is being dragged
        seekBar.addEventListener("click", function (e) {
            if (isTimelineDrag == false) {
                if (!e)
                    e = window.event;
                var seekPosWidth = e.offsetX == undefined ? e.layerX : e.offsetX;
                var seekPercentage = seekPosWidth / progressBar.clientWidth * 100;
                setSeek(seekPercentage);
                var seekTime = seekPercentage / 100 * media.duration;
                appendLog('Timeline Seek---' + seekTime);
                media.currentTime = seekPercentage / 100 * media.duration;
                duration.innerHTML = convertVideoTime(media.currentTime);
            }
        });

        scrubber.addEventListener('keydown', function (e) {
            SPPUtility.log(setLimit + "---" + scrubber.style.left);
            if(media.duration < 6){
                seekingTime = 1;
            } 
            if (e.keyCode == 37) {
                appendLog('Seeking Audio Back 10 secs--' + media.currentTime);
                media.currentTime -= seekingTime;
            } else if (e.keyCode == 39) {
                var seekTime = media.currentTime + seekingTime;
                appendLog('Seeking Audio Fwd 10 secs');
                if (seekTime > media.duration) {
                    seekTime = media.duration;
                    playButton.className = playButton.className.replace("pauseState", "playState");
                }
                media.currentTime += seekingTime;
            }
            var seekPer = media.currentTime / media.duration * 100;
            SPPUtility.log(progressBar.clientWidth * seekPer / 100)
            progress.style.width = seekPer + "%";

            if (parseInt(scrubber.style.left) <= setLimit) {
                setTimeout(function () {
                    scrubber.style.left = progress.clientWidth;
                }, 300);
            }
        });

        //Event Listeners for TimeLine Seek
        scrubber.addEventListener('mousedown', function (e) {
            if (!e)
                e = window.event;
            isTimelineDrag = true;
            appendLog('Audio Seeking Started---------');
            window.addEventListener('mousemove', scrubberMove, true);
            scrubberOffX = e.clientX - parseInt(scrubber.offsetLeft);
        });

        function scrubberMove(e) {
            if (!e)
                e = window.event;
            if (isTimelineDrag == true) {
                var startInit = 0;
                var endPoint = progressBar.clientWidth - scrubber.clientWidth;
                offX = e.clientX - parseInt(scrubber.offsetLeft);
                scrubber.style.position = 'absolute';
                var seekTimelinePosWidth = e.clientX - scrubberOffX;
                var seekPercentage = seekTimelinePosWidth / progressBar.clientWidth * 100;
                setSeek(seekPercentage);
            }
        }

        window.addEventListener('mouseup', function (e) {
            if (isTimelineDrag == true) {
                window.removeEventListener('mousemove', scrubberMove, true);
                var seekTimelinePosWidth = e.clientX - scrubberOffX;
                var seekPercentage = seekTimelinePosWidth / progressBar.clientWidth * 100;
                //   if(seekPercentage>1)
                //     seekPercentage=1;
                if (seekPercentage <= 100 && seekPercentage >= 0) {
                    setSeek(seekPercentage);
                    media.currentTime = seekPercentage / 100 * media.duration;
                    duration.innerHTML = convertVideoTime(media.currentTime);
                    setTimeout(function () {
                        isTimelineDrag = false
                    }, 2000);
                }
                appendLog('Audio Seeking Ended---------');
            }
        });



        function toggleMute() {
            if (media.muted == false) {
                // Mute the audio
                media.muted = true;
                //storeVolume(0);
                if (volumeRange) {
                    volumeRange.value = 0;
                    volumeSetBkg();
                }
                appendLog("Muted");

                // Update the button text
                muteButton.className = muteButton.className.replace("volumeOn", "volumeOff");
                muteButton.setAttribute("title", "Volume Off");
                storeVolume(0);
                volumeRange.setAttribute("title", parseFloat(getStoredVolume() * 100).toFixed(0) + "%");
                // Unmute the video
            } else {
                media.muted = false;
                if (media.volume == 0) {
                    media.volume = 0.5;
                }
                storeVolume(media.volume);
                // Update the button text
                muteButton.className = muteButton.className.replace("volumeOff", "volumeOn");
                muteButton.setAttribute("title", "Volume On");
                appendLog("Unmute, Current Volume" + media.volume);
                if (volumeRange) {
                    volumeRange.value = media.volume * 100;
                    volumeSetBkg();
                }
                volumeRange.setAttribute("title", parseFloat(getStoredVolume() * 100).toFixed(0) + "%");
            }

        }


        function reduceVolume() {
            var mediaVolume = media.volume;
            if (mediaVolume > 0) {
                if (mediaVolume - 0.25 >= 0) {
                    mediaVolume -= 0.25;
                    media.muted = false;
                    muteButton.className = muteButton.className.replace("volumeOff", "volumeOn");
                } else {
                    muteButton.className = "muteBtn volumeOn noCtrlSpaceBar off boxable step-by-step";
                    mediaVolume = 0;
                }
            } else if (mediaVolume == 0) {
                mediaVolume = 1;
                media.muted = false;
            }

            if (mediaVolume == 0) {
                muteButton.className = muteButton.className.replace("volumeOn", "volumeOff");
                muteButton.setAttribute("title", "Volume Off");
                media.muted = true;
            }
            if (mediaVolume == 1) {
                muteButton.className = muteButton.className.replace("volumeOff", "volumeOn");
                muteButton.setAttribute("title", "Volume On");
            }
            muteButton.setAttribute("title", "Volume: " + mediaVolume * 100 + "%")
            media.volume = mediaVolume;
            setClassMuteBtn();
            var d = new Date();
            var expires = d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));
            document.cookie = "SPPAudio=" + JSON.stringify(mediaVolume) + ";" + expires + ";domain.=" + window.location.host.toString();
        }


        function setClassMuteBtn() {
            switch (media.volume) {
                case 0.25:
                    muteButton.className = "muteBtn noCtrlSpaceBar off boxable step-by-step quarter";
                    break;
                case 0.5:
                    muteButton.className = "muteBtn noCtrlSpaceBar off boxable step-by-step half";
                    break;
                case 0.75:
                    muteButton.className = "muteBtn noCtrlSpaceBar off boxable step-by-step three-fourth";
                    break;
                case 0:
                    muteButton.className = "muteBtn volumeMuted noCtrlSpaceBar off boxable step-by-step";
                    break;
                case 1:
                    muteButton.className = "muteBtn volumeFull noCtrlSpaceBar off boxable step-by-step";
                    break;

            }
        }

        // Event listener for the mute button
        if (muteButton.classList.contains("step-by-step")) {
            muteButton.addEventListener("click", reduceVolume);
            muteButton.setAttribute("title", "Volume: " + media.volume * 100 + "%");
            setClassMuteBtn();
        } else {
            muteButton.addEventListener("click", toggleMute);
        }

        //MP-5612 start
        if (SPPUtility.isMobile == 1 ) {
            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            }

            function handleVisibilityChange() {
                
                if (document[hidden] == false){
                   
                    if (media.paused == true) {
                        // Pause the video
                        media.pause();
                        appendLog("Pause");
                        //playButton.setAttribute('aria-label', 'Play Audio');
                        playButton.setAttribute('title', 'Play Audio');

                        // Update the button text to 'Play'
                        playButton.className = playButton.className.replace("pauseState", "playState");

                    } else {
                        // Play the video
                        media.play();
                        appendLog("Play");
                        //playButton.setAttribute('aria-label', 'Pause Audio');
                        playButton.setAttribute('title', 'Pause Audio');
                        // Update the button text to 'Pause'
                        playButton.className = playButton.className.replace("playState", "pauseState");
                        if (SPPPlaylist) SPPPlaylist.closePlaylist();
                    }
                }
            }

            if (typeof document.addEventListener === "undefined" || hidden === undefined) {
                console.log("This browser not support.");
            } else {
                // Handle page visibility change   
                document.addEventListener(visibilityChange, handleVisibilityChange, false);
            }
        }
        //MP-5612 end
    }

    //Generate UUID
    function generateUUID() {
        var d = new Date().getTime();
        var guuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        appendLog("UUID Generated:" + guuid);
        return guuid;
    }


    //Seeking for Timeline
    function setSeek(seekPercentage) {
        var endPoint = progressBar.clientWidth - scrubber.clientWidth;
        var seekTimeLineScrubber = seekBar.clientWidth * seekPercentage / 100;
        if (seekPercentage >= 0 && seekPercentage <= 100) {
            if (seekTimeLineScrubber <= endPoint) {
                scrubber.style.left = seekTimeLineScrubber + "px";
            } else {
                scrubber.style.left = endPoint;
            }

            progress.style.width = seekPercentage + "%";
        }
    }
    var isScriptEmbed = SPPUtility.getParameterByName('scriptEmbed', location.pathname + location.search);
	var playerWidth = SPPUtility.getParameterByName('width', location.pathname + location.search);
    var playerHeight = SPPUtility.getParameterByName('height', location.pathname + location.search);
    if (isScriptEmbed == "true") {
		playerWidth = (playerWidth > SPPUtility.legacyAudioWidth) ? SPPUtility.legacyAudioWidth : playerWidth;
		playerHeight = (playerHeight > SPPUtility.legacyAudioHeight) ? SPPUtility.legacyAudioHeight : playerHeight;
		
        var params = JSON.stringify({
            "type": "view",
            "method": "set",
            "payload": {
                "width": SPPUtility.legacyAudioWidth,
                "overrideExapnd": true,
                "height": SPPUtility.legacyAudioHeight,
                "supporFullscreen": 1
            }
        });
        window.parent.postMessage(params, '*');



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
        appendLog("Send Message:" + JSON.stringify(jsonMsg));
        window.parent.postMessage(JSON.stringify(jsonMsg), "*");
    }

    function appendLog(text) {
        SPPUtility.log(text);
    }

    function getSeeking() {
        appendLog("Seeking value: " + media.seeking);
    }

    function getTime() {
        appendLog("currentTime value: " + media.currentTime);
    }

    function doSeek(time) {
        media.currentTime = time;
    }

    function eventSeeking() {
        sendMessage("mediaSeek");
        appendLog("Seeking event fired (seeking=" + media.seeking + ", currentTime=" + media.currentTime + ")");
    }

    function eventSeeked() {
        sendMessage("mediaProgress");
        appendLog("Seeked event fired (seeking=" + media.seeking + ", currentTime=" + media.currentTime + ")");
    }

    function eventTime() {
        //  document.getElementById("wrapper").style="none";
        //appendLog("Timeupdate fired (currentTime=" + media.currentTime + ")");
    }

    function timeUpdate(state) {
        update = state;
    }

    function loadedmetadata() {
        lateInit();
        var params = {
            "type": "message",
            "method": "publish",
            "payload": {
                "topic": "sppevent",
                "message": {
                    "type": "spp_loaded",
                    "action": "spp_loaded",
                    "asset_id": {
                        "order": "1",
                        "value": ""
                    }
                }
            }
        };
        params.payload.message.asset_id.value = assetId;
        window.parent.postMessage(JSON.stringify(params), "*");
        appendLog("Metadata Loaded..." + params);
    }

    function loadeddata() {
        sendMessage("mediaReady");
        appendLog("Data for playback loaded");
    }

    function loadstart() {
        appendLog("Looking for Media data");
    }

    function progress() {
        appendLog("Fetching metadata...");
    }

    function suspend() {
        appendLog("Player suspended");
    }

    function error() {
        appendLog("Player error");
    }

    function emptied() {
        appendLog("Emptied!");
    }

    function stalled() {
        appendLog("stalled!!!");
    }

    function play() {
        if (media.currentTime > 1) {
            sendMessage("mediaResume");
        } else {
            sendMessage("mediaPlay");
        }
        appendLog("Play starting...");
    }

    function pause() {
        sendMessage("mediaPause");
        appendLog("Player paused");
    }

    function volumechange() {
        appendLog(media.volume);
        if (media.muted == true) {
            sendMessage("mediaMute");
            appendLog("Volume Muted");
        } else {
            sendMessage("mediaVolumeChange");
            appendLog("Volume Change");
        }
    }

    function waiting() {
        appendLog("Player waiting");
    }

    function playing() {
        appendLog("Player playing");
    }

    function canplay() {
        appendLog("Can play with disruptions");
        return true;
    }

    function canplaythrough() {
        var params = {
            "type": "message",
            "method": "publish",
            "payload": {
                "topic": "sppevent",
                "message": {
                    "type": "spp_readyForPlayback",
                    "action": "spp_readyForPlayback",
                    "asset_id": {
                        "order": "1",
                        "value": ""
                    }
                }
            }
        };
        params.payload.message.asset_id.value = assetId;
        window.parent.postMessage(JSON.stringify(params), "*");
        appendLog("Can play to End - " + JSON.stringify(params));
    }

    function ended() {
        // Update the button text to 'Play'
        //playButton.setAttribute('aria-label', 'Play Audio');
        playButton.setAttribute('title', 'Play Audio');
        playButton.className = playButton.className.replace("pauseState", "playState");
        sendMessage("mediaEnd");
        appendLog("playback ended");
        media.pause();
        scrubber.style.left = 0;
        progress.style.width = "0%";

        if(document.getElementById("captionInnerText"))
        document.getElementById("captionInnerText").innerText = "";
    }

    //Speed Event
    if (speedBar) {
        speedBar.addEventListener("change", function () {
            media.playbackRate = speedBar.value;
            speedBar.setAttribute("title", media.playbackRate);
        });
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
        msg.data = JSON.parse(message.data);
        if (msg.data.method) {
            SPPUtility.log("Processing message in SPP  - " + message.data);
            switch (msg.data.method) {
                case "play":
                    playButton.className = playButton.className.replace("playState", "pauseState");
                    media.play();
                    break;
                case "pause":
                case "stop":
                    playButton.className = playButton.className.replace("pauseState", "playState");
                    media.pause();
                    break;
                case "mute":
                    muteButton.className = muteButton.className.replace("volumeOn", "volumeOff");
                    muteButton.setAttribute("title", "Volume Off");
                    if (volumeRange) {
                        volumeRange.value = 0;
                        volumeSetBkg();
                    }
                    media.muted = true;
                    break;
                case "unMute":
                    SPPUtility.log("Unmute, Current Volume" + media.volume);
                    muteButton.className = muteButton.className.replace("volumeOff", "volumeOn");
                    media.muted = false;
                    //revert back to minimum volume
                    if (media.volume == 0) {
                        media.volume = 0.5;
                        storeVolume(media.volume);
                    }
                    muteButton.setAttribute("title", "Volume On");
                    if (volumeRange) {
                        volumeRange.value = parseFloat(getStoredVolume() * 100);
                        volumeSetBkg();
                    }
                    break;
                case "setVolume":
                    var percent = msg.data.payload.percent;
                    var volVal = parseFloat(percent / 100);
                    media.volume = volVal;
                    storeVolume(media.volume);
                    if (volumeRange) {
                        volumeRange.value = percent;
                        volumeSetBkg();
                    }
                    if (media.muted) {
                        muteButton.className = muteButton.className.replace("volumeOff", "volumeOn");
                        media.muted = false;
                        muteButton.setAttribute("title", "Volume On");
                    }
                    break;
                case "seek":
                    var seekPoint = msg.data.payload.percent * (media.duration / 100);
                    media.currentTime = seekPoint;
                    break;
                case "resized":
					cssForIE();
                    break;
                case "orientation":
                    //TODO
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
	var isIOS = 0;
    var isIOS11 = false;
    var iOSversion = '0.0.0';  
    function checkIOS11( ) {
      var ua = navigator.userAgent;
      var uaindex;
    
      // determine OS
      if ( ua.match(/iPad/i) || ua.match(/iPhone/i) ) {
        isIOS = 1;
        uaindex = ua.indexOf( 'OS ' );
      }
     
      // determine version
      if ( isIOS === 1  &&  uaindex > -1 ) {
        iOSversion = ua.substr( uaindex + 3, 3 ).replace( '_', '.' );
      }
 
      if (iOSversion >= 11.0) isIOS11 = true;
    }
    var retryLimit = 40;
    var retryCount = 0;
	var iOS11_retyLimit = 10;
    
    function lateInit() {
		checkIOS11();
        if (media.readyState > 0) {
            initPlayer();
        } else {
            if (retryCount >= iOS11_retyLimit && isIOS11) {
                initPlayer();
            }
            else if (++retryCount < retryLimit) {
                setTimeout(lateInit, 500);
            } else {
                SPPUtility.log("Giving up!  Unable to initialize media at this time!");
            }
        }
        try {
            if (window.self !== window.top) {
                wrapper.classList.remove("standalone");
                wrapper.classList.add("embedVideo");
				bottomRow.classList.remove("standalone");
                bottomRow.classList.add("embedVideo");
				if (playerType == "standalone") {
					var CcHeight = parseInt(window.innerHeight) - 30;
					document.getElementsByClassName('bottom-row')[0].style.height = CcHeight + "px";
				} 
                captionsMenu.classList.remove("standalone");
                //captionsMenu.classList.add("embedVideo");
            }
        } catch (e) {
            //alert(true);
        }
    }

    //check if audio is loaded already!
    lateInit();

    //public methods
    return {
    }
})();
