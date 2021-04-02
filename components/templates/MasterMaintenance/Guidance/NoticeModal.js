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
  import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  import $ from "jquery";  
  // import Radiobox from "~/components/molecules/Radiobox";
  // import DatePicker, { registerLocale } from "react-datepicker";
  // import ja from "date-fns/locale/ja";  
  // registerLocale("ja", ja);
  
  const Popup = styled.div`
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
    .case {
      select{
        width: 600px;
      }
    }
    .list-button{
      position: absolute;
      right: 25px;
      top: 45px;
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
    .kinds_content_list{
      border: 1px solid;
      height: 15rem;
      overflow-y: auto;
    }

    .small-area{
      border: 1px solid;      
      overflow-y: auto;
      height: 4rem;
      width:calc(100% - 9rem)
    }

    .title-label{
      width:9rem;
      text-align:left;
    }
    .addition-area{
      border: 1px solid;
      height: 8.5rem;
      overflow-y: auto;
      width:100%;
    }
    .karte-area{
      border: 1px solid;
      height: 13rem;
      overflow-y: auto;
      width:calc(100% - 9rem)
    }
    .up-down-buttons{
      float:right;
      .arrow-button{
        border:1px solid;
        width: 1.2rem;
        padding-left: 0.1rem;
        cursor:pointer;
      }
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
  
  const Footer = styled.div`
    display: flex;
    span{
      color: white;
      font-size: 16px;
    }
    button{
      float: right;
      padding: 5px;
      font-size: 16px;
      margin-right: 16px;
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
  
  class NoticeModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,
        isOpenNoticeModal:false,
      }
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }  
    componentDidMount(){
      this.getGuidanceMaster();
    }
    async getGuidanceMaster() {
      let path = '';
      path = "/app/api/v2/master/guidance/searchGuidanceClassific";
      await apiClient
        ._post(path, {
            params: {}
        })
        .then((res) => {
          if (res.length > 0){
              this.setState({
                  kind_data:res,
                  selected_first_layer_number:this.state.selected_first_layer_number>0?this.state.selected_first_layer_number:res[0].number,
                  selected_classific_id:this.state.selected_classific_id>0?this.state.selected_classific_id:res[0].classific_id,
                  selected_classific_index:0,
              }, () => {
                  this.getGuidanceDetail();
              })
          } else {
              this.setState({
                  kind_data:[],
                  detail_data:[],
                  addition_data:[],
                  selected_first_layer_number:0,
                  selected_classific_index:0,
                  selected_classific_id:null,
              })
          }
        })
        .catch(() => {
        });
    } 

    async getGuidanceDetail() {
      let path = '';
      let post_data;        
      path = "/app/api/v2/master/guidance/searchGuidanceClassificDetail";
      post_data = {classific_id:this.state.selected_classific_id};
      
      await apiClient
        ._post(path, {
            params: post_data
        })
        .then((res) => {
          if (res.length>0){
              this.setState({
                  detail_data:res,
                  selected_second_layer_number: res[0].number,
                  selected_classific_detail_id:res[0].classific_detail_id,
                  selected_detail_index:0,
              }, () => {
                  this.getGuidanceAddition();
              });
          } else {
              this.setState({
                  detail_data:[],
                  addition_data:[],
                  selected_second_layer_number:0,
                  selected_detail_index:0,
                  selected_classific_detail_id:null,
              })
          }
          
        })
        .catch(() => {
        });
    }

    async getGuidanceAddition() {
      var path = "/app/api/v2/master/guidance/searchGuidanceAddition";
        var post_data = {
            classific_detail_id:this.state.selected_classific_detail_id,
        };

        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            this.setState({
                addition_data:res,
            });
          })
          .catch(() => {
          });
    }
  
    getDepartment = (e) => {
      this.setState({departmentCode:parseInt(e.target.id)});
    }
  
    async saveData(is_temporary){
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let path = "/app/api/v2/karte/symptom/register";
      let post_data = {        
        hospital_status:this.state.hospital_status,
        department_id:this.state.departmentCode,
        example_contents:this.state.example_contents,
        status: is_temporary,
        number:this.state.number,
        doctor_code:authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
        patient_id:this.props.patientId,
      
      }
      await apiClient.post(path, post_data)
        .then(() => {
          if (this.state.number > 0) {
            window.sessionStorage.setItem("alert_messages", "変更しました。");
          } else {
            window.sessionStorage.setItem("alert_messages", "登録しました。");
          }
          
      })
    }

    getDetails = (number,classific_id, index) => {
      this.setState({              
          selected_first_layer_number:number,
          selected_classific_id:classific_id,
          selected_classific_index:index,
          selected_classific_detail_id:null,
      }, () => {
          this.getGuidanceDetail();
      });
    }

    getAdditions = (number, classific_detail_id, index) => {
      this.setState({
          selected_second_layer_number:number,            
          selected_classific_detail_id: classific_detail_id,
          selected_detail_index : index,
      }, () => {
          this.getGuidanceAddition();
      });
    }

    moveDown = (type) => {
      var temp, max_index, selected_index, swap_index, swap_temp;
      switch(type){
        case 0:
          temp = this.state.kind_data;
          max_index = temp.length;
          selected_index = this.state.selected_classific_index;
          if (selected_index < max_index - 1) swap_index = selected_index + 1;
          else swap_index = 0;
          swap_temp = temp[selected_index];
          temp[selected_index] = temp[swap_index];
          temp[swap_index] = swap_temp;
          this.setState({
            selected_classific_index:swap_index,
            kind_data:temp,
          })
          break;
        case 1:
          temp = this.state.detail_data;
          max_index = temp.length;
          selected_index = this.state.selected_detail_index;
          if (selected_index < max_index - 1) swap_index = selected_index + 1;
          else swap_index = 0;
          swap_temp = temp[selected_index];
          temp[selected_index] = temp[swap_index];
          temp[swap_index] = swap_temp;
          this.setState({
            selected_detail_index:swap_index,
            detail_data:temp,
          })
          break;          
        case 2:
          break;
      }
    }
    moveUp = (type) => {
      var temp, max_index, selected_index, swap_index, swap_temp;
      switch(type){
        case 0:
          temp = this.state.kind_data;
          max_index = temp.length;
          selected_index = this.state.selected_classific_index;
          if (selected_index > 0) swap_index = selected_index - 1;
          else swap_index = max_index-1;
          swap_temp = temp[selected_index];
          temp[selected_index] = temp[swap_index];
          temp[swap_index] = swap_temp;
          this.setState({
            selected_classific_index:swap_index,
            kind_data:temp,
          })
          break;
        case 1:
          temp = this.state.detail_data;
          max_index = temp.length;
          selected_index = this.state.selected_detail_index;
          if (selected_index > 0) swap_index = selected_index - 1;
          else swap_index = max_index-1;          
          swap_temp = temp[selected_index];
          temp[selected_index] = temp[swap_index];
          temp[swap_index] = swap_temp;
          this.setState({
            selected_detail_index:swap_index,
            detail_data:temp,
          })
          break;
        case 2:
          break;
      }
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
          this.setState({
            isOpenNoticeModal:true,
          })
          break;
      }
    };

    closeModal = () => {
      this.setState({
        isOpenNoticeModal:false,
      })
    }

    getNotice = e => {
      this.setState({notice: e.target.value})
    };

  
    render() {
      var {notice_data} = this.state;
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm notice-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>注意事項</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>              
                <div className="disease-header flex">                  
                  <div className="department-status ml-2" style={{marginTop:12}}>
                    <InputWithLabel
                        label="注意事項"
                        type="text"
                        getInputText={this.getNotice.bind(this)}
                        diseaseEditData={this.state.notice}
                    />
                  </div>
                </div>
                <div className="flex" style={{marginBottom:'1rem'}}>
                  <div className="select-area" style={{width:'100%'}}>                    
                    <div className="kinds_content_list" id="wordList-table" style={{width:'100%'}}>
                    {notice_data != undefined && notice_data != null &&                      
                      notice_data.length> 0 && notice_data.map((item, index) => {
                        return(
                          <>
                            <div className={this.state.selected_first_layer_number === item.number?"selected clickable":"clickable"} 
                              onClick={this.getDetails.bind(this, item.number, item.classific_id, index)}
                              onContextMenu={e => this.handleClick(e,index, 0)}>
                               <div>{item.name}</div>
                            </div>
                          </>
                        )
                      })
                    }
                    </div>                    
                  </div>
                </div>
              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <Footer>
                    <Button className="ok">確定</Button>
                    <Button className="cancel" onClick={this.props.closeModal}>閉じる</Button>
                </Footer>
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
  NoticeModal.contextType = Context;
  
  NoticeModal.propTypes = {  
    closeModal: PropTypes.func,    
    patientId: PropTypes.number, 
    modal_data : PropTypes.object,
  };
  
  export default NoticeModal;
  