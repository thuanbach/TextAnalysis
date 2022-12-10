//  closed caption namespace.
var SPPClosedCaption = (function () {

    var captionBtn = document.getElementById("captionBtn");
    var captionsMenu = document.getElementsByClassName("pvp-captions-menu")[0];
    var langParams=SPPUtility.langParams;

    if (captionsMenu) {

        /*MP-7338 - Removed aria-lable*/
        /*document.getElementById("captionsOptionsWrapper").innerHTML = "<label for='caption'>"+langParams['caption-type']['title']+"</label>	<select id='caption' class='captionType' aria-label='"+langParams['caption-type']['ariaLabel']+"' tabindex='12'><option value='1' aria-label='"+langParams['caption-over']['ariaLabel']+"'>"+langParams['caption-over']['title']+"</option><option value='2' aria-label='"+langParams['caption-below']['ariaLabel']+"'>"+langParams['caption-below']['title']+"</option></select><a href='javascript:void(0);' id='captions-options' class='captions-options' aria-label='"+langParams['caption-option']['ariaLabel']+"' tabindex='12'>"+langParams['caption-option']['title']+"</a>";*/
        /*MP-7661 - Modified option aria-label */
        document.getElementById("captionsOptionsWrapper").innerHTML = "<label for='caption'>"+langParams['caption-type']['title']+"</label>	<select id='caption' class='captionType' tabindex='12'><option value='1' aria-label='"+langParams['caption-over']['ariaLabel']+"'>"+langParams['caption-over']['title']+"</option><option value='2' aria-label='"+langParams['caption-below']['ariaLabel']+"'>"+langParams['caption-below']['title']+"</option></select><a href='javascript:void(0);' id='captions-options' class='captions-options' aria-label='"+langParams['caption-option']['title']+"' tabindex='12'>"+langParams['caption-option']['title']+"</a>";

        // caption type
        if (document.getElementsByClassName("captionType")[0])
            var captionType = document.getElementsByClassName("captionType")[0];
        //set Caption Type Selected
        if (SPPUtility.getPlayerCookie("caption_visible")) {
            SPPUtility.log(SPPUtility.getPlayerCookie("caption_visible"));
            if (SPPUtility.getPlayerCookie("caption_visible") == "above")
                captionType.value = 1;
            else {
                captionType.value = 2;
            }
            SPPUtility.log(captionType.value);
        }

        function switchCaptionType() {
            if (captionType.value == 2) {
                videoWrapper.classList.add("invideocaption");
                SPPAccessibility.updateStatus(langParams['msg']['caption-below']);
                SPPUtility.setPlayerCookie("caption_visible", "below");
                settingOn = true;
            } else {
                videoWrapper.classList.remove("invideocaption");
                SPPAccessibility.updateStatus(langParams['msg']['caption-below']);
                SPPUtility.setPlayerCookie("caption_visible", "above");
            }
            document.getElementById("renditions-popup").style.display = "none";
            var settingsButton = document.getElementById("settings");
            if (settingsButton) {
                settingsButton.setAttribute("title", langParams['settings-on']['title']);
                settingsButton.setAttribute("aria-label", langParams['settings-on']['ariaLabel']);
            }
            if (typeof SPPQuizInternal != "undefined" && typeof (SPPQuizInternal.videoResize) == "function")
                SPPQuizInternal.videoResize();
        }

        if (captionType) {
            captionType.addEventListener("change", function () {
                if (captionContent[captionLang]) {
                    /* MP-7171 Added focus*/
                    document.getElementById("settings").focus();
                    switchCaptionType();
                }

            });
        }

        var CaptionOptionjs = document.createElement("script");
        CaptionOptionjs.type = "text/javascript";
        CaptionOptionjs.src = "/html5/"+SPPVersion+"/js/desktop/caption-option.js";
        document.body.appendChild(CaptionOptionjs);

        var captionContent = new Object;
        var captionsMenu = SmartPearsonPlayer.properties.captionsMenu;
        var captionLang = "";
       var currentCaption="";
        if (captionBtn) {

            var media = SmartPearsonPlayer.properties.media;
            // display captions on the screen 	
            function onMediaPlaying() {
                var captionBG = document.getElementById("hdn-captionBG").value;
               
                if (typeof captionContent != "undefined" && captionContent && captionContent[captionLang]) {
                    for (var i = 0; i < Object.keys(captionContent[captionLang]).length; i++) {
                        if (media.currentTime > captionContent[captionLang][i].startTime && media.currentTime < captionContent[captionLang][i].stopTime) {
                            document.getElementsByClassName('captionText')[0].innerHTML = "<span><span id='captionInnerText' style='background:" + captionBG + "'>" + captionContent[captionLang][i].text + "</span></span>";
                            currentCaption=captionContent[captionLang][i];
                        }

                        //Clear caption Area after the stop time [Ref:MP-4566]
                        if(currentCaption != "" && currentCaption.stopTime < media.currentTime){
                            document.getElementsByClassName('captionText')[0].innerHTML='';
                        }

                    }
                }
            }
            media.addEventListener("timeupdate", onMediaPlaying);

            //marking 'Off' caption item checked by default
            var pvpCaptionsMenu = document.getElementsByClassName("pvp-captions-menu-list");
            //MP-6936 added aria-selected attribute 
            var childPvpCaptionsMenu = pvpCaptionsMenu[0].children;
            if (pvpCaptionsMenu) {
                pvpCaptionsMenu[0].style.backgroundImage = "url('/html5/images/check-circle.png')";
                pvpCaptionsMenu[0].style.backgroundRepeat = "no-repeat";
                pvpCaptionsMenu[0].style.backgroundSize = "15px 18px";
                //MP-6936 added aria-selected attribute - Start
                childPvpCaptionsMenu[0].setAttribute("data-state", "active");
                childPvpCaptionsMenu[0].setAttribute("aria-selected", "true");
               
                for (var i = 0; i < pvpCaptionsMenu.length; i++) {
                    var childPvp = pvpCaptionsMenu[i].children;
                    var vv = childPvp[0].getAttribute("data-state");
                    // if(vv == 'active'){
                    //   current_cap = childPvp[0].getAttribute("aria-label");
                    //   current_cap_id = childPvp[0].getAttribute("id");
                    // }
                }

                // childPvpCaptionsMenu[0].setAttribute("aria-label", "Enabled Captions Off");
                //MP-6936 added caption "Enabled" text - End
            }
            // add event listener for the caption languages
            var captionsItem = document.getElementsByClassName("captions-button");
            
            //MP-7204
            var locationHref = window.location.href;
            for (var i = 0; i < captionsItem.length; i++) {
                captionsItem[i].addEventListener("click", function (e) {
                    //Caption placement on selection according to the caption location query string
                    var videoWrapper = document.getElementById("videoWrapper");
                    var capValue = "";
                    var url = locationHref;
                    keysValues = url.split(/[\?&]+/);
                    for (i = 0; i < keysValues.length; i++) {
                        keyValue = keysValues[i].split("=");
                        if (keyValue[0] == "captionlocation") {
                            capValue = keyValue[1];
                        }
                    }
                    
                    var clipData = SPPUtility.getClipData();
                    var clipInfo = SPPUtility.getParameterByName('t', media.currentSrc);
                    if (typeof clipData != "undefined" && typeof clipData.BookModule != "undefined" && 
									typeof (clipData.BookModule.clipVideoResize) == "function" && clipInfo == '') {
                    	
                    	//document.getElementById("captionsOptionsWrapper").style.display = "block";
                    	document.getElementsByClassName("captionType")[0].value = "2";
                    	//document.getElementById("captionsOptionsWrapper").style.display = "none";
                    }
                    switchCaptionType();
                    if (SPPUtility.getPlayerCookie("caption_visible")) {
                        console.log(SPPUtility.getPlayerCookie("caption_visible"));
                        if (SPPUtility.getPlayerCookie("caption_visible") == "below")
                            videoWrapper.classList.add("invideocaption");
                        else
                            videoWrapper.classList.remove("invideocaption");
                    }
                    if (capValue == "onvideo") {
                        document.getElementsByClassName("captionType")[0].value = "1";
                    }

                    if (capValue == "belowvideo" || (SPPUtility.getPlayerCookie("caption_visible") && SPPUtility.getPlayerCookie("caption_visible") == "below")) {
                        document.getElementsByClassName("captionType")[0].value = "2";
                    }
                    var captionsMenu = document.getElementsByClassName("pvp-captions-menu")[0];
                    captionsMenu.style.display = (captionsMenu.style.display == 'block' ? 'none' : 'none');
                    var captionBtn = document.getElementById("captionBtn");
                    captionBtn.setAttribute('title', langParams['closed-caption-on']['title']);
                    captionBtn.setAttribute('aria-label', langParams['closed-caption-on']['ariaLabel']);
                    //MP-6894 - CC button issue fixed
                    if(captionBtn){
                        // MP-7965 - Removed aria-expanded
                        // captionBtn.setAttribute('aria-expanded', 'false');
                    }
                    if (this.getAttribute("value") == "off") {
                        document.getElementsByClassName('captionText')[0].style.display = "none";
                        videoWrapper.classList.remove("invideocaption");
                    }
                    else {
                        document.getElementsByClassName('captionText')[0].style.display = "table";
                    }
                    if (typeof SPPQuizInternal != "undefined" 
							&& typeof clipData.BookModule != "undefined" 
								&& typeof (SPPQuizInternal.videoResize) == "function")
                        SPPQuizInternal.videoResize();
                    //debugger;
                    
                    if (typeof clipData != "undefined" 
							&& typeof clipData.BookModule != "undefined" 
								&& typeof (clipData.BookModule.clipVideoResize) == "function")
                    	clipData.BookModule.clipVideoResize();

                    //checkmark for selected caption language
                    if (pvpCaptionsMenu) {
                        for (var i = 0; i < pvpCaptionsMenu.length; i++) {
                            pvpCaptionsMenu[i].style.backgroundImage = "url('')";
                            pvpCaptionsMenu[i].style.backgroundSize = "0px 0px";
                        }

                        this.parentElement.style.backgroundImage = "url('/html5/images/check-circle.png')";
                        this.parentElement.style.backgroundRepeat = "no-repeat";
                        this.parentElement.style.backgroundSize = "15px 18px";
                        //MP-6936 added aria-selected attribute - start
                        var current_value = this.getAttribute("aria-label");
                        var current_datastate = this.getAttribute("data-state");

                        if(current_datastate == "inactive"){
                            for (var i = 0; i < pvpCaptionsMenu.length; i++) {
                                var childPvp = pvpCaptionsMenu[i].children;
                                var vv = childPvp[0].getAttribute("data-state");
                                if(vv == 'active'){
                                    childPvp[0].setAttribute("data-state", "inactive");
                                    childPvp[0].setAttribute("aria-selected", "false");
                                    // childPvp[0].setAttribute("aria-label", current_cap);
                                }
                            }

                            // current_cap = this.getAttribute("aria-label");
                            // current_cap_id = this.getAttribute("id");
                            // this.setAttribute("aria-label", "Enabled " + current_value);
                            this.setAttribute("data-state", "active");
                            this.setAttribute("aria-selected", "true");
                        }
                        //MP-6936 added aria-selected attribute - End
                    }

                    // store selected caption to use in all the places
                    captionLang = this.getAttribute("value");
                    if (captionLang != "off") {
                        //MP-7168
                        captionBtn.focus();
                        SPPAccessibility.updateStatus(captionLang + langParams['msg']['caption-change']);
                        SmartPearsonPlayer.sendMessage("CaptionChanged");
                    } else {
                        //MP-7168
                        captionBtn.focus();
                        SPPAccessibility.updateStatus(langParams['msg']['caption-disabled']);
                        SmartPearsonPlayer.sendMessage("CaptionOff")
                    }
                    // cache all the captions locally in an array once its retrieved from the server first time.
                    if (!captionContent[captionLang]) {
                        if (this.getAttribute("caption-url")) {
                            var xmlhttp;
                            if (window.XMLHttpRequest)
                                xmlhttp = new XMLHttpRequest();
                            else
                                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                            params = "captionurl=" + this.getAttribute("caption-url");
                            params += (this.getAttribute("caption-url").indexOf("?") > -1) ? "&result=1" : "&result=1";
                            xmlhttp.open("POST", "/html5/classes/srtparser.php", true);
                            //Send the proper header information along with the request
                            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
                            xmlhttp.send(params);

                            xmlhttp.onreadystatechange = function () {

                                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                                    if (xmlhttp.responseText) {
                                        var result = JSON.parse(xmlhttp.responseText);
                                        captionContent[captionLang] = new Object;
                                        for (var counter in result) {
                                            captionContent[captionLang][counter] = {};
                                            captionContent[captionLang][counter]['number'] = result[counter]['number'];
                                            captionContent[captionLang][counter]['startTime'] = SPPUtility.parseTime(result[counter]['startTime']);
                                            captionContent[captionLang][counter]['stopTime'] = SPPUtility.parseTime(result[counter]['stopTime']);
                                            captionContent[captionLang][counter]['text'] = result[counter]['text'];
                                        }
                                    }
                                } else
                                    console.log("Bad response while captions being retrieved. State : " + xmlhttp.readyState + " and Status : " + xmlhttp.status);
                            }
                        } else
                            console.log("Please provide caption URL...");
                    }
                });
            }
        }
    }
})();
