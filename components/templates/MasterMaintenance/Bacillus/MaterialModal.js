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
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  import $ from "jquery";  
  // import Radiobox from "~/components/molecules/Radiobox";  
  import Checkbox from "~/components/molecules/Checkbox";  
    
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
    .case {
      select{
        width: 600px;
      }
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
    
    .selected{
      background: lightblue;
    }
    .col{
      width:25%;
      padding-left:20px;
      padding-right:20px;      
    }
    .list{
      border:1px solid lightgray;
      width:100%;
      padding-left:3px;      
      overflow-y:flow;
      margin-bottom:10px;
    }
    .long-list{
      height:95%;      
    }
    .short-list{
      height:40%;
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
  
  class MaterialModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,        
      }
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }  
    componentDidMount(){
      this.getBacillusMaterials();
    }

    getBacillusMaterials = async() => {
      let path = "/app/api/v2/master/bacillus/materials_search";
      let post_data = {};      
      await apiClient.post(path, post_data)
      .then((res) => {
        var checkInspectionItemsFlags = {};
        if (res.inspection_items != undefined && res.inspection_items != null && res.inspection_items.length > 0){
          res.inspection_items.map(item => {
            checkInspectionItemsFlags[item.code] = false;
          })
        }
        this.setState({
          gather_part_list:res.gather_part,
          material_list:res.material,
          detail_part_list:res.detail_part,
          inspection_purpose_list:res.inspection_purpose,
          inspection_items_list:res.inspection_items,
          checkInspectionItemsFlags,
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

    getNotice = e => {
      this.setState({notice: e.target.value})
    };

    selectGatherPart(item){
      this.setState({
        selected_gather_part_code:item.code,
        selected_gather_part:item,
      })
    }

    selectMaterial(item){
      this.setState({
        selected_material_code:item.code,
        selected_material:item,
      })
    }

    selectDetailPart(item){
      this.setState({
        selected_detail_part_code:item.code,
        selected_detail_part:item,
      })
    }

    selectInspectionPurpose(item){
      this.setState({
        selected_inspection_target_code:item.code,
        selected_inspection_target:item,
      })
    }

    checkInspectionItems(code,  name, value){
      if (name == 'inspection_items'){
        var checkInspectionItemsFlags = this.state.checkInspectionItemsFlags;
        checkInspectionItemsFlags[code] = value;
        this.setState({checkInspectionItemsFlags});
      }
    }

    handleOk = () =>{
      var selected_inspection_item = [];
      var inspection_items_list = this.state.inspection_items_list;

      if (this.state.checkInspectionItemsFlags != undefined){
        Object.keys(this.state.checkInspectionItemsFlags).map(key => {
          if (this.state.checkInspectionItemsFlags[key]){
            var temp = inspection_items_list.filter(x=>x.code == parseInt(key));
            if (temp.length > 0){
              selected_inspection_item.push(temp[0]);
            }
          }
        })
      }
      var data = {
        gather_part:this.state.selected_gather_part,
        material:this.state.selected_material,
        detail_part:this.state.selected_detail_part,
        inspection_target:this.state.selected_inspection_target,
        inspection_item:selected_inspection_item,
      }
      this.props.handleOk(data);
    }
  
    render() {
      var {gather_part_list, material_list, detail_part_list, inspection_items_list, inspection_purpose_list} = this.state;
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm patient-exam-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>材料選択</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div className='col'>
                  <div className='sub-title'>採取部位</div>
                    <div className='list long-list'>
                      {gather_part_list != undefined && gather_part_list != null && gather_part_list.length > 0 && (
                        gather_part_list.map((item) => {
                          return(
                            <>
                              <div onClick={this.selectGatherPart.bind(this, item)} className={this.state.selected_gather_part_code==item.code?'selected clickable':'clickable'}>
                                {item.name}
                              </div>
                            </>
                          )
                        })
                      )}
                    <div>
                    </div>
                  </div>

                </div>
                <div className='col'>
                  <div className='sub-title'>材料</div>
                  <div className='list long-list'>
                    {material_list != undefined && material_list != null && material_list.length > 0 && (
                        material_list.map((item) => {
                          return(
                            <>
                              <div onClick={this.selectMaterial.bind(this, item)} className={this.state.selected_material_code==item.code?'selected clickable':'clickable'}>
                                {item.name}
                              </div>
                            </>
                          )
                        })
                      )}
                  </div>
                </div>
                <div className='col'>
                  <div className='sub-title'>詳細部位情報</div>
                  <div className='list short-list'>
                      {detail_part_list != undefined && detail_part_list != null && detail_part_list.length > 0 && (
                        detail_part_list.map((item) => {
                          return(
                            <>
                              <div onClick={this.selectDetailPart.bind(this, item)} className={this.state.selected_detail_part_code==item.code?'selected clickable':'clickable'}>
                                {item.name}
                              </div>
                            </>
                          )
                        })
                      )}
                  </div>
                  <div className='sub-title'>検査目的</div>
                  <div className='list short-list'>
                      {inspection_purpose_list != undefined && inspection_purpose_list != null && inspection_purpose_list.length > 0 && (
                        inspection_purpose_list.map((item) => {
                          return(
                            <>
                              <div onClick={this.selectInspectionPurpose.bind(this, item)} className={this.state.selected_inspection_target_code==item.code?'selected clickable':'clickable'}>
                                {item.name}
                              </div>
                            </>
                          )
                        })
                      )}
                  </div>
                </div>

                <div className='col'>
                  <div className='sub-title'>検査項目</div>
                  <div className='list long-list'>
                      {inspection_items_list != undefined && inspection_items_list != null && inspection_items_list.length > 0 && (
                        inspection_items_list.map((item) => {
                          return(
                            <>
                            <div>
                              <Checkbox
                                  label={item.name}                                  
                                  getRadio={this.checkInspectionItems.bind(this, item.code)}
                                  value = {this.state.checkInspectionItemsFlags[item.code]}
                                  name="inspection_items"
                              />
                            </div>
                            </>
                          )
                        })
                      )}                    
                  </div>
                
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
  MaterialModal.contextType = Context;
  
  MaterialModal.propTypes = {  
    closeModal: PropTypes.func,    
    patientId: PropTypes.number, 
    handleOk:PropTypes.func,
  };
  
  export default MaterialModal;
  