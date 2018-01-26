var regionCoordinates = {
  ASP:{
    regionPoint: [120.94317,15.987208],
    paths: {
      "ASP-EUR":{
        midPoint: [64.662398,48.562640],
        out: [[120.943170,15.987208],[64.662398,48.562640]],
        in: []
      },
      "ASP-LAM":{
        midPoint: [40.936415,-15.513723],
        out: [[120.943170,15.987208],[80.936415,-5.513723],[40.936415,-15.513723]],
        in: []
      },
      "ASP-MENA":{
        midPoint: [80.941694,25.063783],
        out: [[120.943170,15.987208],[90.941694,24.063783],[80.941694,25.063783]],
        in: []
      },
      "ASP-NAM":{
        midPoint: [1.155783,74.119756],
        out: [[120.943170,15.987208],[82.0528573,64.0166502],[1.155783,74.119756]],
        in: []
      }
    }
  },
  EUR:{
    regionPoint: [2.345152,52.177705],
    paths: {
      "EUR-ASP":{
        midPoint: [64.662398,48.562640],
        out: [[2.345152,52.177705],[34.662398,54.562640],[64.662398,48.562640]],
        in: []
      },
      "EUR-LAM":{
        midPoint: [-12.105469,19.261369],
        out: [[2.345152,52.177705],[-6.105469,29.261369],[-12.105469,19.261369]],
        in: []
      },
      "EUR-MENA":{
        midPoint: [23.006728,35.636858],
        out: [[2.345152,52.177705],[23.006728,35.636858]],
        in: []
      },
      "EUR-NAM":{
        midPoint: [-46.255571,60.562640],
        out: [[2.345152,52.177705],[-25.255571,59.562640],[-46.255571,60.562640]],
        in: []
      }
    }
  },
  LAM:{
    regionPoint: [-56.148902,-13.860389],
    paths: {
      "LAM-ASP":{
        midPoint: [40.936415,-15.513723],
        out: [[-56.148902,-13.860389],[40.936415,-15.513723]],
        in: []
      },
      "LAM-EUR":{
        midPoint: [-12.105469,19.261369],
        out: [[-56.148902,-13.860389],[-26.105469,4.261369],[-12.105469,19.261369]],
        in: []
      },
      "LAM-MENA":{
        midPoint: [10.350478,6.078604],
        out: [[-56.148902,-13.860389],[10.350478,6.078604]],
        in: []
      },
      "LAM-NAM":{
        midPoint: [-96.749009,15.551852],
        out: [[-56.148902,-13.860389],[-80.749009,-1.551852],[-96.749009,15.551852]],
        in: []
      }
    }
  },
  MENA:{
    regionPoint: [43.854548,24.063783],
    paths: {
      "MENA-ASP":{
        midPoint: [80.941694,25.063783],
        out: [[43.854548,24.063783],[80.941694,25.063783]],
        in: []
      },
      "MENA-EUR":{
        midPoint: [23.006728,35.636858],
        out: [[43.854548,24.063783],[23.006728,35.636858]],
        in: []
      },
      "MENA-LAM":{
        midPoint: [10.350478,6.078604],
        out: [[43.854548,24.063783],[10.350478,6.078604]],
        in: []
      },
      "MENA-NAM":{
        midPoint: [-40.695409,24.622568],
        out: [[43.854548,24.063783],[-40.695409,24.622568]],
        in: []
      }
    }
  },
  NAM:{
    regionPoint: [-109.242373,49.399894],
    paths: {
      "NAM-ASP":{
        midPoint: [1.155783,74.119756],
        out: [[-109.242373,49.399894],[-59.5485884,69.6656805],[1.155783,74.119756]],
        in: [[82.0528573,64.0166502],[120.943170,15.987208]]
      },
      "NAM-EUR":{
        midPoint: [-46.255571,60.562640],
        out: [[-109.242373,49.399894],[-76.255571,59.562640],[-46.255571,60.562640]],
        in: [[-25.255571,59.562640],[2.345152,52.177705]]
      },
      "NAM-LAM":{
        midPoint: [-96.749009,15.551852],
        out: [[-109.242373,49.399894],[-96.749009,15.551852]],
        in: [[-80.749009,-1.551852],[-56.148902,-13.860389]]
      },
      "NAM-MENA":{
        midPoint: [-40.695409,24.622568],
        out: [[-109.242373,49.399894],[-80.695409,34.622568],[-40.695409,24.622568]],
        in: [[43.854548,24.063783]]
      }
    }
  }
}


