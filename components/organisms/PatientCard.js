import React from "react";

const PatientCard = () => (
  <div className="card">
    <div className="card-header">患者情報</div>
    <div className="card-body">
      <small className="card-text text-muted">ムライ ヒロト</small>
      <h5 className="card-title">村井 弘人</h5>
      <h6 className="card-subtitle text-muted">男性(患者番号25)</h6>
      <a href="#" className="btn btn-primary btn-block mt-3">
        詳細情報を見る
      </a>
    </div>
  </div>
);
export default PatientCard;
