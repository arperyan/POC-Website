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
