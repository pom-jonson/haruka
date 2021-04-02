// import React, { Component } from "react";
// import styled from "styled-components";
// import { surface } from "~/components/_nano/colors";
// import InputBoxTag from "~/components/molecules/InputBoxTag";
// import DialSelectMasterModal from "~/helpers/DialSelectMasterModal"
// import InputWithLabel from "~/components/molecules/InputWithLabel";
//
// const Wrapper = styled.div`
//   display:block;
//   width:95%;
//   padding-top:20px;
//   background-color: ${surface};
//   button{
//     margin-left:38px;
//     margin-top: 10px;
//     margin-bottom:10px;
//     font-size:14px;
//   }
//   .input_area{
//     .label-title{
//       width:30px;
//     }
//     input{
//       width:90px;
//     }
//     span{
//       font-size:12px;
//       width:40px;
//       padding-top:15px;
//       padding-left:5px;
//     }
//   }
//
// `;
// class InsulinEveryday extends Component {
//   constructor(props) {
//       super(props);
//       this.state = {
//           select_area: '',
//           insulin_code1: 0,
//           insulin_code2: 0,
//           insulin_code3: 0,
//           insulin_name1: '',
//           insulin_name2: '',
//           insulin_name3: '',
//           isShowInsulinList: false,
//           amount_1_1: '',
//           amount_2_1: '',
//           amount_3_1: '',
//           amount_4_1: '',
//           amount_1_2: '',
//           amount_2_2: '',
//           amount_3_2: '',
//           amount_4_2: '',
//           amount_1_3: '',
//           amount_2_3: '',
//           amount_3_3: '',
//           amount_4_3: '',
//
//       }
//   }
//
//     async UNSAFE_componentWillMount(){
//         this.getInsulins();
//     }
//
//   render() {
//
//     return (
//     <>
//       <Wrapper>
//       </Wrapper>
//     </>
//     )
//   }
// }
//
// export default InsulinEveryday