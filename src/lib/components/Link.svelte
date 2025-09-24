<script>
  /**
   * Link component that wraps the anchor tag with consistent styling
   * @prop {string} href - The URL to navigate to
   * @prop {string} [className=""] - Additional CSS classes
   * @prop {string} [target="_self"] - Target attribute for the anchor tag
   * @prop {string} [rel=""] - Relationship attribute for the anchor tag
   * @prop {boolean} [external=false] - Whether the link is external (adds rel="noopener noreferrer")
   */
  export let href;
  export let className = "";
  export let hoverClass = "hover:scale-[1.02]";
  export let onclick = () => {};
  export let linkType = '';
  export let target = "";
  export let rel = "";

  // Automatically add noopener noreferrer for external links
</script>

<a 
  {rel}
  {href}
  {target}
  onclick={onclick} 
  class="flex items-center transition-transform duration-300 {linkType === 'btn' ? 'p-4 rounded-md bg-primary text-white' : 'font-medium text-primary'} {className} {hoverClass} "
>
  <slot />
</a>