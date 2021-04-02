import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import { formatDateTimeIE } from "~/helpers/date";

const Wrapper = styled.div`
  font-size: 1rem;
  width: 100%;
  height: auto;  
  padding-left:1rem;
  padding-right:1rem;
  padding-top:2rem;
 .react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
 }
 label{
   font-size:1rem!important;
   margin-bottom:0.2rem;
 }
  .sub-title{
    font-size:1.1rem;
    margin-bottom:0.3rem;
  }
  
  .blog-title{
    font-size:1rem;    
  }
  .one-row{
    display:flex;
    margin-bottom:1rem;
    width:100%;
    justify-content: space-between;    
  }
  .one-blog{    
    width:30%;
    margin-right:3%;
    .flex{
      width:100%;
      position:relative;
    }
    .float-right{
      position:absolute;
      right:0px;      
    }
    .radio-title-label{
      margin-right:1rem;
    }
    textarea{
      width:100%;
      height:5rem;
    }
  }
  .evaluate-area{
    width:63.5%;
    .label-title{      
      margin-top:0.3rem;
      width:auto;
      text-align:right;
    }
    input{
      font-size:1rem;
      width:7rem;
    }
    textarea{
      margin-top:0.4rem;
      width:100%;
      height:5rem;
    }
  }
  
`;

