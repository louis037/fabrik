/**
 * Admin Visualization Editor
 *
 * @copyright: Copyright (C) 2005-2016  Media A-Team, Inc. - All rights reserved.
 * @license:   GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

/* jshint mootools: true */
/* global fconsole:true, FabrikAdmin:true, Fabrik:true, PluginManager:true, Joomla:true */

define(['jquery', 'admin/pluginmanager'], function (jQuery, PluginManager) {
	var AdminVisualization = new Class({

		Extends: PluginManager,

		Implements: [Options, Events],

		options: {},

		initialize: function (options, lang) {
			this.setOptions(options);
			this.watchSelector();
		},

		watchSelector: function () {
			if (typeof(jQuery) !== 'undefined') {
				jQuery('#jform_plugin').bind('change', function (e) {
					this.changePlugin(e);
				}.bind(this));
			} else {
				document.id('jform_plugin').addEvent('change', function (e) {
					e.stop();
					this.changePlugin(e);
				}.bind(this));
			}
		},

		changePlugin: function (e) {
			document.id('plugin-container').empty()
				.adopt(new Element('span').set('text', Joomla.JText._('COM_FABRIK_LOADING')));
			var myAjax = new Request({
				url: 'index.php',
				'evalResponse': false,
				'evalScripts' : function (script, text) {
					this.script = script.replace(/(<div[^>]*>.*<\/div>)/gi, '');
				}.bind(this),
				'data': {
					'option': 'com_fabrik',
					'task'  : 'visualization.getPluginHTML',
					'format': 'raw',
					'plugin': e.target.get('value')
				},
				'update': document.id('plugin-container'),
				'onComplete': function (r) {
					document.id('plugin-container').set('html', r);
					Browser.exec(this.script);
					this.updateBootStrap();
					FabrikAdmin.reTip();
				}.bind(this),
			});
			Fabrik.requestQueue.add(myAjax);
		}
	});
	return AdminVisualization;
});
