//#region HELPER FUNCTIONS
// Fn for linearScaling
const linearScale = function(data, property, axis, dimensions, multiplier) {
  
  if(!multiplier) {
    multiplier = {};
    multiplier.lBound = 1; 
    multiplier.uBound = 1;
  }

  let min = d3.min(data, d => parseInt(d[property])) * multiplier.lBound;
  let max = d3.max(data, d => parseInt(d[property])) * multiplier.uBound;

  switch (axis)
  {
    case "x":
      range = [0, dimensions.width];
      break;
    case "y":
      range = [dimensions.height, 0];
      break;
  }
  
  return d3.scaleLinear()
    .domain([min, max])
    .range(range);
}

// Fn Toggle Label Classes
const toggleLabel = function(labelGroup, element) {
  d3.select(labelGroup).selectAll("text.aText")
      .classed("active", false)
      .classed("inactive", true);

  element.classed("inactive", false).classed("active", true)
}

// Fn Update Tooltip
const updateTooltip = function(tooltip) {
  let xLabel = d3.select("#axis-x-labels").select(".active").attr("data-name");
  let yLabel = d3.select("#axis-y-labels").select(".active").attr("data-name");
  tooltip.html((d) => {return `${d.state}<br>${yLabel}: ${d[yLabel]}<br>${xLabel}: ${d[xLabel]}`});
}

//#endregion

// CHART CODE
// Define chart canvas
const svgWidth = parseInt(d3.select("#scatter").style("width"));
const svgHeight = svgWidth - svgWidth / 3.9;

// Define canvas margins
const margin = {
    top: 25,
    bottom: 120,
    right: 25,
    left: 120
  };

// Define chart width and height
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Render SVG element to DOM
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

// Render chart group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read csv data
d3.csv("assets/data/data.csv").then(function(data) {
  
  // Convert each record string values to decimals
  data.forEach(record => {
    record.poverty = parseFloat(record.poverty);
    record.healthcare = parseFloat(record.healthcare);
  });

  // Axes / Scales
  const multiplier = {lBound: 0.9, uBound: 1.1};
  const chartDimensions = {height: height, width: width, margin: margin};
  
  const xLinearScale = linearScale(data, "poverty", "x", chartDimensions, multiplier);
  const yLinearScale = linearScale(data, "healthcare", "y", chartDimensions, multiplier);

  const xAxis = d3.axisBottom(xLinearScale);
  const yAxis = d3.axisLeft(yLinearScale);

  // Render axes to chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("id", "axis-x")
    .call(xAxis);

  chartGroup.append("g")
    .attr("id", "axis-y")
    .call(yAxis);

  // Axis Labels
  const axesLabels = {
    xAxis: ["poverty","age","income"],
    yAxis: ["healthcare","smokes","obesity"]
  };

  const labelPadding = 50;
  
  // y-axis labels
  const yAxisLabelGroup = chartGroup.append("g").attr("id", "axis-y-labels");
  yAxisLabelGroup.append("text")
    .attr("transform", `translate(${0 - margin.left + labelPadding}, ${height / 2})rotate(-90)`)
    .attr("y", 25)
    .attr("data-name", "healthcare")
    .classed("aText active", true)
    .text("Lacks Healthcare (%)");

  yAxisLabelGroup.append("text")
    .attr("transform", `translate(${0 - margin.left + labelPadding}, ${height / 2})rotate(-90)`)
    .attr("y", 0)
    .attr("data-name", "smokes")
    .classed("aText inactive", true)
    .text("Smokes (%)");
  
  yAxisLabelGroup.append("text")
    .attr("transform", `translate(${0 - margin.left + labelPadding}, ${height / 2})rotate(-90)`)
    .attr("y", -25)
    .attr("data-name", "obesity")
    .classed("aText inactive", true)
    .text("Obese (%)");

  // x-axis labels
  const xAxisLabelGroup = chartGroup.append("g").attr("id", "axis-x-labels");
  xAxisLabelGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom - labelPadding})`)
    .attr("y", -25)
    .attr("data-name", "poverty")
    .classed("aText active", true)
    .text("In Poverty (%)");
    
  xAxisLabelGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom - labelPadding})`)
    .attr("y", 0)
    .attr("data-name", "age")
    .classed("aText inactive", true)
    .text("Age (Median)");

  xAxisLabelGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom - labelPadding})`)
    .attr("y", 25)
    .attr("data-name", "income")
    .classed("aText inactive", true)
    .text("Household Income (Median)");
    
  // Tooltip
  const tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([45, -60])
    .html(function(d) {return `${d.state}<br>healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`});
  chartGroup.call(tooltip);
    
  // Render markers
  const circlesGroup = chartGroup.selectAll("circle")
  .data(data)
  .enter()
  .append("g")
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide);

  // Circle Markers
  circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .classed("stateCircle", true);


  // Circle Text
  circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy", ".4em")
    .attr("font-size", ".5em")
    .classed("stateText", true);

  
  // Event Listeners
  d3.selectAll(".aText").on("click", function() {

    let element = d3.select(this);
    let name = element.attr("data-name");

    if(axesLabels["yAxis"].includes(name)) {

      toggleLabel("#axis-y-labels", element);
      
      // Update axis scale
      yLinearScale.domain([d3.min(data, d => parseInt(d[name])) * 0.9, d3.max(data, d => parseInt(d[name])) * 1.1]);
      chartGroup.select("#axis-y")
        .transition()
        .duration(300)
        .call(yAxis);
  
      // Update location of circles on y-axis
      d3.selectAll("circle").each(function() { 
        d3.select(this).transition().attr("cy", d => yLinearScale(d[name])).duration(300);
      });
  
      d3.selectAll(".stateText").each(function() {
        d3.select(this).transition().attr("y", d => yLinearScale(d[name])).duration(300);
      });

      // Update Tooltip
      d3.selectAll(".d3-tip").each(() => updateTooltip(tooltip));
    }

    if(axesLabels["xAxis"].includes(name)) {

      toggleLabel("#axis-x-labels", element);
      
      // Update axis scale
      xLinearScale.domain([d3.min(data, d => parseInt(d[name])) * 0.9, d3.max(data, d => parseInt(d[name])) * 1.1]);
      chartGroup.select("#axis-x")
        .transition()
        .duration(300)
        .call(xAxis);
  
      // Update location of circles on x-axis
      d3.selectAll("circle").each(function() { 
        d3.select(this).transition().attr("cx", d => xLinearScale(d[name])).duration(300);
      });
  
      d3.selectAll(".stateText").each(function() {
        d3.select(this).transition().attr("x", d => xLinearScale(d[name])).duration(300);
      });

      // Update Tooltip
      d3.selectAll(".d3-tip").each(() => updateTooltip(tooltip));
    }
  });
});

