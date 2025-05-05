const menuElm = document.getElementById('menu');
const sectionElm = document.querySelectorAll('section');
const itemsElm = [...menuElm.children]
const options = {
	threshold: 0.75
}
const observer = new IntersectionObserver((sectionElm) => {
	let idElm
	sectionElm.forEach(Elm => {
		if (Elm.isIntersecting) {
			idElm = Elm.target.id
		}
	})
	if (idElm != undefined) {
		itemsElm.forEach(item => {
			item.classList.remove('active')
		})
		document.querySelector(`[href="#${idElm}"]`)
			.parentNode.classList.add('active')
	}
}, options);

sectionElm.forEach(section => {
	observer.observe(section);
});