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
  resultsRegion: "#results_container",
  chartRegion: "#charts_container"
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
    // make sure charts view is hidden
    IARes.chartRegion.close();
  },
  showAll: function(){
    // just send them through without filtering them
    IARes.rv = new ResultsView({results: sift_results});
    IARes.resultsRegion.show(IARes.rv);
    // make sure charts view is hidden
    IARes.chartRegion.close();
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
    // generate a csv file of the results
    var csvArr = [];
    // add the questions
    var questions = [];
    for(var i = 0; i < survey.form.clean_fields.length; i++){
      questions.push(survey.form.clean_fields[i].label);
    }
    csvArr.push(questions);
    // add all the responses
    for(var x = 0; x < this.options.results.length; x++){
      var results = this.options.results[x];
      var line = [];
      for(var response in results){
        line.push(results[response].toString());
      }
      csvArr.push(line);
    }
    console.log(csvArr);
    CSV.begin(csvArr).download("results.csv").go();
  },
  chart: function(){
    IARes.chv = new ChartView({results: this.options.results});
    IARes.chartRegion.show(IARes.chv);
  }
});

var ChartView = Backbone.View.extend({
  template: "#charts_template",
  events: {
    "click #piechart": "setPieChart",
    "click #columnchart": "setColumnChart",
    "click #barchart": "setBarChart",
  },
  render: function(){
    var chartview = this;
    this.$el.html(render(this.template, {survey: survey, results: this.options.results}));
    // wait for the DOM to be rendered (all elements added)
    _.defer(function(){
      chartview.renderCharts();
    });
  },
  renderCharts: function(type){
    type = (type) ? type : 'bar';
    var questions_answers = bindResults(survey, this.options.results);
    // draw the charts
    for(var q_a in questions_answers){
      q_a = questions_answers[q_a];
      if(q_a.question.field_type == 'dropdown' ||
        q_a.question.field_type == 'radio' ||
        q_a.question.field_type == 'checkboxes'){
        this.renderChart(q_a, type);
      }
    }
  },
  renderChart: function(q_a, type){
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Option');
    data.addColumn('number', 'Number of Responses');

    var rows = [], total, x, y;
    switch(q_a.question.field_type){
      case 'radio':
        // radio has the same logic as dropdown
      case 'dropdown':
        for(x = 0; x < q_a.question.field_options.options.length; x++){
          // count the responses
          total = 0;
          for(y = 0; y < q_a.response.length; y++){
            if(q_a.response[y] == q_a.question.field_options.options[x].label){
              total++;
            }
          }
          rows.push([q_a.question.field_options.options[x].label, total]);
        }
        break;
      case 'checkboxes':
        for(x = 0; x < q_a.question.field_options.options.length; x++){
          // count the responses
          total = 0;
          for(y = 0; y < q_a.response.length; y++){
            if(_.contains(q_a.response[y], q_a.question.field_options.options[x].label)){
              total++;
            }
          }
          rows.push([q_a.question.field_options.options[x].label, total]);
        }
    }
    data.addRows(rows);
    // Set chart options
    var options = {'title': q_a.question.label, 'width': "100%", 'height': 400, vAxis: {title: "# of Responses"}, hAxis: {title: "Option"}};

    var chart;
    // Instantiate and draw our chart, passing in some options
    switch(type){
      case 'bar':
        chart = new google.visualization.BarChart(document.getElementById('chart_' + q_a.question.cid));
        var temp = options.vAxis;
        options.vAxis = options.hAxis;
        options.hAxis = temp;
        break;
      case 'pie':
        chart = new google.visualization.PieChart(document.getElementById('chart_' + q_a.question.cid));
        break;
      case 'column':
        chart = new google.visualization.ColumnChart(document.getElementById('chart_' + q_a.question.cid));
        break;
    }
    chart.draw(data, options);
  },
  setPieChart: function(){
    this.renderCharts("pie");
  },
  setColumnChart: function(){
    this.renderCharts("column");
  },
  setBarChart: function(){
    this.renderCharts("bar");
  },
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

function bindResults(survey, results){
  var new_results = [];
  for(var x = 0; x < survey.form.clean_fields.length; x++){
    var responses = [];
    for(var y = 0; y < results.length; y++){
      responses.push(results[y][survey.form.clean_fields[x].cid]);
    }
    new_results.push({response: responses, question: survey.form.clean_fields[x]});
  }
  return new_results;
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
