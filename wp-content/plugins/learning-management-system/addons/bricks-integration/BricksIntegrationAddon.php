<?php
/**
 * Masteriyo bricks integration addon setup.
 *
 * @package Masteriyo\Addons\BricksIntegration
 *
 * @since 1.9.0
 */

namespace Masteriyo\Addons\BricksIntegration;

defined( 'ABSPATH' ) || exit;

/**
 * Main Masteriyo bricks integration class.
 *
 * @class Masteriyo\Addons\BricksIntegration\BricksIntegrationAddon
 */
class BricksIntegrationAddon {
	/**
	 * Initialize module.
	 *
	 * @since 1.9.0
	 */
	public function init() {
		$this->init_hooks();
	}

	/**
	 * Initialize hooks.
	 *
	 * @since 1.9.0
	 */
	public function init_hooks() {
		add_action(
			'init',
			array( $this, 'register_bricks_elements' ),
			11
		);
		add_filter(
			'bricks/builder/i18n',
			function( $i18n ) {
				$i18n['masteriyo'] = esc_html__( 'Masteriyo', 'learning-management-system' );

				return $i18n;
			}
		);
	}

	public function register_bricks_elements() {
		$element_files = array(
			__DIR__ . '/Elements/CourseCategoriesElement.php',
			__DIR__ . '/Elements/CoursesElement.php',
		);
		foreach ( $element_files as $file ) {
			\Bricks\Elements::register_element( $file );
		}
	}

}
