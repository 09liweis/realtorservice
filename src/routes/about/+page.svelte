<script>
  import Button from '$lib/components/common/Button.svelte';
  import Link from '$lib/components/Link.svelte';

  // Services data
  const preListingServices = [
    {
      icon: '🎨',
      title: 'Professional Painting',
      description: 'Expert interior and exterior painting to refresh and modernize your property'
    },
    {
      icon: '✨',
      title: 'Deep Cleaning',
      description: 'Comprehensive cleaning services to make your property shine'
    },
    {
      icon: '🏡',
      title: 'Home Staging',
      description: 'Strategic furniture placement and decor to maximize appeal'
    }
  ];

  const mediaServices = [
    {
      icon: '📸',
      title: 'Professional Photography',
      description: 'High-quality photos that showcase your property\'s best features'
    },
    {
      icon: '🎥',
      title: 'Video Tours',
      description: 'Engaging video walkthroughs that bring properties to life'
    },
    {
      icon: '🚁',
      title: 'Drone Footage',
      description: 'Stunning aerial photography and videography'
    },
    {
      icon: '🏠',
      title: '3D Walkthroughs',
      description: 'Immersive virtual tours for remote viewing'
    },
    {
      icon: '📐',
      title: 'Floor Plans',
      description: 'Detailed architectural drawings and layouts'
    }
  ];

  const brandingServices = [
    {
      icon: '🎯',
      title: 'Custom Logo Design',
      description: 'Unique brand identity that sets you apart'
    },
    {
      icon: '💼',
      title: 'Business Cards',
      description: 'Professional print materials that make lasting impressions'
    },
    {
      icon: '🌐',
      title: 'Personalized Websites',
      description: 'Custom websites that showcase your brand and listings'
    },
    {
      icon: '📱',
      title: 'Social Media Management',
      description: 'Ongoing content creation and social media presence management'
    },
    {
      icon: '🎬',
      title: 'Video Production',
      description: 'Professional video shooting and editing for marketing'
    }
  ];

  const stats = [
    { number: '500+', label: 'Properties Enhanced' },
    { number: '200+', label: 'Realtors Served' },
    { number: '95%', label: 'Client Satisfaction' },
    { number: '24/7', label: 'Support Available' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Real Estate Agent',
      company: 'Century 21',
      quote: 'REALTORSERVICE.CA transformed my business. Their staging and photography services helped me sell properties 40% faster than before.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Michael Chen',
      role: 'Broker',
      company: 'RE/MAX',
      quote: 'The social media branding package was a game-changer. My online presence has never looked more professional.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Independent Agent',
      company: 'Self-Employed',
      quote: 'From logo design to website creation, they handled everything. Now I can focus on what I do best - selling real estate.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];
</script>

<svelte:head>
  <title>About Us - REALTORSERVICE.CA</title>
  <meta name="description" content="REALTORSERVICE.CA is your one-stop partner dedicated to empowering real estate professionals with comprehensive listing and branding services." />
</svelte:head>

<div class="min-h-screen bg-white pt-20">
  
  <!-- Hero Section -->
  <section class="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          About <span class="text-blue-600">REALTORSERVICE.CA</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Your one-stop partner dedicated to empowering real estate professionals with everything you need to succeed.
        </p>
        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button onclick={() => window.location.href = 'tel:416-900-0788'} class_name="px-8 py-4 text-lg">
            📞 Call 416-900-0788
          </Button>
          <Button variant="secondary" onclick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} class_name="px-8 py-4 text-lg">
            Explore Services
          </Button>
        </div>
      </div>
    </div>
  </section>

  <!-- Mission Statement -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Our Mission
        </h2>
        <div class="bg-primary rounded-2xl p-8 md:p-12 text-white">
          <p class="text-xl md:text-2xl leading-relaxed">
            We specialize in providing comprehensive listing and branding services, designed to 
            <span class="font-bold">elevate your listings</span> and 
            <span class="font-bold">boost your personal brand</span>. 
            We take care of it all, so you can focus on what you do best: 
            <span class="font-bold">selling real estate</span>.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Statistics -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        {#each stats as stat}
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
              {stat.number}
            </div>
            <div class="text-gray-600 font-medium">
              {stat.label}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section id="services" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our Comprehensive Services
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          From professional staging to digital marketing, we offer comprehensive solutions to maximize your property's potential.
        </p>
      </div>

      <!-- Pre-Listing Services -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Pre-Listing Preparations
          </h3>
          <p class="text-lg text-gray-600">
            Get your properties market-ready with our professional preparation services
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {#each preListingServices as service}
            <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
              <div class="text-4xl mb-4">{service.icon}</div>
              <h4 class="text-xl font-semibold text-gray-900 mb-3">{service.title}</h4>
              <p class="text-gray-600">{service.description}</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Media Production Services -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            High-Impact Media Production
          </h3>
          <p class="text-lg text-gray-600">
            Showcase your properties with stunning visuals that capture attention and drive sales
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each mediaServices as service}
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8 hover:shadow-lg transition-shadow duration-300">
              <div class="text-4xl mb-4">{service.icon}</div>
              <h4 class="text-xl font-semibold text-gray-900 mb-3">{service.title}</h4>
              <p class="text-gray-600">{service.description}</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Branding Services -->
      <div class="mb-20">
        <div class="text-center mb-12">
          <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Full-Service Social Media Branding
          </h3>
          <p class="text-lg text-gray-600">
            Build a powerful personal brand that sets you apart in the competitive real estate market
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each brandingServices as service}
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-8 hover:shadow-lg transition-shadow duration-300">
              <div class="text-4xl mb-4">{service.icon}</div>
              <h4 class="text-xl font-semibold text-gray-900 mb-3">{service.title}</h4>
              <p class="text-gray-600">{service.description}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Why Choose Us -->
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Choose REALTORSERVICE.CA?
          </h2>
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div class="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Complete Service Package</h3>
                <p class="text-gray-600">From professional staging to digital marketing, we handle every aspect of your real estate needs with excellence.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Fast Turnaround</h3>
                <p class="text-gray-600">Quick delivery times ensure your listings get to market faster, maximizing your earning potential.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Expert Team</h3>
                <p class="text-gray-600">Our experienced professionals understand the real estate industry and know what sells properties.</p>
              </div>
            </div>
            
            <div class="flex items-start space-x-4">
              <div class="bg-blue-100 p-3 rounded-full flex-shrink-0">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                <p class="text-gray-600">Round-the-clock availability to address your questions and support your business needs.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="relative">
          <img 
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Professional real estate team" 
            class="rounded-2xl shadow-xl w-full h-auto"
          />
          <div class="absolute -top-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">200+</div>
              <div class="text-sm text-gray-600">Happy Realtors</div>
            </div>
          </div>
          <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">500+</div>
              <div class="text-sm text-gray-600">Properties Enhanced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          What Our Realtors Say
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Don't just take our word for it. Here's what real estate professionals have to say about working with us.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each testimonials as testimonial}
          <div class="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div class="flex items-center mb-4">
              {#each Array(5) as _}
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              {/each}
            </div>
            <p class="text-gray-600 mb-6 italic">
              "{testimonial.quote}"
            </p>
            <div class="flex items-center">
              <img 
                src={testimonial.image}
                alt={testimonial.name}
                class="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <div class="font-semibold text-gray-900">{testimonial.name}</div>
                <div class="text-sm text-gray-600">{testimonial.role}</div>
                <div class="text-sm text-gray-500">{testimonial.company}</div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Our Commitment -->
  <section class="py-20 bg-primary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
        It's All About Serving the Realtors
      </h2>
      <p class="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
        At REALTORSERVICE.CA, we understand that your success is our success. 
        That's why we're committed to providing exceptional service that helps you 
        stand out in a crowded market and take your business to the next level.
      </p>
      <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
        <h3 class="text-2xl font-bold text-white mb-4">Ready to Transform Your Business?</h3>
        <p class="text-blue-100 mb-6">
          See a service you need? Don't wait – let's discuss how we can help you succeed.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onclick={() => window.location.href = 'tel:416-900-0788'} class_name="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold">
            📞 Call 416-900-0788
          </Button>
          <Button variant="secondary" onclick={() => window.location.href = '/register'} class_name="border-white px-8 py-3 text-lg font-semibold">
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Information -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Let's Work Together
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
            <p class="text-gray-600 mb-2">Ready to get started?</p>
            <Link href="tel:416-900-0788" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
              416-900-0788
            </Link>
          </div>
          
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
            <p class="text-gray-600 mb-2">Send us your questions</p>
            <Link href="mailto:support@realtorservice.ca" className="text-blue-600 hover:text-blue-700 font-semibold">
              support@realtorservice.ca
            </Link>
          </div>
          
          <div class="text-center">
            <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Business Hours</h3>
            <p class="text-gray-600 mb-2">Monday - Friday</p>
            <p class="text-blue-600 font-semibold">9:00 AM - 6:00 PM EST</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>