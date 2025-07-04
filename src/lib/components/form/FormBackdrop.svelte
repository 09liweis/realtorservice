<script lang="ts">
  export let handleClose;
</script>

<div class="fixed inset-0 z-100 overflow-y-auto flex items-center justify-center min-h-screen">
  <div class="fixed -z-1 inset-0 transition-opacity" aria-hidden="true" onclick={handleClose}>
    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
  </div>

  <div
    class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-2xl shadow-xl w-4xl max-w-4xl"
  >
    <slot />

  </div>
</div>
