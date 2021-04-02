import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import Checkbox from "~/components/molecules/Checkbox";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";

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
    font-wieght:bold;
  }
  
  .blog-title{
    font-size:1rem;    
  }
  .numerical-title{
    font-size:1rem;
    margin-bottom:0.1rem;
  }
  .one-row{
    display:flex;
    margin-bottom:1rem;
    width:100%;
    justify-content: space-between;
  }
  .label-title{
    display:none;
  }
  input[type='text']{
    font-size:1rem!important;
    max-width:5rem;
    height:1.5rem;
  }
  .small-input{
    margin-right:10px;
    div{
      margin-top:2px;
    }
  }
  .radio-area{
    label{
      margin-top:0.2rem;   
    }
  }
  .label-unit{
    width:auto;
    margin-left:3px;
    margin-top:0.3rem!important;
    margin-left:0;
    margin-bottom:0px; 
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

  textarea{
    height:5rem;
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
  .numeric-block{
    div{
      margin-top:2px;
    }
  }
  
`;

class Gender extends Component {
    constructor(props) {
        super(props);
        this.state ={};
        var gender_data = this.props.general_data.gender_data;
        Object.keys(gender_data).map(key => {
          this.state[key] = gender_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.gender_data).map(key => {
        state_variabel[key] = nextProps.general_data.gender_data[key];
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
      general_data.gender_data[name] = input_value;
      this.props.handleGeneralOk(general_data);
    }
    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.gender_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.gender_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'gender_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.gender_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }
    
    render() {
        return (
            <Wrapper>              
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>生殖器疾患</label>
                    <div className='float-right'>                      
                      <Radiobox
                        id = {'genital_disease_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'with_or_without_genital_disease')}
                        checked={this.state.with_or_without_genital_disease == 0 ? true : false}
                        name={`genital_disease`}
                      />
                      <Radiobox
                        id = {'genital_disease_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'with_or_without_genital_disease')}
                        checked={this.state.with_or_without_genital_disease == 1 ? true : false}
                        name={`genital_disease`}
                      />
                    </div>
                  </div>
                  <textarea value={this.state.genital_disease} disabled={this.state.with_or_without_genital_disease!=1} onChange={this.getInputText.bind(this,'genital_disease')}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>更年期障害</label>
                    <div className='float-right'>                      
                        <Radiobox
                          id = {'menopause_disorder_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_menopause_symptom')}
                          checked={this.state.with_or_without_menopause_symptom == 0 ? true : false}
                          name={`menopause_disorder`}
                        />
                        <Radiobox
                          id = {'menopause_disorder_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_menopause_symptom')}
                          checked={this.state.with_or_without_menopause_symptom == 1 ? true : false}
                          name={`menopause_disorder`}
                        />
                    </div>
                  </div>
                  <textarea value={this.state.menopause_symptom} disabled={this.state.with_or_without_menopause_symptom!=1} onChange={this.getInputText.bind(this, 'menopause_symptom')}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>性に対する問題</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'sexual_problem')} value={this.state.sexual_problem}></textarea>
                </div>
              </div>

              <div className='sub-title'>女性</div>
              <div className='flex' style={{marginBottom:'2rem'}}>
                <div className='flex' style={{width:'auto'}}>
                  <div className='small-input border-block'>
                    <div className='title-label'>初経年齢</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'歳'}
                      maxLength={ 4 }
                      max={9999}
                      min = {0}                      
                      className="form-control"
                      value={this.state.menarche_age}
                      getInputText={this.getInputNumber.bind(this, "menarche_age")}
                      inputmode="numeric"
                    />
                  </div>
                  <div className='small-input border-block'>
                    <div className='title-label'>閉経年齢</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'歳'}
                      maxLength={ 4 }
                      max={9999}
                      min = {0}
                      className="form-control"
                      value={this.state.menopause_age}
                      getInputText={this.getInputNumber.bind(this, "menopause_age")}
                      inputmode="numeric"
                    />
                  </div>
                  <div className='small-input border-block'>
                    <div className='title-label'>月経周期</div>
                    <div className='flex radio-area'>
                      <Radiobox
                        id = {'menstrual_cycle_no'}
                        label={'順調'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'menstrual_cycle')}
                        checked={this.state.menstrual_cycle == 0 ? true : false}
                        name={`menstrual_cycle`}
                      />
                      <Radiobox
                        id = {'menstrual_cycle_yes'}
                        label={'不順'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'menstrual_cycle')}
                        checked={this.state.menstrual_cycle == 1 ? true : false}
                        name={`menstrual_cycle`}
                      />
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'日周期'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.menstrual_cycle_days}
                        getInputText={this.getInputNumber.bind(this, "menstrual_cycle_days")}
                        inputmode="numeric"                        
                      />
                    </div>
                    
                  </div>
                </div>
                <div className='flex' style={{width:'50%'}}>
                  <div className='small-input border-block'>
                    <div className='title-label'>月経日数</div>
                    <NumericInputWithUnitLabel
                      label={''}
                      unit={'日間'}
                      maxLength={ 4 }
                      max={9999}
                      min = {0}
                      className="form-control"
                      value={this.state.menstruation_period_of_days}
                      getInputText={this.getInputNumber.bind(this, "menstruation_period_of_days")}
                      inputmode="numeric"
                    />
                  </div>
                  <div className='small-input radio-area border-block'>
                    <div className='title-label'>月経量</div>
                    <Radiobox
                      id = {'menstruation_1'}
                      label={'多い'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'menstrual_blood_loss')}
                      checked={this.state.menstrual_blood_loss == 1 ? true : false}
                      name={`menstrual_blood_loss`}
                    />
                    <Radiobox
                      id = {'menstruation_2'}
                      label={'普通'}
                      value={2}
                      getUsage={this.getInputText.bind(this, 'menstrual_blood_loss')}
                      checked={this.state.menstrual_blood_loss == 2 ? true : false}
                      name={`menstrual_blood_loss`}
                    />
                    <Radiobox
                      id = {'menstruation_3'}
                      label={'少ない'}
                      value={3}
                      getUsage={this.getInputText.bind(this, 'menstrual_blood_loss')}
                      checked={this.state.menstrual_blood_loss == 3 ? true : false}
                      name={`menstrual_blood_loss`}
                    />
                  </div>
                  <div className='small-input radio-area border-block text-center' style={{width:'10rem'}}>
                    <div className='title-label'>不正出血の有無</div>
                    <Radiobox
                      id = {'abnormal_vaginal_bleeding_no'}
                      label={'無'}
                      value={0}
                      getUsage={this.getInputText.bind(this, 'with_or_without_abnormal_vaginal_bleeding')}
                      checked={this.state.with_or_without_abnormal_vaginal_bleeding == 0 ? true : false}
                      name={`with_or_without_abnormal_vaginal_bleeding`}
                    />
                    <Radiobox
                      id = {'abnormal_vaginal_bleeding_yes'}
                      label={'有'}
                      value={1}
                      getUsage={this.getInputText.bind(this, 'with_or_without_abnormal_vaginal_bleeding')}
                      checked={this.state.with_or_without_abnormal_vaginal_bleeding == 1 ? true : false}
                      name={`with_or_without_abnormal_vaginal_bleeding`}
                    />                    
                  </div>
                </div>
              </div>              
              <div className='flex' style={{marginBottom:'2rem'}}>
                <div className='' style={{width:'47%', marginRight:'3%'}}>
                  <div className='border-block'>
                    <div className='title-label'>月経随伴症状</div>
                    <div className='flex' style={{width:'100%'}}>
                      <div className='' style={{width:'8rem'}}>
                        <Radiobox
                          id = {'concomitant_symptoms_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_concomitant_symptoms')}
                          checked={this.state.with_or_without_concomitant_symptoms == 0 ? true : false}
                          name={`menstruation`}
                        />
                        <Radiobox
                          id = {'concomitant_symptoms_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_concomitant_symptoms')}
                          checked={this.state.with_or_without_concomitant_symptoms == 1 ? true : false}
                          name={`menstruation`}
                        />
                      </div>
                      <div style={{width:'calc(100% - 8rem)'}}>
                        <div className='flex' style={{marginBottom:'0.3rem'}}>
                          <Checkbox
                            label={'腰痛'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.back_pain_flag}
                            name="back_pain_flag"
                            isDisabled = {this.state.with_or_without_concomitant_symptoms != 1}
                          />
                          <Checkbox
                            label={'腹痛'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.stomach_ache_flag}
                            name="stomach_ache_flag"
                            isDisabled = {this.state.with_or_without_concomitant_symptoms != 1}
                          />
                          <Checkbox
                            label={'下痢'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.diarrhea_flag}
                            name="diarrhea_flag"
                            isDisabled = {this.state.with_or_without_concomitant_symptoms != 1}
                          />
                          <Checkbox
                            label={'便秘'}                      
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.constipation_flag}
                            name="constipation_flag"
                            isDisabled = {this.state.with_or_without_concomitant_symptoms != 1}
                          />
                        </div>
                        <div className='flex'>
                          <Checkbox
                            label={'その他'}
                            getRadio={this.selectCheckBox.bind(this)}
                            value = {this.state.other_concomitant_symptoms_flag}
                            name="other_concomitant_symptoms_flag"
                            isDisabled = {this.state.with_or_without_concomitant_symptoms != 1}
                          />
                          <textarea disabled={this.state.with_or_without_concomitant_symptoms != 1 || this.state.other_concomitant_symptoms_flag != 1}
                            style={{width:'calc(100% - 6rem)'}} onChange={this.getInputText.bind(this,'other_concomitant_symptoms')} value={this.state.other_concomitant_symptoms}></textarea>
                        </div>
                      </div>
                    </div>
                
                  </div>
                </div>
                  
                <div className='' style={{width:'47%', marginRight:'3%'}}>
                  <div className='border-block'>
                    <div className='title-label'>鎮痛薬の使用</div>
                    <div className='flex'>
                      <div className='' style={{width:'8rem'}}>
                        <Radiobox
                          id = {'medicine_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'use_of_analgesics')}
                          checked={this.state.use_of_analgesics == 0 ? true : false}
                          name={`medicine`}
                        />
                        <Radiobox
                          id = {'medicine_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'use_of_analgesics')}
                          checked={this.state.use_of_analgesics == 1 ? true : false}
                          name={`medicine`}
                        />
                      </div>
                      <div style={{width:'calc(100% - 8rem)', paddingTop:'0.3rem'}} className='flex'>
                        <div style={{marginRight:'0.6rem'}}>薬名</div>
                        <textarea disabled={this.state.use_of_analgesics != 1} style={{width:'calc(100% - 3rem)'}} onChange={this.getInputText.bind(this, 'analgesics_name')} value={this.state.analgesics_name}></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex'>
                <div className='flex' style={{width:'47%', marginRight:'3%', paddingTop:'1rem'}}>
                  <div className='numeric-block'>
                    <div className='border-block'>
                      <div className='title-label'>妊娠回数</div>
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'回'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.number_of_pregnancy}
                        getInputText={this.getInputNumber.bind(this, "number_of_pregnancy")}
                        inputmode="numeric"
                      />
                    </div>
                  </div>
                  <div className='numeric-block'>
                    <div className='border-block'>
                      <div className='title-label'>自然分娩</div>
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'回'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.natural_delivery}
                        getInputText={this.getInputNumber.bind(this, "natural_delivery")}
                        inputmode="numeric"
                      />
                    </div>
                  </div>
                  <div className='numeric-block'>
                    <div className='border-block'>
                      <div className='title-label'>帝王切開</div>
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'回'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.caesarean_section}
                        getInputText={this.getInputNumber.bind(this, "caesarean_section")}
                        inputmode="numeric"
                      />
                    </div>
                  </div>
                  <div className='numeric-block'>
                    <div className='border-block'>
                      <div className='title-label'>自然流産</div>
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'回'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.spontaneous_abortion}
                        getInputText={this.getInputNumber.bind(this, "spontaneous_abortion")}
                        inputmode="numeric"
                      />
                    </div>
                  </div>
                  <div className='numeric-block'>
                    <div className='border-block'>
                      <div className='title-label'>人工流産</div>
                      <NumericInputWithUnitLabel
                        label={''}
                        unit={'回'}
                        maxLength={ 4 }
                        max={9999}
                        min = {0}
                        className="form-control"
                        value={this.state.artificial_abortion}
                        getInputText={this.getInputNumber.bind(this, "artificial_abortion")}
                        inputmode="numeric"
                      />
                    </div>
                  </div>
                </div>
                <div className='' style={{width:'47%', marginRight:'3%'}}>
                  <div className='numerical-title'>避妊方法</div>
                  <textarea onChange={this.getInputText.bind(this, 'contraception_method')} style={{width:'100%'}} value={this.state.contraception_method}></textarea>
                </div>
              </div>

              <div className='other-area one-row flex' style={{marginTop:'1rem'}}>
                <div className='one-blog' style={{width:'47%'}}>                  
                  <div className=''>その他</div>                  
                  <textarea onChange={this.getInputText.bind(this, 'other')} value={this.state.other}></textarea>
                </div>
                <div className='one-blog' style={{width:'47%'}}>                  
                  <div className=''>要約</div>                  
                  <textarea onChange={this.getInputText.bind(this, 'summary')} value={this.state.summary}></textarea>
                </div>                
              </div>
              </Wrapper>
        );
    }
}

Gender.contextType = Context;

Gender.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default Gender;
