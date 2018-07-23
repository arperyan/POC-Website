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
