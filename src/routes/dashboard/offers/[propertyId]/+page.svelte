<script lang="ts">
  import { page } from '$app/stores';
  import PropertyOffersScreen from '$lib/components/offer/PropertyOffersScreen.svelte';
  
  export let data;
  $: ({ property } = data);

  const property_id = $page.params.propertyId;
</script>

<PropertyOffersScreen {property} {property_id} />