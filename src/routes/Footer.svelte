<script>
  import Link from "$lib/components/Link.svelte";
  import { MENU_ITEMS } from "$lib/types/constant";
  const publicNavigations = MENU_ITEMS;
</script>

<footer class="bg-gray-900 text-white py-16 px-4">
  <div class="max-w-7xl mx-auto space-y-12">
    <!-- Brand and Social Section -->
    <div class="flex flex-col md:flex-row justify-between items-center pb-8 border-b border-gray-800">
      <div class="mb-6 md:mb-0 text-center md:text-left">
        <h3 class="text-2xl font-bold text-white mb-2">Realtor Service</h3>
        <p class="text-gray-400 text-sm">
          Your trusted partner in real estate success.
        </p>
      </div>
      
      <div class="flex space-x-6">
        {#each [
          { icon: 'twitter', href: '#' },
          { icon: 'facebook', href: '#' },
          { icon: 'linkedin', href: '#' }
        ] as social}
          <Link href={social.href} className="text-gray-400 hover:text-white transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {#if social.icon === 'twitter'}
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              {:else if social.icon === 'facebook'}
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
              {:else if social.icon === 'linkedin'}
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              {/if}
            </svg>
          </Link>
        {/each}
      </div>
    </div>

    <!-- Menu Section -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      {#each publicNavigations as nav}
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">{nav.name}</h3>
          <ul class="space-y-3">
            {#if nav.submenu}
              {#each nav.submenu as submenu}
                <li>
                  <Link href={submenu.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {submenu.name}
                  </Link>
                </li>
              {/each}
            {:else}
              <li>
                <Link href={nav.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {nav.name}
                </Link>
              </li>
            {/if}
          </ul>
        </div>
      {/each}
    </div>

    <!-- Copyright -->
    <div class="pt-8 border-t border-gray-800">
      <p class="text-xs text-gray-400 text-center">
        &copy; {new Date().getFullYear()} Realtor Service. All rights reserved.
      </p>
    </div>
  </div>
</footer>