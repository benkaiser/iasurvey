
var latest = null;
var formbuilder;

$(document).ready(function(){
  $('#endpage').summernote();

  if(bootstrap_data){
    formbuilder = new Formbuilder({ selector: '#formbuilder', bootstrapData: bootstrap_data.fields});
    latest = JSON.stringify(bootstrap_data);
  } else {
    formbuilder = new Formbuilder({ selector: '#formbuilder'});
  }
  formbuilder.on('save', function(payload){
    console.log("payload!!");
    latest = payload;
  });
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
    // let the form submission complete
    return true;
  }
});
