
(function() {
//===== Preloader

	window.onload = function () {
		window.setTimeout(fadeout, 500);
	}

	function fadeout() {
		document.querySelector('.preloader').style.opacity = '0';
		document.querySelector('.preloader').style.display = 'none';
	}


    /*=====================================
    Sticky
    ======================================= */
    window.onscroll = function () {
        var header_navbar = document.querySelector(".navbar-area");
        var sticky = header_navbar.offsetTop;
        // var logo = document.querySelector(".navbar-brand img");

        if (window.pageYOffset > sticky) {
            header_navbar.classList.add("sticky");
            // logo.src = 'img/logo/fame/4.png'
        } else {
            header_navbar.classList.remove("sticky");
            // logo.src = 'img/logo/fame/1.png'
        }



        // show or hide the back-top-top button
        var backToTo = document.querySelector(".scroll-top");
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            backToTo.style.display = "flex";
        } else {
            backToTo.style.display = "none";
        }
    };

    // for menu scroll 
    const pageLink = document.querySelectorAll('.page-scroll');
    
    pageLink.forEach(elem => {
        elem.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(elem.getAttribute('href')).scrollIntoView({
                behavior: 'smooth',
                offsetTop: 1 - 60,
            });
        });
    });

    // section menu active
	function onScroll(event) {
        const sections = document.querySelectorAll('.page-scroll');
        let scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

        for (let i = 0; i < sections.length; i++) {
            let currLink = sections[i];
            let val = currLink.getAttribute('href');
            let refElement = document.querySelector(val);
            let scrollTopMinus = scrollPos + 73;
            if (refElement.offsetTop <= scrollTopMinus && (refElement.offsetTop + refElement.offsetHeight > scrollTopMinus)) {
                document.querySelector('.page-scroll').classList.remove('active');
                currLink.classList.add('active');
            } else {
                currLink.classList.remove('active');
            }
        }
	};

	window.document.addEventListener('scroll', onScroll);


    //===== close navbar-collapse when a  clicked
    let navbarToggler = document.querySelector(".navbar-toggler");    
    var navbarCollapse = document.querySelector(".navbar-collapse");

    document.querySelectorAll(".page-scroll").forEach(e =>
        e.addEventListener("click", () => {
            navbarToggler.classList.remove("active");
            navbarCollapse.classList.remove('show')
        })
    );
    navbarToggler.addEventListener('click', function() {
        navbarToggler.classList.toggle("active");
    }) 


    //========= glightbox
    const myGallery = GLightbox({
        'href': 'https://www.youtube.com/watch?v=LXb3EKWsInQ&t=23s&ab_channel=Jacob%2BKatieSchwarz',
        'type': 'video',
        'source': 'youtube', //vimeo, youtube or local
        'width': 900,
        'autoplayVideos': true,
    });

	// WOW active
    new WOW().init();

    
    //====== counter up 
    var cu = new counterUp({
        start: 0,
        duration: 2000,
        intvalues: true,
        interval: 100,
        append: " ",
    });
    cu.start();

    // ====== scroll top js
    function scrollTo(element, to = 0, duration= 1000) {

        const start = element.scrollTop;
        const change = to - start;
        const increment = 20;
        let currentTime = 0;

        const animateScroll = (() => {

            currentTime += increment;

            const val = Math.easeInOutQuad(currentTime, start, change, duration);

            element.scrollTop = val;

            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        });

        animateScroll();
    };

    Math.easeInOutQuad = function (t, b, c, d) {

        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };

    document.querySelector('.scroll-top').onclick = function () {
        scrollTo(document.documentElement); 
    }


})();
