import * as colors from "../_nano/colors";
import styled from "styled-components";

export const Wrapper = styled.div`
  background-color: ${colors.surface};
  border-radius: 4px;
  padding: 0;
  position: relative;
  .fa-5x {
    font-size: 65px;
  }
  .name-area {
    width: 20rem;
    cursor: pointer;
  }
  .patient-info {
    font-size: 0.875rem;
    margin: 0 0.4rem;
    margin-left: 0px;
    line-height: 1;
    div {
      font-weight: 500;
      margin-right: 0.2rem;
    }
    span {
      font-weight: normal;
    }
  }
  .blood-type {
    margin: 0.5rem 0;
    span {
      font-size: 0.8125rem;
      margin-left: 1rem;
      &.rh {
        margin-left: 0;
        margin-right: 10rem;
      }
    }
  }
  .unit {
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
  .bmi {
    font-size: 0.8125rem;
    margin-right: 0.5rem;
  }
  .icon {
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    margin-right: 0.1rem;
    width: 2.4rem;
    height: 2.4rem;
    position: relative;    
  }

  .icon-area{
    .icon-ele{
    }
    margin-bottom:1rem;
  }
  .btn-area {
    button {
      margin-right: 0.3rem;
      height: 2rem;
      padding: 0 !important;
    }
    .grey-btn{
      width: 12rem;
      padding: 0.4rem;
      min-width:5rem;
      span{
        font-size: 1rem;
        color: #3c2d2c;
      }
    }
    .grey-btn-new{
      padding: 0.1rem;
    }
  }

  .invitor_number {
    padding-top: 5px;
    margin-right: 1rem;
    margin-left: auto;
    color: rgb(255,127,39);
  }

  img {
    width: 2rem;
    vertical-align: top;
  }

  .sex-icon{
    overflow: hidden;
    svg{
      font-size: 2rem;
      margin: 3px auto;
    }
  }
`;

export const Flex = styled.div`
  // display: flex;
  // align-items: flex-start;
  display: block;

  .float-left{
    float: left;
  }

  .float-right{
    float:right;
  }

  .flex-base {
    display: flex;
    align-items: baseline;
    position: absolute;
    top: 8px;
    right: 8px;
  }

  svg{
    float:left;
    margin: 12px auto;
  }

  .div-patient-info{
    float:left;
  }

  .div-insurance{
    // margin-top: 12px;
    // margin-left: 7px;
    margin-left: 0px;
    font-size: 1rem;
    select{
      margin-left: 3px;
    }
  }

  .div-left-side{    
    float: left;
    margin: 12px 15px 5px 10px;
    .pullbox-select{
      width: 12.5rem;
      // font-size: 0.88rem;
      font-size:inherit;
      height:auto!important;
      padding-top:5px!important;
      padding-bottom:5px!important;
    }

    .pullbox-label {
        // font-size: 0.88rem;
        font-size:inherit;
        width: 12.5rem;
    }

    .label-title{
      width: 0px;
    }
    .pink{
      select{
        background: linear-gradient(#eac1db, #ffd4f0, #ffd4f0);
      }
    }
    .green{
      select{
        background: linear-gradient(#d0e6b5, #e6ffcb, #e6ffcb);
      }
    }
  }

  .div-patient-name{
    float:left;
    margin: 0.4rem auto;
  }

  .div-right-side{
    width: 9rem;
    margin: 1rem 10px 10px 10px;

    .right-btn-style-01{
      width: 50%;
      float:left;
      padding-top:2px;
    }

    .right-btn-style-02{
      width: 50%;
      float:left;
      
    }

    .btn-prof1{
      border: 1px solid #ccc;
      box-shadow: #8d8d8d 0px 1px 4px;    
      width: 4rem;
      padding: 0.4rem;
      float: left;  
      min-width: 0;    
      margin-bottom: 0.3rem;
      background-color: #ddd;      
      span{
        color: #3c2d2c;
        font-size:1rem;        
      }
    }

    .btn-prof2{
      border: 1px solid #ccc;
      box-shadow: #8d8d8d 0px 1px 4px;
      float: left;
      width: 4rem;
      padding: 0.4rem;
      min-width: 0;          
      background-color: ${colors._patientInfo_btn_bg};      
      span{
        color: #3c2d2c;        
        font-size:1rem;
      }   
    }

    .btn-karte{
      float: right;
      height: auto;      
      min-width: 0;    
      border-radius: 10px;
      box-shadow: #8d8d8d -1px 1px 4px;
      width: 4.5rem;      
      background-color: ${colors._patientInfo_btn_karte_bg};
      padding-left:0.5rem;
      padding-right:0.5rem;
      padding-top:1.1rem;
      padding-bottom:1.2rem;
      span{
        font-size:1rem;
        font-weight: normal;
      }
    }

    .has-save-data{
      background-color: #CC0000 !important;
    }
  }
  .grey-btn{
    background-color: rgb(221, 221, 221);
    border: 1px solid #ccc;
    box-shadow: #8d8d8d 0px 1px 4px;
    span {
        color: black;
    }
  }

  .title-style-1{
    font-size: 1.1rem;
  }

  .title-style-2{
    margin-top: 1rem;
    margin-bottom: 0px;
    font-size: 1.1rem;
  }

  .title-style-3{
    margin-top: 1rem;
    margin-bottom: 0px;
    font-size: 1.1rem;
  }
`;

export const PatientId = styled.div`
  // color: ${colors.midEmphasis};
  font-family: sans-serif;
  font-weight: lighter;
  font-size: 0.9rem;
  transform: scale(0.9, 1);
  line-height: 1;
  margin-right: 1rem;
  width: auto;
`;

export const PatientIdOne = styled.div`
  color: black;
  // color: ${colors.midEmphasis};
  font-family: NotoSansJP;
  font-weight: lighter;
  font-size: 1.5rem;  
  transform: scale(0.9, 1);
  line-height: 1;
  // margin-right: 16px;
  width: auto;
`;

export const Kana = styled.div`
  border-bottom: 1px solid ${colors.midEmphasis};
  margin-top: 10px;
  margin-bottom: 0px;
  color: ${colors.onSurface};
  font-family: NotoSansJP;
  font-size: 1.1rem;
  line-height: 1;  
  padding-bottom: 4px;
  // margin-bottom: 8px;
  width: 18.5rem;
`;

export const PatientName = styled.div`
  width: 18.5rem !important;    
  height: 2.25rem;
  font-size: 1.5rem !important;
  border-bottom: 1px solid ${colors.midEmphasis};
  color: ${colors.onSurface};
  font-family: NotoSansJP;
  // font-size: 1.1rem!important;
  font-weight: bold;
  letter-spacing: 0px;
`;

