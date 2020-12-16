const questions = document.getElementById('question');
const choices  = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const indicator = document.getElementById("base-timer-path-remaining");
const valid = document.getElementById('valid');
const sbm_btn = document.getElementById('sbm_btn');
const nav_btn = document.getElementById('nav_btn');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const reveal = document.getElementById('reveal');
const result = document.getElementById('result');



let settings = localStorage.getItem("setting") || [];

let settings2 = JSON.parse(localStorage.getItem("data")) || [];

let getUsername = JSON.parse(localStorage.getItem("getUsername"))||[];

let getSubject = settings2.course;
let exam = settings2.exam;
let date = settings2.date;
date = date.split(' ');
let year = date[2];

let name = getUsername;
let remark = " ";

//Set Exam time
let examTime = 50;
let count = -1;
let start = false;
const timeChoice = Number(settings[0]);    // This variable holds whether user wants timer
const getChoice  = Number(settings[2]);    //This varable holds whether user wishes to time individual or entire question 
let TIME_LIMIT=0;
//CONSTANTS 
const CORRECT_BONUS = 2;
let MAX_QUESTIONS;

let askQuestions = [];


fetch('questions.json').then(res=>{
  return res.json();
}).then((loadedQuestions) => {
  askQuestions  = loadedQuestions 
  MAX_QUESTIONS = askQuestions.length;
}).catch(err=>{console.error(err);});

// fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple').then(res=>{
//     return res.json();
// })
// .then((loadedQuestions) => {
    
//     askQuestions = loadedQuestions.results.map((loadedQuestion) => {
        
//         //extract the question from the jos res into the new object
//         const formattedQuestion = {
//             question: loadedQuestion.question,
//         };
        
//         //extract the incorrect answer into the new array
//         const answerChoices = [...loadedQuestion.incorrect_answers];
        
//         //Generate a number system to match with the 4 choices we have and then radomize it
//         formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;

//         //insert the correct answer into the list
//         answerChoices.splice(
//             formattedQuestion.answer -1, 0,  loadedQuestion.correct_answer
//         );

//         //iterate through the four answer choices
//         answerChoices.forEach((choice, index) => {
//             formattedQuestion['choice' + (index + 1)] = choice;
//         });

//         return formattedQuestion;
//     });
//     startGame();

// }).catch(err=>{console.error(err);});

setTimeout( ()=>{
  examTime = examTime * 60;
  (getChoice === 0 || getChoice === 1) ? examTime = Math.floor(examTime / MAX_QUESTIONS) : examTime
  TIME_LIMIT = examTime;
  startGame();
}, 500)


// const TIME_LIMIT = examTime;
 
let pause = false;
let timeCheck = 0;
let totalTime = 0;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = TIME_LIMIT / 2; 
const ALERT_THRESHOLD = TIME_LIMIT / 4; 

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

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...askQuestions];
    // console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
    
     if(timeChoice === 1 || timeChoice === 0){              //0/1 --> Means Timer required
      sbm_btn.classList.add('hide_me');
      nav_btn.classList.add('hide_me');
     }else if (timeChoice === 2){                           // 2 --> Means Timer not required
      sbm_btn.classList.add('hide_me');
      nav_btn.classList.remove('hide_me');
     } 
     start = true;  
};

getNewQuestion = () => {
   if(start){moveNext();}
   timeControl(getChoice); pauseTime(getChoice);
}

function moveNext () {
  
      if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
            storage();
          if(timeChoice === 2){
              game.classList.add('hidden');
              sbm_btn.classList.remove('hide_me');
          }else{
             result.classList.remove('hide_result');
             game.classList.add('hidden');

          }    
      }

      start  ? questionCounter++ : questionCounter = 1
      progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;  //Progress Text display

      //Update progress Bar
      progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

      let questionIndex;

      if(timeChoice === 1 || timeChoice === 0){
          questionIndex=Math.floor(Math.random() * availableQuestions.length);   
          currentQuestion = availableQuestions[questionIndex];
      }
      else if (timeChoice === 2){
          count += 1;
          if(count >= MAX_QUESTIONS){
            count = MAX_QUESTIONS;
          }
          currentQuestion = availableQuestions[count];
      }

      questions.innerText = currentQuestion.question;
      valid.innerText = `Choice ${currentQuestion.answer}`;
      valid.innerText += `\n ${currentQuestion.solution}`;

      choices.forEach(choice => {
          const number = choice.dataset['number'];
          choice.innerText = currentQuestion['choice' + number];
      })

      timeChoice === 2 ? console.log('No Time Control') : availableQuestions.splice(questionIndex, 1);
      acceptingAnswers = true;   
}


