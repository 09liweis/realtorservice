<script lang="ts">
  // 导入所需的库和组件
  import { fade } from "svelte/transition";
  import {
    StagingsList,
    StagingForm,
  } from "$lib/components/stagings";
  import Button from "$lib/components/common/Button.svelte";
  import { EMPTY_STAGING, type Staging } from "$lib/types/staging";
  import { getStagings, upsertStaging, deleteStaging, getAllStagings } from "$lib/supabase";
  import { user } from "$lib/stores/auth";
  import Add from "../icons/Add.svelte";
  import { sendEmailRequest } from "$lib/http";
    import { sendRequest } from "$lib/helper";
    import { onMount } from "svelte";

  // Props
  let user_id: string|undefined;

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

  onMount(()=> {
    fetchStagings();
  })

  // 获取数据
  export const fetchStagings = async () => {
    loading = true;
    const {data:{stagings, error},response} = await sendRequest({
      url:'/api/stagings',
      method: 'GET'
    });
    if (error) {
      throw error;
    }
    filteredRequests = stagings;
    loading = false;
  };

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

  // 编辑请求
  function editRequest(request: Staging) {
    currentRequest = { ...request };
    isEditMode = true;
    showForm = true;
    showDetails = false;
  }

  // 新建请求
  function newRequest() {
    if (!$user?.isApproved) {
      alert('Your account is not yet approved. Please contact admin to get approval.');
      return;
    }
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
    if (!$user?.isApproved) {
      alert('Your account is not yet approved. Please contact admin to get approval.');
      return;
    }
    const formData = event.detail;
    const stagingData = {...formData,is_user_unread:false};
    if (!$user?.isAdmin) {
      stagingData.user_id = user_id;
    }
    const {data,error} = await upsertStaging(stagingData);
    try {
      await sendEmailRequest({
        email: $user?.email,
        projectName: stagingData.location,
        projectUrl: `/dashboard/stagings/${data?.id}`,
        type: 'submission'
      });
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }
    
    showForm = false;
    fetchStagings();
  }

  // 取消表单
  function cancelForm() {
    showForm = false;
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-900">Staging Requests</h1>
    {#if !$user?.isAdmin}
    <Button 
      onclick={newRequest}
      disabled={!$user?.isApproved}
    >
      <Add />
      New Staging Request
    </Button>
    {/if}
  </div>

  <!-- 主内容区域 -->
  {#if showForm}
    <div transition:fade={{ duration: 200 }}>
      <StagingForm
        isEdit={isEditMode}
        request={currentRequest}
        on:submit={handleSubmit}
        on:cancel={cancelForm}
      />
    </div>
  {:else}
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
      on:edit={(e) => editRequest(e.detail)}
      on:delete={(e) => deleteRequest(e.detail)}
      on:new={newRequest}
    />
  {/if}
</div>