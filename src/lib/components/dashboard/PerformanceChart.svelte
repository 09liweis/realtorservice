<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  
  // Register all Chart.js components
  Chart.register(...registerables);
  
  export let data: Array<{
    month: string;
    listings: number;
    sales: number;
  }>;
  
  export let loading: boolean;
  
  let chart: Chart;
  let chartElement: HTMLCanvasElement;
  
  onMount(() => {
    if (!loading && data) {
      renderChart();
    }
    
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });
  
  function renderChart() {
    if (!chartElement || !data) return;
    
    const ctx = chartElement.getContext('2d');
    if (!ctx) return;
    
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.month),
        datasets: [
          {
            label: 'Listings',
            data: data.map(d => d.listings),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Sales',
            data: data.map(d => d.sales),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#111827',
            bodyColor: '#374151',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#E5E7EB'
            }
          }
        }
      }
    });
  }
  
  $: {
    if (!loading && data && chart) {
      chart.destroy();
      renderChart();
    }
  }
</script>

<div class="relative h-80">
  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="animate-pulse w-full h-full bg-gray-100 rounded-lg"></div>
    </div>
  {:else}
    <canvas
      bind:this={chartElement}
      class="w-full h-full"
    />
  {/if}
</div>