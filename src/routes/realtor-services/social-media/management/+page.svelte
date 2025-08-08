<script>
  // Page metadata
  import { page } from "$app/stores";
  import ServicePage from "$lib/components/common/ServicePage.svelte";
  import SocialMediaServiceForm from "$lib/components/social/SocialMediaServiceForm.svelte";
</script>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <ServicePage
    callText="You are way more popular than you think!"
    pageTitle="Social Media Account Management"
    pageContent="Let us handle your socials—so you can focus on selling. As part of our Social Media & Branding services, our Social Media Account Management takes the stress out of maintaining an online presence. We operate your accounts on your behalf, posting engaging content, responding to interactions, and keeping your brand active and professional across all platforms. Consistency, creativity, and strategy—all done for you."
  />

  <SocialMediaServiceForm />
</main>