document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, options);
  });

  document.addEventListener('DOMContentLoaded', function(){
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
}); 



class GetEvent {

    constructor(school, course, code, level){
        this.school = school;
        this.course = course;
        this.coursecode = code;
        this.level = level;
    }

    department(newEntry){
        newEntry.addEventListener('keyup', () =>{
            return newEntry.value = this.school;
        })
    }
    
    subject(newEntry){
        newEntry.addEventListener('keyup', () =>{
            return newEntry.value = this.course;
        })
    }
    
    subject_code(newEntry){
        newEntry.addEventListener('keyup', () =>{
            return newEntry.value = this.code;
        })
    }
    
    level(newEntry){
        newEntry.addEventListener('keyup', () =>{
            return newEntry.value = this.level;
        })
    }

    
    deleteCourse = (id) => {

        this.course = [];
          
        let deleteItem = this.course.filter(takeOut =>{
          return takeOut.id !== id                //returning false for a filter method, removes the item, from the new array
          //return takeOut.id === id             //returning true for a filter method, keeps only the item in the new array
        });
        this.setState({
          schedule:deleteItem
        })
        console.log("Array Left", deleteItem);
      }

}