//Define the config for connecting to the Qlik Sense Instance
let enigmaConfig = {
  schema: enigmaSchema,
  session: {
    host: "localhost",
    port: 4848,
    prefix: "",
    unsecure: true
  }
};

let YonYPercVar;
let globalApp;
let layouts = [];
let drawingRevenueMap = false, updatingVariables = false;
let popupModel;
let popupShowing = false;
let filterModel;

//Use the 'enigma' global variable to connect, using the 'getService' method.
//The service we're connting to is 'qix' (Qlik Indexing Engine) or in API terms, the Engine API
enigma.getService("qix", enigmaConfig).then(qlik=>{
  //Once we're connected we need to open an app, to do this we need the GUID of the app.
  return qlik.global.openApp("TBI_POC_DummyDataModel.qvf")
}).then(app=>{
  //no we can work with the app
  //store the app into the global variable so it's accessible by other functions outside of this scope
  globalApp = app;

  //create the revenue KPIs generic object definition
  var revenueKPIsDef = {
    qInfo: {
      qType: "HeaderKPIs"
    },
    YTDRevenue: {
      value: {
        qStringExpression: "Num(Sum({$<Year={2016}>}#Revenue),'£#,##0')"
      },
      label: {
        qStringExpression: "='YEAR TO DATE REVENUE ($k)'"
      }
    },
    PriorYearRevenue: {
      value: {
        qStringExpression: "Num(Sum({$<Year={2015}>}#Revenue),'£#,##0')"
      },
      label: {
        qStringExpression: "='PRIOR YEAR REVENUE ($k)'"
      }
    },
    YearOnYearRevenue: {
      value: {
        qStringExpression: "Num((Sum({$<Year={2016}>}#Revenue)-Sum({$<Year={2015}>}#Revenue)) / Sum({$<Year={2015}>}#Revenue),'#,##0%')"
      },
      label: {
        qStringExpression: "='YEAR ON YEAR VARIATION'"
      }
    }
  }

  //create the revenue KPIs session object and listen for changes
  app.createSessionObject(revenueKPIsDef).then(objModel=>{
    renderRevenueKPIs(objModel);
    objModel.addListener('changed', response=>{
      renderRevenueKPIs(objModel);
    })
  });

  function renderRevenueKPIs(model){
    model.getLayout().then(layout=>{
      console.log(layout);
      let yearToDateHTML = `
        <span class="header-kpi-label">${layout.YTDRevenue.label}</span>
        <span class="header-kpi-value">${layout.YTDRevenue.value}</span>
      `;
      let priorYearHTML = `
        <span class="header-kpi-label">${layout.PriorYearRevenue.label}</span>
        <span class="header-kpi-value">${layout.PriorYearRevenue.value}</span>
      `;
      let yearOnYearHTML = `
        <span class="header-kpi-label">${layout.YearOnYearRevenue.label}</span>
        <span class="header-kpi-value">${layout.YearOnYearRevenue.value}</span>
      `;
      let ytdKPIEl = document.getElementById("ytd_kpi");
      if(ytdKPIEl){
        ytdKPIEl.innerHTML = yearToDateHTML;
      }
      let pyrKPIEl = document.getElementById("pyr_kpi");
      if(pyrKPIEl){
        pyrKPIEl.innerHTML = priorYearHTML;
      }
      let yonyKPIEl = document.getElementById("yony_kpi");
      if(yonyKPIEl){
        yonyKPIEl.innerHTML = yearOnYearHTML;
      }
    });
  }


  //create the revenue map generic object definition
  var revenueMapDef = {
    qInfo: {
      qType: "RevenueMap"
    },
    yearOnYearVariance:{
      qValueExpression: "vYonY%Var"
    },
    managingRegionCode:{
      qListObjectDef: {
        qDef: {
          qFieldDefs: ["Managing Region Code"]
        },
        qInitialDataFetch: [
          {
            qTop: 0,
            qLeft: 0,
            qWidth: 1,
            qHeight: 50
          }
        ]
      }
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["Managing Region Code"]
          },
          qNullSuppression: true
        },
        {
          qDef: {
            qFieldDefs: ["Booking Region Code"]
          },
          qNullSuppression: true
        },
        {
          qDef: {
            qFieldDefs: ["Region Code Path"]
          },
          qNullSuppression: true
        }
      ],
      qMeasures: [
        {
          qDef: {
            qDef: "Sum({$<Year={2016}>}#Revenue * [%Flag_InRegion])"
          }
        },
        {
          qDef: {
            qDef: "(Sum({$<Year={2016}>}#Revenue)-Sum({$<Year={2015}>}#Revenue)) / Sum({$<Year={2015}>}#Revenue)*100"
          }
        }
      ],
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qWidth: 5,
          qHeight: 50
        }
      ]
    }
  }

  //create the revenue map session object and listen for changes
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


  //create the revenue midpoint hover generic object definition
  let midPointHoverDef = {
    qInfo: {
      qType: "hoverPopup"
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["Region Code Path"]
          }
        }
      ],
      qMeasures: [
        {
          qDef: {
            qLabel: "Current Year",
            qDef: "Sum({$<Year={2016}, [Region Code Path]={'^^path^^'}>}#Revenue)"
          }
        },
        {
          qDef: {
            qLabel: "Previous Year",
            qDef: "Sum({$<Year={2015}, [Region Code Path]={'^^path^^'}>}#Revenue)"
          }
        },
        {
          qDef: {
            qLabel: "Year on Year(%)",
            qDef: "(Sum({$<Year={2016}, [Region Code Path]={'^^path^^'}>}#Revenue)-Sum({$<Year={2015},[Region Code Path]={'^^path^^'}>}#Revenue)) / Sum({$<Year={2015}, [Region Code Path]={'^^path^^'}>}#Revenue)*100"
          }
        }
      ],
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qWidth: 4,
          qHeight: 100
        }
      ]
    }
  }

  //create the revenue midpoint hover session object
  function showMidPointPopup(location, info){
      if(!popupShowing){
        //add the set analysis into the hypercube def
        let def = JSON.stringify(midPointHoverDef).replace(/\^\^path\^\^/gim, info.path);
        def = JSON.parse(def);
        globalApp.createSessionObject(def).then(objModel=>{
          popupModel = objModel;
          objModel.getLayout().then(layout=>{
            let row = layout.qHyperCube.qDataPages[0].qMatrix[0];
            let measureHeaders = layout.qHyperCube.qMeasureInfo;
            console.log(layout);
            let htmlString = `
              <div>
                <h3>${info.path}</h3>
                <ul class='plainlist'>
                  <li>
                    <h4>${measureHeaders[0].qFallbackTitle}</h4>
                    <span>${row[1].qText}</span>
                  </li>
                  <li>
                    <h4>${measureHeaders[1].qFallbackTitle}</h4>
                    <span>${row[2].qText}</span>
                  </li>
                  <li>
                    <h4>${measureHeaders[2].qFallbackTitle}</h4>
                    <span class='${row[3].qNum >= YonYPercVar ? 'green' : 'red'}'>${row[3].qText}</span>
                  </li>
                </ul>
              </div>
            `;
            showPopup(location.x, location.y, htmlString);
          });
        });
      }
  }


  //create the revenue line hover generic object definition
  let lineHoverDef = {
    qInfo: {
      qType: "hoverPopup"
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["Region Code Path"]
          }
        }
      ],
      qMeasures: [
        {
          qDef: {
            qLabel: "Current Year",
            qDef: "Sum({$<Year={2016}, [Region Code Path]={'^^path^^'}>}#Revenue)",
            qNumFormat: {
              qType: "M",
              qUseThou: true,
              qThou: ","
            }
          }
        },
        {
          qDef: {
            qLabel: "Previous Year",
            qDef: "Sum({$<Year={2015}, [Region Code Path]={'^^path^^'}>}#Revenue)",
            qNumFormat: {
              qType: "M",
              qUseThou: true,
              qThou: ","
            }
          }
        },
        {
          qDef: {
            qLabel: "Year on Year(%)",
            qDef: "(Sum({$<Year={2016}, [Region Code Path]={'^^path^^'}>}#Revenue)-Sum({$<Year={2015},[Region Code Path]={'^^path^^'}>}#Revenue)) / Sum({$<Year={2015}, [Region Code Path]={'^^path^^'}>}#Revenue)*100",
            qNumFormat: {
              qType: "R",
              qFmt: "#,##0.00%",
              qUseThou: true,
              qThou: ","
            }
          }
        }
      ],
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qWidth: 4,
          qHeight: 100
        }
      ]
    }
  }

  //create the revenue line hover session object
  function showLinePopup(location, info){
      if(!popupShowing && info){
        //add the set analysis into the hypercube def
        let def = JSON.stringify(lineHoverDef).replace(/\^\^path\^\^/gim, info.path);
        def = JSON.parse(def);
        globalApp.createSessionObject(def).then(objModel=>{
          popupModel = objModel;
          objModel.getLayout().then(layout=>{
            let row = layout.qHyperCube.qDataPages[0].qMatrix[0];
            let measureHeaders = layout.qHyperCube.qMeasureInfo;
            console.log(layout);
            let htmlString = `
              <div>
                <h3>${info.path}</h3>
                <ul class='plainlist region-summary'>
                  <li>
                    <h4>${measureHeaders[0].qFallbackTitle}</h4>
                    <span>${row[1].qText}</span>
                  </li>
                  <li>
                    <h4>${measureHeaders[1].qFallbackTitle}</h4>
                    <span>${row[2].qText}</span>
                  </li>
                  <li>
                    <h4>${measureHeaders[2].qFallbackTitle}</h4>
                    <span class='${row[3].qNum >= YonYPercVar ? 'green' : 'red'}'>${row[3].qText}</span>
                  </li>
                </ul>
              </div>
            `;
            showPopup(location[0], location[1], htmlString);
          });
        });
      }
      else if(popupShowing){
        showPopup(location[0], location[1]);
      }
  }


  //create the revenue point hover generic object definition
  let pointHoverDef = {
    qInfo: {
      qType: "hoverPopup"
    },
    Summary:{
      qHyperCubeDef: {
        qDimensions: [
          {
            qDef: {
              qFieldDefs: ["Region Code Path"]
            }
          }
        ],
        qMeasures: [
          {
            qDef: {
              qLabel: "Current Year",
              qDef: "Sum({$<Year={2016}, [Region Code Path]={'^^path^^'}>}#Revenue)",
              qNumFormat: {
                qType: "M",
                qUseThou: true,
                qThou: ","
              }
            }
          },
          {
            qDef: {
              qLabel: "Previous Year",
              qDef: "Sum({$<Year={2015}, [Region Code Path]={'^^path^^'}>}#Revenue)",
              qNumFormat: {
                qType: "M",
                qUseThou: true,
                qThou: ","
              }
            }
          },
          {
            qDef: {
              qLabel: "Year on Year(%)",
              qDef: "(Sum({$<Year={2016}, [Region Code Path]={'^^path^^'}>}#Revenue)-Sum({$<Year={2015},[Region Code Path]={'^^path^^'}>}#Revenue)) / Sum({$<Year={2015}, [Region Code Path]={'^^path^^'}>}#Revenue)*100",
              qNumFormat: {
                qType: "R",
                qFmt: "#,##0.00%",
                qUseThou: true,
                qThou: ","
              }
            }
          }
        ],
        qInitialDataFetch: [
          {
            qTop: 0,
            qLeft: 0,
            qWidth: 4,
            qHeight: 100
          }
        ]
      }
    },
    Detail:{
      qHyperCubeDef: {
        qDimensions: [
          {
            qDef: {
              qFieldDefs: ["Country Code Path"]
            }
          }
        ],
        qMeasures: [
          {
            qDef: {
              qLabel: "Current Year",
              qDef: "Sum({$<Year={2016}, [Region Code Path]={'^^path^^'}>}#Revenue*[%Flag_InCountry])",
              qNumFormat: {
                qType: "M",
                qUseThou: true,
                qThou: ","
              }
            }
          },
          {
            qDef: {
              qLabel: "Year on Year(%)",
              qDef: "(Sum({$<Year={2016}, [Region Code Path]={'^^path^^'}>}#Revenue*[%Flag_InCountry])-Sum({$<Year={2015},[Region Code Path]={'^^path^^'}>}#Revenue*[%Flag_InCountry])) / Sum({$<Year={2015}, [Region Code Path]={'^^path^^'}>}#Revenue*[%Flag_InCountry])*100",
              qNumFormat: {
                qType: "R",
                qFmt: "#,##0.00%",
                qUseThou: true,
                qThou: ","
              }
            }
          }
        ],
        qInitialDataFetch: [
          {
            qTop: 0,
            qLeft: 0,
            qWidth: 3,
            qHeight: 100
          }
        ],
        qSuppressZero: true
      }
    }

  }

  //create the revenue point hover session object
  function showPointPopup(location, info){
      if(!popupShowing){
        //add the set analysis into the hypercube def
        let def = JSON.stringify(pointHoverDef).replace(/\^\^region\^\^/gim, info.region);
        def = def.replace(/\^\^path\^\^/gim, info.path);
        def = JSON.parse(def);
        globalApp.createSessionObject(def).then(objModel=>{
          popupModel = objModel;
          objModel.getLayout().then(layout=>{
            let summaryRow = layout.Summary.qHyperCube.qDataPages[0].qMatrix[0];
            let summaryHeaders = layout.Summary.qHyperCube.qMeasureInfo;
            let detailRows = layout.Detail.qHyperCube.qDataPages[0].qMatrix;
            let detailHeaders = layout.Detail.qHyperCube.qDimensionInfo.concat(layout.Detail.qHyperCube.qMeasureInfo);
            console.log(layout);
            let htmlString = `
              <div>
                <h3>${info.path}</h3>
                <ul class='plainlist region-summary'>
                  <li>
                    <h4>${summaryHeaders[0].qFallbackTitle}</h4>
                    <span>${summaryRow[1].qText}</span>
                  </li>
                  <li>
                    <h4>${summaryHeaders[1].qFallbackTitle}</h4>
                    <span>${summaryRow[2].qText}</span>
                  </li>
                  <li>
                    <h4>${summaryHeaders[2].qFallbackTitle}</h4>
                    <span class='${summaryRow[3].qNum >= YonYPercVar ? 'green' : 'red'}'>${summaryRow[3].qText}</span>
                  </li>
                </ul>
              </div>
            `;
            htmlString += `
              <span class='dark-grey'>Overview and top corridors (all corridors in table view)</span>
              <div class='region-detail'>
            `;
            for (var c = 0; c < detailHeaders.length; c++) {
              htmlString += `
                <ul class='plainlist'>
            `;
              for (var r = 0; r < detailRows.length; r++) {
                htmlString += `
                  <li>${detailRows[r][c].qText}</li>
                `;
              }
            htmlString += `
                </ul>
              `;
            }
            htmlString += `
              </div>
            `;
            showPopup(location.x, location.y, htmlString);
          });
        });
      }
  }


  //create the pipeline map generic object definition
  let pipelineMapDef = {
    qInfo: {
      qType: "piemap"
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["Managing Region Code"]
          },
          qNullSuppression: true
        },
        {
          qDef: {
            qFieldDefs: ["PRODUCT"]
          },
          qNullSuppression: true
        }
      ],
      qMeasures: [
        {
          qDef: {
            qDef: "Sum({$<Year={2016}>}#Revenue * [%Flag_InRegion])"
          }
        }
      ],
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qWidth: 5,
          qHeight: 50
        }
      ]
    }
  }

  //create the pipeline map session object and listen for changes
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


  //create the filters generic object definition
  let filtersDef = {
    qInfo: {
      qType: "filters"
    },
    ManagingRegion: {
      qListObjectDef: {
        qDef: {
          qFieldDefs: ["Managing Region Code"]
        },
        qInitialDataFetch:[
          {
            qTop: 0,
            qLeft: 0,
            qWidth: 1,
            qHeight: 100
          }
        ]
      }
    },
    Product: {
      qListObjectDef: {
        qDef: {
          qFieldDefs: ["PRODUCT"]
        },
        qInitialDataFetch:[
          {
            qTop: 0,
            qLeft: 0,
            qWidth: 1,
            qHeight: 100
          }
        ]
      }
    }
  }

  //create the filters session object
  let filtersEl = document.getElementById("filterGroup");
  if(filtersEl){
    globalApp.createSessionObject(filtersDef).then(objModel=>{
      filterModel = objModel;
      updateFilters(objModel);
      objModel.addListener("changed", function(){
        updateFilters(objModel);
      })
    });
  }

  function updateFilters(model){
    model.getLayout().then(layout=>{
      console.log(layout);
      let filtersEl = document.getElementById("filterGroup");
      if(filtersEl){
        //Managing Region Code
        let managingRegionOptions = layout.ManagingRegion.qListObject.qDataPages[0].qMatrix;
        let filterHTML = `
          <h3>Managing Region</h3>
          <select class='form-control' onchange='selectValues(event, "ManagingRegion")'>
            <option value='-1'>All</option>
        `;
        for (var i = 0; i < managingRegionOptions.length; i++) {
          filterHTML += `
            <option ${(managingRegionOptions[i][0].qState=="S")?'selected':''} value="${managingRegionOptions[i][0].qElemNumber}">
              ${managingRegionOptions[i][0].qText}
            </option>
          `;
        }
        filterHTML += "</select>"
        filtersEl.innerHTML = filterHTML;

        //Product
        let productEl = document.getElementById('productDropdown');
        if(productEl){
          let productOptions = layout.Product.qListObject.qDataPages[0].qMatrix;
          let productHTML = "";
          let selectedProduct;
          for (var i = 0; i < productOptions.length; i++) {
            if(productOptions[i][0].qState=="S"){
              selectedProduct = productOptions[i][0].qText;
            }
            productHTML += `
              <li><a onclick="selectProduct(event, 'Product')" data-elem-number="${productOptions[i][0].qElemNumber}">${productOptions[i][0].qText}</a></li>
            `;
          }
          productHTML += `
            <li role="separator" class="divider"></li>
            <li><a onclick="selectProduct(event, 'Product')" data-elem-number="-1">All Products</a></li>
          `;
          productEl.innerHTML = productHTML;
          let productButton = document.getElementById("primaryProductButton");
          if(productButton){
            if(selectedProduct){
              productButton.innerHTML = selectedProduct;
            }
            else {
              productButton.innerHTML = "All Products";
            }
          }
        }
      }
    });
  }


  $("#revenuMapRangeSlider").ionRangeSlider({
      min: -100,
      max: 100,
      from: 0,
      onChange: function (data) {
        if(!drawingRevenueMap && !updatingVariables){
          updatingVariables = true;
          globalApp.getVariableByName("vYonY%Var").then(varModel=>{
            varModel.setNumValue(data.from).then(response=>{
              updatingVariables = false;
              console.log(response);
            });
          });
        }
      },
      onFinish: function (data) {

      }
  });



});


