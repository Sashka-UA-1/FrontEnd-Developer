// створення елемента
let canvas = document.createElement('canvas'),
	// отримання контексту
	ctx = canvas.getContext('2d'),
	// ширина 
	w = canvas.width = innerWidth,
	// висота
	h = canvas.height = innerHeight,
	// елементи у канвасі
	particles = [],
	// об'экт з стилями для елементів ↑
	properties = {
		bgColor: '#f90',
		particleColor: 'rgba(0, 250, 0, 1)',
		particleRadius: 8,
		particleCount: 40,
		particleSpeed: 0.5,
		lineLength: 200,
		particlesLife: 7,
	}

document.querySelector('body').appendChild(canvas);

// при змінні розмірів вікна
window.onresize = function () {
	w = canvas.width = innerWidth
	h = canvas.height = innerHeight
}

// клас для створення елементів у канвасі
class Particle {
	constructor() {
		this.x = Math.random() * w;
		this.y = Math.random() * h;
		this.spedX = Math.random()
			* (properties.particleSpeed * 2)
			- properties.particleSpeed
		this.spedY = Math.random()
			* (properties.particleSpeed * 2)
			- properties.particleSpeed
		this.life = Math.random() * properties.particlesLife * 60;
	}

	position() {
		// перевірка межі по X
		this.x - properties.particleRadius + this.spedX > w && this.spedX > 0 ||
			this.x + properties.particleRadius + this.spedX < 0 && this.spedX < 0 ?
			this.spedX *= -1 :
			this.spedX;
		// перевірка межі по Y
		this.y - properties.particleRadius + this.spedY > h && this.spedY > 0 ||
			this.y + properties.particleRadius + this.spedY < 0 && this.spedY < 0 ?
			this.spedY *= -1 :
			this.spedY;
		// переміщення 
		this.x += this.spedX;
		this.y += this.spedY;
	}

	reDraw() {
		ctx.beginPath();
		ctx.arc(this.x,
			this.y,
			properties.particleRadius,
			0,
			Math.PI * 2,
			true);
		ctx.closePath();
		ctx.fillStyle = properties.particleColor;
		ctx.fill();
	}

	timeLife() {
		if (this.life < 1) {
			this.x = Math.random() * w;
			this.y = Math.random() * h;
			this.spedX = Math.random()
				* (properties.particleSpeed * 2)
				- properties.particleSpeed
			this.spedY = Math.random()
				* (properties.particleSpeed * 2)
				- properties.particleSpeed
			this.life = Math.random() * properties.particlesLife * 60;
		}
		this.life --
	}
}

// замалювання фону канвасу
function drawBackground() {
	ctx.fillStyle = properties.bgColor
	ctx.fillRect(0, 0, w, h)
}

// перебір та створення елементу у канвасі
function drawParticle() {
	for (let i in particles) {
		particles[i].position()
		particles[i].reDraw()
		particles[i].timeLife()
	}
}

// створення ліній між точка
function drawLine() {
	let x1, y1, x2, y2, length, opacity;
	for (let i in particles) {
		for (let j in particles) {
			x1 = particles[i].x;
			y1 = particles[i].y;
			x2 = particles[j].x;
			y2 = particles[j].y;

			length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
			if (length < properties.lineLength) {
				let _lineWidth = 10 - (length / properties.lineLength) * 10;
				ctx.lineWidth = _lineWidth;
				opacity = 1 - (length / properties.lineLength)
				ctx.strokeStyle = `rgba(0, 255, 0, ${opacity})`
				ctx.beginPath()
				ctx.moveTo(x1, y1)
				ctx.lineTo(x2, y2)
				ctx.closePath()
				ctx.stroke()
			}
		}
	}
}

function loop() {
	drawBackground()
	drawParticle()
	drawLine()
	requestAnimationFrame(loop)
}

// первинний запуск 
function init() {
	for (let i = 0; i < properties.particleCount; i++) {
		particles.push(new Particle)
	}
	loop()
}
init()