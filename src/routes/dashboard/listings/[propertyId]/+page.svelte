<script lang="ts">
  import { getListing, upsertListing, deleteListing } from '$lib/supabase';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let data;

  let listing = data.listing;
  let formData = { ...listing };
  let isEditing = false;

  async function handleDelete() {
    const { error } = await deleteListing(listing.id);
    if (!error) {
      goto('/dashboard/listings');
    }
  }

  async function handleSubmit() {
    const updatedListing = {
      ...formData,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      square_feet: Number(formData.square_feet)
    };

    const { error } = await upsertListing(updatedListing);
    if (!error) {
      isEditing = false;
      listing = updatedListing;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Listing Details</h1>

  {#if isEditing}
    <form on:submit|preventDefault={handleSubmit} class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="address" class="block mb-2">Address</label>
          <input
            id="address"
            type="text"
            bind:value={formData.address}
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label for="price" class="block mb-2">Price</label>
          <input
            id="price"
            type="number"
            bind:value={formData.price}
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label for="status" class="block mb-2">Status</label>
          <select
            id="status"
            bind:value={formData.status}
            class="w-full p-2 border rounded"
            required
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        <div>
          <label for="bedrooms" class="block mb-2">Bedrooms</label>
          <input
            id="bedrooms"
            type="number"
            bind:value={formData.bedrooms}
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label for="bathrooms" class="block mb-2">Bathrooms</label>
          <input
            id="bathrooms"
            type="number"
            bind:value={formData.bathrooms}
            class="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label for="square_feet" class="block mb-2">Square Feet</label>
          <input
            id="square_feet"
            type="number"
            bind:value={formData.square_feet}
            class="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      <div class="mb-4">
        <label for="description" class="block mb-2">Description</label>
        <textarea
          id="description"
          bind:value={formData.description}
          class="w-full p-2 border rounded"
          rows="3"
        ></textarea>
      </div>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          on:click={() => {
            isEditing = false;
            formData = { ...listing };
          }}
          class="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
          Save Changes
        </button>
      </div>
    </form>
  {:else}
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-2">{listing.address}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p class="text-gray-600">Price</p>
          <p class="text-lg font-medium">${listing.price.toLocaleString()}</p>
        </div>
        <div>
          <p class="text-gray-600">Status</p>
          <p class="text-lg font-medium capitalize">{listing.status}</p>
        </div>
        <div>
          <p class="text-gray-600">Bedrooms/Bathrooms</p>
          <p class="text-lg font-medium">{listing.bedrooms}/{listing.bathrooms}</p>
        </div>
        <div>
          <p class="text-gray-600">Square Feet</p>
          <p class="text-lg font-medium">{listing.square_feet.toLocaleString()}</p>
        </div>
      </div>
      <div class="mb-4">
        <p class="text-gray-600">Description</p>
        <p class="whitespace-pre-line">{listing.description}</p>
      </div>
      <div class="flex justify-end gap-2">
        <button
          on:click={() => {
            isEditing = true;
            formData = { ...listing };
          }}
          class="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Edit
        </button>
        <button
          on:click={handleDelete}
          class="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  {/if}
</div>