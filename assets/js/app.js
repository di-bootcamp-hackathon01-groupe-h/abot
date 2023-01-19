// Ouvrir ou fermer le bouton de chat...

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

// Echanger avec Bot....

know = {
  "Bonjour": "Bonjour Monsieur. Content de vous voir.",
  "Quel est votre nom?": "MOGA",
  "Qui êtes-vous?": "<b>Je suis un Chat Bot créé par Groupe-H.</b>",
  "Damm": "you bullshit.",
  "Dis moi quelque chose": "je ne peux pas le faire.",
  "Lol": "N'utilisez pas celui-ci. je vais te botter les fesses.",
  "Salut": "Bonjour le monde! Ravi de vous rencontrer.",
  "XD": "Tu te crois plus intelligent que moi.",
  "Je suis un humain":"L'humain a des émotions. C'est difficile à comprendre. Mais je rêve d'acheter un vélo.",
  "Merci": "Ce n'est pas nécessaire.",
  "C'est bs": "je te rendrai rouge.",
};

function talk() {
  let user = document.getElementById("userBox").value;
  document.getElementById("userBox").value = "";
  document.getElementById("chatLog").innerHTML = user + "<br>";

  if (user in know) {
    document.getElementById("chatLog").innerHTML = know[user] + "<br>";
  } else {
    document.getElementById("chatLog").innerHTML ="Je ne comprends pas tout parce que je suis un robot.<br><br><b>Utilisez d'abord une majuscule.<b><br> Cela m'aidera à vous comprendre."; // defualt
  }
}

// Random Password.......
function getPassword() {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIZKLOPWXYZ";
  let passwordLength = 14;
  let  password = "";

  for (let i = 0; i < passwordLength; i++) {
    let randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  document.getElementById("password").value = password;
}

// Preloader....

let myVariable;

function myLoader() {
  myVariable = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
  document.getElementById("f").style.display = "block";
}

// AUTO TYPE.........

let TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  let i = this.loopNum % this.toRotate.length;
  let fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  let that = this;
  let delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onpageshow = function () {
  let elements = document.getElementsByClassName("typewrite");
  for (let i = 0; i < elements.length; i++) {
    let toRotate = [
      "Salut, Je suis Abot.", 
      "Je suis là pour vous aider.", 
      "Vous pouvez commencer avec juste « Bonjour »."
    ];
    let period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], toRotate, period);
    }
  }
  // INJECT CSS
  let css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.10em solid skyblue}";
  document.body.appendChild(css);
};
