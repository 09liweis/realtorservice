<script lang="ts">
  import { page } from '$app/stores';
  import { user } from '$lib/stores/auth';
  import type { Listing } from '$lib/types/listing';
  import ListingForm from '$lib/components/listings/ListingForm.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import ListingList from '$lib/components/listings/ListingList.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import Add from '$lib/components/icons/Add.svelte';
    import { onMount } from 'svelte';
    import { sendRequest } from '$lib/helper';

  let showForm = false;

  let listings: Listing[] = [];
  
  const EMPTY_LISTING: Listing = {
    listing_type: '',
    project_name: '',
    developer: '',
    address: '',
    latitude: 0,
    longitude: 0,
    remark: '',
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
    pics: '',
    original_price: '',
    deposit_paid: '',
  };
  let newListing = EMPTY_LISTING;
  let isEditing = false;
  let user_id;

  onMount(()=> {
    loadListings();
  })

  async function loadListings() {
    const {data:{listings:data,error}} = await sendRequest({
      url: '/api/listings',
      method: "GET"
    })
    if (!error) listings = data;
  }

  function editListing(listing: Listing) {
    isEditing = true;
    showForm = true;
    newListing = { ...listing };
  }

  async function handleDelete(id: string) {
    const { data:{error} } = await sendRequest({
      url: `/api/listings/${id}`,
      method: "DELETE"
    });
    if (!error) loadListings();
  }

  function resetForm() {
		newListing = EMPTY_LISTING;
	}

  async function handleSubmit() {
    if (!$user?.isApproved) {
      alert('Your account is not yet approved. Please contact admin to get approval.');
      return;
    }

    let url = '/api/listings';
    let method = "POST";

    if (newListing?.id) {
      url = `/api/listings/${newListing?.id}`;
      method = "PUT";
    }

    const { data:{error} } = await sendRequest({
      body: newListing,
      url,
      method
    });
    if (!error) {
      isEditing = false;
      resetForm();
      showForm = false;
      loadListings();
    } else {
      throw error;
    }
  }
</script>

<div class="space-y-6">

  <div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Listings Management</h1>
		<Button
			onclick={() => {
        if (!$user?.isApproved) {
          alert('Your account is not yet approved. Please contact admin to get approval.');
          return;
        }
				showForm = true;
				resetForm();
			}}
      disabled={!$user?.isApproved}
		>
      <Add />
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

  <ListingList listings={listings} editListing={editListing} deleteListing={handleDelete} />
</div>