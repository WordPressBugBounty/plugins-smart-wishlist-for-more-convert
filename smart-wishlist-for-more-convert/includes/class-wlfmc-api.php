<?php
/**
 * Smart Wishlist Api
 *
 * @author MoreConvert
 * @package Smart Wishlist For More Convert
 * @since 1.3.3
 * @version 2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WLFMC_Api' ) ) {
	/**
	 * This class handle rest api for wishlist plugin
	 */
	class WLFMC_Api {

		/**
		 * Endpoint namespace.
		 *
		 * @var string
		 */
		protected const NAMESPACE = 'wlfmc';

		/**
		 * Route base.
		 *
		 * @var string
		 */
		protected const REST_BASE = 'v1';

		/**
		 * Load the new REST API wishlist endpoints
		 */
		public function register_routes() {

			register_rest_route(
				self::NAMESPACE . '/' . self::REST_BASE,
				'/call',
				array(
					array(
						'methods'             => WP_REST_Server::CREATABLE,
						'callback'            => array( 'WLFMC_Api', 'do_action' ),
						'permission_callback' => '__return_true',
					),
				)
			);
		}

		/**
		 * Manage all rest_api ajax mode actions
		 *
		 * @param WP_REST_Request $request  The request object.
		 *
		 * @verison 2.0.0
		 * @return WP_Error|WP_HTTP_Response|WP_REST_Response
		 */
		public static function do_action( WP_REST_Request $request ) {

			$data   = $request->get_body_params();
			$action = sanitize_key( $data['action'] );

			/**
			 * Filter the list of allowed REST actions.
			 * Premium modules can append their own actions via this filter.
			 *
			 * @param array $allowed Allowed action names.
			 */
			$allowed = apply_filters(
				'wlfmc_rest_allowed_actions',
				array(
					'wlfmc_wp_rest_add_to_wishlist',
					'wlfmc_wp_rest_remove_from_wishlist',
					'wlfmc_wp_rest_update_item_quantity',
					'wlfmc_wp_rest_delete_item',
					'wlfmc_wp_rest_load_fragments',
					'wlfmc_wp_rest_load_automations',
					'wlfmc_wp_rest_change_layout',
					'wlfmc_wp_rest_change_gdpr_status',
					'wlfmc_wp_rest_modern_sync',
				)
			);

			if ( ! in_array( $action, (array) $allowed, true ) ) {
				return rest_ensure_response( array( 'result' => false ) );
			}

			$short = str_replace( 'wlfmc_wp_rest_', '', $action );

			// Default handler map; every entry delegates to ONE shared payload builder.
			$handlers = array(
				'add_to_wishlist'      => array( 'WLFMC_Api', 'add_to_wishlist' ),
				'remove_from_wishlist' => array( 'WLFMC_Api', 'remove_from_wishlist' ),
				'update_item_quantity' => array( 'WLFMC_Api', 'update_item_quantity' ),
				'delete_item'          => array( 'WLFMC_Api', 'delete_item' ),
				'load_fragments'       => array( 'WLFMC_Api', 'load_fragments' ),
				'load_automations'     => array( 'WLFMC_Api', 'load_automations' ),
				'change_layout'        => array( 'WLFMC_Api', 'change_layout' ),
				'change_gdpr_status'   => array( 'WLFMC_Api', 'change_gdpr_status' ),
				'modern_sync'          => array( 'WLFMC_Api', 'modern_sync' ),
			);

			/**
			 * Filter the handler for a given short action name.
			 * Modules (premium) can route their own actions without duplicating
			 * the free plugin dispatcher.
			 *
			 * @param callable|null $handler Handler callable or null.
			 * @param string        $short   Short action name (prefix stripped).
			 * @param array         $data    Request data.
			 */
			$handler = apply_filters( 'wlfmc_rest_action_handler', $handlers[ $short ] ?? null, $short, $data );

			if ( ! $handler || ! is_callable( $handler ) ) {
				return rest_ensure_response( array( 'result' => false ) );
			}

			return call_user_func( $handler, $data );
		}

		/**
		 * Modern data-sync REST twin. Shares the exact same payload builder as admin-ajax.
		 *
		 * @param array $data Request data.
		 *
		 * @since 2.0.0
		 * @return WP_Error|WP_HTTP_Response|WP_REST_Response
		 */
		public static function modern_sync( array $data ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
			return rest_ensure_response(
				array(
					'success' => true,
					'data'    => WLFMC_Ajax_Handler::get_sync_payload(),
				)
			);
		}

		/**
		 * Add new hook for work automations after product added to lists
		 *
		 * @param array $data $_POST data.
		 *
		 * @return void
		 */
		public static function load_automations( array $data ) {
			$product_id  = isset( $data['product_id'] ) ? intval( $data['product_id'] ) : false; // phpcs:ignore WordPress.Security.NonceVerification
			$wishlist_id = isset( $data['wishlist_id'] ) ? intval( $data['wishlist_id'] ) : false; // phpcs:ignore WordPress.Security.NonceVerification
			$list_type   = isset( $data['list_type'] ) ? sanitize_text_field( wp_unslash( $data['list_type'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification
			$customer_id = isset( $data['customer_id'] ) ? intval( $data['customer_id'] ) : false; // phpcs:ignore WordPress.Security.NonceVerification
			if ( ! $wishlist_id || ! $product_id || ! $customer_id ) {
				die();
			}

			do_action( 'wlfmc_load_automations', $product_id, $wishlist_id, $customer_id, $list_type );

			// stops ajax call from further execution (no return value expected on answer body).
			die();
		}

		/**
		 *  Change wishlist and other lists view layout.
		 *
		 * @param array $data $_POST data.
		 *
		 * @return void
		 */
		public static function change_layout( array $data ) {
			$new_layout = isset( $data['new_layout'] ) ? sanitize_key( $data['new_layout'] ) : false; // phpcs:ignore WordPress.Security.NonceVerification
			if ( ! in_array( $new_layout, array( 'list', 'grid' ), true ) ) {
				die();
			}
			if ( is_user_logged_in() ) {
				update_user_meta( get_current_user_id(), 'wlfmc_list_layout', $new_layout );
			} else {
				wlfmc_setcookie( 'wlfmc_list_layout', $new_layout );
			}

			// stops ajax call from further execution (no return value expected on answer body).
			die();
		}

		/**
		 * Change GDPR Status.
		 *
		 * @param array $data $_POST data.
		 *
		 * @version 1.9.16
		 * @return WP_Error|WP_HTTP_Response|WP_REST_Response
		 */
		public static function change_gdpr_status( array $data ) {

			$action      = isset( $data['action_type'] ) ? sanitize_key( $data['action_type'] ) : false; // phpcs:ignore WordPress.Security.NonceVerification
			$customer_id = absint( wp_unslash( $data['cid'] ) );
			if ( ! $customer_id > 0 || ! in_array( $action, array( 'subscribe', 'unsubscribe' ), true ) ) {
				die();
			}
			$customer = wlfmc_get_customer( $customer_id );
			if ( ! $customer || ! $customer->is_current_user_owner() ) {
				return rest_ensure_response( array( 'result' => false ) );
			}
			if ( 'unsubscribe' === $action ) {
				WLFMC_Wishlist_Factory::unsubscribe_customer( $customer );
			} else {
				WLFMC_Wishlist_Factory::subscribe_customer( $customer );
			}

			return rest_ensure_response( array( 'result' => true ) );
		}

		/**
		 * Add to wishlist from ajax call.
		 * Delegates to the shared payload builder used by admin-ajax as well.
		 *
		 * @param array $data $_POST data.
		 *
		 * @version 2.0.0
		 * @return WP_Error|WP_HTTP_Response|WP_REST_Response
		 */
		public static function add_to_wishlist( array $data ) {
			return rest_ensure_response(
				apply_filters(
					'wlfmc_rest_add_return_params',
					WLFMC_Ajax_Handler::get_add_payload( $data )
				)
			);
		}

		/**
		 * Remove item from a wishlist.
		 * Delegates to the shared payload builder used by admin-ajax as well.
		 *
		 * @param array $data $_POST data.
		 *
		 * @version 2.0.0
		 * @return WP_Error|WP_HTTP_Response|WP_REST_Response
		 */
		public static function remove_from_wishlist( array $data ) {
			return rest_ensure_response( WLFMC_Ajax_Handler::get_remove_payload( $data ) );
		}

		/**
		 * Remove item from a wishlist by item id.
		 * Delegates to the shared payload builder used by admin-ajax as well.
		 *
		 * @param array $data $_POST data.
		 *
		 * @verison 2.0.0
		 * @return WP_Error|WP_HTTP_Response|WP_REST_Response
		 */
		public static function delete_item( array $data ) {
			return rest_ensure_response( WLFMC_Ajax_Handler::get_delete_item_payload( $data ) );
		}

		/**
		 * Update quantity of an item in wishlist.
		 * Delegates to the shared payload builder used by admin-ajax as well.
		 *
		 * @param array $data $_POST data.
		 *
		 * @version 2.0.0
		 * @return WP_Error|WP_HTTP_Response|WP_REST_Response
		 */
		public static function update_item_quantity( array $data ) {
			return rest_ensure_response( WLFMC_Ajax_Handler::get_update_item_quantity_payload( $data ) );
		}

		/**
		 * Generated fragments to replace in the page
		 *
		 * @param array $data $_POST data.
		 *
		 * @return WP_Error|WP_HTTP_Response|WP_REST_Response
		 */
		public static function load_fragments( array $data ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
			$fragment_json = isset( $_FILES['fragments_file']['tmp_name'] ) && is_uploaded_file( $_FILES['fragments_file']['tmp_name'] ) ? file_get_contents( $_FILES['fragments_file']['tmp_name'] ) : false; // phpcs:ignore
			$fragments     = $fragment_json ? json_decode( $fragment_json, true ) : false;

			if ( defined( 'ICL_SITEPRESS_VERSION' ) ) { // wpml current  language.
				global $sitepress;
				$lang = $sitepress->get_current_language();
			} elseif ( function_exists( 'pll_current_language' ) ) { // polylang current language.
				$lang = pll_current_language();
			} else { // cannot determine current language.
				$lang = null;
			}

			return rest_ensure_response(
				apply_filters(
					'wlfmc_load_fragments',
					array(
						'fragments' => WLFMC_Ajax_Handler::refresh_fragments( $fragments ),
						'products'  => WLFMC_Ajax_Handler::get_current_items(),
						'lang'      => $lang,
					)
				)
			);
		}
	}

}

add_action( 'rest_api_init', 'wlfmc_api_init' );

/**
 * Run API routes
 *
 * @return void
 */
function wlfmc_api_init() {
	$controller = new WLFMC_Api();
	$controller->register_routes();
}
