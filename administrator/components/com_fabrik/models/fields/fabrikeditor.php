<?php
/**
 * Form Field class for the Joomla Platform.
 * An ace.js code editor field
 *
 * @package     Joomla
 * @subpackage  Form
 * @copyright   Copyright (C) 2005-2016  Media A-Team, Inc. - All rights reserved.
 * @license     GNU/GPL http://www.gnu.org/copyleft/gpl.html
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

jimport('joomla.form.formfield');
JFormHelper::loadFieldClass('textarea');

/**
 * Form Field class for the Joomla Platform.
 * An ace.js code editor field
 *
 * @package     Joomla.Libraries
 * @subpackage  Form
 * @see         JEditor
 * @since       1.6
 */
class JFormFieldFabrikeditor extends JFormFieldTextArea
{
	/**
	 * The form field type.
	 *
	 * @var    string
	 * @since  1.6
	 */
	public $type = 'Fabrikeditor';

	/**
	 * Method to get the field input markup for the editor area
		*
		* @return  string  The field input markup.
	 *
	 * @since   1.6
	*/

	protected function getInput()
	{
		// Initialize some field attributes.
		$class    = $this->element['class'] ? 'FbEditor ' . (string) $this->element['class'] : 'FbEditor';
		$class    = ' class="' . $class . '"';
		$disabled = ((string) $this->element['disabled'] == 'true') ? ' disabled="disabled"' : '';
		$columns  = $this->element['cols'] ? ' cols="' . (int) $this->element['cols'] . '"' : '';
		$rows     = $this->element['rows'] ? ' rows="' . (int) $this->element['rows'] . '"' : '';
		$required = $this->required ? ' required="required" aria-required="true"' : '';

		// JS events are saved as encoded html - so we don't want to double encode them
		$encoded = FabrikWorker::toBoolean($this->getAttribute('encoded', false), false);

		if (!$encoded)
		{
			$this->value = htmlspecialchars($this->value, ENT_COMPAT, 'UTF-8');
		}

		$onChange = FabrikWorker::toBoolean($this->getAttribute('onchange', false), false);

		$onChange = $onChange ? ' onchange="' . (string) $onChange . '"' : '';

		$editor = '<textarea name="' . $this->name . '" id="' . $this->id . '"'
			. $columns . $rows . $class . $disabled . $onChange . $required . '>'
			. $this->value . '</textarea>';

		$version = new JVersion;

		if ($version->RELEASE == 2.5)
		{
			return $editor;
		}

		// Joomla 3 version
		$mode      = $this->getAttribute('mode', 'html');
		$theme     = $this->getAttribute('theme', 'github');
		$height    = $this->getAttribute('height', '10');
		$width     = $this->getAttribute('width', '100%');

		FabrikHelperHTML::framework();
		FabrikHelperHTML::iniRequireJS();

		$script = 'FabrikEditor("' . implode('","', array(
				$this->id,
				$theme,
				$mode,
				$height,
				$width
			)) . '");';

		$src = array(
			'Ace' => 'media/com_fabrik/js/lib/ace/src-min-noconflict/ace.js',
			'Fabrik' => 'media/com_fabrik/js/fabrik.js',
			'FbEditorModule' => 'administrator/components/com_fabrik/models/fields/fabrikeditor.js',
		);
		FabrikHelperHTML::script($src, $script);

		$this->element['cols'] = 1;
		$this->element['rows'] = 1;

		return $editor;
	}
}
