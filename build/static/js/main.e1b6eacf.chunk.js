(this["webpackJsonprpi-weatherstation-web"]=this["webpackJsonprpi-weatherstation-web"]||[]).push([[0],{17:function(e,t,a){},18:function(e,t,a){"use strict";a.r(t);var n=a(1),s=a.n(n),r=a(8),i=a.n(r),l=a(7),c=a.n(l),o=a(9),d=a(2),m=a(3),j=a(5),u=a(4),h=a(10),x=a.n(h),v=a.p+"static/media/temperature.dbd23c95.png",b=a.p+"static/media/humidity.e43dd600.png",p=a(0),O={margin:"1% 0.5% 1% 0.5%",backgroundColor:"orange",overflow:"hidden",width:"99%",borderRadius:"15px",textAlign:"center"};function y(){return"["+(new Date).getHours()+":"+(new Date).getMinutes()+":"+(new Date).getSeconds()+"] "}function g(){return Object(p.jsx)(p.Fragment,{children:Object(p.jsx)("div",{className:"headerRow",children:Object(p.jsx)("div",{className:"text",children:"Raspberry Pi weather station - Webinterface"})})})}var f="",A="",T="",J="";function q(){return Object(p.jsxs)(p.Fragment,{children:[Object(p.jsx)(g,{}),Object(p.jsx)("hr",{className:"spacer"}),Object(p.jsx)("div",{className:"headerRow2",children:Object(p.jsxs)("div",{className:"liveDataHolder",children:[Object(p.jsx)("div",{className:"liveBox",children:Object(p.jsxs)("div",{className:"liveText",id:"curTim",children:["Livedata (",J,"):"]})}),Object(p.jsx)("div",{className:"liveBox",children:Object(p.jsxs)("div",{className:"liveText",id:"curTem",children:[Object(p.jsx)("img",{className:"dataIcon",src:v,alt:"nothing works"})," ",f," \xb0C"]})}),Object(p.jsx)("div",{className:"liveBox",children:Object(p.jsxs)("div",{className:"liveText",id:"curPre",children:[Object(p.jsx)("img",{className:"dataIcon",src:"data:image/png;base64,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",alt:"nothing works"})," ",A," hPa"]})}),Object(p.jsx)("div",{className:"liveBox",children:Object(p.jsxs)("div",{className:"liveText",id:"curHum",children:[Object(p.jsx)("img",{className:"dataIcon",src:b,alt:"nothing works"})," ",T," %"]})})]})})]})}var Z=function(e){Object(j.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).PasteLiveValues=function(e){var t=e[0].data;1e3===e[0].status&&(J=t[0],f=t[1],T=t[2],A=t[3],n.setState({headerContent:Object(p.jsx)(q,{})}))},n.RequestLiveValues=function(e){var t=new XMLHttpRequest;t.open("GET","http://192.168.8.49:8001/"),t.onload=function(){e(JSON.parse(t.response)),console.log(y()+"inserted livedata from weather station")},t.onerror=function(){console.log(y()+"weather station unreachable")},t.send()},n.ReloadRequest=function(){console.log(y()+"refreshing livedata"),n.setState({headerContent:Object(p.jsx)(g,{})}),n.RequestLiveValues(n.PasteLiveValues)},n.state={headerContent:Object(p.jsx)(g,{})},n}return Object(m.a)(a,[{key:"render",value:function(){return Object(p.jsx)(p.Fragment,{children:Object(p.jsx)("div",{style:O,onClick:this.ReloadRequest,children:this.state.headerContent})})}},{key:"componentDidMount",value:function(){console.log(y()+"requesting livedata"),this.RequestLiveValues(this.PasteLiveValues)}}]),a}(s.a.Component);function M(e){var t="selectValue"+e.number;return Object(p.jsxs)("select",{className:"selectmenu",id:t,children:[Object(p.jsx)("option",{value:"temperature",children:"Temperature"}),Object(p.jsx)("option",{value:"humidity",children:"Humidity"}),Object(p.jsx)("option",{value:"pressure",children:"Pressure"}),Object(p.jsx)("option",{value:"pm025",children:"PM2.5"}),Object(p.jsx)("option",{value:"pm100",children:"PM10"})]})}function V(){return Object(p.jsx)("div",{className:"loadingBase",children:Object(p.jsx)("div",{className:"loadingCore",children:Object(p.jsxs)("div",{children:[Object(p.jsx)("div",{}),Object(p.jsx)("div",{})]})})})}var G={temperature:["Temperature","Temperature in \xb0C"],humidity:["Humidity","Humidity in %"],pressure:["Pressure","Pressure in hPa"],pm025:["Particulate matter (2.5\xb5m)","Particulate matter (2.5\xb5m) in \xb5g/m\xb3"],pm100:["Particulate matter (10\xb5m)","Particulate matter (10\xb5m) in \xb5g/m\xb3"]},w={temperature:[2.5],humidity:[2.5],pressure:[1],pm025:[2.5],pm100:[2.5]};function R(e){document.getElementById("chartPanel").innerHTML=e}function N(){var e={};e.firstValue=document.getElementById("selectValue1").value,e.secondValue=document.getElementById("selectValue2").value,e.startDate=document.getElementById("startDate").value,e.startTime=document.getElementById("startTime").value,e.endDate=document.getElementById("endDate").value,e.endTime=document.getElementById("endTime").value;var t="Something went wrong, please check these values:\n";for(var a in e)if(e[a]){var n=e[a].split("-");a.includes("Time")?(2!==n.length&&(t+="- "+a+"\n"),n[0]<24&&n[1]<60||(t+="- "+a+"\n")):a.includes("Date")&&(3!==n.length&&(t+="- "+a+"\n"),2021===parseInt(n[0])&&n[1]<13&&n[2]<32||(t+="- "+a+"\n"))}else t+="- "+a+"\n";if("Something went wrong, please check these values:\n"===t){var s=e.startDate.replace("-","").replace("-",""),r=e.endDate.replace("-","").replace("-","");if(parseInt(s)<parseInt(r)||parseInt(s)===parseInt(r)){try{var i=function(){var e=new XMLHttpRequest;return e.open("GET","http://192.168.8.48:8000/datarange",!1),e.send(),JSON.parse(e.response)}()[0].files;if(-1===i.indexOf(e.startDate)||-1===i.indexOf(e.endDate))return void alert("The given timerange is unvalid - no data available")}catch(l){}return[e,[e.firstValue,e.secondValue]]}alert("The given dates are unvalid!")}else alert(t)}var k="Please select at least one value and a timerange.",P=function(e){Object(j.a)(a,e);var t=Object(u.a)(a);function a(e){var n;return Object(d.a)(this,a),(n=t.call(this,e)).handleLoading=Object(o.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("\n\n"+y()+"event triggered | initialized data visualization"),n.WSCore()&&n.setState({isVisible:!0}),n.setState({dataRequested:!0});case 4:case"end":return e.stop()}}),e)}))),n.ControlChartHandler=function(e,t,a){k="",n.setState({isVisible:!1}),console.log(y()+"inserting data to chart"),function(e,t,a){var n,s,r,i,l=[],c=[0,1],o=[],d=0,m=0;for(var j in e[0].data.dataValue1){var u=e[0].data.dataValue1[j];l.push(u),0!==d&&0!==m||(d=u,m=u),d>u&&(d=u),m<u&&(m=u)}if(n=d-w[t][0],s=m+w[t][0],n<0&&(n=0),d=0,m=0,t!==a)for(var h in c=[],e[0].data.dataValue2){var v=e[0].data.dataValue2[h];c.push(v),0!==d&&0!==m||(d=v,m=v),d>v&&(d=v),m<v&&(m=v)}r=d-w[a][0],i=m+w[a][0],r<0&&(r=0),d=0,m=0;var b={opposite:!0,title:{text:G[a][1]},decimalsInFloat:2,min:r,max:i},p={name:G[a][1],data:c},O=e[0].status;if(1e4===O){var y={chart:{type:"line"},series:[{name:G[t][1],data:l}],stroke:{curve:"smooth"},xaxis:{categories:o,tickAmount:13,tickPlacement:"on"},yaxis:[{title:{text:G[t][1]},decimalsInFloat:2,min:n,max:s}]};for(var g in t!==a&&(y.yaxis.push(b),y.series.push(p)),e[0].data.dataValue1){var f=g.split("_")[0].replace("-",".").replace("-","."),A=g.split("_")[1].replace("-",":");o.push(f+" - "+A)}new x.a(document.getElementById("chartPanel"),y).render()}else R("Something went wrong. Error: "+O)}(e,t,a),console.log(y()+"datavisualization finished")},n.RequestData=function(e,t,a,n){var s=new XMLHttpRequest;s.open("GET","http://192.168.8.48:8000/request/"+e),s.onload=function(){console.log(y()+"request completed"),t(JSON.parse(s.response),n[0],n[1])},s.onerror=function(){a("An error occured: unable to reach backendserver")},s.send()},n.WSCore=function(){console.log(y()+"collecting and validating input");var e=N();if(!e)return console.log(y()+"input invalid - returning"),!1;console.log(y()+"finished"),console.log(y()+"preparing HTTP path");var t=function(e){var t="";for(var a in e)t+=e[a]+"_";return t.slice(0,-1)}(e[0]);return console.log(y()+"finished"),console.log(y()+"requesting data from backend"),n.RequestData(t,n.ControlChartHandler,R,e[1]),!0},n.state={isVisible:!1,dataRequested:!1},n}return Object(m.a)(a,[{key:"render",value:function(){var e;return e=this.state.isVisible?Object(p.jsx)("div",{id:"chartPanel",className:"chartPanel",children:Object(p.jsx)(V,{})}):Object(p.jsx)("div",{id:"chartPanel",className:"chartPanel",children:k}),Object(p.jsxs)(p.Fragment,{children:[Object(p.jsxs)("div",{style:O,children:[Object(p.jsx)("div",{className:"sbox",children:Object(p.jsxs)("div",{className:"text",children:[Object(p.jsx)("label",{htmlFor:"fv",children:"First value:"}),Object(p.jsx)(M,{number:"1"})]})}),Object(p.jsx)("div",{className:"sbox",children:Object(p.jsxs)("div",{className:"text",children:[Object(p.jsx)("label",{htmlFor:"sv",children:"Second value:"}),Object(p.jsx)(M,{number:"2"})]})}),Object(p.jsx)("div",{className:"sbox",children:Object(p.jsxs)("div",{className:"text",children:[Object(p.jsx)("label",{htmlFor:"startDate",children:"Start date:"}),Object(p.jsx)("input",{type:"text",name:"startDate",className:"timeField",id:"startDate",placeholder:"yyyy-mm-dd"})]})}),Object(p.jsx)("div",{className:"sbox",children:Object(p.jsxs)("div",{className:"text",children:[Object(p.jsx)("label",{htmlFor:"startTime",children:"Start time:"}),Object(p.jsx)("input",{type:"text",name:"startTime",className:"timeField",id:"startTime",placeholder:"hh-mm"})]})}),Object(p.jsx)("div",{className:"sbox",children:Object(p.jsxs)("div",{className:"text",children:[Object(p.jsx)("label",{htmlFor:"endDate",children:"End date:"}),Object(p.jsx)("input",{type:"text",name:"endDate",className:"timeField",id:"endDate",placeholder:"yyyy-mm-dd"})]})}),Object(p.jsx)("div",{className:"sbox",children:Object(p.jsxs)("div",{className:"text",children:[Object(p.jsx)("label",{htmlFor:"endTime",children:"End time:"}),Object(p.jsx)("div",{className:"innerTextBox",children:Object(p.jsx)("input",{type:"text",name:"endTime",className:"timeField",id:"endTime",placeholder:"hh-mm"})})]})}),Object(p.jsx)("div",{className:"genButton",children:Object(p.jsx)("div",{className:"text",id:"buttonField",children:Object(p.jsx)("input",{id:"ggraph",type:"button",value:"Generate graph",onClick:this.handleLoading})})})]}),Object(p.jsx)("div",{style:O,children:e})]})}},{key:"componentDidUpdate",value:function(){this.state.dataRequested&&this.setState({dataRequested:!1})}}]),a}(s.a.Component),Y=function(e){Object(j.a)(a,e);var t=Object(u.a)(a);function a(){return Object(d.a)(this,a),t.apply(this,arguments)}return Object(m.a)(a,[{key:"render",value:function(){return Object(p.jsxs)("div",{style:{backgroundColor:"white",marginLeft:"15%",marginRight:"15%",borderRadius:"15px",padding:"0.5%",overflow:"hidden"},children:[Object(p.jsx)(Z,{}),Object(p.jsx)(P,{}),Object(p.jsxs)("div",{className:"imprint",children:[Object(p.jsx)("a",{className:"imprint-link",href:"https://github.com/Zyzonix/",target:"_blank",rel:"noreferrer noopener",children:"Developed by ZyzonixDev in 2021"})," | ",Object(p.jsx)("a",{className:"imprint-link",href:"https://github.com/Zyzonix/rpi-weatherstation-web/",target:"_blank",rel:"noreferrer noopener",children:"Sourcecode"})]})]})}}]),a}(s.a.Component);a(17);var S=function(){return Object(n.useEffect)((function(){document.title="rpi-weatherstation-web"}),[]),Object(p.jsx)(Y,{})};i.a.render(Object(p.jsx)(s.a.StrictMode,{children:Object(p.jsx)(S,{})}),document.getElementById("root"))}},[[18,1,2]]]);
//# sourceMappingURL=main.e1b6eacf.chunk.js.map