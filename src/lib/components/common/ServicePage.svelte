<script>
  export let pageTitle;
  export let pageContent;
  export let callText;
</script>

<h1 class="text-3xl font-bold text-gray-900 mb-6">{pageTitle}</h1>

<div class="prose max-w-none">
  <p>
    {pageContent}
  </p>

  <p class="mt-6 font-medium">
    {callText} Just call us at <a
      href="tel:416-800-0688"
      class="text-primary hover:underline">416-800-0688</a
    >
  </p>
</div>
