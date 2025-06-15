<script>
  import Button from '$lib/components/Button.svelte';
  
  let isLoading = false;
  
  function toggleLoading() {
    isLoading = !isLoading;
    if (isLoading) {
      setTimeout(() => {
        isLoading = false;
      }, 3000);
    }
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Button Component Demo</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Primary Buttons</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg mb-2">Default</h3>
          <Button variant="primary">Primary Button</Button>
        </div>
        
        <div>
          <h3 class="text-lg mb-2">Loading</h3>
          <Button variant="primary" loading={true}>Loading Button</Button>
        </div>
        
        <div>
          <h3 class="text-lg mb-2">Disabled</h3>
          <Button variant="primary" disabled={true}>Disabled Button</Button>
        </div>
      </div>
    </div>
    
    <div class="p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Secondary Buttons</h2>
      
      <div class="space-y-4">
        <div>
          <h3 class="text-lg mb-2">Default</h3>
          <Button variant="secondary">Secondary Button</Button>
        </div>
        
        <div>
          <h3 class="text-lg mb-2">Loading</h3>
          <Button variant="secondary" loading={true}>Loading Button</Button>
        </div>
        
        <div>
          <h3 class="text-lg mb-2">Disabled</h3>
          <Button variant="secondary" disabled={true}>Disabled Button</Button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Interactive Demo</h2>
    
    <div class="space-y-4">
      <Button 
        variant="primary" 
        loading={isLoading} 
        on:click={toggleLoading}
      >
        {isLoading ? 'Loading...' : 'Click to Toggle Loading State'}
      </Button>
      
      <p class="text-sm text-gray-600">
        Click the button above to see the loading state in action. The loading state will automatically reset after 3 seconds.
      </p>
    </div>
  </div>
</div>