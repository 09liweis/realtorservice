<script lang="ts">
  export let type: "button" | "submit" | "reset" = "button";
  export let variant: "primary" | "secondary" = "primary";
  export let loading = false;
  export let disabled = false;
  export let onclick = ()=>{};
  export let class_name = ""; // Additional classes

  const baseClasses = "group relative flex justify-center items-center py-3 px-6 border text-sm font-medium rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0";
  
  const variantClasses = {
    primary: "border-transparent text-white bg-primary hover:bg-[#085c5f] focus:ring-[#0d7377]",
    secondary: "border-[#0d7377] text-[#0d7377] bg-white hover:bg-[#e6f3f3] focus:ring-[#0d7377]"
  };

  $: classes = `${baseClasses} ${variantClasses[variant]} ${class_name}`;
</script>

<button
  {type}
  disabled={disabled || loading}
  class={classes}
  onclick={onclick}
>
  {#if loading}
    <svg 
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        class="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        stroke-width="4"
      />
      <path 
        class="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  {/if}
  <slot />
</button>