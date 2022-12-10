/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_6301aa519fe44a3a9f4add67038b38c4(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_6301aa519fe44a3a9f4add67038b38c4.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_AKH-Article.js';
  ctx['DisplayTemplateData']['TemplateType']='Item';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['ManagedPropertyMapping']={'ContentId':['contentIDOWSNMBR'], 'Title':['Title'], 'EnglishTitle':['akhenglishtitle'], 'SearchTitle':['akhsearchtitle'], 'Language':['akhlanguage'], 'HealthSpecialty':['akhhealthspecialty'], 'AgesStages':['akhagesstages'], 'BodyParts':['akhbodyparts'], 'BodySystem':['akhbodysystem'], 'HealthCategory':['akhhealthcategory'], 'TargetAudience':['akhtargetaudience'], 'Symptoms':['akhsymptoms'], 'PromotionalImage':['promotionalimageOWSIMGE'], 'ReviewDate':['reviewdateOWSDATE'], 'ProjectLead':['projectleadOWSUSER'], 'SME':['smeOWSTEXT'], 'Editor':['akheditorOWSUSER'], 'Illustrator':['illustratorOWSUSER'], 'Comments':['akhcommentsOWSMTXT'], 'ReadingLevel1':['readinglevel1OWSNMBR'], 'ReadingLevel2':['readinglevel2OWSNMBR'], 'WordCount':['wordcountOWSNMBR'], 'Sponsor':['sponsorOWSTEXT'], 'ContentTypeName':['ContentTypeName'], 'InternalCategory':['akhinternalcategory'], 'Overview':['overviewOWSHTML'], 'Introduction':['introductionOWSHTML'], 'IntroAddInfo':['IntroAdditionalInfoOWSHTML'], 'Keypoints':['keypointsOWSHTML'], 'PageContent':['PublishingPageContentOWSHTML'], 'SignsAndSymptoms':['signsandsymptomsOWSHTML'], 'CausesRiskFactorsPrevalence':['causesriskfactorsprevalenceOWSHTML'], 'SpreadPhase':['SpreadphasecourseofdiseaseOWSHTML'], 'Diagnosis':['diagnosisOWSHTML'], 'Treatment':['treatmentOWSHTML'], 'Complications':['complicationsOWSHTML'], 'HelpChild':['HelpingyourchildcareathomecopingOWSHTML'], 'Prevention':['PreventionOWSHTML'], 'WhenToSeekMedicalAttention':['whentoseekmedicalattentionOWSHTML'], 'FollowUp':['Follow-upcareclinicappointmentslong-termoutcomesOWSHTML'], 'WhatIsTheMedication':['whatisthemedicationOWSHTML'], 'BeforeGivingMedication':['beforegivingmedicationOWSHTML'], 'HowToGiveMedication':['howtogivemedicationOWSHTML'], 'MissedDose':['misseddoseOWSHTML'], 'HowLongDoesItTakeToWork':['howlongdoesittaketoworkOWSHTML'], 'SideEffects':['sideeffectsOWSHTML'], 'SafetyMeasures':['safetymeasuresOWSHTML'], 'OtherImportantInfo':['otherimportantinfoOWSHTML'], 'ProcedureOverview':['procedureoverviewOWSHTML'], 'Procedure':['akhprocedureOWSHTML'], 'ProcedureAddInfo':['ProcedureadditionalinfoOWSHTML'], 'PostProcedure':['postprocedureOWSHTML'], 'PreparingForProcedure':['preparingforprocedureOWSHTML'], 'RisksOfProcedure':['RisksoftesttreatmentprocedureOWSHTML'], 'AtSickkids':['atsickkidsOWSHTML'], 'Resources':['resourcesOWSHTML'], 'References':['akhreferencesOWSHTML'], 'ArticleBrandPhoto':['ArticleBrandPhotoOWSIMGE'], 'AKHBrandPhoto':['AKHBrandPhotoOWSTEXT'], 'VanityURLName':['VanityURLNameOWSTEXT'], 'Facebook':['facebookOWSHTML'], 'Twitter':['twitterOWSHTML'], 'Linkedin':['linkedinOWSHTML'], 'Pinterest':['pinterestOWSHTML'], 'AKHPromoImage':['PromotionalImageOWSTEXT'], 'OGTitle':['Title'], 'AKHDrugName':['AKHDrugName'], 'AKHNoIndex':['AKHNoIndex'], 'NextPage':['AKHnextpage'], 'PreviousPage':['AKHpreviouspage'], 'AKHPromoTitle':['AKHPromoTitle'], 'AKHPromoSnippet':['AKHPromoSnippet'], 'akhpdfattachments':['akhpdfattachments'], 'AKHUpperContentRecognition':['AKHUpperContentRecognition'], 'akhDrugOverdoseOverride':['akhDrugOverdoseOverride'], 'AKHCanonicalSource':['AKHCanonicalSource']};
  var cachePreviousItemValuesFunction = ctx['ItemValues'];
  ctx['ItemValues'] = function(slotOrPropName) {
    return Srch.ValueInfo.getCachedCtxItemValue(ctx, slotOrPropName)
};

ms_outHtml.push('',''
,''
);
    // tell the prerender service that rendering has begun
    if (typeof AkhApi != 'undefined') {
        AkhApi.startRender();
    }
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
                    item.onPostRender(context);
                    // remove landing page and overview cookies
		        	$.removeCookie('collectionUrl');
		            $.removeCookie('collectionTitle');
		            $.removeCookie('akhLandingUrl');
                    $.removeCookie('akhLanding');
                    if (typeof AkhApi != 'undefined') {
                        var currentUrl = window.location.href;
                        var openAllPanelsFunction = $('#open-all-panels').click.bind($('#open-all-panels'));
                        var noSeoElements = '.akh-no-seo';
                        var canonicalUrl;
                        var alternateUrl;
                        var defaultMetaOgImage = 'https://assets.aboutkidshealth.ca/AKHAssets/home_page_hero.jpg';
                        var metaOgImageQueryStringParameter = '?renditionid=21';
                        var canonicalUrl;
                        var alternateUrl;
                        var baseEnglishUri = window.location.protocol + "//" + window.location.host + '/';
                        var baseFrenchUri = window.location.protocol + "//" + window.location.host + '/fr/';
                        var englishArticleUrl = baseEnglishUri + 'Article?contentid=' + item.model.contentId + '&language=English';
                        var frenchArticleUrl = baseFrenchUri + 'Article?contentid=' + item.model.contentId + '&language=French';
                        var extCanonical = !_.isEmpty(item.model.akhCanonicalSource);
                        var hasVanity = !_.isEmpty(item.model.vanityURLName);
                        var isEnglishSite = _spPageContextInfo.siteServerRelativeUrl === '/';
                        var isFrenchSite = !isEnglishSite;
                        var isEnglishArticle = item.model.language === 'English';
                        var isFrenchArticle = item.model.language === 'French';
                        var isNotFrenchArticle = !isFrenchArticle;
                        if (extCanonical){
                            canonicalUrl = item.model.akhCanonicalSource;
                                    alternateUrl = {
                                        href: currentUrl,
                                        hreflang: 'en-ca'
                                    };
                        } else {
                        if (hasVanity) {
                            if (isFrenchSite) {
                                if (isNotFrenchArticle) {
                                    canonicalUrl = baseEnglishUri + item.model.vanityURLName.split(',')[0];
                                    alternateUrl = {
                                        href: currentUrl,
                                        hreflang: 'en-ca'
                                    };
                                } else {
                                    canonicalUrl = baseFrenchUri + item.model.vanityURLName.split(',')[0];
                                }
                            }
                            if (isEnglishSite) {
                                if (isFrenchArticle) {
                                    canonicalUrl = baseFrenchUri + item.model.vanityURLName.split(',')[0];
                                    alternateUrl = {
                                        href: currentUrl,
                                        hreflang: 'fr-ca'
                                    };
                                } else {
                                    canonicalUrl = baseEnglishUri + item.model.vanityURLName.split(',')[0];
                                }
                            }
                        } else {
                            if (isEnglishSite) {
                                if (isNotFrenchArticle) {
                                    canonicalUrl = currentUrl;
                                } else {
                                    canonicalUrl = frenchArticleUrl;
                                    alternateUrl = {
                                        href: currentUrl,
                                        hreflang: 'en-ca'
                                    };
                                }
                            }
                            if (isFrenchSite) {
                                if (isNotFrenchArticle) {
                                    canonicalUrl = baseEnglishUri + 'Article?contentid=' + item.model.contentId + '&language=' + item.model.language;
                                    alternateUrl = {
                                        href: currentUrl,
                                        hreflang: 'fr-ca'
                                    };
                                } else {
                                    canonicalUrl = currentUrl;
                                }
                            }
                        }
                    }
                        var metaOgImage = !_.isEmpty(item.model.promoImage) ? item.model.promoImage : item.model.akhBrandPhoto;
                        if (_.isEmpty(metaOgImage)) {
                            metaOgImage = defaultMetaOgImage;
                        }
                        metaOgImage = metaOgImage + metaOgImageQueryStringParameter;

                        var overview = $.parseHTML(item.model.overview);
                        if (overview.length > 0) {
                            overview = $(overview).text();
                        } else {
                            overview = undefined;
                        }
                        // tell prerender service the meta tags to udpate in the header, functions to run and elements to hide for SEO
                        //var noIndex = item.model.akhNoIndex ? 'noindex' : undefined;
                        var noIndex;
                        if (item.model.akhNoIndex === 'True' || item.model.akhNoIndex === 'Yes' ){
                            noIndex = 'noindex';
                        } else{
                            noIndex = undefined;
                        }

                        //variables and logic for jsonld metadata
                        var audienceName;
                        if (item.model.targetAudience.indexOf("Adult (19+)") > -1 || item.model.targetAudience.indexOf("Caregivers") > -1 || item.model.targetAudience.indexOf("Adult (22+)")> -1){
                            audienceName = "https://schema.org/ParentAudience"; 
                        }
                        else{
                            audienceName = "https://schema.org/Patient";
                        }
                        
                        
                        var jsonld = {
                            "@context": "https://schema.org",
                            "@type": "MedicalWebPage",
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": canonicalUrl
                            },
                            "lastReviewed":item.model.reviewDate,
                            "datePublished":item.model.reviewDate,
                            "headline": item.model.title,
                            "about":{
                                "@type": "Thing",
                                "name":item.model.title,
                                "description":item.model.overview,
                                "url":canonicalUrl
                            },
                            "image": metaOgImage,
                            "audience": {
                                "@type": "Audience",
                                "name":audienceName,
                                "audienceType":item.model.targetAudience
                            },
                            "publisher": {
                                "@type": "Organization",
                                "@id": "https://www.aboutkidshealth.ca",
                                "name": "AboutKidsHealth",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://assets.aboutkidshealth.ca/AKHAssets/AKH_primary_logo.svg"
                                }
                            }
                        };

                        var configSEO = {
                            head: {
                                title: item.model.title,
                                metaTags: {
                                    description: overview,
                                    robots: noIndex
                                },
                                metaOgTags: {
                                    url: canonicalUrl,
                                    type: 'article',
                                    description: overview,
                                    locale: 'en_CA',
                                    title: item.model.title,
                                    site_name: 'AboutKidsHealth',
                                    image: metaOgImage,
									'image:secure_url': metaOgImage
                                },
                                canonicalUrl: canonicalUrl,
                                alternateUrl: alternateUrl,
				jsonld: jsonld
                            },
                            seoFunctions: [openAllPanelsFunction],
                            nonSeoElements: [noSeoElements]
                        };
                        AkhApi.getImageSize(metaOgImage).then(function (imageSize) {
                            configSEO.head.metaOgTags['image:height'] = imageSize.height;
                            configSEO.head.metaOgTags['image:width'] = imageSize.width;
                            AkhApi.configSEO(configSEO);
                            // tell the prerender service that rendering has been done
                            AkhApi.doneRender();
                        }).catch(function (error) {
                            console.error('Could not get image size', error);
                            AkhApi.configSEO(configSEO);
                            // tell the prerender service that rendering has been done
                            AkhApi.doneRender();
                        });
                    }
                }
            },
            onPostRender: function (context) {
            },
            onDownloadPdf: function (item) {
                var replacementUrl = _spPageContextInfo.siteAbsoluteUrl + '/';
                var transforms = [{
                    pattern: AkhApi.transforms.hrefRelativeUrl.pattern,
                    replacement: AkhApi.transforms.hrefRelativeUrl.replacement(replacementUrl)
                }];
                var data = {
                            "data": {
                                "bindings": {}
                            },
                            "template": {
                                "url": {
                                    "content": replacementUrl + "Style%20Library/akh/pdf/akh.html"
                                },
                                 "page": {
                                    "format": "Letter",
                                    "orientation": "portrait"
                                },
                                "margin": {
                                    "top": "32px",
                                    "right": "64px",
                                    "bottom": "140px",
                                    "left": "64px"
                                },
                                "header": {
                                    "height": "0px"
                                },
                                "footer": {
                                    "height": "160px"
                                }
                            },
                            "filename": item.model.title + ".pdf"
                        };
                data.data.bindings.content = item.model;
                return AkhApi.getPdf({
                    data: data,
                    transforms: transforms,
                    view: false
                });
            },
            onViewPdf: function (item) {
                var replacementUrl = _spPageContextInfo.siteAbsoluteUrl + '/';
                var transforms = [{
                    pattern: AkhApi.transforms.hrefRelativeUrl.pattern,
                    replacement: AkhApi.transforms.hrefRelativeUrl.replacement(replacementUrl)
                }];
                var data = {
                            "data": {
                                "bindings": {}
                            },
                            "template": {
                                "url": {
                                    "content": replacementUrl + "Style%20Library/akh/pdf/akh.html"
                                },
                                 "page": {
                                    "format": "Letter",
                                    "orientation": "portrait"
                                },
                                "margin": {
                                    "top": "32px",
                                    "right": "64px",
                                    "bottom": "140px",
                                    "left": "64px"
                                },
                                "header": {
                                    "height": "0px"
                                },
                                "footer": {
                                    "height": "160px"
                                }
                            },
                            "filename": item.model.title + ".pdf"
                        };
                data.data.bindings.content = item.model;
                
                return AkhApi.getPdf({
                    data: data,
                    transforms: transforms,
                    view: true
                });
            },
            init: function () {
                this.initSelectors().initModel().initPagging().initEvents();
                return {
                    model: this.model,
                    selectors: this.selectors,
                    pagging: this.pagging,
                    onPostRender: this.onPostRender
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
              this.pagging.previousUrl = (this.model.previousPage);
              this.pagging.nextUrl = (this.model.nextPage);
              return this;
            },
            initModel: function () {
              //managed property to be used in markup, empty string if no value
                this.model = {
                    contentId: $getItemValue(context, "ContentId").value,
                    title: $getItemValue(context, "Title").value,
                    englishTitle: $getItemValue(context, "EnglishTitle").value,
                    akhDrugName: $getItemValue(context, "AKHDrugName").value,
                    language: $getItemValue(context, "Language").value,
                    nextPage: $getItemValue(context, "NextPage").value,
                    previousPage: $getItemValue(context, "PreviousPage").value,
					vanityURLName: $getItemValue(context, "VanityURLName").value,
                    akhUpperContentRecognition: $getItemValue(context, "AKHUpperContentRecognition").value,
                    healthSpecialty: $getItemValue(context, "HealthSpecialty").value,
                    agesStages: this.formatting.multiValue($getItemValue(context, "AgesStages").value, ";"),
                    bodyParts: this.formatting.multiValue($getItemValue(context, "BodyParts").value, ";"),
                    bodySystem: $getItemValue(context, "BodySystem").value,
                    healthCategory: $getItemValue(context, "HealthCategory").value,
                    targetAudience: $getItemValue(context, "TargetAudience").value,
                    symptoms: this.formatting.multiValue($getItemValue(context, "Symptoms").value, ";"),
                    promoImage: $getItemValue(context, "AKHPromoImage").value,
                    promoTitle: $getItemValue(context, "AKHPromoTitle").value,
                    promoSnippet: STSHtmlDecode($getItemValue(context, "AKHPromoSnippet").value),
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
                    akhBrandPhoto: $getItemValue(context, "AKHBrandPhoto").value,
					articleBrandPhoto: $getItemValue(context, "ArticleBrandPhoto").value,
                    AKHDrugOverdoseOverride: STSHtmlDecode($getItemValue(context, "akhDrugOverdoseOverride").value),
                    facebook: STSHtmlDecode($getItemValue(context, "Facebook").value),
                    twitter: STSHtmlDecode($getItemValue(context, "Twitter").value),
                    linkedin: STSHtmlDecode($getItemValue(context, "Linkedin").value),
                    pinterest: STSHtmlDecode($getItemValue(context, "Pinterest").value),
                    akhNoIndex: STSHtmlDecode($getItemValue(context, "AKHNoIndex").value),
                    akhCanonicalSource: $getItemValue(context, "AKHCanonicalSource").value,
                    akhpdfattachments: !_.isEmpty($getItemValue(context, "akhpdfattachments").value) ? ($getItemValue(context, "akhpdfattachments").value).split(',') : undefined
                };
                context.Title = this.model.title;
                context.OGTitle = this.model.title;
				return internalItem;
            },
            initSelectors: function()  {
                this.encodedId = $htmlEncode(context.ClientControl.get_nextUniqueId() + containerId);
                this.selectors = {
                    container: this.encodedId + "container",
                    pdfDownloadButton: $('#akh-pdf-download-button'),
                    pdfPrintButton: $('#akh-pdf-print-button')
                };
                return this;
            },
            initEvents: function () {
                var item = this;
                if (typeof AkhApi != 'undefined') {
                    this.selectors.pdfDownloadButton.on('click', function () {
                        item.onDownloadPdf.call(this, item).then(function () {
                            pdfDone();
                        }).catch(function (error) {
                            console.error('Cannot download pdf', error);
                        });
                    });
                    this.selectors.pdfPrintButton.on('click', function () {
                        item.onViewPdf.call(this, item).then(function () {
                            pdfDone();
                        }).catch(function (error) {
                            console.error('Cannot view pdf', error);
                        });
                    });
                }
                context.OnPostRender.push(this.events.onPostRender);
                return this;
            }
        };
        return internalItem.init();
    })(ctx, "_akh-article-item_");
