<script lang="ts">
  import { getListings, upsertListing, deleteListing } from '$lib/supabase';
  import { page } from '$app/stores';
  import { user } from '$lib/stores/auth';
  import type { Listing } from '$lib/types/listing';
  import ListingForm from '$lib/components/listings/ListingForm.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import ListingList from '$lib/components/listings/ListingList.svelte';
    import Button from '$lib/components/Button.svelte';

  let showForm = false;

  let listings: Listing[] = [];
  
  const EMPTY_LISTING: Listing = {
    listing_type: '',
    project_name: '',
    developer: '',
    address: '',
    location: '',
    ptype: '',
    bedroom: '',
    bathroom: '',
    level: '',
    size: '',
    parking: '',
    locker: '',
    basement: '',
    exposure: '',
    occupancy: '',
    asking_price: '',
    commission: '',
    description: '',
    is_sold: false,
    pictures: '',
    original_price: '',
    deposit_paid: '',
  };
  let newListing = EMPTY_LISTING;
  let isEditing = false;

  $: {
    loadListings();
  }

  async function loadListings() {
    const { data, error } = await getListings({ user_id: $user?.id });
    if (!error) listings = data;
  }

  function editListing(listing: Listing) {
    isEditing = true;
    newListing = { ...listing };
  }

  async function handleDelete(id: string) {
    const { error } = await deleteListing(id);
    if (!error) loadListings();
  }

  function resetForm() {
		newListing = EMPTY_LISTING;
	}

  async function handleSubmit() {
    if (!$user) return;
    const listing = {
      ...newListing,
      user_id:$user.id,
    };

    const { error } = await upsertListing(listing);
    if (!error) {
      isEditing = false;
      resetForm();
      showForm = false;
      loadListings();
    }
  }
</script>

<div class="space-y-6">

  <div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Listings Management</h1>
		<Button
			onclick={() => {
				showForm = true;
				resetForm();
			}}
		>
			Add New Listings
		</Button>
	</div>
  
  {#if showForm}
  <FormBackdrop handleClose={()=>showForm=false}>
    <ListingForm
      handleSubmit={handleSubmit}
      listing={newListing}
      onCancel={() => {
        showForm = false;
        resetForm();
      }}
    />
  </FormBackdrop>
  {/if}

  <ListingList listings={listings} />
</div>