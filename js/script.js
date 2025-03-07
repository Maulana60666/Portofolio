// Menambahkan efek smooth scroll pada klik link navbar
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
let slideIndex = [0, 0, 0]; // Simpan index gambar tiap project
const slideContainers = document.querySelectorAll(".gallery-slide");


function showSlide(projectIndex) {
    const slides = slideContainers[projectIndex];
    const totalSlides = slides.children.length;
    if (slideIndex[projectIndex] >= totalSlides) slideIndex[projectIndex] = 0;
    if (slideIndex[projectIndex] < 0) slideIndex[projectIndex] = totalSlides - 1;

    const offset = -slideIndex[projectIndex] * 100; // Geser sejauh 100% tiap slide
    slides.style.transform = `translateX(${offset}%)`;
}

function nextSlide(projectIndex) {
    slideIndex[projectIndex]++;
    showSlide(projectIndex);
}

function prevSlide(projectIndex) {
    slideIndex[projectIndex]--;
    showSlide(projectIndex);
}



function prevSlideCert(projectIndex) {
    slideIndex[projectIndex]++;
    showSlide(projectIndex);
}

function nextSlideCert(projectIndex) {
    slideIndex[projectIndex]--;
    showSlide(projectIndex);
}
