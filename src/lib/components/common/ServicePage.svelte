<script lang="ts">
    import { PHONE_NUMBER } from "$lib/types/constant";

  export let pageTitle;
  export let pageContent;
  export let callText;
  export let serviceImage = '';
  export let gallery: string[]= [];
</script>

<h1 class="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>

<div class="prose max-w-none mb-10 space-y-6">
  {#if serviceImage}
  <img src={serviceImage} alt={pageTitle} />
  {/if}
  
  {#if gallery.length > 0}
  <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each gallery as image}
    <img src={image} alt={pageTitle} class="rounded" />
    {/each}
  </div>
  {/if}

  <p class="">
    {pageContent}
  </p>

  <slot />

  <p class="font-medium">
    {callText} Just call us at <a
      href="tel:{PHONE_NUMBER}"
      class="text-primary hover:underline">{PHONE_NUMBER}</a
    >
  </p>
</div>
