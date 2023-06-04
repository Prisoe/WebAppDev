/*
 * File: script.js
 * Student: Prosper Alabi
 * Student ID: 300833841
 * Date: June 02,2023
 */

var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

// fuction to open tab when on mobile
function opentab(tabname) {
  for (tablink of tablinks) {
    tablink.classList.remove("active-link");
  }
  for (tabcontent of tabcontents) {
    tabcontent.classList.remove("active-tab");
  }
  event.currentTarget.classList.add("active-link");
  document.getElementById(tabname).classList.add("active-tab");
}

var sidemeu = document.getElementById("sidemenu");

// fucntion to open menu when in hamburger format
function openmenu() {
  sidemeu.style.right = "0";
}

// fucntion to close menu when in hamburger format
function closemenu() {
  sidemeu.style.right = "-200px";
}

// subnit form to my Google sheet Api
const scriptURL = "< add you own link here >"; // add your own app script link here
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

// Catch and parse form information, return if error
form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      msg.innerHTML = "Message sent successfully";
      setTimeout(function () {
        msg.innerHTML = "";
      }, 5000);
      form.reset();
    })
    .catch((error) => console.error("Error!", error.message));
});
