<script lang="ts">
    import { getStatusStyle } from '$lib/types/constant';
  import type { VideoService } from '$lib/types/video';
  import { VIDEO_SERVICE_STATUS } from '$lib/types/video';

  export let videoService: VideoService;

  function getStatusInfo(status: string) {
    return VIDEO_SERVICE_STATUS.find(s => s.value === status) || VIDEO_SERVICE_STATUS[0];
  }
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <!-- Header Background -->
  <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-white">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-2">
          <div class="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <span class="text-2xl">🎬</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold">Video Service Request</h1>
            <p class="text-purple-100">Professional Video Editing</p>
          </div>
        </div>
        
        <!-- Request ID -->
        <div class="flex items-center space-x-2 mt-4">
          <svg class="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          <span class="text-lg font-medium">Request #{videoService.id?.slice(-8) || 'N/A'}</span>
        </div>
      </div>

      <!-- Status -->
      <div class="flex items-center space-x-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border capitalize {getStatusStyle(videoService.status)}">
          {getStatusInfo(videoService.status).label}
        </span>
      </div>
    </div>
  </div>

  <!-- Quick Stats -->
  <div class="px-8 py-6 bg-gray-50 border-b border-gray-200">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {videoService.number_of_videos}
        </div>
        <div class="text-sm text-gray-600">
          {videoService.number_of_videos === 1 ? 'Video' : 'Videos'}
        </div>
      </div>
      
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">
          {videoService.addons?.length || 0}
        </div>
        <div class="text-sm text-gray-600">Add-on Services</div>
      </div>
      
      <div class="text-center">
        <div class="text-2xl font-bold text-purple-600">
          {videoService.created_at ? new Date(videoService.created_at).toLocaleDateString() : 'N/A'}
        </div>
        <div class="text-sm text-gray-600">Request Date</div>
      </div>
    </div>
  </div>
</div>