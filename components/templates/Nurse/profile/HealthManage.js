import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  font-size: 1rem;
  width: 100%;
  height: auto;
  padding-top:2rem;
  padding-left:1rem;
  padding-right:1rem;
 .react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
 }
 input[type="text"]{
  font-size:1rem!important;
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
    width:45%;
    // margin-right:5%;
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
  .one-third{    
    width:30%;
    // margin-right:3%;
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
  .other-area{
    width:85%;    
  }
  .label-title{
    margin-left:10px;
    margin-top:0rem;
    width:4rem;
    text-align:right;
  }
  .label-unit{
    margin-top:0px;
    width:auto;
    margin-right:0;
  }
  input[type=text]{
    font-size:1rem;
    max-width:5rem;
    height:1.5rem;
  }
  .wine, .smoke{
    width:auto;    
    padding-right:0;
    div{
      margin-top:0px;
    }
  }
  .wine{
    width:auto;
    padding-right:0;
  }  
  #wine-content, #smoke-content{
    max-width:30rem;
    width:23rem;
  }
  .border-block{
    border: 1px solid #aaa;
    position: relative;
    padding-left:0.5rem;
    padding-right:0.5rem;
    padding-top:0.7rem;
    padding-bottom:0.4rem;
    margin-right:1rem;
    .title-label{
      position:absolute;
      top:-0.8rem;
      left:0.5rem;
      background:white;
    }
    label{
      margin-right:0.5rem;
    }
    .border-label{
      margin-left:1rem;
    }
  }
  .blood{
    width:auto;
    margin-right:0;
  }
`;

class HealthManage extends Component {
    constructor(props) {
        super(props);
        this.state ={};
        var health_data = this.props.general_data.health_data;
        Object.keys(health_data).map(key => {
          this.state[key] = health_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.health_data).map(key => {
        state_variabel[key] = nextProps.general_data.health_data[key];
      })
      state_variabel['general_data'] = nextProps.general_data;      
      this.setState(state_variabel);
    }

    getInputNumber =(name, e) => {      
      if (typeof e == 'number') e = e.toString();
      let input_value = e != null ? e.replace(/[^0-9０-９][/./][0-9０-９]/g, ""):'';       
      if (input_value != "") {
        input_value = (toHalfWidthOnlyNumber(input_value));
      } else {
        input_value = null;
      }
      this.setState({
        [name]:input_value,
      })

      var general_data = this.state.general_data;
      general_data.health_data[name] = input_value;
      this.props.handleGeneralOk(general_data);
    }
    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.health_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.health_data[name] = e.target.value;      
      if (name == 'summary'){        
        this.props.handleGeneralOk(general_data, true, 'health_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.health_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }
    
    render() {
        return (
            <Wrapper>              
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>診断名</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'diagnosis')} value={this.state.diagnosis}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>医師の説明</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'doctor_explanation')} value={this.state.doctor_explanation}></textarea>
                </div>
              </div>
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>本人の理解</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'the_person_understanding')} value={this.state.the_person_understanding}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>家族・協力者の理解</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'family_supporter_understanding')} value={this.state.family_supporter_understanding}></textarea>
                </div>
              </div>              
              
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>健康のために気を付けていること</label>
                    <div className='float-right'>                      
                      <Radiobox
                        id = {'careful_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'with_or_without_for_health')}
                        checked={this.state.with_or_without_for_health == 0 ? true : false}
                        name={`careful`}
                      />
                      <Radiobox
                        id = {'careful_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'with_or_without_for_health')}
                        checked={this.state.with_or_without_for_health == 1 ? true : false}
                        name={`careful`}
                      />
                    </div>
                  </div>
                  <textarea disabled={this.state.with_or_without_for_health != 1} onChange={this.getInputText.bind(this, 'for_health')} value={this.state.for_health}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>今後の対処</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'coping')} value={this.state.coping}></textarea>
                </div>
              </div>
              <div className='one-row'>
                <div className='one-third'>
                  <div className='flex'>
                    <label className='blog-title'>既往症</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'medical_history')} value={this.state.medical_history}></textarea>
                </div>
                <div className='one-third'>
                  <div className='flex'>
                    <label className='blog-title'>アレルギー</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'allergy')} value={this.state.allergy}></textarea>
                </div>
                <div className='one-third'>
                  <div className='flex'>
                    <label className='blog-title'>感染症</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'infection')} value={this.state.infection}></textarea>
                </div>              
              </div>
              <div className='one-row' style={{width:'100%', justifyContent:'flex-start'}}>
                <div className='wine border-block'>                  
                  <div className='title-label'>飲酒</div>
                  <div className='flex'>
                    <Radiobox
                      id = {'wine_no'}
                      label={'無'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'drinking')}
                      checked={this.state.drinking == 0 ? true : false}
                      name={`wine`}
                    />
                    <Radiobox
                      id = {'wine_yes'}
                      label={'有'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'drinking')}
                      checked={this.state.drinking == 1 ? true : false}
                      name={`wine`}
                    />
                    <NumericInputWithUnitLabel
                      label={'頻度'}
                      unit={'回/週'}
                      maxLength={ 4 }
                      max={9999}
                      min = {0}
                      className="form-control"
                      value={this.state.frequency_of_drinking}                      
                      getInputText={this.getInputNumber.bind(this, 'frequency_of_drinking')}
                      inputmode="numeric"
                      disabled = {this.state.drinking != 1}
                    />
                    <NumericInputWithUnitLabel
                      label={'量'}
                      unit={'合/日'}
                      maxLength={ 4 }
                      max={9999}
                      min = {0}
                      className="form-control"
                      value={this.state.amount_of_drinking}                      
                      getInputText={this.getInputNumber.bind(this, 'amount_of_drinking')}
                      inputmode="numeric"
                      disabled = {this.state.drinking != 1}
                    />
                  </div>
                  <div className='flex'>
                    <Radiobox
                      id = {'wine_stop'}
                      label={'禁酒'}
                      value={2}
                      getUsage={this.getInputText.bind(this, 'drinking')}
                      checked={this.state.drinking == 2 ? true : false}
                      name={`wine`}
                    />
                    <InputWithLabelBorder
                      label="内容"
                      type="text"
                      id = 'wine-content'
                      getInputText={this.getInputText.bind(this, 'drinking_content')}
                      diseaseEditData={this.state.drinking_content}
                      isDisabled = {this.state.drinking != 1}
                    />
                  </div>
                </div>
                <div className='smoke border-block'>                  
                  <div className='title-label'>喫煙</div>                  
                  <div className='flex'>
                    <Radiobox
                      id = {'smoke_no'}
                      label={'吸わない'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'smoking')}
                      checked={this.state.smoking == 0 ? true : false}
                      name={`smoke`}
                    />
                    <Radiobox
                      id = {'smoke_yes'}
                      label={'吸う'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'smoking')}
                      checked={this.state.smoking == 1 ? true : false}
                      name={`smoke`}
                    />
                    <NumericInputWithUnitLabel
                      label={'本数'}
                      unit={'本/日'}
                      maxLength={ 4 }
                      max={9999}
                      min = {0}
                      className="form-control"
                      value={this.state.number_of_smoking}                      
                      getInputText={this.getInputNumber.bind(this, 'number_of_smoking')}
                      inputmode="numeric"
                      disabled = {this.state.smoking != 1}
                    />
                    <NumericInputWithUnitLabel
                      label={'喫煙年数'}
                      unit={'年'}
                      maxLength={ 4 }
                      max={9999}
                      min = {0}
                      className="form-control"
                      value={this.state.years_of_smoking}
                      getInputText={this.getInputNumber.bind(this, 'years_of_smoking')}
                      inputmode="numeric"
                      disabled = {this.state.smoking != 1}
                    />
                  </div>
                  <div className='flex'>
                    <Radiobox
                      id = {'smoke_stop'}
                      label={'禁煙'}
                      value={2}
                      getUsage={this.getInputText.bind(this, 'smoking')}
                      checked={this.state.smoking == 2 ? true : false}
                      name={`smoke`}
                    />                    
                  </div>
                </div>
                <div className='blood'>                
                  <div className='border-block'>
                    <div className='title-label'>輸血歴</div>                
                    <div className='flex'>
                      <Radiobox
                        id = {'blood_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'blood_transfusion_history')}
                        checked={this.state.blood_transfusion_history == 0 ? true : false}
                        name={`blood`}
                      />
                      <Radiobox
                        id = {'blood_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'blood_transfusion_history')}
                        checked={this.state.blood_transfusion_history == 1 ? true : false}
                        name={`blood`}
                      />
                    </div>
                  </div>                  
                </div>
              </div>
              
              <div className='one-row flex'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>その他</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'other')} value={this.state.other}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>要約</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'summary')} value={this.state.summary}></textarea>
                </div>
              </div>
              </Wrapper>
        );
    }
}

HealthManage.contextType = Context;

HealthManage.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default HealthManage;
