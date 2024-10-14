import React from 'react';

const SvgStadium = (props: React.SVGAttributes<{}>) => (
  <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
    <path
      d="M7 1v4.01c-2.83.094-4.998.957-5 1.99v4.5c0 1.105 2.462 2 5.5 2s5.5-.895 5.5-2V7c-.002-1.034-2.17-1.896-5-1.99v-.947l3-1.313L7 1zM3 8.146c.515.268 1.201.485 2 .633v2.967c-1.205-.269-2-.726-2-1.246V8.146zm9 .002V10.5c0 .52-.795.977-2 1.246V8.781c.799-.148 1.485-.366 2-.633zm-6 .774a14.68 14.68 0 003 .002v2.984c-.471.056-.971.092-1.5.092s-1.029-.036-1.5-.092V8.922z"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgStadium;

