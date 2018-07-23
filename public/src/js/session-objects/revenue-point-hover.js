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
