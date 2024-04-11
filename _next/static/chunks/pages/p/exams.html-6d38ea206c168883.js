(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[995],{8445:function(e,t,n){"use strict";n.d(t,{Z:function(){return Z}});var r=n(3366),a=n(7462),i=n(7294),o=n(6010),s=n(4780),c=n(5861),l=n(1657),u=n(948),d=n(1588),h=n(4867);function f(e){return(0,h.Z)("MuiCardHeader",e)}let x=(0,d.Z)("MuiCardHeader",["root","avatar","action","content","title","subheader"]);var p=n(5893);let m=["action","avatar","className","component","disableTypography","subheader","subheaderTypographyProps","title","titleTypographyProps"],v=e=>{let{classes:t}=e;return(0,s.Z)({root:["root"],avatar:["avatar"],action:["action"],content:["content"],title:["title"],subheader:["subheader"]},f,t)},y=(0,u.ZP)("div",{name:"MuiCardHeader",slot:"Root",overridesResolver:(e,t)=>(0,a.Z)({[`& .${x.title}`]:t.title,[`& .${x.subheader}`]:t.subheader},t.root)})({display:"flex",alignItems:"center",padding:16}),g=(0,u.ZP)("div",{name:"MuiCardHeader",slot:"Avatar",overridesResolver:(e,t)=>t.avatar})({display:"flex",flex:"0 0 auto",marginRight:16}),b=(0,u.ZP)("div",{name:"MuiCardHeader",slot:"Action",overridesResolver:(e,t)=>t.action})({flex:"0 0 auto",alignSelf:"flex-start",marginTop:-4,marginRight:-8,marginBottom:-4}),w=(0,u.ZP)("div",{name:"MuiCardHeader",slot:"Content",overridesResolver:(e,t)=>t.content})({flex:"1 1 auto"}),$=i.forwardRef(function(e,t){let n=(0,l.Z)({props:e,name:"MuiCardHeader"}),{action:i,avatar:s,className:u,component:d="div",disableTypography:h=!1,subheader:f,subheaderTypographyProps:x,title:$,titleTypographyProps:Z}=n,C=(0,r.Z)(n,m),j=(0,a.Z)({},n,{component:d,disableTypography:h}),S=v(j),M=$;null==M||M.type===c.Z||h||(M=(0,p.jsx)(c.Z,(0,a.Z)({variant:s?"body2":"h5",className:S.title,component:"span",display:"block"},Z,{children:M})));let k=f;return null==k||k.type===c.Z||h||(k=(0,p.jsx)(c.Z,(0,a.Z)({variant:s?"body2":"body1",className:S.subheader,color:"text.secondary",component:"span",display:"block"},x,{children:k}))),(0,p.jsxs)(y,(0,a.Z)({className:(0,o.Z)(S.root,u),as:d,ref:t,ownerState:j},C,{children:[s&&(0,p.jsx)(g,{className:S.avatar,ownerState:j,children:s}),(0,p.jsxs)(w,{className:S.content,ownerState:j,children:[M,k]}),i&&(0,p.jsx)(b,{className:S.action,ownerState:j,children:i})]}))});var Z=$},6485:function(e){function t(){return new DOMException("The request is not allowed","NotAllowedError")}async function n(e){if(!navigator.clipboard)throw t();return navigator.clipboard.writeText(e)}async function r(e){let n=document.createElement("span");n.textContent=e,n.style.whiteSpace="pre",n.style.webkitUserSelect="auto",n.style.userSelect="all",document.body.appendChild(n);let r=window.getSelection(),a=window.document.createRange();r.removeAllRanges(),a.selectNode(n),r.addRange(a);let i=!1;try{i=window.document.execCommand("copy")}finally{r.removeAllRanges(),window.document.body.removeChild(n)}if(!i)throw t()}async function a(e){try{await n(e)}catch(n){try{await r(e)}catch(e){throw e||n||t()}}}/*! clipboard-copy. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */e.exports=a},7484:function(e){var t,n,r,a,i,o,s,c,l,u,d,h,f,x,p,m,v,y,g,b,w,$;e.exports=(t="millisecond",n="second",r="minute",a="hour",i="week",o="month",s="quarter",c="year",l="date",u="Invalid Date",d=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,h=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,f=function(e,t,n){var r=String(e);return!r||r.length>=t?e:""+Array(t+1-r.length).join(n)+e},(p={})[x="en"]={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],n=e%100;return"["+e+(t[(n-20)%10]||t[n]||"th")+"]"}},m="$isDayjsObject",v=function(e){return e instanceof w||!(!e||!e[m])},y=function e(t,n,r){var a;if(!t)return x;if("string"==typeof t){var i=t.toLowerCase();p[i]&&(a=i),n&&(p[i]=n,a=i);var o=t.split("-");if(!a&&o.length>1)return e(o[0])}else{var s=t.name;p[s]=t,a=s}return!r&&a&&(x=a),a||!r&&x},g=function(e,t){if(v(e))return e.clone();var n="object"==typeof t?t:{};return n.date=e,n.args=arguments,new w(n)},(b={s:f,z:function(e){var t=-e.utcOffset(),n=Math.abs(t);return(t<=0?"+":"-")+f(Math.floor(n/60),2,"0")+":"+f(n%60,2,"0")},m:function e(t,n){if(t.date()<n.date())return-e(n,t);var r=12*(n.year()-t.year())+(n.month()-t.month()),a=t.clone().add(r,o),i=n-a<0,s=t.clone().add(r+(i?-1:1),o);return+(-(r+(n-a)/(i?a-s:s-a))||0)},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(e){return({M:o,y:c,w:i,d:"day",D:l,h:a,m:r,s:n,ms:t,Q:s})[e]||String(e||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}}).l=y,b.i=v,b.w=function(e,t){return g(e,{locale:t.$L,utc:t.$u,x:t.$x,$offset:t.$offset})},$=(w=function(){function e(e){this.$L=y(e.locale,null,!0),this.parse(e),this.$x=this.$x||e.x||{},this[m]=!0}var f=e.prototype;return f.parse=function(e){this.$d=function(e){var t=e.date,n=e.utc;if(null===t)return new Date(NaN);if(b.u(t))return new Date;if(t instanceof Date)return new Date(t);if("string"==typeof t&&!/Z$/i.test(t)){var r=t.match(d);if(r){var a=r[2]-1||0,i=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],a,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)):new Date(r[1],a,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)}}return new Date(t)}(e),this.init()},f.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},f.$utils=function(){return b},f.isValid=function(){return this.$d.toString()!==u},f.isSame=function(e,t){var n=g(e);return this.startOf(t)<=n&&n<=this.endOf(t)},f.isAfter=function(e,t){return g(e)<this.startOf(t)},f.isBefore=function(e,t){return this.endOf(t)<g(e)},f.$g=function(e,t,n){return b.u(e)?this[t]:this.set(n,e)},f.unix=function(){return Math.floor(this.valueOf()/1e3)},f.valueOf=function(){return this.$d.getTime()},f.startOf=function(e,t){var s=this,u=!!b.u(t)||t,d=b.p(e),h=function(e,t){var n=b.w(s.$u?Date.UTC(s.$y,t,e):new Date(s.$y,t,e),s);return u?n:n.endOf("day")},f=function(e,t){return b.w(s.toDate()[e].apply(s.toDate("s"),(u?[0,0,0,0]:[23,59,59,999]).slice(t)),s)},x=this.$W,p=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(d){case c:return u?h(1,0):h(31,11);case o:return u?h(1,p):h(0,p+1);case i:var y=this.$locale().weekStart||0,g=(x<y?x+7:x)-y;return h(u?m-g:m+(6-g),p);case"day":case l:return f(v+"Hours",0);case a:return f(v+"Minutes",1);case r:return f(v+"Seconds",2);case n:return f(v+"Milliseconds",3);default:return this.clone()}},f.endOf=function(e){return this.startOf(e,!1)},f.$set=function(e,i){var s,u=b.p(e),d="set"+(this.$u?"UTC":""),h=((s={}).day=d+"Date",s[l]=d+"Date",s[o]=d+"Month",s[c]=d+"FullYear",s[a]=d+"Hours",s[r]=d+"Minutes",s[n]=d+"Seconds",s[t]=d+"Milliseconds",s)[u],f="day"===u?this.$D+(i-this.$W):i;if(u===o||u===c){var x=this.clone().set(l,1);x.$d[h](f),x.init(),this.$d=x.set(l,Math.min(this.$D,x.daysInMonth())).$d}else h&&this.$d[h](f);return this.init(),this},f.set=function(e,t){return this.clone().$set(e,t)},f.get=function(e){return this[b.p(e)]()},f.add=function(e,t){var s,l=this;e=Number(e);var u=b.p(t),d=function(t){var n=g(l);return b.w(n.date(n.date()+Math.round(t*e)),l)};if(u===o)return this.set(o,this.$M+e);if(u===c)return this.set(c,this.$y+e);if("day"===u)return d(1);if(u===i)return d(7);var h=((s={})[r]=6e4,s[a]=36e5,s[n]=1e3,s)[u]||1,f=this.$d.getTime()+e*h;return b.w(f,this)},f.subtract=function(e,t){return this.add(-1*e,t)},f.format=function(e){var t=this,n=this.$locale();if(!this.isValid())return n.invalidDate||u;var r=e||"YYYY-MM-DDTHH:mm:ssZ",a=b.z(this),i=this.$H,o=this.$m,s=this.$M,c=n.weekdays,l=n.months,d=n.meridiem,f=function(e,n,a,i){return e&&(e[n]||e(t,r))||a[n].slice(0,i)},x=function(e){return b.s(i%12||12,e,"0")},p=d||function(e,t,n){var r=e<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(h,function(e,r){return r||function(e){switch(e){case"YY":return String(t.$y).slice(-2);case"YYYY":return b.s(t.$y,4,"0");case"M":return s+1;case"MM":return b.s(s+1,2,"0");case"MMM":return f(n.monthsShort,s,l,3);case"MMMM":return f(l,s);case"D":return t.$D;case"DD":return b.s(t.$D,2,"0");case"d":return String(t.$W);case"dd":return f(n.weekdaysMin,t.$W,c,2);case"ddd":return f(n.weekdaysShort,t.$W,c,3);case"dddd":return c[t.$W];case"H":return String(i);case"HH":return b.s(i,2,"0");case"h":return x(1);case"hh":return x(2);case"a":return p(i,o,!0);case"A":return p(i,o,!1);case"m":return String(o);case"mm":return b.s(o,2,"0");case"s":return String(t.$s);case"ss":return b.s(t.$s,2,"0");case"SSS":return b.s(t.$ms,3,"0");case"Z":return a}return null}(e)||a.replace(":","")})},f.utcOffset=function(){return-(15*Math.round(this.$d.getTimezoneOffset()/15))},f.diff=function(e,t,l){var u,d=this,h=b.p(t),f=g(e),x=(f.utcOffset()-this.utcOffset())*6e4,p=this-f,m=function(){return b.m(d,f)};switch(h){case c:u=m()/12;break;case o:u=m();break;case s:u=m()/3;break;case i:u=(p-x)/6048e5;break;case"day":u=(p-x)/864e5;break;case a:u=p/36e5;break;case r:u=p/6e4;break;case n:u=p/1e3;break;default:u=p}return l?u:b.a(u)},f.daysInMonth=function(){return this.endOf(o).$D},f.$locale=function(){return p[this.$L]},f.locale=function(e,t){if(!e)return this.$L;var n=this.clone(),r=y(e,t,!0);return r&&(n.$L=r),n},f.clone=function(){return b.w(this.$d,this)},f.toDate=function(){return new Date(this.valueOf())},f.toJSON=function(){return this.isValid()?this.toISOString():null},f.toISOString=function(){return this.$d.toISOString()},f.toString=function(){return this.$d.toUTCString()},e}()).prototype,g.prototype=$,[["$ms",t],["$s",n],["$m",r],["$H",a],["$W","day"],["$M",o],["$y",c],["$D",l]].forEach(function(e){$[e[1]]=function(t){return this.$g(t,e[0],e[1])}}),g.extend=function(e,t){return e.$i||(e(t,w,g),e.$i=!0),g},g.locale=y,g.isDayjs=v,g.unix=function(e){return g(1e3*e)},g.en=p[x],g.Ls=p,g.p={},g)},4969:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/p/exams.html",function(){return n(6453)}])},6316:function(e,t,n){"use strict";var r=n(7294),a=n(6485),i=n.n(a);let o=e=>e&&("TEXTAREA"===e.nodeName||"INPUT"===e.nodeName);t.Z=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=(0,r.useRef)(null),n=()=>{e.onSuccess&&e.onSuccess(),e.selectOnCopy&&o(t.current)&&t.current.select()},a=()=>{e.onError&&e.onError();let n=!1!==e.selectOnError;n&&o(t.current)&&t.current.select()},s=e=>{i()(e).then(n).catch(a)},c=(0,r.useCallback)(e=>{"string"==typeof e?s(e):t.current&&s(t.current.value)},[]);return{copy:c,target:t}}},6453:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return F}});var r=n(5893),a=n(7294),i=n(9770),o=n(1163),s=n(7274),c=n(6822),l=n(4267),u=n(8445),d=n(5861),h=n(3321),f=n(9878),x=n(8232),p=n(7109),m=n(1664),v=n.n(m);let y=e=>{let{parent:t="",goBack:n,onSearch:a,onChange:i}=e,o=()=>{i({title:"Th\xeam thư mục mới",parent:t,text:""})};return(0,r.jsxs)("div",{children:[(0,r.jsx)(u.Z,{title:(0,r.jsx)(d.Z,{variant:"h4",children:"QUẢN L\xdd ĐỀ THI"})}),(0,r.jsx)(l.Z,{children:(0,r.jsxs)(c.Z,{sx:{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"},children:[(0,r.jsx)(c.Z,{children:(0,r.jsx)(h.Z,{variant:"text",startIcon:(0,r.jsx)(f.Z,{icon:"tabler:chevron-left"}),color:"success",onClick:n,children:"Quay lại"})}),(0,r.jsxs)(c.Z,{children:[(0,r.jsx)(x.Z,{size:"small",sx:{mr:1},placeholder:"Nhập t\xean đề thi...",InputProps:{startAdornment:(0,r.jsx)(p.Z,{position:"start",children:(0,r.jsx)(f.Z,{icon:"tabler:search"})})},onChange:a}),(0,r.jsx)(h.Z,{variant:"tonal",endIcon:(0,r.jsx)(f.Z,{icon:"tabler:folder-plus"}),sx:{mr:1},onClick:o,children:"Tạo thư mục mới"}),(0,r.jsx)(h.Z,{variant:"contained",endIcon:(0,r.jsx)(f.Z,{icon:"tabler:clipboard-plus"}),component:v(),href:"/p/create.html?parent="+t,children:"TẠO ĐỀ MỚI"})]})]})}),(0,r.jsx)(c.Z,{sx:{position:"fixed",bottom:"2.5rem",right:"4.5rem",zIndex:1031},children:(0,r.jsx)(h.Z,{variant:"contained",startIcon:(0,r.jsx)(f.Z,{icon:"tabler:plus"}),component:v(),href:"/p/create.html?parent="+t,color:"error",sx:{boxShadow:"0 1px 20px 1px #EA5455!important",":hover":{boxShadow:"none!important"}},children:"TẠO ĐỀ MỚI"})})]})};var g=a.memo(y),b=n(4531),w=n(6316),$=n(410),Z=n(8885),C=n(9334),j=n(8333),S=n(8972),M=n(6455),k=n.n(M),D=n(5591),T=n(6501),O=n(7484),_=n.n(O);let H=[{flex:.25,minWidth:290,field:"title",headerName:"T\xcaN ĐỀ THI/THƯ MỤC",renderCell:e=>{let{row:t}=e;return(0,r.jsxs)(c.Z,{sx:{display:"flex",alignItems:"center"},children:["folder"==t.type?(0,r.jsx)($.Z,{sx:{mr:3,fontSize:".8rem",width:"2rem",height:"2rem"},src:t.cover,children:(0,r.jsx)(f.Z,{icon:"tabler:folder-filled"})}):(0,r.jsx)($.Z,{skin:"light",sx:{mr:3,fontSize:".8rem",width:"2rem",height:"2rem"},src:t.cover,children:(0,r.jsx)(f.Z,{icon:"tabler:clipboard"})}),(0,r.jsx)(d.Z,{noWrap:!0,variant:"body1",sx:{color:"text.primary",fontWeight:600},children:t.title})]})}},{flex:.25,minWidth:290,field:"updateAt",headerName:"CẬP NHẬT L\xdaC",renderCell:e=>{let{row:t}=e;return(0,r.jsx)(d.Z,{noWrap:!0,variant:"body2",sx:{color:"text.primary"},children:_()(t.updateAt||t.createAt).format("HH:mm DD/MM/YYYY")})}}],N=e=>{let{rows:t,onChange:n,onLoading:i}=e,c=(0,o.useRouter)(),l=(0,w.Z)(),[u,d]=(0,a.useState)({}),[h,x]=(0,a.useState)(null),p=e=>"folder"==e.type?c.push("?parent="+e.id):c.push("/p/create.html?parent=".concat(e.parent,"&id=").concat(e.id)),m=e=>()=>{switch(x(null),e){case"rename":n({...u,title:"Đổi t\xean thư mục",text:u.title});break;case"remove":k().fire({title:"X\xf3a thư mục ".concat(u.title,"?"),text:"Sau khi x\xf3a thư mục n\xe0y c\xe1c thư mục, đề thi b\xean trong thư mục sẽ được di chuyển th\xe0nh thư mục c\xf9ng cấp với thư mục hiện tại.",icon:"warning",showCancelButton:!0,confirmButtonText:"Đ\xfang. X\xf3a đi.",cancelButtonText:"Hủy"}).then(async e=>{if(e.isConfirmed){i(!0);let e=(await s.default.delete("/exams/"+u.id)).data;i(!1);let{error:t,message:n}=e||{};if(t)return k().fire({position:"top-end",icon:"error",title:t,showConfirmButton:!1,timer:1500});n&&((0,D.JG)(u.parent?"/exams/".concat(u.parent):"/exams",u,{revalidate:!1,populateCache:(e,t)=>{let n=t.filter(t=>t.id!==e.id);return[...n]}}),T.ZP.success(n,{duration:2e3}))}});break;case"copy":l.copy(u.url),T.ZP.success("Đ\xe3 sao ch\xe9p th\xe0nh c\xf4ng!",{duration:2e3});break;case"delete":k().fire({title:"X\xf3a đề thi ".concat(u.title,"?"),text:"Sau khi xo\xe1 đề thi n\xe0y. Bạn sẽ kh\xf4ng thể kh\xf4i phục n\xf3. H\xe3y c\xe2n nhắc lựa chọn n\xe0y.",icon:"warning",showCancelButton:!0,confirmButtonText:"Đ\xfang. X\xf3a đi.",cancelButtonText:"Hủy"}).then(async e=>{if(e.isConfirmed){i(!0);let e=(await s.default.delete("/quizs/".concat(u.id,"?parent=").concat(u.parent))).data;i(!1);let{error:t,message:n}=e||{};if(t)return k().fire({position:"top-end",icon:"error",title:t,showConfirmButton:!1,timer:1500});n&&((0,D.JG)(u.parent?"/exams/".concat(u.parent):"/exams",u,{revalidate:!1,populateCache:(e,t)=>{let n=t.filter(t=>t.id!==e.id);return[...n]}}),T.ZP.success(n,{duration:2e3}))}});break;case"leaderboard":case"statistic":case"realtime":case"create":c.push("/p/".concat(e,".html?parent=").concat(u.parent,"&id=").concat(u.id));break;case"view":let t=window.open(u.url,"_blank");t.focus()}},v={folder:[{text:"Chia sẻ",icon:"tabler:user-plus",onClick:m("share"),divider:!0},{text:"Đổi t\xean",icon:"tabler:pencil",onClick:m("rename")},{text:"X\xf3a",icon:"tabler:trash-filled",onClick:m("remove")}],quiz:[{text:"Xem đề thi",icon:"tabler:eye",onClick:m("view")},{text:"Sao ch\xe9p link",icon:"tabler:link",onClick:m("copy")},{text:"Chỉnh sửa",icon:"tabler:pencil-minus",onClick:m("create"),divider:!0},{text:"Bảng điểm",icon:"tabler:report-analytics",onClick:m("leaderboard")},{text:"Thống k\xea",icon:"tabler:chart-histogram",onClick:m("statistic")},{text:"Gi\xe1m s\xe1t thi",icon:"tabler:user-scan",onClick:m("realtime"),divider:!0},{text:"X\xf3a",icon:"tabler:trash-filled",onClick:m("delete")}]},y=e=>{e.preventDefault();var[n]=t.filter(t=>t.id==e.currentTarget.getAttribute("data-id"));d(n),x(null===h?{mouseX:e.clientX-2,mouseY:e.clientY-4}:null)};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(b._,{autoHeight:!0,rows:t,columns:H,initialState:{pagination:{paginationModel:{pageSize:15}}},pageSizeOptions:[15,25,50],slotProps:{row:{onContextMenu:y,style:{cursor:"context-menu"}}},disableRowSelectionOnClick:!0,onRowClick:e=>p(e.row)}),(0,r.jsx)(j.Z,{open:null!==h,onClose:e=>x(null),anchorReference:"anchorPosition",anchorPosition:null!==h?{top:h.mouseY,left:h.mouseX}:void 0,slotProps:{root:{onContextMenu:e=>{e.preventDefault(),x(null)}}},children:(v[u.type]||[]).map((e,t)=>(0,r.jsxs)(S.Z,{onClick:e.onClick,divider:e.divider,children:[(0,r.jsx)(Z.Z,{children:(0,r.jsx)(f.Z,{icon:e.icon,fontSize:16})}),(0,r.jsx)(C.Z,{primary:e.text})]},t))})]})};var I=n(948),R=n(9581),A=n(1425),P=n(3946),Y=n(8262),E=n(6628);let z=(0,I.ZP)(P.Z)(e=>{let{theme:t}=e;return{top:0,right:0,color:"grey.500",position:"absolute",boxShadow:t.shadows[2],transform:"translate(10px, -10px)",borderRadius:t.shape.borderRadius,backgroundColor:"".concat(t.palette.background.paper," !important"),transition:"transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out","&:hover":{transform:"translate(7px, -5px)"}}}),W=(0,a.forwardRef)(function(e,t){return(0,r.jsx)(E.Z,{ref:t,...e})}),L=e=>{let{popup:t,onChange:n,onLoading:i}=e,[o,l]=(0,a.useState)(t||{}),u=()=>{n(null)},p=async()=>{let{title:e,...n}=o;if(!n.text.trim()||n.text.trim()===t.text.trim())return;i(!0);let r=(await s.default.post("/exams",n)).data;if(i(!1),r.error)return k().fire({icon:"error",title:"Oops...",text:r.error});T.ZP.success("Cập nhật th\xe0nh c\xf4ng!",{duration:2e3}),(0,D.JG)(r.parent?"/exams/".concat(r.parent):"/exams",r,{revalidate:!1,populateCache:(e,t)=>{let n=[...t],r=t.findIndex(t=>t.id===e.id);return r>=0?n[r]=e:n.push(e),[...n]}}),u()};return(0,a.useEffect)(()=>{l(t||{})},[t]),(0,r.jsxs)(Y.Z,{fullWidth:!0,open:!!t,maxWidth:"sm",scroll:"body",TransitionComponent:W,sx:{"& .MuiDialog-paper":{overflow:"visible"}},children:[(0,r.jsxs)(R.Z,{sx:{pb:e=>"".concat(e.spacing(2)," !important"),px:e=>["".concat(e.spacing(5)," !important"),"".concat(e.spacing(5)," !important")]},children:[(0,r.jsx)(z,{onClick:u,children:(0,r.jsx)(f.Z,{icon:"tabler:x",fontSize:"1.25rem"})}),(0,r.jsxs)(c.Z,{sx:{mb:3,textAlign:"left"},children:[(0,r.jsx)(d.Z,{variant:"h4",sx:{mb:3},children:null==o?void 0:o.title}),(0,r.jsx)(d.Z,{variant:"body",sx:{mb:3},children:"Bạn c\xf3 thể dễ d\xe0ng quản l\xfd đề thi, b\xe0i tập của m\xecnh theo từng thư mục, chuy\xean đề một c\xe1ch dễ d\xe0ng hơn."})]}),(0,r.jsx)(R.Z,{sx:{paddingX:"0!important"},children:(0,r.jsx)(x.Z,{value:(null==o?void 0:o.text)||"",onChange:e=>l({...o,text:e}),fullWidth:!0,placeholder:"Vui l\xf2ng nhập t\xean thư mục",label:"T\xean thư mục"})})]}),(0,r.jsxs)(A.Z,{sx:{justifyContent:"center",px:e=>["".concat(e.spacing(5)," !important"),"".concat(e.spacing(5)," !important")],pb:e=>["".concat(e.spacing(5)," !important"),"".concat(e.spacing(5)," !important")]},children:[(0,r.jsx)(h.Z,{variant:"tonal",color:"secondary",onClick:u,children:"Hủy"}),(0,r.jsx)(h.Z,{variant:"contained",sx:{mr:1},onClick:p,children:"Lưu"})]})]})};var B=n(4273),X=n(9008),U=n.n(X);let J=async e=>{try{return(await s.default.get(e)).data}catch(e){throw e}},q=()=>{var e;let t=(0,o.useRouter)(),[n,s]=(0,a.useState)(""),[l,u]=(0,a.useState)(!1),[d,h]=(0,a.useState)(null),{parent:f}=t.query,{data:x,isLoading:p}=(0,i.Z)(t.isReady?f?"/exams/".concat(f):"/exams":null,J);return x&&x.error?(0,r.jsx)(r.Fragment,{}):(0,r.jsxs)(c.Z,{children:[(0,r.jsx)(U(),{children:(0,r.jsx)("title",{children:"Quản l\xfd đề thi - C\xf4ng cụ tạo đề thi online miễn ph\xed"})}),(0,r.jsx)(g,{parent:f||"",goBack:()=>t.back(),onSearch:e=>s(e),onChange:e=>h(e)}),(0,r.jsx)(N,{rows:null===(e=x||[])||void 0===e?void 0:e.filter(e=>null==e?void 0:e.title.includes(n)),onLoading:e=>u(e),onChange:e=>h(e)}),(0,r.jsx)(B.Z,{open:p||l}),(0,r.jsx)(L,{popup:d,onChange:e=>h(e),onLoading:e=>u(e)})]})};var F=()=>(0,r.jsx)(q,{})},8232:function(e,t,n){"use strict";var r=n(5893),a=n(7294),i=n(1903);let o=e=>(e||"").toLowerCase().split(" ").map(function(e){return e.replace(e.charAt(0),e.charAt(0).toUpperCase())}).join(" "),s=e=>{let t=Object.fromEntries(Object.entries(e).filter(e=>{let[t]=e;return!["onSearch","capitalize","uppercase","timeout"].includes(t)})),[n,s]=(0,a.useState)(e.value||""),c=(0,a.useRef)(null),l=t=>{var{value:n}=t.target;n=e.uppercase?(n||"").toLocaleUpperCase():n||"",s(n=e.capitalize?o(n||""):n||""),clearTimeout(c.current),c.current=setTimeout(()=>{e.onChange&&e.onChange(n)},e.timeout||500)};return(0,a.useEffect)(()=>()=>{clearTimeout(c.current)},[]),(0,a.useEffect)(()=>{e.value!=n&&s(e.value||"")},[e.value]),(0,r.jsx)(i.Z,{...t,onChange:l,value:n})};t.Z=s},4273:function(e,t,n){"use strict";var r=n(5893),a=n(5861),i=n(4808),o=n(8456);let s=e=>{let{open:t}=e;return(0,r.jsxs)(i.Z,{sx:{color:"#fff",zIndex:1301,display:"flex",flexDirection:"column"},open:t,children:[(0,r.jsx)(o.Z,{color:"inherit"}),(0,r.jsx)(a.Z,{variant:"h5",sx:{color:"#fff",zIndex:e=>e.zIndex.drawer+1,mt:3},children:"VUI L\xd2NG ĐỢI"})]})};t.Z=s}},function(e){e.O(0,[125,336,774,888,179],function(){return e(e.s=4969)}),_N_E=e.O()}]);