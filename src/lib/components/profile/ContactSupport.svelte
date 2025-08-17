<script>
    import { CONTACT_EMAIL } from "$lib/types/constant";

</script>
<div
  class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6"
>
  <div class="text-center">
    <div
      class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
    >
      <svg
        class="w-6 h-6 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
        ></path>
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
    <p class="text-sm text-gray-600 mb-4">
      Contact our support team for assistance with your account or platform
      features.
    </p>
    <a
      href="mailto:{CONTACT_EMAIL}"
      class="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        ></path>
      </svg>
      Contact Support
    </a>
  </div>
</div>
