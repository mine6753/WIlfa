gsap.registerPlugin(ScrollTrigger);

const body = document.querySelector('body');
const intro = document.querySelector('.intro'),
	introCard = intro.querySelectorAll('.intro_card'),
	introMedia = intro.querySelector('.intro_media');

const isMobile = window.matchMedia('(max-width: 769px)');

const init = () => {
	gsap.set(body, { overflow: 'hidden' });
	gsap.set(introCard[0], { scale: 0.6 });

	initLenis();
	initScrollHero();
	initScrollMedia();
};

const initLenis = () => {
	const lenis = new Lenis({
		lerp: 0.1,
		smoothWheel: true,
	});
	lenis.on('scroll', ScrollTrigger.update);

	gsap.ticker.add((time) => lenis.raf(time * 1000));
	gsap.ticker.lagSmoothing(0);
};

// part 1
const initScrollHero = () => {
	const tlHero = gsap.timeline({
		default: { stagger: 0.08, ease: 'power1.inOut' },
		scrollTrigger: {
			trigger: '.intro_one',
			start: 'top top',
			end: 'center',
			scrub: true,
			pin: true,
			pinSpacing: true,
		},
	});
	tlHero.add('start').to(introCard[0], {
		scale: 1,
	});
};
const initScrollMedia = () => {
	const tlMedia = gsap.timeline({
		default: { stagger: 0.08, ease: 'power1.inOut' },
		scrollTrigger: {
			trigger: intro,
			start: 'center top',
			end: 'bottom bottom',
			scrub: 2,
			pinSpacing: false,
			//markers: true,
		},
	});
	gsap.set(introMedia, { autoAlpha: 1 });
	tlMedia.to(introMedia, {
		autoAlpha: 0,
	});

	initGalleryText();
};
const initGalleryText = () => {
	const gallery = document.querySelector('.gallery'),
		galleryText = gallery.querySelector('.gallery_text');

	ScrollTrigger.create({
		trigger: gallery,
		pin: galleryText,
		start: 'top top',
		end: 'bottom bottom',
	});

	const texts = gsap.utils.toArray('.gallery_text_items > h2');
	gsap.set(texts, { y: '200%', autoAlpha: 0 });

	texts.forEach((text, i) => {
		const tlGalleryText = gsap.timeline({
			scrollTrigger: {
				trigger: gallery,
				start: () => `top+=${i * window.innerHeight} top+=60%`,
				end: () => `top+=${(i + 1) * window.innerHeight} top`,
				scrub: 2,
				markers: true,
			},
		});

		tlGalleryText
			.to(text, {
				y: 0,
				autoAlpha: 1,
			})
			.to(text, {
				y: '-200%',
				autoAlpha: 0,
			});
	});
	initConnection();
};

// part 2
const initConnection = () => {
	const connect = document.querySelector('.connect'),
		connectMedia = document.querySelectorAll('.connect_media');

	connectMedia.forEach((media) => {
		media.classList.contains('image--front')
			? gsap.set(media, { xPercent: -200, y: 0, yPercent: -50 })
			: gsap.set(media, { xPercent: 200, y: 0, yPercent: -50 });
	});

	const tlConnect = gsap.timeline({
		ease: 'none',
		scrollTrigger: {
			trigger: connect,
			start: 'top top',
			end: '+=3000',
			scrub: 1,
			pin: true,
		},
	});
	tlConnect
		.to(connectMedia, {
			xPercent: 0,
		})
		.to(connectMedia, { scale: 0.5 });
	if (isMobile.matches) return;
	initHorizontal();
};

// horizontal
const initHorizontal = () => {
	const horizontal = document.querySelector('.horizontal'),
		horizontalVerticalBoxes = horizontal.querySelectorAll(
			'.horizontal_box--vertical'
		);

	const tlHorizontal = gsap.timeline({
		defaults: { ease: 'none' },
		scrollTrigger: {
			trigger: horizontal,
			start: 'top top',
			end: () => '+=' + horizontal.offsetWidth,
			pin: true,
			scrub: 1,
			invaildateOnRefresh: true,
		},
	});

	tlHorizontal.to('.horizontal_wrapper', {
		x: () =>
			-(horizontal.scrollWidth - document.documentElement.clientWidth) + 'px',
	});

	gsap.set(horizontalVerticalBoxes, { y: '-25%' });
	tlHorizontal.to(
		horizontalVerticalBoxes,
		{
			y: '25%',
			stagger: 0.02,
		},
		0
	);
};

window.addEventListener('DOMContentLoaded', () => {
	if (!isMobile.matches) {
		init();
	} else {
		initLenis();
		initScrollMedia();
	}
});
