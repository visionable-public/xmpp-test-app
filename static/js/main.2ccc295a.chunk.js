(this["webpackJsonpxmpp-test"]=this["webpackJsonpxmpp-test"]||[]).push([[0],{372:function(e,t,n){},376:function(e,t){},422:function(e,t){},424:function(e,t){},612:function(e,t,n){"use strict";n.r(t);var r=n(27),a=n(7),c=n(4),s=n.n(c),o=n(2),i=n.n(o),u=n(89),l=n.n(u),d=n(5),j=n(18),b=n(21),p=n(297),f=n(101),m=n(717),O=n(715),h=n(731),x=n(721),v=n(698),g=n(724),y=n(727),w=n(719),k=new(n(216).default)("visionable-xmpp-test-app");k.version(1).stores({messages:"++id, group, from, to, body, type, timestamp"});var C=k,S=(n(372),n(726)),A=n(718),_=n(705),I=n(700),R=n(701),P=n(703),U=n(704),T=n(720),E=n(329),M=n(728),L=n(702),N=n(306),z=n.n(N),B=n(307),F=n.n(B),D=n(140),H=n.n(D),G=n(725),W=n(714),q=n(711),K=n(298),V=n(327),Q=n(1),J=function(e){e.client,e.me;var t=e.onClose,n=e.open,c=Object(o.useState)(!1),i=Object(a.a)(c,2),u=i[0],l=i[1],d=Object(o.useState)(null),j=Object(a.a)(d,2),b=j[0],p=j[1],f=Object(o.useState)(!0),m=Object(a.a)(f,2),O=m[0],h=m[1],k=Object(o.useState)(""),C=Object(a.a)(k,2),S=C[0],A=C[1];Object(o.useEffect)(Object(r.a)(s.a.mark((function e(){var t,n;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,V.a.currentAuthenticatedUser();case 2:return t=e.sent,e.next=5,V.a.getPreferredMFA(t);case 5:n=e.sent,l("SOFTWARE_TOKEN_MFA"===n),h(!1);case 8:case"end":return e.stop()}}),e)}))),[]);var _=function(){var e=Object(r.a)(s.a.mark((function e(){var t,n,r,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,V.a.currentAuthenticatedUser();case 2:return t=e.sent,n=t.attributes.email,e.next=6,V.a.setupTOTP(t);case 6:r=e.sent,"Visionable",a="otpauth://totp/Visionable:".concat(n,"?secret=").concat(r,"&issuer=").concat("Visionable"),p(a);case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),I=function(){var e=Object(r.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,V.a.currentAuthenticatedUser();case 2:t=e.sent,l(!u),u?V.a.setPreferredMFA(t,"NOMFA"):_();case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),R=function(){var e=Object(r.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,V.a.currentAuthenticatedUser();case 2:t=e.sent,V.a.verifyTotpToken(t,S).then((function(){V.a.setPreferredMFA(t,"TOTP"),alert("Successfully enabled MFA"),p(null)})).catch((function(e){console.log("ERROR",e),alert("Error enabling MFA")}));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(Q.jsxs)(x.a,{open:n,onClose:t,fullWidth:!0,maxWidth:"sm",children:[Object(Q.jsx)(v.a,{children:"Settings"}),Object(Q.jsx)(g.a,{children:O?Object(Q.jsx)("div",{children:"Loading"}):Object(Q.jsxs)(Q.Fragment,{children:[Object(Q.jsx)(G.a,{control:Object(Q.jsx)(W.a,{onChange:I,checked:u}),label:"Enable MFA"}),u&&b&&Object(Q.jsxs)(Q.Fragment,{children:[Object(Q.jsx)("br",{}),Object(Q.jsx)(K.a,{value:b,size:200}),Object(Q.jsx)("br",{}),Object(Q.jsx)(q.a,{sx:{my:1},onChange:function(e){A(e.target.value)},label:"Verification Code",InputProps:{endAdornment:Object(Q.jsx)(w.a,{disabled:!S,onClick:R,children:"Verify"})}})]})]})}),Object(Q.jsx)(y.a,{children:Object(Q.jsx)(w.a,{onClick:t,children:"Close"})})]})};function Y(e){var t,n,r;return null===(t=e.name)||void 0===t||null===(n=t.split(" "))||void 0===n||null===(r=n.slice(0,2))||void 0===r?void 0:r.map((function(e){return e.substr(0,1)}))}var $=function(e){var t=e.client,n=e.me,r=e.signOut,c=Object(o.useState)("available"),s=Object(a.a)(c,2)[1],i=Object(o.useState)(null),u=Object(a.a)(i,2),l=u[0],d=u[1],j=Object(o.useState)(""),b=Object(a.a)(j,2),p=b[0],f=b[1],m=Object(o.useState)(!1),O=Object(a.a)(m,2),h=O[0],x=O[1],v=Boolean(l),g=function(){d(null)},y=[{key:"available",color:"#53b397",label:"Available",icon:H.a},{key:"in-meeting",color:"#ea3323",label:"In a meeting",icon:H.a},{key:"away",color:"#f0a73e",label:"Away",icon:H.a}];return Object(Q.jsxs)(Q.Fragment,{children:[Object(Q.jsxs)(A.a,{disablePadding:!0,children:[Object(Q.jsx)(I.a,{onClick:function(e){d(e.currentTarget)},sx:{mx:1},children:Object(Q.jsx)(T.a,{children:Object(Q.jsx)(T.a,{children:Y(n)})})}),Object(Q.jsx)(R.a,{primary:n.name,primaryTypographyProps:{color:"white",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"},secondary:n.user_email,secondaryTypographyProps:{color:"white",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"},title:t.config.jid})]}),Object(Q.jsxs)(E.a,{anchorEl:l,id:"account-menu",open:v,onClose:g,onClick:g,children:[y.map((function(e){return Object(Q.jsxs)(M.a,{onClick:function(){return n=e.key,s(n),void t.sendPresence({status:n});var n},children:[Object(Q.jsx)(I.a,{children:Object(Q.jsx)(H.a,{fontSize:"small",sx:{color:e.color}})}),Object(Q.jsx)(R.a,{primary:e.label})]},e.key)})),Object(Q.jsx)(M.a,{onClick:function(){var e=prompt("Enter a custom message");t.publishActivity({text:e}),f(e)},children:p||Object(Q.jsx)("i",{children:"Custom message"})}),Object(Q.jsx)(L.a,{}),Object(Q.jsxs)(M.a,{onClick:function(){x(!0)},children:[Object(Q.jsx)(I.a,{children:Object(Q.jsx)(z.a,{fontSize:"small"})}),"Settings"]}),Object(Q.jsxs)(M.a,{onClick:r,children:[Object(Q.jsx)(I.a,{children:Object(Q.jsx)(F.a,{fontSize:"small"})}),"Logout"]})]}),Object(Q.jsx)(J,{open:h,onClose:function(){return x(!1)},client:t,me:n})]})},X=[{route:"contacts",label:"Contacts",iconComponent:P.a},{route:"messages",label:"Messages",iconComponent:U.a}],Z=function(e){var t=e.client,n=e.me,r=e.setNav,a=e.nav,c=e.signOut,s=e.hostname;return Object(Q.jsxs)(S.a,{sx:{display:"flex",flexDirection:"column",width:"240px",minWidth:"240px",background:"#091c38",color:"white"},children:[Object(Q.jsx)($,{client:t,me:n,signOut:c}),X.map((function(e){var t=e.iconComponent;return Object(Q.jsx)(A.a,{disablePadding:!0,sx:{background:a===e.route?"rgba(255,255,255,0.1)":"transparent"},children:Object(Q.jsxs)(_.a,{onClick:function(){return r(e.route)},children:[Object(Q.jsx)(I.a,{children:Object(Q.jsx)(t,{sx:{color:"white"}})}),Object(Q.jsx)(R.a,{children:e.label})]})},e.route)})),Object(Q.jsx)(A.a,{sx:{mt:"auto",justifyContent:"center",color:"#bbb"},children:s})]})},ee=n(709),te=n(723),ne=n(706),re=n(729),ae=n(712),ce=n(733),se=n(734),oe=n(713),ie=n(219),ue=n.n(ie),le=n(177),de=n.n(le),je=n(722),be=n(732),pe=n(330),fe=n(730),me=n(311),Oe=n.n(me),he=n(310),xe=n.n(he),ve=n(312),ge=n.n(ve),ye=n(313),we=n.n(ye),ke=n(314),Ce=n.n(ke),Se=n(102),Ae=n(308),_e=n.n(Ae),Ie=n(112),Re=function(e){var t,n=e.message,r=e.client,a=(e.isRoom,!n.from||n.from.includes(r.config.jid));return Object(Q.jsxs)(h.a,{className:"chat-message ".concat(a?"mine":""),sx:{background:a?Se.a[700]:"white",color:a?"white":"black",p:1.5,mx:2,my:1,borderRadius:2,marginLeft:a?"auto":0,marginRight:a?0:"auto",wordBreak:"break-all"},children:[Object(Q.jsxs)("span",{style:{fontSize:"0.8em"},children:[Object(Q.jsx)("b",{children:n.name}),Object(Q.jsx)("span",{style:{marginLeft:"1em",color:a?"#eee":"#666"},children:null===(t=n.timestamp)||void 0===t?void 0:t.toLocaleString()})]}),Object(Q.jsx)("br",{}),Object(Q.jsxs)(_e.a,{componentDecorator:function(e,t,n){return Object(Q.jsx)("a",{target:"blank",href:e,style:{color:"inherit"},children:t},n)},children:[Ne(n.body)&&Object(Q.jsx)("div",{children:Object(Q.jsx)("a",{href:n.body,target:"_blank",rel:"noreferrer",children:Object(Q.jsx)("img",{src:n.body,alt:"",style:{maxHeight:"50vh",maxWidth:"70%"}})})}),Le(n.body)&&!Ne(n.body)&&Object(Q.jsx)("a",{href:n.body,target:"_blank",rel:"noreferrer",style:{textDecoration:"none"},children:Object(Q.jsx)(be.a,{sx:{background:"#eee",p:1,mt:1},children:Object(Q.jsxs)(ne.a,{direction:"row",children:[Object(Q.jsx)(Ce.a,{sx:{mr:1}}),ze(n.body)]})})}),!Ne(n.body)&&!Le(n.body)&&n.body]})]})};function Pe(e,t){return Ue.apply(this,arguments)}function Ue(){return(Ue=Object(r.a)(s.a.mark((function e(t,n){var r,a,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r="".concat(t,"/api/meeting"),a=parseInt((new Date).getTime()/1e3),(c=new FormData).append("name","Instant Meeting"),c.append("mstart",a.toString()),c.append("duration","3600"),e.abrupt("return",fetch(r,{method:"POST",headers:{Authorization:n},body:c}).then((function(e){return e.json()})));case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var Te=function(e){var t=e.open,n=e.close,r=e.allUsers,c=e.client,s=e.room,i=Object(o.useState)(""),u=Object(a.a)(i,2),l=u[0],d=u[1];return Object(Q.jsxs)(x.a,{open:t,onClose:n,children:[Object(Q.jsx)(v.a,{children:"Add User to Room"}),Object(Q.jsx)(g.a,{children:Object(Q.jsx)(ee.a,{sx:{width:400,my:1},onChange:function(e,t){return t&&d(t.id)},options:r.map((function(e){return{label:"".concat(e.name," (").concat(e.user_email,")"),id:e.user_id}})),renderInput:function(e){return Object(Q.jsx)(q.a,Object(b.a)(Object(b.a)({},e),{},{label:"User"}))}})}),Object(Q.jsxs)(y.a,{children:[Object(Q.jsx)(w.a,{onClick:n,children:"Cancel"}),Object(Q.jsx)(w.a,{onClick:function(){var e="".concat(l,"@").concat(c.config.server);c.setRoomAffiliation(s.jid,e,"member"),n()},children:"Add"})]})]})},Ee=function(){var e=Object(r.a)(s.a.mark((function e(t,n){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all(Array.from(t).map(function(){var e=Object(r.a)(s.a.mark((function e(t){var r,a,c,o,i,u,l;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.name,a=t.size,c=t.type,console.log("here",r,a,c),e.next=4,n.getUploadService();case 4:return o=e.sent,e.next=7,n.getUploadSlot(o.jid,{name:r,size:a,mediaType:c});case 7:return i=e.sent,u=i.download,l=i.upload.url,console.log("uploadUrl",l),e.prev=10,e.next=13,fetch(l,{method:"PUT",body:t,headers:{"x-amz-acl":"public-read"}});case 13:return e.abrupt("return",u);case 16:return e.prev=16,e.t0=e.catch(10),e.abrupt("return",null);case 19:case"end":return e.stop()}}),e,null,[[10,16]])})));return function(t){return e.apply(this,arguments)}}()));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),Me=function(e){var t=e.client,n=e.user,c=e.API_BASE,i=e.jwt,u=e.allUsers,l=Object(o.useState)([]),d=Object(a.a)(l,2),j=d[0],p=d[1],f=Object(o.useState)(""),m=Object(a.a)(f,2),O=m[0],h=m[1],x=Object(o.useState)(!1),v=Object(a.a)(x,2),g=v[0],y=v[1],k=Object(o.useState)(!1),S=Object(a.a)(k,2),A=S[0],_=S[1],I=Object(o.useRef)(null),R=Object(o.useRef)(null),P=Object(o.useState)(null),U=Object(a.a)(P,2),T=U[0],N=U[1],z=Boolean(T),B=function(){var e=Object(r.a)(s.a.mark((function e(r){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return y(!0),e.next=3,Ee(r,t);case 3:a=e.sent,console.log("urls",a),a.forEach((function(e){if(e){var r=n.isRoom?"groupchat":"chat";t.sendMessage({to:n.jid,body:e,type:r})}else console.log("upload failed")})),y(!1);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),F=Object(pe.a)({onDrop:function(e){console.log("dropped files",e),B(e)},noClick:!0,noKeyboard:!0}),D=F.getRootProps,H=(F.getInputProps,F.isDragActive),G=Object(Ie.useLiveQuery)((function(){return n.isRoom?C.messages.where("group").equals(n.jid).sortBy("timestamp"):C.messages.where("from").equals(n.jid).or("to").equals(n.jid).and((function(e){return!e.group})).sortBy("timestamp")}),[n],[]),W=G.map((function(e){var t=u.find((function(t){var n;return null===(n=e.from)||void 0===n?void 0:n.includes(t.user_id)})),n=(null===t||void 0===t?void 0:t.name)||e.from;return Object(b.a)(Object(b.a)({},e),{},{user:t,name:n})})),K=function(){var e=Object(r.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n.isRoom){e.next=7;break}return e.next=3,t.setRoomAffiliation(n.jid,t.config.jid,"none");case 3:return e.next=5,t.leaveRoom(n.jid);case 5:e.next=11;break;case 7:return e.next=9,t.removeRosterItem(n.jid);case 9:return e.next=11,t.unsubscribe(n.jid);case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),V=function(){if(O){var e=n.isRoom?"groupchat":"chat";t.sendMessage({to:n.jid,body:O,type:e}),h("")}},J=function(){var e=Object(r.a)(s.a.mark((function e(){var r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Pe(c,i);case 2:(r=e.sent).uuid&&t.sendMessage({to:n.jid,body:r.uuid,type:"meeting-invite"});case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Y=function(){var e=Object(r.a)(s.a.mark((function e(r){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.getRoomMembers(n.jid);case 2:a=e.sent,p(a.muc.users.map((function(e){var t;return Object(b.a)(Object(b.a)({},e),{},{name:null===(t=u.find((function(t){return e.jid.includes(t.user_id)})))||void 0===t?void 0:t.name})}))),N(r.target);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),$=function(){return N(null)};Object(o.useEffect)((function(){var e;I.current.scrollTop=null===I||void 0===I||null===(e=I.current)||void 0===e?void 0:e.scrollHeight}),[G]);var X=u.filter((function(e){return!t.config.jid.includes(e.user_id)}));return Object(Q.jsxs)(ne.a,Object(b.a)(Object(b.a)({sx:{flexGrow:1}},D()),{},{children:[Object(Q.jsx)(Te,{client:t,room:n,open:A,close:function(){return _(!1)},allUsers:X}),Object(Q.jsx)(je.a,{open:H,sx:{color:"white"},children:Object(Q.jsx)("h3",{children:"Drop files to upload"})}),Object(Q.jsxs)(ne.a,{direction:"row",sx:{px:2,background:"white",alignItems:"center"},children:[Object(Q.jsx)("h2",{children:n.name}),Object(Q.jsx)(re.a,{sx:{ml:"auto"},onClick:K,title:n.isRoom?"Leave Group":"Remove Contact",children:Object(Q.jsx)(xe.a,{fontSize:"inherit"})}),n.isRoom&&Object(Q.jsxs)(Q.Fragment,{children:[Object(Q.jsx)(re.a,{onClick:Y,children:Object(Q.jsx)(Oe.a,{fontSize:"inherit"})}),Object(Q.jsxs)(E.a,{id:"basic-menu",anchorEl:T,open:z,onClose:$,MenuListProps:{"aria-labelledby":"basic-button"},children:[j.map((function(e){return Object(Q.jsx)(M.a,{children:e.name},e.jid)})),Object(Q.jsx)(L.a,{}),Object(Q.jsx)(M.a,{onClick:function(){$(),_(!0)},children:"Add"})]})]}),Object(Q.jsx)(re.a,{onClick:J,children:Object(Q.jsx)(ge.a,{fontSize:"inherit"})})]}),Object(Q.jsx)(ne.a,{sx:{background:"#eee",flexGrow:1,overflow:"auto",px:"10%"},ref:I,children:W.map((function(e){return Object(Q.jsx)(Re,{message:e,client:t,isRoom:n.isRoom},e.id)}))}),Object(Q.jsx)(ne.a,{direction:"row",sx:{p:1},children:Object(Q.jsx)(q.a,{onChange:function(e){return h(e.target.value)},value:O,sx:{flexGrow:1},placeholder:"Send a message...",onKeyPress:function(e){return"Enter"===e.key&&V()},InputProps:{endAdornment:Object(Q.jsxs)(Q.Fragment,{children:[g?Object(Q.jsx)(fe.a,{}):Object(Q.jsxs)(re.a,{style:{flexShrink:"0"},onClick:function(){return R.current.click()},children:[Object(Q.jsx)(we.a,{fontSize:"inherit"}),Object(Q.jsx)("input",{disabled:g,type:"file",style:{display:"none"},ref:R,onChange:function(e){return B(e.target.files)}})]}),Object(Q.jsx)(w.a,{onClick:V,children:"Send"})]})}})})]}))};function Le(e){return function(e){var t;try{t=new URL(e)}catch(n){return!1}return"http:"===t.protocol||"https:"===t.protocol}(e)&&e.match(/amazonaws.*fileshare/)}function Ne(e){return/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(e)}function ze(e){var t=e.split("/");return t[t.length-1]}var Be=function(e){var t=e.open,n=e.close,r=e.add,c=Object(o.useState)(""),s=Object(a.a)(c,2),i=s[0],u=s[1];return Object(Q.jsxs)(x.a,{open:t,onClose:n,children:[Object(Q.jsx)(v.a,{children:"Add Group"}),Object(Q.jsx)(g.a,{children:Object(Q.jsx)(q.a,{sx:{width:400,my:1},onChange:function(e){return u(e.target.value)},label:"Group name"})}),Object(Q.jsxs)(y.a,{children:[Object(Q.jsx)(w.a,{onClick:n,children:"Cancel"}),Object(Q.jsx)(w.a,{onClick:function(){r(i),n()},children:"Add"})]})]})},Fe=function(e){var t=e.open,n=e.close,r=e.add,c=e.allUsers,s=Object(o.useState)(""),i=Object(a.a)(s,2),u=i[0],l=i[1];return Object(Q.jsxs)(x.a,{open:t,onClose:n,children:[Object(Q.jsx)(v.a,{children:"Add Contact"}),Object(Q.jsx)(g.a,{children:Object(Q.jsx)(ee.a,{sx:{width:400,my:1},onChange:function(e,t){return t&&l(t.id)},options:c.map((function(e){return{label:De(e),id:e.user_id}})),renderInput:function(e){return Object(Q.jsx)(q.a,Object(b.a)(Object(b.a)({},e),{},{label:"User"}))}})}),Object(Q.jsxs)(y.a,{children:[Object(Q.jsx)(w.a,{onClick:n,children:"Cancel"}),Object(Q.jsx)(w.a,{onClick:function(){r(u),n()},children:"Add"})]})]})},De=function(e){return"".concat(e.user_firstname," ").concat(e.user_lastname," (").concat(e.user_email,")")};function He(e){var t,n,r;return null===(t=e.name)||void 0===t||null===(n=t.split(" "))||void 0===n||null===(r=n.slice(0,2))||void 0===r?void 0:r.map((function(e){return e.substr(0,1)}))}var Ge=function(e){var t=e.roster,n=e.client,c=e.allUsers,i=e.API_BASE,u=e.MUC_LIGHT_HOSTNAME,l=e.jwt,d=Object(o.useState)(""),j=Object(a.a)(d,2),b=j[0],p=j[1],f=Object(o.useState)(null),m=Object(a.a)(f,2),O=m[0],x=m[1],v=Object(o.useState)(!1),g=Object(a.a)(v,2),y=g[0],w=g[1],k=Object(o.useState)(!1),C=Object(a.a)(k,2),I=C[0],P=C[1],U=Object(o.useState)(0),L=Object(a.a)(U,2),N=L[0],z=L[1],B=Object(o.useState)(null),F=Object(a.a)(B,2),D=F[0],H=F[1],G=Boolean(D),W=function(){H(null)},K=function(){var e=Object(r.a)(s.a.mark((function e(t){var r,a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=crypto.randomUUID(),a="".concat(r,"@").concat(u),e.next=4,n.joinRoom(a);case 4:e.sent,n.configureRoom(a,{fields:[{name:"roomname",value:t}]});case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),V=t.filter((function(e){var t,n;return(null===(t=e.name)||void 0===t?void 0:t.toLowerCase().includes(b.toLowerCase()))||(null===(n=e.jid)||void 0===n?void 0:n.includes(b))})).filter((function(e){return 0===N&&!e.isRoom||1===N&&e.isRoom})),J=c.filter((function(e){return!n.config.jid.includes(e.user_id)}));return Object(Q.jsxs)(Q.Fragment,{children:[Object(Q.jsx)(Fe,{add:function(e){var t="".concat(e,"@").concat(n.config.server);n.subscribe(t)},close:function(){return w(!1)},open:y,allUsers:J}),Object(Q.jsx)(Be,{add:K,close:function(){return P(!1)},open:I}),Object(Q.jsxs)(te.a,{className:"scroll-list-container",sx:{width:300},children:[Object(Q.jsxs)(h.a,{sx:{px:2},children:[Object(Q.jsxs)(ne.a,{direction:"row",sx:{alignItems:"center"},children:[Object(Q.jsx)("h2",{children:"Contacts"}),Object(Q.jsx)(re.a,{sx:{ml:"auto"},onClick:function(e){H(e.currentTarget)},children:Object(Q.jsx)(ue.a,{fontSize:"inherit"})}),Object(Q.jsxs)(E.a,{id:"basic-menu",anchorEl:D,open:G,onClose:W,MenuListProps:{"aria-labelledby":"basic-button"},children:[Object(Q.jsx)(M.a,{onClick:function(){W(),w(!0)},children:"Add Contact"}),Object(Q.jsx)(M.a,{onClick:function(){W(),P(!0)},children:"Add Group"})]})]}),Object(Q.jsx)(q.a,{type:"search",label:"Search",variant:"filled",size:"small",fullWidth:!0,onChange:function(e){return p(e.target.value)}})]}),Object(Q.jsx)(h.a,{sx:{borderBottom:1,borderColor:"divider"},children:Object(Q.jsxs)(ae.a,{value:N,onChange:function(e,t){return z(t)},"aria-label":"basic tabs example",children:[Object(Q.jsx)(ce.a,{label:"Contacts",index:0}),Object(Q.jsx)(ce.a,{label:"Groups",index:1})]})}),Object(Q.jsx)(S.a,{className:"scroll-list",children:V.map((function(e){var t,n={available:"#51b397",away:"#f0a73e",unavailable:"gray","in-meeting":"#ea3323"}[e.isRoom?"":e.status]||"gray";return Object(Q.jsx)(A.a,{disablePadding:!0,children:Object(Q.jsxs)(_.a,{onClick:function(){return x(e)},children:[Object(Q.jsx)(se.a,{children:Object(Q.jsx)(oe.a,{componentsProps:{badge:{sx:{backgroundColor:n,border:"2px solid white",width:14,height:14,borderRadius:7}}},overlap:"circular",badgeContent:" ",invisible:e.isRoom,variant:"dot",anchorOrigin:{vertical:"bottom",horizontal:"right"},children:Object(Q.jsx)(T.a,{children:e.isRoom?Object(Q.jsx)(de.a,{}):He(e)})})}),Object(Q.jsx)(R.a,{primary:e.name,primaryTypographyProps:{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"},secondary:null===(t=e.user)||void 0===t?void 0:t.user_email,secondaryTypographyProps:{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"},title:e.jid+(e.activity?" - "+e.activity:"")})]})},e.jid)}))})]}),Object(Q.jsx)(te.a,{className:"right-section",children:O&&Object(Q.jsx)(Me,{allUsers:c,client:n,user:O,API_BASE:i,jwt:l})})]})},We=function(e){var t=e.open,n=e.close,r=e.add,c=e.allUsers,s=Object(o.useState)(""),i=Object(a.a)(s,2),u=i[0],l=i[1];return Object(Q.jsxs)(x.a,{open:t,onClose:n,children:[Object(Q.jsx)(v.a,{children:"Find a User"}),Object(Q.jsx)(g.a,{children:Object(Q.jsx)(ee.a,{sx:{width:400,my:1},onChange:function(e,t){return t&&l(t.id)},options:c.map((function(e){return{label:qe(e),id:e.user_id}})),renderInput:function(e){return Object(Q.jsx)(q.a,Object(b.a)(Object(b.a)({},e),{},{label:"User"}))}})}),Object(Q.jsxs)(y.a,{children:[Object(Q.jsx)(w.a,{onClick:n,children:"Cancel"}),Object(Q.jsx)(w.a,{onClick:function(){r(u),n()},children:"Add"})]})]})},qe=function(e){return"".concat(e.user_firstname," ").concat(e.user_lastname," (").concat(e.user_email,")")};function Ke(e){var t,n,r;return null===(t=e.name)||void 0===t||null===(n=t.split(" "))||void 0===n||null===(r=n.slice(0,2))||void 0===r?void 0:r.map((function(e){return e.substr(0,1)}))}var Ve=function(e){var t=e.client,n=e.allUsers,r=e.roster,c=e.jwt,s=e.API_BASE,i=Object(o.useState)(""),u=Object(a.a)(i,2),l=u[0],d=u[1],j=Object(o.useState)(null),b=Object(a.a)(j,2),p=b[0],f=b[1],m=Object(o.useState)(!1),O=Object(a.a)(m,2),x=O[0],v=O[1],g=Object(Ie.useLiveQuery)((function(){return C.messages.orderBy("to").uniqueKeys()}))||[],y=Object(Ie.useLiveQuery)((function(){return C.messages.orderBy("from").uniqueKeys()}))||[],w=Object(Ie.useLiveQuery)((function(){return C.messages.orderBy("group").uniqueKeys()}))||[],k=g.concat(y).concat(w).filter((function(e,t,n){return n.indexOf(e)===t})).filter((function(e){return e!==t.config.jid})),I=null===k||void 0===k?void 0:k.map((function(e){var t,a=n.find((function(t){return e.includes(t.user_id)})),c=(null===a||void 0===a?void 0:a.name)||(null===(t=r.find((function(t){return t.jid===e})))||void 0===t?void 0:t.name)||e,s=w.includes(e);return{jid:e,user:a,name:c,isRoom:s}})),P=null===I||void 0===I?void 0:I.filter((function(e){var t,n,r,a,c,s=l.toLowerCase();return(null===(t=e.name)||void 0===t?void 0:t.toLowerCase().includes(s))||s.includes(null===(n=e.name)||void 0===n?void 0:n.toLowerCase())||(null===(r=e.user)||void 0===r||null===(a=r.user_email)||void 0===a?void 0:a.includes(s))||s.includes(null===(c=e.user)||void 0===c?void 0:c.user_email)}));return Object(Q.jsxs)(Q.Fragment,{children:[Object(Q.jsx)(We,{add:function(e){console.log("addChat",e);var n="".concat(e,"@").concat(t.config.server);console.log("jid",n)},close:function(){return v(!1)},open:x,allUsers:n}),Object(Q.jsxs)(te.a,{className:"scroll-list-container",sx:{width:300},children:[Object(Q.jsxs)(h.a,{sx:{px:2},children:[Object(Q.jsx)(ne.a,{direction:"row",sx:{alignItems:"center"},children:Object(Q.jsx)("h2",{children:"Chat"})}),Object(Q.jsx)(q.a,{type:"search",label:"Search",variant:"filled",size:"small",fullWidth:!0,onChange:function(e){return d(e.target.value)}})]}),Object(Q.jsx)(S.a,{className:"scroll-list",children:P.map((function(e){var t;return Object(Q.jsx)(A.a,{disablePadding:!0,children:Object(Q.jsxs)(_.a,{onClick:function(){return f(e)},children:[Object(Q.jsx)(se.a,{children:Object(Q.jsx)(T.a,{children:e.isRoom?Object(Q.jsx)(de.a,{}):Ke(e)})}),Object(Q.jsx)(R.a,{primary:e.name,primaryTypographyProps:{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"},secondary:null===(t=e.user)||void 0===t?void 0:t.user_email,secondaryTypographyProps:{textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"},title:e.jid})]})},e.jid)}))})]}),Object(Q.jsx)(te.a,{className:"right-section",children:p&&Object(Q.jsx)(Me,{allUsers:n,client:t,user:p,API_BASE:s,jwt:c})})]})},Qe=function(e,t){t.define({element:"result",fields:{unread:f.a.attribute("unread"),queryid:f.a.attribute("queryid")},namespace:"erlang-solutions.com:xmpp:inbox:0",path:"message.result"}),t.define({element:"forwarded",fields:{unread:f.a.attribute("unread")},namespace:"urn:xmpp:forward:0",path:"message.result.forwarded"}),t.define({element:"inbox",fields:{result:f.a.text()},namespace:"erlang-solutions.com:xmpp:inbox:0",path:"iq.inbox"}),e.getInbox=function(){return e.sendIQ({type:"set",inbox:"test"})},e.on("message",(function(t){t.result&&e.emit("inbox",t)}))};window.db=C;var Je=localStorage.getItem("xmpp-resource")||crypto.randomUUID();localStorage.setItem("xmpp-resource",Je);var Ye=function(){var e=Object(r.a)(s.a.mark((function e(t,n,r){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",f.b({jid:t,password:n,resource:Je,transports:{websocket:"".concat("wss","://").concat(r,":").concat("5443","/").concat("ws-xmpp")}}));case 1:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}(),$e=function(e){var t=e.accept,n=e.reject,r=e.invites,a=e.responses;return r.filter((function(e){return!a[e.id]})).map((function(e){return Object(Q.jsxs)(x.a,{open:!0,children:[Object(Q.jsx)(v.a,{children:"Meeting Invite"}),Object(Q.jsxs)(g.a,{children:[Object(Q.jsxs)("p",{children:["Invite ID: ",e.id]}),Object(Q.jsxs)("p",{children:["From: ",e.from]}),Object(Q.jsxs)("p",{children:["Meeting ID: ",e.body]})]}),Object(Q.jsxs)(y.a,{children:[Object(Q.jsx)(w.a,{color:"error",onClick:function(){return n(e)},children:"Reject"}),Object(Q.jsx)(w.a,{onClick:function(){return t(e)},children:"Accept"})]})]},e.id)}))},Xe=function(){var e=Object(r.a)(s.a.mark((function e(t,n){var r;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(n,"/api/user"),{headers:{Authorization:t}});case 2:return r=e.sent,e.abrupt("return",r.ok?r.json():[]);case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();function Ze(e){return null!==e&&void 0!==e&&e.name?e.name:null!==e&&void 0!==e&&e.user_displayname?e.user_displayname:null!==e&&void 0!==e&&e.user_firstname?"".concat(e.user_firstname," ").concat(e.user_lastname):"[No Name]"}function et(e){return tt.apply(this,arguments)}function tt(){return(tt=Object(r.a)(s.a.mark((function e(t){var n,r,a,c,o,i,u;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.client,r=t.start,a=t.after,c=a?{after:a}:{},e.next=4,n.searchHistory({start:r,paging:c});case 4:o=e.sent,i=o.complete,u=o.paging.last,i||et({client:n,after:u});case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var nt=function(e){var t=e.signOutAWS,n=e.user,c=e.hostname,i=Object(o.useState)(null),u=Object(a.a)(i,2),l=u[0],f=u[1],x=Object(o.useState)(""),v=Object(a.a)(x,2),g=v[0],y=v[1],w=Object(o.useState)([]),k=Object(a.a)(w,2),S=k[0],A=k[1],_=Object(o.useState)({}),I=Object(a.a)(_,2),R=I[0],P=I[1],U=Object(o.useState)({}),T=Object(a.a)(U,2),E=T[0],M=T[1],L=Object(o.useState)([]),N=Object(a.a)(L,2),z=N[0],B=N[1],F=Object(o.useState)({}),D=Object(a.a)(F,2),H=D[0],G=D[1],W=Object(o.useState)([]),q=Object(a.a)(W,2),K=q[0],J=q[1],Y=Object(o.useState)("contacts"),$=Object(a.a)(Y,2),X=$[0],ee=$[1],te=Object(o.useState)(!1),ne=Object(a.a)(te,2),re=ne[0],ae=ne[1],ce=Object(o.useState)(c),se=Object(a.a)(ce,1)[0].split(/\.([\s\S]*)/),oe=Object(p.a)(se),ie=oe[0],ue=Object(a.a)(oe.slice(1),1)[0],le="".concat(ie,"-msg.").concat(ue),de="muclight.".concat(le),je="https://".concat(ie,"-api.").concat(ue),be=function(){var e=Object(r.a)(s.a.mark((function e(){var t,c,o,i,u,p;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!l){e.next=2;break}return e.abrupt("return");case 2:if(localStorage.getItem("username")===n.username){e.next=5;break}return e.next=5,C.messages.clear();case 5:return localStorage.setItem("username",n.username),e.prev=6,t=n.signInUserSession,c=t.idToken.jwtToken,y(c),o="".concat(n.username,"@").concat(le),e.next=13,Ye(o,c,le);case 13:return(i=e.sent).use(Qe),f(i),ae(!0),e.next=19,Xe(c,je);case 19:u=e.sent,p=u.map((function(e){return Object(b.a)(Object(b.a)({},e),{},{name:Ze(e)})})),J(p),window.client=i,i.on("session:started",Object(r.a)(s.a.mark((function e(){var t,n;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("session:started"),i.updateCaps(),i.sendPresence({legacyCapabilities:i.disco.getCaps()}),i.enableKeepAlive(),i.enableCarbons(),e.next=7,i.getRoster();case 7:return t=e.sent.items,A(t),e.next=11,C.messages.orderBy("timestamp").last();case 11:n=e.sent,et({client:i,start:null===n||void 0===n?void 0:n.timestamp});case 13:case"end":return e.stop()}}),e)})))),i.on("message",(function(e){if("meeting-invite"===e.type)B((function(t){return[].concat(Object(j.a)(t),[e])}));else if("chat"===e.type||"groupchat"===e.type){var t=e.from.split("/"),n=Object(a.a)(t,2),r=n[0],c=n[1],s="chat"===e.type?null:r,o="chat"===e.type?r:c;C.messages.put({id:e.id,from:o,to:e.to,body:e.body,type:e.type,group:s,timestamp:new Date},e.id)}})),i.on("message:sent",(function(e){"meeting-invite"===e.type||"chat"===e.type&&C.messages.put({id:e.id,from:i.config.jid,to:e.to,body:e.body,type:e.type,group:null,timestamp:new Date},e.id)})),i.on("mam:item",(function(e){var t,n,r,c,s,o=null===(t=e.archive)||void 0===t||null===(n=t.item)||void 0===n?void 0:n.message;null===(r=e.archive)||void 0===r||null===(c=r.item)||void 0===c||null===(s=c.delay)||void 0===s||s.timestamp;if("chat"===o.type||"groupchat"===o.type){var i=o.from.split("/"),u=Object(a.a)(i,2),l=u[0],d=u[1],j="chat"===o.type?null:l,b="chat"===o.type?l:d;C.messages.put({id:o.id,from:b,to:o.to,body:o.body,type:o.type,group:j,timestamp:new Date},o.id)}})),i.on("inbox",(function(e){var t,n,r,c,s,o=null===(t=e.result)||void 0===t||null===(n=t.forwarded)||void 0===n||null===(r=n.delay)||void 0===r?void 0:r.stamp,i=null===(c=e.result)||void 0===c||null===(s=c.forwarded)||void 0===s?void 0:s.message;if(console.log("inbox message",i),i){i.to;if("chat"===i.type){var u=i.from.split("/"),l=Object(a.a)(u,1)[0];C.messages.put({id:i.id,from:l,to:i.to,body:i.body,type:i.type,group:null,timestamp:o},i.id)}else i.type}})),i.on("subscribe",(function(e){i.acceptSubscription(e.from),i.subscribe(e.from)})),i.on("unsubscribe",(function(){})),i.on("roster:update",function(){var e=Object(r.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.roster.items.forEach((function(e){i.searchHistory({with:e.jid,paging:{before:""}})})),e.t0=A,e.next=4,i.getRoster();case 4:e.t1=e.sent.items,(0,e.t0)(e.t1);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),i.on("muc:invite",(function(e){i.joinRoom(e.room)})),i.on("muc:available",Object(r.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=A,e.next=3,i.getRoster();case 3:return e.t1=e.sent.items,e.abrupt("return",(0,e.t0)(e.t1));case 5:case"end":return e.stop()}}),e)})))),i.on("muc:unavailable",Object(r.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=A,e.next=3,i.getRoster();case 3:return e.t1=e.sent.items,e.abrupt("return",(0,e.t0)(e.t1));case 5:case"end":return e.stop()}}),e)})))),i.on("presence",(function(e){P((function(t){return Object(b.a)(Object(b.a)({},t),{},Object(d.a)({},e.from,e))}))})),i.on("activity",(function(e){var t=e.jid,n=e.activity.text;console.log("ACTIVITY",t,n),M((function(e){return Object(b.a)(Object(b.a)({},e),{},Object(d.a)({},t,n))}))})),i.on("*",function(){var e=Object(r.a)(s.a.mark((function e(t,n){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log(t,n);case 1:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()),i.on("disconnected",(function(){console.log("DISCONNECTED"),ae(!1)})),i.on("connected",(function(){ae(!0)})),i.connect(),window.addEventListener("beforeunload",(function(e){console.log("window.beforeunload"),i.disconnect()})),e.next=46;break;case 43:e.prev=43,e.t0=e.catch(6),console.error("caught",e.t0);case 46:case"end":return e.stop()}}),e,null,[[6,43]])})));return function(){return e.apply(this,arguments)}}();Object(o.useEffect)(be,[n]);var pe=S.map((function(e){var t,n,r=K.find((function(t){return e.jid.includes(t.user_id)})),a=e.name?e.name:r?Ze(r):e.jid,c=Object.values(R).filter((function(t){return t.from.includes(e.jid)})).filter((function(e){return"unavailable"!==e.type})).map((function(e){return e.status||"available"})),s=0===c.length?"unavailable":c.some((function(e){return"in-meeting"===e}))?"in-meeting":c.every((function(e){return"away"===e}))?"away":(c.every((function(e){return"available"===e})),"available");return Object(b.a)(Object(b.a)({},e),{},{user:r,name:a,status:s,statuses:c,activity:E[e.jid],isRoom:!(null===(t=e.groups)||void 0===t||null===(n=t[0])||void 0===n||!n.includes("muc"))})}));window.presence=R,window.roster=pe,window.activities=E,console.log("new presence list",R),console.log("extended roster",pe);var fe=K.find((function(e){return l.jid.match(e.user_id)}))||{},me=Object(o.useCallback)(Object(r.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=V.a.currentSession.idToken.jwtToken,l.updateConfig(Object(b.a)(Object(b.a)({},l.config.credentials),{},{password:t})),console.log("reconnecting. password:",t),l.connect();case 4:case"end":return e.stop()}}),e)}))),[l]),Oe=function(){var e=Object(r.a)(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:C.messages.clear(),l.disconnect(),ae(!1),A([]),P({}),localStorage.removeItem("visionable-xmpp-hostname"),t();case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return l?Object(Q.jsxs)("div",{className:"App",children:[Object(Q.jsx)(Z,{nav:X,setNav:ee,signOut:Oe,client:l,me:fe,hostname:c}),Object(Q.jsx)(m.a,{onClick:me,open:!re,anchorOrigin:{horizontal:"center",vertical:"bottom"},sx:{cursor:"pointer"},children:Object(Q.jsx)(O.a,{severity:"error",sx:{width:"100%"},children:"Disconnected. Click here to reconnect"})}),Object(Q.jsx)($e,{accept:function(e){G((function(t){return Object(b.a)(Object(b.a)({},t),{},Object(d.a)({},e.id,"accept"))})),l.sendMessage({to:e.from,body:e.id,type:"meeting-invite-accept"})},reject:function(e){G((function(t){return Object(b.a)(Object(b.a)({},t),{},Object(d.a)({},e.id,"reject"))})),l.sendMessage({to:e.from,body:e.id,type:"meeting-invite-reject"})},invites:z,responses:H}),Object(Q.jsx)(h.a,{className:"main",children:"contacts"===X?Object(Q.jsx)(Ge,{roster:pe,allUsers:K,client:l,API_BASE:je,MUC_LIGHT_HOSTNAME:de,jwt:g}):"messages"===X?Object(Q.jsx)(Ve,{roster:pe,allUsers:K,client:l,API_BASE:je,MUC_LIGHT_HOSTNAME:de,jwt:g}):null})]}):Object(Q.jsx)("div",{className:"App",children:"Loading"})},rt=n(707),at=n(60),ct=n(708),st=(n(430),Object(o.createContext)({})),ot="visionable-xmpp-hostname",it=localStorage.getItem(ot)||prompt("Enter hostname","saas.visionable.one");localStorage.setItem(ot,it);var ut=function(){var e=Object(o.useState)(null),t=Object(a.a)(e,2),n=t[0],c=t[1],i=function(){var e=Object(r.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,lt(it);case 2:t=e.sent,at.default.configure({Auth:{region:t["aws-region"],userPoolId:t["aws-user-pool-id"],userPoolWebClientId:t["aws-user-pool-client-id"]}}),c(t);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();Object(o.useEffect)((function(){return i()}),[]);var u={HOSTNAME_KEY:ot};return n?Object(Q.jsx)(st.Provider,{value:u,children:Object(Q.jsx)(ct.a,{components:{Header:function(){return Object(Q.jsx)("div",{style:{textAlign:"center",marginBottom:"2em"},children:Object(Q.jsx)("img",{alt:"Visionable logo",style:{maxWidth:"300px"},src:"https://v3.visionable.io/images/visionable-logo.svg"})})}},signUpAttributes:["family_name","given_name","updated_at"],loginMechanisms:["email"],children:function(e){var t=e.signOut,n=e.user;return Object(Q.jsx)(nt,{signOutAWS:t,user:n,hostname:it})}})}):null};function lt(e){return dt.apply(this,arguments)}function dt(){return(dt=Object(r.a)(s.a.mark((function e(t){var n;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("https://".concat(t,"/config.json"),{mode:"cors"});case 3:return n=e.sent,e.next=6,n.json();case 6:return e.abrupt("return",e.sent);case 9:e.prev=9,e.t0=e.catch(0),console.log(e.t0),alert("Error requesting configuration data for this service"),localStorage.removeItem(ot),window.location.reload();case 15:case"end":return e.stop()}}),e,null,[[0,9]])})))).apply(this,arguments)}l.a.render(Object(Q.jsxs)(i.a.StrictMode,{children:[Object(Q.jsx)(rt.a,{}),Object(Q.jsx)(ut,{})]}),document.getElementById("root"))}},[[612,1,2]]]);
//# sourceMappingURL=main.2ccc295a.chunk.js.map