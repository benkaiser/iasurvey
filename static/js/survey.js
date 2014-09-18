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
  events: {
    "click #next": "nextSection"
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
      // render each of them
      var field_html = [];
      for(var cnt = 0; cnt < this.current_fields.length; cnt++){
        field_html.push(render("#" + this.current_fields[cnt].field_type + "_question_template", this.current_fields[cnt]));
      }
      console.log(field_html);
      this.$el.html(render(this.template, {title: survey.title, fields: field_html}));
    } else {
      // draw the end page

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
