import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
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
  .picturebox{
    height: calc(100% - 2rem);
    border:1px solid;
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
    .inputbox-area{
      .label-title{
        width:3rem;
        text-align:right;
        margin-right:0.5rem;
      }
      input{
        width:100%;
      }
    }
  }
  .text-title-label{
    width:5rem;
    text-align:right;
    margin-right:1rem;

  }
  .other-area{
    width:100%;
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
`;

class RoleRelation extends Component {
    constructor(props) {
        super(props);        
        this.state ={};
        var role_data = this.props.general_data.role_data;
        Object.keys(role_data).map(key => {
          this.state[key] = role_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }    

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.role_data).map(key => {
        state_variabel[key] = nextProps.general_data.role_data[key];
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
      general_data.role_data[name] = input_value;
      this.props.handleGeneralOk(general_data);
    }
    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.role_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.role_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'role_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.role_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }
    
    render() {
        return (
            <Wrapper>              
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>家族構成図</label>
                  </div>
                  <div className='picturebox'>
                    <img></img>
                  </div>                  
                </div>
                <div className='one-blog' style={{paddingTop:'2rem'}}>
                  <div className='border-block'>
                    <div className='title-label'>家庭内での役割</div>
                    <div className='flex' style={{marginBottom:'0.3rem'}}>
                      <Checkbox
                        label={'意思決定'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.decision_making_flag}
                        name="decision_making_flag"
                      />
                      <Checkbox
                        label={'収入源'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.source_of_income_flag}
                        name="source_of_income_flag"
                      />
                      <Checkbox
                        label={'家事'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.housework_flag}
                        name="housework_flag"
                      />
                      <Checkbox
                        label={'育児'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.childcare_flag}
                        name="childcare_flag"
                      />
                      <Checkbox
                        label={'介護'}                      
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.long_term_care_flag}
                        name="long_term_care_flag"
                      />
                    </div>
                    <div className='flex' style={{marginBottom:'0.5rem'}}>
                      <Checkbox
                        label={'その他'}
                        getRadio={this.selectCheckBox.bind(this)}
                        value = {this.state.other_domestic_role_flag}
                        name="other_domestic_role_flag"
                      />
                      <textarea value={this.state.other_domestic_role} disabled={this.state.other_domestic_role_flag!=1} style={{width:'calc(100% - 6rem)'}} onChange={this.getInputText.bind(this, 'other_domestic_role')}></textarea>
                    </div>
                  </div>

                  <div className='blog-title'>職業</div>
                  <div className='flex'>
                    <div style={{width:'50%'}}>
                      <input style={{width:'95%'}} onChange={this.getInputText.bind(this, 'occupation')} value={this.state.occupation}></input>
                    </div>
                    <div style={{width:'50%'}}>
                      <div className='flex'>
                        <div className='text-title-label'>仕事内容</div>
                        <textarea style={{width:'calc(100% - 6rem)'}} onChange={this.getInputText.bind(this, 'job_description')} value={this.state.job_description}></textarea>
                      </div>
                      <div className='flex'>
                        <div className='text-title-label'>役割</div>
                        <textarea style={{width:'calc(100% - 6rem)'}} onChange={this.getInputText.bind(this, 'job_role')} value={this.state.job_role}></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>              
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>グループ活動・地域活動</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'group_activity')} value={this.state.group_activity}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>面会状況</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'visit_status')} value={this.state.visit_status}></textarea>
                </div>                
              </div>
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>入院により生じる問題</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'problem')} value={this.state.problem}></textarea>
                </div>
                <div className='one-blog' style={{paddingTop:'1rem'}}>
                  <div className='border-block'>
                    <div className='title-label'>経済的心配</div>
                    <div className='flex'>
                      <div style={{width:'8rem'}}>
                        <Radiobox
                          id = {'economics_no'}
                          label={'無'}
                          value={0}
                          getUsage={this.getInputText.bind(this, 'with_or_without_financial_concern')}
                          checked={this.state.with_or_without_financial_concern == 0 ? true : false}
                          name={`economics`}
                        />
                        <Radiobox
                          id = {'economics_yes'}
                          label={'有'}
                          value={1}
                          getUsage={this.getInputText.bind(this, 'with_or_without_financial_concern')}
                          checked={this.state.with_or_without_financial_concern == 1 ? true : false}
                          name={`economics`}
                        />
                      </div>
                      <textarea value={this.state.financial_concern} disabled={this.state.with_or_without_financial_concern!=1} style={{width:'calc(100% - 8rem)'}} onChange={this.getInputText.bind(this, 'financial_concern')}></textarea>
                    </div>
                  </div>
                </div>                
              </div>
              <div className='other-area one-row flex'>
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

RoleRelation.contextType = Context;

RoleRelation.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default RoleRelation;
