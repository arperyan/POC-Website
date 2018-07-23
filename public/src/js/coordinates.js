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
