import React from "react";

const SvgFlowers = (props: React.SVGAttributes<{}>) => (
  <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
    <path
      d="M13 8c0 3.31-2.19 6-5.5 6S2 11.31 2 8a5.33 5.33 0 015 3.61V7H4.5A1.5 1.5 0 013 5.5v-3a.5.5 0 01.9-.3l1.53 2 1.65-3a.5.5 0 01.84 0l1.65 3 1.53-2a.5.5 0 01.9.3v3A1.5 1.5 0 0110.5 7H8v4.61A5.33 5.33 0 0113 8z"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgFlowers;
