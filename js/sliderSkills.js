let currentSlide = 0;
const slides = document.querySelectorAll('.skills_cart');
const skillsBtnPrevElm = document.getElementById('skillsBtnPrev')
const skillsBtnNextElm = document.getElementById('skillsBtnNext')
const totalSlides = slides.length;
let isPhone = window.matchMedia 
&& window.matchMedia('(max-width: 480px)').matches;

skillsBtnPrevElm.onclick = (() => { moveSlide(-1) })
skillsBtnNextElm.onclick = (() => { moveSlide(1) })

function moveSlide(step) {
	currentSlide += step;
	if (currentSlide < 0) currentSlide = totalSlides - 1;
	if (currentSlide >= totalSlides) currentSlide = 0;


	slides.forEach(slide => {
		slide.style.transform = `translateX(-${currentSlide * 100}%)`
	})
}

if (isPhone) {
	setInterval(() => moveSlide(1), 2500)
}