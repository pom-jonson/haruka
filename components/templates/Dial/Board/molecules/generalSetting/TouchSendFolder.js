import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import InputBoxTag from "~/components/molecules/InputBoxTag";

const Wrapper = styled.div`
  display:block;
  width:95%;
  padding-top:20px;
  text-align:left;
  background-color: ${surface};
  .radio-title-label{
      margin-right:15px;   
      width:90px;
      text-align:right;   
  }
  .radio-btn{
      width:175px;
      background-color:black;
      label{
        margin-bottom: 0px;
        color: white;
      }
      input:checked + label {
          border-radius:0px;
          background:red;
      }
  }
  .time-title-label{
      width:40px;      
  }
  .react-datepicker-wrapper{
      margin-right:10px;
  }
  .radio_area{
      margin-bottom:15px;
  }
  .time_set_area{
      margin-bottom:10px;
  }
  .input_area{
    display:flex;
    margin-bottom: 15px;
    margin-left: 20px;
    .label-title{
        display:none;
    }
    input{
      width:500px;
      margin-right:10px;
    }
    span{
      font-size:12px;
      width:fit-content;
      padding-top:15px;
      padding-left:5px;
    }
    button{
        padding-left: 15px;
        padding-right: 15px;
        height: 30px;
        margin-top:11px;
    }    
  }
`;

class TouchSendFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    
  render() {        
        // let {list_array, list_item} = this.state;            
      
    return (
    <>
        <Wrapper>        
            <label className="sub_title">電子カード</label>
            <div className="input_area">
                <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />
                <button>検索</button>
            </div>
            <label className="sub_title">記録用</label>
            <div className="input_area">
                <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />
                <button>検索</button>
            </div>
            <label className="sub_title">BML</label>
            <div className="input_area">
                <InputBoxTag
                    label=""
                    type="text"
                    // getInputText={this.getValue.bind(this)}
                    // value = {value}
                />
                <button>検索</button>
            </div>
        </Wrapper>  
    </>
    )
    }
}
    
export default TouchSendFolder