import React from "react";
import Modal from "react-awesome-modal";
import PropTypes from "prop-types";
import TrackUl from "./../molecules/TrackUl";

const ChangeHistoryModal = ({ visible, closeModal, changelog, keyName }) => (
  <Modal
    visible={visible}
    width="500"
    effect="fadeInUp"
    onClickAway={closeModal}
  >
    {changelog.map((log, index) => {
      let order_data = log.order_data;
      if (index !== 0) {
        if (typeof order_data === "string") {
          order_data = JSON.parse(order_data);
        }
        this.i += 1;
        return (
          <div>
            <p>{log.updated_at}</p>
            <p>{order_data.doctor_name}</p>
            {order_data.order_data.map(order_data => {
              this.j += 1;
              return (
                <div key={this.j}>
                  {order_data.med.map(medi => {
                    return (
                      <TrackUl
                        key={this.i + "track"}
                        medi={medi}
                        keyNames={keyName}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      }
    })}
  </Modal>
);

ChangeHistoryModal.propTypes = {
  visible: PropTypes.bool,
  closeModal: PropTypes.func,
  changelog: PropTypes.array,
  keyName: PropTypes.object
};

export default ChangeHistoryModal;
