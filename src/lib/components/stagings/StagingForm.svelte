<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "../Button.svelte";
  import { OCCUPATION_STATUS_OPTIONS, PROPERTY_TYPES, STAGING_STATUS_OPTIONS } from "$lib/types/constant";
    import { EMPTY_STAGING, type Staging } from "$lib/types/staging";

  export let isEdit = false;
  export let request:Staging = {...EMPTY_STAGING};

  const dispatch = createEventDispatcher();

  // 属性类型选项
  const propertyTypeOptions = [...PROPERTY_TYPES];

  // 占用状态选项
  const occupationStatusOptions = [...OCCUPATION_STATUS_OPTIONS];

  // 状态选项
  const statusOptions = [...STAGING_STATUS_OPTIONS];

  // 处理表单提交
  function handleSubmit() {
    // 验证表单
    if (!request.location) {
      alert("Property location is required");
      return;
    }

    // 提交表单
    dispatch("submit", { ...request });
  }

  // 处理取消
  function handleCancel() {
    dispatch("cancel");
  }
</script>

<div class="bg-white shadow rounded-lg p-6">
  <h2 class="text-lg font-medium text-gray-900 mb-6">
    {isEdit ? "Edit Staging Request" : "New Staging Request"}
  </h2>

  <form onsubmit={handleSubmit} class="space-y-6">
    <!-- 属性位置 -->
    <div>
      <label
        for="location"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Property Location*
      </label>
      <input
        type="text"
        id="location"
        bind:value={request.location}
        required
        placeholder="Address, City, Postal Code"
        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      />
    </div>

    <!-- 属性类型和大小 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label
          for="property_type"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Property Type
        </label>
        <select
          id="property_type"
          bind:value={request.property_type}
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {#each propertyTypeOptions as type}
            <option value={type.toLowerCase()}>{type}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="size" class="block text-sm font-medium text-gray-700 mb-1">
          Size (sq ft)
        </label>
        <input
          type="number"
          id="size"
          bind:value={request.size}
          min="0"
          placeholder="Property square footage"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <!-- 占用状态和房间 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label
          for="occupation_status"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Occupation Status
        </label>
        <select
          id="occupation_status"
          bind:value={request.occupation_status}
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {#each occupationStatusOptions as status}
            <option value={status.toLowerCase()}>{status}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="rooms" class="block text-sm font-medium text-gray-700 mb-1">
          Rooms to be Staged
        </label>
        <input
          type="number"
          id="rooms"
          bind:value={request.rooms}
          placeholder=""
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <!-- 售价和时间线 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label
          for="selling_price"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Approximate Selling Price ($)
        </label>
        <input
          type="number"
          id="selling_price"
          bind:value={request.selling_price}
          min="0"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          for="timeline"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Desired Timeline
        </label>
        <input
          type="date"
          id="timeline"
          bind:value={request.timeline}
          placeholder="e.g. By June 15th"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <!-- 时长和状态 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label
          for="length"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Length of Staging (months)
        </label>
        <input
          type="number"
          id="length"
          bind:value={request.length}
          placeholder=""
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {#if isEdit}
        <div>
          <label
            for="status"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            bind:value={request.status}
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {#each statusOptions as status}
              <option value={status.toLowerCase()}>{status}</option>
            {/each}
          </select>
        </div>
      {/if}
    </div>

    <!-- 按钮 -->
    <div class="flex justify-end space-x-3">
      <Button variant="secondary" onclick={handleCancel}>Cancel</Button>
      <Button type="submit">
        {isEdit ? "Update" : "Create"}
      </Button>
    </div>
  </form>
</div>
