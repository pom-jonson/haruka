import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as apiClient from "~/api/apiClient";
// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import PlanListNew from "~/components/templates/Patient/NursingDocument/PlanListNew";
import Spinner from "react-bootstrap/Spinner";
import Checkbox from "~/components/molecules/Checkbox";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size:${props=>(props.font_props != undefined ? (props.font_props + 'rem'):'1rem')};
 overflow-y:auto;
 .checkbox-area{
   label{
    font-size:${props=>(props.font_props != undefined ? (props.font_props + 'rem'):'1rem')};
   }
 }
`;

class PatientNursePlan extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });

    this.state = {
      department_codes,
      diagnosis,      
      alert_messages:"",
      alert_title:'',
      complete_message:"",      
      confirm_message:"",      
      confirm_type:"",
      isLoaded: false,
      problem_list:[],
      continue:1,
      stop:1,
      resolve:1,
    }
  }

  async componentDidMount() {
    await this.getNurseProblem();
  }

  getNurseProblem = async() => {
    this.setState({isLoaded:false});
    let path = "/app/api/v2/master/nurse/problem_search";
    let post_data = {
      system_patient_id:this.props.patientId,
      order:'asc',
      continue:this.state.continue,
      stop:this.state.stop,
      resolve:this.state.resolve
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if (res!= undefined && res != null && res.length>0){
          let res_array = res;
          let _state = {};          
          _state.problem_list = res_array;
          _state.isLoaded = true;
          this.setState(_state);
        } else {
          let _state = {
            problem_list:[],
            isLoaded: true,
          };
          this.setState(_state);
        }
      })
      .catch(() => {
        this.setState({problem_list:[], isLoaded: true})
      });
  };

  closeModal = (refresh) =>{
    this.setState({      
      alert_messages:"",
      alert_title:'',
      confirm_message:"",
      confirm_type:"",      
    });
    if (refresh == 'refresh') this.getNurseProblem();
  };

  setCheckState = (name, value)=> {
    this.setState({[name]:value}, () => {
      this.getNurseProblem();
    })
  }

  render() {
    var {problem_list} = this.state;
    return (
      <>
        <Wrapper font_props = {this.props.font_props}>
          <div className='checkbox-area'>
            <Checkbox
              label = "継続"
              getRadio={this.setCheckState.bind(this)}
              value={this.state.continue}
              name="continue"
            />
            <Checkbox
              label = "中止"
              getRadio={this.setCheckState.bind(this)}
              value={this.state.stop}
              name="stop"
            />
            <Checkbox
              label = "解決"
              getRadio={this.setCheckState.bind(this)}
              value={this.state.resolve}
              name="resolve"
            />
          </div>
          {this.state.isLoaded && (
            <>
            {problem_list != undefined && problem_list != null && problem_list.length > 0 && (
              problem_list.map((item, index) => {
                return(
                  <>
                    <PlanListNew
                      nurse_problem_item = {item}
                      problem_index = {index}
                      font_props = {this.props.font_props}
                    />
                  </>
                )
              })
            )}
            </>
          )}
          {this.state.isLoaded != true && (
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
        </Wrapper>
      </>
    );
  }
}

PatientNursePlan.propTypes = {
  patientId: PropTypes.number,
  font_props: PropTypes.number,
};

export default PatientNursePlan;
