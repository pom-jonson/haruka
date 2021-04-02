import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as apiClient from "~/api/apiClient";
// import { disable, secondary, secondary200, surface } from "~/components/_nano/colors";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import TagDetailModal from "./TagDetailModal";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .content{    
    margin-top:0.5rem;
    height: calc(100% - 4rem);
    overflow-y: hidden;
    text-align: left;
    width: 100%;
  }
   .radio-group{
    label {font-size: 1rem;}
   }
   .search-box{
      .label-title {
        text-align: right;
        width: auto;
        margin: 0 0.5rem;
        font-size: 1rem;
        line-height:38px;
      }
      select {
        width: 8rem;
        font-size: 1rem;
      }
      label {
        margin: 0;
      }
      button {
        height: 38px;
        padding: 0;
        margin-left: 0.5rem;
      }
      span {
        font-size: 1rem;
      }
      .keyword-area {
        div {
          margin-top: 0;
        }
        input {
          width: 15rem;
          font-size: 1rem;
        }
      }
   }
   table {
    margin:0px;
    width: 100%;
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc( 80vh - 17rem);
      width:100%;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
    }
    tr{
      display: table;
      width: 100%;
    }
    thead{
      display:table;
      width:100%;    
      border-bottom: 1px solid #dee2e6;       
      background-color: #a0ebff;
      tr{
          width: calc(100% - 17px);
      }
    }
    td {
      padding: 0 0.3rem; 
      word-break: break-all;
      font-size: 1rem;
      vertical-align: middle;
      border: 1px solid #dee2e6;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.25rem;
        font-size: 1rem;
        white-space:nowrap;
        border:none;
        border-right:1px solid #dee2e6;
        font-weight: normal;
    }
    .item-name {
      width: 9rem;
    }
    .item-title {
      width: 25rem;
    }
    .item-public-range {
      width: 10rem;
    }
    .item-type {
      width: 15rem;
    }
    .item-btn {
      width: 8rem;
    }
    button {width: 100%;}
  }
  .no-result {
    padding: 200px;
    text-align: center;
    .border {
      width: 360px;
      margin: auto;
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
 `;

const SpinnerWrapper = styled.div`
    padding: 0;
`;

class TagListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display_list: [
        {id: 2, value: "すべて"},
        {id: 1, value: "表示のみ"},
        {id: 0, value: "非表示のみ"},
      ],
      is_enabled:1,
      sticky_note_types:[{id: 0, value: "すべて"}],
      sticky_note_type_id:this.props.sticky_note_type_id,
      public_ranges:[
        {id: 0, value: "すべて"},
        {id: 1, value: "全体"},
        {id: 2, value: "本人のみ"},
      ],
      public_range:0,
      keyword:'',
      table_list: null,
      openDetailModal: false,
    };
  }

  componentDidMount() {
    let sticky_note_types = this.state.sticky_note_types;
    if(this.props.sticky_note_types != null && this.props.sticky_note_types !== undefined){
      if(this.props.sticky_note_types.length > 0){
        this.props.sticky_note_types.map((sticky)=>{
          let item = {};
          item.id = sticky.sticky_note_type_id;
          item.value = sticky.name;
          sticky_note_types.push(item);
        });
        this.setState({sticky_note_types});
      }
    }
    this.searchList();
  }

  getDisplaySelect = e => {
    this.setState({ is_enabled: parseInt(e.target.id) });
  };

  getPublicRange = e => {
    this.setState({ public_range: parseInt(e.target.id) });
  };

  getStickyNote = e => {
    this.setState({ sticky_note_type_id: parseInt(e.target.id) });
  };

  showDetailModal = (data) => {
    this.setState({
      sticky_note_data: data,
      openDetailModal: true
    })
  };

  closeModal = () => {
    this.refresh = 1;
    this.setState({openDetailModal: false})
  };

  setKeyWord = e => {
    this.setState({keyword: e.target.value});
  };

  searchList = async () => {
    this.setState({ table_list:null });
    let path = "/app/api/v2/order/tag/searchStickyNotes";
    let post_data = {
      is_enabled:this.state.is_enabled,
      sticky_note_type_id: this.state.sticky_note_type_id,
      keyword:this.state.keyword,
      system_patient_id:this.props.system_patient_id,
      public_range:this.state.public_range,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          this.setState({ table_list:res });
        }
      })
      .catch(() => {

      })
  };

  render() {        
    return  (
      <Modal show={true} className="custom-modal-sm tag-list-modal">
        <Modal.Header><Modal.Title>付箋付き項目一覧</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={`search-box d-flex`}>
              <SelectorWithLabel
                options={this.state.display_list}
                title="表示区分"
                getSelect={this.getDisplaySelect}
                departmentEditCode={this.state.is_enabled}
              />
              <SelectorWithLabel
                options={this.state.public_ranges}
                title="公開範囲"
                getSelect={this.getPublicRange}
                departmentEditCode={this.state.public_range}
              />
              <SelectorWithLabel
                options={this.state.sticky_note_types}
                title="種類"
                getSelect={this.getStickyNote}
                departmentEditCode={this.state.sticky_note_type_id}
              />
              <div className={'keyword-area'}>
                <InputWithLabel
                  label="キーワード"
                  type="text"
                  getInputText={this.setKeyWord.bind(this)}
                  diseaseEditData={this.state.keyword}
                />
              </div>
              <Button onClick={this.searchList.bind(this)}>検索</Button>
            </div>
            <div className={`content`}>
              <table>
                <thead>
                  <tr>
                    <th className="item-name">記載日</th>
                    <th className="item-public-range">公開範囲</th>
                    <th className="item-type">種類</th>
                    <th className="item-title">タイトル・概要</th>
                    <th className="item-btn">表示状態</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.table_list == null ? (
                    <tr>
                      <td colSpan={'6'}>
                        <div className='spinner_area no-result'>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </div>
                      </td>
                    </tr>
                  ):(
                    <>
                      {this.state.table_list.length === 0 ? (
                        <tr><td colSpan={'6'}><div className="no-result"><div className={'border'}>条件に一致する結果は見つかりませんでした。</div></div></td></tr>
                      ) : (
                        <>
                          {this.state.table_list.map(item=>{
                            return (
                              <>
                                <tr>
                                  <td className="item-name">
                                    {item.created_at.substr(0, 4)}年
                                    {item.created_at.substr(5, 2)}月
                                    {item.created_at.substr(8, 2)}日
                                  </td>
                                  <td className="item-public-range">{item.public_range === 0 ? '全体' : '本人のみ'}</td>
                                  <td className="item-type">{item.name}</td>
                                  <td className="item-title">{item.title}</td>
                                  <td className="item-btn">{item.is_enabled === 1 ? '表示' : '非表示'}</td>
                                  <td style={{padding:0}}>
                                    <button onClick={this.showDetailModal.bind(this,item)}>詳細</button>
                                  </td>
                                </tr>
                              </>
                            )
                          })}
                        </>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
        </Modal.Footer>
        {this.state.openDetailModal && (
          <TagDetailModal
            modal_data={this.state.sticky_note_data}
            closeModal={this.closeModal}
          />
        )}
      </Modal>
    );
  }
}

TagListModal.contextType = Context;

TagListModal.propTypes = {
    closeModal: PropTypes.func,
    sticky_note_type_id: PropTypes.number,
    sticky_note_types: PropTypes.array,
    system_patient_id:PropTypes.number,
};

export default TagListModal;
