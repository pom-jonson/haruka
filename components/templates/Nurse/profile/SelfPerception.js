import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
// import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";

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
  
  .blog-title{
    margin-top:0.5rem;
    font-size:1rem;
    height:1.5rem;
    margin-bottom:0.2rem;
  }
  .title-label{
    width:3rem;
    text-align:left;    
    font-size:1rem;
  }
  .one-row{
    display:flex;
    margin-bottom:1rem;
    width:100%;
    justify-content: space-between;    
  }
  .one-blog{
    width:47%;
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
      width:calc(100% - 3rem);
      height:5rem;
    }
  }
  .evaluate-area{
    width:63.5%;
    .label-title{
      margin-left:10px;
      margin-top:0.3rem;
      width:4rem;
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
  .other-area{
    .one-blog{
      width:45%;
    }
    textarea{
      width:100%;
    }
  }
  .wp100{
    width:100%;
  }
`;

class SelfPerception extends Component {
    constructor(props) {
        super(props);        
        this.state ={};
        var self_perception_data = this.props.general_data.self_perception_data;
        Object.keys(self_perception_data).map(key => {
          this.state[key] = self_perception_data[key]
        });
        this.state['general_data'] = this.props.general_data;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      var state_variabel = {};
      Object.keys(nextProps.general_data.self_perception_data).map(key => {
        state_variabel[key] = nextProps.general_data.self_perception_data[key];
      })
      state_variabel['general_data'] = nextProps.general_data;      
      this.setState(state_variabel);
    }

    selectCheckBox = (name, value) => {
      this.setState({[name]:value})
      var general_data = this.state.general_data;
      general_data.self_perception_data[name] = value;
      this.props.handleGeneralOk(general_data);
    }

    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      var general_data = this.state.general_data;
      general_data.self_perception_data[name] = e.target.value;
      if (name == 'summary'){
        this.props.handleGeneralOk(general_data, true, 'self_perception_data');
      } else {
        this.props.handleGeneralOk(general_data);
      }
    }

    getSelect = (name, e) => {      
      this.setState({[name]:e.target.id});
      var general_data = this.state.general_data;
      general_data.self_perception_data[name] = e.target.id;
      this.props.handleGeneralOk(general_data);
    }
    
    render() {
        return (
            <Wrapper>              
              <div className='other-area flex' style={{paddingLeft:'5rem'}}>
                <div className='one-blog'>
                  <div className='blog-title'>性格</div>
                  <div className='title-label'>長所</div>
                  <textarea style={{width:'calc(100% - 0rem)'}} onChange={this.getInputText.bind(this, 'strong_point')} value={this.state.strong_point}></textarea>
                  
                </div>
                <div className='one-blog'>
                  <div className='blog-title'></div>
                  
                  <div className='title-label'>短所</div>
                  <textarea style={{width:'calc(100% - 0rem)'}} onChange={this.getInputText.bind(this, 'weak_point')} value={this.state.weak_point}></textarea>
                  
                </div>
              </div>
              <div className='other-area flex' style={{paddingLeft:'5rem'}}>
                <div className='one-blog'>
                  <div className='blog-title'>容姿・外見について</div>
                  <div className='flex'>                    
                    <textarea className='wp100' onChange={this.getInputText.bind(this, 'appearance')} value={this.state.appearance}></textarea>
                  </div>
                </div>
              </div>
              <div className='other-area flex' style={{paddingLeft:'5rem'}}>
                <div className='one-blog'>
                  <div className='blog-title'>病気になって変わったこと</div>                  
                  <textarea className='wp100' onChange={this.getInputText.bind(this, 'change_after_illness')} value={this.state.change_after_illness}></textarea>
                </div>
                <div className='one-blog'>
                  <div className='blog-title'>今後どうなりたいか</div>                  
                  <textarea onChange={this.getInputText.bind(this, 'going_forward')} value={this.state.going_forward}></textarea>
                </div>
              </div>
              <div className='other-area flex' style={{paddingLeft:'5rem'}}>
                <div className='one-blog'>
                  <div className='blog-title'>病気に関する悩み・不安</div>                  
                  <textarea className='wp100' onChange={this.getInputText.bind(this, 'worries_anxiety')} value={this.state.worries_anxiety}></textarea>
                </div>
              </div>

              <div className='other-area flex' style={{paddingLeft:'5rem'}}>
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

SelfPerception.contextType = Context;

SelfPerception.propTypes = {    
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,    
  cache_index:PropTypes.number,
  detailedPatientInfo : PropTypes.object,
  general_data:PropTypes.object,
  handleGeneralOk:PropTypes.func,
};

export default SelfPerception;
