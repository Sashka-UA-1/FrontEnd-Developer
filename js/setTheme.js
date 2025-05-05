const btnToggleTheme = document.getElementById('toggleTheme');
const bodyElm = document.body
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

btnToggleTheme.onclick = () => {
	if (bodyElm.classList.toggle('dark-theme')) {
		btnToggleTheme.innerHTML = '<i class="fa-solid fa-sun"></i>'
	} else {
		btnToggleTheme.innerHTML = '<i class="fa-solid fa-moon"></i>'
	}
}

function setTheme(isDarkMode) {
	if (isDarkMode) {
		bodyElm.classList.add('dark-theme')
		btnToggleTheme.innerHTML = '<i class="fa-solid fa-sun"></i>'
	} else {
		bodyElm.classList.remove('dark-theme')
		btnToggleTheme.innerHTML = '<i class="fa-solid fa-moon"></i>'
	}
}
setTheme(isDarkMode)