ms_outHtml.push('		'
,'	        <article id="', item.selectors.container ,'" class="container" data-displaytemplate="Item_AKH-Article">'
,'            <div class="breadcrumb-nav"></div> '
,'              '
,'            <!-- <input id ="lang-switch" type="button" value="French"/> -->'
,'            <form class="form-inline">'
,'                <select id="lang-switch" aria-label="article language" class="link-list" onChange="window.location.href=this.value">'
,'                    <option value="none" style="display:none">', item.model.language ,'</option>'
,'                </select>'
,'            </form> '
); if (item.model.language === 'English') {ms_outHtml.push(''
,'			<div id="article-container">'
); } ms_outHtml.push(''
); if (item.model.language === 'French') {ms_outHtml.push(''
,'			<div id="article-container" lang="fr">'
); } ms_outHtml.push(''
); if (item.model.language === 'ChineseTraditional') {ms_outHtml.push(''
,'			<div id="article-container" lang="zh-Hant">'
); } ms_outHtml.push(''
); if (item.model.language === 'ChineseSimplified') {ms_outHtml.push(''
,'			<div id="article-container" lang="zh-Hans">'
); } ms_outHtml.push(' '
); if (item.model.language === 'Portuguese') {ms_outHtml.push(''
,'			<div id="article-container" lang="pt">'
); } ms_outHtml.push(' '
); if (item.model.language === 'Spanish') {ms_outHtml.push(''
,'			<div id="article-container" lang="es">'
); } ms_outHtml.push('    '
); if (item.model.language === 'Urdu') {ms_outHtml.push(''
,'			<div id="article-container" lang="ur">'
); } ms_outHtml.push('    '
); if (item.model.language === 'Tamil') {ms_outHtml.push(''
,'			<div id="article-container" lang="ta">'
); } ms_outHtml.push('    '
); if (item.model.language === 'Arabic') {ms_outHtml.push(''
,'			<div id="article-container" lang="ar">'
); } ms_outHtml.push('  '
); if (item.model.language === 'Punjabi') {ms_outHtml.push(''
,'			<div id="article-container" lang="pa">'
); } ms_outHtml.push('          '
); if (item.model.language === 'Arabic' || item.model.language === 'Urdu' || item.model.language === 'Farsi') {ms_outHtml.push(''
,'			<div class="col-md-12" dir="rtl">'
); } ms_outHtml.push(''
); if (item.model.language !== 'Arabic' && item.model.language !== 'Urdu' && item.model.language !== 'Farsi') {ms_outHtml.push(''
,'			<div class="col-md-12">'
); } ms_outHtml.push(''
,'                 	<div class="jumbotron">'
,'                        <h1 id="article_title">', item.model.title ,'</h1>'
); if (item.model.language !== 'English' && item.model.language !== "") {
                           ms_outHtml.push(''
,'                                   <h3 dir="ltr">', item.model.englishTitle ,' [ ', item.model.language ,' ]</h3>'
);
                               }
                        ms_outHtml.push(''
); if (item.model.vanityURLName !== 'contributors' && item.model.vanityURLName !== 'Contributors') {ms_outHtml.push(''
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                       <a href="/Contributors" class="author">By SickKids staff</a>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                       <a href="/Contributors" class="author">Par le personnel de SickKids</a>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                    </div>'
,'                    <div id="wb-container" aria-hidden="true">'
); if (item.model.language === 'English') {ms_outHtml.push(''
,'                        <div id="webreader_button" class="rs_skip rsbtn rs_preserve" role="widget" aria-roledescription="ReadSpeaker Audio Player">'
,'                           <a rel="nofollow" class="rsbtn_play" accesskey="L" title="Listen to this article" href="//app-na.readspeaker.com/cgi-bin/rsent?customerid=6244&amp;lang=en_us&amp;readid=article-container&amp;url=" onclick="readpage(this.href);return false;">'
,'                           <span class="rsbtn_left rsimg rspart"><span class="rsbtn_text"><span id="listen">Listen</span></span></span>'
,'                           <span class="rsbtn_right rsimg rsplay rspart"></span>'
,'                           </a>'
,'                       </div>         '
); } ms_outHtml.push('			'
); if (item.model.language === 'French') {ms_outHtml.push(''
,'                        <div id="webreader_button" class="wb-fr rs_skip rsbtn rs_preserve" role="widget" aria-label="&#xA;       lecteur audio de ReadSpeaker">'
,'                           <a rel="nofollow" class="rsbtn_play" accesskey="L" title="&#201;coutez cet article" href="//app-na.readspeaker.com/cgi-bin/rsent?customerid=6244&amp;lang=fr_fr&amp;readid=article-container&amp;url=" onclick="readpage(this.href);return false;">'
,'                           <span class="rsbtn_left rsimg rspart"><span class="rsbtn_text"><span>&#201;couter</span></span></span>'
,'                           <span class="rsbtn_right rsimg rsplay rspart"></span>'
,'                           </a>'
,'                       </div>  '
); } ms_outHtml.push('		'
); if (item.model.language === 'ChineseTraditional' || item.model.language === 'ChineseSimplified') {ms_outHtml.push(''
,'                       <div id="webreader_button" class="wb-ch rs_skip rsbtn rs_preserve">'
,'                       <a rel="nofollow" class="rsbtn_play" accesskey="L" title="&#35753;ReadSpeaker webReader&#20026;&#20320;&#26391;&#35835;&#39029;&#38754;" href="//app-na.readspeaker.com/cgi-bin/rsent?customerid=6244&amp;lang=zh_cn&amp;voice=Hui&amp;readid=article-container&amp;url=" onclick="readpage(this.href);return false;">'
,'                       <span class="rsbtn_left rsimg rspart"><span class="rsbtn_text"><span>&#26391;&#35835;</span></span></span>'
,'                       <span class="rsbtn_right rsimg rsplay rspart"></span>'
,'                        </a>'
,'                       </div>  '
); } ms_outHtml.push('	'
); if (item.model.language === 'Arabic') {ms_outHtml.push(''
,'                       <div id="webreader_button" class="wb-ar rs_skip rsbtn rs_preserve">'
,'                       <a rel="nofollow" class="rsbtn_play" accesskey="L" title="ReadSpeaker webReader &#1573;&#1587;&#1578;&#1605;&#1593; &#1573;&#1604;&#1609; &#1607;&#1584;&#1607; &#1575;&#1604;&#1589;&#1601;&#1581;&#1577;&#1616; &#1605;&#1587;&#1578;&#1582;&#1583;&#1605;&#1575;&#1611;" href="//app-na.readspeaker.com/cgi-bin/rsent?customerid=6244&amp;lang=ar_ar&amp;readid=article-container&amp;url=" onclick="readpage(this.href);return false;">'
,'                       <span class="rsbtn_left rsimg rspart"><span class="rsbtn_text"><span>&#1575;&#1587;&#1578;&#1605;&#1593;</span></span></span>'
,'                       <span class="rsbtn_right rsimg rsplay rspart"></span>'
,'                       </a>'
,'                       </div>     '
); } ms_outHtml.push('	'
); if (item.model.language === 'Spanish') {ms_outHtml.push(''
,'                       <div id="webreader_button" class="wb-es rs_skip rsbtn rs_preserve">  '
,'                       <a rel="nofollow" class="rsbtn_play" accesskey="L" title="Escucha esta articulo" href="//app-na.readspeaker.com/cgi-bin/rsent?customerid=6244&amp;lang=es_mx&amp;readid=article-container&amp;url=" onclick="readpage(this.href);return false;"> '
,'                       <span class="rsbtn_left rsimg rspart"><span class="rsbtn_text"><span>Escuchar</span></span></span> '
,'                       <span class="rsbtn_right rsimg rsplay rspart"></span> '
,'                       </a> '
,'                       </div>  '
); } ms_outHtml.push(' 	'
); if (item.model.language === 'Portuguese') {ms_outHtml.push(' '
,'                       <div id="webreader_button" class="wb-pt rs_skip rsbtn rs_preserve"> '
,'                       <a rel="nofollow" class="rsbtn_play" accesskey="L" title="Ouvir com artigo" href="//app-na.readspeaker.com/cgi-bin/rsent?customerid=6244&amp;lang=pt_br&amp;readid=article-container&amp;url=" onclick="readpage(this.href);return false;"> '
,'                       <span class="rsbtn_left rsimg rspart"><span class="rsbtn_text"><span>Ouvir</span></span></span> '
,'                       <span class="rsbtn_right rsimg rsplay rspart"></span> '
,'                       </a> '
,'                       </div> '
); } ms_outHtml.push(' '
,'                   </div>	'
,'                    <!-- pdf downloader -->'
,'                    <!--'
,'                    <div class="pdf-container rs_skip">'
,'                        <a href="#" id="akh-pdf-download-button">'
,'                            <i class="material-icons" aria-hidden="true">download_for_offline</i>'
,'                            <span class="pdf-label">Download PDF</span>'
,'                     -->       '
,'                            <!--'
,'                            <div class="arrowtip"> </div> '
,'                            <picture>'
,'                                <source media="(min-width:521px)" srcSet="https://assets.aboutkidshealth.ca/AKHAssets/AKH%20Social%20Media/PDFDownload-Button.svg"/>'
,'                                <img src="https://assets.aboutkidshealth.ca/AKHAssets/AKH%20Social%20Media/PDFDownload-Mobile-Button.svg" alt="download PDF" aria-describedby="article_title"/>'
,'                            </picture>'
,'                            -->'
,'                   <!--     </a>'
,'                    <a href="#" id="akh-pdf-print-button">'
,'                            <i class="material-icons" aria-hidden="true">print_for_offline</i>'
,'                            <span class="pdf-label">Print</span>'
,'                        -->    '
,'                            <!--'
,'                            <div class="arrowtip"> </div> '
,'                            <picture>'
,'                                <source media="(min-width:521px)" srcSet="https://assets.aboutkidshealth.ca/AKHAssets/AKH%20Social%20Media/PDFDownload-Button.svg"/>'
,'                                <img src="https://assets.aboutkidshealth.ca/AKHAssets/AKH%20Social%20Media/PDFDownload-Mobile-Button.svg" alt="download PDF" aria-describedby="article_title"/>'
,'                            </picture>'
,'                            -->'
,'                        <!--    '
,'                        </a>'
,'                        <div class="pdfloader">'
,'                        </div>'
,'                    </div> '
,'                    -->'
,'                    <!-- end pdf downloader -->'
); if (item.model.overview !== null && item.model.overview !== "") {
                ms_outHtml.push(''
,'					<div id="article-overview" class="panel-body">'
); if (item.model.contentTypeName !== "Drugs (A-Z)") { ms_outHtml.push(''
,'						      ', item.model.overview ,''); } ms_outHtml.push(''
); if (item.model.contentTypeName === "Drugs (A-Z)") { ms_outHtml.push(''
,'						', item.model.introduction ,''); } ms_outHtml.push(''
,'                        '
,'					</div>'
);
				   }
			ms_outHtml.push(''
); if (item.model.keypoints !== null && item.model.keypoints !== "") {
                ms_outHtml.push(''
,'                    <div class="panel panel-info clearfix">'
,''
,'                        <div id="key-points" class="panel-body">'
,'                            <!-- Image gallery -->'
,'                            <div id="gallery-frame" class="rs_skip rs_preserve">'
,'                                <div id="image-gallery">'
,'                                    <div class="slider-for">'
,'                                    </div>'
,'                                    <div class="slider-nav">'
,'                                    </div>'
,'                                </div>'
,'                            </div>'
,'                            ', item.model.keypoints ,''
,'                        </div>'
,''
,'                    </div>'
);
                       }
                ms_outHtml.push(''
,'                    <!-- Open all button for QA only-->'
,'			        <button type="button" id="open-all-panels" class="btn-success rs_skip rs_preserve" aria-expanded="false" aria-controls="panel-container">'
); if (item.model.language !== 'French' && item.model.language !== "") {ms_outHtml.push(''
,'			        	<span class="pull-left clickable">Expand All</span><i class="mdi mdi-chevron-down pull-right"></i>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") {ms_outHtml.push(''
,'			        	<span class="pull-left clickable">Ouvre tout</span><i class="mdi mdi-chevron-down pull-right"></i>'); } ms_outHtml.push(''
,'			        </button>'
,'			        '
,'			        <!-- Article brand photo -->'
); if (item.model.akhBrandPhoto !== null && item.model.akhBrandPhoto !== "") { ms_outHtml.push(''
,'					                    <div id="brand-photo" style="display:none;">'
,'					                       <img src="', item.model.akhBrandPhoto ,'" />'
,'					                    </div>'
);
					       }
					ms_outHtml.push(''
,'                '
,'                    <section id="panel-container">'
,''
); if (item.model.contentTypeName !== "Flat Content") { ms_outHtml.push(''
); if (item.model.contentTypeName !== "Drugs (A-Z)") { ms_outHtml.push(''
,'                            <div class="panel">'
,'                                <div id="article" class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-intro" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                           <span class="panel-heading-collapsable">Introduction</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                           <span class="panel-heading-collapsable">Introduction</span>'); } ms_outHtml.push(''
,''
,'                                    <span class="pull-right clickable panel-heading-collapsable-icon" href="#article-intro">'
,'                                        <i class="mdi mdi-chevron-down"></i></span>'
,'                                </div>'
,'                                <div id="article-intro" class="panel-body collapse out" style="display: none;">'
,'                                        ', item.model.introduction ,''
,'                                </div>'
,''
,'                            </div>'
);
                           }
                        ms_outHtml.push(''
);
       }
