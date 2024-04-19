<?php
/**
 * REST API Utilities Controller
 *
 * Handles requests to the utilities endpoint, specifically for managing redundant enrollments.
 *
 * @category API
 * @package Masteriyo\RestApi
 * @since 1.9.0
 */

namespace Masteriyo\RestApi\Controllers\Version1;

use Masteriyo\Helper\Permission;
use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_Error;

defined( 'ABSPATH' ) || exit;

/**
 * REST API Utilities Controller Class.
 *
 * @package Masteriyo\RestApi
 */
class UtilitiesController extends WP_REST_Controller {
	/**
	 * Endpoint namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'masteriyo/v1';

	/**
	 * Route base.
	 *
	 * @var string
	 */
	protected $rest_base = 'utilities';

	/**
	 * Permission class instance.
	 *
	 * @since 1.9.0
	 * @var Permission
	 */
	protected $permission;

	/**
	 * Constructor.
	 *
	 * Sets up the utilities controller.
	 *
	 * @since 1.9.0
	 * @param Permission|null $permission The permission handler instance.
	 */
	public function __construct( Permission $permission = null ) {
		$this->permission = $permission;
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @since 1.9.0
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/redundant-enrollments',
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_redundant_enrollments' ),
				'permission_callback' => array( $this, 'delete_item_permissions_check' ),
			)
		);
	}

	/**
	 * Checks if the current user has permissions to perform deletion.
	 *
	 * @since 1.9.0
	 * @param WP_REST_Request $request The request.
	 * @return true|WP_Error True if the request has access, WP_Error object otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		if ( is_null( $this->permission ) ) {
			return new WP_Error( 'masteriyo_null_permission', __( 'Sorry, the permission object for this resource is null.', 'learning-management-system' ) );
		}

		if ( ! masteriyo_is_current_user_admin() ) {
			return new \WP_Error(
				'masteriyo_permission_denied',
				__( 'Sorry, you are not allowed to delete this.', 'learning-management-system' ),
				array(
					'status' => rest_authorization_required_code(),
				)
			);
		}

		return true;
	}

	/**
	 * Handles deletion of redundant enrollments.
	 *
	 * Deletes duplicate enrollments while keeping an active status enrollment if possible.
	 *
	 * @since 1.9.0
	 * @param WP_REST_Request $request The request.
	 *
	 * @return WP_Error|WP_REST_Response WP_Error on failure, WP_REST_Response on success.
	 */
	public function delete_redundant_enrollments( $request ) {
		global $wpdb;

		$table_name = $wpdb->prefix . 'masteriyo_user_items';

			$sub_query = "SELECT
      user_id,
      item_id,
      COALESCE(MAX(CASE WHEN status = 'active' THEN id END), MAX(id)) as id_to_keep
      FROM
      {$table_name}
      GROUP BY
      user_id, item_id
      HAVING
      COUNT(*) > 1";

		$sub_query = $wpdb->prepare( $sub_query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		$delete_query = "DELETE t1
                    FROM {$table_name} t1
                    INNER JOIN ({$sub_query}) t2
                    ON t1.user_id = t2.user_id AND t1.item_id = t2.item_id
                    WHERE t1.id <> t2.id_to_keep";

		$result = $wpdb->query( $delete_query ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared

		if ( false === $result ) {
			return new WP_Error( 'masteriyo_deletion_failed', __( 'Failed to delete redundant enrollments.', 'learning-management-system' ), array( 'status' => 500 ) );
		}

		return rest_ensure_response(
			array(
				'message' => __( 'Redundant enrollments successfully deleted.', 'learning-management-system' ),
				'deleted' => $result,
			)
		);
	}
}
