<script lang="ts">
  import type { Cleaning } from "$lib/types/cleaning";
  import Button from "../common/Button.svelte";
  import CleaningCard from "./CleaningCard.svelte";
  import { createEventDispatcher } from "svelte";
  import { fade, fly, slide } from "svelte/transition";
  import { flip } from "svelte/animate";

  export let requests: Cleaning[] = [];
  export let loading = false;
  export let error = null;

  const dispatch = createEventDispatcher();

  // Handle edit request
  function handleEdit(request: Cleaning) {
    dispatch("edit", request);
  }

  // Handle delete request
  function handleDelete(id: string) {
    dispatch("delete", id);
  }
</script>

<div>
  {#if loading}
    <div class="flex justify-center items-center py-12" transition:fade>
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
      ></div>
    </div>
  {:else if error}
    <div
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"
      transition:slide
    >
      <p>{error}</p>
    </div>
  {:else if requests.length === 0}
    <div class="bg-white shadow rounded-lg p-6 text-center" transition:fade>
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        in:fade={{ delay: 150, duration: 300 }}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">
        No cleaning requests found
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating a new cleaning request.
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each requests as request (request.id)}
        <div
          animate:flip={{ duration: 300 }}
          in:fly={{ y: 20, duration: 300, delay: 100 }}
          out:fade={{ duration: 200 }}
        >
          <CleaningCard
            {request}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>