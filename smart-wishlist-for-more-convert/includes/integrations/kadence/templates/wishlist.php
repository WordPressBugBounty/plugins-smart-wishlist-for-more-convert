<?php
/**
 * Template part for displaying the header wishlist Module
 *
 * @package Kadence_Wlfmc
 */

namespace Kadence_Wlfmc;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly

?>
<div class="site-header-item site-header-focus-item" data-section="kadence_customizer_header_wishlist">
	<?php
	/**
	 * Kadence Header Wishlist
	 *
	 * Hooked Kadence_Wlfmc\header_wishlist
	 */
	do_action( 'kadence_header_wishlist' );
	?>
</div><!-- data-section="header_wishlist" -->
