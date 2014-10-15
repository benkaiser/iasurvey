// utility functions
function render(template, data){
  return swig.render($(template).html(), {locals: data});
}

// setup the backbone app and router
IAApp = new Backbone.Marionette.Application();

// set the regions on the page
IAApp.addRegions({
  surveyRegion: "#surveyContainer",
});

var sections;
IAApp.addInitializer(function(options) {
  // load the data
   sections = splitBySections(survey.form.fields);
  // load the survey view
  this.cv = new SurveyView({});
  IAApp.surveyRegion.show(this.cv);
});

var SurveyView = Backbone.View.extend({
  template: "#survey_template",
  end_template: "#end_template",
  save_template: "#save_template",
  events: {
    "click #next": "nextSection",
    "click #prev": "prevSection"
  },
  initialize: function() {
    // initialise survey
    this.count = 0;
    this.current_fields = [];
  },
  render: function() {
    if(this.count < sections.length){
      // draw the current question page
      // grab the current fields
      this.current_fields = sections[this.count];
      var progress = parseInt((this.count + 1) / (sections.length + 1) * 100);
      // render each of them
      var field_html = [];
      for(var cnt = 0; cnt < this.current_fields.length; cnt++){
        field_html.push(render("#" + this.current_fields[cnt].field_type + "_question_template", this.current_fields[cnt]));
      }
      this.$el.html(render(this.template, {title: survey.title, fields: field_html, count: this.count, length: sections.length, percent: progress}));
      _.defer(function(){
        // are there any datepickers that need to be created?
        $('.datepicker').datepicker({
            format: "dd-mm-yyyy"
        });
        $('.timepicker').timepicker();
      });
    } else {
      if(this.data_saved){
        // draw the end page
        this.$el.html(render(this.end_template, {content: survey.end_page}));
      } else {
        // draw the saving view
        this.$el.html(render(this.save_template, {content: survey.end_page}));
        // create an array of the results
        var results = [];
        for(var x = 0; x < sections.length; x++){
          for(var y = 0; y < sections[x].length; y++){
            results.push({
              cid: sections[x][y].cid,
              response: sections[x][y].last_value
            });
          }
        }
        var surveyView = this;
        // save the data
        $.ajax({
          type: "POST",
          url: "/survey/submit",
          data: {survey_id: survey._id, results: results},
          success: function(){
            surveyView.data_saved = true;
            surveyView.render();
          }
        });
      }
    }
  },
  prevSection: function(){
    // save values in current section
    this.extractValues();
    // move to previous section
    this.count--;
    this.render();
  },
  nextSection: function(){
    if(this.checkValidity()){
      // save values in current section
      this.extractValues();
      // move to next section
      this.count++;
      this.render();
    }
  },
  checkValidity: function(){
    for (index = 0; index < sections[this.count].length; ++index) {
      var field = sections[this.count][index];
      var elem = $("[name='input_" + field.cid + "']");
      var value = elem.val();
      if(field.field_type == 'text'||
        field.field_type == 'paragraph'){
        // check length bounds (on characters)
        if(field.field_options.minlength){
          if(value.length < field.field_options.minlength){
            // too short
            elem.focus();
            return false;
          }
        } else if(field.field_options.maxlength){
          if(value.length > field.field_options.minlength){
            // too long
            elem.focus();
            return false;
          }
        }
      } else if(field.field_type == 'radio'){
        // extract the correct value
        value = $("[name='input_"+field.cid+"']:checked").val();
      } else if(field.field_type == 'checkboxes'){
        // extract the correct value
        value = [];
        $("[name='input_"+field.cid+"']:checked").each(function(){
          value.push($(this).val());
        });
      } else if(field.field_type == "number"){
        if(isNaN(value)){
          // not a number
          alert("Please enter a valid number");
          elem.focus();
          return false;
        }
      }

      // check if required and not filled out
      if((value === undefined || value === '' || value.length === 0) && field.required){
        alert("'" + field.label + "' is required. Please enter a response.");
        elem.focus();
        return false;
      }
    }
    return true;
  },
  extractValues: function(){
    for (index = 0; index < sections[this.count].length; ++index) {
      var field = sections[this.count][index];
      if(field.field_type == 'text'||
        field.field_type == 'paragraph' ||
        field.field_type == 'number' ||
        field.field_type == 'dropdown' ||
        field.field_type == 'date' ||
        field.field_type == 'time'){
        // these types can easily be extracted with .val()
        field.last_value = $("#input_" + field.cid).val();
      } else if(field.field_type == 'radio'){
        // find the checked item
        field.last_value = $("[name='input_"+field.cid+"']:checked").val();
      } else if(field.field_type == 'checkboxes'){
        // loop over them all and find the checked items
        var selected = [];
        $("[name='input_"+field.cid+"']:checked").each(function(){
          selected.push($(this).val());
        });
        field.last_value = selected;
      }
    }
  }
});

// this function is used to split the survey onto multiple pages
function splitBySections(fields){
  var sections = [];
  var index = 0;
  for(var x = 0; x < fields.length; x++){
    // do we want a new page and is the current page not empty?
    if(fields[x].field_type == "section_break"){
      if(sections.length != index){
        index++;
      }
    } else {
      if(sections.length == index){
        sections.push([]);
      }
      sections[index].push(fields[x]);
    }
  }
  return sections;
}

IAApp.start();
