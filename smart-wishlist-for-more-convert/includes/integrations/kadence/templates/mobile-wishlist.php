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
<div class="site-header-item site-header-focus-item" data-section="kadence_customizer_mobile_wishlist">
	<?php
	/**
	 * Kadence Header Mobile wishlist
	 *
	 * Hooked Kadence_Wlfmc\mobile_wishlist
	 */
	do_action( 'kadence_mobile_wishlist' );
	?>
</div><!-- data-section="mobile_wishlist" -->
