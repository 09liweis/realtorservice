<script lang="ts">
  import Button from '$lib/components/common/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
    import Add from '$lib/components/icons/Add.svelte';
    import Input from '$lib/components/common/Input.svelte';
  import OfferList from '$lib/components/offers/OfferList.svelte';
    import { user } from '$lib/stores/auth';
    import { getOfferProperties, upsertOfferProperty } from '$lib/supabase';
    import { getPageTitle } from '$lib/types/constant';
    import type { OfferProperty } from '$lib/types/offer';
    import { onMount } from 'svelte';

  const EMPTY_OFFER_PROPERTY:OfferProperty = {
    address:'',
    date:'',
    asking_price:'',
    user_id: ''
  };

  let user_id:string|undefined;

  $: {
    user_id = $user?.id;
    fetchOfferProperties();
  }

  const fetchOfferProperties = async ()=> {
    if (user_id) {
      const {data, error} = await getOfferProperties({user_id});
      if (error) throw error;
      offers = data;
    }
  }
	// 模拟数据 - 在实际应用中，这些数据会从API获取
	let offers:OfferProperty[] = [];
  let newOfferProperty:OfferProperty = EMPTY_OFFER_PROPERTY;

	// 状态变量
	let selectedOffer = null;
	let showDetailsModal = false;

	// 查看报价详情
	function viewDetails(offer:OfferProperty) {
		newOfferProperty = { ...offer };
		showDetailsModal = true;
	}

  function AddNewProperty() {
    showDetailsModal = true;
    newOfferProperty = EMPTY_OFFER_PROPERTY;
  }

  const handleUpsertOfferProperty = async()=> {
    if (!user_id) return;
    const {error} = await upsertOfferProperty({
      ...newOfferProperty,
      user_id
    });
    if (error) throw error;
    showDetailsModal = false;
    fetchOfferProperties();
  }
	
</script>

<svelte:head>
  <title>{getPageTitle('Offers')}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Offers Management</h1>
    <Button onclick={AddNewProperty}>
      <Add />
      Add New Offer Property
    </Button>
	</div>

	<OfferList offers={offers} handleClick={viewDetails} />
</div>

<!-- Details Modal -->
{#if showDetailsModal }
  <FormBackdrop handleClose={() => (showDetailsModal = false)}>
    <div class="w-full mt-3 p-6">
      <h2 class="mb-4 text-lg font-medium text-gray-900">
        {selectedOffer ? 'Edit Sold Property' : 'Add New Offer Property'}
      </h2>
      <form
        onsubmit={handleUpsertOfferProperty}
        class="space-y-4"
      >
        
        <Input
          id="address"
          bind:value={newOfferProperty.address}
          placeholder="Address"
          label="Address"
          type="text"
        />

        <Input
          id="date"
          bind:value={newOfferProperty.date}
          placeholder="Date"
          label="Date"
          type="date"
        />

        <Input
          id="asking_price"
          bind:value={newOfferProperty.asking_price}
          placeholder="Asking Price"
          label="Asking Price"
          type="number"
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
            {newOfferProperty?.id ? 'Update' : 'Save'}
        </Button>
        </div>
      </form>
    </div>
  </FormBackdrop>
    
{/if}