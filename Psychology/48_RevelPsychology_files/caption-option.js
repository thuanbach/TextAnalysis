var SPPCaptionOption = (function () {
    if (SmartPearsonPlayer.properties.captionTXT) {
        // global variables
        var fontFamily = "Monospaced Serif";
        var fontFamilyFonts = "Courier New, Courier, monospace";
        var fontColor = "rgb(255,255,255)";
        var fontSize = "";
        var CapBackground = "rgb(0,0,0)";
        var BgOpacity = "1";
        var FontOpacity = "1";
        var langParams=SPPUtility.langParams;
        var captionOptAccess = document.getElementById("caption-option-accessibility");
        
        
        var menuOptions = document.getElementsByClassName("pvp-captions-options-menuitem");
        var i;
        function displayfontFamily(element) {
            var lists = document.getElementsByClassName("pvp-captions-options-items");
            for (i = 0; i < lists.length; i++) {
                lists[i].style.display = 'none';
				lists[i].setAttribute("aria-hidden", true);				
            }
			for (i = 0; i < menuOptions.length; i++) {
                /* MP-7474 - removed ariaselected and added ariachecked */
                // menuOptions[i].setAttribute("aria-selected", false);
                menuOptions[i].setAttribute("aria-checked", false);
				menuOptions[i].setAttribute("aria-hidden", true);				
            }
			
            eleId = element.getAttribute("id");
            document.getElementById(eleId + "-list").style.display = 'block';
			document.getElementById(eleId + "-list").setAttribute("aria-hidden", false);
            SPPAccessibility.updateStatus(document.getElementById(eleId).innerHTML + langParams['msg']['option-select']);
            var SelectedMenuOptions = document.getElementsByClassName("pvp-captions-options-menuitem-selected");
            for (i = 0; i < SelectedMenuOptions.length; i++) {
                /* MP-7474 - removed ariaselected and added ariachecked */
                // SelectedMenuOptions[i].setAttribute("aria-selected", false);
				SelectedMenuOptions[i].setAttribute("aria-checked", false);
				SelectedMenuOptions[i].setAttribute("aria-hidden", true);				
                SelectedMenuOptions[i].className = 'pvp-captions-options-menuitem';				
            }
            document.getElementById(eleId).className = 'pvp-captions-options-menuitem-selected';
            /* MP-7474 - removed ariaselected and added ariachecked */
            // document.getElementById(eleId).setAttribute("aria-selected", true);
            document.getElementById(eleId).setAttribute("aria-checked", true);
			document.getElementById(eleId).setAttribute("aria-hidden", false);
			
        }
		
		function generateAccessibilityText(element){
			
			var mainEleId = element.getAttribute("id");
			var childEleId = document.getElementById(mainEleId + "-list");
			
			var captionText = document.getElementsByClassName("captionText")[0];			
            if (captionText) {
                var childEle = childEleId.getElementsByClassName("pvp-captions-options-items-list");
                
				for (i = 0; i < childEle.length; i++) {						 
                    if(childEle[i].getElementsByTagName('div')[1].getAttribute("class") == "pvp-captions-options-items-list-check" ){
                        /*MP-7474 - added prefix data attribute*/													
						if (childEleId.id == "pvp-captions-options-font-family-list") captionOptAccess.innerHTML = "You have selected the font family " + childEle[i].getElementsByTagName('div')[2].getAttribute("data-fontfamily");
						if (childEleId.id == "pvp-captions-options-font-color-list") captionOptAccess.innerHTML = "You have selected the font text color " + childEle[i].getElementsByTagName('div')[2].getAttribute("data-colortxt");
						if (childEleId.id == "pvp-captions-options-font-size-list") captionOptAccess.innerHTML = "You have selected the font text size " + childEle[i].getElementsByTagName('div')[2].getAttribute("data-fontsize");
						if (childEleId.id == "pvp-captions-options-font-background-list") captionOptAccess.innerHTML = "You have selected the background color " + childEle[i].getElementsByTagName('div')[2].getAttribute("data-colortxt");
						if (childEleId.id == "pvp-captions-options-font-opacity-list") captionOptAccess.innerHTML = "You have selected the font opacity " + childEle[i].getElementsByTagName('div')[2].innerHTML;
						if (childEleId.id == "pvp-captions-options-font-background-opacity-list") captionOptAccess.innerHTML = "You have selected the background opacity " + childEle[i].getElementsByTagName('div')[2].innerHTML;
					}
				}                
			}
			
		}


        for (i = 0; i < menuOptions.length; i++) {

            menuOptions[i].addEventListener("click", function (e) {
                displayfontFamily(this);
				generateAccessibilityText(this);
				
            });
            menuOptions[i].addEventListener("keyup", function (e) {
                //MP-6355 keyCode 9 added for Tab
                if (e.keyCode == 13 || e.keyCode == 9) { 
					displayfontFamily(this); 
					generateAccessibilityText(this);
				}
            });
        }
		
        document.getElementById("pvp-captions-options-font-family").className = 'pvp-captions-options-menuitem-selected';
        document.getElementById("pvp-captions-options-font-family-list").style.display = 'block';
		generateAccessibilityText(document.getElementById("pvp-captions-options-font-family"));

        function applyChanges(selMenuOption) {

            for (i = 0; i < menuOptionItems.length; i++) {
                try {
                    selMenuOption.parentNode.getElementsByTagName('li')[i].getElementsByTagName('div')[1].setAttribute('class', 'pvp-captions-options-items-list-uncheck');
                    //MP-7013 option selected stats
                    selMenuOption.parentNode.getElementsByTagName('li')[i].setAttribute('aria-selected', 'false');
                    // selMenuOption.parentNode.getElementsByTagName('li')[i].getElementsByTagName('div')[2].setAttribute('aria-selected', 'false');
                }
                catch (e) { }
            }
            
            //MP-7013 option selected stats
            selMenuOption.setAttribute('aria-selected', 'true');
            // selMenuOption.getElementsByTagName('div')[2].setAttribute('aria-selected', 'true');
            var current_selection= selMenuOption.getElementsByTagName('div')[2].getAttribute("aria-label");
            SPPAccessibility.updateStatus(current_selection + ' tab selected');
            
            selMenuOption.getElementsByTagName('div')[1].setAttribute('class', 'pvp-captions-options-items-list-check');

            var captionText = document.getElementsByClassName("captionText")[0];			
						
            if (captionText) {
                /*MP-7474 - added prefix data attribute*/	
                if (selMenuOption.parentNode.id == "pvp-captions-options-font-family-list") {
                    fontFamily = '' + selMenuOption.getElementsByTagName('div')[2].getAttribute("data-fontfamily") + '';
                    captionText.style.fontFamily = fontFamily;
                    fontFamily = '' + selMenuOption.getElementsByTagName('div')[2].innerHTML;//getAttribute("fontfamily")+'';
                    SPPUtility.setPlayerCookie("fontFamily", fontFamily);
                    fontFamilyFonts = '' + selMenuOption.getElementsByTagName('div')[2].getAttribute("data-fontfamily") + '';
                    SPPUtility.setPlayerCookie("fontFamilyFonts", fontFamilyFonts);
					captionOptAccess.innerHTML = "You have selected the font family " + fontFamilyFonts;

                }
                if (selMenuOption.parentNode.id == "pvp-captions-options-font-color-list") {
                    fontColor = '' + selMenuOption.getElementsByTagName('div')[2].getAttribute("data-color") + '';
                    captionText.style.color = getRGBACss(fontColor, FontOpacity);
                    SPPUtility.setPlayerCookie("fontColor", encodeURIComponent(getRGBACss(fontColor, FontOpacity)));
                    SPPUtility.setPlayerCookie("fontTxtColor", selMenuOption.getElementsByTagName('div')[2].getAttribute("data-colortxt"));
					captionOptAccess.innerHTML = "You have selected the font text color " + selMenuOption.getElementsByTagName('div')[2].getAttribute("data-colortxt");
                }
                if (selMenuOption.parentNode.id == "pvp-captions-options-font-size-list") {
                    fontSize = '' + selMenuOption.getElementsByTagName('div')[2].getAttribute("data-fontSize") + '';
                    captionText.style.fontSize = fontSize;
                    SPPUtility.setPlayerCookie("fontSize", fontSize);
					captionOptAccess.innerHTML = "You have selected the font text size " + fontSize;
                }
                if (selMenuOption.parentNode.id == "pvp-captions-options-font-background-list") {
                    CapBackground = '' + selMenuOption.getElementsByTagName('div')[2].getAttribute("data-color") + '';
                    if (document.getElementById("captionInnerText")) {
                        document.getElementById("captionInnerText").style.background = getRGBACss(CapBackground, BgOpacity);
                    }
                    document.getElementById("hdn-captionBG").value = getRGBACss(CapBackground, BgOpacity);
                    SPPUtility.setPlayerCookie("CapBackground", encodeURIComponent(getRGBACss(CapBackground, BgOpacity)));
                    SPPUtility.setPlayerCookie("bkgTxtColor", selMenuOption.getElementsByTagName('div')[2].getAttribute("data-colortxt"));
					captionOptAccess.innerHTML = "You have selected the background color " + selMenuOption.getElementsByTagName('div')[2].getAttribute("data-colortxt");
                }
                if (selMenuOption.parentNode.id == "pvp-captions-options-font-opacity-list") {

                    if (SPPUtility.getPlayerCookie("fontColor")) {
                        fontColor = decodeURIComponent(SPPUtility.getPlayerCookie("fontColor"))
                    }
                    FontOpacity = '' + selMenuOption.getElementsByTagName('div')[2].getAttribute("data-opacity") + '';
                    captionText.style.color = getRGBACss(fontColor, FontOpacity);
                    SPPUtility.setPlayerCookie("fontColor", encodeURIComponent(getRGBACss(fontColor, FontOpacity)));
                    SPPUtility.setPlayerCookie("fontOpacity", FontOpacity);
					captionOptAccess.innerHTML = "You have selected the font opacity " + selMenuOption.getElementsByTagName('div')[2].innerHTML;
                }
                if (selMenuOption.parentNode.id == "pvp-captions-options-font-background-opacity-list") {

                    if (SPPUtility.getPlayerCookie("CapBackground")) {
                        CapBackground = decodeURIComponent(SPPUtility.getPlayerCookie("CapBackground"))
                    }
                    BgOpacity = '' + selMenuOption.getElementsByTagName('div')[2].getAttribute("data-opacity") + '';
                    if (document.getElementById("captionInnerText")) {
                        document.getElementById("captionInnerText").style.background = getRGBACss(CapBackground, BgOpacity);
                    }
                    document.getElementById("hdn-captionBG").value = getRGBACss(CapBackground, BgOpacity);
                    SPPUtility.setPlayerCookie("CapBackground", encodeURIComponent(getRGBACss(CapBackground, BgOpacity)));
                    SPPUtility.setPlayerCookie("bkgOpacity", BgOpacity);
					captionOptAccess.innerHTML = "You have selected the background opacity " + selMenuOption.getElementsByTagName('div')[2].innerHTML;
                }
            }
        }
		var menuOptionItems = document.getElementsByClassName("pvp-captions-options-items-list");
		
		for (i = 0; i < menuOptionItems.length; i++) {
			menuOptionItems[i].addEventListener("click", function () {
				applyChanges(this);
			});
			menuOptionItems[i].addEventListener("keyup", function (e) {
				if (e.keyCode == 13) {
					applyChanges(this);
				}
			});
		}
		
		

        function getRGBACss(CapBackground, BgOpacity) {
            var RGB = CapBackground.split(",");
            var red = RGB[0].replace("rgb(", "");
            //if ie 
            red = red.replace("rgba(", "");
            var green = RGB[1];
            var blue = RGB[2].replace(")", "");
            var alpha = BgOpacity == undefined ? "1" : BgOpacity;
            return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
        }

        function showCaptionOptionWindow() {
            document.getElementById("pvp-captions-options-main").style.display = 'table';
            document.getElementsByClassName("pvp-captions-menu")[0].style.display = 'none';
            document.getElementById("renditions-popup").style.display = 'none';
            var settingsButton = document.getElementById("settings");
            if (settingsButton) {
                settingsButton.setAttribute("title", langParams['settings-on']['title']);
                settingsButton.setAttribute("aria-label", langParams['settings-on']['ariaLabel']);
            }
			
			var SelectedMenuOptions = document.getElementsByClassName("pvp-captions-options-menuitem-selected");
            for (i = 0; i < SelectedMenuOptions.length; i++) {
                /* MP-7474 - removed ariaselected and added ariachecked */
                // SelectedMenuOptions[i].setAttribute("aria-selected", true);
                SelectedMenuOptions[i].setAttribute("aria-checked", true);
				SelectedMenuOptions[i].setAttribute("aria-hidden", false);				                
				SelectedMenuOptions[i].focus();
				document.getElementById(SelectedMenuOptions[i].id+'-list').setAttribute("aria-hidden", false);
            }
        }

        document.getElementById("captions-options").addEventListener("keypress", function (e) {
            if (e.keyCode == 13) {
                showCaptionOptionWindow();				
                document.getElementById("pvp-captions-options-font-family").focus();
            }
        });

        var CaptionOptions = document.getElementById("captions-options");
        CaptionOptions.addEventListener("click", showCaptionOptionWindow);

        function closeCaptionOptionWindow() {
            document.getElementById("pvp-captions-options-main").style.display = 'none';
        }

        var CaptionOptionDone = document.getElementsByClassName("pvp-captions-options-footer-button")[0];
        CaptionOptionDone.addEventListener("click", closeCaptionOptionWindow);
        CaptionOptionDone.addEventListener("keyup", function (e) {
            if (e.keyCode == 13) {
                closeCaptionOptionWindow();
            }
        });


    }
})();