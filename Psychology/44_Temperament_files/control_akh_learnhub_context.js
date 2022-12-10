/* This file is currently associated to an HTML file of the same name and is drawing content from it.  Until the files are disassociated, you will not be able to move, delete, rename, or make any other changes to this file. */

function DisplayTemplate_5bcc7f93f97d4321bc601f079d9ab2c2(ctx) {
  var ms_outHtml=[];
  var cachePreviousTemplateData = ctx['DisplayTemplateData'];
  ctx['DisplayTemplateData'] = new Object();
  DisplayTemplate_5bcc7f93f97d4321bc601f079d9ab2c2.DisplayTemplateData = ctx['DisplayTemplateData'];

  ctx['DisplayTemplateData']['TemplateUrl']='~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fControl_AKH_LearnHub_context.js';
  ctx['DisplayTemplateData']['TemplateType']='Control';
  ctx['DisplayTemplateData']['TargetControlType']=['Content Web Parts'];
  this.DisplayTemplateData = ctx['DisplayTemplateData'];

ms_outHtml.push('',''
,''
);

if (!$isNull(ctx.ClientControl) &&
    !$isNull(ctx.ClientControl.shouldRenderControl) &&
    !ctx.ClientControl.shouldRenderControl())
{
    return "";
}
ctx.ListDataJSONGroupsKey = "ResultTables";
var $noResults = Srch.ContentBySearch.getControlTemplateEncodedNoResultsMessage(ctx.ClientControl);
var noResultsClassName = "ms-srch-result-noResults";

//IFFY to create item to used in markup
var item = (function (context, containerId) {
    var internalItem = {
        encodedId: null,
        model: {},
        selectors: {},
        events: {
           
				
                
                

                
	            
            
        
        },
        init: function () {
            this.initSelectors().initModel().initEvents();
            return {
                model: this.model,
                selectors: this.selectors
            }
        },
        initModel: function () {
            return internalItem;
        },
        initSelectors: function()  {
            //create element ids
            this.encodedId = $htmlEncode(context.ClientControl.get_nextUniqueId() + containerId);
            this.selectors = {
                container: this.encodedId + "container"
            };
            return this;
        },
        initEvents: function () {
            context.OnPostRender = this.events.onPostRender;
            return this;
        }
    };
    return internalItem.init();
})(ctx, "_akh-article-container_");

ms_outHtml.push(''
,'    <div id="', item.selectors.container ,'">'
,'        ', ctx.RenderGroups(ctx) ,''
,'    </div>'
);
if (ctx.ClientControl.get_shouldShowNoResultMessage())
{
ms_outHtml.push(''
,'        <div class="', noResultsClassName ,'">', $noResults ,'</div>'
);
}
ms_outHtml.push(''
,''
);

  ctx['DisplayTemplateData'] = cachePreviousTemplateData;
  return ms_outHtml.join('');
}
function RegisterTemplate_5bcc7f93f97d4321bc601f079d9ab2c2() {

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("Contol_AKH-LandingPage-Container", DisplayTemplate_5bcc7f93f97d4321bc601f079d9ab2c2);
}

if ("undefined" != typeof (Srch) &&"undefined" != typeof (Srch.U) &&typeof(Srch.U.registerRenderTemplateByName) == "function") {
  Srch.U.registerRenderTemplateByName("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fControl_AKH_LearnHub_context.js", DisplayTemplate_5bcc7f93f97d4321bc601f079d9ab2c2);
}
//
        $includeLanguageScript("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fControl_AKH_LearnHub_context.js", "~sitecollection/_catalogs/masterpage/Display Templates/Language Files/{Locale}/CustomStrings.js");
    //
}
RegisterTemplate_5bcc7f93f97d4321bc601f079d9ab2c2();
if (typeof(RegisterModuleInit) == "function" && typeof(Srch.U.replaceUrlTokens) == "function") {
  RegisterModuleInit(Srch.U.replaceUrlTokens("~sitecollection\u002f_catalogs\u002fmasterpage\u002fakh\u002fDisplay Templates\u002fContent Web Parts\u002fControl_AKH_LearnHub_context.js"), RegisterTemplate_5bcc7f93f97d4321bc601f079d9ab2c2);
}