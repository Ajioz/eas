const username = document.getElementById('username');
const password = document.getElementById('password');
const school = document.getElementById('school');
const course_code = document.getElementById('course_code');
const loginBtn = document.getElementById('loginBtn');

let getUsername = ' ';
let count=false;
username.addEventListener('keyup', (e) =>{
    checkState();
    getUsername = e.target.value;
})

password.addEventListener('keyup', (e) =>{
    checkState();
})

school.addEventListener('keyup', (e) =>{
    //loginBtn.disabled = !school.value;
    checkState();
})

course_code.addEventListener('keyup', (e) =>{
    checkState();
})

login = (event) => {
    event.preventDefault();
    localStorage.setItem("getUsername", JSON.stringify(getUsername));
    window.location.assign('/Exam/exam_choice.html');
};

checkState = () => {
    (username.value.length != " " && 
    password.value.length != " " && 
    school.value.length != " " &&
    course_code.value.length != " ")?  
    count = true : count = false
    loginBtn.disabled = !count;
}