function selectValues(event, filter){
  let elemNumber = +event.target.value;
  if(elemNumber==-1){
    filterModel.clearSelections(`/${filter}/qListObjectDef`);
  }
  else {
    filterModel.selectListObjectValues(`/${filter}/qListObjectDef`, [elemNumber], false);
  }
}

function selectProduct(event, filter){
  let elemNumber = +event.target.attributes["data-elem-number"].value;
  if(elemNumber==-1){
    filterModel.clearSelections(`/${filter}/qListObjectDef`);
  }
  else {
    filterModel.selectListObjectValues(`/${filter}/qListObjectDef`, [elemNumber], false);
  }
}

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

function getLayout(model, callbackFn, elementId){
  model.getLayout().then(layout=>{
    layouts[elementId] = layout;
    callbackFn.call(null, elementId, layout, model)
  });
}

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

function clearAll(){
  globalApp.clearAll();
}

function setHeaderStyles(){
  let path = window.location.pathname;
  let activeHeaderEl;
  switch (path) {
    case "/":
      activeHeaderEl = document.getElementById("header_revenue");
      break;
    default:
      activeHeaderEl = document.getElementById("header_"+path.replace("/",""));
  }
  if(activeHeaderEl){
    activeHeaderEl.classList.add("active");
  }
}

setHeaderStyles();

