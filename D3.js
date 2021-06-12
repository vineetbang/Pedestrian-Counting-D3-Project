// set the dimensions and margins of the graph
var margin = {top: 60, right: 160, bottom: 60, left: 120},
    width = 1250 - margin.left - margin.right,
    height = 570 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/DhansYTB/Dhans/main/PedestrianCountingSystemWeekdaysAndWeekends.csv", function(data) {

  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.Day;})
    .entries(data);

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return +d.TimeOfDay; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(20));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return +d.HourlyAverage; })])
    .range([ height, 45 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  var res = sumstat.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(['#e41a1c','#377eb8'])

  // Draw the line
  svg.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 2.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(+d.TimeOfDay); })
            .y(function(d) { return y(+d.HourlyAverage); })
            (d.values)
        })
        
        
    var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    
    var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html("Type of Day: " + d.Day + "<br>Hour: " + d.TimeOfDay + "<br>Average Pedestrian Count:" + d.HourlyAverage)
      .style("left", (d3.mouse(this)[0]+90) + "px") 
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }
  
  
        
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(+d.TimeOfDay) } )
        .attr("cy", function(d) { return y(+d.HourlyAverage) } )
        .attr("r", 5)
        .attr("fill", "green")
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave )
        
        
  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Pedestrian counts during weekdays fluctuate at peak hours, whereas counts during weekends grow and shrink steadily throughout the day.");
        
  svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top - 60))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Value vs Date Graph");
        
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width-280)
    .attr("y", height + 35)
    .text("TimeOfDay");
    
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 0 - 60)
    .attr("x", 0 - (height / 3))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .text("HourlyAverage");
    
    
})

