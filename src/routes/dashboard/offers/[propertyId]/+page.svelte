<script lang="ts">
  import { page } from '$app/stores';
  import PropertyOffersScreen from '$lib/components/offer/PropertyOffersScreen.svelte';
    import { getPageTitle } from '$lib/types/constant.js';
  
  const property_id = $page.params.propertyId;
</script>

<svelte:head>
  <title>{getPageTitle('Offers')}</title>
</svelte:head>

<PropertyOffersScreen {property_id} />