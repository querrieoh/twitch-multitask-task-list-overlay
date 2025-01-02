var G=m=>{throw TypeError(m)};var F=(m,T,C)=>T.has(m)||G("Cannot "+C);var p=(m,T,C)=>(F(m,T,"read from private field"),C?C.call(m):T.get(m)),I=(m,T,C)=>T.has(m)?G("Cannot add the same private member more than once"):T instanceof WeakSet?T.add(m):T.set(m,C),$=(m,T,C,U)=>(F(m,T,"write to private field"),U?U.call(m,C):T.set(m,C),C),y=(m,T,C)=>(F(m,T,"access private method"),C);(function(){"use strict";var _,B,b,S,V,L,E,g,w;let m,T,C=!1;function U(){const e=document.querySelector(".task-wrapper").clientHeight,t=document.querySelector(".task-container.primary"),s=t.scrollHeight,n=document.querySelector(".task-container.secondary");if(s>e&&!C){n.style.display="flex";const a=_settings.scrollSpeed.toString();let r=parseInt(a,10),d={duration:s/r*1e3,iterations:1,easing:"linear"};const i=getComputedStyle(document.documentElement).getPropertyValue("--card-gap-between").slice(0,-2);let u=s+parseInt(i,10),l=[{transform:"translateY(0)"},{transform:`translateY(-${u}px)`}],h=[{transform:"translateY(0)"},{transform:`translateY(-${u}px)`}];m=t.animate(l,d),T=n.animate(h,d),C=!0,W()}else s<=e&&(n.style.display="none",J())}function J(){m&&m.cancel(),T&&T.cancel(),C=!1}function W(){m&&(m.addEventListener("finish",A),m.addEventListener("cancel",A))}function A(){C=!1,U()}function P(o,e){o.innerText!==e&&(o.style.opacity="0",setTimeout(()=>{o.textContent=e,o.style.opacity="1"},700))}function j(o){const e=document.querySelector(":root");for(let[t,s]of Object.entries(o))t.includes("FontFamily")&&K(s),e.style.setProperty(Y(t),s)}function K(o){window.WebFont.load({google:{families:[`${o}:100,400,700`]}})}function Y(o){return`--${o.replace(/([A-Z])/g,"-$1").toLowerCase()}`}class q{constructor(e,t){this.username=this.validateUsername(e),this.userColor=(t==null?void 0:t.userColor)||"",this.tasks=[]}validateUsername(e){if(typeof e!="string")throw new Error("Username must be of type string");if(e=e.trim(),e.length===0)throw new Error("Username invalid");return e}addTask(e){return this.tasks.push(e),e}editTask(e,t){let s=this.getTask(e);return s?(s.setDescription(t),s):null}completeTask(e){let t=this.getTask(e);return t?(t.setCompletionStatus(!0),t):null}deleteTask(e){const t=[].concat(e).filter(n=>this.validTaskIndex(n)),s=[];return this.tasks=this.tasks.filter((n,a)=>t.includes(a)?(s.push(n),!1):!0),s}removeCompletedTasks(){const e=[];return this.tasks=this.tasks.filter(t=>t.isComplete()?(e.push(t),!1):!0),e}getTask(e){return this.validTaskIndex(e)?this.tasks[e]:null}getTasks(){return this.tasks}validTaskIndex(e){return!(typeof e!="number"||isNaN(e)||e<0||e>=this.tasks.length)}}class N{constructor(e){I(this,_);this.description=this.validateDescription(e),this.id=y(this,_,B).call(this),this.completionStatus=!1}validateDescription(e){if(typeof e!="string")throw new Error("Task description must be of type string");if(e=e.trim(),e.length===0)throw new Error("Task description invalid");return e}setDescription(e){this.description=this.validateDescription(e)}isComplete(){return this.completionStatus}setCompletionStatus(e){if(typeof e!="boolean")throw new Error("Completion status must be of type boolean");this.completionStatus=e}}_=new WeakSet,B=function(){const e=new Date,t=String(e.getDate()).padStart(2,"0"),s=String(e.getHours()).padStart(2,"0"),n=String(e.getMinutes()).padStart(2,"0"),a=String(e.getSeconds()).padStart(2,"0"),r=String(e.getMilliseconds()).padStart(3,"0"),c=Math.floor(Math.random()*1e4);return`${t}${s}${n}${a}${r}${c}`};class z{constructor(e="userList"){I(this,S);I(this,b);$(this,b,e),this.tasksCompleted=0,this.totalTasks=0,this.users=y(this,S,V).call(this)}getUser(e){return this.users.find(t=>t.username===e)}getAllUsers(){return this.users}createUser(e,t){if(this.getUser(e))throw new Error(`${e} already exists`);const s=new q(e,t);return this.users.push(s),s}addUserTasks(e,t){const s=this.getUser(e);if(!s)throw new Error(`${e} does not exist`);const n=[].concat(t),a=[];return n.forEach(r=>{a.push(s.addTask(new N(r))),this.totalTasks++}),y(this,S,L).call(this),a}editUserTask(e,t,s){const n=this.getUser(e);if(!n)throw new Error(`${e} has no tasks`);const a=n.editTask(t,s);if(!a)throw new Error(`Task ${t} not found`);return y(this,S,L).call(this),a}completeUserTasks(e,t){const s=this.getUser(e);if(!s)throw new Error(`User ${e} not found`);const n=[].concat(t).reduce((a,r)=>{const c=s.getTask(r);return c&&(c.isComplete()||(c.setCompletionStatus(!0),this.tasksCompleted++),a.push(c)),a},[]);return y(this,S,L).call(this),n}deleteUserTasks(e,t){const s=this.getUser(e);if(!s)throw new Error(`User ${e} not found`);const n=[].concat(t),a=s.deleteTask(n);return s.getTasks().length===0&&this.deleteUser(e),this.decreaseTaskCount(a),y(this,S,L).call(this),a}checkUserTasks(e,t="incomplete"){const s=this.getUser(e);if(!s)return new Map;const n=new Map;return s.getTasks().forEach((a,r)=>{t==="incomplete"&&!a.isComplete()&&n.set(r,a),t==="complete"&&a.isComplete()&&n.set(r,a)}),n}clearUserList(){this.users=[],this.tasksCompleted=0,this.totalTasks=0,y(this,S,L).call(this)}clearDoneTasks(){let e=[];return this.users.forEach(t=>{let s=t.removeCompletedTasks();this.decreaseTaskCount(s),e=e.concat(s)}),y(this,S,L).call(this),e}deleteUser(e){const t=this.users.findIndex(a=>RegExp(`^${e}`,"i").test(a.username));if(t===-1)throw new Error(`${e} not found`);const s=this.users[t],n=this.users.splice(t,1)[0];return this.decreaseTaskCount(n.getTasks()),y(this,S,L).call(this),s}decreaseTaskCount(e){e.forEach(t=>{t.isComplete()&&this.tasksCompleted--,this.totalTasks--})}}b=new WeakMap,S=new WeakSet,V=function(){const e=[];let t=localStorage.getItem(p(this,b));return t?JSON.parse(t).forEach(s=>{const n=new q(s.username,{userColor:s.userColor});s.tasks.map(a=>{const r=n.addTask(new N(a.description));this.totalTasks++,a.completionStatus&&(r.setCompletionStatus(a.completionStatus),this.tasksCompleted++)}),e.push(n)}):localStorage.setItem(p(this,b),JSON.stringify(e)),e},L=function(){localStorage.setItem(p(this,b),JSON.stringify(this.users))};const Q=document.getElementById("audioSample");class Z{constructor(e){I(this,E,null);this.userList=new z(e),j(_styles)}render(){this.renderTaskList(),this.renderTaskHeader()}renderTaskList(){if(this.userList.users.length===0)return;const e=document.createDocumentFragment();this.userList.getAllUsers().forEach(r=>{const c=R(r),d=c.querySelector("ol");r.tasks.forEach(i=>{const u=document.createElement("li");u.classList.add("task"),u.dataset.taskId=`${i.id}`,u.innerText=i.description,i.isComplete()&&u.classList.add("done"),d.appendChild(u)}),e.appendChild(c)});const t=e.cloneNode(!0),s=document.querySelector(".task-container.primary");s.innerHTML="",s.appendChild(t);const n=e.cloneNode(!0),a=document.querySelector(".task-container.secondary");a.innerHTML="",a.appendChild(n),U()}renderTaskHeader(){this.renderTaskCount();const{headerFeature:e,headerCustomText:t}=_settings;e.toLowerCase()==="timer"?this.renderTimer():e.toLowerCase()==="commands"?this.renderCommandTips():e.toLowerCase()==="text"&&this.renderCustomText(t)}renderTaskCount(){let e=this.userList.tasksCompleted,t=this.userList.totalTasks;const s=document.querySelector(".task-count");s.innerText=`${e}/${t}`}renderTimer(){document.querySelector(".timer").classList.remove("hidden")}startTimer(e=0,t=10){p(this,E)&&clearInterval(p(this,E));const s=document.querySelector(".timer"),n=s.querySelector(".timer-title"),a=s.querySelector(".timer-countdown");let r=e*60;P(n,"Focus");let c=!0;const d=()=>{const i=Math.floor(r/60).toString().padStart(2,"0"),u=(r%60).toString().padStart(2,"0");a.textContent=`${i}:${u}`,r===0?(clearInterval(p(this,E)),P(n,"Break"),a.textContent="00:00",Q.play(),r=t*60,c&&($(this,E,setInterval(d,1e3)),c=!1)):r--};$(this,E,setInterval(d,1e3))}renderCommandTips(){const e=["!task","!edit","!done","!delete","!check","!help"],t=document.querySelector(".command-tips");t.classList.remove("hidden");let s=0;setInterval(()=>{const n=t.querySelector(".command-code");P(n,e[s]),s=(s+1)%e.length},6e3)}renderCustomText(e){document.querySelector(".custom-header").classList.remove("hidden"),document.querySelector(".custom-text").textContent=e}chatHandler(e,t,s,n,a){t=`!${t.toLowerCase()}`;const{languageCode:r,maxTasksPerUser:c,headerFeature:d}=_settings;let i="",u="";try{if(X(n))if(d.toLowerCase()==="timer"&&_adminConfig.commands.timer.includes(t)&&n.broadcaster){const[l,h]=s.split("/"),f=parseInt(l,10),k=parseInt(h,10)||10;if(isNaN(f)||f<0||isNaN(k)||k<0)throw new Error("Invalid timer duration");return this.startTimer(f,k),i=_adminConfig.responseTo[r].timer,u=l,v(i,e,u)}else{if(_adminConfig.commands.clearList.includes(t))return this.userList.clearUserList(),this.clearListFromDOM(),i=_adminConfig.responseTo[r].clearList,v(i,e,u);if(_adminConfig.commands.clearDone.includes(t))return this.userList.clearDoneTasks().forEach(({id:h})=>{this.deleteTaskFromDOM(h)}),i=_adminConfig.responseTo[r].clearDone,v(i,e,u);if(_adminConfig.commands.clearUser.includes(t)){const l=this.userList.deleteUser(s);return this.deleteUserFromDOM(l),u=l.username,i=_adminConfig.responseTo[r].clearUser,v(i,e,u)}}if(_userConfig.commands.addTask.includes(t)){if(s==="")throw new Error("Task description is empty");let l=this.userList.getUser(e)||this.userList.createUser(e,{userColor:a.userColor});const h=s.split(", ");l.getTasks().length+h.length>parseInt(c.toString(),10)?i=_userConfig.responseTo[r].maxTasksAdded:(this.userList.addUserTasks(e,h).forEach(k=>{this.addTaskToDOM(l,k)}),u=s,i=_userConfig.responseTo[r].addTask)}else if(_userConfig.commands.editTask.includes(t)){const l=s.search(new RegExp("(?<=\\d)\\s"));if(l===-1)throw new Error("Task number or description format is invalid");const h=s.slice(0,l),f=s.slice(l+1),k=this.userList.editUserTask(e,M(h),f);this.editTaskFromDOM(k),u=h,i=_userConfig.responseTo[r].editTask}else if(_userConfig.commands.finishTask.includes(t)){const l=s.split(",").reduce((f,k)=>(M(k)>=0&&f.push(M(k)),f),[]),h=this.userList.completeUserTasks(e,l);h.forEach(({id:f})=>{this.completeTaskFromDOM(f)}),h.length===0?i=_userConfig.responseTo[r].noTaskFound:(u=h.reduce((f,k,O,H)=>{let fe=O===H.length-1?k.description:O===H.length-2?`${k.description}, & `:`${k.description}, `;return f=f.concat(fe),f},""),i=_userConfig.responseTo[r].finishTask)}else if(_userConfig.commands.deleteTask.includes(t))if(u=s,s.toLowerCase()==="all"){const l=this.userList.deleteUser(e);this.deleteUserFromDOM(l),i=_userConfig.responseTo[r].deleteAll}else{const l=s.split(",").reduce((f,k)=>(M(k)>=0&&f.push(M(k)),f),[]),h=this.userList.deleteUserTasks(e,l);h.forEach(({id:f})=>{this.deleteTaskFromDOM(f)}),h.length===0?i=_userConfig.responseTo[r].noTaskFound:i=_userConfig.responseTo[r].deleteTask}else if(_userConfig.commands.check.includes(t)){const l=this.userList.checkUserTasks(e),h=[];for(let[f,k]of l)h.push(`${f+1}. ${k.description}`);u=h.join(" | "),u===""?i=_userConfig.responseTo[r].noTaskFound:i=_userConfig.responseTo[r].check}else if(_userConfig.commands.help.includes(t))i=_userConfig.responseTo[r].help;else if(_userConfig.commands.additional.includes(t))i=_userConfig.responseTo[r].additional;else throw new Error("command not found");return v(i,e,u)}catch(l){return v(_userConfig.responseTo[r].invalidCommand,e,l.message,!0)}}clearListFromDOM(){const e=document.querySelector(".task-container.primary"),t=document.querySelector(".task-container.secondary");e.innerHTML="",t.innerHTML="",this.renderTaskCount()}addTaskToDOM(e,t){const s=document.querySelector(".task-container.primary"),n=document.querySelector(".task-container.secondary");if(document.querySelectorAll(`[data-user="${e.username}"]`).length===0){const d=R(e),i=d.cloneNode(!0);s.appendChild(d),n.appendChild(i)}const r=document.createElement("li");r.classList.add("task"),r.dataset.taskId=`${t.id}`,r.innerText=t.description;const c=r.cloneNode(!0);s.querySelector(`[data-user="${e.username}"] .tasks`).appendChild(r),n.querySelector(`[data-user="${e.username}"] .tasks`).appendChild(c),this.renderTaskCount(),U()}editTaskFromDOM(e){const t=document.querySelectorAll(`[data-task-id="${e.id}"]`);for(const s of t)s.innerText=e.description}completeTaskFromDOM(e){const t=document.querySelectorAll(`[data-task-id="${e}"]`);for(const s of t)s.classList.add("done");this.renderTaskCount()}deleteTaskFromDOM(e){const t=document.querySelectorAll(`[data-task-id="${e}"]`);for(const s of t)s.parentElement.children.length===1?s.parentElement.parentElement.remove():s.remove();this.renderTaskCount()}deleteUserFromDOM(e){const{username:t,tasks:s}=e,n=document.querySelectorAll(`[data-user="${t}"]`);for(let a of n)a.remove();this.renderTaskCount()}}E=new WeakMap;function v(o,e,t,s=!1){return{message:o.replace("{user}",e).replace("{message}",t),error:s}}function X(o){return o.broadcaster||o.mod}function M(o){return parseInt(o,10)-1}function R({username:o,userColor:e}){const t=document.createElement("div");t.classList.add("card"),t.dataset.user=o;const s=document.createElement("div");s.classList.add("username"),s.innerText=o,s.style.color=_settings.showUsernameColor?e:"",t.appendChild(s);const n=document.createElement("ol");return n.classList.add("tasks"),t.appendChild(n),t}function ee(){document.getElementById("modal").classList.remove("hidden"),document.getElementById("modal").classList.add("flex")}function te(){document.getElementById("modal").classList.remove("flex"),document.getElementById("modal").classList.add("hidden")}function se(o){const e={command:null,parameters:null,source:null,tags:null};let t=0,s=null,n=null,a=null,r=null;if(o[t]==="@"){let d=o.indexOf(" ");s=o.slice(1,d),t=d+1}if(o[t]===":"){t+=1;let d=o.indexOf(" ",t);n=o.slice(t,d),t=d+1}let c=o.indexOf(":",t);return c===-1&&(c=o.length),a=o.slice(t,c).trim(),c!==o.length&&(t=c+1,r=o.slice(t)),e.command=re(a),e.command===null?null:(s!==null&&(e.tags=ne(s)),e.source=oe(n),e.parameters=r,r&&r[0]==="!"&&(e.command=ae(r,e.command)),e)}function re(o){let e=null;const t=o.split(" ");switch(t[0]){case"JOIN":case"PART":case"NOTICE":case"CLEARCHAT":case"HOSTTARGET":case"PRIVMSG":e={command:t[0],channel:t[1]};break;case"PING":e={command:t[0]};break;case"CAP":e={command:t[0],isCapRequestEnabled:t[2]==="ACK"};break;case"GLOBALUSERSTATE":e={command:t[0]};break;case"USERSTATE":case"ROOMSTATE":e={command:t[0],channel:t[1]};break;case"RECONNECT":e={command:t[0]};break;case"421":return console.error(`Unsupported IRC command: ${t[2]}`),null;case"001":e={command:t[0]};break;case"002":case"003":case"004":case"353":case"366":case"372":case"375":case"376":return null;default:return console.log(`Unexpected command: ${t[0]}`),null}return e}function ne(o){const e={"client-nonce":null,flags:null};let t={};return o.split(";").forEach(n=>{let a=n.split("="),r=a[1]===""?null:a[1];switch(a[0]){case"badges":case"badge-info":if(r){let d={};r.split(",").forEach(u=>{let l=u.split("/");d[l[0]]=l[1]}),t[a[0]]=d}else t[a[0]]=null;break;case"emotes":if(r){let d={};r.split("/").forEach(u=>{let l=u.split(":"),h=[];l[1].split(",").forEach(k=>{let O=k.split("-");h.push({startPosition:O[0],endPosition:O[1]})}),d[l[0]]=h}),t[a[0]]=d}else t[a[0]]=null;break;case"emote-sets":let c=r.split(",");t[a[0]]=c;break;default:e.hasOwnProperty(a[0])||(t[a[0]]=r)}}),t}function oe(o){if(o==null)return null;{let e=o.split("!");return{nick:e.length==2?e[0]:null,host:e.length==2?e[1]:e[0]}}}function ae(o,e){let s=o.slice(0+1).trim(),n=s.indexOf(" ");return n===-1?(e.botCommand=s.slice(0),e.botCommandParams=""):(e.botCommand=s.slice(0,n),e.botCommandParams=s.slice(n).trim()),e}class ie{constructor(){this.events=new Map}on(e,t){this.events.has(e)||this.events.set(e,[]),this.events.get(e).push(t)}emit(e,...t){this.events.has(e)&&this.events.get(e).forEach(s=>s(...t))}off(e,t){if(this.events.has(e)){const s=this.events.get(e),n=s.indexOf(t);n!==-1&&(s.splice(n,1),s.length===0&&this.events.delete(e))}}once(e,t){const s=(...n)=>{t(...n),this.off(e,s)};this.on(e,s)}}class ce extends ie{constructor(t,{username:s,authToken:n,channel:a},r=WebSocket){super();I(this,g,null);I(this,w,1e3);this.url=t,this.username=s.toLowerCase(),this.channel=`#${a.toLowerCase()}`,this.authToken=n.includes("oauth:")?n:`oauth:${n}`,this.WebSocketService=r}connect(){$(this,g,new this.WebSocketService(this.url)),p(this,g).onopen=()=>{p(this,g).send("CAP REQ :twitch.tv/tags twitch.tv/commands"),p(this,g).send(`PASS ${this.authToken}`),p(this,g).send(`NICK ${this.username}`)},p(this,g).onerror=t=>(console.error("websocket error: ",t),t),p(this,g).onmessage=t=>{(t==null?void 0:t.data).trim().split(`\r
`).forEach(a=>{const r=se(a);if(r)switch(r.command.command){case"PRIVMSG":if(r.parameters.startsWith("!")){const c=le(r);this.emit("command",c)}break;case"PING":p(this,g).send("PONG "+r.parameters);break;case"001":p(this,g).send(`JOIN ${this.channel}`);break;case"JOIN":console.log(`Joined ${this.channel}`),$(this,w,1e3),this.emit("oauthSuccess");break;case"RECONNECT":this.disconnect(1012,"The Twitch IRC server is terminating the connection for maintenance reasons.");break;case"PART":console.error("The channel must have banned (/ban) the bot."),p(this,g).close();break;case"NOTICE":console.error(`${r.parameters}; left ${this.channel}`),this.emit("oauthError"),p(this,g).send(`PART ${this.channel}`);break}})},p(this,g).onclose=t=>{switch(t.code){case 1e3:console.log("Connection closed normally.");break;case 1006:console.error(`Connection dropped. Reconnecting in ${p(this,w)} milliseconds...`);let s=p(this,w);setTimeout(()=>{this.connect()},s),$(this,w,p(this,w)*2);break;case 1012:console.log("Switching  servers..."),this.connect();break;default:console.error(`Unhandled code: ${t.code}. Reason: ${t.reason}`)}}}say(t,s){var n;if(((n=p(this,g))==null?void 0:n.readyState)===WebSocket.OPEN){const r=[s?`@reply-parent-msg-id=${s}`:"","PRIVMSG",this.channel,`:${t}`].join(" ").trim();p(this,g).send(r)}else console.error("Connection is not open")}disconnect(t=1e3,s=""){p(this,g).close(t,s)}}g=new WeakMap,w=new WeakMap;function le(o){var e,t;return{user:o.tags["display-name"],command:o.command.botCommand,message:o.command.botCommandParams||"",flags:{broadcaster:!!((e=o.tags.badges)!=null&&e.broadcaster),mod:!!((t=o.tags.badges)!=null&&t.moderator)},extra:{userColor:o.tags.color,messageId:o.tags.id}}}function de(o){o.emit("command",{user:"adminUser",command:"clearList",message:"",flags:{broadcaster:!0,mod:!1},extra:{userColor:"#FF0000",messageId:`${D()}`}});const e=["red","coral","springGreen","lightSeaGreen","slateBlue","hotpink","violet","orange","darkTurquoise","dodgerblue","blueviolet"],{maxTasksPerUser:t}=_settings;for(let s=1;s<=8;s++){const n=`Username${s}`,a=e[s-1];for(let r=0;r<t;r++){const c={user:n,command:"task",message:`test task description ${r===2?"longer text example":""}`,flags:{broadcaster:!0,mod:!1},extra:{userColor:a,messageId:`${D()}`}};setTimeout(()=>{o.emit("command",c)},1e3*s+r*100)}setTimeout(()=>{const r={user:n,command:"done",message:"1",flags:{broadcaster:!0,mod:!1},extra:{userColor:a,messageId:`${D()}`}};o.emit("command",r)},1e3*s+1e4)}}function D(){return`${Math.floor(Math.random()*1e9)}`}const{twitch_channel:ue,twitch_oauth:me,twitch_username:he}=_authConfig,pe="ws://irc-ws.chat.twitch.tv:80",x=new ce(pe,{username:he,authToken:me,channel:ue});window.addEventListener("load",()=>{let o="userList";_settings.testMode&&(console.log("Test mode enabled"),o="testUserList");const e=new Z(o);e.render(),x.on("command",t=>{const{user:s,command:n,message:a,flags:r,extra:c}=t,d=e.chatHandler(s,n,a,r,c);d.error?console.error(d.message):x.say(d.message,c.messageId)}),x.on("oauthError",()=>{ee()}),x.on("oauthSuccess",()=>{te()}),x.connect(),_settings.testMode&&de(x)})})();
