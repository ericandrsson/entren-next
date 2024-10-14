import React from 'react';

const SvgDeli = (props: React.SVGAttributes<{}>) => (
  <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
    <path
      d="M5.5 3a.5.5 0 00-.5.5H2.75A2.744 2.744 0 00.943 8.313 1.998 1.998 0 000 10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2 0-.488-.186-.93-.48-1.277l2.177.963a.75.75 0 10.606-1.372l-1.81-.802 1.63-.272a.75.75 0 10-.246-1.48l-2.13.355C11.258 4.952 10.038 3.784 8 3.55V3.5a.5.5 0 00-.5-.5h-2zM6 4h1v7H6V4zm3.5 4c.259 0 .464.197.49.45l.076-.134a.5.5 0 11.866.5l-.258.448A.986.986 0 0111 10c0 .563-.437 1-1 1H8V9h1v-.5c0-.277.223-.5.5-.5zm-7.06.07a.498.498 0 01.494.246l.2.348A.493.493 0 013.5 8.5c.277 0 .5.223.5.5h1v2H2c-.563 0-1-.437-1-1s.437-1 1-1h.174l-.106-.184a.497.497 0 01.371-.746z"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgDeli;

