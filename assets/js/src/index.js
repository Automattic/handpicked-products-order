// Import JS dependencies.
import { assign } from 'lodash';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { check, closeSmall, replace } from '@wordpress/icons';

// Build CSS for handpicked products block.
import '../../scss/editor.scss';

/**
 * Add additional attribute onto woocommerce/handpicked-products block.
 */
addFilter(
	'blocks.registerBlockType',
	'to51-handpicked-order/additional-block-settings',
	( settings, name ) => {
		if ( name === 'woocommerce/handpicked-products' ) {
			settings.attributes = assign( settings.attributes, {
				orderby: {
					...settings.attributes.orderby,
					enum: [ ...settings.attributes.orderby.enum, 'post__in' ],
				},
			} );
		}

		return settings;
	}
);

/**
 * Add additional controls to block toolbar.
 */
addFilter(
	'editor.BlockEdit',
	'to51-handpicked-order/additional-block-settings',
	createHigherOrderComponent( ( BlockEdit ) => {
		return ( props ) => {
			// Only allow this extension to run on woocommerce/handpicked-products
			if ( props.name !== 'woocommerce/handpicked-products' ) {
				return <BlockEdit { ...props } />;
			}

			// Pull out props.
			const {
				attributes: { products },
				setAttributes,
			} = props;

			// Setup state management.
			const [ tempProducts, setTempProducts ] = useState( [] );
			const [ isSorting, setIsSorting ] = useState( false );

			// Run whenever sorting changes.
			useEffect( () => {
				document.addEventListener( 'mousedown', handleDragStart );
				document.addEventListener( 'mouseup', handleDragEnd );
			}, [] );

			// Run these items whenever products prop changes.
			useEffect( () => {
				setTempProducts( [] );
				setIsSorting( false );
			}, [ products ] );

			let isDragging = false,
				draggedProduct = false;

			//
			const handleDragStart = ( e ) => {
				if ( e.target.className !== 'wc-block-grid__product' ) {
					return;
				}

				draggedProduct = e.target;
				isDragging = true;
			};

			//
			const handleDragEnd = ( e ) => {
				if (
					! isDragging ||
					e.target.className !== 'wc-block-grid__product'
				) {
					return;
				}

				if (
					e.target.dataset.productId ===
					draggedProduct.dataset.productId
				) {
					draggedProduct = false;
					isDragging = false;
					return;
				}

				const wrapper = e.target.parentNode,
					droppedPos = Array.prototype.indexOf.call(
						wrapper.childNodes,
						e.target
					);

				// Swap item locations.
				wrapper.insertBefore(
					draggedProduct,
					wrapper.childNodes.item( droppedPos )
				);

				// Update state.
				setTempProducts(
					Array.from( wrapper.childNodes ).map( ( item ) =>
						parseInt( item.dataset.productId )
					)
				);

				draggedProduct = false;
				isDragging = false;
			};

			return (
				<div className={ isSorting ? 'is-sorting' : '' }>
					<BlockEdit { ...props } />
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								icon={ isSorting ? closeSmall : replace }
								label={
									isSorting
										? __( 'Disable Sorting' )
										: __( 'Enable Sorting' )
								}
								onClick={ () => {
									setIsSorting( ! isSorting );
								} }
								className={ isSorting && 'is-pressed' }
							/>
							{ isSorting && (
								<ToolbarButton
									icon={ check }
									label={ __( 'Save Sorted Order' ) }
									onClick={ () => {
										setAttributes( {
											products: tempProducts,
											orderby: 'post__in',
										} );
									} }
								/>
							) }
						</ToolbarGroup>
					</BlockControls>
				</div>
			);
		};
	} )
);
