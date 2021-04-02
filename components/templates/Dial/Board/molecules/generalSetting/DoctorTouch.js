import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Checkbox from "~/components/molecules/Checkbox";


const Wrapper = styled.div`
  display:flex;
  width:100%;
  padding-top:20px;
  background-color: ${surface};
  
`;
class DoctorTouch extends Component {
  constructor(props) {
      super(props);
      this.state = {  
          checked:false,              
      }
  }

  getRadio = (name, value) => {
    if (name === "check") {
        this.setState({checked:value})
    }
};
  render() {                     
  
    return (
    <>
    <Wrapper>
      <Checkbox
        label="処置行為を入力する"
        getRadio={this.getRadio.bind(this)}
        value={this.state.checked}
        name="check"
        />       
    </Wrapper>  
    </>
    )
  }
}

export default DoctorTouch