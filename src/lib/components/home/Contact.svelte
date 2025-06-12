<script>
	let formData = $state({
		name: '',
		email: '',
		phone: '',
		service: '',
		message: ''
	});
	
	let isSubmitting = $state(false);
	let submitMessage = $state('');
	
	const services = [
		'Open House Management',
		'Professional Staging',
		'Assignment Listings',
		'Social Media Management',
		'Offer Management',
		'Market Analysis',
		'General Consultation'
	];
	
	async function handleSubmit(event) {
		event.preventDefault();
		isSubmitting = true;
		
		// Simulate form submission
		setTimeout(() => {
			isSubmitting = false;
			submitMessage = 'Thank you for your inquiry! We\'ll get back to you within 24 hours.';
			formData = { name: '', email: '', phone: '', service: '', message: '' };
		}, 1000);
	}
</script>

<section id="contact" class="py-20 bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
				Get Started Today
			</h2>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				Ready to maximize your property's potential? Contact us for a free consultation and discover how our professional services can help you achieve your real estate goals.
			</p>
		</div>
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
			<!-- Contact Form -->
			<div class="bg-white p-8 rounded-2xl shadow-lg">
				<h3 class="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
				
				{#if submitMessage}
					<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
						{submitMessage}
					</div>
				{/if}
				
				<form onsubmit={handleSubmit} class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
								Full Name *
							</label>
							<input
								type="text"
								id="name"
								bind:value={formData.name}
								required
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
								placeholder="Your full name"
							/>
						</div>
						<div>
							<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
								Email Address *
							</label>
							<input
								type="email"
								id="email"
								bind:value={formData.email}
								required
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
								placeholder="your.email@example.com"
							/>
						</div>
					</div>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
								Phone Number
							</label>
							<input
								type="tel"
								id="phone"
								bind:value={formData.phone}
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
								placeholder="(555) 123-4567"
							/>
						</div>
						<div>
							<label for="service" class="block text-sm font-medium text-gray-700 mb-2">
								Service Interested In
							</label>
							<select
								id="service"
								bind:value={formData.service}
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
							>
								<option value="">Select a service</option>
								{#each services as service}
									<option value={service}>{service}</option>
								{/each}
							</select>
						</div>
					</div>
					
					<div>
						<label for="message" class="block text-sm font-medium text-gray-700 mb-2">
							Message *
						</label>
						<textarea
							id="message"
							bind:value={formData.message}
							required
							rows="5"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
							placeholder="Tell us about your property and how we can help..."
						></textarea>
					</div>
					
					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
					>
						{isSubmitting ? 'Sending...' : 'Send Message'}
					</button>
				</form>
			</div>
			
			<!-- Contact Information -->
			<div class="space-y-8">
				<div class="bg-white p-8 rounded-2xl shadow-lg">
					<h3 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
					
					<div class="space-y-6">
						<div class="flex items-start space-x-4">
							<div class="bg-blue-100 p-3 rounded-full flex-shrink-0">
								<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
								</svg>
							</div>
							<div>
								<h4 class="text-lg font-semibold text-gray-900 mb-1">Phone</h4>
								<p class="text-gray-600">(555) 123-4567</p>
								<p class="text-sm text-gray-500">Available 24/7 for urgent matters</p>
							</div>
						</div>
						
						<div class="flex items-start space-x-4">
							<div class="bg-blue-100 p-3 rounded-full flex-shrink-0">
								<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
								</svg>
							</div>
							<div>
								<h4 class="text-lg font-semibold text-gray-900 mb-1">Email</h4>
								<p class="text-gray-600">info@realtorservice.com</p>
								<p class="text-sm text-gray-500">We respond within 2 hours</p>
							</div>
						</div>
						
						<div class="flex items-start space-x-4">
							<div class="bg-blue-100 p-3 rounded-full flex-shrink-0">
								<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
							</div>
							<div>
								<h4 class="text-lg font-semibold text-gray-900 mb-1">Office</h4>
								<p class="text-gray-600">123 Main Street, Suite 100<br>Toronto, ON M5V 3A8</p>
								<p class="text-sm text-gray-500">Mon-Fri 9AM-6PM, Sat 10AM-4PM</p>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Quick Stats -->
				<div class="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl text-white">
					<h3 class="text-2xl font-bold mb-6">Why Choose Us?</h3>
					<div class="space-y-4">
						<div class="flex items-center space-x-3">
							<svg class="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							<span>Free initial consultation</span>
						</div>
						<div class="flex items-center space-x-3">
							<svg class="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							<span>No upfront fees for most services</span>
						</div>
						<div class="flex items-center space-x-3">
							<svg class="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							<span>Guaranteed satisfaction or money back</span>
						</div>
						<div class="flex items-center space-x-3">
							<svg class="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
							</svg>
							<span>Licensed and insured professionals</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>