ms_outHtml.push(''
); if (item.model.contentTypeName === "Flat Content") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                            <div class="panel-body">'
,'                                ', item.model.introduction ,''
,'                            </div>'
,'                    </div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.introAddInfo !== null && item.model.introAddInfo !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-introAddInfo" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">More information</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Autres renseignements </span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-introAddInfo" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-introAddInfo" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.introAddInfo ,''
,'                        </div>'
,'                    </div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.pageContent !== null && item.model.pageContent !== "") {
ms_outHtml.push(''
,'                    <!-- <div class="panel"> -->'
,'                            <!-- <div class="panel-body"> -->'
,'                                ', item.model.pageContent ,''
,'                            <!-- </div> -->'
,'                    <!-- </div> -->'
);
       }
ms_outHtml.push(''
,''
,''
); if (item.model.signsAndSymptoms !== null && item.model.signsAndSymptoms !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-signs" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Signs and symptoms</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Signes et sympt&#244;mes</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-signs" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-signs" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.signsAndSymptoms ,''
,'                        </div>'
,'                    </div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.causesRiskFactorsPrevalence !== null && item.model.causesRiskFactorsPrevalence !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-causesRiskFactorsPrevalence" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Causes, risk factors and prevalence</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Causes, facteurs de risque et pr&#233;valence</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-causesRiskFactorsPrevalence" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-causesRiskFactorsPrevalence" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.causesRiskFactorsPrevalence ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.spreadPhase !== null && item.model.spreadPhase !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-diagnosis" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Spread, phase, course of disease</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Propagation, stades et progression de la maladie</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-diagnosis" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-diagnosis" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.spreadPhase ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push('   '
,'                '
,''
,'                '
,''
); if (item.model.diagnosis !== null && item.model.diagnosis !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-diagnosis" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Diagnosis</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Diagnostic</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-diagnosis" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-diagnosis" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.diagnosis ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push('   '
,'                    '
,''
,''
); if (item.model.treatment !== null && item.model.treatment !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-treatment" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Treatment</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Traitement</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-treatment" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-treatment" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.treatment ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
,'                    '
); if (item.model.prevention !== null && item.model.prevention !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-prevention" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Prevention</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Pr&#233;vention</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-prevention" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-prevention" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.prevention ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
,''
,'                    '
); if (item.model.whatIsTheMedication !== null && item.model.whatIsTheMedication !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-what-medical" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">What is the medication</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">En quoi consiste le m&#233;dicament?</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-what-medical" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-what-medical" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.whatIsTheMedication ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.beforeGivingMedication !== null && item.model.beforeGivingMedication !== "") {
ms_outHtml.push(''
,'					<div class="panel">'
,'                      <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-before-medical" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Before giving the medication</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Avant de donner le m&#233;dicament</span>'); } ms_outHtml.push(''
,'                          '
,'                          <span href="#article-before-medical" class="pull-right panel-heading-collapsable-icon">'
,'                              <i class="mdi mdi-chevron-down"></i></span>  '
,'                      </div>'
,'                      <div id="article-before-medical" class="panel-body" style="display: none;">'
,'                          ', item.model.beforeGivingMedication ,''
,'                      </div>  '
,'                    </div>                     '
);
       }            
