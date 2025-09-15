<script>
  // Page metadata
  import { page } from "$app/stores";
  import ServicePage from "$lib/components/common/ServicePage.svelte";

  // Styles for the content
  const contentStyle = "text-gray-800 leading-relaxed space-y-4";
  const priceStyle = "font-bold text-blue-600";
</script>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <ServicePage
    serviceImage='https://images.pexels.com/photos/326514/pexels-photo-326514.jpeg?auto=compress&cs=tinysrgb&w=800'
    callText="Design with taste and professionalism!"
    pageTitle="Logo/Business Card/Website Design Service"
    pageContent="Your brand starts here. As part of our Social Media & Branding services, we offer custom Logo Design, Business Cards, and Realtor Website Design tailored to reflect your unique style and professionalism. Whether you're launching your brand or refreshing your look, we create cohesive, eye-catching designs that make a lasting impression—both online and offline."
  >
  <div class="{contentStyle}">
    <h3 class="text-xl font-medium mb-4">Business card templates</h3>
    <p>1000 Standard business card from <span class="{priceStyle}">$99</span></p>
    <p class="mt-4">Website ready in 24 hours, website templates</p>
    <p>Professional Realtor Website From <span class="{priceStyle}">$69/Month</span></p>
  </div>
  </ServicePage>
</main>