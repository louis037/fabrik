/*! Fabrik */

var RepeatParams=new Class({initialize:function(e,t){this.opts=t,this.el=$(e),this.counter=this.el.getElements(".repeatGroup").length-1,this.el.getElement(".addButton").addEvent("click",function(e){new Event(e).stop();var t=this.el.getElements(".repeatGroup").pop(),n=this.counter+1,i=t.id.replace("-"+this.counter,"-"+n),a=new Element("div",{class:"repeatGroup",id:i}).set("html",t.innerHTML);a.inject(t,"after"),this.counter=n,0!=this.counter&&(a.getElements("input[name^=params], select[name^=params]").each(function(t){var e=!1,n="",i=t.id;if(""!==t.id){var a=t.id.split("-");a.pop(),n=a.join("-")+"-"+this.counter,t.id=n}if(Fabrik.adminElements.has(i)){var s=Fabrik.adminElements.get(i);e=new CloneObject(s,!0,[]);try{e.cloned(n,this.counter)}catch(e){fconsole("no clone method available for "+t.id)}}!1!==e&&Fabrik.adminElements.set(t.id,e)}.bind(this)),a.getElements("img[src=components/com_fabrik/images/ajax-loader.gif]").each(function(e){e.id=e.id.replace("-0_loader","-"+this.counter+"_loader")}.bind(this))),this.watchDeleteParamsGroup()}.bind(this)),this.watchDeleteParamsGroup()},watchDeleteParamsGroup:function(){var e=this.el.getParent().getElements(".delete");"null"!==typeOf(e)&&e.each(function(e){e.removeEvents(),e.addEvent("click",function(e){e=new Event(e),this.el.getParent().getElements(".repeatGroup").length-1>this.opts.repeatMin&&$(e.target).getParent(".repeatGroup").remove(),e.stop(),this.watchDeleteParamsGroup()}.bind(this))}.bind(this))}});