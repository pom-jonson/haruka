import React, { Component } from "react";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import * as colors from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import auth from "~/api/auth";

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {
    display: flex;
  }
  .MyCheck{
    margin-left: 24px;
    margin-bottom: 5px;
    label{
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .title {
    font-size: 30px;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .hBWNut {
    padding-top: 90px!important;
  }
  .login-info-area {
    background-color: white;
    width: 100%;
    max-height: calc(100% - 200px);
    overflow-y: auto;
    table {
        margin-bottom: 0;
    }
    .go-karte {
        cursor: pointer;
    }
    .go-karte:hover{
        background:lightblue!important;      
    }
    td {
        padding: 8px; 
        text-align: center;
        font-size: 16px;
        vertical-align: middle;
    
    }
    th {
        text-align: center;
        padding: 8px; 
        font-size: 18px;
        font-weight: normal;
    }
    .no-result {
      padding: 200px;
      text-align: center;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
    .check-area {
        label {
            margin:0;
        }
    }
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 10px 0px 10px 10px;
  width: 100%;
  .space-area {
    width: calc(100% - 170px);
  }
  button {
    background-color: rgb(255, 255, 255);
    min-width: auto;
    margin-left: 24px;
  }
`;

const SpinnerWrapper = styled.div`
    padding-top: 70px;
    padding-bottom: 70px;
    height: 100px;
`;

class LoginList extends Component {
    constructor(props) {
        super(props);

        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        this.state = {
            login_data:null,
            force_logout_numbers:[],
            confirm_message:'',
            alert_messages:'',
            staff_number:authInfo.user_number,
        };
    }

    async componentDidMount() {
        auth.refreshAuth(location.pathname+location.hash);
        await this.getSearchResult();
    }

    getSearchResult =async()=>{
        let path = "/app/api/v2/secure/get/login_list";
        let post_data = {
        };
        await apiClient
            ._post(path, {
                params: post_data
            })
            .then((res) => {
                if(res.length > 0){
                    this.setState({
                        login_data: res,
                        force_logout_numbers:[],
                    });
                } else {
                    this.setState({
                        login_data: [],
                        force_logout_numbers:[],
                    });
                }
            })
            .catch(() => {
            });
    }

    setForceLogoutNumber = (name, number) => {
        let force_logout_numbers = this.state.force_logout_numbers;
        let index = force_logout_numbers.indexOf(number);
        if(index > -1){
            force_logout_numbers.splice(index, 1);
        } else {
            force_logout_numbers.push(number);
        }
        this.setState({force_logout_numbers});
    };

    forceLogout =async()=>{
        this.closeModal();
        let path = "/app/api/v2/secure/set/forceLogout";
        let post_data = {
            force_logout_numbers:this.state.force_logout_numbers
        };
        await apiClient
            ._post(path, {
                params: post_data
            })
            .then((res) => {
                if(res){
                    this.getSearchResult();
                }
            })
            .catch(() => {
            });
    }

    openConfirmModal =()=>{
        if(this.state.force_logout_numbers.length === 0){
            this.setState({alert_messages:'ユーザーを選択してください。'});
        } else {
            this.setState({confirm_message:'選択したユーザーを強制ログアウトしますか?'});
        }
    }

    closeModal =()=>{
        this.setState({
            confirm_message:'',
            alert_messages:'',
        });
    }

    render() {

        return (
            <PatientsWrapper>
                <div className="title-area"><div className={'title'}>ログイン一覧</div></div>
                <Flex>
                    <div className={'space-area'}></div>
                    <Button type="mono" onClick={this.openConfirmModal.bind(this)}>強制ログアウト</Button>
                </Flex>
                <div className={'login-info-area'}>
                    <table className="table-scroll table table-bordered" id="code-table">
                        <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>ユーザー名</th>
                            <th>IP</th>
                            <th>最終アクセスページ</th>
                            <th>最終ログイン日時</th>
                            <th>最終アクセス日時</th>
                            <th>強制</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.login_data == null ? (
                            <tr>
                                <td colSpan={'8'}>
                                    <div className='spinner_area'>
                                        <SpinnerWrapper>
                                            <Spinner animation="border" variant="secondary" />
                                        </SpinnerWrapper>
                                    </div>
                                </td>
                            </tr>
                        ):(
                            <>
                                {this.state.login_data.length === 0 ? (
                                    <tr><td colSpan={'8'}><div className="no-result"><span>ログイン中のユーザーかありません。</span></div></td></tr>
                                ) : (
                                    this.state.login_data.map((item) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td className={'check-area'}>
                                                        {this.state.staff_number !== item.staff_number && (
                                                            <>
                                                                <Checkbox
                                                                    getRadio={this.setForceLogoutNumber.bind(this)}
                                                                    number={item.number}
                                                                    value={this.state.force_logout_numbers.indexOf(item.number) > -1}
                                                                    name={`number_check`}
                                                                />
                                                            </>
                                                        )}
                                                    </td>
                                                    <td>{item.signin_id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.ip_addr}</td>
                                                    <td className={'text-left'}>{item.latest_page}</td>
                                                    <td>{item.latest_login}</td>
                                                    <td>{item.updated_at}</td>
                                                    <td className={'check-area'}>
                                                        <Checkbox
                                                            label=""
                                                            value={item.force_logout}
                                                            isDisabled={true}
                                                            name="check"
                                                        />
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })
                                )
                                }
                            </>
                        )}
                        </tbody>
                    </table>
                </div>
                {this.state.confirm_message !== "" && (
                    <SystemConfirmModal
                        hideConfirm= {this.closeModal.bind(this)}
                        confirmCancel= {this.closeModal.bind(this)}
                        confirmOk= {this.forceLogout.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                    />
                )}
                {this.state.alert_messages !== "" && (
                    <SystemAlertModal
                        hideModal= {this.closeModal.bind(this)}
                        handleOk= {this.closeModal.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                    />
                )}
            </PatientsWrapper>
        );
    }
}

LoginList.contextType = Context;
export default LoginList;
