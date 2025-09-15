<script>
  // Page metadata
  import { page } from "$app/stores";
  import ServicePage from "../../../../lib/components/common/ServicePage.svelte";

  // Styles for the content
  const contentStyle = "text-gray-800 leading-relaxed";
  const priceStyle = "font-bold text-blue-600";
</script>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <ServicePage
    gallery={
      ['/painting_renovation/1.jpg', '/painting_renovation/2.jpg', '/painting_renovation/3.jpg', '/painting_renovation/4.jpg', '/painting_renovation/5.jpg', '/painting_renovation/6.jpg', '/painting_renovation/7.jpg']
    }
    callText="A job to be done?"
    pageTitle="Professional Painting Service"
    pageContent="First impressions matter—especially in real estate. As part of our all-in-one Listing Service, our Painting & Renovation solutions are designed to refresh and elevate your property’s appeal before it hits the market. Whether it’s a quick touch-up or a full refresh, our team ensures every space looks clean, modern, and move-in ready—helping you attract more buyers and maximize value."
  >
  <div class="{contentStyle}">
    <p>Wall Painting From <span class="{priceStyle}">$1/Square Foot</span></p>
  </div>
  </ServicePage>
</main>