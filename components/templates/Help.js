import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import styled from "styled-components";
import { surface, onSurface, midEmphasis, secondary } from "../_nano/colors";
import Title from "../atoms/Title";
import Login from "../_demo/Help/login1.png";
import Reception1 from "../_demo/Help/reception1.png";
import Reception2 from "../_demo/Help/reception2.png";
import Reception3 from "../_demo/Help/reception3.png";
import Karte01 from "../_demo/Help/karte01.png";
import Karte02 from "../_demo/Help/karte02.png";
import Karte03 from "../_demo/Help/karte03.png";
import Karte04 from "../_demo/Help/karte04.png";
import Karte05 from "../_demo/Help/karte05.png";
import Karte06 from "../_demo/Help/karte06.png";
import Karte07 from "../_demo/Help/karte07.png";
import Karte08 from "../_demo/Help/karte08.png";
import Karte09 from "../_demo/Help/karte09.png";
import Karte10 from "../_demo/Help/karte10.png";
import Karte11 from "../_demo/Help/karte11.png";
import Karte12 from "../_demo/Help/karte12.png";
import Karte13 from "../_demo/Help/karte13.png";
import Karte14 from "../_demo/Help/karte14.png";
import Karte15 from "../_demo/Help/karte15.png";
import Karte16 from "../_demo/Help/karte16.png";
import Karte17 from "../_demo/Help/karte17.png";
import Karte18 from "../_demo/Help/karte18.png";
import Karte19 from "../_demo/Help/karte19.png";
import Karte20 from "../_demo/Help/karte20.png";
import Karte21 from "../_demo/Help/karte21.png";
import Doctor1 from "../_demo/Help/doctor1.png";
import Doctor2 from "../_demo/Help/doctor2.png";
import Logout from "../_demo/Help/logout1.png";

const Wrapper = styled.div`
  font-size: 14px;
  padding: 49px 0 24px;
  height: 100%;
  max-height: 100vh;
  overflow-y: scroll;
  -ms-overflow-style: none;

  nav {
    background-color: ${surface};
    box-shadow: 1px 1px 0 0 rgba(223, 223, 223, 0.5);
    width: 120px;
    height: calc(100% - 48px);
    position: fixed;
    top: 48px;
    left: 0;

    li {
      padding: 4px;
    }

    a {
      color: ${onSurface};
      font-size: 12px;
      &:hover {
        color: ${secondary};
      }
    }
  }

  .title {
    background-color: ${midEmphasis};
    color: ${surface};
    font-size: 16px;
    padding: 4px 8px;
    margin-top: 24px;
  }

  .content-box {
    background-color: ${surface};
    padding: 8px 16px;
  }

  .flex {
    display: flex;
    align-items: flex-start;
  }

  h2 {
    margin-top: 8px;
  }

  .subtitle {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  img {
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
    display: block;
    width: 48%;
    margin-right: 2%;
  }

  .text-box {
    width: 50%;
  }

  ul {
    padding-left: 0;
    margin-bottom: 8px;
  }

  li {
    list-style-type: none;
  }

  p {
    margin-bottom: 8px;
  }

  .bold {
    font-size: 15px;
    font-weight: bold;
  }

  .underline {
    text-decoration: underline;
  }

  .frame {
    display: inline-block;
    width: 50px;
    height: 12px;
    margin-left: 4px;
    &.red {
      border: 3px solid #e32400;
    }
    &.blue {
      border: 3px solid #008cb4;
    }
    &.orange {
      border: 3px solid #d58400;
    }
  }

  .red-border {
    border: 1px solid #e32400;
    padding: 4px;
  }

  .orange-border {
    border: 1px solid #d58400;
    padding: 4px;
  }

  .red {
    color: red;
    font-weight: bold;
  }
`;

