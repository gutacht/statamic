const g="/vendor/collaboration/build/assets/buddy-in-3654293a.mp3",$="/vendor/collaboration/build/assets/buddy-out-7b1108d4.mp3";class v{constructor(e){this.container=e,this.echo=null,this.started=!1,this.storeSubscriber=null,this.lastValues={},this.lastMetaValues={},this.user=Statamic.user,this.initialStateUpdated=!1,this.debouncedBroadcastValueChangeFuncsByHandle={},this.debouncedBroadcastMetaChangeFuncsByHandle={}}start(){this.started||(this.initializeEcho(),this.initializeStore(),this.initializeFocus(),this.initializeValuesAndMeta(),this.initializeHooks(),this.initializeStatusBar(),this.started=!0)}destroy(){this.storeSubscriber.apply(),this.echo.leave(this.channelName)}initializeEcho(){const e=this.container.reference.replaceAll("::",".");this.channelName=`${e}.${this.container.site.replaceAll(".","_")}`,this.channel=this.echo.join(this.channelName),this.channel.here(t=>{this.subscribeToVuexMutations(),Statamic.$store.commit(`collaboration/${this.channelName}/setUsers`,t)}),this.channel.joining(t=>{Statamic.$store.commit(`collaboration/${this.channelName}/addUser`,t),Statamic.$toast.success(`${t.name} has joined.`),this.whisper(`initialize-state-for-${t.id}`,{values:Statamic.$store.state.publish[this.container.name].values,meta:this.cleanEntireMetaPayload(Statamic.$store.state.publish[this.container.name].meta),focus:Statamic.$store.state.collaboration[this.channelName].focus}),Statamic.$config.get("collaboration.sound_effects")&&this.playAudio("buddy-in")}),this.channel.leaving(t=>{Statamic.$store.commit(`collaboration/${this.channelName}/removeUser`,t),Statamic.$toast.success(`${t.name} has left.`),this.blurAndUnlock(t),Statamic.$config.get("collaboration.sound_effects")&&this.playAudio("buddy-out")}),this.listenForWhisper("updated",t=>{this.applyBroadcastedValueChange(t)}),this.listenForWhisper("meta-updated",t=>{this.applyBroadcastedMetaChange(t)}),this.listenForWhisper(`initialize-state-for-${this.user.id}`,t=>{this.initialStateUpdated||(this.debug("✅ Applying broadcasted state change",t),Statamic.$store.dispatch(`publish/${this.container.name}/setValues`,t.values),Statamic.$store.dispatch(`publish/${this.container.name}/setMeta`,this.restoreEntireMetaPayload(t.meta)),_.each(t.focus,({user:s,handle:i})=>this.focusAndLock(s,i)),this.initialStateUpdated=!0)}),this.listenForWhisper("focus",({user:t,handle:s})=>{this.debug("Heard that user has changed focus",{user:t,handle:s}),this.focusAndLock(t,s)}),this.listenForWhisper("blur",({user:t,handle:s})=>{this.debug("Heard that user has blurred",{user:t,handle:s}),this.blurAndUnlock(t,s)}),this.listenForWhisper("force-unlock",({targetUser:t,originUser:s})=>{this.debug("Heard that user has requested another be unlocked",{targetUser:t,originUser:s}),t.id===this.user.id&&(document.activeElement.blur(),this.blurAndUnlock(this.user),this.whisper("blur",{user:this.user}),Statamic.$toast.info(`${s.name} has unlocked your editor.`,{duration:!1}))}),this.listenForWhisper("saved",({user:t})=>{Statamic.$toast.success(`Saved by ${t.name}.`)}),this.listenForWhisper("published",({user:t,message:s})=>{Statamic.$toast.success(`Published by ${t.name}.`);const i=s?`Entry has been published by ${t.name} with the message: ${s}`:`Entry has been published by ${t.name} with no message.`;Statamic.$components.append("CollaborationBlockingNotification",{props:{message:i}}).on("confirm",()=>window.location.reload()),this.destroy()}),this.listenForWhisper("revision-restored",({user:t})=>{Statamic.$toast.success(`Revision restored by ${t.name}.`),Statamic.$components.append("CollaborationBlockingNotification",{props:{message:`Entry has been restored to another revision by ${t.name}`}}).on("confirm",()=>window.location.reload()),this.destroy()})}initializeStore(){Statamic.$store.registerModule(["collaboration",this.channelName],{namespaced:!0,state:{users:[],focus:{}},mutations:{setUsers(e,t){e.users=t},addUser(e,t){e.users.push(t)},removeUser(e,t){e.users=e.users.filter(s=>s.id!==t.id)},focus(e,{handle:t,user:s}){Vue.set(e.focus,s.id,{handle:t,user:s})},blur(e,t){Vue.delete(e.focus,t.id)}}})}initializeStatusBar(){this.container.pushComponent("CollaborationStatusBar",{props:{channelName:this.channelName,connecting:this.connecting}}).on("unlock",t=>{this.whisper("force-unlock",{targetUser:t,originUser:this.user})})}initializeHooks(){Statamic.$hooks.on("entry.saved",(e,t,{reference:s})=>{s===this.container.reference&&this.whisper("saved",{user:this.user}),e()}),Statamic.$hooks.on("entry.published",(e,t,{reference:s,message:i})=>{s===this.container.reference&&this.whisper("published",{user:this.user,message:i}),e()}),Statamic.$hooks.on("revision.restored",(e,t,{reference:s})=>{if(s!==this.container.reference)return e();this.whisper("revision-restored",{user:this.user}),setTimeout(e,500)})}initializeFocus(){this.container.$on("focus",e=>{const t=this.user;this.focus(t,e),this.whisper("focus",{user:t,handle:e})}),this.container.$on("blur",e=>{const t=this.user;this.blur(t,e),this.whisper("blur",{user:t,handle:e})})}focus(e,t){Statamic.$store.commit(`collaboration/${this.channelName}/focus`,{user:e,handle:t})}focusAndLock(e,t){this.focus(e,t),Statamic.$store.commit(`publish/${this.container.name}/lockField`,{user:e,handle:t})}blur(e){Statamic.$store.commit(`collaboration/${this.channelName}/blur`,e)}blurAndUnlock(e,t=null){t=t||data_get(Statamic.$store.state.collaboration[this.channelName],`focus.${e.id}.handle`),t&&(this.blur(e),Statamic.$store.commit(`publish/${this.container.name}/unlockField`,t))}subscribeToVuexMutations(){this.storeSubscriber=Statamic.$store.subscribe((e,t)=>{switch(e.type){case`publish/${this.container.name}/setFieldValue`:this.vuexFieldValueHasBeenSet(e.payload);break;case`publish/${this.container.name}/setFieldMeta`:this.vuexFieldMetaHasBeenSet(e.payload);break}})}vuexFieldValueHasBeenSet(e){if(this.debug("Vuex field value has been set",e),!this.valueHasChanged(e.handle,e.value)){this.debug(`Value for ${e.handle} has not changed.`,{value:e.value,lastValue:this.lastValues[e.handle]});return}this.rememberValueChange(e.handle,e.value),this.debouncedBroadcastValueChangeFuncByHandle(e.handle)(e)}vuexFieldMetaHasBeenSet(e){if(this.debug("Vuex field meta has been set",e),!this.metaHasChanged(e.handle,e.value)){this.debug(`Meta for ${e.handle} has not changed.`,{value:e.value,lastValue:this.lastMetaValues[e.handle]});return}this.rememberMetaChange(e.handle,e.value),this.debouncedBroadcastMetaChangeFuncByHandle(e.handle)(e)}rememberValueChange(e,t){this.debug("Remembering value change",{handle:e,value:t}),this.lastValues[e]=clone(t)}rememberMetaChange(e,t){this.debug("Remembering meta change",{handle:e,value:t}),this.lastMetaValues[e]=clone(t)}debouncedBroadcastValueChangeFuncByHandle(e){const t=this.debouncedBroadcastValueChangeFuncsByHandle[e];return t||(this.debouncedBroadcastValueChangeFuncsByHandle[e]=_.debounce(s=>{this.broadcastValueChange(s)},500),this.debouncedBroadcastValueChangeFuncsByHandle[e])}debouncedBroadcastMetaChangeFuncByHandle(e){const t=this.debouncedBroadcastMetaChangeFuncsByHandle[e];return t||(this.debouncedBroadcastMetaChangeFuncsByHandle[e]=_.debounce(s=>{this.broadcastMetaChange(s)},500),this.debouncedBroadcastMetaChangeFuncsByHandle[e])}valueHasChanged(e,t){const s=this.lastValues[e]||null;return JSON.stringify(s)!==JSON.stringify(t)}metaHasChanged(e,t){const s=this.lastMetaValues[e]||null;return JSON.stringify(s)!==JSON.stringify(t)}broadcastValueChange(e){this.user.id==e.user&&this.whisper("updated",e)}broadcastMetaChange(e){this.user.id==e.user&&this.whisper("meta-updated",this.cleanMetaPayload(e))}cleanMetaPayload(e){const t=data_get(e,"value.__collaboration");if(!t)return e;let s={};return t.forEach(i=>s[i]=e.value[i]),e.value=s,e}cleanEntireMetaPayload(e){return _.mapObject(e,t=>{const s=data_get(t,"__collaboration");if(!s)return t;let i={};return s.forEach(n=>i[n]=t[n]),i})}restoreEntireMetaPayload(e){return _.mapObject(e,(t,s)=>({...this.lastMetaValues[s],...t}))}applyBroadcastedValueChange(e){this.debug("✅ Applying broadcasted value change",e),Statamic.$store.dispatch(`publish/${this.container.name}/setFieldValue`,e)}applyBroadcastedMetaChange(e){this.debug("✅ Applying broadcasted meta change",e);let t={...this.lastMetaValues[e.handle],...e.value};e.value=t,Statamic.$store.dispatch(`publish/${this.container.name}/setFieldMeta`,e)}debug(e,t){console.log("[Collaboration]",e,{...t})}isAlone(){return Statamic.$store.state.collaboration[this.channelName].users.length===1}whisper(e,t){if(this.isAlone())return;const s=2500,i=JSON.stringify(t),n=Math.random()+"";if(i.length<s){this.debug(`📣 Broadcasting "${e}"`,t),this.channel.whisper(e,t);return}e=`chunked-${e}`;for(let c=0;c*s<i.length;c++){const h={id:n,index:c,chunk:i.substr(c*s,s),final:s*(c+1)>=i.length};this.debug(`📣 Broadcasting "${e}"`,h),this.channel.whisper(e,h)}}listenForWhisper(e,t){this.channel.listenForWhisper(e,t);let s={};this.channel.listenForWhisper(`chunked-${e}`,i=>{s.hasOwnProperty(i.id)||(s[i.id]={chunks:[],receivedFinal:!1});let n=s[i.id];n.chunks[i.index]=i.chunk,i.final&&(n.receivedFinal=!0),n.receivedFinal&&n.chunks.length===Object.keys(n.chunks).length&&(t(JSON.parse(n.chunks.join(""))),delete s[i.id])})}playAudio(e){let t=document.createElement("audio");t.src=this.getViteAudioFile(e),document.body.appendChild(t),t.volume=.25,t.addEventListener("ended",()=>t.remove()),t.play()}getViteAudioFile(e){if(e==="buddy-in")return g;if(e==="buddy-out")return $;console.error("audio not found")}initializeValuesAndMeta(){this.lastValues=clone(Statamic.$store.state.publish[this.container.name].values),this.lastMetaValues=clone(Statamic.$store.state.publish[this.container.name].meta)}}class S{constructor(){this.echo=null,this.workspaces={}}boot(){this.echo&&Object.values(this.workspaces).forEach(e=>{e.echo=this.echo,e.start()})}addWorkspace(e){const t=new v(e);this.workspaces[e.name]=t,this.boot()}destroyWorkspace(e){this.workspaces[e.name].destroy(),delete this.workspaces[e.name]}}function b(a,e,t,s,i,n,c,h){var r=typeof a=="function"?a.options:a;e&&(r.render=e,r.staticRenderFns=t,r._compiled=!0),s&&(r.functional=!0),n&&(r._scopeId="data-v-"+n);var l;if(c?(l=function(o){o=o||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,!o&&typeof __VUE_SSR_CONTEXT__<"u"&&(o=__VUE_SSR_CONTEXT__),i&&i.call(this,o),o&&o._registeredComponents&&o._registeredComponents.add(c)},r._ssrRegister=l):i&&(l=h?function(){i.call(this,(r.functional?this.parent:this).$root.$options.shadowRoot)}:i),l)if(r.functional){r._injectStyles=l;var f=r.render;r.render=function(p,m){return l.call(m),f(p,m)}}else{var d=r.beforeCreate;r.beforeCreate=d?[].concat(d,l):[l]}return{exports:a,options:r}}const k={props:{container:{required:!0},channelName:{type:String,required:!0}},computed:{users(){return this.$store.state.collaboration[this.channelName].users},connecting(){return this.users.length===0}}};var C=function(){var e=this,t=e._self._c;return t("div",{staticClass:"collaboration-status-bar",class:{"-mt-2 mb-2":e.connecting||e.users.length>1}},[e.connecting?t("loading-graphic",{attrs:{inline:!0,size:16,text:"Attempting websocket connection..."}}):e._e(),e.users.length>1?t("div",{staticClass:"flex items-center"},e._l(e.users,function(s){return t("div",{key:s.id},[t("dropdown-list",{scopedSlots:e._u([{key:"trigger",fn:function(){return[t("avatar",{staticClass:"rounded-full w-6 h-6 mr-1 cursor-pointer text-xs",attrs:{user:s}})]},proxy:!0}],null,!0)},[t("dropdown-item",{attrs:{text:"Unlock"},on:{click:function(i){return e.$emit("unlock",s)}}})],1)],1)}),0):e._e()],1)},V=[],y=b(k,C,V,!1,null,null,null,null);const B=y.exports,F={props:["message"]};var w=function(){var e=this,t=e._self._c;return t("modal",{attrs:{name:"confirmation-modal",pivotY:.1,overflow:!1}},[t("div",{staticClass:"confirmation-modal flex flex-col h-full"},[t("div",{staticClass:"text-lg font-medium p-2 pb-0"},[e._v(" Refresh Required ")]),t("div",{staticClass:"flex-1 px-2 py-3 text-grey"},[e._v(" "+e._s(e.message)+" ")]),t("div",{staticClass:"p-2 bg-grey-20 border-t flex items-center justify-end text-sm"},[t("button",{staticClass:"btn btn-primary ml-2",on:{click:function(s){return e.$emit("confirm")}}},[e._v("Refresh")])])])])},M=[],N=b(F,w,M,!1,null,null,null,null);const H=N.exports,u=new S;Statamic.booting(()=>{Statamic.component("CollaborationStatusBar",B),Statamic.component("CollaborationBlockingNotification",H),Statamic.$store.registerModule("collaboration",{namespaced:!0})});Statamic.$echo.booted(a=>{u.echo=a,u.boot()});Statamic.$events.$on("publish-container-created",a=>{a.reference&&(u.addWorkspace(a),window.addEventListener("unload",()=>u.destroyWorkspace(a)))});Statamic.$events.$on("publish-container-destroyed",a=>{u.workspaces[a.name]&&u.destroyWorkspace(a)});