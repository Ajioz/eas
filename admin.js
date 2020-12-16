const username = document.getElementById('username');
const password = document.getElementById('password');
const school = document.getElementById('school');
const loginBtn = document.getElementById('loginBtn');

let count=false;

username.addEventListener('keyup', (e) =>{
    checkState();
})

password.addEventListener('keyup', (e) =>{
    checkState();
})

school.addEventListener('keyup', (e) =>{
    //loginBtn.disabled = !school.value;
    checkState();
})


checkState = () => {
    (username.value.length != " " && 
    password.value.length != " " && 
    school.value.length != " ")?  
    count = true : count = false
    loginBtn.disabled = !count;
}

login = (event) => {
    event.preventDefault();
    window.location.assign('/Dashboard/dashboard.html');
};

