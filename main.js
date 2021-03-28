// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 200}; //175 original
const NUM_VIDEO_GAMES = 10;

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let filename = "../data/video_games.csv";

/*********************** BAR GRAPH ***************************/

// TODO: Set up SVG object with width, height and margin
let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)     // HINT: width
    .attr("height", graph_1_height)     // HINT: height
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform

// TODO: Create a linear scale for the x axis (number of occurrences)
let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);  // Improves readability
/*
    Here we will create global references to the x and y axis with a fixed range.
    We will update the domain of the axis in the setData function based on which data source
    is requested.
 */

// Set up reference to count SVG group
let countRef = svg.append("g");
// Set up reference to y axis label to update text in setData
let y_axis_label = svg.append("g");

// TODO: Add x-axis label
svg.append("text")
    .attr("transform", `translate(${graph_1_width / 2 - margin.left}, ${graph_1_height - margin.bottom})`)       // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Global Sales (Millions of Units)");
// Since this text will not update, we can declare it outside of the setData function


// TODO: Add y-axis label
// ${graph_1_height / 2 + margin.top}, ${-margin.left}
//var rotateTranslate = d3.svg.transform().rotate(-90).translate(200, 100);
let y_axis_text = svg.append("text")
    .attr("transform", `rotate(-90)`) // HINT: Place this at the center left edge of the graph
    .attr("x", -90)
    .attr("y", -margin.left + 20)
    .style("text-anchor", "middle");

// TODO: Add chart title
let title = svg.append("text")
    .attr("transform", `translate(${graph_1_width / 2 - margin.left}, ${-10})`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);
/*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
 */

/********************** PIE GRAPH *************************/
let radius = Math.min(graph_2_width, graph_2_height) / 2

let svg2 = d3.select("#graph2")
  .append("svg")
  .attr("width", graph_2_width)
  .attr("height", graph_2_height)
  .append("g")
  .attr("transform", `translate(${graph_2_width / 2}, ${graph_2_height / 2})`);


/*********************** PUBLISHER BAR GRAPH ***************************/
//TODO: Set up SVG object with width, height and margin
// let svg3 = d3.select("#graph3")
//     .append("svg")
//     .attr("width", graph_3_width)     // HINT: width
//     .attr("height", graph_3_height)     // HINT: height
//     .append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);    // HINT: transform
//
// // TODO: Create a linear scale for the x axis (number of occurrences)
// let x = d3.scaleLinear()
//     .range([0, graph_3_width - margin.left - margin.right]);
//
// // TODO: Create a scale band for the y axis (artist)
// let y = d3.scaleBand()
//     .range([0, graph_3_height - margin.top - margin.bottom])
//     .padding(0.1);  // Improves readability
// /*
//     Here we will create global references to the x and y axis with a fixed range.
//     We will update the domain of the axis in the setData function based on which data source
//     is requested.
//  */
//
// // Set up reference to count SVG group
// let countRef = svg3.append("g");
// // Set up reference to y axis label to update text in setData
// let y_axis_label = svg3.append("g");
//
// // TODO: Add x-axis label
// svg3.append("text")
//     .attr("transform", `translate(${graph_3_width / 2 - margin.left}, ${graph_3_height - margin.bottom})`)       // HINT: Place this at the bottom middle edge of the graph
//     .style("text-anchor", "middle")
//     .text("Global Sales (Millions of Units)");
// // Since this text will not update, we can declare it outside of the setData function
//
//
// // TODO: Add y-axis label
// // ${graph_1_height / 2 + margin.top}, ${-margin.left}
// //var rotateTranslate = d3.svg.transform().rotate(-90).translate(200, 100);
// let y_axis_text = svg.append("text")
//     .attr("transform", `rotate(-90)`) // HINT: Place this at the center left edge of the graph
//     .attr("x", -90)
//     .attr("y", -margin.left + 20)
//     .style("text-anchor", "middle");
//
// // TODO: Add chart title
// let title = svg.append("text")
//     .attr("transform", `translate(${graph_1_width / 2 - margin.left}, ${-10})`)       // HINT: Place this at the top middle edge of the graph
//     .style("text-anchor", "middle")
//     .style("font-size", 15);
/*
    We declare global references to the y-axis label and the chart title to update the text when
    the data source is changed.
 */


