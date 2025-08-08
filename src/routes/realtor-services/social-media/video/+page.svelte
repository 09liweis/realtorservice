<script>
  // Page metadata
  import { page } from "$app/stores";
  import ServicePage from "$lib/components/common/ServicePage.svelte";
  import VideoServiceForm from "$lib/components/video/VideoServiceForm.svelte";
</script>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <ServicePage
    callText="Action!"
    pageTitle="Video Editing Service"
    pageContent="Turn raw footage into powerful content. As part of our Social Media & Branding services, our Video Editing service helps Realtors create polished, engaging videos that capture attention and build trust. Whether it's listing tours, agent promos, or social media clips, we handle the editing, transitions, graphics, and sound—so your videos look sharp, on-brand, and ready to impress."
  />

  <VideoServiceForm />
</main>