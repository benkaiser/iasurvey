// utility functions
function render(template, data){
  return swig.render($(template).html(), {locals: data});
}

// setup the backbone app and router
IARes = new Backbone.Marionette.Application();

// set the regions on the page
IARes.addRegions({
  queryRegion: "#query_container",
  resultsRegion: "#results_container"
});

var sections;
IARes.addInitializer(function(options) {
  // load the data
   sections = splitBySections(survey.form.fields);
  // load the survey view
  this.cv = new QueryView({});
  this.queryRegion.show(this.cv);
});

var QueryView = Backbone.View.extend({
  template: "#query_template",
  events: {
    "click #query": "query",
    "click #show_all": "showAll"
  },
  initialize: function() {
  },
  render: function() {
    this.$el.html(render(this.template, {surey: survey}));
  },
  query: function(){
  },
  showAll: function(){
    console.log("Show All");
    IARes.rv = new ResultsView({survey: survey});
    IARes.resultsRegion.show(IARes.rv);
  }
});

var ResultsView = Backbone.View.extend({
  template: "#results_template",
  events: {
    "click #export": "export",
    "click #chart": "chart"
  },
  initialize: function() {
  },
  render: function() {
    console.log(survey);
    survey.form.clean_fields = removeSections(survey.form.fields);
    this.$el.html(render(this.template, {survey: survey}));
  },
  export: function(){
    console.log("Export");
  },
  chart: function(){
    console.log("Chart");
  }
});

// remove the section fields in the page
function removeSections(fields){
  var new_fields = [];
  for(var x = 0; x < fields.length; x++){
    if(fields[x].field_type != "section_break"){
      new_fields.push(fields[x]);
    }
  }
  return new_fields;
}

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

IARes.start();
