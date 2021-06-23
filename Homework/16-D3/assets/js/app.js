//#region HELPER FUNCTIONS
// Fn for linearScaling
const linearScale = function(data, property, axis, dimensions, multiplier) {
  
  if(!multiplier) {
    multiplier = {};
    multiplier.lBound = 1; 
    multiplier.uBound = 1;
  }

  let min = d3.min(data, d => d[property]) * multiplier.lBound;
  let max = d3.max(data, d => d[property]) * multiplier.uBound;
  
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
};
//#endregion

// CHART CODE

// Define chart canvas
const svgWidth = parseInt(d3.select("#scatter").style("width"));
const svgHeight = svgWidth - svgWidth / 3.9;

console.log(svgWidth);
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
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  // Axis Labels
  const labelPadding = 60;

  // y-axis label
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + labelPadding)
    .attr("x", 0 - (height / 2))
    .classed("aText active", true)
    .text("Lacks Healthcare (%)");

  // x-axis label
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom - labelPadding})`)
    .classed("aText active", true)
    .text("In Poverty (%)");
    
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

});