<script lang="ts">
    import { page } from '$app/stores';
  import Button from '$lib/components/common/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import Input from '$lib/components/common/Input.svelte';
    import OpenHouseGuestList from '$lib/components/openhouses/OpenHouseGuestList.svelte';
    import Select from '$lib/components/common/Select.svelte';
  import { user } from '$lib/stores/auth';
    import { DASHBOARD_OPENHOUSES_URL, getPageTitle } from '$lib/types/constant';
    import { onMount } from 'svelte';
    import { sendRequest } from '$lib/helper';
  import Link from '$lib/components/Link.svelte';
  
  const property_id = $page.params.propertyId;

  const EMPTY_GUEST = {
    property_id,
    name: '',
    phone: '',
    email: '',
    buy_lease: 'buy',
    has_agent: '',
  };

  let user_id;

  onMount(()=> {
    fetchGuests();
  })

  const fetchGuests = async ()=> {
    const {data: {openhouse_guests,error}} = await sendRequest({
      url: `/api/openhouses/${property_id}`,
      method: 'GET'
    });
    if (error) throw error;
    guests = openhouse_guests;
    isFetching = false;
  }
	// 模拟数据 - 在实际应用中，这些数据会从API获取
	let guests = [];
	let isFetching = true;
  let newGuest = EMPTY_GUEST;

	// 状态变量
	let selectedOffer = null;
	let showDetailsModal = false;
	let showThankYou = false;
	let showDeleteConfirm = false;
	let guestToDelete = { id: null, name: '' };

	// 删除嘉宾
	const deleteGuest = async (id, name) => {
		guestToDelete = { id, name };
		showDeleteConfirm = true;
	};

	const confirmDelete = async () => {
		const { data:{error} } = await sendRequest({
			url: `/api/openhouses/${property_id}/guests/${guestToDelete.id}`,
			method: 'DELETE'
		});
		if (error) throw error;
		fetchGuests(); // 刷新嘉宾列表
		showDeleteConfirm = false;
	};

  function addNewGuest() {
    showDetailsModal = true;
    newGuest = EMPTY_GUEST;
  }

  const handleUpsertGuest = async()=> {
    if (!$user?.isApproved) {
      alert('Your account is not yet approved. Please contact admin to get approval.');
      return;
    }
    const {data:{openhouse_guest, error}} = await sendRequest({
      url: `/api/openhouses/${property_id}/guests`,
      body: newGuest
    })
    if (error) {
      throw error;
    } else {
      showThankYou = true;
      showDetailsModal = false;
      newGuest = EMPTY_GUEST;
      fetchGuests();
    }    
  }
	
</script>

<svelte:head>
  <title>{getPageTitle('Openhouse')}</title>
</svelte:head>

<div class="space-y-6">
  <Link href={DASHBOARD_OPENHOUSES_URL}>
    Back to Openhouses
  </Link>
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Open House Guests Management</h1>
    <Button 
      onclick={() => {
        if (!$user?.isApproved) {
          alert('Your account is not yet approved. Please contact admin to get approval.');
          return;
        }
        addNewGuest();
      }}
      disabled={!$user?.isApproved}
      title={!$user?.isApproved ? 'Account not approved - contact admin' : ''}
    >
      Add New Guest
    </Button>
	</div>

  {#if showThankYou}
  <div class="bg-white rounded-lg p-8 text-center">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
    <p class="text-gray-600 mb-6">We appreciate you signing up for this open house.</p>
    <Button 
      onclick={() => showThankYou = false}
    >
      Back to Open House
    </Button>
  </div>
{:else}
  	{#if isFetching}
      <div class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    {:else}
      <OpenHouseGuestList 
        guests={guests} 
        handleDelete={(id, name) => deleteGuest(id, name)}
      />
    {/if}
{/if}

</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm }
  <FormBackdrop handleClose={() => (showDeleteConfirm = false)}>
    <div class="w-full mt-3 p-6">
      <h2 class="mb-4 text-lg font-medium text-gray-900">
        Confirm Delete
      </h2>
      <p class="mb-4 text-gray-600">
        Are you sure you want to delete {guestToDelete.name}?
      </p>
      <div class="flex justify-end space-x-3">
        <button
          type="button"
          onclick={() => (showDeleteConfirm = false)}
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onclick={confirmDelete}
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  </FormBackdrop>
{/if}

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

        <Select 
          id="buy_lease"
          bind:value={newGuest.buy_lease}
          label="Buy Or Lease"
          options={[
            { value: 'buy', label: 'Buy' },
            { value: 'lease', label: 'Lease' },
          ]}
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