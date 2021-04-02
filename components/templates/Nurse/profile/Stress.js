import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
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
   font-size:1rem;
 }
  .sub-title{
    font-size:1.1rem;
    margin-bottom:0.3rem;
    font-weight:bold;
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
      height:6rem;
    }
    label{
      margin-top:3px;
    }
    .inputbox-area{
      width: calc( 100% - 6.5rem);
      div{
        margin-top:0;
      }      
      .label-title{
        width:3rem;
        text-align:right;
        margin-right:0.5rem;
        margin-top:6px;
      }      
      input{
        width:100%;
        height:2rem;
      }
    }
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

class Stress extends Component {
    constructor(props) {
        super(props);        
        this.state ={};
        var stress_data = this.props.general_data.stress_data;
        Object.keys(stress_data).map(key => {
          this.state[key] = stress_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.stress_data).map(key => {
        state_variabel[key] = nextProps.general_data.stress_data[key];
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
      general_data.stress_data[name] = input_value;
      this.props.handleGeneralOk(general_data);
    }
    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.stress_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.stress_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'stress_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.stress_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }
    
    render() {
        return (
            <Wrapper>
              <div className='sub-title' style={{marginTop:'2rem'}}>過去</div>
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className=''>一番ストレスを感じたこと</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'past_stress')} value={this.state.past_stress}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className=''>心身の変化</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'changes_in_the_past')} value={this.state.changes_in_the_past}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className='blog-title'>対処法</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'how_to_deal_with_the_past')} value={this.state.how_to_deal_with_the_past}></textarea>
                </div>
              </div>
              <div className='sub-title'>現在</div>
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className=''>ストレスに感じていること</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'present_stress')} value={this.state.present_stress}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className=''>心身の変化</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'changes_in_the_present')} value={this.state.changes_in_the_present}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className=''>対処法</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'how_to_deal_with_the_present')} value={this.state.how_to_deal_with_the_present}></textarea>
                </div>
              </div>
              <div className='one-row'>
                <div className='one-blog'>
                  <div className='flex'>
                    <label className=''>趣味</label>
                  </div>
                  <textarea onChange={this.getInputText.bind(this, 'hobby')} value={this.state.hobby}></textarea>
                </div>
                <div className='one-blog' style={{paddingTop:'2rem'}}>                  
                  <div className='border-block'>
                    <div className='title-label'>相談相手の有無</div>
                    <div className='flex'>
                      <Radiobox
                        id = {'discussion_no'}
                        label={'無'}
                        value={0}
                        getUsage={this.getInputText.bind(this, 'adviser')}
                        checked={this.state.adviser == 0 ? true : false}
                        name={`discussion`}
                      />
                      <Radiobox
                        id = {'discussion_yes'}
                        label={'有'}
                        value={1}
                        getUsage={this.getInputText.bind(this, 'adviser')}
                        checked={this.state.adviser == 1 ? true : false}
                        name={`discussion`}
                      />
                      <div className='inputbox-area'>
                        <InputWithLabelBorder
                          label="関係"
                          type="text"
                          getInputText={this.getInputText.bind(this, 'relationship')}
                          diseaseEditData={this.state.relationship}
                          isDisabled = {this.state.adviser!=1}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='one-blog'></div>
              </div>
              <div className='other-area flex'>
                <div className='one-blog'>                  
                  <div className=''>その他</div>                  
                  <textarea onChange={this.getInputText.bind(this, 'other')} value={this.state.other}></textarea>
                </div>
                <div className='one-blog'>                  
                  <div className=''>要約</div>
                  <textarea onChange={this.getInputText.bind(this, 'summary')} value={this.state.summary}></textarea>
                </div>
              </div>
              </Wrapper>
        );
    }
}

Stress.contextType = Context;

Stress.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default Stress;
