import React, { useEffect } from "react";
import "./Modal.css";

export default function Modal({ children, open, onClose }) {
  return (
    open && (
      <>
        <div className="overlay" onClick={onClose} />
        <div className="modal">
          <div className="modal-title">
            <button onClick={onClose} className="close-modal">
              CLOSE
            </button>
          </div>
          <div className="modal-content">{children}</div>
        </div>
      </>
    )
  );
}
