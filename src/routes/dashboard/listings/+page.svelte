<script lang="ts">
  import { getListings, upsertListing, deleteListing } from '$lib/supabase';
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import { user } from '$lib/stores/auth';
    import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
    import ListingList from '$lib/components/listings/ListingList.svelte';

  let showForm = false;

  let listings = [];
  
  const EMPTY_LISTING = {
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
  const INPUT_FEILDS = [
    {name: 'listing_type', type:'text', label: 'listing_type'},
    {name: 'project_name', type:'text', label: 'project_name'},
    {name: 'developer', type:'text', label: 'developer'},
    {name: 'address', type:'text', label: 'address'},
    {name: 'location', type:'text', label: 'location'},
    {name: 'ptype', type:'text', label: 'ptype'},
    {name: 'bedroom', type:'number', label: 'bedroom'},
    {name: 'bathroom', type:'number', label: 'bathroom'},
    {name: 'level', type:'text', label: 'level'},
    {name: 'size', type:'text', label: 'size'},
    {name: 'parking', type:'text', label: 'parking'},
    {name: 'locker', type:'text', label: 'locker'},
    {name: 'basement', type:'text', label: 'basement'},
    {name: 'exposure', type:'text', label: 'exposure'},
    {name: 'occupancy', type:'text', label: 'occupancy'},
    {name: 'asking_price', type:'number', label: 'asking_price'},
    {name: 'commission', type:'text', label: 'commission'},
    {name: 'description', type:'text', label: 'description'},
    {name: 'is_sold', type:'checkbox', label: 'is_sold'},
    {name: 'pictures', type:'text', label: 'pictures'},
    {name: 'original_price', type:'number', label: 'original_price'},
    {name: 'deposit_paid', type:'number', label: 'deposit_paid'},
  ]
  let newListing = EMPTY_LISTING;
  let isEditing = false;

  $: {
    loadListings();
  }

  async function loadListings() {
    const { data, error } = await getListings({ user_id: $user?.id });
    if (!error) listings = data;
  }

  function editListing(listing) {
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

<div class="container mx-auto p-4">

  <div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Listings Management</h1>
		<Button
			onclick={() => {
				showForm = true;
				resetForm();
			}}
		>
			Add Open House
		</Button>
	</div>
  
  {#if showForm}
  <FormBackdrop handleClose={()=>showForm=false}>
    <form onsubmit={handleSubmit} class="mb-8">

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {#each INPUT_FEILDS as { name, type, label } (name)}
          {#if (type == 'checkbox')}
          <Input 
            id={name}
            bind:checked={newListing[name]}
            type={type}
            label={label}
            placeholder={label}
          />
          {:else}
          <Input 
            id={name}
            bind:value={newListing[name]}
            type={type}
            label={label}
            placeholder={label}
          />
          {/if}
        {/each}
      </div>
      
      <div class="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          onclick={resetForm}
          variant="secondary"
        >
          Cancel
        </Button>
        
        <Button type="submit" variant="primary">
          {isEditing ? 'Update' : 'Create'} Listing
        </Button>
      </div>
    </form>
  </FormBackdrop>
  {/if}

  <ListingList listings={listisngs} />
</div>