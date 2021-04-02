import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const DepartOneWrapper = styled.div`
  .content-list{
    padding: 3px;
    height: 35vh;
    float:left;
    width: calc(26vw);
    border: 1px solid #aaa;
    overflow-y: auto;
  }
  .content-new-list{
    height: 8rem;
    overflow-y: auto;
  }
    .selected{
        background: lightblue;
    }
    .row-item {
      cursor:pointer;
    }
`;

const DepartTwoWrapper = styled.div`
  margin-left: 10px;
  .content-list{
    padding: 3px;
    height: 35vh;
    width: calc(26vw);
    border: 1px solid #aaa;
    overflow-y: auto;
  }
  .content-new-list{
    height: 8rem;
    overflow-y: auto;
  }
  .sub-title{
    height: 20px;
    margin-top: 2px;
  }
    .selected{
        background: lightblue;
    }
    .row-item {
      cursor:pointer;
    }
`;

class DepartOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classification1_data: (props.all_data != null && props.all_data.inspection_classification1 != undefined) ? props.all_data.inspection_classification1 : null,
      classification2_data: (props.all_data != null && props.all_data.inspection_classification2 != undefined && props.all_data.inspection_classification2[props.classification1_id] != undefined)
        ? props.all_data.inspection_classification2[props.classification1_id] : null,
      inspection_type_data: (props.all_data != null && props.all_data.inspection_item != undefined) ? props.all_data.inspection_type : null,
      inspection_item_data: (props.all_data != null && props.all_data.inspection_item != undefined && props.all_data.inspection_item[props.inspection_type_id] != undefined)
        ? props.all_data.inspection_item[props.inspection_type_id] : null,
      classfic1:props.classification1_id,
      classfic2:props.classification2_id,
      type_id:props.inspection_type_id,
      item_id:props.inspection_item_id,
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      classification1_data: (nextProps.all_data != null && nextProps.all_data.inspection_classification1 != undefined)
        ? nextProps.all_data.inspection_classification1 : null,
      classification2_data: (nextProps.all_data != null && nextProps.all_data.inspection_classification2 != undefined && nextProps.all_data.inspection_classification2[nextProps.classification1_id] != undefined)
        ? nextProps.all_data.inspection_classification2[nextProps.classification1_id] : null,
      inspection_type_data: (nextProps.all_data != null && nextProps.all_data.inspection_item != undefined) ? nextProps.all_data.inspection_type : null,
      inspection_item_data: (nextProps.all_data != null && nextProps.all_data.inspection_item != undefined && nextProps.all_data.inspection_item[nextProps.inspection_type_id] != undefined)
        ? nextProps.all_data.inspection_item[nextProps.inspection_type_id] : null,
      classfic1:nextProps.classification1_id,
      classfic2:nextProps.classification2_id,
      type_id:nextProps.inspection_type_id,
      item_id:nextProps.inspection_item_id,
    });
  }
  
  selectClassfic1 = (key) => {
    this.setState({
      classfic1:key,
      classification2_data:(this.props.all_data != null && this.props.all_data.inspection_classification2 != undefined && this.props.all_data.inspection_classification2[key] != undefined) ? this.props.all_data.inspection_classification2[key] : null,
    });
    this.props.selectClassific1(key, this.state.classification1_data[key]);
  }
  
  selectClassfic2 = (key) => {
    this.setState({
      classfic2:key,
    });
    this.props.selectClassific2(key, this.state.classification2_data[key]);
  }
  
  selectType = (key) => {
    this.setState({
      type_id:key,
      inspection_item_data:(this.props.all_data != null && this.props.all_data.inspection_item != undefined && this.props.all_data.inspection_item[key] != undefined) ? this.props.all_data.inspection_item[key] : null,
    });
    this.props.selectType(key, this.state.inspection_type_data[key]);
  }
  
  selectItem = (key) => {
    this.setState({
      item_id:key,
    });
    this.props.selectItem(key, this.state.inspection_item_data[key]);
  }
  
  render() {
    return (
      <>
        <DepartOneWrapper>
          <div className={'head-title'}>検査種別</div>
          <div className={`content-list ${this.props.inspection_id == 7 ? "content-new-list":""}`}
               id={this.props.inspection_id == 17?'inspection_type_name_id':'classification1_name_id'}>
            {this.props.inspection_id === 17 ? (
              <>
                {this.state.inspection_type_data != null &&
                Object.keys(this.state.inspection_type_data).map((index)=>{
                    return (
                      <>
                        <div className={this.state.type_id === index ? 'row-item selected' : 'row-item'} onClick={this.selectType.bind(this, index)}>
                          <div>{this.state.inspection_type_data[index]}</div>
                        </div>
                      </>
                    );
                  }
                )}
              </>
            ):(
              <>
                {this.state.classification1_data != null &&
                Object.keys(this.state.classification1_data).map((index)=>{
                    return (
                      <>
                        <div className={this.state.classfic1 === index ? 'row-item selected' : 'row-item'} onClick={this.selectClassfic1.bind(this, index)}>
                          <div>{this.state.classification1_data[index]}</div>
                        </div>
                      </>
                    );
                  }
                )}
              </>
            )}
          </div>
        </DepartOneWrapper>
        <DepartTwoWrapper>
          <div className={'head-title'}>{this.props.inspection_id === 17 ? '検査項目' : '検査詳細'}</div>
          <div className={`content-list ${this.props.inspection_id == 7 ? "content-new-list":""}`}
               id={this.props.inspection_id == 17?'inspection_item_name_id':'classification2_name_id'}>
            {this.props.inspection_id === 17 ? (
              <>
                {this.state.inspection_item_data != null &&
                Object.keys(this.state.inspection_item_data).map((index)=>{
                    return (
                      <>
                        <div className={this.state.item_id === index ? 'row-item selected' : 'row-item'} onClick={this.selectItem.bind(this, index)}>
                          <div>{this.state.inspection_item_data[index]}</div>
                        </div>
                      </>
                    );
                  }
                )}
              </>
            ) : (
              <>
                {this.state.classification2_data != null &&
                Object.keys(this.state.classification2_data).map((index)=>{
                    return (
                      <>
                        <div className={this.state.classfic2 === index ? 'row-item selected' : 'row-item'} onClick={this.selectClassfic2.bind(this, index)}>
                          <div>{this.state.classification2_data[index]}</div>
                        </div>
                      </>
                    );
                  }
                )}
              </>
            )}
          </div>
        </DepartTwoWrapper>
      </>
    );
  }
}

DepartOne.propTypes = {
  all_data: PropTypes.array,
  inspection_id: PropTypes.number,
  selectClassific1: PropTypes.number,
  classification1_id: PropTypes.func,
  selectClassific2: PropTypes.number,
  classification2_id: PropTypes.func,
  selectType: PropTypes.func,
  inspection_type_id:PropTypes.number,
  selectItem: PropTypes.func,
  inspection_item_id:PropTypes.number,
};

export default DepartOne;
