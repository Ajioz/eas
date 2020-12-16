$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();
    $('.dropdown-trigger').dropdown(); 
    $('select').formSelect();  
});

window.addEventListener("scroll", function(){
    var nav = document.querySelector("nav");
    nav.classList.toggle("sticky", window.scrollY > 0 )
})

window.history.forward(); 
function noBack() { 
    window.history.forward(); 
} 

const loader = document.getElementById('loader');
const game = document.getElementById('game');
let courseList  = document.querySelector('.course-list ul');
const Courses = document.querySelector(".courses");
const sidenav  = document.querySelector('.getter');
const addCourse = Array.from(document.getElementsByClassName('validate'));
let allCourses = JSON.parse(localStorage.getItem('courses')) || [];
let pickValue = [];
let fetchedSchool = "Alvinas Model School ";
let status;

fetchedSchool  !== " " ?  status = true : status = false

let courseId=0;
let sideNav_course=[];

//Graying OUT Department field
let input = document.getElementById('department');  //obtain reference to the school name input field
input.setAttribute('placeholder', `${fetchedSchool}`);
input.disabled=status;

//Cyvling through the array of objects to extract each course id
for(let key in allCourses){
    let value = allCourses[key];
    courseId = value.id;
}

//Dynamically Injecting School Name
let dept_name = fetchedSchool.split(" ");
document.querySelector('.department').innerHTML = dept_name[0];

//Display Course card on UI
if(localStorage.getItem('courses')){
    game.classList.remove('hidden');
    allCourses.map((course) => {
        displayCourse(course);
        sidenavDisplay(course);
        sideNav_course.push(course);
    });
    if(sideNav_course.length>0){
        loader.classList.add('hidden');
    }
}

// console.log("Extracted courses are: ", sideNav_course);

//delete card
courseList.addEventListener('click', (e)=>{
    if (e.target.classList.contains("delete") || e.target.parentElement.classList.contains("delete")){
            const taskId = e.target.closest("li").id;
            removeTask(taskId);       
    }
});

// filter card for delete purposes
function removeTask(taskId) {
    allCourses = allCourses.filter((task) => task.id !== parseInt(taskId));
    document.getElementById(taskId).remove();
    localStorage.setItem("courses", JSON.stringify(allCourses));
}

//retrieve data from forms
addCourse.forEach((course, index)=>{
    course.addEventListener('keyup', (e)=>{
        pickValue[index] = e.target.value;
    });
});

//create task
createTask = () => {   
    if(
        pickValue[1].length > 0 && 
        pickValue[2].length > 0 && 
        pickValue[3].length > 0 &&
        pickValue[4].length > 0 &&
        pickValue[5].length > 0
      ) 
    {       
        pickValue[0] = fetchedSchool;
        let state = {
            id: courseId += 1,
            school: pickValue[0],
            course: pickValue[1],
            class_level: pickValue[2],
            course_code: pickValue[3],
            designation: pickValue[4],
            staff_name: pickValue[5]
        };
        
        allCourses.push(state);
        localStorage.setItem("courses", JSON.stringify(allCourses));
        displayCourse(state);
        loader.classList.add('hidden');
    }    
}

//Display courses
function displayCourse (course){
    //Display elements
    const taskEl = document.createElement('li');
    taskEl.setAttribute("id", course.id);
    const taskElMarkup = `
    <div class="course-card">
        <div class="view_details">
            <h6 class="dropdown-trigger action" data-target='dropdown${course.id}'>Action</h6>
            <ul id='dropdown${course.id}' class='dropdown-content'>
                <li><a href="set_exam.html">Exam</a></li>
                <li><a href="publish.html">Push</a></li>
                <span><a class="delete">Delete</a></span>
            </ul>
        </div>     	
        <div class="stats-container">
            <div>
                <span class="course_class">${course.class_level}</span>
                <span class="course_name">${course.course}</span>    
                <p class="course_code">${course.course_code}</p>   
            </div>
            <div class="school_name">
                <strong>${course.school}</strong>
                <span class="modal-trigger delete2" href="#modal2">X</span>
                <h6>${course.designation} ${course.staff_name}</h6>
            </div>                       
        </div>            
    </div>`;

    taskEl.innerHTML = taskElMarkup;
    Courses.appendChild(taskEl);
}

const searchBox = document.forms['search-books'].querySelector('input[type="text"]');

searchBox.addEventListener('keyup', (e)=>{
    const collect = searchBox.value.toLowerCase();
    const books = Array.from(courseList.getElementsByTagName('li'));
    books.forEach((item)=>{
        const title = item.firstElementChild.textContent.toLowerCase();
        title.indexOf(collect)  != -1 ? item.style.display = 'block' :  item.style.display = 'none'
    });
});

//Injecting into Navigation space
const nav_name = "Alvinas Model School";
document.querySelector('.nav_name').innerText = nav_name;
const nav_email = "alvinas@ajiozi.com";
document.querySelector('.nav_email').innerText = nav_email;

//create elements
function sidenavDisplay(nav){
    const side_nav = document.createElement('li');
    side_nav.setAttribute("id", nav.id);
    const taskElMarkup = `
        <div class="school_name">
            <li><a class="waves-effect" href="#!">${nav.course} : ${nav.class_level} : ${nav.staff_name}</a></li>
        </div>`;
    side_nav.innerHTML = taskElMarkup;
    sidenav.appendChild(side_nav);
}

//Back to top
const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () =>{
    if(window.pageYOffset > 500){
        toTop.classList.add("active");
    }else{
        toTop.classList.remove("active");
    }
})