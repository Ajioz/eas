$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown(); 
    $('.materialSelect').formSelect();
    $('.datepicker').datepicker();
    $('select').formSelect();
    $('.fixed-action-btn').floatingActionButton(); 
    $('.modal').modal();  
  
    //setup listener for custom event to re-initialize on change
    $('.materialSelect').on('contentChanged', function() {
       $(this).formSelect();
    });

    //Display Course code on select dropdown
    if(localStorage.getItem('courses')){
        allCourses.map((course) => { 
            var courseCode = course.course_code; 
            var $newOpt = $("<option>").attr("value",courseCode).text(courseCode)
            $("#myDropdown").append($newOpt);
            // fire custom event anytime you've updated select
            $("#myDropdown").trigger('contentChanged');
        });
    }
});

window.addEventListener("scroll", function(){
    var nav = document.querySelector("nav");
    nav.classList.toggle("sticky", window.scrollY > 0 )
})

window.history.forward(); 
function noBack() { 
    window.history.forward(); 
} 
const sidenav  = document.querySelector('.getter');
const exam = document.getElementsByClassName('exam');
let allCourses = JSON.parse(localStorage.getItem('courses')) || [];
let fetchedSchool = "Alvinas Model School "
let status;

fetchedSchool  !== " " ?  status = true : status = false

//Graying OUT Department field
let input = document.getElementById('department');  //obtain reference to the school name input field
input.setAttribute('placeholder', `${fetchedSchool}`);
input.disabled=status;

//Display Course, level and teacher name on sideNav
if(localStorage.getItem('courses')){
    allCourses.map((course) => {
        sidenavDisplay(course);
    });
}

// console.log(exam);


//create sidenav contents
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
    if(window.pageYOffset > 800){
        toTop.classList.add("active");
    }else{
        toTop.classList.remove("active");
    }
})


/*
    My Image uploder handler
*/
//check if browser supports file api and filereader features
if (window.File && window.FileReader && window.FileList && window.Blob) {
	
    //this is not completely neccesary, just a nice function I found to make the file size format friendlier
     //http://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable

     function humanFileSize(bytes, si) {
         var thresh = si ? 1000 : 1024;
         if(bytes < thresh) return bytes + ' B';
         var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
         var u = -1;
         do {
             bytes /= thresh;
             ++u;
         } while(bytes >= thresh);
         return bytes.toFixed(1)+' '+units[u];
     }
 
 
   //this function is called when the input loads an image
     function renderImage(file){
         var reader = new FileReader();
         reader.onload = function(event){
             the_url = event.target.result
       //of course using a template library like handlebars.js is a better solution than just inserting a string
             $('#preview').html("<img src='"+the_url+"' />")
            //  $('#name').html(file.name)
             $('#size').html(humanFileSize(file.size, "MB"))
             $('#type').html(file.type)
         }
     
     //when the file is read it triggers the onload event above.
         reader.readAsDataURL(file);
     }
   
 
   //watch for change on the 
     $( "#the-photo-file-field" ).change(function() {
        
         /*grab the first image in the fileList in this example we are only loading one file.*/

         //console.log(this.files[0].size)
         renderImage(this.files[0])
 
     });
 
 } else {
 
   alert('The File APIs are not fully supported in this browser. Please switch to Chrome Browser');
 
 }

