import React from "react";

const SvgHealth = (props: React.SVGAttributes<{}>) => (
  <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
    <path
      d="M5.5 7A2.5 2.5 0 013 4.5v-2a.5.5 0 01.5-.5H4a.5.5 0 000-1h-.5A1.5 1.5 0 002 2.5v2a3.49 3.49 0 001.51 2.87A4.41 4.41 0 015 10.5a3.5 3.5 0 107 0v-.57a2 2 0 10-1 0v.57a2.5 2.5 0 01-5 0 4.41 4.41 0 011.5-3.13A3.49 3.49 0 009 4.5v-2A1.5 1.5 0 007.5 1H7a.5.5 0 000 1h.5a.5.5 0 01.5.5v2A2.5 2.5 0 015.5 7zm6 2a1 1 0 110-2 1 1 0 010 2z"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgHealth;
