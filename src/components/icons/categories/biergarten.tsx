import React from "react";

const SvgBiergarten = (props: React.SVGAttributes<{}>) => (
  <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
    <path
      d="M12 5V2s-1-1-4.5-1S3 2 3 2v3a9.27 9.27 0 001 4 5.63 5.63 0 010 4.5s0 1 3.5 1 3.5-1 3.5-1A5.63 5.63 0 0111 9a9.27 9.27 0 001-4zm-4.5 8.5a7.368 7.368 0 01-2.36-.28c.203-.722.304-1.47.3-2.22h4.12c-.004.75.097 1.498.3 2.22a7.368 7.368 0 01-2.36.28zm0-8.5c-1.186.03-2.37-.14-3.5-.5v-2A10.74 10.74 0 017.5 2a10.74 10.74 0 013.5.5v2c-1.13.36-2.314.53-3.5.5z"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgBiergarten;
