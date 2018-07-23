include "./coordinates.js"

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
  include "./defs/revenue-kpis.js"
  //create the revenue KPIs session object and listen for changes
  include "./session-objects/revenue-kpis.js"

  //create the revenue map generic object definition
  include "./defs/revenue-map.js"
  //create the revenue map session object and listen for changes
  include "./session-objects/revenue-map.js"

  //create the revenue midpoint hover generic object definition
  include "./defs/revenue-midpoint-hover.js"
  //create the revenue midpoint hover session object
  include "./session-objects/revenue-midpoint-hover.js"

  //create the revenue line hover generic object definition
  include "./defs/revenue-line-hover.js"
  //create the revenue line hover session object
  include "./session-objects/revenue-line-hover.js"

  //create the revenue point hover generic object definition
  include "./defs/revenue-point-hover.js"
  //create the revenue point hover session object
  include "./session-objects/revenue-point-hover.js"

  //create the pipeline map generic object definition
  include "./defs/pipeline-map.js"
  //create the pipeline map session object and listen for changes
  include "./session-objects/pipeline-map.js"

  //create the filters generic object definition
  include "./defs/filters.js"
  //create the filters session object
  include "./session-objects/filters.js"

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

include "./renderD3Bar.js"
include "./getLayout.js"
include "./showPopup.js"
include "./clearAll.js"
include "./setHeaderStyles.js"
