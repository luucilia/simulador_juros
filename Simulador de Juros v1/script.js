const form = document.querySelector("#simulator-form");
const resultsSection = document.querySelector("#results");
const resultsBody = document.querySelector("#results-body");
const errorMessage = document.querySelector("#form-error");
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function roundToCents(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getMonthlyRate(rate, ratePeriod) {
  const decimalRate = rate / 100;

  if (ratePeriod === "yearly") {
    return Math.pow(1 + decimalRate, 1 / 12) - 1;
  }

  return decimalRate;
}

function calculateProjection(initialAmount, monthlyRate, contribution, months) {
  let balance = roundToCents(initialAmount);
  let totalInvested = balance;
  let accumulatedInterest = 0;
  const monthlyResults = [];

  for (let month = 1; month <= months; month += 1) {
    const monthlyInterest = roundToCents(balance * monthlyRate);
    balance = roundToCents(balance + monthlyInterest);
    accumulatedInterest = roundToCents(accumulatedInterest + monthlyInterest);

    balance = roundToCents(balance + contribution);
    totalInvested = roundToCents(totalInvested + contribution);

    if (!Number.isFinite(balance) || !Number.isFinite(totalInvested)) {
      throw new Error("Os valores informados produziram um resultado fora do limite de cálculo.");
    }

    monthlyResults.push({
      month,
      monthlyInterest,
      totalInvested,
      accumulatedInterest,
      balance
    });
  }

  return {
    monthlyResults,
    totalInvested,
    finalAmount: balance,
    totalInterest: roundToCents(balance - totalInvested)
  };
}

function renderResults(projection, months, duration, durationUnit) {
  const fragment = document.createDocumentFragment();

  projection.monthlyResults.forEach((result) => {
    const row = document.createElement("tr");
    const values = [
      `Mês ${result.month}`,
      formatCurrency(result.monthlyInterest),
      formatCurrency(result.totalInvested),
      formatCurrency(result.accumulatedInterest),
      formatCurrency(result.balance)
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    fragment.append(row);
  });

  resultsBody.replaceChildren(fragment);
  document.querySelector("#total-interest").textContent = formatCurrency(projection.totalInterest);
  document.querySelector("#total-invested").textContent = formatCurrency(projection.totalInvested);
  document.querySelector("#final-amount").textContent = formatCurrency(projection.finalAmount);

  const unitLabel = durationUnit === "years" ? "ano(s)" : "mês(es)";
  document.querySelector("#result-summary").textContent =
    `Projeção para ${duration} ${unitLabel} (${months} meses).`;
  resultsSection.hidden = false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorMessage.hidden = true;
  errorMessage.textContent = "";

  if (!form.reportValidity()) {
    return;
  }

  const formData = new FormData(form);
  const initialAmount = Number(formData.get("initialAmount"));
  const interestRate = Number(formData.get("interestRate"));
  const duration = Number(formData.get("duration"));
  const contribution = Number(formData.get("monthlyContribution"));
  const ratePeriod = formData.get("ratePeriod");
  const durationUnit = formData.get("durationUnit");
  const months = durationUnit === "years" ? duration * 12 : duration;

  if (!Number.isInteger(duration) || months > 1200) {
    errorMessage.textContent = "Informe um período inteiro de até 1.200 meses (100 anos).";
    errorMessage.hidden = false;
    return;
  }

  try {
    const monthlyRate = getMonthlyRate(interestRate, ratePeriod);
    const projection = calculateProjection(initialAmount, monthlyRate, contribution, months);
    renderResults(projection, months, duration, durationUnit);
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.hidden = false;
    resultsSection.hidden = true;
  }
});

document.querySelector("#clear-button").addEventListener("click", () => {
  form.reset();
  resultsBody.replaceChildren();
  resultsSection.hidden = true;
  errorMessage.textContent = "";
  errorMessage.hidden = true;
  document.querySelector("#initial-amount").focus();
});
