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

    .col{
      width:33%;
      height:100%;
      padding-left:15px;
      padding-right:15px;
    }

    .list{
      border: 1px solid lightgray;
      width:100%;
      overflow-y: auto;
      margin-bottom:2%;
      min-height:100px;
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
  
  class AntiMedicineModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,
        selected_medicines:[],
      }
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }  
    componentDidMount(){
      this.getAntiMedicines();
    }

    getAntiMedicines = async() => {
      let path = "/app/api/v2/master/bacillus/anti_medicines_search";
      let post_data = {};      
      await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          anti_list:res,
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

    selectMedicine = (item) => {
      var selected_medicines = this.state.selected_medicines;
      if (selected_medicines.some(x =>x.number == item.number)){
        selected_medicines = selected_medicines.filter(x => x.number != item.number);
      } else {
        if (selected_medicines.length == 3) return;
        selected_medicines.push(item);
      }
      this.setState({
        selected_medicines,
      })
    }

    checkSelected = (item) => {
      var selected_medicines = this.state.selected_medicines;      
      return selected_medicines.some(x=>x.number == item.number);
    }

    handleOk = () => {
      this.props.handleOk(this.state.selected_medicines);
    }
  
    render() {      
      var {anti_list} = this.state;
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm patient-exam-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>使用中抗菌剤</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div className='col'>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['01'] != undefined && anti_list['01'].length > 0 ? anti_list['01'][0].category_name:'ペニシリン系'}
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['01'] != undefined && anti_list['01'].length > 0 && (
                      anti_list['01'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })

                    )}
                  </div>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['02'] != undefined && anti_list['02'].length > 0 ? anti_list['02'][0].category_name:'セフェム系'}
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['02'] != undefined && anti_list['02'].length > 0 && (
                      anti_list['02'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['03'] != undefined && anti_list['03'].length > 0 ? anti_list['03'][0].category_name:'オキサセフェム系'}
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['03'] != undefined && anti_list['03'].length > 0 && (
                      anti_list['03'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['04'] != undefined && anti_list['04'].length > 0 ? anti_list['04'][0].category_name:'ベネム・カルバベネム系'}
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['04'] != undefined && anti_list['04'].length > 0 && (
                      anti_list['04'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                </div>
                <div className='col'>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['05'] != undefined && anti_list['05'].length > 0 ? anti_list['05'][0].category_name:'アミノ配糖体系'}
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['05'] != undefined && anti_list['05'].length > 0 && (
                      anti_list['05'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['06'] != undefined && anti_list['06'].length > 0 ? anti_list['06'][0].category_name:'マクロライド系'}
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['06'] != undefined && anti_list['06'].length > 0 && (
                      anti_list['06'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['07'] != undefined && anti_list['07'].length > 0 ? anti_list['07'][0].category_name:'リンコマイシン系'}
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['07'] != undefined && anti_list['07'].length > 0 && (
                      anti_list['07'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['08'] != undefined && anti_list['08'].length > 0 ? anti_list['08'][0].category_name:'テトラサイクリン系'}
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['08'] != undefined && anti_list['08'].length > 0 && (
                      anti_list['08'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['09'] != undefined && anti_list['09'].length > 0 ? anti_list['09'][0].category_name:'ペプチド系'}
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['09'] != undefined && anti_list['09'].length > 0 && (
                      anti_list['09'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                </div>
                <div className='col'>
                  <div className='sub-title'>
                    {anti_list != undefined && anti_list['10'] != undefined && anti_list['10'].length > 0 ? anti_list['10'][0].category_name:'ニューキノロン系'}                    
                  </div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['10'] != undefined && anti_list['10'].length > 0 && (
                      anti_list['10'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                  <div className='sub-title'>その他</div>
                  <div className='list'>
                    {anti_list != undefined && anti_list['99'] != undefined && anti_list['99'].length > 0 && (
                      anti_list['99'].map(item=> {
                        return (
                          <>
                            <div onClick={this.selectMedicine.bind(this, item)} className={this.checkSelected(item)?'selected clickable':'clickable'}>
                              {item.name}
                            </div>
                          </>
                        )
                      })
                    )}
                  </div>
                  <div style={{position:'absolute', bottom:'0px'}}>選択可能な薬剤は3薬剤までです。</div>
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
  AntiMedicineModal.contextType = Context;
  
  AntiMedicineModal.propTypes = {  
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
    modal_data : PropTypes.object,
    handleOk : PropTypes.func,
  };
  
  export default AntiMedicineModal;
  