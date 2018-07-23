function showPopup(x, y, html){
  if(html){
    d3.select(".leaflet-zoom-hide")
      .append("foreignObject")
      .attr("transform", function(d) {
        return "translate(" + (x + 10) + "," + (y + 10) + ")";
      })
      .attr("width", 100)
      .attr("height", 100)
      .append("xhtml:div")
      .attr("id", "balloonPopup")
      .attr("class", "balloon-popup")
    let popupEl = document.getElementById('balloonPopup');
    if(popupEl){
      popupEl.innerHTML = html;
      popupShowing = true;
    }
  }
  else {
    d3.select("foreignObject")
      .attr("transform", function(d) {
        return "translate(" + (x + 10) + "," + (y + 10) + ")";
      })
  }

}

function closePopup(){
  d3.selectAll("foreignObject").remove();
  popupShowing = false;  
}

function toggleFilterPopup(){
  $(".filter-popup").toggle();
}
