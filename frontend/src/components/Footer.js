// /src/components/Footer.js
import React from 'react';

const Footer = () => (
  <footer className="bg-light text-center text-lg-start mt-auto">
    <div className="text-center p-3">
      © {new Date().getFullYear()} Доброволци БГ. Всички права запазени.
    </div>
  </footer>
);

export default Footer;