const Help = () => {
  return (
    <Wrapper>
      <nav>
        <ul>
          <li>
            <Link smooth to="/help#login">
              1.ログイン
            </Link>
          </li>
          <li>
            <Link smooth to="/help#reception">
              2.受付患者様リスト
            </Link>
          </li>
          <li>
            <Link smooth to="/help#karte">
              3.患者様カルテ
            </Link>
          </li>
          <li>
            <Link smooth to="/help#doctor">
              4.依頼医
            </Link>
          </li>
          <li>
            <Link smooth to="/help#logout">
              5.ログアウト
            </Link>
          </li>
        </ul>
      </nav>

      <div id="login" className="title">
        1.ログイン
      </div>
      <div className="content-box">
        <Title title="ログインについて" />
        <div className="flex">
          <img src={Login} alt="" />
          <div className="text-box">
            ログイン手順
            <ul>
              <li>
                ①ログイン用の<span className="bold">ID</span>
                を記入してください。
              </li>
              <li>
                ②ログイン用の<span className="bold">パスワード</span>
                を記入してください。
              </li>
              <li>③「ログイン」ボタンをクリックしてログインします。</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="reception" className="title">
        2.受付患者様リスト
      </div>
      <div className="content-box">
        <Title title="受付患者様リストについて" />
        <div className="flex">
          <img src={Reception1} alt="" />
          <div className="text-box">
            <p>
              ログインが完了すると左の画像のように受付済みの患者様リストが表示されます。
            </p>
            <p>
              ①<span className="frame red" />
              にログインしたアカウント名が表示されますのでご確認ください。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="受付患者様リストについて" />
        <div className="flex">
          <img src={Reception2} alt="" />
          <div className="text-box">
            <ul>
              <li>
                ①<span className="frame red" />
                で囲まれた条件を指定
              </li>
              <li>②「検索」をクリック</li>
            </ul>
            <p>
              これにより患者様の一覧が表示され患者様を探しやすくなります。
              <br />
              記載条件は以下の通りです。
            </p>
            <ul>
              <li>
                <span className="bold">状態</span>
                ：患者様の「未診療」「診療済」の選択します。
              </li>
              <li>
                <span className="bold">担当科</span>
                ：受付をした診療科（内科等）を選択します。
              </li>
              <li>
                <span className="bold">日付選択</span>
                ：日付選択の枠内をクリックするとカレンダーが表示されるので、受付をした日付をカレンダーの中から選択します。
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="受付患者様リストについて" />
        <div className="flex">
          <img src={Reception3} alt="" />
          <div className="text-box">
            <p>
              患者ごとに処方内容などのデータがまとめられており、
              <br />
              <span className="frame blue" />
              枠内の患者様ごとにクリックすることでその患者様の情報をより詳細に見る、追記することが可能です。
            </p>
            <ul>
              <li>
                <span className="bold">診療科</span>：受付をした診療科
              </li>
              <li>
                <span className="bold">受付番号</span>
                ：受付をした診療科での受付番号
              </li>
              <li>
                <span className="bold">患者ID</span>
                ：病院内で登録されている患者ID
              </li>
              <li>
                <span className="bold">名前</span>：患者様の名前
              </li>
              <li>
                <span className="bold">診療内容</span>
                ：患者のその日に受付した診療内容
              </li>
              <li>
                <span className="bold">受付時間</span>：受付をした日付と時間
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="karte" className="title">
        3.患者様カルテ
      </div>
      <div className="content-box">
        <Title title="患者様カルテについて" />
        <div className="flex">
          <img src={Karte01} alt="" />
          <div className="text-box">
            <p>受付患者様リストで選択した患者様のカルテになります。</p>
            <div>
              A
              <ul className="red-border">
                <li>
                  <span className="bold">処方歴</span>
                  ：処方日時、処方内容、変更履歴など患者様のデータが記載されています。
                </li>
                <li>
                  <span className="bold">よく使う薬剤</span>
                  ：処方回数の多い薬品の回数や用法などを見ることが可能です。
                </li>
              </ul>
            </div>
            <div>
              B
              <ul className="orange-border">
                <li>
                  <span className="bold">処方箋</span>
                  ：処方箋の検索・指定、用法の指定などを記入します。
                </li>
                <li>
                  <span className="bold">備考・その他</span>
                  ：その他患者様に関して特筆すべきことを記入します。
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方箋」についてー" />
        <div className="flex">
          <img src={Karte02} alt="" />
          <div className="text-box">
            <h3 className="subtitle">①薬品の検索</h3>
            <ul>
              <li>
                1:処方箋欄にて処方する薬品について枠内（画像ではRp1）に記入
              </li>
              <li>2:キーボードのEnterを押す</li>
            </ul>
            <p>
              ＊記入する文字は
              <span className="bold underline">３文字以上入力必須</span>です。
              <br />
              検索をかける（Enterを押す）と記入した文字の候補が出てきます。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方箋」についてー" />
        <div className="flex">
          <img src={Karte03} alt="" />
          <div className="text-box">
            <h3 className="subtitle">②薬品の選択</h3>
            <p>
              ①の作業から薬品の候補が出てきますので候補の中から処方する薬品をクリックもしくはキーボードの上下とエンターで決定してください。
            </p>
            <h3 className="subtitle">③容量の指定</h3>
            <ul>
              <li>
                1:選択された薬品の一回分の容量を入力する画面が出くるので指定
              </li>
              <li>2:「確定」を押す</li>
            </ul>
            <p>
              ＊「キャンセル」を押すと全て入力されなかった事になりますので注意してください。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方箋」についてー" />
        <div className="flex">
          <img src={Karte04} alt="" />
          <div className="text-box">
            <h3 className="subtitle">④用法選択</h3>
            <ul>
              <li>
                1:「用法選択」をクリック。又は
                <span className="frame blue" />
                のように薬品の検索入力欄で空欄のままエンター。
              </li>
              <li>2:「用法」を選択する画面が開かれる</li>
              <li>
                3:
                <span className="frame orange" />の
                <span className="bold">a</span>
                からカテゴリをクリック。又はキーボードの左右で選択。
                <br />
                <span className="bold">b</span>
                の中から用法をクリック。又はキーボードの上下で選択。
              </li>
            </ul>
            <p>
              ＊もし他にも用法が同じ薬品があるならば、用法選択の前に
              <span className="frame blue" />
              で囲まれたところに①〜③と同じ手順で薬品を追加してください。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方箋」についてー" />
        <div className="flex">
          <img src={Karte05} alt="" />
          <div className="text-box">
            <h3 className="subtitle">⑤服用日数の指定</h3>
            <ul>
              <li>1:薬品を患者様が服用する日数を指定する画面が表示</li>
              <li>2:何日分出すか数字をクリック。又はキーボードの数値入力。</li>
              <li>
                3:「確定」をクリック。又はエンター。(単位は「日」となっています。)
              </li>
            </ul>
            <p>
              その後も同じような流れで処方した薬品の情報について情報を記入してください。
            </p>
            <p>
              例）「３」と「０」をクリックすることで30と表示され、30日分の薬品を処方することを意味します。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方箋」についてー" />
        <div className="flex">
          <img src={Karte06} alt="" />
          <div className="text-box">
            <h3 className="subtitle">⑥表示確認</h3>
            <p className="red-border">
              Rp1に入力した情報が記載されているか確認を行ってください。
            </p>
            <p className="orange-border">
              その他にも、（用法が異なる）薬品がある場合は、Rp1の下のRp2に用の枠があるので同じ手順で追加できます。Rp2が完了すればRp3に、という手順で同じような流れで「処方箋」の欄に処方した薬品の情報について情報を記入してください。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方箋」についてー" />
        <div className="flex">
          <img src={Karte07} alt="" />
          <div className="text-box">
            <h3 className="subtitle">
              ⑦薬品別の追加コメント、粉砕、後発不可、一般名処方、別包の個別設定
            </h3>
            <ul>
              <li>1:対象薬品の行を「右クリック」</li>
              <li>2:表示された項目をクリックして設定</li>
            </ul>
            <p>＊薬品の追加、削除数量の変更も可能です</p>
            <h3 className="subtitle">
              ⑧Rp単位の追加用法コメント、一包化、臨時処方日数変更の設定
            </h3>
            <ul>
              <li>1:「処方箋」欄の用法の行を右クリック</li>
              <li>2:左の画像のように表示される</li>
              <li>3:表示された項目をクリックして設定</li>
            </ul>
            <h3 className="subtitle">⑨処方開始日の設定変更</h3>
            <ul>
              <li>1:「処方箋」欄の処方開始日を右クリック</li>
              <li>2:左の画像のように表示される</li>
              <li>
                3:処方開始日を変更
                <br />
                （枠内を直接入力可能です。）
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方箋」についてー" />
        <div className="flex">
          <img src={Karte08} alt="" />
          <div className="text-box">
            <p>
              その日に処方した内容の入力が完了したら、画面右上の「カルテを閉じる」をクリックしてください。
            </p>
            <p>
              ＊まだ内容の保存は完了していないので、ブラウザの
              <span className="red">×</span>
              ボタンを直接クリックしてページを消さないように注意してください。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー内容の保存ー" />
        <div className="flex">
          <img src={Karte09} alt="" />
          <div className="text-box">
            <ul>
              <li>1:「カルテを閉じる」をクリック</li>
              <li>2:左画像のような選択肢が表示される</li>
              <li>3:この中から選択し、クリック</li>
            </ul>
            <p>
              <span className="bold">「カルテを閉じる」</span>
              でその日「処方箋」欄に記入した内容が
              <span className="underline">保存、処方歴に反映</span>されます。
            </p>
            <p>
              <span className="bold">「カルテに戻る」</span>
              で再び処方箋などの記入に戻ります。
            </p>
            <p>
              <span className="bold">「処方を破棄する」</span>
              で処方箋で記入した内容が保存反映されずに受付患者様リストに戻ります。
            </p>
            <p>
              「カルテを閉じる」で受付患者様リストのページに戻り、再び先ほど入力した患者様カルテに進むと左側の処方歴に、「処方箋」欄に入力した内容が反映されています。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方歴」についてー" />
        <div className="flex">
          <img src={Karte10} alt="" />
          <div className="text-box">
            <ul>
              <li>
                ①<span className="frame blue" />
                をクリックすることで
                <span className="frame red" />
                で囲まれた処方箋等の情報の表示/非表示を変えることができます。
                <br />
                <span className="frame orange" />
                で囲んだところをクリックすることで情報が開閉いたします。
              </li>
              <li>
                ②「変更履歴」をクリックすると左の画像のように今まで変更された内容が表示されます。
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「Do処方」についてー" />
        <div className="flex">
          <img src={Karte11} alt="" />
          <div className="text-box">
            <h3 className="subtitle">1.ドラック&ドロップ</h3>
            <p>
              処方歴から処方箋欄（①）にドラッグアンドドロップすることでDo処方を行うことができます。
            </p>
            <p>見出し部分（②）をドラッグすることで単位での移動をします。</p>
            <p>
              処方歴の（③）をドラッグすることで、該当Rpだけを、「処方箋」欄に追加することができます。
            </p>
            <h3 className="subtitle">2.右クリック</h3>
            <p>
              処方歴の中で右クリックすることでも、その日時での処方に関する編集ができます。
            </p>
            <ul>
              <li>
                <span className="bold">Do処方[Rp単位]</span>
                ：右クリックした日時の処方内容[Rp単位]で右の「処方箋」欄に追加できます。
              </li>
              <li>
                <span className="bold">Do処方[処方箋]</span>
                ：右クリックした日時の処方内容を右の「処方箋」欄に追加できます。
              </li>
              <li>
                <span className="bold">編集</span>
                ：右クリックした日時の処方内容を「処方箋」欄で編集。「編集内容を保存」で、変更前後の内容どちらも保存されます。
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方箋」編集についてー" />
        <div className="flex">
          <img src={Karte12} alt="" />
          <div className="text-box">
            <p>今まで入力した内容を編集することができます。</p>
            <h3 className="subtitle">①数量や薬品の変更</h3>
            <ul>
              <li>
                1:先のスライドで説明したように数量や薬品の変更も変更したい場所を右クリック
              </li>
              <li>2:表示された項目をクリック</li>
              <li>3:編集</li>
            </ul>
            <h3 className="subtitle">②用法日数の変更</h3>
            <ul>
              <li>1:「処方箋」欄の用法付近を右クリック</li>
              <li>2:左の画像のように表示される</li>
              <li>3:「日数変更」をクリック</li>
              <li>4:その用法を編集</li>
            </ul>
            <h3 className="subtitle">③処方開始日の変更</h3>
            <ul>
              <li>1:「処方箋」欄の処方開始日を右クリック</li>
              <li>2:左の画像のように表示される</li>
              <li>
                3:処方開始日を変更
                <br />
                （直接枠内を入力していただいても編集できます。）
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー「処方箋」編集についてー" />
        <div className="flex">
          <img src={Karte13} alt="" />
          <div className="text-box">
            <p>
              ＊削除したい時は番号（Rp1やRp2）や薬品名付近で右クリックし、
              <br />
              「区切りの削除」でその番号のものが
              <br />
              「薬品の削除」で薬品が「処方箋」欄から消えます。
            </p>
            <p>左の画像で例えるなら、</p>
            <ul>
              <li>① Rp2付近で右クリック</li>
              <li>②「区切りの削除」をクリック</li>
              <li>③ Rp2そのものが消え、Rp1は残ります</li>
            </ul>
            <ul>
              <li>①カロナール錠500 500mg右クリック</li>
              <li>②「薬品の削除」をクリック</li>
              <li>
                ③ カロナール錠500 500mgが消えます。
                <br />
                クラリスマイシン錠200mg「サワイ」は残ります
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー患者詳細・病名説明ー" />
        <div className="flex">
          <img src={Karte14} alt="" />
          <div className="text-box">
            <p>
              患者様カルテの上部にある
              <span className="frame red" />
              で囲まれた患者様の氏名の部分をクリックすると、患者情報、住所情報、保険情報、保険パターン、患者様の病歴といったその患者様に関する詳細な情報を各項目をクリックすることで確認できます。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー患者詳細・病名説明ー" />
        <div className="flex">
          <img src={Karte15} alt="" />
          <div className="text-box">
            <h3 className="subtitle">患者情報</h3>
            <p>
              患者様の氏名や生年月日など患者様に関する基本的な情報が記載されています。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー患者詳細・病名説明ー" />
        <div className="flex">
          <img src={Karte16} alt="" />
          <div className="text-box">
            <h3 className="subtitle">住所情報</h3>
            <p>患者様の郵便番号、住所、電話番号、が記載されています。</p>
            <p>
              「現住所」のように住所でも区分することで、複数住まいがある患者でもどこに連絡を取れば良いのかがわかりやすくなっています。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー患者詳細・病名説明ー" />
        <div className="flex">
          <img src={Karte17} alt="" />
          <div className="text-box">
            <h3 className="subtitle">保険情報</h3>
            <p>
              患者様が加入している保険についての詳細が、種類ごとに記載されています。
            </p>
            <p>
              <span className="frame red" />
              で囲まれた「保険情報１」などの項目をクリックし、それぞれの詳細を確認できます。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー患者詳細・病名説明ー" />
        <div className="flex">
          <img src={Karte18} alt="" />
          <div className="text-box">
            <h3 className="subtitle">保険パターン</h3>
            <p>
              患者様が加入している保険が実際に院内でどのような時に適用されるのか、適用される診療科、負担率など微妙な違いでわけられており、パターンごとに確認できます。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー患者詳細・病名説明ー" />
        <div className="flex">
          <img src={Karte19} alt="" />
          <div className="text-box">
            <h3 className="subtitle">病名</h3>
            <p>
              病名に関しては、一覧で過去のものが見れるだけでなく、診療科、病名開始日、病名終了日、病名を入力し、「追加」をクリックすると右の一覧に追加されます。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー患者詳細・病名説明ー" />
        <div className="flex">
          <img src={Karte20} alt="" />
          <div className="text-box">
            <p>
              病名欄にキーワードを入力してエンターキーを押すと、病名の検索ができます。
            </p>
            <p className="red">
              ＊データベースに登録の無い病名は登録できません。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="患者様カルテ　ー患者詳細・病名説明ー" />
        <div className="flex">
          <img src={Karte21} alt="" />
          <div className="text-box">
            <p>
              編集・削除したい病名一覧の行を右クリックすると、編集、削除ボタンが出て、編集と削除が可能です。
            </p>
          </div>
        </div>
      </div>

      <div id="doctor" className="title">
        3.依頼医
      </div>
      <div className="content-box">
        <Title title="依頼医について" />
        <div className="flex">
          <img src={Doctor1} alt="" />
          <div className="text-box">
            <p>
              ドクターアカウント以外（看護師など許可されたアカウント）でも処方箋や病名を代理で記入することが可能です。
              <br />
              その場合は<span className="underline">依頼医の設定が必要</span>
              となります。
            </p>
            <p>
              <span className="frame red" />
              で囲んだ所をクリックもしくは、「処方箋」の欄を記入しようとすると、左図のような画面が表示され、処方を入力するよう依頼した医師を選んでください。
            </p>
          </div>
        </div>
      </div>
      <div className="content-box">
        <Title title="依頼医について" />
        <div className="flex">
          <img src={Doctor2} alt="" />
          <div className="text-box">
            <ul>
              <li>
                ①カルテを閉じ、入力したデータが正常に保存されれば、選択した依頼医のもとにアカウントログイン後、未承認データの確認と承認の案内ページが開きます。正しければ、チェックを入れ、各承認ボタンをクリックしてください。
              </li>
              <li>②未承認であれば画像のように表示されます。</li>
              <li>③承認されれば画像のような履歴が残ります。</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="logout" className="title">
        4.ログアウト
      </div>
      <div className="content-box">
        <Title title="ログアウトについて" />
        <div className="flex">
          <img src={Logout} alt="" />
          <div className="text-box">
            <p>
              受付患者様リストの画面右上の扉マークをクリックし、
              <br />
              「ログアウトします」という案内が出てきますので、
              <br />「<span className="bold">OK</span>
              」をクリックするとログアウト完了し、
              <br />「<span className="bold">キャンセル</span>
              」をクリックすると受付患者リストに戻ります。
            </p>
            <p>
              「OK」をクリックし、ログアウトすると冒頭のログイン画面が出てきますので、表示されていればきちんとログアウトできています。
            </p>
            <p>
              <span className="red">
                下記現象でもログアウトし、入力中のデータの保存はされません。
              </span>
              <br />
              自動ログアウト（5分）、ブラウザを閉じる、停電等により電源切れた場合。
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Help;
