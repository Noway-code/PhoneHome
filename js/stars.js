window.onload = function() {
	const starsLeft = document.querySelectorAll('.star-left');
	const starsRight = document.querySelectorAll('.star-right');

	starsLeft.forEach(star => {
		const randomX = '1'; // Fixed direction towards the right of the screen
		const randomY = (Math.random() * 2 - 1).toString(); // Random number between -1 and 1
		const randomStartX = ((Math.random() * 100) - 100).toString() + '%'; // Random start position between -100% and 0%
		const randomStartY = ((Math.random() * 200) - 100).toString() + '%'; // Random start position between -100% and 100%
		star.style.setProperty('--random-x', randomX);
		star.style.setProperty('--random-y', randomY);
		star.style.top = randomStartY;
		star.style.left = randomStartX;
	});

	starsRight.forEach(star => {
		const randomX = '-1'; // Fixed direction towards the left of the screen
		const randomY = (Math.random() * 2 - 1).toString();
		const randomStartX = ((Math.random() * 100) + 100).toString() + '%';
		const randomStartY = ((Math.random() * 200) - 100).toString() + '%';
		star.style.setProperty('--random-x', randomX);
		star.style.setProperty('--random-y', randomY);
		star.style.top = randomStartY;
		star.style.left = randomStartX;
	});
};
