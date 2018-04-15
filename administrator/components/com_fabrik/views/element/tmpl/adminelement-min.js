/*! Fabrik */

define(["jquery","admin/pluginmanager"],function(a,e){return new Class({Extends:e,Implements:[Options,Events],options:{id:0,parentid:0,jsevents:[],jsTotal:0,deleteButton:"removeButton"},jsCounter:-1,jsAjaxed:0,initialize:function(e,t,n){Fabrik.debug&&fconsole("Fabrik adminelement.js: Initialising",e,t,n),this.parent(e,n,"validationrule"),this.setOptions(t),this.setParentViz(),this.jsAccordion=new Fx.Accordion([],[],{alwaysHide:!0,display:-1,duration:"short"}),window.addEvent("domready",function(){"null"===typeOf(document.id("addJavascript"))?fconsole("Fabrik adminelement.js: javascript tab Add button not found"):document.id("addJavascript").addEvent("click",function(e){e.stop(),this.jsAccordion.display(-1),this.addJavascript()}.bind(this)),this.watchLabel(),this.watchGroup(),this.options.jsevents.each(function(e){this.addJavascript(e)}.bind(this)),this.jsPeriodical=this.iniJsAccordion.periodical(100,this),document.id("jform_plugin").addEvent("change",function(e){this.changePlugin(e.target.get("value"))}.bind(this)),""===document.getElement("input[name=name_orig]").value&&this.changePlugin("field"),document.id("javascriptActions").addEvent("click:relay(a[data-button=removeButton])",function(e,t){e.stop(),this.deleteJS(t)}.bind(this)),document.id("javascriptActions").addEvent('change:relay(select[id^="jform_action-"],select[id^="jform_js_e_event-"],select[id^="jform_js_e_trigger-"],select[id^="jform_js_e_condition-"],input[id^="jform_js_e_value-"])',function(e,t){this.setAccordionHeader(t.getParent(".actionContainer"))}.bind(this)),document.id("javascriptActions").addEvent('click:relay(input[id^="jform_js_published-"])',function(e,t){this.setAccordionHeader(t.getParent(".actionContainer"))}.bind(this));var e=document.id("plugins");"null"!==typeOf(e)&&e.addEvent("click:relay(h3.title)",function(e,t){document.id("plugins").getElements("h3.title").each(function(e){e!==t&&e.removeClass("pane-toggler-down")}),t.toggleClass("pane-toggler-down")})}.bind(this))},watchLabel:function(){this.autoChangeDbName=""===a("#jform_name").val(),a("#jform_label").on("keyup",function(e){if(this.autoChangeDbName){var t=a("#jform_label").val().trim().toLowerCase();t=t.replace(/\W+/g,"_"),a("#jform_name").val(t)}}.bind(this)),a("#jform_name").on("keyup",function(){this.autoChangeDbName=!1}.bind(this))},watchGroup:function(){var i="fabrik_element_group";if(""===a("#jform_group_id").val()){var e=document.cookie.match("(^|;) ?"+i+"=([^;]*)(;|$)"),t=e?e[2]:null;a("#jform_group_id").val(t)}a("#jform_group_id").on("change",function(){var e=a("#jform_group_id").val(),t=new Date;t.setTime(t.getTime()+864e5);var n="; expires="+t.toGMTString();document.cookie=i+"="+encodeURIComponent(e)+n})},iniJsAccordion:function(){this.jsAjaxed===this.options.jsevents.length&&(1===this.options.jsevents.length?this.jsAccordion.display(0):this.jsAccordion.display(-1),clearInterval(this.jsPeriodical))},changePlugin:function(e){document.id("plugin-container").empty().adopt(new Element("span").set("text",Joomla.JText._("COM_FABRIK_LOADING")));var t=new Request({url:"index.php",evalResponse:!1,evalScripts:function(e,t){this.script=e}.bind(this),data:{option:"com_fabrik",id:this.options.id,task:"element.getPluginHTML",format:"raw",plugin:e},update:document.id("plugin-container"),onComplete:function(e){document.id("plugin-container").set("html",e),Browser.exec(this.script),this.updateBootStrap(),FabrikAdmin.reTip()}.bind(this)});Fabrik.requestQueue.add(t)},deleteJS:function(e){var t=e.getParent("div.actionContainer");Fabrik.debug&&fconsole("Fabrik adminelement.js: Deleting JS entry: ",t.id),t.dispose(),this.jsAjaxed--},addJavascript:function(e){var t=e&&e.id?e.id:0,n=new Element("div.actionContainer.panel.accordion-group"),i=new Element("a.accordion-toggle",{href:"#"});i.adopt(new Element("span.pluginTitle").set("text",Joomla.JText._("COM_FABRIK_LOADING")));var a=new Element("div.title.pane-toggler.accordion-heading").adopt(new Element("strong").adopt(i)),o=new Element("div.accordion-body");n.adopt(a),n.adopt(o),this.jsAccordion.addSection(a,o),n.inject(document.id("javascriptActions"));var d=this.jsCounter,s=new Request.HTML({url:"index.php",data:{option:"com_fabrik",view:"plugin",task:"top",format:"raw",type:"elementjavascript",plugin:null,plugin_published:!0,c:d,id:t,elementid:this.id},update:o,onRequest:function(){Fabrik.debug&&fconsole("Fabrik adminelement.js: Adding JS entry",(d+1).toString())},onComplete:function(e){o.getElement('textarea[id^="jform_code-"]').addEvent("change",function(e,t){this.setAccordionHeader(e.target.getParent(".actionContainer"))}.bind(this)),this.setAccordionHeader(n),this.jsAjaxed++,this.updateBootStrap(),FabrikAdmin.reTip()}.bind(this),onFailure:function(e){fconsole("Fabrik adminelement.js addJavascript: ajax failure: ",e)},onException:function(e,t){fconsole("Fabrik adminelement.js addJavascript: ajax exception: ",e,t)}});this.jsCounter++,Fabrik.requestQueue.add(s),this.updateBootStrap(),FabrikAdmin.reTip()},setAccordionHeader:function(e){if("null"!==typeOf(e)){var t=e.getElement("span.pluginTitle"),n=e.getElement('select[id^="jform_action-"]');if(""!==n.value){var i="on "+n.getSelected()[0].text+": ",a=e.getElements('input[id^="jform_js_published-"]'),o="";a.forEach(function(e){e.getProperty("checked")&&(o=e.value)});var d=e.getElement('textarea[id^="jform_code-"]'),s=e.getElement('select[id^="jform_js_e_event-"]'),r=e.getElement('select[id^="jform_js_e_trigger-"]'),c=document.id("jform_name"),l=e.getElement('input[id^="jform_js_e_value-"]'),u=e.getElement('select[id^="jform_js_e_condition-"]'),p="";if(""!==d.value.clean()){var m=d.value.split("\n")[0].trim().match(/^\/\*(.*)\*\//);p=m?m[1]:Joomla.JText._("COM_FABRIK_JS_INLINE_JS_CODE"),d.value.replace(/(['"]).*?[^\\]\1/g,"").test("//")&&(p+=' &nbsp; <span style="color:red;font-weight:bold;">',p+=Joomla.JText._("COM_FABRIK_JS_INLINE_COMMENT_WARNING").replace(/ /g,"&nbsp;"),p+="</span>")}else if(s.value&&r.value&&c.value){p=Joomla.JText._("COM_FABRIK_JS_WHEN_ELEMENT")+" ",u.getSelected()[0].text.test(/hidden|shown/)?(p+=Joomla.JText._("COM_FABRIK_JS_IS")+" ",p+=u.getSelected()[0].text+", "):p+=u.getSelected()[0].text+' "'+l.value.trim()+'", ';var g=r.getSelected().getParent("optgroup").get("label")[0].toLowerCase();p+=s.getSelected()[0].text+" "+g.substring(0,g.length-1),p+=' "'+r.getSelected()[0].text+'"'}else i+='<span style="color:red;">'+Joomla.JText._("COM_FABRIK_JS_NO_ACTION")+"</span>";""!==p&&(i+='<span style="font-weight:normal">'+p+"</span>"),i='<span style="color:'+(0==o?"#bd362f":"#46a546")+'">'+i+"</span>",t.set("html",i)}else t.set("html",'<span style="color:red;">'+Joomla.JText._("COM_FABRIK_JS_SELECT_EVENT")+"</span>")}},setParentViz:function(){if(0!==this.options.parentid.toInt()){var t=new Fx.Tween("elementFormTable",{property:"opacity",duration:500,wait:!1}).set(0);document.id("unlink").addEvent("click",function(e){this.checked?t.start(0,1):t.start(1,0)})}document.id("swapToParent")&&document.id("swapToParent").addEvent("click",function(e){var t=document.adminForm;t.task.value="element.parentredirect";var n=e.target.className.replace("element_","");t.redirectto.value=n,t.submit()})}})});