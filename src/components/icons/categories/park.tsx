import React from "react";

const SvgPark = (props: React.SVGAttributes<{}>) => (
  <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
    <path d="M14 5.75a1.75 1.75 0 00-1-1.61A1.24 1.24 0 0011.75 3a1.197 1.197 0 00-.29.06 1.2 1.2 0 00-2-.78 1.25 1.25 0 10-2.5 0s.04.02.04.05a1.22 1.22 0 00-2 .74A1.491 1.491 0 004.51 3a1.5 1.5 0 00-1.4 2.07 1.49 1.49 0 000 2.87A1.49 1.49 0 006 7.71c.183.16.41.26.65.29v5L5 14h5l-1.6-1v-2a6.8 6.8 0 012.77-2A1.49 1.49 0 0013 7.52a1.472 1.472 0 000-.16 1.75 1.75 0 001-1.61zm-5.6 4.51V6.82c.27.48.778.779 1.33.78h.28c.016.44.224.849.57 1.12a7.25 7.25 0 00-2.18 1.54z" />
  </svg>
);

export default SvgPark;
