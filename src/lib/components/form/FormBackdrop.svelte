<script lang="ts">
  export let handleClose;
</script>

<div class="fixed inset-0 z-100 overflow-y-auto flex items-center justify-center min-h-screen">
  <div class="fixed -z-1 inset-0 transition-opacity" aria-hidden="true" onclick={handleClose}>
    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
  </div>

  <div
    class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl min-w-lg"
  >
    <div class="absolute top-0 right-0 pt-4 pr-4">
      <button
        type="button"
        onclick={handleClose}
        class="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span class="sr-only">Close</span>
        ❌
      </button>
    </div>
    <slot />

  </div>
</div>
