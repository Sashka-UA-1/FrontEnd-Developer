const btnToggleMenu = document.getElementById('toggleMenu');
const menuElm = document.getElementById('menu');
const bodyElm = document.body

btnToggleMenu.onclick = () => {
	if (menuElm.classList.toggle('open')) {
		bodyElm.style.overflow = 'hidden'
	} else {
		bodyElm.style.overflow = 'auto'
	}
}

menuElm.onclick = (e) => {
	menuElm
	const target = e.target.tagName
	if (target == 'A' || target == 'LI') {
		menuElm.classList.remove('open')
		bodyElm.style.overflow = 'auto'
	}
}