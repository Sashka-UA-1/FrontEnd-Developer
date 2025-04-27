$(function () {

	// масив для збереження бази всіх курсів валют
	let exchangeRates;

	// ↓ змінні для курсів валюти
	let exchangeRateUsdValue;
	let exchangeRateEurValue;
	// ↑ змінні для курсів валюти

	// вибір валюти для обчислення
	let currencySelectorValue;

	// сума кредиту 
	let loanAmountValue;

	// сума початкового внеску
	let initialContributionValue = 0;

	// вибір банку для обчислення
	let bankChoiceValue;

	// масив з різними ставками банку
	let annualInterestRateBanks = {
		'privatBank': '37',
		'monoBank': '40.32',
		'pumbBank': '41.18',
	}

	// річка ставка
	let annualRateValue

	// кількість місяців
	let loanTermVale;

	// тип платежу
	let paymentTypeValue;

	// форма повністю заповнена
	let formFilleOout = false


	// ↓ отримання бази курсів валют
	$.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json', function (data) {
		exchangeRates = data;
		renderExchangeRate();
	});
	// ↑ отримання бази курсів валют

	// ↓ відображення курсів валют
	function renderExchangeRate() {
		exchangeRateUsdValue = exchangeRates.find(rate => rate.cc == 'USD').rate;
		exchangeRateEurValue = exchangeRates.find(rate => rate.cc == 'EUR').rate;
		$('#exchangeRateUsd').text(exchangeRateUsdValue.toFixed(2))
		$('#exchangeRateEur').text(exchangeRateEurValue.toFixed(2))
	}
	// ↑ відображення курсів валют

	// ↓ вибір валюти обчислення
	$('#currencySelector').on('input', function () {
		currencySelectorValue = $(this).val();
		updateProgressBar()
	})
	// ↑ вибір валюти обчислення

	// ↓ отримання суми кредиту
	$('#loanAmount').on('input', function () {
		loanAmountValue = $(this).val();
		updateProgressBar()
	})
	// ↑ отримання суми кредиту

	// ↓ отримання суми початкового внеску
	$('#initialContribution').on('input', function () {
		initialContributionValue = $(this).val();
		console.log(':>', initialContributionValue);
	})
	// ↑ отримання суми початкового внеску

	// ↓ отримання виберіть банк
	$('#bankChoice').on('input', function () {
		bankChoiceValue = $(this).val();
		setAnnualInterestRateBank();
		updateProgressBar()
	})
	// ↑ отримання виберіть банк

	// ↓ встановлення річної ставки від банку
	function setAnnualInterestRateBank() {
		annualRateValue = annualInterestRateBanks[bankChoiceValue]
		$('#annualRate').val(annualRateValue)
	}
	// ↑ встановлення річної ставки від банку

	// ↓ отримання кількості місяців
	$('#loanTerm').on('input', function () {
		loanTermVale = $(this).val()
		renderLoanTermText()
		updateProgressBar()
	})
	// ↑ отримання кількості місяців

	// ↓ відображення вибраної кількості місяців
	function renderLoanTermText() {
		$('#loanTermText').text(loanTermVale);
	}
	// ↑ відображення вибраної кількості місяців

	// ↓ отримання типу платежу
	$('input[name="payment-type"]').on('click', function () {
		paymentTypeValue = $(this).val();
		updateProgressBar()
	})
	// ↑ отримання типу платежу

	// ↓ перевірка на заповнення форми
	function checkFormFilleOout() {

		if (loanAmountValue == null) {
			return formFilleOout = false
		}
		if (loanAmountValue < initialContributionValue) {
			return formFilleOout = false
		}
		if (bankChoiceValue == undefined) {
			return formFilleOout = false
		}
		if (annualRateValue == '') {
			return formFilleOout = false
		}
		if (paymentTypeValue == null) {
			return formFilleOout = false
		}
		if (currencySelectorValue == null) {
			return formFilleOout = false
		}
		if (loanTermVale == null) {
			return formFilleOout = false
		}
		return formFilleOout = true
	}
	// ↑ перевірка на заповнення форми

	// ↓ виведення результату
	$('form').submit(function (e) {
		e.preventDefault();
		// щомісячний платіж
		checkFormFilleOout()
		if (!formFilleOout) {
			$('#resultContainer').text('Помилка! Ви не заповнили форму')
			return
		}
		let monthlyPayment
		// загальна сума до спати
		let totalAmountDue
		// місячка ставки
		let monthlyAnnualRateValue = annualRateValue / 12 / 100
		if (paymentTypeValue == 'annuity') {
			monthlyPayment = ((loanAmountValue - initialContributionValue) * (monthlyAnnualRateValue / (1 - (1 + monthlyAnnualRateValue) ** (-loanTermVale))))
		}
		if (paymentTypeValue == 'equalParts') {
			monthlyPayment = (loanAmountValue - initialContributionValue) / loanTermVale + (loanAmountValue - initialContributionValue) * monthlyAnnualRateValue
		}
		if(currencySelectorValue == 'UAH'){
			totalAmountDue = monthlyPayment * loanTermVale
			$('#resultContainer').html(`<p>Щомісячний платіж: ${monthlyPayment.toFixed(2)} грн</p>
			<p>Загальна сума до сплати: ${totalAmountDue.toFixed(2)} грн</p>`)
		}
		if(currencySelectorValue == 'USD'){
			monthlyPayment = monthlyPayment / exchangeRateUsdValue;
			totalAmountDue = monthlyPayment * loanTermVale
			$('#resultContainer').html(`<p>Щомісячний платіж: ${monthlyPayment.toFixed(2)} $</p>
			<p>Загальна сума до сплати: ${totalAmountDue.toFixed(2)} $</p>`)
		}
		if(currencySelectorValue == 'EUR'){
			monthlyPayment = monthlyPayment / exchangeRateEurValue;
			totalAmountDue = monthlyPayment * loanTermVale
			$('#resultContainer').html(`<p>Щомісячний платіж: ${monthlyPayment.toFixed(2)} €</p>
			<p>Загальна сума до сплати: ${totalAmountDue.toFixed(2)} €</p>`)
		}
	});
	// ↑ виведення результату

	// ↓ заповнення прогрес бару
	function updateProgressBar() {
		let numberCompletedFieldsValue = []
		if (currencySelectorValue) {
			if (!numberCompletedFieldsValue.find(c => c == currencySelectorValue)) {
				numberCompletedFieldsValue.push(currencySelectorValue)
			}
		}
		if (loanAmountValue) {
			if (!numberCompletedFieldsValue.find(c => c == loanAmountValue)) {
				numberCompletedFieldsValue.push(loanAmountValue)
			}
		}
		if (bankChoiceValue) {
			if (!numberCompletedFieldsValue.find(c => c == bankChoiceValue)) {
				numberCompletedFieldsValue.push(bankChoiceValue)
			}
		}
		if (loanTermVale) {
			if (!numberCompletedFieldsValue.find(c => c == loanTermVale)) {
				numberCompletedFieldsValue.push(loanTermVale)
			}
		}
		if (paymentTypeValue) {
			if (!numberCompletedFieldsValue.find(c => c == paymentTypeValue)) {
				numberCompletedFieldsValue.push(paymentTypeValue)
			}
		}

		let widthValue = (numberCompletedFieldsValue.length / 5) * 100
		$('#progressBar').animate({ 'width': widthValue + '%' }, 100)
		saveLastStatus()
	}
	// ↑ заповнення прогрес бару

	// ↓ перемикач теми сторінки
	$('#changeTheme').on('click', function(){
		$('html').toggleClass('dark');
		saveLastStatus();
	})
	// ↑ перемикач теми сторінки

	// ↓ збереження змін на сторінці
	function saveLastStatus(){
		let darkMode = $('html').hasClass('dark');
		let lastStatus = {
			'exchangeRateUsdValue': exchangeRateUsdValue,
			'exchangeRateEurValue': exchangeRateEurValue,
			'currencySelectorValue': currencySelectorValue,
			'loanAmountValue': loanAmountValue,
			'initialContributionValue': initialContributionValue,
			'bankChoiceValue': bankChoiceValue,
			'annualRateValue': annualRateValue,
			'loanTermVale': loanTermVale,
			'paymentTypeValue': paymentTypeValue,
			'darkMode': darkMode
		}
		localStorage.setItem('lastStatus', JSON.stringify(lastStatus))
		console.log(':>', lastStatus);
	}
	// ↑ збереження змін на сторінці

	// ↓ завантаження сторінки 
	let lastStatus = JSON.parse(localStorage.getItem('lastStatus'))
	console.log(':>', lastStatus);
	if(lastStatus){
		exchangeRateUsdValue = lastStatus.exchangeRateUsdValue
		setValueToInput('exchangeRateUsd', exchangeRateUsdValue)
		exchangeRateEurValue = lastStatus.exchangeRateEurValue
		setValueToInput('exchangeRateEur', exchangeRateEurValue)
		currencySelectorValue = lastStatus.currencySelectorValue
		setValueToInput('currencySelector', currencySelectorValue)
		loanAmountValue = lastStatus.loanAmountValue
		setValueToInput('loanAmount', loanAmountValue)
		initialContributionValue = lastStatus.initialContributionValue
		setValueToInput('initialContribution', initialContributionValue)
		bankChoiceValue = lastStatus.bankChoiceValue
		setValueToInput('bankChoice', bankChoiceValue)
		annualRateValue = lastStatus.annualRateValue
		setValueToInput('annualRate', annualRateValue)
		loanTermVale = lastStatus.loanTermVale
		setValueToInput('loanTerm', loanTermVale)
		paymentTypeValue = lastStatus.paymentTypeValue
		$(`input [name="payment-type"]`).val(paymentTypeValue)
		if(lastStatus.darkMode){
			$('html').addClass('dark');
		}
	}
	// ↑ завантаження сторінки 

	// ↓ встановлення значень в полях форми
	function setValueToInput(inputElm, valueElm){
		$(`#${inputElm}`).val(valueElm)
	}
	// ↑ встановлення значень в полях форми

})