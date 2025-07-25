<script lang="ts">
  import { user } from "$lib/stores/auth";
  import type { Cleaning } from "$lib/types/cleaning";
  import type { SocialMediaService } from "$lib/types/social";
  import { type Staging } from "$lib/types/staging";
  import type { VideoService } from "$lib/types/video";

  export let request:Staging|Cleaning|VideoService|SocialMediaService;

	let unreadStyle = 'border-t-4 ';
	if ($user?.isAdmin) {
		unreadStyle += (request.is_admin_unread ? 'border-red-500' : '');
	} else {
		unreadStyle += (request.is_user_unread ? 'border-red-500' : '');
	}
</script>
<div class={`bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 ${unreadStyle}`}>
  <slot/>
</div>