/**
 * Sets the data on the barplot using the provided index of valid data sources and an attribute
 * to use for comparison
 */
function setVideoGameBarData(isAllTime, year) {
    // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
    d3.csv(filename).then(function(data) {
        // TODO: Clean and strip desired amount of data for barplot
        data = loadVideoGameData(data, function(a, b) {
          return parseFloat(b["Global_Sales"]) - parseFloat(a["Global_Sales"]);
        });
        if(isAllTime) {
          data = data.slice(0, NUM_VIDEO_GAMES);
        } else {
          data = data.filter(d => parseInt(d["Year"]) == year);
          data = data.slice(0, NUM_VIDEO_GAMES);
          console.log(data.length);
        }

        // TODO: Update the x axis domain with the max count of the provided data
        x.domain([0, d3.max(data, function(d) {return parseFloat(d["Global_Sales"])})]);

        // TODO: Update the y axis domains with the desired attribute
        y.domain(data.map(function(d) {return d["Name"] + " (" + d["Platform"] + ")"}));
        // HINT: Use the attr parameter to get the desired attribute for each data point

        // TODO: Render y-axis label
        y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

        let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["Name"] + " (" + d["Platform"] + ")" }))
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_VIDEO_GAMES));

        /*
            This next line does the following:
                1. Select all desired elements in the DOM
                2. Count and parse the data values
                3. Create new, data-bound elements for each data value
         */
        let bars = svg.selectAll("rect").data(data);

        // TODO: Render the bar elements on the DOM
        /*
            This next section of code does the following:
                1. Take each selection and append a desired element in the DOM
                2. Merge bars with previously rendered elements
                3. For each data point, apply styling attributes to each element

            Remember to use the attr parameter to get the desired attribute for each data point
            when rendering.
         */
        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("fill", function(d) {return color(d["Name"] + " (" + d["Platform"] + ")")})
            .attr("x", x(0))
            .attr("y", function(d) {return y(d["Name"] + " (" + d["Platform"] + ")")})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
            .attr("width", function(d) {return x(parseFloat(d["Global_Sales"]))})
            .attr("height", y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

        /*
            In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
            bar plot. We will be creating these in the same manner as the bars.
         */
        let counts = countRef.selectAll("text").data(data);

        // TODO: Render the text elements on the DOM
        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .duration(1000)
            .attr("x", function(d) {return x(parseFloat(d["Global_Sales"])) + 10})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
            .attr("y", function(d) {return y(d["Name"] + " (" + d["Platform"] + ")") + 10})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
            .style("text-anchor", "start")
            .text(function(d) {return parseFloat(d["Global_Sales"])});           // HINT: Get the count of the artist

        y_axis_text.text("Video Game Title");
        if (isAllTime) {
          title.text("Top Video Games of All Time");
        } else {
          title.text("Top Video Games of " + year);
        }

        // Remove elements not in use if fewer groups in new dataset
        bars.exit().remove();
        counts.exit().remove();
    });
}

function setVideoGamePieData(region) {
  d3.csv(filename).then(function (data) {
    /* Build a map with, for a given region, a video game genre and the total
    sales of games in that genre */
    console.log(data[0]["Genre"]);
    genreSales = {};
    for (var i = 0; i < data.length; i++) {
      if (data[i]["Genre"] in genreSales) {
        genreSales[data[i]["Genre"]] += parseFloat(data[i][region]);
      } else {
        genreSales[data[i]["Genre"]] = parseFloat(data[i][region]);
      }
    }
    console.log(genreSales);

    let pie = d3.pie()
      .value(function(d) {return d.value; })
      .sort(function(a, b) {return d3.ascending(a.key, b.key);})
    let pie_data = pie(d3.entries(genreSales))
    console.log(pie_data);

    let pie_graph = svg2.selectAll("path").data(pie_data)

    let color = d3.scaleOrdinal()
      .domain(Array.from(Object.keys(genreSales)))
      .range(d3.schemeDark2);

    let arcGen = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    pie_graph.enter()
              .append('path')
              .merge(pie_graph)
              .transition()
              .duration(1000)
              .attr('d', arcGen)
              .attr('fill', function(d){ return color(d.data.key) })
              .attr("stroke", "white")
              .style("stroke-width", "2px")
              .style("opacity", 1)

    svg2.selectAll('text').remove();

    svg2.selectAll('mySlices')
            .data(pie_data)
            .enter()
            .append('text')
            .text(function(d){ return d.data.key + " (" + d.data.value.toFixed(1) + ")"})
            .attr("transform", function(d) { return "translate(" + arcGen.centroid(d) + ")";  })
            .style("text-anchor", "middle")
            .style("font-size", 14)

    console.log(pie_graph);


    pie_graph.exit()
             .remove()
  });
}

