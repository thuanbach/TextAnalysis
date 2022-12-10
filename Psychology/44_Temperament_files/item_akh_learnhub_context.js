/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_4455b435562b42e386231957c95dbfa9(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_4455b435562b42e386231957c95dbfa9.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_AKH_LearnHub_context.js';
  ctx['DisplayTemplateData']['TemplateType']='Item';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['ManagedPropertyMapping']={'ContentId':['contentIDOWSNMBR'], 'Title':['Title'], 'EnglishTitle':['akhenglishtitle'], 'SearchTitle':['akhsearchtitle'], 'Language':['akhlanguage'], 'HealthSpecialty':['akhhealthspecialty'], 'AgesStages':['akhagesstages'], 'BodyParts':['akhbodyparts'], 'BodySystem':['akhbodysystem'], 'HealthCategory':['akhhealthcategory'], 'TargetAudience':['akhtargetaudience'], 'Symptoms':['akhsymptoms'], 'PromotionalImage':['promotionalimageOWSIMGE'], 'ReviewDate':['reviewdateOWSDATE'], 'ProjectLead':['projectleadOWSUSER'], 'SME':['smeOWSTEXT'], 'Editor':['akheditorOWSUSER'], 'Illustrator':['illustratorOWSUSER'], 'Comments':['akhcommentsOWSMTXT'], 'ReadingLevel1':['readinglevel1OWSNMBR'], 'ReadingLevel2':['readinglevel2OWSNMBR'], 'WordCount':['wordcountOWSNMBR'], 'Sponsor':['sponsorOWSTEXT'], 'ContentTypeName':['ContentTypeName'], 'InternalCategory':['akhinternalcategory'], 'Overview':['overviewOWSHTML'], 'Introduction':['introductionOWSHTML'], 'IntroAddInfo':['IntroAdditionalInfoOWSHTML'], 'Keypoints':['keypointsOWSHTML'], 'PageContent':['PublishingPageContentOWSHTML'], 'SignsAndSymptoms':['signsandsymptomsOWSHTML'], 'CausesRiskFactorsPrevalence':['causesriskfactorsprevalenceOWSHTML'], 'SpreadPhase':['SpreadphasecourseofdiseaseOWSHTML'], 'Diagnosis':['diagnosisOWSHTML'], 'Treatment':['treatmentOWSHTML'], 'Complications':['complicationsOWSHTML'], 'HelpChild':['HelpingyourchildcareathomecopingOWSHTML'], 'Prevention':['PreventionOWSHTML'], 'WhenToSeekMedicalAttention':['whentoseekmedicalattentionOWSHTML'], 'FollowUp':['Follow-upcareclinicappointmentslong-termoutcomesOWSHTML'], 'WhatIsTheMedication':[' \u0027whatisthemedicationOWSHTML'], 'BeforeGivingMedication':['beforegivingmedicationOWSHTML'], 'HowToGiveMedication':['howtogivemedicationOWSHTML'], 'MissedDose':['misseddoseOWSHTML'], 'HowLongDoesItTakeToWork':['howlongdoesittaketoworkOWSHTML'], 'SideEffects':['sideeffectsOWSHTML'], 'SafetyMeasures':['safetymeasuresOWSHTML'], 'OtherImportantInfo':['otherimportantinfoOWSHTML'], 'ProcedureOverview':['procedureoverviewOWSHTML'], 'Procedure':['akhprocedureOWSHTML'], 'ProcedureAddInfo':['ProcedureadditionalinfoOWSHTML'], 'PostProcedure':['postprocedureOWSHTML'], 'PreparingForProcedure':['preparingforprocedureOWSHTML'], 'RisksOfProcedure':['RisksoftesttreatmentprocedureOWSHTML'], 'AtSickkids':['atsickkidsOWSHTML'], 'Resources':['resourcesOWSHTML'], 'References':['akhreferencesOWSHTML'], 'ArticleBrandPhoto':['ArticleBrandPhotoOWSIMGE'], 'Facebook':['facebookOWSHTML'], 'Twitter':['twitterOWSHTML'], 'Linkedin':['linkedinOWSHTML'], 'Pinterest':['pinterestOWSHTML'], 'LPBanner':['LandingPageBannerImage0OWSTEXT'], 'VanityURLName':['VanityURLNameOWSTEXT'], 'AKHContentRecogImage':['ContentRecognitionImageOWSTEXT'], 'AKHContentRecogText':['ContentRecognitionTextOWSHTML']};
  var cachePreviousItemValuesFunction = ctx['ItemValues'];
  ctx['ItemValues'] = function(slotOrPropName) {
    return Srch.ValueInfo.getCachedCtxItemValue(ctx, slotOrPropName)
};

ms_outHtml.push('',''
,''
);
   
    //IFFY to create item to used in markup
    var item = (function (context, containerId) {
        var internalItem = {
            encodedId: null,
            model: {},
            selectors: {},
            pagging: {
              nextUrl: null,
              previousUrl: null
            },
            events: {
                onPostRender: function (context) {
                    $.removeCookie('akhHubTitle');
                    
                }
            },
                init: function () {
                    this.initSelectors().initModel().initPagging().initEvents();
                    return {
                        model: this.model,
                        selectors: this.selectors,
                        pagging: this.pagging
                    };
            },
            formatting: {
              //format managed property values
              peopleValue: function (value) {
                if (value !== null && value !== "") {
                  return value[0].entityLabel;
                }
                return value;
              },
              dateValue: function (value, dateFormat) {
                if (value !== null && value !== "") {
                  return moment(value).format(dateFormat);
                }
                return value;
              },
              multiValue: function(value, delimiter) {
                if (value !== null && value !== "") {
                  return value.split(delimiter);
                }
                return value;
              }
            },
            initPagging: function () {
              //example for pagging
              var currentUrl = window.location.protocol + "//" + window.location.host + _spPageContextInfo.serverRequestPath;
              this.pagging.previousUrl = currentUrl + "?contentid=" + (this.model.contentId - 1) + "&language=" + this.model.language;
              this.pagging.nextUrl = currentUrl + "?contentid=" + (this.model.contentId + 1) + "&language=" + this.model.language;
              return this;
            },
            initModel: function () {
              //managed property to be used in markup, empty string if no value
                this.model = {
                    contentId: $getItemValue(context, "ContentId").value,
                    title: $getItemValue(context, "Title").value,
                    englishTitle: $getItemValue(context, "EnglishTitle").value,
                    vanityURLName: $getItemValue(context, "VanityURLName").value,
					lPBanner: $getItemValue(context, "LPBanner").value,
                    akhContentRecogImage: $getItemValue(context, "AKHContentRecogImage").value,
                    akhContentRecogText: STSHtmlDecode($getItemValue(context, "AKHContentRecogText").value),
					language: $getItemValue(context, "Language").value,
                    healthSpecialty: $getItemValue(context, "HealthSpecialty").value,
                    agesStages: this.formatting.multiValue($getItemValue(context, "AgesStages").value, ";"),
                    bodyParts: this.formatting.multiValue($getItemValue(context, "BodyParts").value, ";"),
                    bodySystem: $getItemValue(context, "BodySystem").value,
                    healthCategory: $getItemValue(context, "HealthCategory").value,
                    targetAudience: $getItemValue(context, "TargetAudience").value,
                    symptoms: this.formatting.multiValue($getItemValue(context, "Symptoms").value, ";"),
                    promotionalImage: $getItemValue(context, "PromotionalImage").value,
                    reviewDate: this.formatting.dateValue($getItemValue(context, "ReviewDate").value, "MMMM Do YYYY"),
                    //projectLead: $getItemValue(context, "projectLead").value,
                    sme: this.formatting.multiValue($getItemValue(context, "SME").value, ","),
                    //editor: this.formatting.peopleValue($getItemValue(context, "Editor").value),
                    //illustrator: $getItemValue(context, "Illustrator").value,
                    comments: $getItemValue(context, "Comments").value,
                    readingLevel1: $getItemValue(context, "ReadingLevel1").value,
                    readingLevel2: $getItemValue(context, "ReadingLevel2").value,
                    wordCount: $getItemValue(context, "WordCount").value,
                    contentTypeName: $getItemValue(context, "ContentTypeName").value,
                    internalCategory: $getItemValue(context, "InternalCategory").value,
                    overview: STSHtmlDecode($getItemValue(context, "Overview").value),
                    introduction: STSHtmlDecode($getItemValue(context, "Introduction").value),
                    introAddInfo: STSHtmlDecode($getItemValue(context, "IntroAddInfo").value),
                    keypoints: STSHtmlDecode($getItemValue(context, "Keypoints").value),
					pageContent: STSHtmlDecode($getItemValue(context, "PageContent").value),
                    signsAndSymptoms: STSHtmlDecode($getItemValue(context, "SignsAndSymptoms").value),
                    causesRiskFactorsPrevalence: STSHtmlDecode($getItemValue(context, "CausesRiskFactorsPrevalence").value),
                    spreadPhase: STSHtmlDecode($getItemValue(context, "SpreadPhase").value),
                    diagnosis: STSHtmlDecode($getItemValue(context, "Diagnosis").value),
                    complications: STSHtmlDecode($getItemValue(context, "Complications").value),
                    treatment: STSHtmlDecode($getItemValue(context, "Treatment").value),
                    helpChild: STSHtmlDecode($getItemValue(context, "HelpChild").value),
                    prevention: STSHtmlDecode($getItemValue(context, "Prevention").value),
                    whenToSeekMedicalAttention: STSHtmlDecode($getItemValue(context, "WhenToSeekMedicalAttention").value),
                    followUp: STSHtmlDecode($getItemValue(context, "FollowUp").value),
                    whatIsTheMedication: STSHtmlDecode($getItemValue(context, "WhatIsTheMedication").value),
                    beforeGivingMedication: STSHtmlDecode($getItemValue(context, "BeforeGivingMedication").value),
                    howToGiveMedication: STSHtmlDecode($getItemValue(context, "HowToGiveMedication").value),
                    missedDose: STSHtmlDecode($getItemValue(context, "MissedDose").value),
                    howLongDoesItTakeToWork: STSHtmlDecode($getItemValue(context, "HowLongDoesItTakeToWork").value),
                    sideEffects: STSHtmlDecode($getItemValue(context, "SideEffects").value),
                    safetyMeasures: STSHtmlDecode($getItemValue(context, "SafetyMeasures").value),
                    otherImportantInfo: STSHtmlDecode($getItemValue(context, "OtherImportantInfo").value),
                    procedureOverview: STSHtmlDecode($getItemValue(context, "ProcedureOverview").value),
                    preparingForProcedure: STSHtmlDecode($getItemValue(context, "PreparingForProcedure").value),
                    risksOfProcedure: STSHtmlDecode($getItemValue(context, "RisksOfProcedure").value),
                    procedure: STSHtmlDecode($getItemValue(context, "Procedure").value),
                    procedureAddInfo: STSHtmlDecode($getItemValue(context, "ProcedureAddInfo").value),
                    postProcedure: STSHtmlDecode($getItemValue(context, "PostProcedure").value),
                    atSickkids: STSHtmlDecode($getItemValue(context, "AtSickkids").value),
                    resources: STSHtmlDecode($getItemValue(context, "Resources").value),
                    references: STSHtmlDecode($getItemValue(context, "References").value),
					articleBrandPhoto: $getItemValue(context, "ArticleBrandPhoto").value,
                    facebook: STSHtmlDecode($getItemValue(context, "Facebook").value),
                    twitter: STSHtmlDecode($getItemValue(context, "Twitter").value),
                    linkedin: STSHtmlDecode($getItemValue(context, "Linkedin").value),
                    pinterest: STSHtmlDecode($getItemValue(context, "Pinterest").value)
                };
                context.Title = this.model.title + " Learning Hub";
                return internalItem;
            },
            initSelectors: function()  {
                this.encodedId = $htmlEncode(context.ClientControl.get_nextUniqueId() + containerId);
                this.selectors = {
                    container: this.encodedId + "container"
                };
                return this;
            },
            initEvents: function () {
                context.OnPostRender = [context.OnPostRender];
                context.OnPostRender.push(this.events.onPostRender);
                return this;
            }
        };
        return internalItem.init();
    })(ctx, "_akh-article-item_");
ms_outHtml.push(''
,'        '
,'        '
,'       <!-- <article id="', item.selectors.container ,'" data-displaytemplate="Item_AKH-LandingPage"> -->'
,'        <div id="Contol_AKH-Overview-Container" style="display:none;" aria-hidden="true">'
,'			'
,'                   '
,'                '
,'                '
,'                    <section>'
,'                        <h1>', item.model.title ,'</h1>'
,'                        '
,'                        <span>', item.model.internalCategory ,'</span>'
,''
,'                        '
,'                    '
,'				'
,'					'
); if (item.model.introduction !== null && item.model.introduction !== "") {
                ms_outHtml.push(''
,'					'
,'						', item.model.introduction ,''
,'                        '
,'					'
);
				   }            
			ms_outHtml.push(''
,''
,'					'
,'            	'
,'					'
); if (item.model.pageContent !== null && item.model.pageContent !== "") {
ms_outHtml.push(''
,'                    '
,'                            <div class="ignoreInternalStyling">'
,'                                ', item.model.pageContent ,''
,'                            </div>'
,'                    '
);
       }            
ms_outHtml.push(''
,''
,'                    '
,'                    <!-- panel footer -->'
,'                    '
,'                    <!-- <small id="review-date" class="pull-left">Last updated: ', item.model.reviewDate ,'</small> -->'
,''
); if (item.model.akhContentRecogText !== null && item.model.akhContentRecogText !== "") {ms_outHtml.push(''
,'                        <div class="recognition-area">'
,'                            <span class="recognition-title">Thank you to our content sponsor</span>'
,'                            <div class="recognition-content">'
,'                                '
); if (item.model.akhContentRecogImage !== null && item.model.akhContentRecogImage !== "") {ms_outHtml.push(''
,'                                    <img src="', item.model.akhContentRecogImage ,'" />'
); }  
ms_outHtml.push(''
,'                                ', item.model.akhContentRecogText ,''
,'                            </div>'
,'                        </div>'
,'                    '
); } ms_outHtml.push(''
,''
,''
,'            </section>'
,'				</div>'
,'            '
,'        <!-- </article> -->'
);    
        AddPostRenderCallback(ctx, function () {
        //add google tracker to article URL for landing page source
        	$('.overview-links').each(function() {
        		vanityUrl = item.model.vanityURLName.split(',')[0];
                var collUrl = window.location.href.split('#')[1];
            	var articleUrl = $(this).attr('href');
                if (window.location.href.indexOf('#')>-1) {
            	   if (articleUrl.indexOf('contentid=')>-1) {
                        $(this).attr('href', articleUrl + '&hub=' + vanityUrl + '#' + collUrl);
                    } else {
                        $(this).attr('href', articleUrl + '?hub=' + vanityUrl + '#' + collUrl);
                    }
                } else {
            	   if (articleUrl.indexOf('contentid=')>-1) {
                        $(this).attr('href', articleUrl + '&hub=' + vanityUrl);
                    } else {
                        $(this).attr('href', articleUrl + '?hub=' + vanityUrl);
                    }
                }
            });

            //Assign ids and collect link array
            var newId = 0;
            var hubLinks = [];
            var hubTitles = [];
            $('a.overview-links[href*="contentid"]').each(function(){
                $(this).attr("id", newId);
                newId++;
                hubLinks.push($(this).attr('href'));
                hubTitles.push($(this).text());
            });

            //create new learning hub cookies
            var hubLinksNum = hubLinks.length;
            var currentUrl = window.location.href;
            document.cookie = "hubLinksTotal =" + hubLinksNum;
            var thisHub = parseFloat($.cookie('thisHubNum'));
            var thisHubLink = hubLinks[thisHub];
           
            // &utm is a prefix used in google marketting tags on URL
            var thisUrl = currentUrl.split('&utm')[0].split('.ca')[1];
            if (thisHubLink == thisUrl) {
                hubButtons();
            } else {
                var newHubUrl = currentUrl.split('&utm')[0].split('.ca')[1];
                var newHubNum = hubLinks.indexOf(newHubUrl);
                var thisHub = newHubNum;
                document.cookie = "thisHubNum =" + thisHub;
                hubButtons();
            }
            function hubButtons(){
                var prevHubNum = thisHub - 1;
                var prevHubLink = hubLinks[prevHubNum];
                var prevHubTitle = hubTitles[prevHubNum];
                document.cookie = "akhHubPrev =" + prevHubNum +"//"+ prevHubLink +"//" + prevHubTitle;
                var nextHubNum = ++thisHub;
                var nextHubLink = hubLinks[nextHubNum];
                var nextHubTitle = hubTitles[nextHubNum];
                document.cookie = "akhHubNext =" + nextHubNum +"//"+ nextHubLink +"//" + nextHubTitle;
            }

            //Get LH title
            document.cookie = "akhThisTitle =" + $('#Contol_AKH-Overview-Container section h1').text();

            //Give LH background image rendition to cookie for button
            document.cookie = "akhHubImg =" + item.model.lPBanner + "?renditionID=3";

            });

ms_outHtml.push(' '
,''
);

  ctx['ItemValues'] = cachePreviousItemValuesFunction;
  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_4455b435562b42e386231957c95dbfa9() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Item_AKH-LandingPage", DisplayTemplate_4455b435562b42e386231957c95dbfa9);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_AKH_LearnHub_context.js", DisplayTemplate_4455b435562b42e386231957c95dbfa9);
}
//
        $includeLanguageScript("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_AKH_LearnHub_context.js", "~sitecollection/_catalogs/masterpage/Display Templates/Language Files/{Locale}/CustomStrings.js");
    //
}
RegisterTemplate_4455b435562b42e386231957c95dbfa9();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_AKH_LearnHub_context.js"), RegisterTemplate_4455b435562b42e386231957c95dbfa9);
}