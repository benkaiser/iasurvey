// utility functions
function render(template, data){
  return swig.render($(template).html(), {locals: data});
}
// extra swig template
swig.setFilter('trim', function (input, length) {
  return input.toString().substring(0, length);
});

// constants
var RELOP = {
  EQ: 0,
  NE: 1,
  GT: 2,
  LT: 3
};
var relops = [
  {value: RELOP.EQ, title: "="},
  {value: RELOP.NE, title: "!="},
  {value: RELOP.GT, title: ">"},
  {value: RELOP.LT, title: "<"}
];
var LOGOP = {
  AND: 0,
  OR: 1
};
var logicalops = [
  {value: LOGOP.AND, title: "AND"},
  {value: LOGOP.OR, title: "OR"}
];

// collections
var Results = Backbone.Collection.extend({});
var results = new Results();
results.add(survey.results);

// add clean_fields to survey
survey.form.clean_fields = removeSections(survey.form.fields);

// create easily siftable version of results
var sift_results = [];
for(var x = 0; x < survey.results.length; x++){
  var responses = survey.results[x].results;
  var result = {};
  for(var y = 0; y < responses.length; y++){
    result[responses[y].cid] = responses[y].response;
  }
  sift_results.push(result);
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
    "click .delete_query": "removeQuery",
    "click #show_all": "showAll",
    "click #add_query": "saveAddQueryOption"
  },
  initialize: function() {
    this.queries = [];
    this.addQueryOption();
  },
  addQueryOption: function(){
    this.queries.push({
      field: survey.form.clean_fields[0].cid,
      relop: RELOP.EQ,
      constraint: "",
      logicalop: LOGOP.AND
    });
  },
  querySave: function(){
    var query_view = this;
    // save the fields
    $(".query_field").each(function(){
      var index = parseInt($(this).attr('data-id'));
      query_view.queries[index].field = $(this).val();
    });
    // save the relops
    $(".query_relop").each(function(){
      var index = parseInt($(this).attr('data-id'));
      query_view.queries[index].relop = parseInt($(this).val());
    });
    // save the constraints
    $(".query_constraint").each(function(){
      var index = parseInt($(this).attr('data-id'));
      query_view.queries[index].constraint = $(this).val();
    });
    // save the logical operators
    $(".query_logicalop").each(function(){
      var index = parseInt($(this).attr('data-id'));
      query_view.queries[index].logicalop = parseInt($(this).val());
    });
  },
  render: function() {
    this.$el.html(render(this.template, {surey: survey, queries: this.queries, relops: relops, logicalops: logicalops}));
  },
  removeQuery: function(ev){
    // first save the user entered data
    this.querySave();
    // then remove the one the user selected
    var index = parseInt($(ev.target).attr('data-id'));
    this.queries.splice(index, 1);
    this.render();
  },
  query: function(){
    // save the user entered data
    this.querySave();
    // now construct a query, run it on the results, and pass it to the results view
    var built_query = {};
    for(var x = 0; x < this.queries.length; x++){
      var query = this.queries[x];
      var this_part = {};
      switch(query.relop){
        case RELOP.EQ:
          this_part[query.field] = {$eq: query.constraint};
          break;
        case RELOP.NE:
          this_part[query.field] = {$ne: query.constraint};
          break;
        case RELOP.GT:
          this_part[query.field] = {$gt: query.constraint};
          break;
        case RELOP.LT:
          this_part[query.field] = {$lt: query.constraint};
          break;
      }
      // if the first time, just set it
      if(x === 0){
        built_query = this_part;
      } else {
        // join them on
        switch(query.logicalop){
          case LOGOP.AND:
            built_query = {$and: [this_part, built_query]};
            break;
          case LOGOP.OR:
            built_query = {$or: [this_part, built_query]};
            break;
        }
      }
    }
    // run the query on the results
    var sifted = sift(built_query, sift_results);
    // render the results
    IARes.rv = new ResultsView({results: sifted});
    IARes.resultsRegion.show(IARes.rv);
  },
  showAll: function(){
    // just send them through without filtering them
    IARes.rv = new ResultsView({results: sift_results});
    IARes.resultsRegion.show(IARes.rv);
  },
  saveAddQueryOption: function(){
    this.querySave();
    this.addQueryOption();
    this.render();
  }
});

var ResultsView = Backbone.View.extend({
  template: "#results_template",
  events: {
    "click .survey_result": "showDetail",
    "click #export": "export",
    "click #chart": "chart"
  },
  initialize: function() {
  },
  render: function() {
    this.$el.html(render(this.template, {survey: survey, results: this.options.results}));
  },
  showDetail: function(ev){
    var index = $(ev.target).closest('tr').attr('data-id');
    new DetailView({result: this.options.results[index]});
  },
  export: function(){
    console.log("Export");
  },
  chart: function(){
    console.log("Chart");
  }
});

var DetailView = Backbone.View.extend({
  template: "#detail_template",
  initialize: function(){
    // bind it to the questions
    console.log(this.options.result);
    this.options.result = bindQuestions(survey, this.options.result);
    console.log(this.options.result);
    // show the detailed results
    bootbox.alert(render(this.template, {result: this.options.result}));
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

function bindQuestions(survey, results){
  var new_results = [];
  for(var x = 0; x < survey.form.clean_fields.length; x++){
    new_results.push({response: results[survey.form.clean_fields[x].cid], question: survey.form.clean_fields[x]});
  }
  return new_results;
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
