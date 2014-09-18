// setup the backbone app and router
IAApp = new Backbone.Marionette.Application();

// set the regions on the page
IAApp.addRegions({
  surveyRegion: "#surveyContainer",
});

IAApp.addInitializer(function(options){
  // load the survey view
  this.cv = new SurveyView({});
  IAApp.contentRegion.show(this.cv);
});

var SurveyView = Backbone.View.extend({
  template: "#survey_template",
  events: {
    "click #next": "nextSection"
  },
  initialize: function(){
    // initialise survey
  },
  render: function(){
    // render survey
  }
});

IAApp.start();
