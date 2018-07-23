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
