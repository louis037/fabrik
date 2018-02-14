/**
 * Fabrik Ace Editor initialiser
 *
 * @copyright: Copyright (C) 2005-2013, fabrikar.com - All rights reserved.
 * @license:   GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

/*jshint mootools: true */
/*global Fabrik:true, fconsole:true, Joomla:true, CloneObject:true, $H:true,unescape:true,Asset:true */

define(["jquery", "lib/ace/src-min-noconflict/ace"], function (jQuery, aceModule) {
    FabrikEditor = function(id, theme, mode, height, width) {
        var field = document.getElementById(id);
        if (field === null) {
            // Likely to be because the element this has been called on is the hidden Joomla subform template
            // (which is sneakily stored in a script node).
            if (id.includes('X__')) {
                // Might be a subform - check for specific script
                var subformScript = document.querySelector('script.subform-repeatable-template-section');
                if (subformScript !== null && (subformScript.text || subformScript.textContent).includes(id)) {
                    // ALmost certainly a Joomla subform, so create an event hook which will look for new matching element
                    // and initiate BarikEditor on it.
                    // Fix for Joomla subforms as suggested at https://docs.joomla.org/Subform_form_field_type
                    jQuery(document).on('subform-row-add', function(event, row) {
                        var base = row.getAttribute('data-base-name');
                        var group = row.getAttribute('data-group');
                        if (!group.startsWith(base)) {
                            fconsole('fabrikeditor: new subform row, but data-group=', group, 'does not start with data-base-name=', base);
                            return;
                        }
                        var idx = group.slice(base.length);
                        var newId = id.replace('_' + base + 'X__', '_' + base + idx + '__');
                        if (row.getElementById(newId) !== null) {
                            FabrikEditor(newId, theme, mode, height, width);
                        } else {
                            fconsole('fabrikeditor: Clone not found for', id);
                        }
                    });
                    return;
                }
            }
            fconsole("fabrikeditor: Cannot find field", id);
            return;
        }

        // Fabrik repeatgroup functionality works differently. If this is row 0, then
        // process a repeatgroup add event in a similar way.
        var name = field.getAttribute('name');
        var idx = name.split('][')[2];
        if (idx && idx.replace(']', '') === "0") {
            document.addEventListener('fabrikadmin.repeatgroup.add', function(e) {
                var baseIdParts = field.id.split('-');
                var editors = e.detail.querySelectorAll('textarea.FbEditor');
                for (var ed of editors) {
                    var rptIdParts = ed.id.split('-');
                    var count = 0;
                    for (var i = 0; i < baseIdParts.length; i++) {
                        if (baseIdParts[i] === rptIdParts[i]) {
                            count++;
                        } else if (baseIdParts[i] !== "0" || !rptIdParts[i] && !rptIdParts[i].isInteger()) {
                            break;
                        }
                    }
                    if (count === baseIdParts.length - 1) {
                        FabrikEditor(ed.id, theme, mode, height, width);
                    }
                }
            });
        }

        // Check if we have parent divs already exist because e.g. element has been cloned
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
        // We can't know the true dimensions of the editor until it is instantiated and we get access to the internals
        // so this is an estimate which will be updated by onrender as soon as ace is rendered
        var h = height.slice(-2) === 'px' ? height : height * 14 + 2;
        containerDiv.style = "position:relative; width:" + width + "; height:" + h + ";";
        aceDiv = containerDiv.querySelector("[id$='-ace']");
        if (!aceDiv) {
            fconsole("fabrikeditor: cannot find ace container to randomise", id + "-ace");
            return;
        }
        aceDiv.id = aceId + "-ace";
        aceDiv.className += "FbEditorAce";
        var FbEditor = ace.edit(aceId + "-ace");
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
