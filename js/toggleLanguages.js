const toggleLangElm = document.getElementById('toggleLanguages')
let langSet = 'UA'
let langUa
let langEn


const setTextToHeader = ({ header }) => {
	const { home, nav } = header
	const navMenuElms = document.getElementById('menu').querySelectorAll('a')
	document.querySelector('.nav_home').textContent = home
	let index = 0
	for (const key in nav) {
		navMenuElms[index].textContent = nav[key]
		index++
	}
}

const setTextToAbout = (about) => {
	const { title, text } = about
	document.getElementById('about')
		.querySelector('h2').textContent = title
	let textContainerElm = document.querySelector('.about_text')
	const { titleText,
		textOne1, textOne2, textOne3, textOneAccent,
		textTwo1, textTwo2, textTwo3, textTwo4, textTwoAccent } = text
	textContainerElm.querySelector('h3').textContent = titleText
	let textElms = textContainerElm.querySelectorAll('p')
	textElms.forEach(text => text.textContent = '')
	textElms[0].innerHTML = `${textOne1}${textOne2}${textOne3}<span class="text-accent">${textOneAccent}</span>.`
	textElms[1].innerHTML = `${textTwo1}${textTwo2}${textTwo3}${textTwo4}<span class="text-accent">${textTwoAccent}</span>.`
}

const setTextToSkills = (skills) => {
	const { title, cart } = skills
	document.getElementById('skills')
		.querySelector('h2').textContent = title
	const skillsContent = document.getElementById('skills_content').children
	cart.forEach((textArr, index) => {
		const { title, text, textAccent } = textArr
		skillsContent[index].querySelector('h3').textContent = title
		skillsContent[index].querySelector('p').textContent = text
		skillsContent[index].querySelector('span').textContent = textAccent
	})
}

const setTextToProjects = (projects) => {
	const { title, text } = projects
	document.getElementById('projects')
		.querySelector('h2').textContent = title
	document.getElementById('projects')
		.querySelector('h3').textContent = text
}

const setTextToContact = (contact) => {
	const { title } = contact
	document.getElementById('contact')
		.querySelector('h2').textContent = title
}


const setTextToMain = ({ main }) => {
	const { about, skills, projects, contact } = main
	setTextToAbout(about)
	setTextToSkills(skills)
	setTextToProjects(projects)
	setTextToContact(contact)
}

const setLanguage = () => {
	toggleLangElm.innerText = langSet
	let lang
	if (langSet == 'UA') {
		lang = langUa
	}
	if (langSet == 'EN') {
		lang = langEn
	}
	setTextToHeader(lang)
	setTextToMain(lang)
}

toggleLangElm.onclick = function () {
	langSet = this.innerText == 'UA' ? 'EN' : 'UA';
	setLanguage()
}

async function loadLang() {
	langUa = await fetch('../languages/ua.json')
		.then((response) => response.json());
	langEn = await fetch('../languages/en.json')
		.then((response) => response.json());
	setLanguage()
}
loadLang()