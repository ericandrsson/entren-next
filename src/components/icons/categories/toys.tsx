import React from "react";

const SvgToys = (props: React.SVGAttributes<{}>) => (
  <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
    <path
      d="M13.1 12.5c-.6.3-1.4.1-1.8-.5l-1.1-1.4H4.8L3.7 12c-.5.7-1.4.8-2.1.3-.5-.4-.7-1-.6-1.5l.7-3.7C1.9 5.9 3 5 4.2 5H7V3.5C7 2.7 7.6 2 8.4 2h3.1c.3 0 .5.2.5.5s-.2.5-.5.5h-3c-.3 0-.5.2-.5.4V5h2.8c1.2 0 2.3.9 2.5 2.1l.7 3.7c.1.7-.2 1.4-.9 1.7zM6 7.5C6 6.7 5.3 6 4.5 6S3 6.7 3 7.5 3.7 9 4.5 9 6 8.3 6 7.5zm6 0c0-.3-.2-.5-.5-.5H11v-.5c0-.3-.2-.5-.5-.5s-.5.2-.5.5V7h-.5c-.3 0-.5.2-.5.5s.2.5.5.5h.5v.5c0 .3.2.5.5.5s.5-.2.5-.5V8h.5c.3 0 .5-.2.5-.5z"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgToys;