ms_outHtml.push(''
,''
); if (item.model.howToGiveMedication !== null && item.model.howToGiveMedication !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-give-medical" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">How to give the medication</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Comment donner le m&#233;dicament</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-give-medical" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-give-medical" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.howToGiveMedication ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.missedDose !== null && item.model.missedDose !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-missed" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">What to do for a missed dose</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Que faire si on rate une dose </span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-missed" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-missed" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.missedDose ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.howLongDoesItTakeToWork !== null && item.model.howLongDoesItTakeToWork !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-how" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">How long does it take to work</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Dans combien de temps verra-t-on des r&#233;sultats?</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-how" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-how" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.howLongDoesItTakeToWork ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.sideEffects !== null && item.model.sideEffects !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-side-effects" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Side effects</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Effets secondaires possibles</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-side-effects" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-side-effects" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.sideEffects ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.safetyMeasures !== null && item.model.safetyMeasures !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-safety" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Safety measures</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Mesures de s&#233;curit&#233;</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-safety" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-safety" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.safetyMeasures ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.otherImportantInfo !== null && item.model.otherImportantInfo !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-important" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Other important information</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Autres renseignements importants</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-important" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-important" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.otherImportantInfo ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.procedureOverview !== null && item.model.procedureOverview !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-proced-overview" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Procedure overview</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">About the treatment</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">About the test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">&#192; propos de l&#8217;intervention</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">&#192; propos du traitement</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">&#192; propos du test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-proced-overview" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-proced-overview" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.procedureOverview ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.risksOfProcedure !== null && item.model.risksOfProcedure !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-risksOfProcedure" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Risks of the procedure</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Risks of the treatment</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Risks of the test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                                   '
); if (item.model.language === 'French' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Risques de l&#8217;intervention</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Risques du traitement</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Risques du test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-risksOfProcedure" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-risksOfProcedure" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.risksOfProcedure ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,'                '
,'                '
); if (item.model.preparingForProcedure !== null && item.model.preparingForProcedure !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-prepare" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Preparing for the procedure</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Preparing for the treatment</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Preparing for the test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                            '
,'                            '
); if (item.model.language === 'French' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Se pr&#233;parer &#224; l&#8217;intervention</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Se pr&#233;parer au traitement</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Se pr&#233;parer au test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-prepare" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-prepare" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.preparingForProcedure ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.procedure !== null && item.model.procedure !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-procedure" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Procedure</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Treatment</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">L&#8217;intervention</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Traitement</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-procedure" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-procedure" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.procedure ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,''
); if (item.model.procedureAddInfo !== null && item.model.procedureAddInfo !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-procedureAddInfo" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">More information about the procedure</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">More information about the treatment</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">More information about the test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                                   '
); if (item.model.language === 'French' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Autres renseignements sur l&#8217;intervention</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Autres renseignements sur le traitement</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Plus de renseignements sur le test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-procedureAddInfo" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-procedureAddInfo" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.procedureAddInfo ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,' '
,'                    '
); if (item.model.postProcedure !== null && item.model.postProcedure !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-post" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">After the procedure</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">After the treatment</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">After the test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                                   '
); if (item.model.language === 'French' && item.model.language !== "") {ms_outHtml.push(''
); if (item.model.healthCategory === 'Procedures') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Apr&#232;s l&#8217;intervention</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Drug treatment' || item.model.healthCategory === 'Non-drug treatment') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Apr&#232;s le traitement</span>'); } ms_outHtml.push(''
); if (item.model.healthCategory === 'Tests') {ms_outHtml.push('   '
,'                                    <span class="panel-heading-collapsable">Apr&#232;s le test</span>'); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-post" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-post" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.postProcedure ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
); if (item.model.complications !== null && item.model.complications !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-complications" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Complications</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Complications</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-complications" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-complications" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.complications ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,'                '
); if (item.model.helpChild !== null && item.model.helpChild !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-helpChild" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Helping your child</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Aider votre enfant </span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-helpChild" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-helpChild" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.helpChild ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
); if (item.model.followUp !== null && item.model.followUp !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-followUp" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Follow-up care</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Soins de suivi</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-followUp" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-followUp" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.followUp ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
); if (item.model.whenToSeekMedicalAttention !== null && item.model.whenToSeekMedicalAttention !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-seek-medical" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">When to seek medical attention</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Quand rechercher une aide m&#233;dicale</span>'); } ms_outHtml.push(''
,'                            '
,'                            <span href="#article-seek-medical" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-seek-medical" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.whenToSeekMedicalAttention ,''
,'                        </div>'
,'                    </div>'
);
       }            
