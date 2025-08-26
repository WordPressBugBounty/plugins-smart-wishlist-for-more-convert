<?php
/**
 * Date Formatter Class
 *
 * @author MoreConvert
 * @package Smart Wishlist For More Convert
 * @since 1.9.6
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WLFMC_Date_Formatter' ) ) {
	/**
	 * Class to handle timezone-aware date formatting for WordPress.
	 */
	class WLFMC_Date_Formatter {
		/**
		 * WordPress timezone.
		 *
		 * @var DateTimeZone|null
		 */
		private static $wp_timezone = null;

		/**
		 * MySQL timezone (cached to avoid repeated queries).
		 *
		 * @var DateTimeZone|null
		 */
		private static $mysql_timezone = null;

		/**
		 * Init timezones.
		 *
		 * @return void
		 * @throws DateInvalidTimeZoneException Invalid exception.
		 */
		private static function init_timezones() {
			if ( is_null( self::$wp_timezone ) ) {
				self::$wp_timezone = new DateTimeZone( wp_timezone_string() ? wp_timezone_string() : 'UTC' );
			}

			if ( is_null( self::$mysql_timezone ) ) {
				$mysql_tz = get_transient( 'wlfmc_mysql_timezone' );
				if ( false === $mysql_tz ) {
					global $wpdb;
					$mysql_tz = $wpdb->get_var( 'SELECT @@session.time_zone' ); // phpcs:ignore WordPress.DB
					if ( strtoupper( $mysql_tz ) === 'LOCALTIME' ) {
						$mysql_tz = 'SYSTEM';
					}
					if ( strtoupper( $mysql_tz ) === 'SYSTEM' ) {
						$offset = $wpdb->get_var( 'SELECT TIMEDIFF(NOW(), UTC_TIMESTAMP())' ); // phpcs:ignore WordPress.DB
						// Normalize offset (e.g., "+04:00:00" to "+04:00", "+4:00:00" to "+04:00", or "+0400" to "+04:00").
						if ( $offset && preg_match( '/^([+-])(\d{1,2}):?(\d{2})(?::\d{2})?$/', $offset, $matches ) ) {
							$hours    = str_pad( $matches[2], 2, '0', STR_PAD_LEFT );
							$mysql_tz = $matches[1] . $hours . ':' . $matches[3];
						} else {
							$mysql_tz = 'UTC'; // Fallback.
						}
					}
					// Handle other offset formats (e.g., "-04:00:00" or "-4:00:00").
					if ( preg_match( '/^([+-])(\d{1,2}):(\d{2})(:\d{2})?$/', $mysql_tz, $matches ) ) {
						$hours    = str_pad( $matches[2], 2, '0', STR_PAD_LEFT );
						$mysql_tz = $matches[1] . $hours . ':' . $matches[3];
					}
					// Handle "+0400", "+400" or similar formats.
					if ( preg_match( '/^([+-]\d{3,4})$/', $mysql_tz, $matches ) ) {
						$offset = $matches[1];
						$sign   = substr( $offset, 0, 1 );
						$num    = substr( $offset, 1 );
						if ( strlen( $num ) === 3 ) {
							$num = '0' . $num;
						}
						$hours    = substr( $num, 0, 2 );
						$mins     = substr( $num, 2, 2 );
						$mysql_tz = $sign . $hours . ':' . $mins;
					}
					// Validate timezone.
					try {
						new DateTimeZone( $mysql_tz );
						set_transient( 'wlfmc_mysql_timezone', $mysql_tz, WEEK_IN_SECONDS );
					} catch ( Exception $e ) {
						$mysql_tz = 'UTC'; // Fallback to UTC if invalid.
						set_transient( 'wlfmc_mysql_timezone', $mysql_tz, WEEK_IN_SECONDS );
					}
				}

				try {
					self::$mysql_timezone = new DateTimeZone( $mysql_tz );
				} catch ( Exception $e ) {
					self::$mysql_timezone = new DateTimeZone( 'UTC' ); // Fallback to UTC.
				}
			}
		}

		/**
		 * Format a datetime from MySQL timezone to WordPress timezone.
		 *
		 * @param string|WC_DateTime $date   The date to format (string or WC_DateTime).
		 * @param string             $format  Optional. The format to use (defaults to WordPress date+time format).
		 * @return string                   Formatted date string or empty string on failure.
		 */
		public static function format_mysql_datetime( $date, $format = '' ) {
			self::init_timezones();

			// Default format.
			$format = $format ? $format : get_option( 'date_format' ) . ' ' . get_option( 'time_format' );

			try {
				if ( $date instanceof WC_DateTime ) {
					$timezone_string = get_option( 'timezone_string' );
					if ( empty( $timezone_string ) ) {
						$date = $date->date_i18n( 'Y-m-d H:i:s' );
					} else {
						$date = $date->format( 'Y-m-d H:i:s' );
					}
				}
				$dt = new DateTime( $date, self::$mysql_timezone );
				$dt->setTimezone( self::$wp_timezone );
				$timestamp = strtotime( $dt->format( 'Y-m-d H:i:s' ) . ' UTC' );
				return date_i18n( apply_filters( 'wlfmc_datetime_format', $format ), $timestamp );
			} catch ( Exception $e ) {
				// Log error for debugging (optional).
				return '';
			}
		}

		/**
		 * Format a UTC datetime to WordPress timezone.
		 *
		 * @param string $date   The UTC date string.
		 * @param string $format Optional. The format to use (defaults to WordPress date+time format).
		 * @return string        Formatted date string or empty string on failure.
		 */
		public static function format_utc_datetime( $date, $format = '' ) {
			self::init_timezones();

			// Default format.
			$format = $format ? $format : get_option( 'date_format' ) . ' ' . get_option( 'time_format' );

			try {
				if ( empty( $date ) || ! is_string( $date ) ) {
					return '';
				}
				$dt = new DateTime( $date, new DateTimeZone( 'UTC' ) );
				$dt->setTimezone( self::$wp_timezone );
				$timestamp = strtotime( $dt->format( 'Y-m-d H:i:s' ) . ' UTC' );
				return date_i18n( apply_filters( 'wlfmc_datetime_format', $format ), $timestamp );
			} catch ( Exception $e ) {
				// Log error for debugging (optional).
				return '';
			}
		}

		/**
		 * Format a date as "time ago" string (e.g., "2 hours ago").
		 *
		 * @param string|WC_DateTime $date The date to format (string or WC_DateTime).
		 * @param string             $source_timezone Timezone of the input date ('mysql' or 'utc'). Default 'mysql'.
		 * @return string Formatted time ago string or empty string on failure.
		 */
		public static function time_ago( $date, $source_timezone = 'mysql' ) {
			self::init_timezones();

			try {
				// Convert input to DateTime object.
				if ( $date instanceof WC_DateTime ) {
					$date_str = $date->format( 'Y-m-d H:i:s' );
				} else {
					$date_str = $date;
				}

				// Determine source timezone.
				if ( 'utc' === $source_timezone ) {
					$source_tz = new DateTimeZone( 'UTC' );
				} else {
					$source_tz = self::$mysql_timezone;
				}

				// Create DateTime object with source timezone.
				$dt = new DateTime( $date_str, $source_tz );

				// Convert to WordPress timezone.
				$dt->setTimezone( self::$wp_timezone );
				$timestamp = $dt->getTimestamp();

				// Get current time in WordPress timezone.
				$current_time      = new DateTime( 'now', self::$wp_timezone );
				$current_timestamp = $current_time->getTimestamp();

				// Calculate difference in seconds.
				$diff = $current_timestamp - $timestamp;

				// Handle future dates.
				if ( $diff < 0 ) {
					return self::format_mysql_datetime( $date );
				}

				// Time ago formatting logic.
				if ( $diff < 60 ) {
					return __( 'just now', 'wc-wlfmc-wishlist' );
				} elseif ( $diff < 3600 ) {
					$minutes = floor( $diff / 60 );
					// translators: %d is the number of minutes.
					return sprintf( _n( '%d minute ago', '%d minutes ago', $minutes, 'wc-wlfmc-wishlist' ), $minutes );
				} elseif ( $diff < 86400 ) {
					$hours = floor( $diff / 3600 );
					// translators: %d is the number of hours.
					return sprintf( _n( '%d hour ago', '%d hours ago', $hours, 'wc-wlfmc-wishlist' ), $hours );
				} elseif ( $diff < 604800 ) {
					$days = floor( $diff / 86400 );
					if ( 1 === $days ) {
						return __( 'yesterday', 'wc-wlfmc-wishlist' );
					} else {
						// translators: %d is the number of days.
						return sprintf( _n( '%d day ago', '%d days ago', $days, 'wc-wlfmc-wishlist' ), $days );
					}
				} elseif ( $diff < 2592000 ) {
					$weeks = floor( $diff / 604800 );
					// translators: %d is the number of week.
					return sprintf( _n( '%d week ago', '%d weeks ago', $weeks, 'wc-wlfmc-wishlist' ), $weeks );
				} elseif ( $diff < 31536000 ) {
					$months = floor( $diff / 2592000 );
					// translators: %d is the number of month.
					return sprintf( _n( '%d month ago', '%d months ago', $months, 'wc-wlfmc-wishlist' ), $months );
				} else {
					$years = floor( $diff / 31536000 );
					// translators: %d is the number of year.
					return sprintf( _n( '%d year ago', '%d years ago', $years, 'wc-wlfmc-wishlist' ), $years );
				}
			} catch ( Exception $e ) {
				return self::format_mysql_datetime( $date ); // Fallback to standard formatting.
			}
		}
	}
}
