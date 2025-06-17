<script lang="ts">
    import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import Input from '$lib/components/Input.svelte';
  import { user } from '$lib/stores/auth';
  import { getOffers, upsertOffer, deleteOffer } from '$lib/supabase';
  import { onMount } from 'svelte';
  
  export let data;
  $: ({ property } = data);

  const property_id = $page.params.propertyId;

  const EMPTY_OFFER = {
    property_id,
    buyer: '',
    agent: '',
    phone: '',
    email: '',
    price: '',
    deposit: '',
    irrevocability: false,
    completion_date: '',
    title_search: '',
    schedule_a_conditions: '',
  };

  onMount(()=> {
    fetchOffers();
  });

  const fetchOffers = async ()=> {
    if ($user) {
      const {data, error} = await getOffers({user_id:$user.id, property_id});
      if (error) throw error;
      offers = data;
    }
  }
	// 模拟数据 - 在实际应用中，这些数据会从API获取
	let offers = [];
  let newOffer = EMPTY_OFFER;

	// 状态变量
	let selectedOffer = null;
	let showDetailsModal = false;

	// 格式化金额
	function formatAmount(amount) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(amount);
	}

	// 查看报价详情
	function viewDetails(offer) {
		newOffer = { ...offer };
		showDetailsModal = true;
	}

  function AddNewOffer() {
    showDetailsModal = true;
    newOffer = EMPTY_OFFER;
  }

  const handleUpsertOffer = async()=> {
    if (!$user) return;
    await upsertOffer({
      user_id: $user.id,
      ...newOffer
    });
    fetchOffers();
    showDetailsModal = false;
  }
	
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Offers Management</h1>
    <Button onclick={AddNewOffer}>
      Add New Offer
    </Button>
	</div>

  <div>
    {#each offers as offer}
    <article>
      {offer.buyer}
    </article>
    {/each}
  </div>

</div>

<!-- Details Modal -->
{#if showDetailsModal }
  <FormBackdrop handleClose={() => (showDetailsModal = false)}>
    <div class="w-full mt-3">
      <h2 class="mb-4 text-lg font-medium text-gray-900">
        {selectedOffer ? 'Edit Offer' : 'Add New Offer'}
      </h2>
      <form
        onsubmit={handleUpsertOffer}
        class="space-y-4"
      >
        
        <Input
          id="buyer"
          bind:value={newOffer.buyer}
          placeholder="Buyer"
          label="Buyer"
          type="text"
        />

        <Input
          id="agent"
          bind:value={newOffer.agent}
          placeholder="Agent"
          label="Agent"
          type="text"
        />

        <Input
          id="phone"
          bind:value={newOffer.phone}
          placeholder="Phone"
          label="Phone"
          type="phone"
        />

        <Input
          id="email"
          bind:value={newOffer.email}
          placeholder="Email"
          label="Email"
          type="email"
        />

        <Input
          id="price"
          bind:value={newOffer.price}
          placeholder="Price"
          label="Price"
          type="number"
        />

        <Input
          id="deposit"
          bind:value={newOffer.deposit}
          placeholder="deposit"
          label="deposit"
          type="number"
        />

        <!-- <Input
          id="irrevocability"
          bind:value={newOffer.irrevocability}
          placeholder="Irrevocability"
          label="Irrevocability"
          type="checkbox"
        /> -->

        <Input
          id="completion_date"
          bind:value={newOffer.completion_date}
          placeholder="Completion Date"
          label="Completion Date"
          type="date"
        />

        <Input
          id="title_search"
          bind:value={newOffer.title_search}
          placeholder="Title Search"
          label="Title Search"
          type="text"
        />

        <Input
          id="schedule_a_conditions"
          bind:value={newOffer.schedule_a_conditions}
          placeholder="Schedule A Conditions"
          label="Schedule A Conditions"
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
            {newOffer?.id ? 'Update' : 'Save'}
        </Button>
        </div>
      </form>
    </div>
  </FormBackdrop>
    
{/if}