ms_outHtml.push(''
,'                '
); if (item.model.atSickkids !== null && item.model.atSickkids !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-at" tabindex="0">'
); if (item.model.language !== 'French' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">At SickKids</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">&#192; l&#8217;h&#244;pital SickKids</span>'); } ms_outHtml.push(''
,''
,'                            <span href="#article-at" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-at" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.atSickkids ,''
,'                        </div>'
,'                    </div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.resources !== null && item.model.resources !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-resources" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Resources</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">Ressources</span>'); } ms_outHtml.push(''
,''
,'                            <span href="#article-resources" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-resources" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.resources ,''
,'                        </div>'
,'                    </div>'
);
       }
ms_outHtml.push(''
,''
,''
); if (item.model.references !== null && item.model.references !== "") {
ms_outHtml.push(''
,'                    <div class="panel">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-references" tabindex="0">'
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">References</span>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                                   <span class="panel-heading-collapsable">R&#233;f&#233;rences</span>'); } ms_outHtml.push(''
,''
,'                            <span href="#article-references" class="pull-right panel-heading-collapsable-icon">'
,'                                <i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div id="article-references" class="panel-body collapse out" style="display: none;">'
,'                                ', item.model.references ,''
,'                        </div>'
,'                    </div>'
);
       }
ms_outHtml.push(''
); if (item.model.internalCategory === "Drug A-Z") { ms_outHtml.push(''
); if (item.model.language === 'English' && item.model.language !== "") {ms_outHtml.push(''
,'                            <div class="panel">'
,'                                <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-overdose" tabindex="0">'
,'                                    <span class="panel-heading-collapsable">Overdose information</span>'
,'                                    <span href="#article-overdose" class="pull-right panel-heading-collapsable-icon">'
,'                                        <i class="mdi mdi-chevron-down"></i></span>'
,'                                </div>'
,'                                <div id="article-overdose" class="panel-body collapse out" style="display: none;">'
); if (item.model.AKHDrugOverdoseOverride === null || item.model.AKHDrugOverdoseOverride === "") {ms_outHtml.push(''
,'                                        <p>Keep <span class="akh-lowercase"> ', item.model.akhDrugName ,'</span> out of your child\'s sight and reach and locked up in a safe place. If your child takes too much <span class="akh-lowercase"> ', item.model.akhDrugName ,'</span>, call the Ontario Poison Centre at one of these numbers. These calls are free.</p>'
,'                                        <ul>'
,'                                            <li>Call 416-813-5900 if you live in Toronto.</li>'
,'                                            <li>Call 1-800-268-9017 if you live somewhere else in Ontario.</li>'
,'                                            <li>If you live outside of Ontario, call your local Poison Information Centre.</li>'
,'                                        </ul>'
); } ms_outHtml.push(''
); if (item.model.AKHDrugOverdoseOverride !== null && item.model.AKHDrugOverdoseOverride !== "") {ms_outHtml.push(''
,'                                        ', item.model.AKHDrugOverdoseOverride ,''
); } ms_outHtml.push(''
,'                                </div>'
,''
,'                            </div>'
,'                            <div class="drug-disclaimer">'
,'                                <p><strong>Disclaimer</strong>: The information in this Family Med-aid is accurate at the time of printing. It provides a summary of information about <span class="akh-lowercase"> ', item.model.akhDrugName ,'</span> and does not contain all possible information about this medicine. Not all side effects are listed. If you have any questions or want more information about <span class="akh-lowercase"> ', item.model.akhDrugName ,'</span>, speak to your healthcare provider.</p>'
,'                            </div>'
); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") {ms_outHtml.push(''
,'                            <div class="panel">'
,'                                <div class="panel-heading clickable rs_preserve panel-collapsed" aria-controls="article-overdose" tabindex="0">'
,'                                    <span class="panel-heading-collapsable">Informations sur le surdosage</span>'
,'                                    <span href="#article-resources" class="pull-right panel-heading-collapsable-icon"><i class="mdi mdi-chevron-down"></i></span>'
,'                                </div>'
,'                                <div id="article-overdose" class="panel-body collapse out" style="display: none;">'
,'                                    <p>Gardez le <span class="akh-lowercase"> ', item.model.akhDrugName ,'</span> hors de la vue et de la port&#233;e de votre enfant. Conservez-le sous cl&#233; dans un endroit s&#233;curitaire. Si votre enfant ing&#232;re trop de<span class="akh-lowercase"> ', item.model.akhDrugName ,'</span>, t&#233;l&#233;phonez au Centre Anti-Poison de l\'Ontario &#224; l\'un des num&#233;ros suivants. Ces appels sont gratuits.</p>'
,'                                    <ul>'
,'                                        <li>Composez le 416-813-5900 si vous habitez &#224; Toronto.</li>'
,'                                        <li>Composez le 1-800-268-9017 si vous habitez ailleurs en Ontario.</li>'
,'                                        <li>Si vous habitez &#224; l\'ext&#233;rieur de l\'Ontario, t&#233;l&#233;phonez &#224; votre centre anti-poison local.</li>'
,'                                    </ul>'
,'                                </div>'
,'                            </div>'
,'                            <div class="drug-disclaimer">'
,'                                <p><strong>Avertissement</strong>: Les renseignements pr&#233;sent&#233;s dans le pr&#233;sent document d\'aide m&#233;dicale destin&#233; aux familles sont exacts au moment de l\'impression. Le pr&#233;sent document est un r&#233;sum&#233; des renseignements sur le <span class="akh-lowercase"> ', item.model.akhDrugName ,'</span>; il ne contient pas tous les renseignements associ&#233;s &#224; ce m&#233;dicament. Certains effets secondaires ne sont pas indiqu&#233;s. Si vous avez des questions ou d&#233;sirez obtenir plus de renseignements sur le <span class="akh-lowercase"> ', item.model.akhDrugName ,'</span>, consultez votre fournisseur de soins de sant&#233;.</p>'
,'                            </div>'
); } ms_outHtml.push(''
); } ms_outHtml.push(''
,'                        '
,'                </section>'
,'                '
); if (item.model.facebook !== null && item.model.facebook !== "") {
ms_outHtml.push(''
,'                    <div class="panel panel-info akh-no-seo">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed">'
,'                            <span class="panel-heading-collapsable">Facebook</span>'
,'                            <span class="pull-right panel-heading-collapsable-icon"><i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div class="panel-body" style="display: none;">'
,'                            ', item.model.facebook ,''
,'                        </div>'
,'                    </div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.twitter !== null && item.model.twitter !== "") {
ms_outHtml.push(''
,'                    <div class="panel panel-info akh-no-seo">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed">'
,'                            <span class="panel-heading-collapsable">Twitter</span>'
,'                            <span class="pull-right panel-heading-collapsable-icon"><i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div class="panel-body" style="display: none;">'
,'                            ', item.model.twitter ,''
,'                        </div>'
,'                    </div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.linkedin !== null && item.model.linkedin !== "") {
ms_outHtml.push(''
,'                    <div class="panel panel-info akh-no-seo">'
,'                        <div class="panel-heading clickable rs_preserve panel-collapsed">'
,'                            <span class="panel-heading-collapsable">Pinterest</span>'
,'                            <span class="pull-right panel-heading-collapsable-icon"><i class="mdi mdi-chevron-down"></i></span>'
,'                        </div>'
,'                        <div class="panel-body" style="display: none;">'
,'                            ', item.model.linkedin ,''
,'                        </div>'
,'                    </div>'
);
       }
ms_outHtml.push(''
,'                    <div id="article-metadata" class="panel-default akh-no-seo">'
,'                        <div class="list-group">'
); if (item.model.healthSpecialty !== null && item.model.healthSpecialty !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-heart-pulse mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Health Specialty</strong></h4>'
,'                                    <h4 class="list-group-item-text">', item.model.healthSpecialty ,'</h4>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.agesStages !== null && item.model.agesStages !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-baby-buggy mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Ages And Stages</strong></h4>'
,'                                    <div>'
); $.each(item.model.agesStages, function(index, value) { ms_outHtml.push(''
,'                                        <span class="badge list-group-item-text">', value ,'</span>'
);
       })
ms_outHtml.push(''
,'                                    </div>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.bodyParts !== null && item.model.bodyParts !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-human-greeting mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Body Parts</strong></h4>'
,'                                    <div>'
); $.each(item.model.bodyParts, function(index, value) {ms_outHtml.push(''
,'                                        <span class="badge list-group-item-text">', value ,'</span>'
);
       })
ms_outHtml.push(''
,'                                    </div>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.healthCategory !== null && item.model.healthCategory !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-filter mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading">Health Category</h4>'
,'                                    <h4 class="list-group-item-text">', item.model.healthCategory ,'</h4>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.targetAudience !== null && item.model.targetAudience !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-human-male-female mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Target Audience</strong></h4>'
,'                                    <h4 class="list-group-item-text">', item.model.targetAudience ,'</h4>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.symptoms !== null && item.model.symptoms !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-heart-broken mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Symptoms</strong></h4>'
,''
); $.each(item.model.symptoms, function(index, value) {ms_outHtml.push(''
,'                                    <span class="badge list-group-item-text">', value ,'</span>'
);
       })
ms_outHtml.push(''
,''
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.sme !== null && item.model.sme !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-seat-recline-normal mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>SME</strong></h4>'
,''
); $.each(item.model.sme, function(index, value) {ms_outHtml.push(''
,'                                    <span class="badge list-group-item-text">', value ,'</span>'
);
       })
ms_outHtml.push(''
,''
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.editor !== null && item.model.editor !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-account-check mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Editor</strong></h4>'
,'                                    <h4 class="list-group-item-text">', item.model.editor ,'</h4>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.comments !== null && item.model.comments !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-message-bulleted mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Comments</strong></h4>'
,'                                    <h4 class="list-group-item-text">', item.model.comments ,'</h4>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.readingLevel1 !== null && item.model.readingLevel1 !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-message-text mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Reading Level 1</strong></h4>'
,'                                    <span class="badge list-group-item-text">', item.model.readingLevel1 ,'</span>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.readingLevel2 !== null && item.model.readingLevel2 !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-message-text mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Reading Level 2</strong></h4>'
,'                                    <span class="badge list-group-item-text">', item.model.readingLevel2 ,'</span>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.wordCount !== null && item.model.wordCount !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-numeric mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Word Count</strong></h4>'
,'                                    <span class="badge list-group-item-text">', item.model.wordCount ,'</span>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,''
); if (item.model.reviewDate !== null && item.model.reviewDate !== "") {
ms_outHtml.push(''
,'                            <div class="list-group-item">'
,'                                <div class="row-action-primary">'
,'                                    <i class="mdi mdi-read mdi-24px"></i>'
,'                                </div>'
,'                                <div class="row-content">'
,'                                    <h4 class="list-group-item-heading"><strong>Last updated</strong></h4>'
,'                                    <h4 class="list-group-item-text">', item.model.reviewDate ,'</h4>'
,'                                </div>'
,'                            </div>'
,'                            <div class="list-group-separator"></div>'
);
       }
ms_outHtml.push(''
,'                        </div>'
,'                    </div>'
,'                    <!-- panel footer -->'
,'                    <!--MS:<SharePoint:SPSecurityTrimmedControl runat="server" PermissionsString="ManagePermissions">-->'
,'                    <div id="debug-panel" class="panel panel-default akh-no-seo">'
,'                        <div class="panel-heading">'
,'                            <span>Debug</span>'
,'                        </div>'
,'                        <div class="panel-body">'
,'                            <span>ctx.CurrentItem</span>'
,'                            <pre>'
,'                        <code>'
,'                            ', $htmlEncode(JSON.stringify(ctx.CurrentItem, undefined, 4)) ,''
,'                        </code>'
,'                      </pre>'
,'                            <span>item</span>'
,'                            <pre>'
,'                        <code>'
,'                            ', $htmlEncode(JSON.stringify(item, undefined, 4)) ,''
,'                        </code>'
,'                      </pre>'
,'                        </div>'
,'                    </div>'
,'                    <!--ME:</SharePoint:SPSecurityTrimmedControl>-->'
); if (item.model.language !== 'French' && item.model.language !== "") {ms_outHtml.push(''
,'                            <small id="review-date" class="pull-left">Last updated: ', item.model.reviewDate ,'</small>'); } ms_outHtml.push(''
); if (item.model.language === 'French' && item.model.language !== "") { ms_outHtml.push(''
,'                            <small id="review-date" class="pull-left">Derni&#232;res mises &#224; jour: ', item.model.reviewDate ,'</small>'); } ms_outHtml.push(''
,''
); if (item.model.language === 'Arabic' || item.model.language === 'Urdu') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push(''
); if (item.model.language !== 'Arabic' || item.model.language !== 'Urdu') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push(''
,'			'
); if (item.model.language === 'English') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push(''
); if (item.model.language === 'French') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push(''
); if (item.model.language === 'ChineseTraditional') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push(''
); if (item.model.language === 'ChineseSimplified') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push('  '
); if (item.model.language === 'Portuguese') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push(' '
); if (item.model.language === 'Spanish') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push('  '
); if (item.model.language === 'Urdu') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push(''
); if (item.model.language === 'Tamil') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push('   '
); if (item.model.language === 'Arabic') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push('   '
); if (item.model.language === 'Punjabi') {ms_outHtml.push(''
,'			</div>'
); } ms_outHtml.push('  '
,'			</article>'
,'			'
,'			<section id="learning-hub-links">'
,'                   <ul class="pager">'
,''
,'                    </ul>'
,'                </section>'
,'    '
);

  ctx['ItemValues'] = cachePreviousItemValuesFunction;
  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_6301aa519fe44a3a9f4add67038b38c4() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Item_AKH-Article", DisplayTemplate_6301aa519fe44a3a9f4add67038b38c4);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_AKH-Article.js", DisplayTemplate_6301aa519fe44a3a9f4add67038b38c4);
}
//
        $includeLanguageScript("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_AKH-Article.js", "~sitecollection/_catalogs/masterpage/Display Templates/Language Files/{Locale}/CustomStrings.js");
        
    //
}
RegisterTemplate_6301aa519fe44a3a9f4add67038b38c4();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fItem_AKH-Article.js"), RegisterTemplate_6301aa519fe44a3a9f4add67038b38c4);
}