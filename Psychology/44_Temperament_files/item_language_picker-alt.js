/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_d63f13c036f64ff0bdcafc121d0bd407(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_d63f13c036f64ff0bdcafc121d0bd407.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_language_picker-ALT.js';
  ctx['DisplayTemplateData']['TemplateType']='Item';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['ManagedPropertyMapping']={'ContentId':['contentIDOWSNMBR'], 'SearchTitle':['akhsearchtitle'], 'Title':['Title'], 'EnglishTitle':['akhenglishtitle'], 'LandingPageURL':['LandingPageURLOWSTEXT'], 'Language':['akhlanguage'], 'HealthSpecialty':['akhhealthspecialty'], 'AgesStages':['akhagesstages'], 'BodyParts':['akhbodyparts'], 'BodySystem':['akhbodysystem'], 'HealthCategory':['akhhealthcategory'], 'TargetAudience':['akhtargetaudience'], 'Symptoms':['akhsymptoms'], 'PromotionalImage':['promotionalimageOWSIMGE'], 'ReviewDate':['reviewdateOWSDATE'], 'ProjectLead':['projectleadOWSUSER'], 'SME':['smeOWSTEXT'], 'Editor':['akheditorOWSUSER'], 'Illustrator':['illustratorOWSUSER'], 'Comments':['akhcommentsOWSMTXT'], 'ReadingLevel1':['readinglevel1OWSNMBR'], 'ReadingLevel2':['readinglevel2OWSNMBR'], 'WordCount':['wordcountOWSNMBR'], 'Sponsor':['sponsorOWSTEXT'], 'ContentTypeName':['ContentTypeName'], 'InternalCategory':['akhinternalcategory'], 'Overview':['overviewOWSHTML'], 'Introduction':['introductionOWSHTML'], 'Keypoints':['keypointsOWSHTML'], 'SignsAndSymptoms':['signsandsymptomsOWSHTML'], 'CausesRiskFactorsPrevalence':['causesriskfactorsprevalenceOWSHTML'], 'Diagnosis':['diagnosisOWSHTML'], 'Treatment':['treatmentOWSHTML'], 'Complications':['complicationsOWSHTML'], 'WhenToSeekMedicalAttention':['whentoseekmedicalattentionOWSHTML'], 'WhatIsTheMedication':[' \u0027whatisthemedicationOWSHTML'], 'BeforeGivingMedication':['beforegivingmedicationOWSHTML'], 'HowToGiveMedication':['howtogivemedicationOWSHTML'], 'MissedDose':['misseddoseOWSHTML'], 'HowLongDoesItTakeToWork':['howlongdoesittaketoworkOWSHTML'], 'SideEffects':['sideeffectsOWSHTML'], 'SafetyMeasures':['safetymeasuresOWSHTML'], 'OtherImportantInfo':['otherimportantinfoOWSHTML'], 'ProcedureOverview':['procedureoverviewOWSHTML'], 'Procedure':['akhprocedureOWSHTML'], 'PostProcedure':['postprocedureOWSHTML'], 'PreparingForProcedure':['preparingforprocedureOWSHTML'], 'AtSickkids':['atsickkidsOWSHTML'], 'Resources':['resourcesOWSHTML'], 'References':['akhreferencesOWSHTML'], 'Facebook':['facebookOWSHTML'], 'Twitter':['twitterOWSHTML'], 'Linkedin':['linkedinOWSHTML'], 'Pinterest':['pinterestOWSHTML']};
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
            init: function () {
                this.initSelectors().initModel();
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
            initModel: function () {
              //managed property to be used in markup, empty string if no value
                this.model = {
                    contentId: $getItemValue(context, "ContentId").value,
                    title: $getItemValue(context, "Title").value,
                    englishTitle: $getItemValue(context, "EnglishTitle").value,
                    landingPageURL: $getItemValue(context, "LandingPageURL").value,
					searchTitle: $getItemValue(context, "SearchTitle").value,
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
                    keypoints: STSHtmlDecode($getItemValue(context, "Keypoints").value),
                    signsAndSymptoms: STSHtmlDecode($getItemValue(context, "SignsAndSymptoms").value),
                    causesRiskFactorsPrevalence: STSHtmlDecode($getItemValue(context, "CausesRiskFactorsPrevalence").value),
                    diagnosis: STSHtmlDecode($getItemValue(context, "Diagnosis").value),
                    treatment: STSHtmlDecode($getItemValue(context, "Treatment").value),
                    complications: STSHtmlDecode($getItemValue(context, "Complications").value),
                    whenToSeekMedicalAttention: STSHtmlDecode($getItemValue(context, "WhenToSeekMedicalAttention").value),
                    whatIsTheMedication: STSHtmlDecode($getItemValue(context, "WhatIsTheMedication").value),
                    beforeGivingMedication: STSHtmlDecode($getItemValue(context, "BeforeGivingMedication").value),
                    howToGiveMedication: STSHtmlDecode($getItemValue(context, "HowToGiveMedication").value),
                    missedDose: STSHtmlDecode($getItemValue(context, "MissedDose").value),
                    howLongDoesItTakeToWork: STSHtmlDecode($getItemValue(context, "HowLongDoesItTakeToWork").value),
                    sideEffects: STSHtmlDecode($getItemValue(context, "SideEffects").value),
                    safetyMeasures: STSHtmlDecode($getItemValue(context, "SafetyMeasures").value),
                    otherImportantInfo: STSHtmlDecode($getItemValue(context, "OtherImportantInfo").value),
                    procedureOverview: STSHtmlDecode($getItemValue(context, "ProcedureOverview").value),
                    procedure: STSHtmlDecode($getItemValue(context, "Procedure").value),
                    postProcedure: STSHtmlDecode($getItemValue(context, "PostProcedure").value),
                    preparingForProcedure: STSHtmlDecode($getItemValue(context, "PreparingForProcedure").value),
                    atSickkids: STSHtmlDecode($getItemValue(context, "AtSickkids").value),
                    resources: STSHtmlDecode($getItemValue(context, "Resources").value),
                    references: STSHtmlDecode($getItemValue(context, "References").value),
                    facebook: STSHtmlDecode($getItemValue(context, "Facebook").value),
                    twitter: STSHtmlDecode($getItemValue(context, "Twitter").value),
                    linkedin: STSHtmlDecode($getItemValue(context, "Linkedin").value),
                    pinterest: STSHtmlDecode($getItemValue(context, "Pinterest").value)
                };
								
				var articlePageUrl = window.location.protocol + "//" + window.location.host + _spPageContextInfo.siteServerRelativeUrl + "Article";
				this.model.url = articlePageUrl + "?contentid=" + this.model.contentId + "&language=" + this.model.language;
				
				return internalItem; 
            },
			
            initSelectors: function()  {
                this.encodedId = $htmlEncode(context.ClientControl.get_nextUniqueId() + containerId);
                this.selectors = {
                    container: this.encodedId + "container"
                };
                return this;
            }
        };
        return internalItem.init(); 
    })(ctx, "_akh-article-item_");
ms_outHtml.push(''
,'            <option class="cbs-Line1Link ms-noWrap ms-displayBlock article-lang" value="', item.model.url ,'">', item.model.language ,'</option>'
);

  ctx['ItemValues'] = cachePreviousItemValuesFunction;
  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_d63f13c036f64ff0bdcafc121d0bd407() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Item_AKH-Language-Picker", DisplayTemplate_d63f13c036f64ff0bdcafc121d0bd407);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_language_picker-ALT.js", DisplayTemplate_d63f13c036f64ff0bdcafc121d0bd407);
}
//
        $includeLanguageScript("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_language_picker-ALT.js", "~sitecollection/_catalogs/masterpage/Display Templates/Language Files/{Locale}/CustomStrings.js");
        
    //
}
RegisterTemplate_d63f13c036f64ff0bdcafc121d0bd407();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_language_picker-ALT.js"), RegisterTemplate_d63f13c036f64ff0bdcafc121d0bd407);
}