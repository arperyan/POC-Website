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
