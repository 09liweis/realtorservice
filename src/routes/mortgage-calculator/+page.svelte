<script>
    let homePrice = 500000;
    let downPayment = 20;
    let loanAmount = homePrice * (1 - downPayment / 100);
    let interestRate = 5.5;
    let amortizationPeriod = 25;
    let paymentFrequency = 'monthly';
    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalPayment = 0;

    const calculatePayment = () => {
        loanAmount = homePrice * (1 - downPayment / 100);
        const rate = interestRate / 100 / 12;
        const termInMonths = amortizationPeriod * 12;
        
        if (rate === 0) {
            monthlyPayment = loanAmount / termInMonths;
        } else {
            monthlyPayment = loanAmount * 
                (rate * Math.pow(1 + rate, termInMonths)) / 
                (Math.pow(1 + rate, termInMonths) - 1);
        }

        // Adjust for payment frequency
        if (paymentFrequency === 'bi-weekly') {
            monthlyPayment = monthlyPayment * 12 / 26;
        } else if (paymentFrequency === 'weekly') {
            monthlyPayment = monthlyPayment * 12 / 52;
        }

        totalPayment = monthlyPayment * termInMonths;
        totalInterest = totalPayment - loanAmount;
    };
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center mb-6">Canada Mortgage Calculator</h1>
    
    <div class="space-y-4">
        <div>
            <label for="home-price" class="block text-sm font-medium text-gray-700">Home Price ($)</label>
            <input 
                type="number" 
                id="home-price" 
                bind:value={homePrice} 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        
        <div>
            <label for="down-payment" class="block text-sm font-medium text-gray-700">Down Payment (%)</label>
            <input 
                type="number" 
                id="down-payment" 
                bind:value={downPayment} 
                min="0"
                max="100"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        
        <div>
            <label for="interest-rate" class="block text-sm font-medium text-gray-700">Annual Interest Rate (%)</label>
            <input 
                type="number" 
                id="interest-rate" 
                bind:value={interestRate} 
                step="0.01"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        
        <div>
            <label for="amortization-period" class="block text-sm font-medium text-gray-700">Amortization Period (years)</label>
            <input 
                type="number" 
                id="amortization-period" 
                bind:value={amortizationPeriod} 
                min="1"
                max="30"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        
        <div>
            <label for="payment-frequency" class="block text-sm font-medium text-gray-700">Payment Frequency</label>
            <select 
                id="payment-frequency" 
                bind:value={paymentFrequency}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="monthly">Monthly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="weekly">Weekly</option>
            </select>
        </div>
        
        <button 
            on:click={calculatePayment}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Calculate
        </button>
    </div>
    
    <div class="mt-6 space-y-2 text-center">
        <h2 class="text-lg font-medium">Monthly Payment: <span class="font-bold text-indigo-600">${monthlyPayment.toFixed(2)}</span></h2>
        <h2 class="text-lg font-medium">Total Interest: <span class="font-bold text-indigo-600">${totalInterest.toFixed(2)}</span></h2>
        <h2 class="text-lg font-medium">Total Payment: <span class="font-bold text-indigo-600">${totalPayment.toFixed(2)}</span></h2>
    </div>
</div>