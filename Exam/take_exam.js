const questions = document.getElementById('question');
const choices  = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const next = document.querySelector('#next');
const previous = document.getElementById('previous');
const progressBarFull = document.getElementById('progressBarFull');
const studentID = document.getElementById('studentID');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const reveal = document.getElementById('reveal');
const btn = document.getElementById('btn_ctr');
const ctr_btn = document.getElementById('ctr_btn');
let student_id = "mich_7b/12"
const student_name = "Michael Jumbo";

let name = document.getElementById('name').innerHTML = student_name;

let count=-2;
let check=0;
let timePassed = 0;
const TIME_LIMIT = 3600;
let timeLeft = TIME_LIMIT;
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = TIME_LIMIT / 2; 
const ALERT_THRESHOLD = TIME_LIMIT / 4; 
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let askQuestions = [];
const CORRECT_BONUS = 10;
let MAX_QUESTIONS;

fetch('../questions.json').then(res=>{
    return res.json();
}).then((loadedQuestions) => {
    askQuestions = loadedQuestions 
    MAX_QUESTIONS = askQuestions.length;
    startGame();
}).catch(err=>{console.error(err);});

 
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...askQuestions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    reveal.classList.add('hidden');
    btn.classList.add('hidden');
    ctr_btn.classList.remove('hidden');
}

getNewQuestion = () => {

    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        
        //GO TO THE END PAGE
        //return window.location.assign("/take_exam.html");
        game.classList.add('hidden');
        btn.classList.remove('hidden');
        
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    //Update progress Bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
  
    count +=1;

    if(count >= MAX_QUESTIONS){
      count = MAX_QUESTIONS;
    }
    currentQuestion = availableQuestions[count];
    questions.innerText = currentQuestion?.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })
    acceptingAnswers = true;
}

getPreviousQuestion = () => {
  if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
    localStorage.setItem('mostRecentScore', score);
    
    game.classList.remove('hidden');
    btn.classList.add('hidden');
    
}
    questionCounter--;
    // const questionIndex = availableQuestions.length;
    count--;
    if(count < 1){
      count = 1;
    }
    
    questionCounter = count;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    //Update progress Bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`; 
    

    currentQuestion = availableQuestions[count];
    questions.innerText = currentQuestion?.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })
    // availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

choices.forEach(choice => {

  choice.addEventListener('click', event => {
      if(!acceptingAnswers) return;
      
      acceptingAnswers = false;
      const selectedChoice = event.target;
      const selectedAnswer = selectedChoice.dataset['number'];
  
      
      const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'correct';    

      if(classToApply === 'correct'){
          incrementScore(CORRECT_BONUS); 
      }

      selectedChoice.parentElement.classList.add(classToApply);
      
      setTimeout( () => {
          selectedChoice.parentElement.classList.remove(classToApply);
          //getNewQuestion();
      }, 1500);
  });

});

next.addEventListener('click', (e)=>{
    getNewQuestion();    
});

previous.addEventListener('click', () => {
    getPreviousQuestion();
 });

btn.addEventListener('click', () =>{
  reveal.classList.remove('hidden');
  ctr_btn.classList.add('hidden');
  btn.classList.add('hidden');
});

studentID.innerText = student_id;
incrementScore = num => {
    score += num;
    // scoreText.innerText = `${score}`;
}

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};


let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283" 
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;

//Note the stoke- dasharray is calculated from circunference of of a circle=> Length = 2πr = 2 * π * 45 = 282,6

startTimer();

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {

    // The amount of time passed increments by one
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;

     // The time left label is updated
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}


function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  // If the remaining time is less than or equal to 5, remove the "warning" class and apply the "alert" class.
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
    // If the remaining time is less than or equal to 10, remove the base color and apply the "warning" class.
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

// Divides time left by the defined time limit.
function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

// Update the dasharray value as time passes, starting with 283
function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}


// by https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload#Example
window.addEventListener("beforeunload", function(event) {
  event.preventDefault(); // Cancel the event as stated by the standard.
  event.returnValue = " "; // Chrome requires returnValue to be set.
});


startGame();

window.history.forward(); 
    function noBack() { 
        window.history.forward(); 
} 

