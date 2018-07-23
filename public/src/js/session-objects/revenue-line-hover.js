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
