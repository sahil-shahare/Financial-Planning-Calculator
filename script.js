// Global variables for Chart.js instances
let sipChartInstance = null;
let swpChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  // SIP Calculator Logic
  const calculateSipBtn = document.getElementById("calculateSip");
  const sipMonthlyInvestmentInput = document.getElementById(
    "sipMonthlyInvestment"
  );
  const sipExpectedReturnsInput = document.getElementById("sipExpectedReturns");
  const sipDurationInput = document.getElementById("sipDuration");
  const sipTotalInvestmentEl = document.getElementById("sipTotalInvestment");
  const sipTotalValueEl = document.getElementById("sipTotalValue");
  const sipResultsEl = document.getElementById("sipResults");
  const sipChartContainerEl = document.getElementById("sipChartContainer");
  const sipChartCanvas = document.getElementById("sipChart");

  // SWP Calculator Logic
  const calculateSwpBtn = document.getElementById("calculateSwp");
  const swpCorpusInput = document.getElementById("swpCorpus");
  const swpWithdrawalInput = document.getElementById("swpWithdrawal");
  const swpReturnsInput = document.getElementById("swpReturns");
  const swpDurationInput = document.getElementById("swpDuration");
  const swpTotalWithdrawalsEl = document.getElementById("swpTotalWithdrawals");
  const swpRemainingCorpusEl = document.getElementById("swpRemainingCorpus");
  const swpResultsEl = document.getElementById("swpResults");
  const swpChartContainerEl = document.getElementById("swpChartContainer");
  const swpChartCanvas = document.getElementById("swpChart");

  function formatCurrency(value) {
    return `₹${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;
  }

  // SIP Calculation Function
  calculateSipBtn.addEventListener("click", () => {
    const investment = parseFloat(sipMonthlyInvestmentInput.value);
    const annualRate = parseFloat(sipExpectedReturnsInput.value);
    const duration = parseInt(sipDurationInput.value);

    if (
      isNaN(investment) ||
      isNaN(annualRate) ||
      isNaN(duration) ||
      investment <= 0 ||
      annualRate < 0 ||
      duration <= 0
    ) {
      alert("Please enter valid positive numbers for all SIP fields.");
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const months = duration * 12;

    let totalValue = 0;
    const investmentData = [];
    const valueData = [];
    const labels = [];

    for (let i = 1; i <= months; i++) {
      totalValue = (totalValue + investment) * (1 + monthlyRate);
      if (i % 12 === 0) {
        labels.push(`Year ${i / 12}`);
        investmentData.push(investment * i);
        valueData.push(totalValue);
      }
    }

    const totalInvestment = investment * months;

    sipTotalInvestmentEl.textContent = formatCurrency(totalInvestment);
    sipTotalValueEl.textContent = formatCurrency(totalValue);
    sipResultsEl.classList.remove("hidden");
    sipChartContainerEl.classList.remove("hidden");

    // Destroy previous chart instance if it exists
    if (sipChartInstance) {
      sipChartInstance.destroy();
    }

    // Draw the SIP chart
    sipChartInstance = new Chart(sipChartCanvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Investment",
            data: investmentData,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.3,
          },
          {
            label: "Total Value",
            data: valueData,
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return `₹${value.toLocaleString()}`;
              },
            },
          },
        },
      },
    });
  });

  // SWP Calculation Function
  calculateSwpBtn.addEventListener("click", () => {
    let corpus = parseFloat(swpCorpusInput.value);
    const withdrawal = parseFloat(swpWithdrawalInput.value);
    const annualRate = parseFloat(swpReturnsInput.value);
    const duration = parseInt(swpDurationInput.value);

    if (
      isNaN(corpus) ||
      isNaN(withdrawal) ||
      isNaN(annualRate) ||
      isNaN(duration) ||
      corpus <= 0 ||
      withdrawal <= 0 ||
      annualRate < 0 ||
      duration <= 0
    ) {
      alert("Please enter valid positive numbers for all SWP fields.");
      return;
    }

    const monthlyRate = annualRate / 100 / 12;
    const months = duration * 12;

    let totalWithdrawals = 0;
    const corpusData = [corpus];
    const labels = ["Start"];

    for (let i = 1; i <= months; i++) {
      if (corpus <= 0) {
        corpus = 0;
        break; // Corpus is depleted
      }

      const interest = corpus * monthlyRate;
      corpus += interest;

      if (corpus >= withdrawal) {
        corpus -= withdrawal;
        totalWithdrawals += withdrawal;
      } else {
        totalWithdrawals += corpus;
        corpus = 0;
      }

      if (i % 12 === 0) {
        labels.push(`Year ${i / 12}`);
        corpusData.push(corpus);
      }
    }

    swpTotalWithdrawalsEl.textContent = formatCurrency(totalWithdrawals);
    swpRemainingCorpusEl.textContent = formatCurrency(corpus);
    swpResultsEl.classList.remove("hidden");
    swpChartContainerEl.classList.remove("hidden");

    // Destroy previous chart instance if it exists
    if (swpChartInstance) {
      swpChartInstance.destroy();
    }

    // Draw the SWP chart
    swpChartInstance = new Chart(swpChartCanvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Remaining Corpus",
            data: corpusData,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return `₹${value.toLocaleString()}`;
              },
            },
          },
        },
      },
    });
  });
});
