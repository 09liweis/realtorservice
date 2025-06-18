<script lang="ts">
    import Link from "../Link.svelte";

  export let guests:any[] = [];
</script>

<div>
  {#each guests as guest}
  <article>
    {guest.name}
  </article>
  {/each}
</div>