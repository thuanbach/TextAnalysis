// transcript  name space
var SPPTranscript = (function () {

    //SmartPearsonPlayer.properties.captionBtn
    var captionBtn = document.getElementById("captionBtn");
    if (captionBtn) {

        //Variable Declaration
        var media = SmartPearsonPlayer.properties.media;
        var captionsList = document.getElementsByClassName("captions-button");
        var transcriptDiv = document.getElementById("transcriptText");
       // var chkTranscript = document.getElementById("chkTranscript");
        var chkTranscriptWrapper = document.getElementsByClassName("transcriptChkWrapper")[0];
        var settingsButton = document.getElementById("settings");
        var txtTranscript = document.getElementById("transcriptText");
        var playerWrapper = document.getElementById("playerWrapper");
        var videoWrapper = document.getElementById("videoWrapper");
        var transcriptList=document.getElementById("transcriptList");
        var renditionsPopup = document.getElementById("renditions-popup");
        var captionTxt = document.getElementsByClassName("caption-txt");
        var captionLang = "eng";
        var prevElement = "", top = 0;
        var captionContent = new Object;
        var captionUrl = [], prevTransText, scrollToShow = 25; //let's find in nxt line
        var transcriptHeight="";
        var langParams=SPPUtility.langParams;

         transcriptHeight=document.getElementsByClassName("transcript")[0].style.height;
         //Support for multiple transcript
        for (i = 0; i < captionsList.length; i++) {
            var transcriptLang=captionsList[i].getAttribute("lang");

            var option = document.createElement("option");
            if(captionsList[i].getAttribute("value") == 'off')
                option.text=langParams['transcript'][captionsList[i].getAttribute("value")];
            else 
                 option.text=captionsList[i].getAttribute("value");

            option.setAttribute("lang",transcriptLang);
            option.id=(captionsList[i].getAttribute("value") !== "off")?"ts-"+transcriptLang:"ts-off";
            transcriptList.add(option);
            if (transcriptLang == "en") {
                captionUrl = captionsList[i].getAttribute("caption-url"); //gotcha
            };

            if (captionsList[i].getAttribute("value") !== "off" && transcriptLang !== "en") {
                var createDiv=document.createElement("div");
                createDiv.id="transcriptText";
                createDiv.classList.add(transcriptLang+"-container");
                createDiv.classList.add("transcript");
                createDiv.setAttribute("aria-label",langParams['transcript']['ariaLabel']);
                createDiv.setAttribute("lang",transcriptLang);
                playerWrapper.appendChild(createDiv);
                createDiv.style.height=transcriptHeight;
            }
        }

        //Toggle Multiple transcript on changig Select Box
        transcriptList.addEventListener("change",function(){
            for(var i=0;i < transcriptList.options.length;i++){
                if(i != transcriptList.selectedIndex && i != 0){
                    document.getElementsByClassName(transcriptList.options[i].getAttribute("lang")+"-container")[0].style.display="none";
                }
            }
            toggleTranscript(transcriptList.options[transcriptList.selectedIndex]);
            highlightTranscript();
            /* MP-7171 Added focus*/
            document.getElementById("settings").focus();
        });



        transcriptDiv.addEventListener("keyup", function (e) {
            if (e.keyCode == 9) {
                if (document.activeElement.style != "none") {
                    setTimeout(function () {

                        if (typeof previousElement != "undefined") {
                            previousElement.style.outline = "none";
                        }
                        if (document.activeElement == transcriptDiv) {
                            /*MP-7334 - Replace 2px solid yellow with 2px solid red */
                            document.activeElement.style.outline = "2px solid red";
                        } else {
                            document.activeElement.style.outline = "2px solid #2c2c2c";
                            
                        }

                        previousElement = document.activeElement;
                        previousElement.addEventListener("blur", function () {
                                this.style.outline = "none";
                        });
                    }, 50);
                }
            }
        },false);

        function toggleTranscript(ele) {
            SPPAccessibility.updateStatus(langParams['msg']['trans-enabled']);
            if(transcriptList.selectedIndex !== 0){
                transcriptDiv=document.getElementsByClassName(ele.getAttribute("lang")+"-container")[0];
                txtTranscript=document.getElementsByClassName(ele.getAttribute("lang")+"-container")[0];
           
                prevTransText = transcriptDiv.getElementsByClassName("caption-txt")[0];
                txtTranscript.style.display = "block";

                //MP-7322 - added alert message
                SPPAccessibility.updateStatus('Clicking on the following buttons in the transcript window will update the video');
                //if browser not supports for fullscreen
                if (!SPPUtility.fullScreenEnabled) {
                    document.body.style.overflow = "hidden";
                }

                if (SPPUtility.fullScreenEnabled) {
                    txtTranscript.style.width = videoWrapper.clientWidth-2;
                    SPPUtility.log(playerWrapper.clientHeight + "--------" + txtTranscript.clientHeight);
                    videoWrapper.classList.add("transcriptVideo");
                }
                //to avoid displaying transcript in browsers which not support full screen
                if (!SPPUtility.fullScreenEnabled && !SPPUtility.fullScreenForIE) {
                    txtTranscript.style.width = videoWrapper.clientWidth-2;
                    videoWrapper.classList.add("transcriptVideo");
                }
                function clickedClassHandler(name, callback) {

                    // apply click handler to all elements with matching className
                    var allElements = document.getElementsByClassName(name);

                    for (var x = 0, len = allElements.length; x < len; x++) {
                        if (allElements[x].classList.contains(name)) {
                            allElements[x].onclick = handleClick;
                            allElements[x].addEventListener("keyup",function(e){
                                if(e.keyCode == 13){
                                    navigateTranscript();
                                }

                            });
                        }
                    }

                    function navigateTranscript(obj){
                        var elmParent = document.activeElement.parentNode;
                        var parentChilds = document.activeElement.childNodes;
                        var index = 0;

                        for (var x = 0; x < parentChilds.length; x++) {
                            if (parentChilds[x] == document.activeElement) {
                                break;
                            }

                            if (parentChilds[x].classList.contains(name)) {
                                index++;
                            }
                        }
                        if (document.activeElement.classList.contains("caption-txt") && document.activeElement.className.split("caption-txt")[1])
                            media.currentTime = document.activeElement.className.split("caption-txt")[1].trim();
                        callback.call(document.activeElement, index);
                    }
                    

                    function handleClick() {

                        var elmParent = this.parentNode;
                        var parentChilds = elmParent.childNodes;
                        var index = 0;

                        for (var x = 0; x < parentChilds.length; x++) {
                            if (parentChilds[x] == this) {
                                break;
                            }

                            if (parentChilds[x].classList.contains(name)) {
                                index++;
                            }
                        }
                        if (this.classList.contains("caption-txt") && this.className.split("caption-txt")[1])
                            media.currentTime = this.className.split("caption-txt")[1].trim();
                        callback.call(this, index);
                    }

                }
                clickedClassHandler("caption-txt", function (index) {
                    // do something with the index
                    //scrollToShow = 0;
                    //for(i=0;i < index-1;i++) 
                    //scrollToShow+=transcriptDiv.getElementsByClassName("caption-txt")[i].clientHeight;
                });

            } else {
                txtTranscript.style.display = "none";
                videoWrapper.classList.remove("transcriptVideo");
                SPPAccessibility.updateStatus(langParams['msg']['trans-disabled']);
            }
            renditionsPopup.style.display = "none";
            settingsButton.setAttribute("title", langParams['settings-on']['title']);
            settingsButton.setAttribute("aria-label", langParams['settings-on']['ariaLabel']);
            highlightTranscript();
        }

        txtTranscript.style.display = "block";
        txtTranscript.style.display = "none";

        //debugger;
    /*    chkTranscript.addEventListener("keydown", function (e) {
            if (e.keyCode == 13) {
                chkTranscript.checked = (chkTranscript.checked == true) ? false : true;
                toggleTranscript();
            }
        });*/
        var prevTime;
        function highlightTranscript() {
            var selectClass = Math.round(media.currentTime);
            // check the element presence before manipulating on it.
            if (typeof transcriptDiv.getElementsByClassName("caption-txt")[0] != "undefined" && typeof prevTransText != "undefined") {
                // select the current caption stream.
                prevTransText.classList.add("selected");
                if (transcriptDiv.getElementsByClassName(selectClass).length > 0 && !transcriptDiv.getElementsByClassName(selectClass)[0].classList.contains("selected")) {
                    // Scroll the div to the present caption stream.
                    transcriptDiv.scrollTop = scrollToShow;
                    scrollToShow = 0;
                    var allElements = transcriptDiv.getElementsByClassName("caption-txt");
                    for (var x = 0, len = allElements.length; x < len; x++) {
                        scrollToShow += allElements[x].clientHeight;
                        if (allElements[x].classList.contains(selectClass)) {
                            break;
                        }
                    }
                    prevTime = media.currentTime;
                    // remove the previously selected transcript streams
                    prevTransText.classList.remove("selected");
                    prevTransText = transcriptDiv.getElementsByClassName("caption-txt " + selectClass)[0];

                    var removePrevSelected=transcriptDiv.getElementsByClassName("selected");
                    for(i=0;i<removePrevSelected.length;i++){
                        if(!removePrevSelected[i].classList.contains(selectClass)){
                            removePrevSelected[i].classList.remove("selected");
                        }
                    }


                }
            }

        }

        try {
            // update transcript highlight on the screen 	
            media.addEventListener("timeupdate", highlightTranscript);
            //Toggle Transcript
          
        } catch (e) {
            SPPUtility.log(e);
        }

        for (i = 0; i < captionsList.length; i++) {
        if(i > 0)
            var func=(function(i){
                var xmlhttp;
                if (window.XMLHttpRequest)
                    xmlhttp = new XMLHttpRequest();
                else
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

                params = "captionurl=" + captionsList[i].getAttribute("caption-url") + "&result=1";
                xmlhttp.open("POST", "/html5/classes/srtparser.php", true);
                //Send the proper header information along with the request
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
                xmlhttp.send(params);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        if (xmlhttp.responseText) {
                            var result = JSON.parse(xmlhttp.responseText);
                            transcriptDiv=document.getElementsByClassName(captionsList[i].getAttribute("lang")+"-container")[0];
                            captionLang=captionsList[i].getAttribute("lang");
                            captionContent[captionLang] = new Object;
                            for (var counter in result) {
                                if (result[counter]['text']) {
                                    //save captions in array for future purpose
                                    captionContent[captionLang][counter] = {};
                                    captionContent[captionLang][counter]['number'] = result[counter]['number'];
                                    captionContent[captionLang][counter]['startTime'] = SPPUtility.parseTime(result[counter]['startTime']);
                                    captionContent[captionLang][counter]['stopTime'] = SPPUtility.parseTime(result[counter]['stopTime']);
                                    captionContent[captionLang][counter]['text'] = result[counter]['text'];
                                    var transcriptContent = document.createElement("div");
                                    transcriptContent.className = "caption-txt " + Math.round(captionContent[captionLang][counter]['startTime']);
                                    transcriptContent.innerHTML = "<span class='time'>" + SPPUtility.convertVideoTime(captionContent[captionLang][counter]['startTime']) + "</span><span class='text'>&gt;&gt; " + captionContent[captionLang][counter]['text'] + "</span>";
                                    transcriptDiv.appendChild(transcriptContent);
                                    transcriptContent.setAttribute("aria-label", SPPUtility.convertVideoTime(captionContent[captionLang][counter]['startTime']) + ' ' + captionContent[captionLang][counter]['text']);
                                    transcriptContent.setAttribute("tabindex","17");
                                    //MP-7322 - added role
                                    transcriptContent.setAttribute("role","button");
                                }
                            }
                            toggleTranscript(transcriptDiv); //show Transcript
                        }
                    } else if (xmlhttp.status != 200)
                       SPPUtility.log("Bad response while captions being retrieved. State : " + xmlhttp.readyState + " and Status : " + xmlhttp.status);
                }
        })(i);
    }

        function ended() {
            top = 0;
        }
        // while video ends
        media.addEventListener('ended', ended);
    }


})();