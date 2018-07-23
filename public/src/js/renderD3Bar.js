//An example function that takes Qlik data and renders it as a D3 bar chart in the supplied HTML element
function renderD3BarChart(elementId, layout, model){
  let el = document.getElementById(elementId);
  let selections = [];
  if(el){
    el.innerHTML = "";
    let data = [];
    if(layout.qHyperCube.qDataPages[0]){
      data = layout.qHyperCube.qDataPages[0].qMatrix;
    }
    //figure out how much space we need for the x-axis labels if they're rotated 45 degrees
    let approxMaxGlyphCount = layout.qHyperCube.qDimensionInfo[0].qApprMaxGlyphCount;
    let horizontalLabelWidth = approxMaxGlyphCount*10;
    //on a triangle our rotated label would be the hypotenuse, the opposite angle is 90 and the 2 remainaing angles are 45
    let adjOpp = ((horizontalLabelWidth)/Math.sin(90*(Math.PI/180))*Math.sin(45*(Math.PI/180)));
    //we can use adjOpp to calculate the rough size we need for our x-axis
    let margins = {top: 20, right: 20, bottom: Math.max(30,adjOpp), left: 40};
    //set the width and height of the actual barchart area by allowing space for the margins
    let width = el.clientWidth - margins.left - margins.right;
    let height = el.clientHeight - margins.top - margins.bottom;
    //build the scales and axes using the d3 built in functions
    let xScale = d3.scale.ordinal();
    let yScale = d3.scale.linear()
                         .range([height, 0]);
    let xAxis = d3.svg.axis()
     	                .scale(xScale)
     	                .orient("bottom");
    let yAxis = d3.svg.axis()
     	                .scale(yScale)
     	                .orient("left")
     	                .ticks(10);
    let svg = d3.select("#" + elementId)
                .append("svg")
	              .attr("width", width + margins.left + margins.right)
	              .attr("height", height + margins.top + margins.bottom);
    xScale.rangeRoundBands([0, width], .1);
    var barPlot = svg.append("g")
                     .attr("class", "bar-chart")
	                   .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

    //setup the x axis
  	xScale.domain(data.map(function(d) {
      return d[0].qText;
    }));
    barPlot.append("g")
	      .attr("class", "axis x-axis dark-grey")
        .attr("y", 0)
        .attr("x", 0)
        .attr("font-size", "10px")
	      .attr("transform", "translate(0," + height + margins.top + ")")
	      .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45) translate(-10,0)")
        .style("text-anchor", "end");
    //setup the y axis
  	yScale.domain([0, d3.max(data, function(d) {
      return d[1].qNum;
    })]);
    barPlot.append("g")
      .attr("class", "y-axis axis dark-grey")
      .attr("font-size", "10px")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
    //build the bars
    barPlot.selectAll(".bar")
	         .data(data)
	         .enter().append("rect")
	         .attr("class", "bar blue-fill")
           .attr("id", (d)=>{
             return "data_"+d[0].qElemNumber
           })
	         .attr("x", (d)=>{
             return xScale(d[0].qText);
           })
	         .attr("width", xScale.rangeBand())
	         .attr("y", (d)=>{
             return yScale(d[1].qNum);
           })
	         .attr("height", (d)=>{
             return height - yScale(d[1].qNum);
           })
           .on("click", (d)=>{
             //on click we use the selectHyperCubeValues function
             //on the object model to toggle a selection, using the qElemNumber property
             let id = +d[0].qElemNumber;
             model.selectHyperCubeValues("/qHyperCubeDef", 0, [id], true);
           })
           .on("mouseover", (d)=>{
             //on mouse over we add the 'highlight' class the bar in question and show a popup with some extra info
             let id = d[0].qElemNumber;
             let barEl = document.getElementById("data_"+id);
             if(barEl){
               barEl.classList.add("highlight");
               showPopup(event.clientY, event.clientX, d);
             }
           })
           .on("mouseout", (d)=>{
             //remove the 'highlight' class and close the popup
             let id = d[0].qElemNumber;
             let barEl = document.getElementById("data_"+id);
             if(barEl){
               barEl.classList.remove("highlight");
               closePopup();
             }
           })
     //setup the d3 lasso
     let lasso = d3.lasso()
                 .items(barPlot.selectAll(".bar"))
                 .area(d3.select("#"+elementId))
                 .on("start", ()=>{
                   selections = [];
                 })
                 .on("draw", ()=>{
                   //while the lasso is drawing we add the 'highlight' class to any bars
                   //that are in the lasso path
                   lasso.items().filter((d)=>{
                     return d.possible===true;
                   }).classed({"highlight":true})
                 }).
                 on("end", ()=>{
                   //once the lasso is finished we gather the qElemNumber for
                   //all selected bars
                   lasso.items().filter((d)=>{
                     if(d.selected===true){
                       selections.push(d[0].qElemNumber);
                     }
                   });
                   model.selectHyperCubeValues("/qHyperCubeDef", 0, selections, true);
                 })
     svg.call(lasso);
  }
  else {
    console.error(`No element with id '${elementId}' found`);
  }
}
