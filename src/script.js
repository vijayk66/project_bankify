"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn-close-modal");
const btnsOpenModal = document.querySelectorAll(".open-btn");

const navigationContainer = document.querySelector(".header");
const heroContainer = document.querySelector(".hero-container");
const menu = document.querySelector(".menu");
const navLinks = document.querySelectorAll(".nav-link");
const learnMore = document.querySelector(".learn");

const lazyImg = document.querySelectorAll(".lazy");

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".content");
const tabsContainer = document.querySelector(".opt-content-heading");


const testimonials = document.querySelectorAll(".testimonial")

// opening modal
function toogleModal(e) {
  e.preventDefault();
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
}

[...btnsOpenModal, overlay, btnCloseModal].forEach((open) => {
  open.addEventListener("click", toogleModal);
});

// nav hover effect
function hoverEffect(e, opc) {
  if (e.target.classList.contains("nav-link")) {
    navLinks.forEach((link) => {
      link.style.opacity = opc;
    });
    e.target.style.opacity = "1";
  }
}

menu.addEventListener("mouseover", function (e) {
  e.preventDefault();
  hoverEffect(e, 0.5);
});

menu.addEventListener("mouseout", function (e) {
  e.preventDefault();
  hoverEffect(e, 1);
});

// menu scroll effect
menu.addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav-link")) {
    const id = e.target.dataset.sectionid;
    document
      .querySelector(`.section-${id}`)
      ?.scrollIntoView({ behavior: "smooth" });
  }
});

learnMore.addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector(".section-1")?.scrollIntoView({ behavior: "smooth" });
});

// lazy loading
function loadImg(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    navigationContainer.style.position = "sticky";
    navigationContainer.style.boxShadow="0 0 2px 5px rgb(227, 226, 226)"
  } else {
    navigationContainer.style.position = "relative";
    navigationContainer.style.boxShadow="0 0 5px 5px rgb(227, 226, 226)"
  }
  lazyImg.forEach((img) => {
    const imgName = img.dataset.name;
    img.src = `./img/${imgName}`;
  });
}
const options = {
  root: null,
  threshold: 0,
  rootMargin: "-90px",
};
const observer = new IntersectionObserver(loadImg, options);
observer.observe(heroContainer);

// tab click effect
tabsContainer.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("tab")) {
    const tabId = e.target.dataset.id;
    tabs.forEach((tab) => tab.classList.remove("active-tab"));
    e.target.classList.add("active-tab");
    tabContents.forEach(content => {
      content.style.display="none";
      document.querySelector(`.content-${tabId}`).style.display="block"
    })

  }
});

// testimonials
testimonials.forEach(test => {
  test.addEventListener("mouseover", function(){
    this.style.transform = "scale(1.05)"
  })
  test.addEventListener("mouseout", function(){
    this.style.transform = "scale(1)"
  })
})
