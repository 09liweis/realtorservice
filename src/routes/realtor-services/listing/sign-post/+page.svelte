<script>
  // Page metadata
  import { page } from "$app/stores";
  import ServicePage from "$lib/components/common/ServicePage.svelte";

  // Styles for the content
  const contentStyle = "text-gray-800 leading-relaxed space-y-6";
  const listItemStyle = "flex items-start space-x-3";
  const bulletStyle = "text-blue-600 mt-1 font-bold";
  const noteStyle = "text-sm text-gray-600 italic mt-4";
</script>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <ServicePage
    serviceImage='https://images.pexels.com/photos/8470803/pexels-photo-8470803.jpeg?auto=compress&cs=tinysrgb&w=800'
    callText="For Sale or For Lease?"
    pageTitle="Sign Post Installation"
    pageContent="Make a strong statement from the curb. As part of our complete Listing Service, our Sign Post Installation ensures your property gets noticed from the moment buyers arrive. We provide professional, sturdy, and well-placed signage that highlights your listing and enhances your brand—installed quickly and securely, every time."
  >
    <div class="{contentStyle}">
      <p class="text-lg font-medium">A standard residential installation in GTA is as low as <span class="font-bold text-blue-600">$65 + HST</span>. When a removal of the sign and post is requested from a particular location, our team will remove them at no additional charge. Additional services such as relocation, and repair starts as low as <span class="font-bold text-blue-600">$35</span>. A regular installation includes:</p>

      <ul class="space-y-4 mt-6">
        <li class="{listItemStyle}"><span class="{bulletStyle}">·</span> <span class="font-medium">A Modern White Wood/Vinyl Post</span></li>
        <li class="{listItemStyle}"><span class="{bulletStyle}">·</span> <span class="font-medium">Maximum visibility</span></li>
        <li class="{listItemStyle}"><span class="{bulletStyle}">·</span> <span class="font-medium">Your personalized sign secured to the post</span></li>
        <li class="{listItemStyle}"><span class="{bulletStyle}">·</span> <span class="font-medium">Photo confirmation</span></li>
        <li class="{listItemStyle}"><span class="{bulletStyle}">·</span> <span class="font-medium">Free of charge removal upon request</span></li>
        <li class="{listItemStyle}"><span class="{bulletStyle}">·</span> <span class="font-medium">Secured Sign storage after removal</span></li>
      </ul>

      <p class="mt-6">Additional services such as <span class="font-medium">Coming Soon</span>, <span class="font-medium">Open House</span> or <span class="font-medium">Sold riders</span> available as an add-on item during the booking process.</p>

      <p class="{noteStyle}">Note: All our post rentals include a 90 days period with option to renew (additional fees may apply). We will store the agent signs after post removal upon agent request at no additional charge.</p>
    </div>
</ServicePage>
</main>