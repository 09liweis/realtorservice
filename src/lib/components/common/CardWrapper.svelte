<script lang="ts">
  import { user } from "$lib/stores/auth";
  import type { Cleaning } from "$lib/types/cleaning";
  import type { SocialMediaService } from "$lib/types/social";
  import { type Staging } from "$lib/types/staging";
  import type { VideoService } from "$lib/types/video";

  export let request:Staging|Cleaning|VideoService|SocialMediaService;

  let showUnreadDot = false;
  if ($user?.isAdmin) {
    showUnreadDot = request.is_admin_unread;
  } else {
    showUnreadDot = request.is_user_unread;
  }
</script>
<div class="relative bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
  {#if showUnreadDot}
    <div class="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full"></div>
  {/if}
  <slot/>
</div>
