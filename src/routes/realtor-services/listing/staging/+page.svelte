<script>
  // Page metadata
  import { page } from "$app/stores";
  import ServicePage from "$lib/components/common/ServicePage.svelte";
    import { StagingForm } from "$lib/components/stagings";
</script>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <ServicePage
    serviceImage='https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    callText="Get ready for showing?"
    pageTitle="Staging Service"
    pageContent="Style sells—and we know how to make every space look its best. As part of our full Listing Service, our Professional Staging Service transforms properties into warm, welcoming, and beautifully designed homes that capture buyers' attention. From furniture and décor to layout and flow, we create spaces that feel inviting and help buyers envision themselves living there."
  />

  <StagingForm />
</main>