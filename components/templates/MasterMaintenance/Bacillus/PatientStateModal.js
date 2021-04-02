import React, { 
    Component, 
    // useContext
   } from "react";
  import PropTypes from "prop-types";
  import styled from "styled-components";
  import * as colors from "~/components/_nano/colors";
  import { Modal } from "react-bootstrap";
  import Context from "~/helpers/configureStore";
  import * as apiClient from "~/api/apiClient";
  // import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
//   import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  import $ from "jquery";  
  // import Radiobox from "~/components/molecules/Radiobox";
  // import DatePicker, { registerLocale } from "react-datepicker";
  // import ja from "date-fns/locale/ja";  
  // registerLocale("ja", ja);
  
  const Popup = styled.div`
    display:flex;
    .flex {
      display: flex;
    }
    height: 96%;
  
    h2 {
      color: ${colors.onSurface};
      font-size: 17px;
      font-weight: 500;
      margin: 6px 0;
    }  
    .col{
      width:33%;
      height:100%;
      padding-left:15px;
      padding-right:15px;
    }
    .case {
      select{
        width: 600px;
      }
    }
    
    .disease-header{
      .department-status{
        .pullbox-title{
          font-size: 16px;
        }
      }
      overflow: hidden;
      display:flex;   
      margin-bottom:1rem   
    }    
      
    .label-title {
      float: left;
      text-align: right;
      width: 5rem;
      font-size: 1.2rem;
      margin-top: 0;
      &.pullbox-title {
        margin-right: 0.5rem;
      }
    }
    input{
      width:29rem
    }

    .selected{
      background: lightblue;
    }

    .clickable{
      cursor:pointer;
    }
    .select-area{
      margin-right:2rem;
    }
    .list{
      border: 1px solid lightgray;      
      width:100%;
      overflow-y: auto;
      margin-bottom:2%;
    }
    .long-list{
      height:98%;
    }
    .short-list{
      height:30%;
    }
    .middle-list{
      height:60%;
    }

    .center {
      text-align: center;
      button {
        height: 25px;
        padding: 0;
        line-height: 25px;
        span {
          color: ${colors.surface};
        }
      }
  
      span {
        color: rgb(241, 86, 124);
      }
  
      .black {
        color: #000;
      }
    }
    .red {
      color: rgb(241, 86, 124);
    }
    
  `;

  const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;    
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
    width:11.25rem;
  }
  .context-menu li {
    clear: both;
    width: 11.25rem;
    border-radius: 0.25rem;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
    color:black;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,parent,index, kind}) => {
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>              
                <li><div onClick={() =>parent.contextMenuAction("add", index, kind)}>項目追加</div></li>
                <li><div onClick={() =>parent.contextMenuAction("edit", index, kind)}>項目変更</div></li>
                <li><div onClick={() => parent.contextMenuAction("delete",index, kind)}>項目削除</div></li>
                <li><div onClick={() => parent.contextMenuAction("sort",index, kind)}>並び替え</div></li>
              </ul>
          </ContextMenuUl>
      );
  } else { return null; }
};
  
  class PatientStateModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,        
      }
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }  
    componentDidMount(){   
      this.getPatientStateDate();
    }    

    getPatientStateDate = async() => {
      let path = "/app/api/v2/master/bacillus/patient_state_search";
      let post_data = {};
      await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          basic_disease_list:res.basic_disease,
          travel_history_list:res.travel_history,
          infectious_list:res.infectious,
          request_comment_list:res.request_comment,
        })
      });
    }
  
    getDepartment = (e) => {
      this.setState({departmentCode:parseInt(e.target.id)});
    }

    handleClick = (e, index, kind) => {
      if (e.type === "contextmenu"){
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
          that.setState({ contextMenu: { visible: false } });
          document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
              contextMenu: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("wordList-table")
          .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                  contextMenu: { visible: false }
              });
              document
                  .getElementById("wordList-table")
                  .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
          contextMenu: {
              visible: true,              
              x: e.clientX -$('#outpatient').offset().left,
              y: e.clientY -$('#outpatient').offset().top - 35,
              index: index,
              kind:kind,
          },
          contextMenu_define:{visible:false}
      });
      }
    };

    // contextMenuAction = (act, index, kind) => {
    contextMenuAction = (act) => {      
      switch(act){
        case 'add':
          break;
        case 'edit':
          break;
        case 'delete':
          break;
        case 'sort':          
          break;
      }
    };

    closeModal = () => {      
    }

    getNotice = e => {
      this.setState({notice: e.target.value})
    };

    selectBasicDisease(item){
      this.setState({
        selected_basic_disease_code:item.code,
        selected_basic_disease:item,
      })
    }

    selectTravelHistory(item){
      this.setState({
        selected_travel_history_code:item.code,
        selected_travel_history:item,
      })
    }

    selectInfectious(item){
      this.setState({
        selected_infectious_code:item.code,
        selected_infectious:item,
      })
    }

    selectRequestComment(item){
      this.setState({
        selected_request_comment_code:item.code,
        selected_request_comment:item,
      })
    }

    handleOk = () =>{
      var data = {
        basic_disease:this.state.selected_basic_disease,
        travel_history:this.state.selected_travel_history,
        infectious:this.state.selected_infectious,
        request_comment:this.state.selected_request_comment,
      }
      this.props.handleOk(data);
    }
  
    render() {
      var {basic_disease_list,travel_history_list, request_comment_list, infectious_list } = this.state;
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm patient-exam-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>患者状態選択</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>                  
                <div className="col">
                    <div className="sub-title">基礎疾患</div>
                    <div className="list middle-list">
                      {basic_disease_list != undefined && basic_disease_list != null &&                      
                         basic_disease_list.length> 0 && basic_disease_list.map((item) => {
                            return(
                            <>
                              <div className={this.state.selected_basic_disease_code == item.code?'selected clickable':'clickable'} onClick={this.selectBasicDisease.bind(this, item)}>
                                {item.name}
                              </div>
                            </>
                            )
                        })
                        }
                    </div>
                    <div className='sub-title'>渡航履歴</div>
                    <div className="list short-list">
                      {travel_history_list != undefined && travel_history_list != null &&                      
                         travel_history_list.length> 0 && travel_history_list.map((item) => {
                            return(
                            <>
                              <div className={this.state.selected_travel_history_code == item.code?'selected clickable':'clickable'} onClick={this.selectTravelHistory.bind(this, item)}>
                                {item.name}
                              </div>
                            </>
                            )
                        })
                      }
                    </div>
                </div>
                <div className="col">
                    <div className="sub-title">推定感染症</div>
                    <div className="list long-list">
                      {infectious_list != undefined && infectious_list != null &&                      
                        infectious_list.length> 0 && infectious_list.map((item) => {
                            return(
                            <>
                              <div className={this.state.selected_infectious_code == item.code?'selected clickable':'clickable'} onClick={this.selectInfectious.bind(this, item)}>
                                {item.name}
                              </div>
                            </>
                            )
                        })
                      }
                    </div>
                </div>
                <div className="col">
                    <div className="sub-title">依頼コメント</div>
                    <div className="list middle-list">
                      {request_comment_list != undefined && request_comment_list != null &&                      
                        request_comment_list.length> 0 && request_comment_list.map((item) => {
                            return(
                            <>
                              <div className={this.state.selected_request_comment_code == item.code?'selected clickable':'clickable'} onClick={this.selectRequestComment.bind(this, item)}>
                                {item.name}
                              </div>
                            </>
                            )
                        })
                      }
                    </div>
                    <div>依頼コメントは2つまでです。</div>
                </div>                    
                
              </Popup>
            </Modal.Body>
            <Modal.Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
              <Button className="red-btn" onClick={this.handleOk}>確定</Button>
            </Modal.Footer>
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
            />            
          </Modal>        
        </>
      );
    }
  }
  PatientStateModal.contextType = Context;
  
  PatientStateModal.propTypes = {  
    closeModal: PropTypes.func,    
    patientId: PropTypes.number, 
    modal_data : PropTypes.object,
    handleOk: PropTypes.func,
  };
  
  export default PatientStateModal;
  