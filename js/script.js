<<<<<<< HEAD
// Menambahkan efek smooth scroll pada klik link navbar
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
=======
// Menambahkan efek smooth scroll pada klik link navbar
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
>>>>>>> 29195ba945bb2e9b6d0679eaa6c1bf4fd984ba88