function getPreviousQuestion () {
    
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        
        game.classList.remove('hide_me');
        sbm_btn.classList.add('hide_me');  
      }

      questionCounter--;
      count--;
      if(count < 1){
        count = 1;
      }
      
      questionCounter = count;
      progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;   //Progress Text display

      //Update progress Bar
      progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`; 
      
      currentQuestion = availableQuestions[count];
      questions.innerText = currentQuestion?.question;

      choices.forEach(choice => {
          const number = choice.dataset['number'];
          choice.innerText = currentQuestion['choice' + number];
      })
      acceptingAnswers = true;
}

choices.forEach(choice => {

    choice.addEventListener('click', event =>{
        if(!acceptingAnswers) return;
        
        acceptingAnswers = false;
        const selectedChoice = event.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';    

        valid.innerHTML = currentQuestion.answer;
    

        if(classToApply === 'correct' && timeLeft > 0){
            incrementScore(CORRECT_BONUS); 
        }
        
        if(getChoice===1){
            totalTime += TIME_LIMIT-timeLeft;
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            if(timeChoice === 1 || timeChoice === 0){
              getNewQuestion();
            } 
        }, 2000);
    });

});

next.addEventListener('click', (e)=>{
  getNewQuestion(); 
  
});

previous.addEventListener('click', () => {
  getPreviousQuestion();
  game.classList.remove('hidden');
});

sbm_btn.addEventListener('click', () =>{
  nav_btn.classList.add('hide_me');
  sbm_btn.classList.add('hide_me');
  loader.classList.add('hidden');
  result.classList.remove('hide_result');
});

incrementScore = num => {
    score += num;
    scoreText.innerText = `${score}`;
}

document.getElementById("app").innerHTML =
`<div class="base-timer">
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
</div>`;

//Note the stoke- dasharray is calculated from circunference of of a circle=> Length = 2πr = 2 * π * 45 = 282,6

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    // The amount of time passed increments by one
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;

     // The time left label is updated
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();

    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
        timeControl(getChoice);
        timePassed = 0; 
        pause = true;
    }else if(timeLeft !==0){
        timeCheck = (TIME_LIMIT - timeLeft)+1;   //to record the total time spent on quiz
        //console.log(timeCheck);
    }

  }, 1000);
}

function formatTime(time) {
      const minutes = Math.floor(time / 60);
      let seconds = time % 60;

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      else if(timeChoice === 2){
        return `${00}:${00}`;
      }
      return `${minutes}:${seconds}`;
}


function setRemainingPathColor(timeLeft) {
    
  const { alert, warning, info } = COLOR_CODES;
    if (timeLeft >= warning.threshold) {
      document.getElementById("base-timer-path-remaining")
        .classList.remove(alert.color);
      document.getElementById("base-timer-path-remaining")
        .classList.add(info.color);
      
    }else if(timeLeft >= alert.threshold) {
      document.getElementById("base-timer-path-remaining")
        .classList.remove(info.color);
      document.getElementById("base-timer-path-remaining")
        .classList.add(warning.color);
        
    }else{
      document.getElementById("base-timer-path-remaining")
        .classList.remove(warning.color);
      document.getElementById("base-timer-path-remaining")
        .classList.add(alert.color);
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

timeControl = (option) => {
    onTimesUp();
    if((option === 1 || option === 0) && (timeChoice === 1 || timeChoice === 0)){
      timePassed = 0;
      startTimer();
      if(timeLeft === 0){
        totalTime += 10;
        moveNext();
      }
    }
}

pauseTime = (option) => {
  if(option === 2){
    if((!pause) && (timeChoice === 1 || timeChoice === 0)){
      startTimer();
    }else if(pause){
      storage();
      game.classList.add('hide_me');
      result.classList.remove('hide_result');
    }
  }
}

storage = () => {

  if(getChoice===1){
    timeCheck=totalTime;
  }
  localStorage.setItem('mostRecentScore', score);
  localStorage.setItem('totalTimeSpent', timeCheck);

  const percentile = MAX_QUESTIONS * CORRECT_BONUS;
  const student_percentile = (score / percentile) * 100;
 
  if(student_percentile < 50 ){
    remark = "Ooops, study more, see you on top!";
  }else if(student_percentile > 50 && student_percentile < 80){
    remark = "Bravo! Average performance. keep going!";
  }else{
    remark = "Excellent, I am impressed!";
  }

  //Result Injection
  document.getElementById('name').innerText = name;
  document.getElementById('subject').innerText = getSubject;
  document.getElementById('sub_teach').innerText = getSubject;
  document.getElementById('dum_score').innerHTML = `${percentile}/${percentile}`;
  document.getElementById('grade').innerText = `${score}/${percentile}`;
  document.getElementById('dum_exam').innerText = exam;
  document.getElementById('exam').innerText = exam;
  document.getElementById('dum_year').innerText = year;
  document.getElementById('year').innerText = year;
  document.getElementById('remark').innerText = remark;
  
}

window.addEventListener("beforeunload", function(event) {
  event.preventDefault(); // Cancel the event as stated by the standard.
  event.returnValue = " "; // Chrome requires returnValue to be set.
});

window.history.forward(); 
    function noBack() { 
        window.history.forward(); 
} 



