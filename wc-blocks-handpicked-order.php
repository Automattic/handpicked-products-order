<?php
/**
 * Plugin Name:     Handpicked Products Block Custom Order
 * Plugin URI:      https://github.com/Automattic/handpicked-products-order
 * Description:     Allows manual sorting via drag-and-drop of the Handpicked block in WooCommerce Gutenberg Blocks.
 * Author:          Tom Rhodes / WP Special Projects
 * Author URI:      https://wpspecialprojects.wordpress.com
 * Text Domain:     wc-blocks-handpicked-order
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Wc_Blocks_Handpicked_Order
 */

/**
 * Filters the HTML for products in the grid, adding on the current product id as
 * a data-attr.
 *
 * @param string $html Product grid item HTML.
 * @param array $data Product data passed to the template.
 * @param \WC_Product $product Product object.
 * @return string Updated product grid item HTML.
 */
function to51_wc_handpicked_order_add_product_id( $html, $data, $product ): string {
	return str_replace( 'class=', 'data-product-id="' . esc_attr( $product->get_id() ) . '" class=', $html );
}
add_filter( 'woocommerce_blocks_product_grid_item_html', 'to51_wc_handpicked_order_add_product_id', 10, 3 );

/**
 * Enqueue assets for the block editor.
 */
function to51_wc_handpicked_order_editor_assets(): void {

	$current_screen = get_current_screen();

	/**
	 * Add check to see if currently on the widgets screen; this file should not
	 * be loaded there, but is as of WordPress 5.8.
	 *
	 * @see: https://github.com/WordPress/gutenberg/issues/28538,
	 * https://github.com/WordPress/gutenberg/issues/25945.
	 */
	if ( 'widgets' === $current_screen->id ) {
		return;
	}

	// Get generated dependency file from build script.
	$asset_deps = include __DIR__ . '/build/index.asset.php';

	wp_enqueue_style(
		'to51-wc-handpicked-order-block-editor',
		plugins_url( '/build/index.css', __FILE__ ),
		array(),
		$asset_deps['version']
	);

	wp_enqueue_script(
		'to51-wc-handpicked-order-block-editor',
		plugins_url( '/build/index.js', __FILE__ ),
		$asset_deps['dependencies'],
		$asset_deps['version'],
		true
	);

}
add_action( 'enqueue_block_editor_assets', 'to51_wc_handpicked_order_editor_assets' );

/**
 * Add additional orderby argument to the woocommerce/handpicked-products block.
 *
 * @param  array  $args       Array of block arguments.
 * @param  string $block_type Block name.
 * @return array              Modified array of block arguments.
 */
function to51_wc_handpicked_order_block_args( array $args, string $block_type ): array {

	if ( 'woocommerce/handpicked-products' === $block_type && isset( $args['attributes']['orderby']['enum'] ) ) {
		$args['attributes']['orderby']['enum'][] = 'post__in';
	}

	return $args;
}
add_filter( 'register_block_type_args', 'to51_wc_handpicked_order_block_args', 10, 2 );
