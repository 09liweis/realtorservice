<script lang="ts">
  import type { Staging } from "$lib/types/staging";
  import StagingCard from "./StagingCard.svelte";
  import { createEventDispatcher } from "svelte";

  export let requests: Staging[] = [];
  export let loading = false;
  export let error = null;

  const dispatch = createEventDispatcher();

  // 处理查看请求
  function handleView(request:Staging) {
    dispatch("view", request);
  }

  // 处理编辑请求
  function handleEdit(request:Staging) {
    dispatch("edit", request);
  }

  // 处理删除请求
  function handleDelete(id:string) {
    dispatch("delete", id);
  }
</script>

<div>
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>
  {:else if error}
    <div
      class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6"
    >
      <p>{error}</p>
    </div>
  {:else if requests.length === 0}
    <div class="bg-white shadow rounded-lg p-6 text-center">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">
        No staging requests found
      </h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating a new staging request.
      </p>
      <div class="mt-6">
        <button
          on:click={() => dispatch("new")}
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            class="mr-2 -ml-1 h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          New Staging Request
        </button>
      </div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each requests as request (request.id)}
        <StagingCard
          {request}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      {/each}
    </div>
  {/if}
</div>
