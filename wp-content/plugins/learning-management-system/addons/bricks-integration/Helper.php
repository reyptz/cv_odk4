<?php
/**
 * Bricks Integration helper functions.
 *
 * @package Masteriyo\Addons\BricksIntegration
 *
 * @since 1.9.0
 */

namespace Masteriyo\Addons\BricksIntegration;

use Masteriyo\Query\CourseCategoryQuery;
use Masteriyo\Roles;

/**
 * Bricks Integration helper functions.
 *
 * @package Masteriyo\Addons\BricksIntegration
 *
 * @since 1.9.0
 */
class Helper {

	/**
	 * Return if Bricks is active.
	 *
	 * @since 1.9.0
	 *
	 * @return boolean
	 */
	public static function is_bricks_active() {
		$theme = wp_get_theme();

		if ( 'Bricks' === $theme->name ) {
			return true;
		} else {
			false;
		}
	}

	/**
	 * Returns the courses categories.
	 *
	 * @since 1.9.0
	 *
	 * @return array
	 */
	public static function get_categories_options() {
		$args       = array(
			'order'   => 'ASC',
			'orderby' => 'name',
			'number'  => '',
		);
		$query      = new CourseCategoryQuery( $args );
		$categories = $query->get_categories();

		return array_reduce(
			$categories,
			function( $options, $category ) {
				$options[ $category->get_id() ] = $category->get_name();
				return $options;
			},
			array()
		);
	}

	/**
	 * Get instructors options.
	 *
	 * @since 1.9.0
	 *
	 * @return array
	 */
	public static function get_instructors_options() {
		$args          = array(
			'role__in' => array( Roles::INSTRUCTOR, Roles::ADMIN ),
			'order'    => 'ASC',
			'orderby'  => 'display_name',
			'number'   => '',
		);
		$wp_user_query = new \WP_User_Query( $args );
		$authors       = $wp_user_query->get_results();

		return array_reduce(
			$authors,
			function( $options, $author ) {
				$options[ $author->ID ] = $author->display_name;
				return $options;
			},
			array()
		);
	}

	/**
	 * Retrieves the page number from a given URL.
	 *
	 * @since 1.9.0
	 *
	 * @param string $url The URL to extract the page number from.
	 *
	 * @return int The extracted page number. Defaults to 1 if not found.
	 */
	public static function get_page_from_url( $url ) {
		$page_number = 1; // Default page number.

		// Parse the URL path.
		$url_parts = wp_parse_url( $url );
		$path      = $url_parts['path'];

		// Split the path by '/'.
		$path_parts = explode( '/', trim( $path, '/' ) );

		// Find the index of 'page' in the path.
		$page_index = array_search( 'page', $path_parts, true );

		if ( false !== $page_index && isset( $path_parts[ $page_index + 1 ] ) ) {
			// Get the page number.
			$page_number = absint( $path_parts[ $page_index + 1 ] );
		}

		// Page number not found.
		return $page_number;
	}
}
