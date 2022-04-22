export default {
  map: {
    "style": "mapbox://styles/hyphae-lab/cl0lex1tp000115qtikua1z4e",
    "user": "hyphae-lab",
    "token": "pk.eyJ1IjoiaHlwaGFlLWxhYiIsImEiOiJjazN4czF2M2swZmhkM25vMnd2MXZrYm11In0.LS_KIw8THi2qIethuAf2mw",
    "center": [
      -85.7797288176198,
      38.191476417647806
    ],
    zoom: 15,
    projects: [
      {
        default: true,
        id: "east_contra_costa_gi_2022",
        label: "East Contra Costa GI",
        state: 'CA',
        style: "mapbox://styles/hyphae-lab/cl0lex1tp000115qtikua1z4e",
        zoom: 11,
        center: [-121.924, 38.015],
        layerLegends: 'overlay',
        layers: [
          {
            "name": "Bio (People)",
            "children": [
              {
                "id": "bio-socialvulnerability-clip",
                "name": "Social Vulnerability",
                "initialVisibility": false,
                "details": {
                  "attributeId": "socVulnRan",
                  "attributeName": "Social Vulnerability"
                }
              },
              {
                "id": "communitycenters",
                "name": "Community Centers",
                "initialVisibility": false,
                "details": {
                  "attributeId": "Name",
                  "attributeName": "Name"
                }
              },
              {
                "id": "daycare",
                "name": "Daycare",
                "initialVisibility": false,
                "details": {
                  "attributeId": "Name",
                  "attributeName": "Name"
                }
              },
              {
                "id": "hospitals-rehabilitation",
                "name": "Hospitals Rehabilitation",
                "initialVisibility": false,
                "details": {
                  "attributeId": "Name",
                  "attributeName": "Name"
                }
              },
              {
                "id": "schools",
                "name": "Schools",
                "initialVisibility": false,
                "details": {
                  "attributeId": "Name",
                  "attributeName": "Name"
                }
              },
              {
                "id": "seniorcenters-longterm",
                "name": "Senior Centers Longterm",
                "initialVisibility": false,
                "details": {
                  "attributeId": "Name",
                  "attributeName": "Name"
                }
              },
              {
                "id": "socialservices",
                "name": "Social Services",
                "initialVisibility": false,
                "details": {
                  "attributeId": "Name",
                  "attributeName": "Name"
                }
              },
              {
                "id": "parcels-clip",
                "name": "Parcels",
                "initialVisibility": false
              },
              {
                "id": "parks",
                "name": "Parks",
                "initialVisibility": false
              },
              {
                "id": "bikeroutes",
                "name": "Bike Routes",
                "initialVisibility": false
              },
              {
                "id": "busstops",
                "name": "Bus Stops",
                "initialVisibility": false
              },
              {
                "id": "busroutes",
                "name": "Bus Routes",
                "initialVisibility": false
              },
              {
                "id": "es-socioeconomic",
                "name": "Socioeconomic",
                "initialVisibility": false,
                "details": {
                  "attributeId": "PopCharP",
                  "attributeName": "Population Characteristics"
                }
              }
            ]
          },
          {
            "name": "Air",
            "children": [
              {
                "id": "air-cleanupsites",
                "name": "Cleanup Sites",
                "initialVisibility": false
              },
              {
                "id": "air-hazardwaste",
                "name": "Hazard Waste",
                "initialVisibility": false
              },
              {
                "id": "air-trafficaadt",
                "name": "Traffic AADT",
                "initialVisibility": false,
                "details": {
                  "attributeId": "Ahead_AADT",
                  "attributeName": "Ahead AADT"
                }
              },
              {
                "id": "air-truckaadt",
                "name": "Truck AADT",
                "initialVisibility": false,
                "details": {
                  "attributeId": "TruckAADT",
                  "attributeName": "Truck AADT"
                }
              },
              {
                "id": "hwy-500buffer",
                "name": "Highway Buffer 500'",
                "initialVisibility": false
              },
              {
                "id": "air-caltrans1",
                "name": "Caltrans",
                "initialVisibility": false,
                "details": {
                  "attributeId": "TYPE",
                  "attributeName": "Type"
                }
              },
              {
                "id": "air-popdensity",
                "name": "Population Density",
                "initialVisibility": false,
                "details": {
                  "attributeId": "POPDENSTY",
                  "attributeName": "Density"
                }
              },
              {
                "id": "air-es",
                "name": "Enviroscreen",
                "initialVisibility": false,
                "details": {
                  "attributeId": "ES_TOT",
                  "attributeName": "Total"
                }
              }
            ]
          },
          {
            "name": "Geo",
            "children": [
              {
                "id": "geo-contamination-clip",
                "name": "Contamination",
                "initialVisibility": false,
                "details": {
                  "attributeId": "contam90",
                  "attributeName": "Contamination 90"
                }
              }
            ]
          },
          {
            "name": "Hydro",
            "children": [
              {
                "id": "hydro-contracosta-lowlying-poly-84",
                "name": "Contra Costa Lowlying Poly 84",
                "initialVisibility": false
              },
              {
                "id": "hydro-inundation-poly-mhhw-epoch",
                "name": "Inundation Poly MHHW Epoch",
                "initialVisibility": false
              },
              {
                "id": "hydro-overtopping-84",
                "name": "Overtopping 84",
                "initialVisibility": false
              },
              {
                "id": "hydro-svi-clip",
                "name": "SVI",
                "initialVisibility": false,
                "details": {
                  "attributeId": "SVI_Rank",
                  "attributeName": "SVI Rank"
                }
              },
              {
                "id": "swrp-clip",
                "name": "SWRP",
                "initialVisibility": false
              },
              {
                "id": "hydro-waterbody",
                "name": "Water Body",
                "initialVisibility": false
              },
              {
                "id": "hydro-fldhzd",
                "name": "Flood Hazard",
                "initialVisibility": false,
                "details": {
                  "attributeId": "ZONE_SUBTY",
                  "attributeName": "Flood Area"
                }
              },
              {
                "id": "hydro-pittsburggi",
                "name": "Pittsburg GI",
                "initialVisibility": false
              },
              {
                "id": "hydro-floodsites",
                "name": "Flood Sites",
                "initialVisibility": false
              },
              {
                "id": "hydro-community-reports",
                "name": "Community reports",
                "initialVisibility": false
              }
            ]
          },
          {
            "name": "General",
            "children": [
              {
                "id": "citylimits",
                "name": "City Limits",
                "initialVisibility": true
              },
              {
                "id": "stormwater-studies",
                "name": "Stormwater Studies",
                "initialVisibility": true,
                "details": [
                  {
                    "attributeId": "Name",
                    "attributeName": "Name",
                  },
                  {
                    "attributeId": "Type",
                    "attributeName": "Type",
                  },
                  {
                    "attributeId": "Stakeholde",
                    "attributeName": "Stakeholder",
                  }
                ]
              },
              {
                "id": "community-input",
                "name": "Community Input",
                "initialVisibility": true,
                "details": {
                  "attributeId": "Name", //["Stakeholde", "Name"],
                  "attributeName": "Name", // ["Stakeholder", "Name"]
                }
              },
              {
                "id": "hyphae-sites",
                "name": "Hyphae Sites",
                "initialVisibility": true,
                "details": {
                  "attributeId": "Name", //["Stakeholde", "Name"],
                  "attributeName": "Name", // ["Stakeholder", "Name"]
                }
              }
            ]
          }
        ]
      }
    ],
    geosearchInputPlaceholderText: 'Search for address/city/location'
  }
};