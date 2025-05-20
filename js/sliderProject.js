let currentSlide = 0;
const project = document.querySelectorAll('.project');
const projectBtnPrevElm = document.getElementById('projectBtnPrev')
const projectBtnNextElm = document.getElementById('projectBtnNext')
const totalProject= project.length;

projectBtnPrevElm.onclick = (() => { moveSlide(-1) })
projectBtnNextElm.onclick = (() => { moveSlide(1) })

function moveSlide(step) {
	currentSlide += step;
	if (currentSlide < 0) currentSlide = totalProject - 1;
	if (currentSlide >= totalProject) currentSlide = 0;


	project.forEach(slide => {
		slide.style.transform = `translateX(-${currentSlide * 100}%)`
	})
}
