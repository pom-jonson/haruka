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
  import Checkbox from "~/components/molecules/Checkbox";
  // import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
  import SearchBar from "~/components/molecules/SearchBar"
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  import $ from "jquery";  
  // import Radiobox from "~/components/molecules/Radiobox";
  import Spinner from "react-bootstrap/Spinner";
  // import DatePicker, { registerLocale } from "react-datepicker";
  // import ja from "date-fns/locale/ja";  
  // registerLocale("ja", ja);

  import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
  import OverlayTrigger from "react-bootstrap/OverlayTrigger";
  import Tooltip from "react-bootstrap/Tooltip";
  import { 
    faPlus, 
    faMinus 
  } from "@fortawesome/pro-solid-svg-icons";

  const Icon = styled(FontAwesomeIcon)`
    color: black;
    font-size: 15px;
    margin-right: 5px;
  `;

  const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;
  
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

    .search-area{
      display: flex;
      justify-content: space-between;
      width: 100%;
      button{
        width: 6rem;
        height: 38px;
      }
    }

    .header-area{
      justify-content: space-between;
    }

    .search-key{
      height: 38px;
      line-height: 38px;
      margin-right: 10px;
    }


    .spinner-disease-loading{
      height: 20rem;
      overflow-y: auto;      
    }
    
    .disease-header{
      .department-status{
        .pullbox-title{
          font-size: 1rem;
        }
      }
      label{
        font-size: 1rem;
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
    .tree_close{
      display:none;
    }
    
    .tree-area{
      position:relative;
      margin-top:10px;
      height:80%;
      overflow-y:auto;
      ul, li{
        list-style:none;
        padding-inline-start:1rem;
      }
      .clickable:hover{
        background: #eee;
      }
      span{
        font-size: 1rem;
      }
    }
    .sel-star{
      position: absolute;
      left: 1rem;
    }

    .sel-li{
      background: #ddd;
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

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
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
  
  class NurseSearchModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,
        keyword: "",
        tooltip_msg: "",
        isLoaded: false,
        select_category_code:0,
        search_kind:'nurse_diagnosis',
        openBranch:true,
        selectedDiagnosisMasterNames: [],
      }
      this.categoryOptions = [
        {id:0, value:''},        
    ];
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }  
    async componentDidMount(){
      await this.getSearchResult();
    }

    getSearchResult = async() => {
      let path = "/app/api/v2/master/nurse/diagnosis_level_search";
      let post_data = {
        keyword: this.state.keyword,
        diagnosis:this.state.diagnosis,
        plan_target:this.state.plan_target,
        problem:this.state.problem,
      };      
      await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          tree_data:res,
          isLoaded: true,
          selectedDiagnosisMasterNames: [],
        })
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

    enterPressed = e => {
      var code = e.keyCode || e.which;
      if (code === 13) {                
        this.setState({
          isLoaded: false
        },()=>{
          this.getSearchResult();
        });
      }
    };

    search = word => {
        word = word.toString().trim();
        this.setState({ keyword: word });
    };

    selectSearchKind = (e) => {
      this.setState({
        search_kind:e.target.value,
      })
    }

    changeTreeState = (type, e) => {
      var obj = e.target;      
      while (obj != undefined && $(obj).prop('tagName').toLowerCase() != 'span') {
        obj = $(obj).parent();
      }      
      $(obj).hide();
      var childnodes_obj = $(obj).parent().next();
      if (type){
        $(obj).next().show();        
        $(childnodes_obj).show();
        childnodes_obj = $(childnodes_obj).next();        
        $(childnodes_obj).show();
      } else{
        $(obj).prev().show();        
        $(childnodes_obj).hide();
        childnodes_obj = $(childnodes_obj).next();        
        $(childnodes_obj).hide();
        
      }
    }

    selectDiagnosisMaster = (_item=null) => {
      if (_item == null) return;

      let sel_master_names = this.state.selectedDiagnosisMasterNames;
      if (sel_master_names.length < 1) {
        sel_master_names.push(_item);
      } else {
        let existItem = 0;
        sel_master_names = sel_master_names.filter(item=>{
          if (item.name == _item.name) {
            existItem = 1;
          } else {
            return item;
          }
        })        
        if (existItem == 0) sel_master_names.push(_item);
      }
      this.setState({
        selectedDiagnosisMasterNames: sel_master_names
      });
    }

    includeInSelectedItems = (_item=null) => {
      if (_item == null) return;

      let result = false;

      let sel_master_names = this.state.selectedDiagnosisMasterNames;

      if (sel_master_names.length > 0) {
        let exist = 0;
        sel_master_names.map(item=>{
          if (item.name == _item.name) {
            exist = 1;
          }
        });
        if (exist == 1) {
          result = true;
        }
      }

      return result;
    }

    getChildNodes(tree_node){      
      if (tree_node == undefined || tree_node == null || tree_node =='' || Object.keys(tree_node).length == 0) return <></>;
      var result = <></>;
      result = Object.keys(tree_node).map(key => {
          var item = tree_node[key];      
          return (
            <>
            <ul>
              <li className='clickable'>
                <span style={{display:'none'}} onClick={e => this.changeTreeState(true,e)}>
                  <Icon icon={faPlus}/>{item[0].label_name}
                </span>
                <span style={{display:'block'}} onClick={e => this.changeTreeState(false,e)}>
                  <Icon icon={faMinus}/>{item[0].label_name}
                </span>
              </li>
              <ul style={{display:'block'}}>
              {item.diagnosis_master_names != undefined && item.diagnosis_master_names != null && item.diagnosis_master_names.length > 0 &&
               item.diagnosis_master_names.map(sub_item => {
                return(
                  <>
                  <li className={this.includeInSelectedItems(sub_item) ? "clickable sel-li":"clickable "} onClick={()=>this.selectDiagnosisMaster(sub_item)}>
                    #{sub_item.name}
                    {this.includeInSelectedItems(sub_item) && (
                      <span className="sel-star">★</span>
                    )}
                  </li>
                  {sub_item.plan_data != undefined && sub_item.plan_data != null && sub_item.plan_data.length > 0 && (
                    <ul>
                      {sub_item.plan_data.map(plan_item => {
                        return(
                          <>
                          <li style={{display:'flex'}}><div style={{width:'5rem'}}>{plan_item.class_name}</div><span>{plan_item.name}</span></li>
                          </>
                        )
                      })}
                    </ul>
                  )}
                  </>
                )
              })}
              </ul>
              <li>
              {item.children != undefined? this.getChildNodes(item.children):''}
              </li>
            </ul>
            
            </>
          )
        })
      return result;
    }

    getTreeData = (tree_data) => {      
      var result = null;
      if (tree_data != undefined && tree_data != null){        
        result = this.getChildNodes(tree_data);
      }
      return result;
    }

    handleOk = () => {
      if (this.state.selectedDiagnosisMasterNames.length < 1 ) return;

      this.props.handleOk(this.state.selectedDiagnosisMasterNames);
      this.props.closeModal();
    }

    handleSearch = () => {
      this.setState({
        isLoaded: false
      },()=> {
        this.getSearchResult();
      });
    }

    searchInitialize = () => {
      this.setState({
        isLoaded: false,
        search_kind:'nurse_diagnosis',
        keyword: ""
      },()=> {
        this.getSearchResult();
      });
    }

    getToolTip = () => {     
      if (this.state.selectedDiagnosisMasterNames.length < 1){        
        this.setState({tooltip_msg : "項目を選択してください。"});        
      } else {
        this.setState({tooltip_msg : ""});        
      }
    }

    getCheckbox = (name, value) => {
      this.setState({[name]:value})
    };
  
    render() {              
      let tooltip_msg = "項目を選択してください。";
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm notice-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>看護検索</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div className="flex header-area">
                  <div className="flex">
                    <div className="search-key">キーワード検索</div>
                    <SearchBar
                      placeholder=""
                      search={this.search}
                      enterPressed={this.enterPressed}
                    />
                    <Button type="common" onClick={this.handleSearch} style={{width:"5rem",height:"38px", marginLeft:"10px"}}>検索</Button>
                  </div>
                  <div className="checkbox_area" style={{paddingTop:'8px'}}>
                    <Checkbox
                      label="診断"
                      getRadio={this.getCheckbox.bind(this)}
                      value={this.state.diagnosis}
                      checked={this.state.diagnosis === 1}
                      name="diagnosis"
                    />
                    <Checkbox
                      label="問題"
                      getRadio={this.getCheckbox.bind(this)}
                      value={this.state.problem}
                      checked={this.state.problem === 1}
                      name="problem"
                    />
                    <Checkbox
                      label="計画・目標"
                      getRadio={this.getCheckbox.bind(this)}
                      value={this.state.plan_target}
                      checked={this.state.plan_target === 1}
                      name="plan_target"
                    />
                  </div>
                  <div>
                    <Button type="common" onClick={this.searchInitialize} style={{float:'right',height:"38px",width:"6rem"}}>初期表示</Button>
                  </div>                  
                </div>
                <br/>
                <br/>
                {/* <div className="disease-header flex">
                  <div style={{width:'10rem'}}>                    
                    <Radiobox
                      label = '看護診断検索'
                      value = {'nurse_diagnosis'}
                      name = 'search_kind'
                      checked = {this.state.search_kind=='nurse_diagnosis'}
                      getUsage = {this.selectSearchKind.bind(this)}
                    /><br/>
                    <Radiobox
                      label = '関連因子'
                      value = {'cause'}
                      name = 'search_kind'
                      getUsage = {this.selectSearchKind.bind(this)}
                      checked = {this.state.search_kind == 'cause'}
                    />
                  </div>
                </div> */}
                <div className='tree-area'>
                  {this.state.isLoaded == false ? (
                      <div className='spinner-disease-loading center'>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                    </div>
                  ):(
                    <>                      
                      {this.state.tree_data != undefined && this.state.tree_data != null && Object.keys(this.state.tree_data).length > 0 && 
                      Object.keys(this.state.tree_data).map(department_name => {
                        var sub_tree = this.state.tree_data[department_name];
                        var tree_structure = this.getTreeData(sub_tree);
                        return(
                          <>
                            <ul>
                              <li className='clickable'>
                                <span style={{display:'none'}} onClick={e => this.changeTreeState(true,e)}>
                                  <Icon icon={faPlus}/>{department_name}
                                </span>
                                <span style={{display:'block'}} onClick={e => this.changeTreeState(false,e)}>
                                  <Icon icon={faMinus}/>{department_name}
                                </span>
                              </li>
                              <ul style={{paddingLeft:0}}>
                                {tree_structure}
                              </ul>
                            </ul>
                          </>
                        )
                      })}
                    </>
                  )}
                </div>

              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <div                 
                  onClick={this.props.closeModal}
                  className={"custom-modal-btn cancel-btn focus "}
                  style={{cursor:"pointer"}}
                >
                  <span>閉じる</span>
                </div>
                {this.state.selectedDiagnosisMasterNames.length < 1 ? (
                  <OverlayTrigger placement={"top"} overlay={renderTooltip(tooltip_msg)}>
                    <div id="system_confirm_Ok" className={this.state.selectedDiagnosisMasterNames.length > 0 ? "custom-modal-btn red-btn focus " : "custom-modal-btn disable-btn"}
                      onClick={this.handleOk} onMouseOver={this.getToolTip.bind(this)} style={{cursor:"pointer"}}>
                      <span>確定</span>
                    </div>
                  </OverlayTrigger>
                ):(                  
                    <div id="system_confirm_Ok" className={this.state.selectedDiagnosisMasterNames.length > 0 ? "custom-modal-btn red-btn focus " : "custom-modal-btn disable-btn"}
                      onClick={this.handleOk} style={{cursor:"pointer"}}>
                      <span>確定</span>
                    </div>
                )}
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
  NurseSearchModal.contextType = Context;
  
  NurseSearchModal.propTypes = {  
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,    
    patientId: PropTypes.number, 
    modal_data : PropTypes.object,
  };
  
  export default NurseSearchModal;
  