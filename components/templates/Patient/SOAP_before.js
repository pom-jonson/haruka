import React, { Component } from "react";
import styled from "styled-components";
import {
  surface,
  onSurface,
  error,
  secondary,
  disable
} from "../../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  padding-top: 162px;

  nav {
    padding: 4px 0;
    ul {
      padding-left: 0;
      margin-bottom: 8px;
      &:before {
        content: "";
        border-left: 1px solid #ccc;
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
      }
      ul {
        margin-left: 10px;
        position: relative;
        li {
          &:before {
            content: "";
            border-top: 1px solid #ccc;
            display: block;
            width: 8px;
            height: 0;
            position: absolute;
            top: 10px;
            left: 0;
          }
          &:last-child:before {
            background: #fff;
            height: auto;
            top: 10px;
            bottom: 0;
          }
        }
      }
      li {
        margin: 0;
        padding: 3px 12px;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 13px;
        line-height: 20px;
        position: relative;
      }
    }

    li {
      cursor: pointer;
      list-style-type: none;
    }
  }

  .mark {
    color: ${surface};
    font-size: 12px;
    display: inline-block;
    padding: 2px;
    line-height: 1;
    &.red {
      background-color: ${error};
    }
    &.blue {
      background-color: ${secondary};
    }
  }

  .data-item {
    padding: 4px 32px 4px 8px;
    position: relative;
    &.open {
      border-left: 8px solid ${error};
      .angle {
        transform: rotate(180deg);
      }
    }
  }

  p {
    margin: 0;
  }

  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .entry-name {
    display: inline-block;
    width: 35%;
  }

  .soap-data {
    width: 100%;

    th,
    td {
      border: 1px solid ${disable};
      padding: 2px;
    }

    th {
      background-color: #ccc;
      text-align: center;
    }

    input {
      width: 100%;
    }
  }

  .not-consented {
    color: ${error};
  }

  .btn {
    background-color: ${secondary};
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    color: ${surface};
    display: block;
    font-size: 14px;
    text-align: center;
    margin-left: auto;
    padding: 2px 4px;
    line-height: 1;
  }
`;

const Col = styled.div`
  background-color: ${surface};
  width: 32%;
  max-height: calc(100vh - 182px);
  overflow-y: scroll;
  -ms-overflow-style: none;
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
  position: absolute;
  top: 0px;
  right: 8px;
  bottom: 0px;
  margin: auto;
`;

class SOAP extends Component {
  render() {
    return (
      <Wrapper>
        <Col>
          <nav>
            <ul>
              <li>
                自科カルテ(内科)
                <ul>
                  <li>
                    19/01/01(火)[入]〜
                    <ul>
                      <li>
                        <span className="mark red">入</span>19/01/01(火)
                      </li>
                      <li>
                        <span className="mark blue">再</span>19/01/02(水)
                      </li>
                    </ul>
                  </li>
                  <li>2018年</li>
                  <li>2017年</li>
                  <li>2016年</li>
                </ul>
              </li>
              <li>全科カルテ</li>
              <li>オーダー</li>
              <li>結果・報告</li>
            </ul>
          </nav>
        </Col>

        <Col>
          <div className="data-list">
            <div className="data-item open">
              <div className="flex">
                <div className="note">【プログレスノート】</div>
                <div className="department text-right">内科/院外処方</div>
              </div>
              <div className="date">2019年01月01日12時30分</div>
              <div className="doctor-name text-right">土曜待機Ｄｒ</div>
              <Angle className="angle" icon={faAngleDown} />
            </div>
            <table className="soap-data">
              <tr>
                <th>#</th>
                <td>本人。付き添いの方同伴</td>
              </tr>
              <tr>
                <th>(S)</th>
                <td>
                  <p>
                    (付き添いの方)
                    <br />
                    検査をお願いします
                  </p>
                  <p>
                    (本人)
                    <br />
                    検査も入院もできるならする
                  </p>
                </td>
              </tr>
              <tr>
                <th>(O)</th>
                <td>
                  <p>SPO2:93</p>
                  <p>P:70</p>
                  <p>BP:110/86</p>
                </td>
              </tr>
              <tr>
                <th>(A)</th>
                <td />
              </tr>
              <tr>
                <th>(P)</th>
                <td>本日入院</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button className="btn" type="button">
                    登録
                  </button>
                </td>
              </tr>
            </table>

            <div className="data-item">
              <div className="flex">
                <div className="note">【プログレスノート】</div>
                <div className="department text-right">内科/院外処方</div>
              </div>
              <div className="date">2019年01月01日12時30分</div>
              <div className="doctor-name text-right">
                <p className="text-right">
                  <span className="not-consented">[未承認]</span>依頼医:
                  <span className="entry-name">土曜待機Ｄｒ</span>
                </p>
                <p className="text-right">
                  入力者:<span className="entry-name">看護 花子</span>
                </p>
              </div>
              <Angle className="angle" icon={faAngleDown} />
            </div>
          </div>
        </Col>

        <Col>
          <div className="data-input">
            <div className="data-item open">
              <div className="flex">
                <div className="note">【プログレスノート】</div>
                <div className="department text-right">内科/院外処方</div>
              </div>
              <div className="date">2019年01月01日12時30分</div>
              <div className="doctor-name text-right">土曜待機Ｄｒ</div>
              <Angle className="angle" icon={faAngleDown} />
            </div>
            <table className="soap-data">
              <tr>
                <th>#</th>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <th>(S)</th>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <th>(O)</th>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <th>(A)</th>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <th>(P)</th>
                <td>
                  <input type="text" />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button className="btn" type="button">
                    保存
                  </button>
                </td>
              </tr>
            </table>
          </div>
        </Col>
      </Wrapper>
    );
  }
}
export default SOAP;
