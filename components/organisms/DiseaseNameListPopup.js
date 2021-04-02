import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import SmallDiseaseList from "../molecules/SmallDiseaseList";
import { KEY_CODES } from "../../helpers/constants";
import $ from "jquery";
import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";

const Ul = styled.ul`
  padding: 0;

  li {
    margin: 4px 0;
    padding: 4px;
    cursor: pointer;
  }

  li.focused {
    display: block;
    color: black;
    padding-left: 10px;
    background: rgb(160, 235, 255);
    border-radius: 13.5px;
  }

  .table-scroll {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 60px);

    .no-result {
      padding: 200px;
      text-align: center;
      padding-top: 30vh;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
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

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class DiseaseNameListPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      isEnter: false,
      diseaseList: []
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  async componentDidMount() {
    this.setState({ diseaseList: this.props.diseaseList });
    if (
      document.getElementById("disease_dlg") !== undefined &&
      document.getElementById("disease_dlg") !== null
    ) {
      document.getElementById("disease_dlg").focus();
    }
  }

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.up) {
      this.setState(
        {
          selectedIndex:
            this.state.selectedIndex >= 1
              ? this.state.selectedIndex - 1
              : this.state.diseaseList.length - 1
        },
        () => {
          this.scrollToelement();
        }
      );
    }
    if (e.keyCode === KEY_CODES.down) {
      this.setState(
        {
          selectedIndex:
            this.state.selectedIndex + 1 == this.state.diseaseList.length
              ? 0
              : this.state.selectedIndex + 1
        },
        () => {
          this.scrollToelement();
        }
      );
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      this.setState({ isEnter: true });
    }
  }

  getClassName = (uuid, index) => {
    let className = "";
    if (this.state.selectedIndex === index) {
      className = "focused";
    }
    return className;
  };

  scrollToelement = () => {
    const els = $(".med-modal [class*=focused]");
    const pa = $(".med-modal .modal-body");
    if (els.length > 0 && pa.length > 0) {
      const elHight = $(els[0]).height();
      const elTop = $(els[0]).position().top;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  onMouseOver = index => {
    this.setState({
      selectedIndex: index
    });
  };

  render() {
    const { isEnter } = this.state;
    const { insertMed } = this.props;
    let rate;

    if(this.props.isLoadData){
      if(this.props.diseaseList.length == 0){
        rate = <div className="table-scroll"><div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div></div>;
      } else {
        rate = this.props.diseaseList.map((medicine, i) => (
          <SmallDiseaseList
            key={medicine.uuid}
            medicine={medicine}
            insertMed={insertMed}
            className={this.getClassName(medicine.uuid, i)}
            isEnter={isEnter}
            onMouseOver={this.onMouseOver}
            itemIndex={i}
          />
        ));
      }
    } else {
      rate = <SpinnerWrapper><Spinner animation="border" variant="secondary" /></SpinnerWrapper>;
    }
    return (
      <Modal
        show={this.props.dieaseNameShow}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="disease_dlg"
        className="custom-modal-sm med-modal"
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>病名の選択</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Ul>
            {rate}
          </Ul>
        </Modal.Body>
        <Modal.Footer>
            <Footer>
                <Button className="cancel ml-2" onClick={this.props.dieaseNameClose}>閉じる</Button>
            </Footer>
        </Modal.Footer>
      </Modal>
    );
  }
}

DiseaseNameListPopup.propTypes = {
  isLoadData: PropTypes.bool,
  dieaseNameClose: PropTypes.func,
  diseaseList: PropTypes.array,
  dieaseNameShow: PropTypes.bool,
  insertMed: PropTypes.func
};

export default DiseaseNameListPopup;
