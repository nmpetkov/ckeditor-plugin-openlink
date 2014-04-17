
/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview The "openlink" plugin.
 *
 */

'use strict';

( function() {

	CKEDITOR.plugins.add( 'openlink', {
		lang: 'en', // %REMOVE_LINE_CORE%
		icons: 'openLink', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'link,contextmenu',

		init: function( editor ) {
			// Register openLink command.
			editor.addCommand( 'openLink', {
				exec: function( editor ) {
					var anchor = getActiveLink( editor ),
						href;

					if ( anchor )
						href = anchor.getAttribute( 'href' );

					if ( href )
						window.open( href );
				}
			} );

			// Register menu items.
			if ( editor.addMenuItems ) {
				editor.addMenuItems( {
					openLink: {
						label: editor.lang.openlink.menu,
						command: 'openLink',
						group: 'link',
						order: -1
					}
				} );
			}

			// If the "contextmenu" plugin is loaded, register the listeners.
			editor.contextMenu.addListener( function( element, selection ) {
				if ( !element )
					return null;

				var anchor = getActiveLink( editor );

				if ( anchor && anchor.getAttribute( 'href' ) )
					return { openLink: CKEDITOR.TRISTATE_OFF };

				return {};
			} );

			// A quick workaround for issue #11842.
			editor.on( 'instanceReady', function( evt ) {
				var editable = editor.editable();

				// We want to be able to open links also in read-only mode. This
				// listener will open link in new tab.
				editable.on( 'click', function( evt ) {
					// This method is made for read-only mode.
					if ( !editor.readOnly )
						return;

					var target = evt.data.getTarget(),
						clickedAnchor = ( new CKEDITOR.dom.elementPath( target, editor.editable() ) ).contains( 'a' ),
						href = clickedAnchor && clickedAnchor.getAttribute( 'href' );

					if ( href )
						window.open( href, '_blank' );
				} );
			} );
		}
	} );

	// Returns the element of active (currently focused) link.
	// It has also support for linked image2 instance.
	// @return {CKEDITOR.dom.element}
	function getActiveLink( editor ) {
		var anchor = CKEDITOR.plugins.link.getSelectedLink( editor ),
			// We need to do some special checking against widgets availability.
			activeWidget = editor.widgets && editor.widgets.focused;

		// If default way of getting links didn't return anything useful
		if ( !anchor && activeWidget && activeWidget.name == 'image' && activeWidget.parts.link ) {
			// Since CKEditor 4.4.0 image widgets may be linked.
			anchor = activeWidget.parts.link;
		}

		return anchor;
	}

} )();