function setPublisherBarData() {
  // TODO: Load the artists CSV file into D3 by using the d3.csv() method. Index into the filenames array
  d3.csv(filename).then(function(data) {
      // TODO: Clean and strip desired amount of data for barplot
      /* Unfinished */


      data = loadVideoGameData(data, function(a, b) {
        return parseFloat(b["Global_Sales"]) - parseFloat(a["Global_Sales"]);
      });
      if(isAllTime) {
        data = data.slice(0, NUM_VIDEO_GAMES);
      } else {
        data = data.filter(d => parseInt(d["Year"]) == year);
        data = data.slice(0, NUM_VIDEO_GAMES);
        console.log(data.length);
      }

      // TODO: Update the x axis domain with the max count of the provided data
      x.domain([0, d3.max(data, function(d) {return parseFloat(d["Global_Sales"])})]);

      // TODO: Update the y axis domains with the desired attribute
      y.domain(data.map(function(d) {return d["Name"] + " (" + d["Platform"] + ")"}));
      // HINT: Use the attr parameter to get the desired attribute for each data point

      // TODO: Render y-axis label
      y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(10));

      let color = d3.scaleOrdinal()
      .domain(data.map(function(d) { return d["Name"] + " (" + d["Platform"] + ")" }))
      .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"), NUM_VIDEO_GAMES));

      /*
          This next line does the following:
              1. Select all desired elements in the DOM
              2. Count and parse the data values
              3. Create new, data-bound elements for each data value
       */
      let bars = svg.selectAll("rect").data(data);

      // TODO: Render the bar elements on the DOM
      /*
          This next section of code does the following:
              1. Take each selection and append a desired element in the DOM
              2. Merge bars with previously rendered elements
              3. For each data point, apply styling attributes to each element

          Remember to use the attr parameter to get the desired attribute for each data point
          when rendering.
       */
      bars.enter()
          .append("rect")
          .merge(bars)
          .transition()
          .duration(1000)
          .attr("fill", function(d) {return color(d["Name"] + " (" + d["Platform"] + ")")})
          .attr("x", x(0))
          .attr("y", function(d) {return y(d["Name"] + " (" + d["Platform"] + ")")})               // HINT: Use function(d) { return ...; } to apply styles based on the data point
          .attr("width", function(d) {return x(parseFloat(d["Global_Sales"]))})
          .attr("height", y.bandwidth());        // HINT: y.bandwidth() makes a reasonable display height

      /*
          In lieu of x-axis labels, we are going to display the count of the artist next to its bar on the
          bar plot. We will be creating these in the same manner as the bars.
       */
      let counts = countRef.selectAll("text").data(data);

      // TODO: Render the text elements on the DOM
      counts.enter()
          .append("text")
          .merge(counts)
          .transition()
          .duration(1000)
          .attr("x", function(d) {return x(parseFloat(d["Global_Sales"])) + 10})       // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
          .attr("y", function(d) {return y(d["Name"] + " (" + d["Platform"] + ")") + 10})       // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
          .style("text-anchor", "start")
          .text(function(d) {return parseFloat(d["Global_Sales"])});           // HINT: Get the count of the artist

      y_axis_text.text("Video Game Title");
      if (isAllTime) {
        title.text("Top Video Games of All Time");
      } else {
        title.text("Top Video Games of " + year);
      }

      // Remove elements not in use if fewer groups in new dataset
      bars.exit().remove();
      counts.exit().remove();
  });
}

/**
 * Cleans the provided data using the given comparator then strips to first numExamples
 * instances
 */
function loadVideoGameData(data, comparator) {
    // TODO: sort and return the given data with the comparator (extracting the desired number of examples)
    return data.sort(comparator);
}

// On page load, render the barplot with the artist data
setVideoGameBarData(true);
setVideoGamePieData("NA_Sales");
