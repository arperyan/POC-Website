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
