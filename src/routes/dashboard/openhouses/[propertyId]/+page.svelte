<script lang="ts">
    import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import Input from '$lib/components/Input.svelte';
    import OpenHouseGuestList from '$lib/components/openhouses/OpenHouseGuestList.svelte';
  import { user } from '$lib/stores/auth';
  import { getOpenHouseGuests, upsertOpenHouseGuest } from '$lib/supabase';
  import { onMount } from 'svelte';
  
  export let data;
  // $: ({ property } = data);

  const property_id = $page.params.propertyId;

  const EMPTY_GUEST = {
    property_id,
    name: '',
    phone: '',
    email: '',
    buy_lease: '',
    has_agent: '',
  };

  onMount(()=> {
    fetchGuests();
  });

  const fetchGuests = async ()=> {
    if ($user) {
      const {data, error} = await getOpenHouseGuests({user_id:$user.id, property_id});
      if (error) throw error;
      guests = data;
    }
  }
	// 模拟数据 - 在实际应用中，这些数据会从API获取
	let guests = [];
  let newGuest = EMPTY_GUEST;

	// 状态变量
	let selectedOffer = null;
	let showDetailsModal = false;

	// 查看报价详情
	function viewDetails(offer) {
		newGuest = { ...offer };
		showDetailsModal = true;
	}

  function addNewGuest() {
    showDetailsModal = true;
    newGuest = EMPTY_GUEST;
  }

  const handleUpsertGuest = async()=> {
    if (!$user) return;
    await upsertOpenHouseGuest({
      user_id: $user.id,
      ...newGuest
    });
    fetchGuests();
    showDetailsModal = false;
    newGuest = EMPTY_GUEST;
  }
	
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Open House Guests Management</h1>
    <Button onclick={addNewGuest}>
      Add New Guest
    </Button>
	</div>

  <OpenHouseGuestList guests={guests} />

</div>

<!-- Details Modal -->
{#if showDetailsModal }
  <FormBackdrop handleClose={() => (showDetailsModal = false)}>
    <div class="w-full mt-3 p-6">
      <h2 class="mb-4 text-lg font-medium text-gray-900">
        {selectedOffer ? 'Edit Offer' : 'Add New Offer'}
      </h2>
      <form
        onsubmit={handleUpsertGuest}
        class="space-y-4"
      >
        
        <Input
          id="name"
          bind:value={newGuest.name}
          placeholder="Name"
          label="Name"
          type="text"
        />

        <Input
          id="phone"
          bind:value={newGuest.phone}
          placeholder="Phone"
          label="Phone"
          type="phone"
        />

        <Input
          id="email"
          bind:value={newGuest.email}
          placeholder="Email"
          label="Email"
          type="email"
        />

        <Input
          id="buy_lease"
          bind:value={newGuest.buy_lease}
          placeholder="Buy Or Lease"
          label="Buy Or Lease"
          type="text"
        />

        <Input
          id="has_agent"
          bind:value={newGuest.has_agent}
          placeholder="Has Agent?"
          label="Has Agent?"
          type="text"
        />     
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            onclick={()=>{showDetailsModal=false}}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <Button
            type="submit"
          >
            {newGuest?.id ? 'Update' : 'Save'}
        </Button>
        </div>
      </form>
    </div>
  </FormBackdrop>
    
{/if}