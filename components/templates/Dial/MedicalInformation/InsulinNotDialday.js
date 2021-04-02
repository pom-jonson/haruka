import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";

const Wrapper = styled.div`
  display:block;
  width:95%;
  padding-top:20px;
  background-color: ${surface};
  button{
    margin-left:38px;
    margin-top: 10px;
    margin-bottom:10px;
    font-size:14px;
  }
  .input_area{
    .label-title{
      width:30px;
    }
    input{
      width:90px;
    }
    span{
      font-size:12px;
      width:40px;
      padding-top:15px;
      padding-left:5px;
    }
  }
  
`;
class InsulinNotDialday extends Component {
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
        <div className="row">
          <div>
              <button className="select_code">クリックしてコードを選択</button>
          </div>
          <div className="flex input_area">
            <InputBoxTag
              label=""
              type="text"
              // getInputText={this.getValue.bind(this)}
              // value = {value}
            />
            <span>単位</span>
            <InputBoxTag
              label=""
              type="text"
              // getInputText={this.getValue.bind(this)}
              // value = {value}
            />
            <span>単位</span>
            <InputBoxTag
              label=""
              type="text"
              // getInputText={this.getValue.bind(this)}
              // value = {value}
            />
            <span>単位</span>
            <InputBoxTag
              label=""
              type="text"
              // getInputText={this.getValue.bind(this)}
              // value = {value}
            />
            <span>単位</span>
          </div>
        </div>
          {this.state.isShowDiseaseList && (
              <DialSelectMasterModal
                  selectMaster = {this.selectDisease}
                  closeModal = {this.closeModal}
                  MasterCodeData = {this.state.diseaseData}
                  MasterName = 'インスリン'
              />
          )}
      </Wrapper>  
    </>
    )
  }
}

export default InsulinNotDialday