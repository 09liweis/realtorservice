<script lang="ts">
  import { getPageTitle } from '$lib/types/constant';
  import Input from '$lib/components/common/Input.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  // Calculator inputs
  let calculatorMode = 'monthly-payment'; // 'monthly-payment' or 'home-price'
  let homePrice = 500000;
  let downPayment = 100000;
  let interestRate = 5.5;
  let loanTerm = 25;
  let propertyTax = 3000;
  let homeInsurance = 1200;
  let pmiRate = 0.5;
  
  // Reverse calculator inputs
  let targetMonthlyPayment = 2500;
  let reverseDownPayment = 100000;
  let reverseInterestRate = 5.5;
  let reverseLoanTerm = 25;

  // Calculated values
  let monthlyPayment = 0;
  let totalInterest = 0;
  let totalPayment = 0;
  let loanAmount = 0;
  let downPaymentPercent = 0;
  let monthlyTaxInsurance = 0;
  let totalMonthlyPayment = 0;
  
  // Reverse calculated values
  let affordableHomePrice = 0;
  let reverseLoanAmount = 0;
  let reverseDownPaymentPercent = 0;

  // Chart data for amortization
  let chartData: Array<{year: number, principal: number, interest: number, balance: number}> = [];

  // Reactive calculations
  $: {
    if (calculatorMode === 'home-price') {
      calculateAffordableHomePrice();
    } else {
      calculateMortgage();
    }
  }

  function calculateMortgage() {
    // Basic validations
    if (homePrice <= 0 || downPayment < 0 || interestRate <= 0 || loanTerm <= 0 || homePrice > 10000000 || downPayment > homePrice || interestRate > 20 || loanTerm > 35) {
      return;
    }

    loanAmount = homePrice - downPayment;
    downPaymentPercent = (downPayment / homePrice) * 100;
    
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment using mortgage formula
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numberOfPayments;
    }
    
    totalPayment = monthlyPayment * numberOfPayments;
    totalInterest = totalPayment - loanAmount;
    
    // Monthly tax and insurance
    monthlyTaxInsurance = (propertyTax + homeInsurance) / 12;
    
    // PMI calculation (if down payment is less than 20%)
    let monthlyPMI = 0;
    if (downPaymentPercent < 20 && pmiRate > 0) {
      monthlyPMI = (loanAmount * pmiRate / 100) / 12;
    }
    
    totalMonthlyPayment = monthlyPayment + monthlyTaxInsurance + monthlyPMI;
    
    // Generate amortization data for chart (yearly summary)
    generateAmortizationData();
  }

  function calculateAffordableHomePrice() {
    // Basic validations
    if (targetMonthlyPayment <= 0 || reverseDownPayment < 0 || reverseInterestRate <= 0 || reverseLoanTerm <= 0) {
      return;
    }

    // Monthly interest rate
    const monthlyRate = reverseInterestRate / 100 / 12;
    const numberOfPayments = reverseLoanTerm * 12;
    
    // Calculate loan amount from monthly payment using reverse mortgage formula
    let maxLoanAmount = 0;
    if (monthlyRate > 0) {
      maxLoanAmount = targetMonthlyPayment * (Math.pow(1 + monthlyRate, numberOfPayments) - 1) / 
                     (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    } else {
      maxLoanAmount = targetMonthlyPayment * numberOfPayments;
    }
    
    reverseLoanAmount = maxLoanAmount;
    affordableHomePrice = maxLoanAmount + reverseDownPayment;
    reverseDownPaymentPercent = (reverseDownPayment / affordableHomePrice) * 100;
    
    // Update the main calculator values for consistency
    homePrice = affordableHomePrice;
    downPayment = reverseDownPayment;
    interestRate = reverseInterestRate;
    loanTerm = reverseLoanTerm;
    
    // Calculate the actual monthly payment for verification
    calculateMortgage();
  }

  function generateAmortizationData() {
    chartData = [];
    let balance = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    
    for (let year = 1; year <= Math.min(loanTerm, 35); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        if (balance <= 0) break;
        
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
      }
      
      chartData.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: Math.max(0, balance)
      });
      
      if (balance <= 0) break;
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatPercent(percent: number): string {
    return `${percent.toFixed(1)}%`;
  }

  // Preset scenarios
  const presets = [
    { name: 'First-time Buyer', homePrice: 400000, downPayment: 20000, interestRate: 5.8, loanTerm: 25 },
    { name: 'Average Home', homePrice: 650000, downPayment: 130000, interestRate: 5.5, loanTerm: 25 },
    { name: 'Luxury Home', homePrice: 1200000, downPayment: 300000, interestRate: 5.2, loanTerm: 30 }
  ];

  // Reverse calculator presets
  const reversePresets = [
    { name: 'Budget Buyer', monthlyPayment: 1800, downPayment: 50000, interestRate: 5.8, loanTerm: 25 },
    { name: 'Average Budget', monthlyPayment: 2500, downPayment: 100000, interestRate: 5.5, loanTerm: 25 },
    { name: 'Higher Budget', monthlyPayment: 4000, downPayment: 200000, interestRate: 5.2, loanTerm: 30 }
  ];

  function applyPreset(preset: typeof presets[0]) {
    homePrice = preset.homePrice;
    downPayment = preset.downPayment;
    interestRate = preset.interestRate;
    loanTerm = preset.loanTerm;
    calculateMortgage();
  }

  function applyReversePreset(preset: typeof reversePresets[0]) {
    targetMonthlyPayment = preset.monthlyPayment;
    reverseDownPayment = preset.downPayment;
    reverseInterestRate = preset.interestRate;
    reverseLoanTerm = preset.loanTerm;
    calculatorMode = 'home-price';
    calculateAffordableHomePrice();
  }

  onMount(() => {
    calculateMortgage();
  });
