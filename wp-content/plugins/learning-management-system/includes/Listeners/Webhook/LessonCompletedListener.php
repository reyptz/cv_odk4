<?php
/**
 * Lesson completed event listener class.
 *
 * @since 1.6.9
 */

namespace Masteriyo\Listeners\Webhook;

use Masteriyo\Abstracts\Listener;
use Masteriyo\Resources\CourseProgressItemResource;
use Masteriyo\Resources\CourseResource;
use Masteriyo\Resources\LessonResource;
use Masteriyo\Resources\UserResource;
use Masteriyo\Resources\WebhookResource;

defined( 'ABSPATH' ) || exit;

/**
 * Lesson completed event listener class.
 *
 * @since 1.6.9
 */
class LessonCompletedListener extends Listener {

	/**
	 * Event name the listener is listening to.
	 *
	 * @since 1.6.9
	 */
	protected $event_name = 'lesson.completed';

	/**
	 * Get event label.
	 *
	 * @since 1.6.9
	 *
	 * @return string
	 */
	public function get_label() {
		return __( 'Lesson Completed', 'learning-management-system' );
	}

	/**
	 * Setup the webhook event.
	 *
	 * @since 1.6.9
	 *
	 * @param callable $deliver_callback
	 * @param \Masteriyo\Models\Webhook $webhook
	 */
	public function setup( $deliver_callback, $webhook ) {
		add_action(
			'masteriyo_new_course_progress_item',
			function( $id, $progress_item ) use ( $deliver_callback, $webhook ) {
				if ( 'lesson' !== $progress_item->get_item_type() || ! $this->can_deliver( $webhook, $progress_item->get_course_id() ) ) {
					return;
				}

				call_user_func_array(
					$deliver_callback,
					array(
						WebhookResource::to_array( $webhook ),
						$this->get_payload( $progress_item, $webhook ),
					)
				);
			},
			10,
			2
		);
	}

	/**
	 * Get payload data for the currently triggered webhook.
	 *
	 * @since 1.6.9
	 *
	 * @param \Masteriyo\Models\CourseProgressItem $progress_item
	 * @param \Masteriyo\Models\Webhook $webhook
	 *
	 * @return array
	 */
	protected function get_payload( $progress_item, $webhook ) {
		$data   = CourseProgressItemResource::to_array( $progress_item );
		$lesson = masteriyo_get_lesson( $progress_item->get_item_id() );
		$course = masteriyo_get_course( $progress_item->get_course_id() );
		$user   = masteriyo_get_user( $progress_item->get_user_id() );

		if ( $lesson ) {
			$data['lesson'] = LessonResource::to_array( $lesson );
		}

		if ( $course ) {
			$data['course'] = CourseResource::to_array( $course );
		}

		if ( $user ) {
			$data['user'] = UserResource::to_array( $user );
		}

		/**
		 * Filters the payload data for the currently triggered webhook.
		 *
		 * @since 1.6.9
		 *
		 * @param array $data The payload data.
		 * @param \Masteriyo\Models\Webhook $webhook
		 * @param \Masteriyo\Listeners\Webhook\LessonCompletedListener $listener Listener object.
		 * @param \Masteriyo\Models\CourseProgressItem $progress_item Course progress item model object.
		 */
		return apply_filters( "masteriyo_webhook_payload_for_{$this->event_name}", $data, $webhook, $this, $progress_item );
	}
}
