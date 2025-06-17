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

  // Automatically add noopener noreferrer for external links
</script>

<a 
  {href} 
  class="font-medium text-primary hover:text-primary-hover transition-colors duration-200 {className}" 
>
  <slot />
</a>