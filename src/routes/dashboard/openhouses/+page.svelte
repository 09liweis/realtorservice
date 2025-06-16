<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import FormBackdrop from '$lib/components/form/FormBackdrop.svelte';
  import Input from '$lib/components/Input.svelte';
  import OpenHouseList from '$lib/components/openhouses/OpenHouseList.svelte';
  import { user } from '$lib/stores/auth';  
    import { deleteOpenhouse, getOpenHouses, upsertOpenHouse } from '$lib/supabase';
    import { onMount } from 'svelte';
  	
  onMount(async()=>{
    fetchOHs();
  });

  const fetchOHs = async ()=> {
    if ($user) {
      const {data,error} = await getOpenHouses({user_id: $user?.id});
      if (error) throw error;
      openHouses = data;
    }
  }

  const EMPTY_OH = {
    address: '',
    date: ''
  }

	let openHouses = [];

	// 状态变量
	let showAddForm = false;
	let searchQuery = '';
	let statusFilter = 'All';
	let editingId = null;

	// 新开放看房的表单数据
	let newOpenHouse = EMPTY_OH;

	// 过滤开放看房
	$: filteredOpenHouses = openHouses.filter((house) => {
		const matchesSearch = house.address.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'All' || house.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	// 添加新开放看房
	async function addOpenHouse() {
		await upsertOpenHouse({
      user_id: $user.id,
      ...newOpenHouse
    });
    fetchOHs();
		resetForm();
		showAddForm = false;
	}

	// 开始编辑开放看房
	function startEdit(house) {
		editingId = house.id;
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
	async function handleDeleteOpenHouse(id) {
		await deleteOpenhouse(id);
    fetchOHs();
	}

	// 重置表单
	function resetForm() {
		newOpenHouse = EMPTY_OH;
		editingId = null;
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
				on:submit|preventDefault={editingId ? updateOpenHouse : addOpenHouse}
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
					<button
						type="button"
						on:click={cancelForm}
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						{editingId ? 'Update' : 'Save'}
					</button>
				</div>
			</form>
		</div>
    </FormBackdrop>
	{/if}

	<!-- Open Houses Grid -->
	<OpenHouseList openHouses={filteredOpenHouses} handleEdit={startEdit} handleDelete={handleDeleteOpenHouse} />
</div>