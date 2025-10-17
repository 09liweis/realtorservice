<script lang="ts">
  import Button from '$lib/components/common/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
    import Add from '$lib/components/icons/Add.svelte';
    import Input from '$lib/components/common/Input.svelte';
  import OfferPropertyList from '$lib/components/offers/OfferPropertyList.svelte';
    import { getPageTitle } from '$lib/types/constant';
    import type { OfferProperty } from '$lib/types/offer';
    import { onMount } from 'svelte';
    import { sendRequest } from '$lib/helper';
    import { user } from '../../../lib/stores/auth';

  const EMPTY_OFFER_PROPERTY:OfferProperty = {
    address:'',
    date:'',
    asking_price:'',
    user_id: ''
  };

  let user_id:string|undefined;

  onMount(()=>{
    fetchOfferProperties();
  })

  const fetchOfferProperties = async ()=> {
    isFetching = true;
    try {
      const {data:{error,offer_properties}} = await sendRequest({
        url: '/api/offerproperties',
        method: 'GET'
      });
      if (error) throw error;
      offerProperties = offer_properties;
    } finally {
      isFetching = false;
    }
  }
	// 模拟数据 - 在实际应用中，这些数据会从API获取
	let offerProperties:OfferProperty[] = [];
  let newOfferProperty:OfferProperty = EMPTY_OFFER_PROPERTY;

	// 状态变量
	let selectedOffer = null;
	let showDetailsModal = false;
	let showDeleteModal = false;
	let propertyToDelete = null;
	let isFetching = false;
	let isSubmitting = false;
	let isDeleting = false;

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
    isSubmitting = true;
    try {
      const url = newOfferProperty.id ? `/api/offerproperties/${newOfferProperty.id}` : '/api/offerproperties';
      const method = newOfferProperty.id ? 'PUT' : 'POST';
      const {data:{error}} = await sendRequest({
        url,
        method,
        body: newOfferProperty
      });
      if (error) throw error;
      showDetailsModal = false;
      fetchOfferProperties();
    } finally {
      isSubmitting = false;
    }
  }

  const editOfferProperty = async (property: OfferProperty) => {
    newOfferProperty = { ...property };
    showDetailsModal = true;
  };

  const confirmDelete = (propertyId: string) => {
    propertyToDelete = propertyId;
    showDeleteModal = true;
  };

  const deleteProperty = async () => {
    isDeleting = true;
    try {
      const { data: { error } } = await sendRequest({
        url: `/api/offerproperties/${propertyToDelete}`,
        method: 'DELETE'
      });
      if (error) throw error;
      showDeleteModal = false;
      fetchOfferProperties();
    } finally {
      isDeleting = false;
    }
  };
	
</script>

<svelte:head>
  <title>{getPageTitle('Offers')}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Offers Management</h1>
    <Button onclick={AddNewProperty} disabled={!$user?.isApproved}>
      <Add />
      {#if isFetching}
        Loading...
      {:else}
        Add New Offer Property
      {/if}
    </Button>
	</div>

	<OfferPropertyList {offerProperties} handleClick={viewDetails} handleEdit={editOfferProperty} handleDelete={confirmDelete} />
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
          autocomplete="address"
          handleAutocompleteClick={(address)=>{
            newOfferProperty.address = address.place_name;
          }}
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
            disabled={isSubmitting}
          >
            {#if isSubmitting}
              Loading...
            {:else}
              {newOfferProperty?.id ? 'Update' : 'Save'}
            {/if}
        </Button>
        </div>
      </form>
    </div>
  </FormBackdrop>
    
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal }
  <FormBackdrop handleClose={() => (showDeleteModal = false)}>
    <div class="w-full mt-3 p-6">
      <h2 class="mb-4 text-lg font-medium text-gray-900">Confirm Delete</h2>
      <p class="mb-6 text-gray-600">Are you sure you want to delete this offer property? This action cannot be undone.</p>
      <div class="flex justify-end space-x-3">
        <button
          onclick={()=>{showDeleteModal=false}}
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <Button
          onclick={deleteProperty}
          disabled={isDeleting}
        >
          {#if isDeleting}
            Deleting...
          {:else}
            Delete
          {/if}
        </Button>
      </div>
    </div>
  </FormBackdrop>
{/if}