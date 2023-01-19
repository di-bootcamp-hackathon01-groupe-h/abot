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

// Charge le fichier json contenant les questions/reponses predefinies
fetch('../../dataset/questions.json')
  .then(response => response.json())
  .then(data => {
    dataset = data.none;
    questions = dataset.questions.concat(data.sante.questions);
    dataset.answers = dataset.answers.concat(data.sante.answers);
  })
  .catch(error => alert(`Impossible de recuperer la liste des question : ${error}`));

let timer;

/**
 * Generer et afficher une reponse pour la question envoyee
 */
function talk() {
  document.querySelector('#calendar').innerHTML = '';
  let inputBox = document.getElementById("userBox");
  let oldText = inputBox.value;
  let user = oldText.trim().toLowerCase();
  inputBox.placeholder = oldText;
  inputBox.value = "";
  let responseBox = document.getElementById("chatLog")
  responseBox.innerHTML = user + "<br>";
  let questionFound = false;

  for (let id in questions) {
    if (questions[id].includes(user)) {
      let answersGroup = dataset.answers[id]
      let answer = answersGroup[Math.floor(Math.random() * answersGroup.length)];
      responseBox.innerHTML = answer.replace("[popup-calendar]", "") + "<br>";
      questionFound = true;
      if (timer != undefined) {
        clearTimeout(timer)
      }
      if (answer.includes("[popup-calendar]")) {
        showCalendar(document.querySelector('#calendar'));
      }
      break;
    } else {
      let qIdx = includeSynonym(questions[id], user);
      if(qIdx > -1) {
        let answersGroup = dataset.answers[id]
        let answer = answersGroup[Math.floor(Math.random() * answersGroup.length)];
        responseBox.innerHTML = answer.replace("[popup-calendar]", "") + "<br>";
        questionFound = true;
        if (timer != undefined) {
          clearTimeout(timer)
        }
        if (answer.includes("[popup-calendar]")) {
          showCalendar(document.querySelector('#calendar'));
        }
        break;
      }
    }
  }

  function includeSynonym(sentences, sentence) {
    sentences = sentences.map(s => clean(s));
    sentence = clean(sentence);
    let scores = [];
    scores.length = sentence.length;
    scores.fill(0);

    for(let x=0; x<sentences.length; x++) {
      let s = sentences[x]
      s = s.split(' ')
      let ws = sentence.split(' ');
      for(let i=0; i<ws.length; i++) {
        if(s.includes(ws[i]))
          scores[x]++
      }
    }

    let max = 0;
    let sentenceIndex = -1;
    scores.forEach((s, idx) => {
      if(s > max) {
        max = s;
        sentenceIndex = idx;
      }
    })

    if(max > 1) {
      found = sentences[sentenceIndex];
    }

    return sentenceIndex;
  }

  function clean(str) {
    let search = "éàùâôîïöèçê.?,!-".split('')
    let replace = "eauaoiioece     ".split('')
    let str_arr = str.split('')
    for(let i = 0; i<str_arr.length; i++) {
      if(search.includes(str_arr[i]))
        str_arr[i] = replace[i];
    }

    return str_arr.join('')
  }

  if (!questionFound) {
    if(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(user)) { // L'utilisateur a selectionne une date
      responseBox.innerHTML = "Votre rendez-vous a bien été programmé !<br>";
    } else {
      responseBox.innerHTML = "Je ne comprends pas tout parce que je suis un robot.<br><br><b>Utilisez d'abord une majuscule.<b><br> Cela m'aidera à vous comprendre."; // defualt
      // Clear response zone after 5s
      timer = setTimeout(() => {
        responseBox.innerHTML = '<p class="kane"><i class="fa fa-refresh fa-spin"></i></p>';
        inputBox.placeholder = 'Votre message...'
        clearTimeout(timer)
      }, 5000)
    }
  }
}

function showCalendar(wrapper) {
  function createCalendar(year, month) {
    let table = document.createElement('table')
    // Create table header for weekday names
    table.appendChild(document.createElement('thead'))
    let headTr = document.createElement('tr')
    let days = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']
    days.forEach(d => {
      let th = document.createElement('th')
      th.textContent = d
      headTr.appendChild(th)
    })
    table.querySelector('thead').appendChild(headTr)
    // Build a list of all the days in the given month
    let date = new Date(year, month, 0),
      daysCount = date.getDate(),
      dates = []

    for (let day = 1; day <= daysCount; day++) {
      date.setDate(day)
      dates.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    }

    let cal = [] // Calendar
    let week = []
    week.length = 7
    week.fill(null)
    dates.forEach(d => {
      let j = d.getDay()
      if (j === 1) { // Monday
        // Start a new week on every monday
        week = []
        week.length = 7
        week.fill(null)
      }
      week[(j - 1 + 7) % 7] = d
      if (j === 0 || d.getDate() === daysCount) // Sunday or end of month
        // Sunday is the last day of the week
        cal.push(week)
    })

    // Add weeks as rows (tr) and days as columns (td) to the table
    table.appendChild(document.createElement('tbody'))
    let today = new Date()
    cal.forEach(w => {
      let tr = document.createElement('tr')
      w.forEach(d => {
        let td = document.createElement('td')
        if(d !== null) {
          td.dataset.date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()
          td.onclick = (e) => {
            let _date = e.target.dataset.date
            document.getElementById("userBox").value = _date
            talk();
          }
        }
        td.innerHTML = d === null ? '&middot;' : d.getDate().toString()
        if (d !== null && d.toDateString() == today.toDateString())
          td.classList.add('today') // Highlight today on the calendar
        tr.appendChild(td)
      })
      table.querySelector('tbody').appendChild(tr)
    })

    // Add the calendar table to the document
    wrapper.appendChild(table)
    // Add some styles to the calendar
    // let link = document.createElement('link')
    // link.rel = 'stylesheet'
    // link.type = 'text/css'
    // link.href = './style.css'
    // document.head.appendChild(link)
  }

  createCalendar(2023, 1)
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
