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
