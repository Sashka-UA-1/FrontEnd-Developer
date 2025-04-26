$(function () {
	// масив з запитаннями та відповідями
	const originalQuestions = [
		{
			question: 'Хто був першим гетьманом Війська Запорозького?',
			answer: ['Богдан Хмельницький', 'Дмитро Вишневецький', 'Іван Мазепа', 'Петро Дорошенко'],
			correct: 'Дмитро Вишневецький'
		},
		{
			question: 'У якому році була підписана Переяславська рада?',
			answer: ['1648', '1654', '1667', '1686'],
			correct: '1654'
		},
		{
			question: 'Столицею Української Народної Республіки (УНР) був(ла):',
			answer: ['Київ', 'Львів', 'Харків', 'Одеса'],
			correct: 'Київ'
		},
		{
			question: 'Хто був автором першої Конституції України 1710 року?',
			answer: ['Богдан Хмельницький', 'Іван Мазепа', 'Пилип Орлик', 'Петро Сагайдачний'],
			correct: 'Пилип Орлик'
		},
		{
			question: 'У якому році Україна проголосила незалежність?',
			answer: ['1990', '1991', '1992', '1993'],
			correct: '1991'
		}
	];
	// лічильник запитання
	let indexQuestion = 0;
	// масив з мішаною вікториною
	let randomQuestions = [];

	// ↓ = змінення масиву вікторини
	function shufuArray(arr) {
		return arr.sort(() => Math.random() - 0.5)
	}
	// ↑ = змінення масиву вікторини

	// ↓ = завантаження попередньої вікторини
	let previousQuizzes = JSON.parse(localStorage.getItem('previousQuizzes'));
	if (previousQuizzes) {
		randomQuestions = previousQuizzes;
	}
	// ↑ = завантаження попередньої вікторини

	// ↓ = завантаження номера попереднього запитання
	let previousIndexQuestion = localStorage.getItem('indexQuestion')
	if (previousIndexQuestion) {
		indexQuestion = previousIndexQuestion++;
	}
	// ↑ = завантаження номера попереднього запитання

	// ↓ = звантаження індикатор прогресу
	let previousProgressTracker = localStorage.getItem('progressTracker');
	// ↑ = звантаження індикатор прогресу

	// ↓ = завантаження вікторини
	function loadQuestion() {
		// перевірка чи була готова зміна вікторина як що ні то створю її 
		if (randomQuestions.length == 0) {
			randomQuestions = shufuArray(originalQuestions)
			localStorage.setItem('previousQuizzes', JSON.stringify(randomQuestions))
		};
		// поточне запитання
		let currentQuestion = randomQuestions[indexQuestion];
		$('#quizTitle').text(currentQuestion.question)
		$('#containerAnswer').empty();
		currentQuestion.answer.forEach(answer => {
			let liElem = document.createElement('li');
			liElem.textContent = answer;
			$('#containerAnswer').append(liElem);
		});
		renderQuizCounter();
	}
	loadQuestion()
	// ↑ = завантаження вікторини

	// ↓ = відображення текстового прогресу вікторини
	function renderQuizCounter() {
		
		let quizCounterText = `${indexQuestion + 1} з ${randomQuestions.length}`
		$('#quizCounter').text(quizCounterText)
	}
	// ↑ = відображення текстового прогресу вікторини

	// ↓ = відображення індикатор прогресу
	function renderProgressTracker() {
		if(previousProgressTracker){
			$('#progressTracker').html(previousProgressTracker)
		}else{
			$('#progressTracker').empty();
			for (let i = 0; i < randomQuestions.length; i++) {
				let liElem = document.createElement('li');
				liElem.innerHTML = '<i class="fa-regular fa-clock"></i>';
				$('#progressTracker').append(liElem)
			}
		}
	}
	renderProgressTracker();
	// ↑ = відображення індикатор прогресу

	// ↓ = відповідь від користувача
	$('#containerAnswer').on('click', 'li', function () {
		let answer = $(this).text();
		if (answer == randomQuestions[indexQuestion].correct) {
			$(this).addClass('ok');
			updateProgressTracker(true);
		} else {
			let allAnswerElem = $('#containerAnswer li');
			for (let answerElem of allAnswerElem) {
				let answerText = $(answerElem).text();
				if (answerText == randomQuestions[indexQuestion].correct) {
					$(answerElem).addClass('ok')
				}
				$(this).addClass('error')
			}
			updateProgressTracker(false)
		}
		$('#nextBtn').removeAttr('disabled');
	})
	// ↑ = відповідь від користувача

	// ↓ = оновлення стану у індикатор прогресу
	function updateProgressTracker(answer) {
		let indicator = $('#progressTracker li')[indexQuestion]
		if (answer) {
			$(indicator).addClass('ok').html('<i class="fa-solid fa-check"></i>');
		} else {
			$(indicator).addClass('error').html('<i class="fa-solid fa-xmark"></i>');
		}
		let progressTrackerElem = $('#progressTracker').html();
		localStorage.setItem('progressTracker', progressTrackerElem);
	}
	// ↑ = оновлення стану у індикатор прогресу

	// ↓ = перехід до наступного питання
	$('#nextBtn').on('click', function () {
		indexQuestion++;
		localStorage.setItem('indexQuestion', indexQuestion);
		if (indexQuestion + 1 == randomQuestions.length) {
			$(this).text('Повторити вікторину')
		}
		if (indexQuestion == randomQuestions.length) {
			localStorage.clear();
			indexQuestion = 0;
			randomQuestions.length = 0
			$(this).text('Наступне питання');
			$('#progressTracker li').removeClass('ok').removeClass('error').html('<i class="fa-regular fa-clock"></i>');
		}
		$('#containerAnswer').fadeOut(200);
		loadQuestion();
		$('#containerAnswer').fadeIn(200);
		$(this).attr('disabled', true);
	})
	// ↑ = перехід до наступного питання






})