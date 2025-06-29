<script lang="ts">
  // 导入所需的库和组件
  import { fade } from "svelte/transition";
  import {
    StagingCard,
    StagingFilters,
    StagingsList,
    StagingForm,
    StagingDetailsModal,
  } from "$lib/components/stagings";
  import Button from "$lib/components/Button.svelte";
  import FormBackdrop from "$lib/components/form/FormBackdrop.svelte";
  import { EMPTY_STAGING, type Staging } from "$lib/types/staging";
  import { getStagings, upsertStaging, deleteStaging, getAllStagings } from "$lib/supabase";
  import { user } from "$lib/stores/auth";

  // Props
  let user_id: string;

  // 状态变量
  let loading = false;
  let error = null;
  let showForm = false;
  let showDetails = false;
  let currentRequest: Staging;
  let isEditMode = false;
  let filteredRequests: Staging[] = [];

  // 过滤器状态
  let searchQuery = "";
  let statusFilter = "All";
  let typeFilter = "All";
  let sortBy = "newest";

  // 获取数据
  export const fetchStagings = async () => {
    if (!user_id) return;
    loading = true;
    if ($user?.isAdmin) {
      const { data, error: fetchError } = await getAllStagings();
      if (!fetchError) filteredRequests = data;
    } else {
      const { data, error: fetchError } = await getStagings({ user_id });
      if (!fetchError) filteredRequests = data;
    }
    loading = false;
  };

  // 组件挂载时获取数据
  $: {
    user_id = $user?.id;
    fetchStagings();
  }

  // 应用过滤器
  function applyFilters() {}

  // 处理过滤器变化
  function handleFilterChange(event: { detail: { searchQuery: string; statusFilter: string; typeFilter: string; sortBy: string; }; }) {
    searchQuery = event.detail.searchQuery;
    statusFilter = event.detail.statusFilter;
    typeFilter = event.detail.typeFilter;
    sortBy = event.detail.sortBy;
    applyFilters();
  }

  // 查看请求详情
  function viewRequest(request: Staging) {
    currentRequest = request;
    showDetails = true;
  }

  // 编辑请求
  function editRequest(request: Staging) {
    currentRequest = { ...request };
    isEditMode = true;
    showForm = true;
    showDetails = false;
  }

  // 新建请求
  function newRequest() {
    currentRequest = { ...EMPTY_STAGING };
    isEditMode = false;
    showForm = true;
  }

  // 删除请求
  async function deleteRequest(id: string) {
    if (confirm("Are you sure you want to delete this staging request?")) {
      await deleteStaging(id);
      await fetchStagings();
    }
  }

  // 提交表单
  async function handleSubmit(event: any) {
    const formData = event.detail;
    const stagingData = {...formData};
    if (!$user?.isAdmin) {
      stagingData.user_id = user_id;
    }
    await upsertStaging(stagingData);
    showForm = false;
    fetchStagings();
  }

  // 取消表单
  function cancelForm() {
    showForm = false;
  }

  // 关闭详情模态框
  function closeDetails() {
    showDetails = false;
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-900">Staging Requests</h1>
    <Button onclick={newRequest}>
      <svg class="mr-2 -ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
      New Staging Request
    </Button>
  </div>

  <!-- 主内容区域 -->
  {#if showForm}
    <div transition:fade={{ duration: 200 }}>
      <FormBackdrop handleClose={cancelForm}>
        <StagingForm
          isEdit={isEditMode}
          request={currentRequest}
          on:submit={handleSubmit}
          on:cancel={cancelForm}
        />
      </FormBackdrop>
    </div>
  {/if}

  <!-- 过滤器 -->
  <!-- <StagingFilters
    {searchQuery}
    {statusFilter}
    {typeFilter}
    {sortBy}
    on:filter={handleFilterChange}
  /> -->

  <!-- 请求列表 -->
  <StagingsList
    requests={filteredRequests}
    {loading}
    {error}
    on:view={(e) => viewRequest(e.detail)}
    on:edit={(e) => editRequest(e.detail)}
    on:delete={(e) => deleteRequest(e.detail)}
    on:new={newRequest}
  />

  <!-- 详情模态框 -->
  <StagingDetailsModal
    request={currentRequest}
    show={showDetails}
    on:close={closeDetails}
    on:edit={(e) => editRequest(e.detail)}
  />
</div>