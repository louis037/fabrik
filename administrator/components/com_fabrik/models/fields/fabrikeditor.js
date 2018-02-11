/**
 * Fabrik Ace Editor initialiser
 *
 * @copyright: Copyright (C) 2005-2013, fabrikar.com - All rights reserved.
 * @license:   GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

/*jshint mootools: true */
/*global Fabrik:true, fconsole:true, Joomla:true, CloneObject:true, $H:true,unescape:true,Asset:true */

define(["lib/ace/src-min-noconflict/ace"], function (aceModule) {
    FabrikEditor = function(id, theme, mode, height, width) {
        var field = document.getElementById(id);
        if (field === null) {
            fconsole("fabrikeditor: Cannot find field", id);
            return;
        }
        // Check if we have parent divs needed
        var parent = field.parentElement, containerDiv, aceDiv;
        if (parent.tag !== "div" || parent.id.slice(-13) !== "-aceContainer") {
            // Add parent and sibling containers)
            containerDiv = document.createElement("div");
            containerDiv.id = id + "-aceContainer";
            aceDiv = document.createElement("div");
            aceDiv.id = id + "-ace";
            containerDiv.appendChild(aceDiv);
            containerDiv = parent.insertBefore(containerDiv, field);
            containerDiv.appendChild(field);
        }
        // pluginmanager.js renames names/ids when you delete a preceding plugin which breaks ace
        // so we need to keep ace-ids intact and avoid issues with duplicate ids by:
        //     adding a random string to the id where ace needs id to be kept the same; and
        //     save dom object for textarea so that change of id doesn"t break it.
        var aceId = id + "_" + ("00000" + (Math.random() * 0xffffff).toString(16)).slice(-6);
        containerDiv = field.parentElement;
        containerDiv.id = aceId + "-aceContainer";
        containerDiv.style = "position:relative; width:" + width + "; height:" + height + ";";
        aceDiv = containerDiv.querySelector("[id$='-ace']");
        if (!aceDiv) {
            fconsole("fabrikeditor: cannot find ace container to randomise", id + "-ace");
            return;
        }
        aceDiv.id = aceId + "-ace";
        aceDiv.className += " fbeditor";
        FbEditor = ace.edit(aceId + "-ace");
        FbEditor.setTheme("ace/theme/" + theme);
        var aceMode = mode === "php" ? {path:"ace/mode/php", inline:true} : "ace/mode/" + mode;
        FbEditor.getSession().setMode(aceMode);
        FbEditor.$blockScrolling = Infinity;
        FbEditor.setValue(field.value);
        FbEditor.navigateFileStart();
        FbEditor.setAnimatedScroll(true);
        FbEditor.setBehavioursEnabled(true);
        FbEditor.setDisplayIndentGuides(true);
        FbEditor.setHighlightGutterLine(true);
        FbEditor.setHighlightSelectedWord(true);
        FbEditor.setShowFoldWidgets(true);
        FbEditor.setWrapBehavioursEnabled(true);
        FbEditor.getSession().setUseWrapMode(true);
        FbEditor.getSession().setTabSize(2);
        FbEditor.on("blur", function () {
            if (field.value !== FbEditor.getValue()) {
                field.value = FbEditor.getValue();
                field.fireEvent("change", field);
            }
            field.fireEvent("blur", field);
        });
        FbEditor.setAutoScrollEditorIntoView(true);
        var updateHeight = function () {
            var s = FbEditor.getSession();
            var r = FbEditor.renderer;
            var l = s.getScreenLength();
            var h = l * r.lineHeight
                  + (r.$horizScroll ? r.scrollBar.getWidth() : 0)
                  + 2;
            var hpx = height.slice(-2) === 'px' ? height :
                height * r.lineHeight
                  + (r.$horizScroll ? r.scrollBar.getWidth() : 0)
                  + 2;
            h = h < hpx ? hpx : h;
            var c = document.getElementById(aceId + "-aceContainer");
            if (c.getStyle("height").toInt() !== h) {
                c.setStyle("height", h.toString() + "px");
                FbEditor.resize();
            }
        }
        FbEditor.renderer.on("afterRender", function() {
            updateHeight();
        });
        FbEditor.getSession().on("change", updateHeight);

        return FbEditor;
    };
});
