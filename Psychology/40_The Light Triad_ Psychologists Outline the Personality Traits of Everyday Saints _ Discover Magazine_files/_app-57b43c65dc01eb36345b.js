_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[8],{5:function(e,t,n){n("74v/"),e.exports=n("nOHt")},"74v/":function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return n("hUgY")}])},WRJ3:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.Normalize=t.normalize=void 0;var o=n("vOnD"),r=(0,o.css)(['html{line-height:1.15;-webkit-text-size-adjust:100%;}body{margin:0;}main{display:block;}h1{font-size:2em;margin:0.67em 0;}hr{box-sizing:content-box;height:0;overflow:visible;}pre{font-family:monospace,monospace;font-size:1em;}a{background-color:transparent;}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted;}b,strong{font-weight:bolder;}code,kbd,samp{font-family:monospace,monospace;font-size:1em;}small{font-size:80%;}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline;}sub{bottom:-0.25em;}sup{top:-0.5em;}img{border-style:none;}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;}button,input{overflow:visible;}button,select{text-transform:none;}button,[type="button"],[type="reset"],[type="submit"]{-webkit-appearance:button;}button::-moz-focus-inner,[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner{border-style:none;padding:0;}button:-moz-focusring,[type="button"]:-moz-focusring,[type="reset"]:-moz-focusring,[type="submit"]:-moz-focusring{outline:1px dotted ButtonText;}fieldset{padding:0.35em 0.75em 0.625em;}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal;}progress{vertical-align:baseline;}textarea{overflow:auto;}[type="checkbox"],[type="radio"]{box-sizing:border-box;padding:0;}[type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button{height:auto;}[type="search"]{-webkit-appearance:textfield;outline-offset:-2px;}[type="search"]::-webkit-search-decoration{-webkit-appearance:none;}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit;}details{display:block;}summary{display:list-item;}template{display:none;}[hidden]{display:none;}']);t.normalize=r;var i=(0,o.createGlobalStyle)(r);t.Normalize=i;var a=r;t.default=a},hUgY:function(e,t,n){"use strict";n.r(t);var o=n("nKUr"),r=n("rePB"),i=n("g4pe"),a=n.n(i),s=n("WeT4"),l=n("sqT6"),c={dark:"hsl(83, 29%, 38%)",light:"hsl(82, 26%, 70%)"},b={dark:"hsl(35, 59%, 38%)",light:"hsl(46, 71%, 58%)"},p={dark:"hsl(186, 39%, 38%)",light:"hsl(185, 43%, 64%)"},d={dark:"hsl(4, 68%, 52%)",light:"hsl(4, 68%, 68%)"},h={0:"hsl(0, 0%, 0%)",45:"hsl(192, 2%, 45%)",70:"hsl(84, 3%, 70%)",100:"hsl(0, 0%, 100%)"},m={primary:{base:h[100],contrast:h[0],accent:d.dark},secondary:{base:b.light,contrast:h[0],accent:p.dark},tertiary:{base:h[0],contrast:h[100],accent:b.light},gray:{0:"hsl(0, 0%, 0%)",13:"hsl(0, 0%, 13%)",26:"hsl(0, 0%, 26%)",38:"hsl(0, 0%, 38%)",46:"hsl(0, 0%, 46%)",67:"hsl(0, 0%, 67%)",74:"hsl(0, 0%, 74%)",84:"hsl(0, 0%, 84%)",90:"hsl(0, 0%, 90%)",94:"hsl(0, 0%, 94%)",100:"hsl(0, 0%, 100%)"},gradients:{diagonalGray:"repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0) 0px, #bdbdbd 1px, #bdbdbd 1px, rgba(0, 0, 0, 0) 2px, rgba(0, 0, 0, 0) 3px)"},status:{success:c.dark,successInverted:c.light,warn:b.dark,warnInverted:b.light,fail:d.dark,failInverted:d.light},category:{health:"hsl(204, 70%, 42%)",mind:"hsl(30, 100%, 35%)",technology:"hsl(78, 75%, 29%)","the-sciences":"hsl(209, 62%, 32%)","planet-earth":"hsl(156, 40%, 32%)",environment:"hsl(24, 49%, 46%)",podcasts:"hsl(195, 47%, 36%)",default:d.dark}},u={serif:{familyOnly:"Martel",family:'"Martel", serif',weight:{regular:"400",semiBold:"600",bold:"700"},size:{normal:16}},sans:{familyOnly:"Nunito Sans",family:'"Nunito Sans", sans-serif',weight:{regular:"400",semiBold:"600",bold:"700"},size:{normal:16},spacing:{slim:"0.05em",wide:"0.1em"}},title:{familyOnly:"Fjalla One",family:'"Fjalla One", sans-serif',weight:{regular:"400",bold:"500"},size:{normal:16},spacing:{wide:"0.1em"}}},f=n("h4VS"),g=n("vOnD"),y=n("WRJ3");function x(){var e=Object(f.a)(["\n\t","\n\n\thtml {\n\t\tbox-sizing: border-box;\n\t}\n\n\t*, *::before, *::after {\n\t\tbox-sizing: inherit;\n\t}\n\n\ta {\n\t\ttext-decoration: none;\n\t}\n\n\tbody {\n\t\tmargin: 0;\n\n\t\tfont-family: ",";\n\t\tfont-size: ","px;\n\n\t\tcolor: ",";\n\t\tbackground-color: ",";\n\t}\n"]);return x=function(){return e},e}var j={baseFont:u.sans,baseColor:m.primary},w={theme:{color:m,font:u,global:j,misc:{zIndex:{meterBanner:1e3,backdrop:1100,paywallPrompt:1200,slideoutNav:1300,modal:1400}},responsive:{breakpoints:{xs:"1px",sm:"576px",md:"808px",lg:"992px",xl:"1200px"}}},GlobalStyle:Object(g.createGlobalStyle)(x(),y.normalize,j.baseFont.family,j.baseFont.size.normal,j.baseColor.contrast,j.baseColor.base)},O=n("8A8B");function k(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function v(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?k(Object(n),!0).forEach((function(t){Object(r.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):k(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}t.default=function(e){var t=e.Component,n=e.pageProps,r=Object(O.d)(w.theme.font);return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsxs)(a.a,{children:[Object(o.jsx)("meta",{name:"viewport",content:"minimum-scale=1, initial-scale=1, width=device-width"},"viewport"),Object(o.jsx)("link",{rel:"preconnect",href:"https://fonts.gstatic.com"},"pre-google-fonts"),Object(o.jsx)("link",{rel:"preload",as:"style",href:r}),Object(o.jsx)("link",{href:r,rel:"stylesheet"},"google-fonts")]}),Object(o.jsx)(s.k,{}),Object(o.jsx)(w.GlobalStyle,{}),Object(o.jsx)(l.a,{children:Object(o.jsx)(l.e,{children:Object(o.jsx)(l.d,{theme:w.theme,children:Object(o.jsx)(t,v({},n))})})})]})}}},[[5,1,2,0]]]);
//# sourceMappingURL=_app-57b43c65dc01eb36345b.js.map