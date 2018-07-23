let map;
let lineSizes = {
  small: 5,
  medium: 10,
  large: 15
};

let mapEl = document.getElementById("mapObject");
if(mapEl){
  app.createSessionObject(revenueMapDef).then(objModel=>{
    initMap(objModel);
    objModel.addListener('changed', response=>{
      renderRevenueMap(objModel);
    })
  });
}

function initMap(model){
  let mapEl = document.getElementById("mapObject");
  let width = mapEl.clientWidth;
  let height = mapEl.clientHeight;
  if(mapEl){
    map = L.map('mapObject').setView([51.505, -0.09], 2);
    map.on("viewreset", renderRevenueMap(model));
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        minZoom: 2,
        id: 'arperyan.2jkd6mad',
        accessToken: 'pk.eyJ1IjoiYXJwZXJ5YW4iLCJhIjoiY2l4cTJkc2t6MDAzcjJxcG9maWp1ZmFjMCJ9.XT957ywrTABjNFqGdp_37g'
    }).addTo(map);

    let svg = d3.select(map.getPanes().overlayPane)
                .append("svg")
                .attr("width", width)
                .attr("height", height);
    let g = svg.append("g").attr("class", "leaflet-zoom-hide");
    renderRevenueMap(model);
  }
}

function renderRevenueMap(model){
  drawingRevenueMap = true;
  let mapEl = document.getElementById("mapObject");
  if(mapEl){
    let toLine = d3.line()
        .x(function(d) {
          return applyLatLngToLayer(d).x
        })
        .y(function(d) {
          return applyLatLngToLayer(d).y
        })
        .curve(d3.curveCatmullRom.alpha(0.5))

    let diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.x, d.y]; });

    let transform = d3.geo.transform({
        point: projectPoint
    });
    let d3path = d3.geo.path().projection(transform);

    function projectPoint(x, y) {
      let point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

    function applyLatLngToLayer(d) {
      var y = d.geometry.coordinates[1]
      var x = d.geometry.coordinates[0]
      return map.latLngToLayerPoint(new L.LatLng(y, x));
    }


    model.getLayout().then(layout=>{
      console.log(layout);
      //create a list of available/selected Managing Region Codes
      let managingRegionCode = layout.managingRegionCode.qListObject.qDataPages[0].qMatrix;
      let availableRegions = [];
      for (var i = 0; i < managingRegionCode.length; i++) {
        if(managingRegionCode[i][0].qState=="S" || managingRegionCode[i][0].qState=="O"){
          availableRegions.push(managingRegionCode[i][0].qText);
        }
      }

      //set the YonY% var
      YonYPercVar = layout.yearOnYearVariance;
      if(layout.qHyperCube.qDataPages[0]){
        let mapData = {
          rings: [],
          midPoints: [],
          paths: []
        }
        let maxInRegionRevenue = layout.qHyperCube.qMeasureInfo[0].qMax;
        let minInRegionRevenue = layout.qHyperCube.qMeasureInfo[0].qMin;
        let matrix = layout.qHyperCube.qDataPages[0].qMatrix;
        let processedRings = [];
        for (let i = 0; i < matrix.length; i++) {
          if(processedRings.indexOf(matrix[i][0].qText)===-1){
            if(matrix[i][2].qText===(matrix[i][0].qText+"-"+matrix[i][0].qText)){
              mapData.rings.push({
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": regionCoordinates[matrix[i][0].qText].regionPoint
                },
                "properties": {
                  "region": matrix[i][0].qText,
                  "path": matrix[i][2].qText,
                  "value": matrix[i][4].qNum,
                  "inHyperCube": true,
                  "size": calcRingSize(matrix[i][4].qNum, minInRegionRevenue, maxInRegionRevenue)
                }
              });
              processedRings.push(matrix[i][0].qText);
            }
          }
          if(regionCoordinates[matrix[i][0].qText].paths[matrix[i][2].qText]){
            mapData.midPoints.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": regionCoordinates[matrix[i][0].qText].paths[matrix[i][2].qText].midPoint
              },
              "properties": {
                "name": matrix[i][0].qText,
                "show": (availableRegions.indexOf(matrix[i][1].qText)!==-1),
                "path": matrix[i][2].qText
              }
            });


            let outPaths = [];
            for (let p = 0; p < regionCoordinates[matrix[i][0].qText].paths[matrix[i][2].qText].out.length; p++) {
              outPaths.push({
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": regionCoordinates[matrix[i][0].qText].paths[matrix[i][2].qText].out[p]
                },
                "properties": {
                  "name": matrix[i][0].qText,
                  "path": matrix[i][2].qText,
                  "YonYPerc": matrix[i][4].qNum
                }
              });
            }
            if(availableRegions.indexOf(matrix[i][1].qText)===-1){
              for (let p = 0; p < regionCoordinates[matrix[i][0].qText].paths[matrix[i][2].qText].in.length; p++) {
                outPaths.push({
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": regionCoordinates[matrix[i][0].qText].paths[matrix[i][2].qText].in[p]
                  },
                  "properties": {
                    "name": matrix[i][0].qText,
                    "path": matrix[i][2].qText,
                    "YonYPerc": matrix[i][4].qNum
                  }
                });
              }
            }
            mapData.paths.push(outPaths);
          }
        }

        for (let key in regionCoordinates){
          if(processedRings.indexOf(key)===-1){
            mapData.rings.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": regionCoordinates[key].regionPoint
              },
              "properties": {
                "region": key,
                "size": calcRingSize(0, minInRegionRevenue, maxInRegionRevenue)
              }
            });
          }
        }

       let g = d3.select(".leaflet-zoom-hide");
       g.selectAll("*").remove();

       let linePath = g.selectAll("path")
          .data(mapData.paths)
          .enter()
          .append("path")
          .attr("id", function(d, i){ return "path"+i})
          .attr("d", toLine)
          .attr("stroke-width", function(d){
            if(d[0].properties["YonYPerc"] >= YonYPercVar){
              return lineSizes.large;
            }
            else {
              return lineSizes.small;
            }
          })
          .attr("class", function(d){
            let classList = [];
            if(d[0].properties["YonYPerc"] >= YonYPercVar){
              classList.push("green-glass-stroke");
            }
            else {
              classList.push("red-glass-stroke");
            }
            return classList.join(" ");
          })
          .attr("fill", "none")
          .style("pointer-events","all")
          .on("mouseover", function(d){
            let loc = d3.mouse(this);
            showLinePopup(loc, d[0].properties);
          })
          .on("mousemove", function(d){
            let loc = d3.mouse(this);
            showLinePopup(loc);
          })
          .on("mouseout", function(d){
            closePopup();
          })

      let rings = g.selectAll(".map-ring")
          .data(mapData.rings)
          .enter()
          .append("circle")
          .attr("class", function(d){
            let classList = [];
            if(d.properties.inHyperCube){
              if(d.properties.value > 0){
                classList.push("green-glass-fill");
              }
              else {
                classList.push("red-glass-fill");
              }
            }
            else {
              classList.push("light-grey-fill");
            }
            return classList.join(" ");
          })
          .attr("r", function(d){
            if(d.properties.inHyperCube){
              return d.properties.size
            }
            else {
              return 1;
            }
          })
          .attr("z-index", 10)

      let points = g.selectAll(".map-point")
          .data(mapData.rings)
          .enter()
          .append("circle")
          .attr("fill", "white")
          .attr("stroke-width", function(d){
            if(d.properties.inHyperCube){
              return d.properties.size
            }
            else {
              return 1;
            }
          })
          .attr("z-index", 15)
          .attr("r", 30)

      let midPoints = g.selectAll(".map-mid-point")
          .data(mapData.midPoints)
          .enter()
          .append("circle")
          .attr("class", "map-mid-point")
          .attr("stroke-width", "1")
          .attr("z-index", 10)
          .attr("r", function(d){
            if(d.properties.show){
              if(d.properties["YonYPerc"] >= YonYPercVar){
                return lineSizes.large + 3;
              }
              else {
                return lineSizes.small + 3;
              }
            }
            else {
              return 0;
            }
          });

      let text = g.selectAll("text")
          .data(mapData.rings)
          .enter()
          .append("text")
          .text(function(d) {
            return d.properties.region
          })
          .attr("class", "map-text")
          .attr("z-index", 20)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "central")
          .on("mouseover", function(d){
            let loc = applyLatLngToLayer(d);
            showPointPopup(loc, d.properties);
          })
          .on("mouseout", function(d){
            closePopup();
          })

      points.attr("transform", function(d) {
        return "translate(" +
              applyLatLngToLayer(d).x + "," +
              applyLatLngToLayer(d).y + ")";
      });
      rings.attr("transform", function(d) {
        return "translate(" +
              applyLatLngToLayer(d).x + "," +
              applyLatLngToLayer(d).y + ")";
      });
      midPoints.attr("transform", function(d) {
        return "translate(" +
              applyLatLngToLayer(d).x + "," +
              applyLatLngToLayer(d).y + ")";
      });
      text.attr("transform", function(d) {
        return "translate(" +
              applyLatLngToLayer(d).x + "," +
              applyLatLngToLayer(d).y + ")";
      });
      drawingRevenueMap = false;

      }



    })
  };
}

function calcRingSize(input, min, max){
  console.log('logging size input');
  console.log(Math.abs(input));
  if(Math.abs(input) > 100){
    return 54;
  }
  else if(Math.abs(input) > 50){
    return 47;
  }
  else {
    return 40;
  }
}
