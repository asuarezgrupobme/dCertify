import React, { Component } from 'react';
import Popup from "reactjs-popup";

export default () => (
    <Popup
    trigger={<button className="button"> Open Modal </button>}
    modal
    closeOnDocumentClick
  >
    <span> Modal content </span>
  </Popup>
  );