<script lang="ts">
  import Button from '$lib/components/common/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
    import Add from '$lib/components/icons/Add.svelte';
  import Input from '$lib/components/common/Input.svelte';
  import OpenHouseList from '$lib/components/openhouses/OpenHouseList.svelte';
  import { user } from '$lib/stores/auth';  
  import { deleteOpenhouse, getOpenHouses, upsertOpenHouse } from '$lib/supabase';
  import { getPageTitle } from '$lib/types/constant';
  import type { OpenHouse } from '$lib/types/openhouse';
  import { onMount } from 'svelte';
    import { sendRequest } from '$lib/helper';
  
  let user_id;
  	
  onMount(()=> {
    fetchOHs();
  })

  async function fetchOHs() {
    const {data:{openhouses:data,error}} = await sendRequest({
      url: '/api/openhouses',
      method: 'GET'
    })
    if (!error) openHouses = data;
  }

  const EMPTY_OH:OpenHouse = {
    address: '',
    date: ''
  }

  let openHouses:OpenHouse[] = [];

  // 状态变量
  let showAddForm = false;
  let searchQuery = '';
  let statusFilter = 'All';
  let editingId:string = '';
  
  // 确认删除对话框状态
  let showDeleteConfirm = false;
  let deleteOpenHouseId = '';
  let deleteOpenHouseAddress = '';

  // 新开放看房的表单数据
  let newOpenHouse = EMPTY_OH;

  // 添加新开放看房
  async function addOpenHouse() {
    if (!$user?.isApproved) {
      alert('Your account is not yet approved. Please contact admin to get approval.');
      return;
    }
    const {data:{openhouse, error}} = await sendRequest({
      url: '/api/openhouses',
      body: {
        ...newOpenHouse
      }
    })
    if (!error) {
      fetchOHs();
      resetForm();
      showAddForm = false;
    }
  }

  // 开始编辑开放看房
  function startEdit(house:OpenHouse) {
    editingId = house.id || '';
    newOpenHouse = { ...house };
    showAddForm = true;
  }

  // 更新开放看房
  async function updateOpenHouse() {
    await upsertOpenHouse(newOpenHouse);
    fetchOHs();
    resetForm();
    showAddForm = false;
  }

  // 显示删除确认对话框
  function confirmDelete(id:string, address:string) {
    deleteOpenHouseId = id;
    deleteOpenHouseAddress = address;
    showDeleteConfirm = true;
  }

  // 取消删除
  function cancelDelete() {
    showDeleteConfirm = false;
    deleteOpenHouseId = '';
    deleteOpenHouseAddress = '';
  }

  // 删除开放看房
  async function handleDeleteOpenHouse() {
    if (!deleteOpenHouseId) return;
    
    await deleteOpenhouse(deleteOpenHouseId);
    fetchOHs();
    showDeleteConfirm = false;
    deleteOpenHouseId = '';
    deleteOpenHouseAddress = '';
  }

  // 重置表单
  function resetForm() {
    newOpenHouse = EMPTY_OH;
    editingId = '';
  }

  // 取消表单
  function cancelForm() {
    resetForm();
    showAddForm = false;
  }
</script>

<svelte:head>
  <title>{getPageTitle('Openhouses')}</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Open Houses Management</h1>
		<Button
			onclick={() => {
				if (!$user?.isApproved) {
					alert('Your account is not yet approved. Please contact admin to get approval.');
					return;
				}
				showAddForm = true;
				resetForm();
			}}
			disabled={!$user?.isApproved}
		>
      <Add />
			Add Open House
		</Button>
	</div>

	<!-- Add/Edit Form -->
	{#if showAddForm}
    <FormBackdrop handleClose={cancelForm}>
		<div class="p-6 bg-white rounded-lg shadow">
      <h2 class="mb-4 text-lg font-medium text-gray-900">
        {editingId ? 'Edit Open House' : 'Add New Open House'}
      </h2>
      <form
        onsubmit={editingId ? updateOpenHouse : addOpenHouse}
        class="space-y-4"
      >
        
        <Input
          id="address"
          bind:value={newOpenHouse.address}
          placeholder="Address"
          label="Address"
          type="text"
        />

        <Input
          id="date"
          bind:value={newOpenHouse.date}
          placeholder="Date"
          label="Date"
          type="date"
        />
        
        
        <div class="flex justify-end space-x-3">
          <Button
            variant="secondary"
            type="button"
            onclick={cancelForm}
          >
            Cancel
          </Button>
          <Button
            type="submit"
          >
            {editingId ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
		</div>
    </FormBackdrop>
	{/if}

	<!-- 删除确认对话框 -->
	{#if showDeleteConfirm}
		<FormBackdrop handleClose={cancelDelete}>
			<div class="p-6 bg-white rounded-lg shadow mx-auto">
				<h2 class="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h2>
				<p class="text-gray-600 mb-6">
					Are you sure you want to delete the open house at <span class="font-medium">{deleteOpenHouseAddress}</span>? This action cannot be undone.
				</p>
				<div class="flex justify-end space-x-3">
					<Button
						variant="secondary"
						type="button"
						onclick={cancelDelete}
					>
						Cancel
					</Button>
					<Button
						variant="danger"
						type="button"
						onclick={handleDeleteOpenHouse}
					>
						Delete
					</Button>
				</div>
			</div>
		</FormBackdrop>
	{/if}

	<!-- Open Houses Grid -->
	<OpenHouseList 
		openHouses={openHouses} 
		handleEdit={startEdit} 
		handleDelete={(id, address) => confirmDelete(id, address)} 
	/>
</div>