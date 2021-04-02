import React, { useEffect, useState } from "react";
import { HashRouter as Router } from "react-router-dom";
import auth from "~/api/auth";
import Routes from "./Routes";
import Store from "./Store";
import ErrorBoundary from "./ErrorBoundary";

import Container from "react-bootstrap/Container";
import GlobalNav from "./organisms/GlobalNav";
import DialSideBar from "./organisms/DialSideBar";
import Context from "~/helpers/configureStore";

import styled from "styled-components";
import { background as backgroundColor, haruka_color as harukaBackground,  date_colors} from "./_nano/colors";
const Wrapper = styled.div`
  background-color: ${backgroundColor};
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  height: 100%;
  min-height: 100vh;

  .container {
    // padding: 0 3px;
    padding: 0;
    // max-width: calc(100% - 240px) !important;
    max-width: calc(100% - 200px) !important;
    margin: 0;    
    height: 100vh;
  }

  .react-datepicker__day.sunday{
    color:${date_colors != undefined && date_colors.days != undefined && date_colors.days[0].calendar_date_font != undefined && date_colors.days[0].calendar_date_font != ''
      ?date_colors.days[0].calendar_date_font : 'red'} ;
  }
  .react-datepicker__day.saturday{
    color:${date_colors != undefined && date_colors.days != undefined && date_colors.days[6].calendar_date_font != undefined && date_colors.days[6].calendar_date_font != ''
      ?date_colors.days[6].calendar_date_font : 'blue'} ;
  }
  .react-datepicker__day.holiday{
    color:${date_colors != undefined && date_colors.holiday != undefined && date_colors.holiday.calendar_date_font != undefined && date_colors.holiday.calendar_date_font != ''
      ?date_colors.holiday.calendar_date_font : 'red'} ;
  }

  .data-item{
    background: ${harukaBackground.out == undefined?'#fffbe6':
      harukaBackground.out.default==undefined?'#fffbe6':
      harukaBackground.out.default.linear == undefined?'#fffbe6':harukaBackground.out.default.linear}!important;
  }

  ._color_received{
    .history-region{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.received==undefined?'#fffbe6':
        harukaBackground.out.received.main == undefined?'#fffbe6':harukaBackground.out.received.main}!important;
    }
    .doctor-name{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.received==undefined?'#fffbe6':
        harukaBackground.out.received.main == undefined?'#fffbe6':harukaBackground.out.received.main}!important;
    }

    .data-item{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.received==undefined?'#fffbe6':
        harukaBackground.out.received.linear == undefined?'#fffbe6':harukaBackground.out.received.linear}!important;      
    }
  }

  ._color_implemented{
    .history-region{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.done==undefined?'#fffbe6':
        harukaBackground.out.done.main == undefined?'#fffbe6':harukaBackground.out.done.main}!important;      
    }
    .doctor-name{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.done==undefined?'#fffbe6':
        harukaBackground.out.done.main == undefined?'#fffbe6':harukaBackground.out.done.main}!important;      
    }

    .data-item{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.done==undefined?'#fffbe6':
        harukaBackground.out.done.linear == undefined?'#fffbe6':harukaBackground.out.done.linear}!important;      
    }
  }
  ._color_not_implemented{
    .history-region{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.not_done==undefined?'#fffbe6':
        harukaBackground.out.not_done.main == undefined?'#fffbe6':harukaBackground.out.not_done.main}!important;      
    }
    .doctor-name{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.not_done==undefined?'#fffbe6':
        harukaBackground.out.not_done.main == undefined?'#fffbe6':harukaBackground.out.not_done.main}!important;      
    }

    .data-item{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.not_done==undefined?'#fffbe6':
        harukaBackground.out.not_done.linear == undefined?'#fffbe6':harukaBackground.out.not_done.linear}!important;      
    }
  }

  ._color_received_hospital{
    .history-region{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.received==undefined?'#fffbe6':
        harukaBackground.hospital.received.main == undefined?'#fffbe6':harukaBackground.hospital.received.main}!important;      
    }
    .doctor-name{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.received==undefined?'#fffbe6':
        harukaBackground.hospital.received.main == undefined?'#fffbe6':harukaBackground.hospital.received.main}!important;      
    }

    .data-item{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.received==undefined?'#fffbe6':
        harukaBackground.hospital.received.linear == undefined?'#fffbe6':harukaBackground.hospital.received.linear}!important;      
    }
  }

  ._color_implemented_hospital{
    .history-region{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.done==undefined?'#fffbe6':
        harukaBackground.hospital.done.main == undefined?'#fffbe6':harukaBackground.hospital.done.main}!important;      
    }
    .doctor-name{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.done==undefined?'#fffbe6':
        harukaBackground.hospital.done.main == undefined?'#fffbe6':harukaBackground.hospital.done.main}!important;      
    }

    .data-item{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.done==undefined?'#fffbe6':
        harukaBackground.hospital.done.linear == undefined?'#fffbe6':harukaBackground.hospital.done.linear}!important;      
    }
  }
  ._color_not_implemented_hospital{
    .history-region{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.not_done==undefined?'#fffbe6':
        harukaBackground.hospital.not_done.main == undefined?'#fffbe6':harukaBackground.hospital.not_done.main}!important;      
    }
    .doctor-name{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.not_done==undefined?'#fffbe6':
        harukaBackground.hospital.not_done.main == undefined?'#fffbe6':harukaBackground.hospital.not_done.main}!important;      
    }

    .data-item{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.not_done==undefined?'#fffbe6':
        harukaBackground.hospital.not_done.linear == undefined?'#fffbe6':harukaBackground.hospital.not_done.linear}!important;      
    }
  }

  .progress-item {
    background: ${harukaBackground.progress_note == undefined?'#fffbe6':
        harukaBackground.progress_note.default==undefined?'#fffbe6':
        harukaBackground.progress_note.default.linear == undefined?'#fffbe6':harukaBackground.progress_note.default.linear}!important;
  }

  .color_meal{
    .history-region{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.meal==undefined?'#fffbe6':
        harukaBackground.hospital.meal.main == undefined?'#fffbe6':harukaBackground.hospital.meal.main}!important;            
    }
    .doctor-name{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.meal==undefined?'#fffbe6':
        harukaBackground.hospital.meal.main == undefined?'#fffbe6':harukaBackground.hospital.meal.main}!important;
    }

    .data-item{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.meal==undefined?'#fffbe6':
        harukaBackground.hospital.meal.linear == undefined?'#fffbe6':harukaBackground.hospital.meal.linear}!important;      
    }    
  }

  .color_document{
    .history-region{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.document==undefined?'#fffbe6':
        harukaBackground.out.document.main == undefined?'#fffbe6':harukaBackground.out.document.main}!important;            
    }
    .doctor-name{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.document==undefined?'#fffbe6':
        harukaBackground.out.document.main == undefined?'#fffbe6':harukaBackground.out.document.main}!important;
    }

    .data-item{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.document==undefined?'#fffbe6':
        harukaBackground.out.document.linear == undefined?'#fffbe6':harukaBackground.out.document.linear}!important;      
    }    
  }

  .color_document_hospital{
    .history-region{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.document==undefined?'#fffbe6':
        harukaBackground.hospital.document.main == undefined?'#fffbe6':harukaBackground.hospital.document.main}!important;            
    }
    .doctor-name{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.document==undefined?'#fffbe6':
        harukaBackground.hospital.document.main == undefined?'#fffbe6':harukaBackground.hospital.document.main}!important;
    }

    .data-item{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.document==undefined?'#fffbe6':
        harukaBackground.hospital.document.linear == undefined?'#fffbe6':harukaBackground.hospital.document.linear}!important;      
    }
  }

  .color_hospital_description_out{
    .history-region{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.hospital_description==undefined?'#fffbe6':
        harukaBackground.out.hospital_description.main == undefined?'#fffbe6':harukaBackground.out.hospital_description.main}!important;      
    }
    .doctor-name{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.hospital_description==undefined?'#fffbe6':
        harukaBackground.out.hospital_description.main == undefined?'#fffbe6':harukaBackground.out.hospital_description.main}!important;      
    }

    .data-item{
      background: ${harukaBackground.out == undefined?'#fffbe6':
        harukaBackground.out.hospital_description==undefined?'#fffbe6':
        harukaBackground.out.hospital_description.linear == undefined?'#fffbe6':harukaBackground.out.hospital_description.linear}!important;      
    }
  }

  .color_hospital_description{
    .history-region{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.hospital_description==undefined?'#fffbe6':
        harukaBackground.hospital.hospital_description.main == undefined?'#fffbe6':harukaBackground.hospital.hospital_description.main}!important;      
    }
    .doctor-name{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.hospital_description==undefined?'#fffbe6':
        harukaBackground.hospital.hospital_description.main == undefined?'#fffbe6':harukaBackground.hospital.hospital_description.main}!important;
    }

    .data-item{
      background: ${harukaBackground.hospital == undefined?'#fffbe6':
        harukaBackground.hospital.hospital_description==undefined?'#fffbe6':
        harukaBackground.hospital.hospital_description.linear == undefined?'#fffbe6':harukaBackground.hospital.hospital_description.linear}!important;      
    }    
  }
`;

const DialPatientWrapper = styled.div`
  background-color: ${backgroundColor};
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  height: 100%;
  min-height: 100vh;

  .container {
    padding: 0;
    max-width: calc(100% - 390px) !important;
    margin: 0;
    margin-left: 200px;
    height: 100vh;    
  }

  .dial-patient-nav{
    width: calc(100% - 390px) !important;
  }
`;


const App = () => {
  useEffect(auth.silentAuth, []); 
  let [type, setType] = useState("patient");  
  return (
    <Router>
      <Store>
      {type == "patient" ? (
        <>
        <Wrapper>
          <ErrorBoundary>
              <DialSideBar 
                setDesign={setType}
              />
            <GlobalNav />
            <Container>
              <Routes />
            </Container>
          </ErrorBoundary>
        </Wrapper>
        </>
      ) : (
        <>
          <DialPatientWrapper>
            <ErrorBoundary>
              <DialSideBar 
                setDesign={setType}
              />
              <GlobalNav />
              <Container>
                <Routes />
              </Container>
            </ErrorBoundary>
          </DialPatientWrapper>
        </>
      )}
      </Store>
    </Router>
  );  
};

App.contextType = Context;

export default App;
