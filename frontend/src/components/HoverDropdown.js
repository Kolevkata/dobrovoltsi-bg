// /src/components/HoverDropdown.js
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

const HoverDropdown = ({ children }) => {
  const [show, setShow] = useState(false);

  const showDropdown = () => setShow(true);
  const hideDropdown = () => setShow(false);

  return (
    <Dropdown
      onMouseEnter={showDropdown}
      onMouseLeave={hideDropdown}
      show={show}
    >
      {children}
    </Dropdown>
  );
};

export default HoverDropdown;
