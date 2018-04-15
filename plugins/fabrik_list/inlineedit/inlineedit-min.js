/*! Fabrik */

define(["jquery","fab/list-plugin","fab/fabrik"],function(jQuery,FbListPlugin,Fabrik){var FbListInlineedit=new Class({Extends:FbListPlugin,initialize:function(t){if(this.parent(t),this.defaults={},this.editors={},this.inedit=!1,this.saving=!1,"null"===typeOf(this.getList().getForm()))return!1;this.listid=this.options.listid,this.setUp(),Fabrik.addEvent("fabrik.list.clearrows",function(){this.cancel()}.bind(this)),Fabrik.addEvent("fabrik.list.inlineedit.stopEditing",function(){this.stopEditing()}.bind(this)),Fabrik.addEvent("fabrik.list.updaterows",function(){this.watchCells()}.bind(this)),Fabrik.addEvent("fabrik.list.ini",function(){var i=this.getList(),t=i.form.toQueryString().toObject();t.format="raw",t.listref=this.options.ref,new Request.JSON({url:"",data:t,onComplete:function(){console.log("complete")},onSuccess:function(t){t=Json.evaluate(t.stripScripts()),i.options.data=t.data}.bind(this),onFailure:function(t){console.log("ajax inline edit failure",t)},onException:function(t,i){console.log("ajax inline edit exception",t,i)}}).send()}.bind(this)),Fabrik.addEvent("fabrik.element.click",function(){1===Object.getLength(this.options.elements)&&!1===this.options.showSave&&this.save(null,this.editing)}.bind(this)),Fabrik.addEvent("fabrik.list.inlineedit.setData",function(){"null"!==typeOf(this.editOpts)&&($H(this.editOpts.plugins).each(function(t){var i=Fabrik["inlineedit_"+this.editOpts.elid].elements[t];delete i.element,i.update(this.editData[t]),i.select()}.bind(this)),this.watchControls(this.editCell),this.setFocus(this.editCell))}.bind(this)),window.addEvent("click",function(t){!t.target.hasClass("fabrik_element")&&this.td&&(this.td.removeClass(this.options.focusClass),this.td=null)}.bind(this))},setUp:function(){"null"!==typeOf(this.getList().getForm())&&(this.scrollFx=new Fx.Scroll(window,{wait:!1}),this.watchCells(),document.addEvent("keydown",function(t){this.checkKey(t)}.bind(this)))},watchCells:function(){var e=!1;this.getList().getForm().getElements(".fabrik_element").each(function(i,t){if(this.canEdit(i)){if(!e&&this.options.loadFirst&&(e=this.edit(null,i))&&this.select(null,i),!this.isEditable(i))return;this.setCursor(i),i.removeEvents(),i.addEvent(this.options.editEvent,function(t){this.edit(t,i)}.bind(this)),i.addEvent("click",function(t){this.select(t,i)}.bind(this)),i.addEvent("mouseenter",function(t){this.isEditable(i)||i.setStyle("cursor","pointer")}.bind(this)),i.addEvent("mouseleave",function(t){i.setStyle("cursor","")})}}.bind(this))},checkKey:function(t){var i,e,n;if("element"===typeOf(this.td))switch(t.code){case 39:if(this.inedit)return;"element"===typeOf(this.td.getNext())&&(t.stop(),this.select(t,this.td.getNext()));break;case 9:if(this.inedit)return void(this.options.tabSave&&("element"===typeOf(this.editing)?this.save(t,this.editing):this.edit(t,this.td)));break;case 37:if(this.inedit)return;"element"===typeOf(this.td.getPrevious())&&(t.stop(),this.select(t,this.td.getPrevious()));break;case 40:if(this.inedit)return;if(e=this.td.getParent(),"null"===typeOf(e))return;n=e.getElements("td").indexOf(this.td),"element"===typeOf(e.getNext())&&(t.stop(),i=e.getNext().getElements("td"),this.select(t,i[n]));break;case 38:if(this.inedit)return;if(e=this.td.getParent(),"null"===typeOf(e))return;n=e.getElements("td").indexOf(this.td),"element"===typeOf(e.getPrevious())&&(t.stop(),i=e.getPrevious().getElements("td"),this.select(t,i[n]));break;case 27:t.stop(),this.inedit?(this.select(t,this.editing),this.cancel(t)):(this.td.removeClass(this.options.focusClass),this.td=null);break;case 13:if(this.inedit||"element"!==typeOf(this.td))return;if(t.stop(),"element"===typeOf(this.editing)){if(this.editors[this.activeElementId].contains("<textarea"))return;this.save(t,this.editing)}else this.edit(t,this.td)}},select:function(t,i){if(this.isEditable(i)){var e=this.getElementName(i),n=this.options.elements[e];if(!1!==typeOf(n)&&("element"===typeOf(this.td)&&this.td.removeClass(this.options.focusClass),this.td=i,"element"===typeOf(this.td)&&this.td.addClass(this.options.focusClass),"null"!==typeOf(this.td)&&t&&"click"!==t.type&&"mouseover"!==t.type)){var s=this.td.getPosition(),a=s.x-window.getSize().x/2-this.td.getSize().x/2,o=s.y-window.getSize().y/2+this.td.getSize().y/2;this.scrollFx.start(a,o)}}},getElementName:function(t){return t.className.trim().split(" ").filter(function(t,i){return"fabrik_element"!==t&&"fabrik_row"!==t&&!t.contains("hidden")})[0].replace("fabrik_row___","")},setCursor:function(t){var i=this.getElementName(t),e=this.options.elements[i];"null"!==typeOf(e)&&(t.addEvent("mouseover",function(t){this.isEditable(t.target)&&t.target.setStyle("cursor","pointer")}),t.addEvent("mouseleave",function(t){this.isEditable(t.target)&&t.target.setStyle("cursor","")}))},isEditable:function(t){var i;return!(t.hasClass("fabrik_uneditable")||t.hasClass("fabrik_ordercell")||t.hasClass("fabrik_select")||t.hasClass("fabrik_actions"))&&(i=this.getRowId(t.getParent(".fabrik_row")),this.getList().firePlugin("onCanEditRow",i))},getPreviousEditable:function(t){for(var i=!1,e=this.getList().getForm().getElements(".fabrik_element"),n=e.length;0<=n;n--){if(i&&this.canEdit(e[n]))return e[n];e[n]===t&&(i=!0)}return!1},getNextEditable:function(e){var n=!1;return this.getList().getForm().getElements(".fabrik_element").filter(function(t,i){return n&&this.canEdit(t)?!(n=!1):(t===e&&(n=!0),!1)}.bind(this)).getLast()},canEdit:function(t){if(!this.isEditable(t))return!1;var i=this.getElementName(t),e=this.options.elements[i];return"null"!==typeOf(e)},edit:function(e,td){if(!this.saving){if(Fabrik.fireEvent("fabrik.plugin.inlineedit.editing"),this.inedit){if("mouseover"!==this.options.editEvent)return;if(td===this.editing)return;this.select(e,this.editing),this.cancel()}if(!this.canEdit(td))return!1;"null"!==typeOf(e)&&e.stop();var element=this.getElementName(td),rowid=this.getRowId(td),opts=this.options.elements[element];if("null"!==typeOf(opts)){this.inedit=!0,this.editing=td,this.activeElementId=opts.elid,this.defaults[rowid+"."+opts.elid]=td.innerHTML;var data=this.getDataFromTable(td);if("null"===typeOf(this.editors[opts.elid])||"null"===typeOf(Fabrik["inlineedit_"+opts.elid])){Fabrik.loader.start(td.getParent());var inline=this.options.showSave?1:0,editRequest=new Request({evalScripts:function(t,i){this.javascript=t}.bind(this),evalResponse:!1,url:"",data:{element:element,elid:opts.elid,elementid:Object.values(opts.plugins),rowid:rowid,listref:this.options.ref,formid:this.options.formid,listid:this.options.listid,inlinesave:inline,inlinecancel:this.options.showCancel,option:"com_fabrik",task:"form.inlineedit",format:"raw"},onSuccess:function(t){Fabrik.loader.stop(td.getParent()),function(){window.Browser.exec(this.javascript),Fabrik.tips.attach(".fabrikTip")}.bind(this).delay(100),td.empty().set("html",t),this.clearSelection(),t=t+'<script type="text/javascript">'+this.javascript+"<\/script>",this.editors[opts.elid]=t,this.watchControls(td),this.setFocus(td)}.bind(this),onFailure:function(t){this.saving=!1,this.inedit=!1,Fabrik.loader.stop(td.getParent()),window.alert(editRequest.getHeader("Status"))}.bind(this),onException:function(t,i){this.saving=!1,this.inedit=!1,Fabrik.loader.stop(td.getParent()),window.alert("ajax inline edit exception "+t+":"+i)}.bind(this)}).send()}else{var html=this.editors[opts.elid].stripScripts(function(t){this.javascript=t}.bind(this));td.empty().set("html",html),eval(this.javascript),this.clearSelection(),Fabrik.tips.attach(".fabrikTip"),this.editOpts=opts,this.editData=data,this.editCell=td}return!0}}},clearSelection:function(){document.selection?document.selection.empty():window.getSelection().removeAllRanges()},getDataFromTable:function(t){var i=this.getList().options.data,e=this.getElementName(t),n=t.getParent(".fabrik_row").id,s={};this.vv=[],"object"===typeOf(i)&&(i=$H(i)),i.each(function(t){if("array"===typeOf(t))for(var i=0;i<t.length;i++)t[i].id===n&&this.vv.push(t[i]);else t.filter(function(t){return t.id===n})}.bind(this));var a=this.options.elements[e];return 0<this.vv.length&&$H(a.plugins).each(function(t,i){s[t]=this.vv[0].data[i+"_raw"]}.bind(this)),s},setTableData:function(t,e,n){var s=t.id,i=this.getList().options.data;"object"===typeOf(i)&&(i=$H(i)),i.each(function(t,i){t.each(function(t,i){t.id===s&&(t.data[e+"_raw"]=n,this.currentRow=t)}.bind(this))}.bind(this))},setFocus:function(t){if(!window.Browser.ie){var i=t.getElement(".fabrikinput");"null"!==typeOf(i)&&function(){"null"!==typeOf(i)&&i.focus()}.delay(1e3)}},watchControls:function(i){"null"!==typeOf(i.getElement(".inline-save"))&&i.getElement(".inline-save").removeEvents("click").addEvent("click",function(t){this.save(t,i)}.bind(this)),"null"!==typeOf(i.getElement(".inline-cancel"))&&i.getElement(".inline-cancel").removeEvents("click").addEvent("click",function(t){this.cancel(t,i)}.bind(this))},save:function(t,n){var i,e=this.getElementName(n),s=this.options.elements[e],a=this.editing.getParent(".fabrik_row"),o=this.getRowId(a),l={},r={};if(this.editing){if(this.saving=!0,this.inedit=!1,t&&t.stop(),i=Fabrik["inlineedit_"+s.elid],"null"===typeOf(i))return fconsole("issue saving from inline edit: eObj not defined"),this.cancel(t),!1;Fabrik.loader.start(n.getParent()),r={option:"com_fabrik",task:"form.process",format:"raw",packageId:1,fabrik_ajax:1,element:e,listref:this.options.ref,elid:s.elid,plugin:s.plugin,rowid:o,listid:this.options.listid,formid:this.options.formid,fabrik_ignorevalidation:1,fabrik_ignorevalidation:0,join:{}},$H(i.elements).each(function(t){t.getElement();var i=t.getValue(),e=t.options.joinId;this.setTableData(a,t.options.element,i),t.options.isJoin?("object"!==typeOf(r.join[e])&&(r.join[e]={}),r.join[e][t.options.elementName]=i):r[t.options.element]=i}.bind(this)),$H(this.currentRow.data).each(function(t,i){"_raw"===i.substr(i.length-4,4)&&(l[i.substr(0,i.length-4)]=t)}),(r=Object.append(l,r))[i.token]=1,r.toValidate=this.options.elements[r.element].plugins,this.saveRequest=new Request({url:"",data:r,evalScripts:!0,onSuccess:function(t){n.empty(),n.empty().set("html",t),Fabrik.loader.stop(n.getParent()),Fabrik.fireEvent("fabrik.list.updaterows"),this.stopEditing(),this.saving=!1}.bind(this),onFailure:function(t){var i=n.getElement(".inlineedit .fabrikMainError");"null"===typeOf(i)&&(i=new Element("div.fabrikMainError.fabrikError.alert.alert-error")).inject(n.getElement("form"),"top"),this.saving=!1,Fabrik.loader.stop(n.getParent());var e=t.statusText;"null"===typeOf(e)&&(e="uncaught error"),i.set("html",e)}.bind(this),onException:function(t,i){Fabrik.loader.stop(n.getParent()),this.saving=!1,window.alert("ajax inline edit exception "+t+":"+i)}.bind(this)}).send()}},stopEditing:function(t){this.editing,this.editing=null,this.inedit=!1},cancel:function(t){if(t&&t.stop(),"element"===typeOf(this.editing)){var i=this.editing.getParent(".fabrik_row");if(!1!==i){var e=this.getRowId(i),n=this.editing;if(!1!==n){var s=this.getElementName(n),a=this.options.elements[s],o=this.defaults[e+"."+a.elid];n.set("html",o)}this.stopEditing()}}}});return FbListInlineedit});