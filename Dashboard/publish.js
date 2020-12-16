$(function() {

    // initialize
    $('.materialSelect').formSelect();
  
    // setup listener for custom event to re-initialize on change
    $('.materialSelect').on('contentChanged', function() {
      $(this).formSelect();
    });
  
    // update function for demo purposes
    $("#myButton").click(function() {
      
        // add new value
        var newValue = getNewDoggo();
        var $newOpt = $("<option>").attr("value",newValue).text(newValue)
        $("#myDropdown").append($newOpt);
    
        // fire custom event anytime you've updated select
        $("#myDropdown").trigger('contentChanged');
      
    });
  
  });
  
  window.addEventListener("scroll", function(){
    var nav = document.querySelector("nav");
    nav.classList.toggle("sticky", window.scrollY > 0 )
})

window.history.forward(); 
function noBack() { 
    window.history.forward(); 
} 
  // function getNewDoggo() {
  //   var adjs =  ['Floofy','Big','Cute','Cuddly','Lazy'];
  //   var nouns = ['Doggo','Floofer','Pupper','Fluffer', 'Nugget'];
  //   var newOptValue = adjs[Math.floor(Math.random() * adjs.length)] + " " + 
  //                     nouns[Math.floor(Math.random() * nouns.length)];
  //   return newOptValue;
  // }
  