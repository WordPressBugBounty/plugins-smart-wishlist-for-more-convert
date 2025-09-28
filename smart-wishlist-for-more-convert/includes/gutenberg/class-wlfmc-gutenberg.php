<?php
/**
 * Smart Wishlist Gutenberg Compatibility
 *
 * @author MoreConvert
 * @package Smart Wishlist For More Convert
 * @version 1.9.9
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


if ( ! class_exists( 'WLFMC_Gutenberg' ) ) {
	/**
	 * WooCommerce Wishlist Gutenberg Main
	 */
	class WLFMC_Gutenberg {


		/**
		 * Single instance of the class
		 *
		 * @var WLFMC_Gutenberg
		 */
		protected static $instance;


		/**
		 * Returns single instance of the class
		 *
		 * @access public
		 *
		 * @return WLFMC_Gutenberg
		 */
		public static function get_instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}


		/**
		 * Constructor
		 *
		 * @return void
		 */
		public function __construct() {

			add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_style' ) );
			add_filter( 'woocommerce_blocks_product_grid_item_html', array( $this, 'render_product_block' ), 10, 3 );
			add_action( 'init', array( $this, 'register_add_to_list_block' ) );
		}

		/**
		 * Registers the WooCommerce blocks.
		 */
		public function register_add_to_list_block() {
			if ( ! function_exists( 'register_block_type' ) ) {
				return;
			}
			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			wp_register_script(
				'wlfmc-add-to-list-block',
				MC_WLFMC_URL . 'assets/backend/js/add-to-list-block' . $suffix . '.js',
				array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-i18n', 'wp-components' ),
				WLFMC_VERSION,
				true
			);

			wp_set_script_translations( 'wlfmc-add-to-list-block', 'wc-wlfmc-wishlist' );
			wp_localize_script(
				'wlfmc-add-to-list-block',
				'wlfmcBlockSettings',
				array(
					'isPremium' => defined( 'MC_WLFMC_PREMIUM' ),
				)
			);
			// Register blocks.
			$blocks = array(
				'wishlist'   => array(
					'shortcode'  => 'wlfmc_add_to_wishlist',
					'is_premium' => false,
				),
				'multi-list' => array(
					'shortcode'  => 'wlfmc_add_to_multi_list',
					'is_premium' => true,
				),
				'waitlist'   => array(
					'shortcode'  => 'wlfmc_add_to_waitlist',
					'is_premium' => true,
				),
			);

			foreach ( $blocks as $type => $config ) {
				register_block_type(
					"wlfmc/add-to-$type",
					array(
						'editor_script'   => 'wlfmc-add-to-list-block',
						'render_callback' => function ( $attributes ) use ( $type, $config ) {
							return $this->render_add_to_list_block( $attributes, $type, $config['shortcode'], $config['is_premium'] );
						},
						'attributes'      => array(
							'is_single' => array(
								'type'    => 'boolean',
								'default' => false,
							),
						),
					)
				);
			}
		}

		/**
		 * Renders the add-to-list block for a given type.
		 *
		 * This method generates the HTML output for the add-to-list block shortcode
		 * based on the provided attributes, type, and shortcode name. It checks if the
		 * premium version is required and available, validates the shortcode, and
		 * returns the rendered shortcode output.
		 *
		 * @since 1.9.9
		 *
		 * @param array   $attributes     Block attributes, including 'is_single' (boolean).
		 * @param string  $type           The type of list (e.g., 'wishlist', 'multi-list', 'waitlist').
		 * @param string  $shortcode_name The shortcode name to render (e.g., 'wlfmc_add_to_wishlist').
		 * @param boolean $is_premium     Whether the block requires the premium version.
		 *
		 * @return string The rendered HTML output of the block or an error message.
		 */
		public function render_add_to_list_block( $attributes, $type, $shortcode_name, $is_premium ) {

			// Check for premium version if required.
			if ( $is_premium && ! defined( 'MC_WLFMC_PREMIUM' ) ) {
				/* translators: %s is the type of list (e.g., Wishlist, Multi-list, Waitlist). */
				return '<div>' . esc_html( sprintf( __( 'The %s feature requires the Pro version of the plugin.', 'wc-wlfmc-wishlist' ), ucfirst( $type ) ) ) . '</div>';
			}

			// Validate shortcode.
			if ( empty( $shortcode_name ) ) {
				return '<div>' . esc_html__( 'Invalid button type', 'wc-wlfmc-wishlist' ) . '</div>';
			}

			$atts_str = ' position="shortcode" is_single="' . ( $attributes['is_single'] ? 'true' : '' ) . '"';

			return do_shortcode( '[' . $shortcode_name . $atts_str . ']' );
		}

		/**
		 * Enqueue block style.
		 *
		 * @return void.
		 */
		public function enqueue_style() {
			$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
			wp_enqueue_style( 'wlfmc-blocks', MC_WLFMC_URL . 'assets/frontend/css/style' . $suffix . '.css', false, WLFMC_VERSION );
		}


		/**
		 * Add "add to wishlist" button to some gutenberg loops
		 *
		 * @param string       $html HTML of the single block item.
		 * @param array|object $data    Data used to render the item.
		 * @param WC_Product   $product Current product.
		 *
		 * @return string
		 * @version 1.3.0
		 */
		public function render_product_block( $html, $data, $product ) {

			$options            = new MCT_Options( 'wlfmc_options' );
			$gutenberg_position = $options->get_option( 'gutenberg_position', 'after_add_to_cart' );
			$show_on_gutenberg  = $options->get_option( 'show_on_gutenberg', false );
			if ( wlfmc_is_true( $show_on_gutenberg ) ) {
				$add_to_wishlist = do_shortcode( '[wlfmc_add_to_wishlist  is_gutenberg="true" product_id="' . $product->get_id() . '"]' );
				$url             = "<a href=\"$data->permalink\" class=\"wc-block-grid__product-link\">$data->image $data->title</a>";

				$html  = '<li class="wc-block-grid__product">';
				$html .= in_array(
					$gutenberg_position,
					array(
						'image_top_left',
						'image_top_right',
					),
					true
				) ? $add_to_wishlist . $url : $url;
				$html .= 'after_title' === $gutenberg_position ? $add_to_wishlist . "$data->badge" : "$data->badge";
				$html .= 'before_price' === $gutenberg_position ? $add_to_wishlist . "$data->price" : "$data->price";
				$html .= 'after_price' === $gutenberg_position ? $add_to_wishlist . "$data->rating" : "$data->rating";
				$html .= 'before_add_to_cart' === $gutenberg_position ? $add_to_wishlist . "$data->button" : "$data->button";
				$html .= 'after_add_to_cart' === $gutenberg_position ? $add_to_wishlist : '';
				$html .= '</li>';

			}

			return $html;
		}
	}

}

/**
 * Unique access to instance of WLFMC_Gutenberg class
 *
 * @return WLFMC_Gutenberg
 */
function WLFMC_Gutenberg(): WLFMC_Gutenberg { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.FunctionNameInvalid
	return WLFMC_Gutenberg::get_instance();
}
