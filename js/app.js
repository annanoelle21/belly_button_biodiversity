function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var webUrl = "/metadata/" + sample;
  d3.json(webUrl).then(function(sample){
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleData = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sampleData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(([key, value]) => {
      var row = sampleData.append("p");
      row.text(`${key}: ${value}`);

    })
  })
};

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var webUrl = `/samples/${sample}`;
  d3.json(webUrl).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    var xValue = data.otu_ids;
    var yValue = data.sample_values;
    var mSize = data.sample_values;
    var mColors = data.otu_ids;
    var tValue = data.otu_labels;

    var trace_bubble = {
      x: xValue,
      y: yValue,
      mode: 'markers',
      text: tValue,
      marker: {
        color: mColors,
        size: mSize
      }
    };

    var data = [trace_bubble];
    var layout = {
      xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(webUrl).then(function(data) {
      var pieValue = data.sample_values.slice(0,10);
      var pielabel = data.otu_ids.slice(0, 10);
      var pieHoverOver = data.otu_labels.slice(0, 10);

      var data = [{
        values: pieValue,
        labels: pielabel,
        hovertext: pieHoverOver,
        type: 'pie'
      }];
      Plotly.newPlot('pie', data);
    });
  })
}
buildCharts();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
