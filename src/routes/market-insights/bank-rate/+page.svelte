<script>
    import PageContent from '../components/PageContent.svelte';

  export let data;
</script>

<svelte:head>
  <title>Bank of Canada Interest Rates</title>
</svelte:head>

<PageContent title="Bank of Canada Interest Rates" {data} />