</script>

<svelte:head>
  <title>{getPageTitle('Mortgage Calculator')}</title>
  <meta name="description" content="Calculate your mortgage payments with our easy-to-use mortgage calculator. Get instant estimates for monthly payments, total interest, and amortization schedules." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center" in:fade={{ duration: 800, delay: 200 }}>
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        Mortgage Calculator
      </h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        Calculate your monthly mortgage payments or discover what home price you can afford with our comprehensive mortgage tools.
      </p>
    </div>
  </div>
</section>

<!-- Main Calculator Section -->
<section class="py-16 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      
      <!-- Calculator Inputs -->
      <div class="lg:col-span-1" in:fly={{ x: -50, duration: 600, delay: 400 }}>
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
          <!-- Calculator Mode Toggle -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-3">Calculator Mode</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                on:click={() => calculatorMode = 'monthly-payment'}
                class="p-3 text-sm font-medium rounded-lg transition-all duration-200 {calculatorMode === 'monthly-payment' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
              >
                Monthly Payment
              </button>
              <button
                on:click={() => calculatorMode = 'home-price'}
                class="p-3 text-sm font-medium rounded-lg transition-all duration-200 {calculatorMode === 'home-price' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
              >
                Home Price
              </button>
            </div>
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {calculatorMode === 'monthly-payment' ? 'Calculate Monthly Payment' : 'Calculate Affordable Home Price'}
          </h2>
          
          {#if calculatorMode === 'monthly-payment'}
            <!-- Original Calculator - Preset Scenarios -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Quick Scenarios</label>
              <div class="grid grid-cols-1 gap-2">
                {#each presets as preset}
                  <button
                    on:click={() => applyPreset(preset)}
                    class="text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm cursor-pointer"
                  >
                    <div class="font-medium text-gray-900">{preset.name}</div>
                    <div class="text-gray-600">{formatCurrency(preset.homePrice)} • {formatPercent((preset.downPayment/preset.homePrice)*100)} down</div>
                  </button>
                {/each}
              </div>
            </div>

            <div class="space-y-6">
              <Input
                on:input={calculateMortgage}
                id="homePrice"
                label="Home Price"
                type="number"
                bind:value={homePrice}
                min={1}
                step={1000}
                placeholder="500000"
              />

              <Input
                on:input={calculateMortgage}
                id="downPayment"
                label="Down Payment"
                type="number"
                bind:value={downPayment}
                min={0}
                step={1000}
                placeholder="100000"
              />

              <Input
                on:input={calculateMortgage}
                id="interestRate"
                label="Interest Rate (%)"
                type="number"
                bind:value={interestRate}
                min={0.1}
                step={0.1}
                placeholder="5.5"
              />

              <Input
                on:input={calculateMortgage}
                id="loanTerm"
                label="Loan Term (years)"
                type="number"
                bind:value={loanTerm}
                min={1}
                max={35}
                step={1}
                placeholder="25"
              />
            </div>
          {:else}
            <!-- Reverse Calculator - Preset Scenarios -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">Budget Scenarios</label>
              <div class="grid grid-cols-1 gap-2">
                {#each reversePresets as preset}
                  <button
                    on:click={() => applyReversePreset(preset)}
                    class="text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm cursor-pointer"
                  >
                    <div class="font-medium text-gray-900">{preset.name}</div>
                    <div class="text-gray-600">{formatCurrency(preset.monthlyPayment)}/mo • {formatCurrency(preset.downPayment)} down</div>
                  </button>
                {/each}
              </div>
            </div>

            <div class="space-y-6">
              <Input
                on:input={calculateAffordableHomePrice}
                id="targetMonthlyPayment"
                label="Target Monthly Payment"
                type="number"
                bind:value={targetMonthlyPayment}
                min={1}
                step={50}
                placeholder="2500"
              />

              <Input
                on:input={calculateAffordableHomePrice}
                id="reverseDownPayment"
                label="Available Down Payment"
                type="number"
                bind:value={reverseDownPayment}
                min={0}
                step={1000}
                placeholder="100000"
              />

              <Input
                on:input={calculateAffordableHomePrice}
                id="reverseInterestRate"
                label="Interest Rate (%)"
                type="number"
                bind:value={reverseInterestRate}
                min={0.1}
                step={0.1}
                placeholder="5.5"
              />

              <Input
                on:input={calculateAffordableHomePrice}
                id="reverseLoanTerm"
                label="Loan Term (years)"
                type="number"
                bind:value={reverseLoanTerm}
                min={1}
                max={35}
                step={1}
                placeholder="25"
              />
            </div>
          {/if}

          <!-- Additional Costs (shown for both modes) -->
          <div class="mb-6">
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Additional Costs</h3>
              
              <div class="space-y-4">
                <Input
                  on:input={() => calculatorMode === 'monthly-payment' ? calculateMortgage() : calculateAffordableHomePrice()}
                  id="propertyTax"
                  label="Annual Property Tax"
                  type="number"
                  bind:value={propertyTax}
                  min={0}
                  step={100}
                  placeholder="3000"
                />

                <Input
                  on:input={() => calculatorMode === 'monthly-payment' ? calculateMortgage() : calculateAffordableHomePrice()}
                  id="homeInsurance"
                  label="Annual Home Insurance"
                  type="number"
                  bind:value={homeInsurance}
                  min={0}
                  step={100}
                  placeholder="1200"
                />

                {#if (calculatorMode === 'monthly-payment' ? downPaymentPercent : reverseDownPaymentPercent) < 20}
                  <Input
                    on:input={() => calculatorMode === 'monthly-payment' ? calculateMortgage() : calculateAffordableHomePrice()}
                    id="pmiRate"
                    label="PMI Rate (% annually)"
                    type="number"
                    bind:value={pmiRate}
                    min={0}
                    step={0.1}
                    placeholder="0.5"
                  />
                {/if}
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Results -->
      <div class="lg:col-span-2" in:fly={{ x: 50, duration: 600, delay: 600 }}>
        <div class="space-y-8">
          
          <!-- Payment Summary -->
          <div class="bg-primary rounded-2xl p-8 text-white">
            <h2 class="text-2xl font-bold mb-6">
              {calculatorMode === 'monthly-payment' ? 'Payment Summary' : 'Affordability Summary'}
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="rounded-xl p-6">
                <div class="text-3xl font-bold mb-2">
                  {calculatorMode === 'monthly-payment' ? formatCurrency(homePrice) : formatCurrency(affordableHomePrice)}
                </div>
                <div class="text-blue-100">
                  {calculatorMode === 'monthly-payment' ? 'Home Price' : 'Max Home Price'}
                </div>
              </div>
              
              <div class="rounded-xl p-6">
                <div class="text-3xl font-bold mb-2">{formatCurrency(totalMonthlyPayment)}</div>
                <div class="text-blue-100">
                  {calculatorMode === 'monthly-payment' ? 'Total Monthly' : 'Required Monthly'}
                </div>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div class="text-blue-100">Property Tax</div>
                <div class="font-semibold">{formatCurrency(propertyTax/12)}/mo</div>
              </div>
              <div>
                <div class="text-blue-100">Insurance</div>
                <div class="font-semibold">{formatCurrency(homeInsurance/12)}/mo</div>
              </div>
              <div>
                <div class="text-blue-100">Down Payment</div>
                <div class="font-semibold">
                  {formatPercent(calculatorMode === 'monthly-payment' ? downPaymentPercent : reverseDownPaymentPercent)}
                </div>
              </div>
              <div>
                <div class="text-blue-100">Loan Amount</div>
                <div class="font-semibold">
                  {formatCurrency(calculatorMode === 'monthly-payment' ? loanAmount : reverseLoanAmount)}
                </div>
              </div>
            </div>
          </div>

          <!-- Loan Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(totalPayment)}</div>
              <div class="text-sm text-gray-600">Total Payments</div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(totalInterest)}</div>
              <div class="text-sm text-gray-600">Total Interest</div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="text-2xl font-bold text-gray-900 mb-1">
                {calculatorMode === 'monthly-payment' ? loanTerm : reverseLoanTerm}
              </div>
              <div class="text-sm text-gray-600">Years</div>
            </div>
          </div>

          {#if calculatorMode === 'home-price'}
            <!-- Affordability Insights -->
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
              <h3 class="text-xl font-bold text-gray-900 mb-6">💡 Affordability Insights</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg p-4 border border-green-200">
                  <h4 class="font-medium text-gray-900 mb-2">Budget Breakdown</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Target Payment:</span>
                      <span class="font-medium">{formatCurrency(targetMonthlyPayment)}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Actual Payment:</span>
                      <span class="font-medium">{formatCurrency(monthlyPayment)}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Difference:</span>
                      <span class="font-medium {targetMonthlyPayment - monthlyPayment >= 0 ? 'text-green-600' : 'text-red-600'}">
                        {formatCurrency(Math.abs(targetMonthlyPayment - monthlyPayment))}
                        {targetMonthlyPayment - monthlyPayment >= 0 ? 'under budget' : 'over budget'}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-lg p-4 border border-green-200">
                  <h4 class="font-medium text-gray-900 mb-2">Recommendations</h4>
                  <div class="text-sm text-gray-600 space-y-1">
                    {#if reverseDownPaymentPercent < 20}
                      <p>• Consider increasing down payment to avoid PMI</p>
                    {/if}
                    {#if targetMonthlyPayment - monthlyPayment > 100}
                      <p>• You have room to increase your budget</p>
                    {:else if monthlyPayment - targetMonthlyPayment > 100}
                      <p>• Consider a lower price range or longer term</p>
                    {/if}
                    <p>• Factor in maintenance and utilities</p>
                  </div>
                </div>
              </div>
            </div>
          {/if}

          <!-- Amortization Chart -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Payment Breakdown Over Time</h3>
            
            {#if chartData.length > 0}
              <div class="space-y-4">
                <!-- Chart Legend -->
                <div class="flex items-center justify-center space-x-6 text-sm">
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-blue-500 rounded"></div>
                    <span class="text-gray-600">Principal</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-4 h-4 bg-red-500 rounded"></div>
                    <span class="text-gray-600">Interest</span>
                  </div>
                </div>

                <!-- Simple Bar Chart -->
                <div class="space-y-2 max-h-96 overflow-y-auto">
                  {#each chartData.slice(0, 15) as yearData, index}
                    <div class="flex items-center space-x-4 py-2">
                      <div class="w-12 text-sm font-medium text-gray-600">Year {yearData.year}</div>
                      <div class="flex-1 flex bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div 
                          class="bg-blue-500 transition-all duration-1000 ease-out"
                          style="width: {(yearData.principal / (yearData.principal + yearData.interest)) * 100}%"
                          title="Principal: {formatCurrency(yearData.principal)}"
                        ></div>
                        <div 
                          class="bg-red-500 transition-all duration-1000 ease-out"
                          style="width: {(yearData.interest / (yearData.principal + yearData.interest)) * 100}%"
                          title="Interest: {formatCurrency(yearData.interest)}"
                        ></div>
                      </div>
                      <div class="w-24 text-sm text-gray-600 text-right">
                        {formatCurrency(yearData.balance)}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>

          <!-- Tips and Information -->
          <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">💡 Mortgage Tips</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {#if calculatorMode === 'home-price'}
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Budget Planning</h4>
                  <p class="text-gray-700">Remember to factor in closing costs, moving expenses, and emergency funds when determining your home budget.</p>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2">Monthly Budget</h4>
                  <p class="text-gray-700">Your housing costs should typically not exceed 28-32% of your gross monthly income for optimal financial health.</p>
                </div>
              {:else}
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Down Payment</h4>
                <p class="text-gray-700">A larger down payment reduces your monthly payments and may eliminate PMI requirements (typically 20% or more).</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Interest Rates</h4>
                <p class="text-gray-700">Even a small difference in interest rates can significantly impact your total payment over the life of the loan.</p>
              </div>
              {/if}
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Loan Term</h4>
                <p class="text-gray-700">Shorter terms mean higher monthly payments but less total interest paid over the life of the loan.</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Additional Costs</h4>
                <p class="text-gray-700">Don't forget property taxes, insurance, maintenance, and potential HOA fees when budgeting.</p>
              </div>
            </div>
          </div>

          <!-- Call to Action -->
          <div class="bg-primary rounded-2xl p-8 text-white text-center">
            <h3 class="text-2xl font-bold mb-4">
              {calculatorMode === 'monthly-payment' ? 'Ready to Get Pre-Approved?' : 'Found Your Budget? Start Shopping!'}
            </h3>
            <p class="text-blue-100 mb-6">
              {calculatorMode === 'monthly-payment' 
                ? 'Connect with our trusted mortgage professionals to get pre-approved and start your home buying journey.'
                : 'Now that you know your budget, explore our listings to find your perfect home.'}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                {calculatorMode === 'monthly-payment' ? 'Get Pre-Approved' : 'Get Started'}
              </a>
              <a
                href="/listings"
                class="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                {calculatorMode === 'monthly-payment' ? 'Browse Listings' : 'Find Your Home'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>