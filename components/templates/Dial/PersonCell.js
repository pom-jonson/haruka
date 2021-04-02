import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
// import { surface } from "~/components/_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMale } from "@fortawesome/pro-solid-svg-icons";
import { faFemale } from "@fortawesome/pro-solid-svg-icons";
// import { icon } from "@fortawesome/fontawesome-svg-core";
import * as sessApi from "~/helpers/cacheSession-utils";
import {getAgeFromBirthday} from "~/helpers/date";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;  
  margin-left:1.25rem;  
`;
//cornflowerblue, lightsalmon, yellow, mediumaquamarine, lightpink
const Wrapper = styled.div`
  position: relative;    
  width: 7rem;
  height: 6.25rem;
  float: left;
  background-color:lightgray;
  .top-color, .bottom-color{
    width:100%;
    height:0.625rem;
    background-color:darkgray;
  }
  .main-body{
    width:100%;
    height:5rem;
    padding-top: 0.3rem;
    padding-left: 0.625rem;
    font-size: 1rem;
  }
  .color-0{
    background-color:darkgray;
  }
  .color-1{
    background-color:cornflowerblue
  }
  .color-2{
    background-color:lightsalmon
  }
  .color-3{
    background-color:yellow
  }
  .color-4{
    background-color:mediumaquamarine
  }
  .color-5{
    background-color:lightpink
  }
  .male{
    color:blue;
  }
  .female{
    color:red;
  }
  .icon_area{
    margin-bottom: 0.3rem;
    svg {
      margin-left: 0;
    }
  }
`;

class PersonCell extends Component {
  constructor(props) {
    super(props);

    let person_info = this.props.person_info
    this.state = {
      family_codes:this.props.family_codes,
      person_info:person_info,
      parents_color:person_info!=null?(person_info.parents_color!=null?person_info.parents_color:""):"",
      children_color:person_info!=null?(person_info.children_color!=null?person_info.children_color:""):"",
      relation:person_info!=null?(person_info.relation!=null?person_info.relation:""):"",      
      gender:person_info!=null?(person_info.gender!=null?person_info.gender:null):null,                  
      age:person_info!=null?(person_info.age!=null?person_info.age:""):"",            
      is_alive:person_info!=null?(person_info.is_alive!=null?person_info.is_alive:1):1, 
      is_living_together:person_info!=null?(person_info.is_living_together!=null?person_info.is_living_together:0):0,       
      note:person_info!=null?(person_info.note!=null?person_info.note:""):"",
    };    
  }


  UNSAFE_componentWillReceiveProps() {
    let person_info = this.props.person_info;
    this.setState({
      person_info:person_info,
      family_codes:this.props.family_codes,
      parents_color:person_info!=null?(person_info.parents_color!=null?person_info.parents_color:""):"",
      children_color:person_info!=null?(person_info.children_color!=null?person_info.children_color:""):"",
      relation:person_info!=null?(person_info.relation!=null?person_info.relation:""):"",      
      gender:person_info!=null?(person_info.gender!=null?person_info.gender:null):null,                  
      age:person_info!=null?(person_info.age!=null?person_info.age:""):"",            
      is_alive:person_info!=null?(person_info.is_alive!=null?person_info.is_alive:1):1, 
      is_living_together:person_info!=null?(person_info.is_living_together!=null?person_info.is_living_together:0):0,       
      note:person_info!=null?(person_info.note!=null?person_info.note:""):"",
    });
  }
  

  render() {
    let person_info = this.props.person_info;    
    var family_codes = this.props.family_codes;
    var parents_color = person_info!=null?(person_info.parents_color!=null?person_info.parents_color:""):"";
    var children_color = person_info!=null?(person_info.children_color!=null?person_info.children_color:""):"";
    var relation = person_info!=null?(person_info.relation!=null?person_info.relation:""):"";
    var gender = person_info!=null?(person_info.gender!=null?person_info.gender:null):null;
    var age = person_info!=null?(person_info.age!=null?person_info.age:""):"";
    var is_living_together = person_info!=null?(person_info.is_living_together!=null?person_info.is_living_together:""):'';
    var is_alive = person_info!=null?(person_info.is_alive!=null?person_info.is_alive:1):1;
    var note = person_info!=null?(person_info.note!=null?person_info.note:""):"";
    if (relation == 301) {
      let patientInfo = sessApi.getObjectValue("dial_setting","patient");
      if (patientInfo != undefined && patientInfo != null && patientInfo.birthday != undefined && patientInfo.birthday != null) {
        age = getAgeFromBirthday(patientInfo.birthday);
      }
    }
    return (
      <Wrapper>
        <div className={`top-color color-${parents_color}`}></div>
        <div className="main-body">
          {person_info != null && (
            <>
              <div className="icon_area">
                {gender != null && gender != 0 && (
                  <Icon icon={gender==1?faMale:faFemale} className={gender==1?"male":"female"}/>
                )}
                {relation != "" && (
                  <span className='relation'>{(family_codes != undefined && family_codes != null) ? (relation!=301 ?family_codes[relation]:'本人') : ''}</span>
                )}
              </div>          
              <div className ="age_live_area">
                {is_alive == 1 && (
                  <>
                  <span>({relation == 301 ? age : age + '歳'}{is_living_together==1?'/同居':is_living_together==0?'/別居':''})</span><br/>
                  </>
                )}
                {is_alive == 0 && (
                  <>
                  <span>死亡</span><br/>                  
                  </>
                )}
                  <span className='note' style={{fontSize:'0.8rem'}}>{note}</span>
              </div>
            </>
          )}
          
        </div>
        <div className ={`bottom-color color-${children_color}`}></div>
      </Wrapper>
      
    );
  }
}

PersonCell.contextType = Context;

PersonCell.propTypes = {
  person_info: PropTypes.object,  
  family_codes:PropTypes.object,
  
};

export default PersonCell;
