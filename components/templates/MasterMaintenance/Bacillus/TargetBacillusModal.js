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
  import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
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
      font-size: 1.1rem;
      font-weight: 500;
      margin: 6px 0;
    }
    
    .disease-header{
      .department-status{
        .pullbox-title{
          font-size: 1rem;
        }
      }
      overflow: hidden;
      display:flex;   
      margin-bottom:1rem   
    }    
      
    .label-title {
      float: left;
      text-align: right;
      width: 6rem;
      font-size: 1.2rem;
      margin-top: 0;
      &.pullbox-title {
        margin-right: 0.5rem;
      }
    }
    table {
      margin-bottom:0px;
      thead{
        display:table;
        width:100%;
      }
      tbody{
        display:block;
        overflow-y: auto;
        height: 30rem;
        width:100%;
      }
      tr{
        display: table;
        width: 100%;
      }
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
        word-break: break-all;
        padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }      
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
  
  class TargetBacillusModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,
        select_category_code:0,
      }
      this.categoryOptions = [
        {id:0, value:''},        
    ];
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }  
    componentDidMount(){
      this.getTargetData();
    }

    getTargetData = async() => {
      let path = "/app/api/v2/master/bacillus/target_search";
      let post_data = {};      
      await apiClient.post(path, post_data)
      .then((res) => {
        if (Object.keys(res.category_list).length > 0){
          Object.keys(res.category_list).map(category_code => {
            this.categoryOptions.push({id:category_code, value:res.category_list[category_code]});
          })          
          this.setState({
            target_list:res.target_list,
          })
        }
        
      });
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

    getCategory (e){
      this.setState({select_category_code:e.target.id})
    }

    selectItem = (item) =>{
      this.setState({
        selected_code:item.code,
        selected_item:item,
      })
    }

    handleOk = () => {
      var data = {
        target_bacillus:this.state.selected_item,        
      }
      this.props.handleOk(data);
    }
  
    render() {      
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm notice-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>目的菌選択</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>              
                <div className="disease-header flex">                  
                  <div className="department-status ml-2" style={{marginTop:12}}>
                    <SelectorWithLabel
                        options={this.categoryOptions}
                        title={'カテゴリ名'}
                        getSelect={this.getCategory.bind(this)}
                        departmentEditCode={this.state.select_category_code}
                    />
                  </div>
                </div>
                <div className='table-area'>
                  <table className='table-scroll table table-bordered'>
                      <thead>
                          <tr>
                              <th style={{width:'12rem'}}>項目コード</th>
                              <th>項目名</th>
                          </tr>
                      </thead>
                      <tbody>
                        {this.state.target_list != undefined && this.state.target_list != null && this.state.target_list.length > 0 && (
                          this.state.target_list.map(item => {
                            if (this.state.select_category_code > 0 && this.state.select_category_code == item.category_code){
                              return(
                                <>
                                <tr onClick={this.selectItem.bind(this, item)} className={this.state.selected_code == item.code?'selected clickable':'clickable'}>
                                  <td style={{width:'12rem'}}>{item.code}</td>
                                  <td>{item.name}</td>
                                </tr>
                                </>
                              )
                            }                            
                          })
                        )}
                      </tbody>
                  </table>
                </div>
              </Popup>
            </Modal.Body>
            <Modal.Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
              <Button className="red-btn" onClick={this.handleOk.bind(this)}>確定</Button>
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
  TargetBacillusModal.contextType = Context;
  
  TargetBacillusModal.propTypes = {  
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,
    patientId: PropTypes.number, 
    modal_data : PropTypes.object,
  };
  
  export default TargetBacillusModal;
  