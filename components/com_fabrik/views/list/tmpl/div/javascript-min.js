/*! Fabrik */

window.addEvent("fabrik.loaded",function(){Array.from($$(".fabrikList tr")).each(function(a){document.id(a).addEvent("mouseover",function(o){(a.hasClass("oddRow0")||a.hasClass("oddRow1"))&&a.addClass("fabrikHover")},a),document.id(a).addEvent("mouseout",function(o){a.removeClass("fabrikHover")},a),document.id(a).addEvent("click",function(o){(a.hasClass("oddRow0")||a.hasClass("oddRow1"))&&($$(".fabrikList tr").each(function(o){o.removeClass("fabrikRowClick")}),a.addClass("fabrikRowClick"))},a)})});