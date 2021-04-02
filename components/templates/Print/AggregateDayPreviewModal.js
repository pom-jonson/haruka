import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import ReactToPrint from "react-to-print";
import renderHTML from "react-render-html";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  float: left;
  padding: 25px;
  overflow-x:scroll .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .doc_name {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
  }
  .fs-20 {
    font-size: 20px;
  }
  .fs-25 {
    font-size: 25px;
  }
  .td-w-50 {
    width: 50px;
    font-size: 20px;
    vertical-align: middle;
  }
  .td-w-100 {
    width: 100px;
    font-size: 20px;
    vertical-align: middle;
    text-align: center;
  }
  .td-w-150 {
    width: 150px;
    font-size: 20px;
    vertical-align: middle;
    text-align: center;
  }
  .patient_name {
    font-size: 28px;
    font-weight: bold;
    vertical-align: middle;
  }
  .td-content {
    width: calc(100% - 150px);
  }
  .wp-50 {
    width: 50%;
  }
  .wp-10 {
    width: 10%;
  }
  .wp-40 {
    width: 40%;
  }
  .table-bordered th,
  .table-bordered td {
    border: 1px solid black;
  }
  .patient_info {
    padding-top: 25px;
    text-align: center;

    th {
      font-size: 14px;
    }
  }
  td div {
    word-break: break-all;
  }
  td,
  th {
    font-size: 14px;
    padding: 3px;
  }
  .table th,
  .table td {
    vertical-align: middle;
  }

  .facility-div {
    width: 50%;
    float: left;
    font-size: 20px;
  }
`;

class AggregateDayPreviewModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  closeModal = () => {
    this.props.closeModal();
  };

  render() {
    const { closeModal } = this.props;
    return (
      <Modal
        show={true}
        onHide={closeModal}
        id="add_contact_dlg"
        className="master-modal aggregate-day-preview-modal"
      >
        <Modal.Header>
          <Modal.Title>日別 月間透析実績表</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <ComponentToPrint
              contents={this.props.contents}
              japan_year={this.props.japan_year}
              group_name={this.props.group_name}
              list_date_week={this.props.list_date_week}
              ref={(el) => (this.componentRef = el)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
          <ReactToPrint
            trigger={() => <Button className='red-btn'>印刷</Button>}
            content={() => this.componentRef}
          />
        </Modal.Footer>
      </Modal>
    );
  }
}

class ComponentToPrint extends React.Component {
  render() {
    let { list_date_week } = this.props;
    return (
      <Wrapper>
        <div className={"doc_name"}>日別 月間透析実績表</div>
        <div className="facility-div">
          <span>{this.props.japan_year}</span>
          <span>
            {"　"}グループ:{" "}
            {this.props.group_name != undefined
              ? this.props.group_name
              : "全て"}
          </span>
        </div>
        <div className={"patient_info"}>
          <table className="table-scroll table table-bordered">
            <tr>
              <th className="td-w-100"></th>
              {list_date_week !== undefined &&
                list_date_week !== null &&
                list_date_week.length > 0 &&
                list_date_week.map((item) => {
                  return (
                    <>
                      <th className="week_day">
                        {item.day}
                        <br />
                        {item.week}
                      </th>
                    </>
                  );
                })}
              <th className="td-w-130">
                透析
                <br />
                回数
              </th>
            </tr>
            {Object.keys(this.props.contents).map((index) => {
              let temp_item = this.props.contents[index];
              let tr = Object.keys(temp_item).map((index1) => {
                let item = temp_item[index1];
                return (
                  <>
                    <tr>
                      {item.title != "" && (
                        <td className="text-center" rowSpan={3}>
                          {renderHTML(item.title)}
                        </td>
                      )}
                      {Object.keys(item.values).map((index2) => {
                        let item_value = item.values[index2];
                        return (
                          <>
                            <td className="text-center">{item_value}</td>
                          </>
                        );
                      })}
                      <td>{item.all}</td>
                    </tr>
                  </>
                );
              });
              return tr;
            })}
          </table>
        </div>
      </Wrapper>
    );
  }
}

AggregateDayPreviewModal.contextType = Context;

AggregateDayPreviewModal.propTypes = {
  closeModal: PropTypes.func,
  contents: PropTypes.object,
  japan_year: PropTypes.string,
  group_name: PropTypes.string,
  list_date_week: PropTypes.array,
};

ComponentToPrint.contextType = Context;

ComponentToPrint.propTypes = {
  closeModal: PropTypes.func,
  contents: PropTypes.object,
  japan_year: PropTypes.string,
  group_name: PropTypes.string,
  list_date_week: PropTypes.array,
};

export default AggregateDayPreviewModal;
