<script lang="ts">
    import { PHONE_NUMBER } from "$lib/types/constant";

  export let pageTitle;
  export let pageContent;
  export let callText;
  export let serviceImage = '';
</script>

<h1 class="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>

<div class="prose max-w-none mb-10">
  {#if serviceImage}
  <img src={serviceImage} alt={pageTitle} class="mb-6" />
  {/if}
  <p>
    {pageContent}
  </p>

  <p class="mt-6 font-medium">
    {callText} Just call us at <a
      href="tel:{PHONE_NUMBER}"
      class="text-primary hover:underline">{PHONE_NUMBER}</a
    >
  </p>
</div>
