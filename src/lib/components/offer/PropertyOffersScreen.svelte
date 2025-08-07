<script lang="ts">
  import Button from '$lib/components/common/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import { user } from '$lib/stores/auth';
  import { getOffers, upsertOffer, deleteOffer } from '$lib/supabase';
  import { onMount } from 'svelte';
  import OfferList from './OfferList.svelte';
    import type { Offer } from '$lib/types/offer';
    import Link from '../Link.svelte';
    import { sendRequest } from '$lib/helper';
  
  // 接收属性和属性ID作为props
  export let property;
  export let property_id: string;

  const EMPTY_OFFER:Offer = {
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

  let user_id:string|undefined;

  onMount(()=>{
    fetchOffers();
  })

  // 状态变量
  let offers:Offer[] = [];
  let newOffer = EMPTY_OFFER;
  let selectedOffer = null;
  let showDetailsModal = false;
  let showDeleteConfirm = false;
  let offerToDelete = null;
  let isLoading = false;
  let errorMessage = '';

  const fetchOffers = async () => {    
    isLoading = true;
    errorMessage = '';
    
    try {
      const {data:{error,offers:propertyOffers}} = await sendRequest({
        url: `/api/offerproperties/${property_id}/offers`,
        method:'GET'
      })
      if (error) throw error;
      offers = propertyOffers;
    } catch (error) {
      console.error('Error fetching offers:', error);
      errorMessage = 'Failed to load offers. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  // 查看报价详情
  function viewDetails(offer:Offer) {
    newOffer = { ...offer };
    showDetailsModal = true;
  }

  function addNewOffer() {
    showDetailsModal = true;
    newOffer = EMPTY_OFFER;
  }

  // 处理删除确认
  function confirmDelete(offer:Offer) {
    offerToDelete = offer;
    showDeleteConfirm = true;
  }

  // 执行删除
  async function handleDelete() {
    if (!offerToDelete) return;
    
    isLoading = true;
    errorMessage = '';
    
    try {
      const {data:{error}} = await sendRequest({
        url: `/api/offerproperties/${property_id}/offers/${offerToDelete.id}`,
        method: 'DELETE'
      });
      
      if (error) throw error;
      await fetchOffers();
      showDeleteConfirm = false;
      offerToDelete = null;
    } catch (error) {
      console.error('Error deleting offer:', error);
      errorMessage = 'Failed to delete offer. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  const handleUpsertOffer = async (event:any) => {
    event.preventDefault();
    
    isLoading = true;
    errorMessage = '';
    
    try {
      const {data:{error}} = await sendRequest({
        url: `/api/offerproperties/${property_id}/offers`,
        body: newOffer
      });
      if (error) throw error;
      await fetchOffers();
      showDetailsModal = false;
    } catch (error) {
      console.error('Error saving offer:', error);
      errorMessage = 'Failed to save offer. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="space-y-6">
  <Link href={`/dashboard/offers`}>Back to Properties</Link>
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold text-gray-900">Offers for {property?.address || 'Property'}</h1>
    <Button onclick={addNewOffer}>
      Add New Offer
    </Button>
  </div>

  {#if errorMessage}
    <div class="p-4 bg-red-50 border border-red-200 rounded-md">
      <p class="text-red-600">{errorMessage}</p>
    </div>
  {/if}

  <OfferList
    offers={offers}
    isLoading={isLoading}
    handleEdit={viewDetails}
    handleDelete={confirmDelete}
  />
</div>

  <!-- Delete Confirmation Modal -->
  {#if showDeleteConfirm}
    <FormBackdrop handleClose={() => !isLoading && (showDeleteConfirm = false)}>
      <div class="w-full p-6">
        <h2 class="mb-4 text-lg font-medium text-gray-900">Confirm Delete</h2>
        <p class="mb-6 text-gray-600">
          Are you sure you want to delete the offer from {offerToDelete?.buyer}? This action cannot be undone.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            onclick={() => (showDeleteConfirm = false)}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <Button
            onclick={handleDelete}
            variant="danger"
            disabled={isLoading}
          >
            {#if isLoading}
              <span class="inline-block mr-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </span>
            {/if}
            Delete
          </Button>
        </div>
      </div>
    </FormBackdrop>
  {/if}

  <!-- Details Modal -->
  {#if showDetailsModal}
    <FormBackdrop handleClose={() => !isLoading && (showDetailsModal = false)}>
      <div class="w-full p-6">
        <h2 class="mb-4 text-lg font-medium text-gray-900">
          {newOffer.id ? 'Edit Offer' : 'Add New Offer'}
        </h2>
        
        {#if errorMessage}
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-600 text-sm">{errorMessage}</p>
          </div>
        {/if}
        
        <form
          onsubmit={handleUpsertOffer}
          class="space-y-4"
        >
          <Input
            id="buyer"
            bind:value={newOffer.buyer}
            placeholder="Buyer"
            label="Buyer*"
            type="text"
            disabled={isLoading}
          />

          <Input
            id="agent"
            bind:value={newOffer.agent}
            placeholder="Agent"
            label="Agent"
            type="text"
            disabled={isLoading}
          />

          <Input
            id="phone"
            bind:value={newOffer.phone}
            placeholder="Phone"
            label="Phone"
            type="phone"
            disabled={isLoading}
          />

          <Input
            id="email"
            bind:value={newOffer.email}
            placeholder="Email"
            label="Email"
            type="email"
            disabled={isLoading}
          />

          <Input
            id="price"
            bind:value={newOffer.price}
            placeholder="Price"
            label="Price*"
            type="number"
            disabled={isLoading}
          />

          <Input
            id="deposit"
            bind:value={newOffer.deposit}
            placeholder="Deposit"
            label="Deposit"
            type="number"
            disabled={isLoading}
          />

          <Input
            id="completion_date"
            bind:value={newOffer.completion_date}
            placeholder="Completion Date"
            label="Completion Date"
            type="date"
            disabled={isLoading}
          />

          <Input
            id="title_search"
            bind:value={newOffer.title_search}
            placeholder="Title Search"
            label="Title Search"
            type="text"
            disabled={isLoading}
          />

          <Input
            id="schedule_a_conditions"
            bind:value={newOffer.schedule_a_conditions}
            placeholder="Schedule A Conditions"
            label="Schedule A Conditions"
            type="text"
            disabled={isLoading}
          />        
          
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              onclick={() => {showDetailsModal = false}}
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {#if isLoading}
                <span class="inline-block mr-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </span>
              {/if}
              {newOffer?.id ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </FormBackdrop>
  {/if}
