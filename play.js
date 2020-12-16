const start = document.getElementById('start');
const decide = document.getElementById('decide');
const time_fraction = document.getElementById('time_fraction');
const exam = document.getElementById('exam');
const subject = document.getElementById('subject');


let setting = [];

start.addEventListener('click', function(e){
    e.preventDefault();

    //Binding setting inputs
    let choice = decide.options[decide.selectedIndex].value;
    let choice1= time_fraction.options[time_fraction.selectedIndex].value;
    let choice2= exam.options[exam.selectedIndex].value;

    const course = subject.options[subject.selectedIndex].outerText;
    const get_exam = exam.options[exam.selectedIndex].outerText;
  
    var date = $('.datepicker').val();

    let data = {
        course: course,
        exam: get_exam,
        date: date
    }

    setting.splice(0, 1, Number(choice));
    setting.splice(1, 1, Number(choice1));
    setting.splice(2, 1, Number(choice2));
   
    // console.log('Updated option was ', setting);

    localStorage.setItem("data", JSON.stringify(data));
    localStorage.setItem('setting', setting);
    window.location.assign("/game.html");
});