class Summary extends Component {
    constructor(props) {
        super(props);
        this.state ={};
        var summary_data = this.props.general_data.summary_data;        
        Object.keys(summary_data).map(key => {        
          this.state[key] = summary_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.summary_data).map(key => {
        state_variabel[key] = nextProps.general_data.summary_data[key];
      })
      state_variabel['general_data'] = nextProps.general_data;      
      this.setState(state_variabel);      
    }

    getInputdate = (value) => {
      this.setState({evaluation_at:value})
    }

    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.summary_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.summary_data[name] = e.target.value;
      this.props.handleGeneralOk(general_data, true, name, 'summary');
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.summary_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }
    
    
    render() {      
        return (
            <Wrapper>              
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>健康知覚-健康管理</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'health_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'health_perception_health_care_flag')}
                          checked = {this.state.health_perception_health_care_flag == 0?true:false}
                          name={`healty`}
                        />
                        <Radiobox
                          id = {'health_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'health_perception_health_care_flag')}
                          checked = {this.state.health_perception_health_care_flag == 1?true:false}
                          name={`healty`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.health_perception_health_care_flag != 1} onChange={this.getInputText.bind(this,'health_perception_health_care')} value={this.state.health_perception_health_care}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>栄養-代謝</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'nutrity_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'nutrition_metabolism_flag')}
                          checked={this.state.nutrition_metabolism_flag == 0 ? true : false}
                          name={`nutrity`}
                        />
                        <Radiobox
                          id = {'nutrity_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'nutrition_metabolism_flag')}
                          checked={this.state.nutrition_metabolism_flag == 1 ? true : false}
                          name={`nutrity`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.nutrition_metabolism_flag != 1} onChange={this.getInputText.bind(this, 'nutrition_metabolism')} value={this.state.nutrition_metabolism}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>排泄</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'excretion_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this,'excretion_flag')}
                          checked={this.state.excretion_flag == 0 ? true : false}
                          name={`excretion`}
                        />
                        <Radiobox
                          id = {'excretion_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this,'excretion_flag')}
                          checked={this.state.excretion_flag == 1 ? true : false}
                          name={`excretion`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.excretion_flag != 1} onChange={this.getInputText.bind(this, 'excretion')} value={this.state.excretion}></textarea>
                </div>
              </div>
              
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>活動-運動</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'exercise_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'activity_exercise_flag')}
                          checked={this.state.activity_exercise_flag == 0 ? true : false}
                          name={`exercise`}
                        />
                        <Radiobox
                          id = {'exercise_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'activity_exercise_flag')}
                          checked={this.state.activity_exercise_flag == 1 ? true : false}
                          name={`exercise`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.activity_exercise_flag != 1} onChange ={this.getInputText.bind(this, 'activity_exercise')} value={this.state.activity_exercise}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>睡眠-休息</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'rest_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'sleep_rest_flag')}
                          checked={this.state.sleep_rest_flag == 0 ? true : false}
                          name={`rest`}
                        />
                        <Radiobox
                          id = {'rest_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'sleep_rest_flag')}
                          checked={this.state.sleep_rest_flag == 1 ? true : false}
                          name={`rest`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.sleep_rest_flag != 1} onChange={this.getInputText.bind(this, 'sleep_rest')} value={this.state.sleep_rest}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>認知-知覚</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'perception_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'cognition_perception_flag')}
                          checked={this.state.cognition_perception_flag == 0 ? true : false}
                          name={`perception`}
                        />
                        <Radiobox
                          id = {'perception_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'cognition_perception_flag')}
                          checked={this.state.cognition_perception_flag == 1 ? true : false}
                          name={`perception`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.cognition_perception_flag != 1} onChange={this.getInputText.bind(this, 'cognition_perception')} value={this.state.cognition_perception}></textarea>
                </div>
              </div>
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>自己知覚-自己概念</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'self_perception_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this,'self_perception_flag')}
                          checked={this.state.self_perception_flag == 0 ? true : false}
                          name={`self_perception`}
                        />
                        <Radiobox
                          id = {'self_perception_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this,'self_perception_flag')}
                          checked={this.state.self_perception_flag == 1 ? true : false}
                          name={`self_perception`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.self_perception_flag != 1} onChange={this.getInputText.bind(this,'self_perception')} value={this.state.self_perception}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>役割-関係</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'role_relation_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'role_relationship_flag')}
                          checked={this.state.role_relationship_flag == 0 ? true : false}
                          name={`role_relation`}
                        />
                        <Radiobox
                          id = {'role_relation_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'role_relationship_flag')}
                          checked={this.state.role_relationship_flag == 1 ? true : false}
                          name={`role_relation`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.role_relationship_flag != 1} onChange={this.getInputText.bind(this,'role_relationship')} value={this.state.role_relationship}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>性-生殖</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'gender_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'sexual_reproduction_flag')}
                          checked={this.state.sexual_reproduction_flag == 0 ? true : false}
                          name={`gender`}
                        />
                        <Radiobox
                          id = {'gender_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'sexual_reproduction_flag')}
                          checked={this.state.sexual_reproduction_flag == 1 ? true : false}
                          name={`gender`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.sexual_reproduction_flag != 1} onChange={this.getInputText.bind(this, 'sexual_reproduction')} value={this.state.sexual_reproduction}></textarea>
                </div>
              </div>
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>コーピング-ストレス耐性</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'stress_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'coping_stress_resistance_flag')}
                          checked={this.state.coping_stress_resistance_flag == 0 ? true : false}
                          name={`stress`}
                        />
                        <Radiobox
                          id = {'stress_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'coping_stress_resistance_flag')}
                          checked={this.state.coping_stress_resistance_flag == 1 ? true : false}
                          name={`stress`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.coping_stress_resistance_flag != 1} onChange={this.getInputText.bind(this, 'coping_stress_resistance')} value={this.state.coping_stress_resistance}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>価値-信念</label>
                    <div className='float-right'>
                      <label className='radio-title-label'>問題	</label>
                        <Radiobox
                          id = {'value_belief_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'value_belief_flag')}
                          checked={this.state.value_belief_flag == 0 ? true : false}
                          name={`value_belief`}
                        />
                        <Radiobox
                          id = {'value_belief_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'value_belief_flag')}
                          checked={this.state.value_belief_flag == 1 ? true : false}
                          name={`value_belief`}
                        />
                    </div>
                  </div>
                  <textarea disabled={this.state.value_belief_flag != 1} onChange={this.getInputText.bind(this, 'value_belief')} value={this.state.value_belief}></textarea>
                </div>
                <div className='one-blog'>
                </div>
              </div>              
              <div className='evaluate-area'>
                <div className='sub-title'>総合評価</div>
                <InputWithLabelBorder
                  label="評価日"
                  type="date"                      
                  getInputText={this.getInputdate.bind(this)}
                  diseaseEditData={formatDateTimeIE(this.state.evaluation_at)}
                />
                <textarea onChange={this.getInputText.bind(this, 'comprehensive_evaluation')} value={this.state.comprehensive_evaluation}></textarea>
              </div>
              </Wrapper>
        );
    }
}

Summary.contextType = Context;

Summary.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo:PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default Summary;