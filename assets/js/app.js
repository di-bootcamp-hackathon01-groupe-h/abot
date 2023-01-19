// Ouvrir ou fermer le bouton de chat...

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

// Echange avec ABot....

let dataset;
let questions;

fetch('../../dataset/questions.json')
  .then(response => response.json())
  .then(data => { 
    dataset = data.none;
    questions = dataset.questions.concat(data.sante.questions); 
    dataset.answers = dataset.answers.concat(data.sante.answers);
  })
  .catch(error => alert(`Impossible de recuperer la liste des question : ${error}`));

let timer;

function talk() {
  let inputBox = document.getElementById("userBox");
  let oldText = inputBox.value;
  let user = oldText.trim().toLowerCase();
  inputBox.placeholder = oldText;
  inputBox.value = "";
  let responseBox = document.getElementById("chatLog")
  responseBox.innerHTML = user + "<br>";
  let questionFound = false;
  
  for(let id in questions) {
    if(questions[id].includes(user)) {
      let answersGroup = dataset.answers[id]
      document.getElementById("chatLog").innerHTML = answersGroup[Math.floor(Math.random() * answersGroup.length)] + "<br>";
      questionFound = true;
      if(timer != undefined) {
        clearTimeout(timer)
      }
      break;
    }
  }
  
  if(!questionFound) {
    document.getElementById("chatLog").innerHTML = "Je ne comprends pas tout parce que je suis un robot.<br><br><b>Utilisez d'abord une majuscule.<b><br> Cela m'aidera à vous comprendre."; // defualt
    // Clear response zone after 5s
    timer = setTimeout(() => {
      responseBox.innerHTML = '<p class="kane"><i class="fa fa-refresh fa-spin"></i></p>';
      inputBox.placeholder = 'Votre message...'
      clearTimeout(timer)
    }, 5000)
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
