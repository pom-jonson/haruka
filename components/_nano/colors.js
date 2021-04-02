import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import axios from "axios";

export const background = `rgba(241, 243, 244, 1)`;
export const onBackground = `rgba(0, 0, 0, 1)`;
export const secondary200 = `rgba(246, 252, 253, 1)`;
export const secondary400 = `rgba(105, 200, 225, 1)`;
export const secondary600 = `rgba(38, 159, 191, 1)`;
export const secondary = secondary400; // alias
export const onSecondaryLight = `rgba(255, 255, 255, 1)`;
export const onSecondaryDark = `rgba(0, 0, 0, 1)`;
export const surface = `rgba(255, 255, 255, 1)`;
export const onSurface = `rgba(0, 0, 0, 1)`;
export const highEmphasis = `rgba(0, 0, 0, 1)`;
export const midEmphasis = `rgba(126, 126, 126, 1)`;
export const focusedItemBG = `rgba(160, 235, 255,1)`;
export const focusedItemColor = `rgba(33, 37, 41,1)`;
export const disable = `rgba(213, 213, 213, 1)`;
export const error = `rgba(241, 86, 124, 1)`;
export const operationSelectedColor = `rgba(0, 0, 255, 1)`;
export const bloodLineColor = "red";
export const temperatureLineColor = `blue`;
export const pulseLineColor = `green`;
export const commonTabColor = `#c3e8fa`;
export const commonTabTitleColor = `#9cd3e7`;
export const commonTabItemColor = `#e1f4fb`;

export const karteTabColor = `#daeada`;
export const karteTabTitleColor = `#b3d6c9`;
export const karteTabItemColor = `#f7f6dd`;

export const nurseTabColor = `#ffe5ce`;
export const nurseTabTitleColor = `#d8d1bd`;
export const nurseTabItemColor = `#fff1d1`;

export const partTabColor = `#fee6e2`;
export const partTabTitleColor = `#d7d2d1`;
export const partTabItemColor = `#fff2e5`;

export const maintenanceTabColor = `#ebdbe7`;
export const maintenanceTabTitleColor = `#c4c7d6`;
export const maintenanceTabItemColor = `#ffe7ea`;

export const printTabColor = `#f1f3f4`;
export const printTabTitleColor = `rgba(208, 208, 208, 1)`;
export const printTabItemColor = `rgb(223, 232, 236)`;

// right sidebar patients list
export const firstPatientColor = `#ff9f9f`;
export const secondPatientColor = `rgb(232, 204, 146)`;
export const thirdPatientColor = `rgb(208, 200, 251)`;
export const forthPatientColor = `rgb(135, 213, 170)`;

// patient info card design
export const _patientInfo_bg = `#f2f2f2`;
export const _patientInfo_btn_bg = `#d9d9d9`;
export const _patientInfo_btn_karte_bg = `#9e9e9e`;

// soap page design

export const SOAP_IMPORTANCE_COLOR = {1:"black", 2:"red", 3:"blue", 4:"green"};

const getColorJsonData = () => {
    var default_colors = {
        hospital:{
            default:{
                main:"#fffbe6",
                linear:"linear-gradient(#ffffff, #fff7cc)"
            },
            received:{
                main:"#f7e6ff",
                linear:"linear-gradient(#ffffff, #efccff)"
            },
            not_done:{
                main:"#f7e6ff",
                linear:"linear-gradient(#ffffff, #efccff)"
            },
            done:{
                main:"#fffbe6",
                linear:"linear-gradient(#ffffff,#fff7cc)"
            },
            hospital_description:{
                main:"#fffbe6",
                linear:"linear-gradient(#ffffff,#fff7cc)"
            },
            meal:{
                main:"#fffbe6",
                linear:"linear-gradient(#ffffff,#fff7cc)"
            },
            document:{
                main:"#fffbe6",
                linear:"linear-gradient(#ffffff,#fff7cc)"
            }
        },
        out:{
             default:{
                main:"#ffe5c7",
                linear:"linear-gradient(#d0cfcf, #e6e6e7)"
            },
            received:{
                main:"#ffe6e6",
                linear:"linear-gradient(#ffffff, #ffcccc)"
            },
            not_done:{
                main:"#ffe6e6",
                linear:"linear-gradient(#ffffff, #ffcccc)"
            },
            done:{
                main:"#eeffe6",
                linear:"linear-gradient(#ffffff, #ccffcc)"
            },
            hospital_description:{
                main:"#eeffe6",
                linear:"linear-gradient(#ffffff, #ccffcc)"
            },
            document:{
                main:"#eeffe6",
                linear:"linear-gradient(#ffffff, #ccffcc)"
            }
        },
        progress_note:{
            default:{
                main:"",
                linear:"linear-gradient(#e6e6e7, #e6e6e7)"
            }
        }
    };
    let path = "/app/api/v2/top/harukaBarBackground";
    var {data} = axios.get(path);
    var res = data != undefined && data != null && data != '' ? data: default_colors;
    return res;
}
//haruka bar color
export const haruka_color =
    sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS) !=undefined && sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS).haruka_color!= undefined 
    ? sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS).haruka_color
    : getColorJsonData();

const getDateColrJsonData = () => {
    var default_colors = {
        days:{
          0:{
              schedule_date_cell_back:"#FFD5EC",
              schedule_date_cell_font:"#000000",
              calendar_date_font:"#CC0000"
              },
          1:{
              schedule_date_cell_back:"#FFFFFF",
              schedule_date_cell_font:"#000000"
              },
          2:{
              schedule_date_cell_back:"#FFFFFF",
              schedule_date_cell_font:"#000000"
              },
          3:{
              schedule_date_cell_back:"#FFFFFF",
              schedule_date_cell_font:"#000000"
              },
          "4":{
              schedule_date_cell_back:"#FFFFFF",
              schedule_date_cell_font:"#000000"
              },
          "5":{
              schedule_date_cell_back:"#FFFFFF",
              schedule_date_cell_font:"#000000"
              },
          "6":{
              schedule_date_cell_back:"#D7EEFF",
              schedule_date_cell_font:"#000000",
              calendar_date_font:"#0000CC"
          }
        },        
        holiday:{
          schedule_date_cell_back:"#FFD5EC",
          schedule_date_cell_font:"#000000",
          calendar_date_font:"#CC0000"
        },
        default:{
          schedule_date_cell_back:"#FFFFFF",
          schedule_date_cell_font:"#000000",
          calendar_date_font:"#000000"
        }
      };
      let path = "/app/api/v2/top/getDateColor";
      var {data} = axios.get(path);
      var res = data != undefined && data != null && data != '' ? data: default_colors;
      return res;
}

//datepicker date color
export const date_colors = 
    sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS) !=undefined && sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS).dial_schedule_date_color!= undefined 
    ? sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS).dial_schedule_date_color
    : getDateColrJsonData();
