import React from "react";
import { Link } from "react-router-dom";

class Navbar extends React.Component {
  render() {
    return (
      <div>
        <Link to="/login">ログイン</Link>
        <Link to="/karte">カルテ</Link>
        <Link to="/patients">患者一覧</Link>
        <Link to="/prescription">処方</Link>
      </div>
    );
  }
}

export default Navbar;
