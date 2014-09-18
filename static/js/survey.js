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
  events: {
    "click #next": "nextSection"
  },
  initialize: function() {
    // initialise survey
  },
  render: function() {
    // render survey
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
