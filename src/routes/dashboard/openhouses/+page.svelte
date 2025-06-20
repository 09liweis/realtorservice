<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import Input from '$lib/components/Input.svelte';
  import OpenHouseList from '$lib/components/openhouses/OpenHouseList.svelte';
  import { user } from '$lib/stores/auth';  
    import { deleteOpenhouse, getOpenHouses, upsertOpenHouse } from '$lib/supabase';
    import type { OpenHouse } from '$lib/types/openhouse';
    import { onMount } from 'svelte';
  
  let user_id;
  	
  $: {
    user_id = $user?.id;
    fetchOHs();
  }

  async function fetchOHs() {
    if (!user_id) return;
    const {data,error} = await getOpenHouses({user_id});
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

	// 新开放看房的表单数据
	let newOpenHouse = EMPTY_OH;

	// 添加新开放看房
	async function addOpenHouse() {
		await upsertOpenHouse({
      user_id,
      ...newOpenHouse
    });
    fetchOHs();
		resetForm();
		showAddForm = false;
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

	// 删除开放看房
	async function handleDeleteOpenHouse(id:string) {
		await deleteOpenhouse(id);
    fetchOHs();
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

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-semibold text-gray-900">Open Houses Management</h1>
		<Button
			onclick={() => {
				showAddForm = true;
				resetForm();
			}}
		>
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

	<!-- Open Houses Grid -->
	<OpenHouseList openHouses={openHouses} handleEdit={startEdit} handleDelete={handleDeleteOpenHouse} />
</div>