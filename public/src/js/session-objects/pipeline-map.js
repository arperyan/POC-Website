let pipelineMapEl = document.getElementById('pipelineMap');
if(pipelineMapEl){
  app.createSessionObject(pipelineMapDef).then(objModel=>{
    renderPipelineMap(objModel);
    objModel.addListener('changed', response=>{
      renderPipelineMap(objModel);
    })
  });
}

function renderPipelineMap(objModel){
  objModel.getLayout().then(layout=>{
    let amImages = [];
    let processedRegions = {};
    let matrix = layout.qHyperCube.qDataPages[0].qMatrix;
    for (var r = 0; r < matrix.length; r++) {
      if(!processedRegions[matrix[r][0].qText]){
        processedRegions[matrix[r][0].qText] = {
          data: []
        };
      }
      processedRegions[matrix[r][0].qText].data.push({
        dim: matrix[r][1].qText,
        exp: matrix[r][2].qNum
      })
    }
    for(let key in processedRegions){
      let loc = regionCoordinates[key].regionPoint;
      amImages.push({
        title: key,
        latitude: loc[1],
        longitude: loc[0],
        "width": 200,
        "height": 200,
        pie:{
          type: "pie",
          "pullOutRadius": 0,
          "labelRadius": 0,
          "innerRadius": "70%",
          "radius": "20%",
          "outlineAlpha": 1,
          "outlineColor": "#ffffff",
          "outlineThickness": 1,
          "valueField": "exp",
          "titleField": "dim",
          "colors": [
            "#547DA7",
            "#49B4DD",
            "#002951"
          ],
          dataProvider: processedRegions[key].data
        }
      });
    }
    console.log(JSON.stringify(amImages));
    AmCharts.makeChart("pipelineMap", {
      "type": "map",
      "theme": "none",
      "projection": "winkel3",
      "dataProvider": {
        "map": "continentsLow",
        "images": amImages
      },
      "listeners": [{
        "event": "positionChanged",
        "method": updateCustomMarkers
      }]
    });
  });
}

function updateCustomMarkers(event) {
  // get map object
  var map = event.chart;

  // go through all of the images
  for (var x = 0; x < map.dataProvider.images.length; x++) {

    // get MapImage object
    var image = map.dataProvider.images[x];

    // Is it a Pie?
    if (image.pie === undefined) {
      continue;
    }

    // create id
    if (image.id === undefined) {
      image.id = "amcharts_pie_" + x;
    }
    // Add theme
    if ("undefined" == typeof image.pie.theme) {
      image.pie.theme = map.theme;
    }


    // check if it has corresponding HTML element
    if ("undefined" == typeof image.externalElement) {
      image.externalElement = createCustomMarker(image, xy);
    }

    // reposition the element accoridng to coordinates
    var xy = map.coordinatesToStageXY(image.longitude, image.latitude);
    image.externalElement.style.top = xy.y + "px";
    image.externalElement.style.left = xy.x + "px";
    image.externalElement.style.marginTop = Math.round(image.height / -2) + "px";
    image.externalElement.style.marginLeft = Math.round(image.width / -2) + "px";
  }
}

/**
 * Creates a custom map marker - a div for container and a
 * pie chart in it
 */
function createCustomMarker(image, loc) {
  console.log(image);
  // Create chart container
  var holder = document.createElement("div");
  holder.id = image.id;
  holder.title = image.title;
  holder.style.position = "absolute";
  holder.style.width = image.width + "px";
  holder.style.height = image.height + "px";

  // Append the chart container to the map container
  image.chart.chartDiv.appendChild(holder);

  // Create a pie chart
  var chart = AmCharts.makeChart(image.id, image.pie);
  chart.addLabel(0,image.height/2-8, image.title,"center", "14", "black", 0, 1, true);

  return holder;
}
