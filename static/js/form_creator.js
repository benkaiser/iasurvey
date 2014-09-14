var formbuilder = new Formbuilder({ selector: '#formbuilder' });

var latest = null;
formbuilder.on('save', function(payload){
  latest = payload;
});

$(document).ready(function(){
  $('#endpage').summernote();
});

// handle form submission
$("#main_form").submit(function( event ) {
  if(latest === null){
    alert("Survey must have at least one question.");
    event.preventDefault();
  } else {
    // trigger a save
    $(".js-save-form.fb-button").click();
    // set the form values
    $("#form_json").val(latest);
    $("#end_page_html").val($("#endpage").code());
    return false;
  }
});
