import React from "react";

const SvgTramStop = (props: React.SVGAttributes<{}>) => (
  <svg width="1em" height="1em" viewBox="0 0 15 15" {...props}>
    <path
      d="M5.5 0C5 0 5 .5 5 .5v1a.499.499 0 101 0V1h1v2H6S4 3 4 5v3c0 3 3 3 3 3h1s3 0 3-3V5c0-2-2-2-2-2H8V1h1v.5a.499.499 0 101 0v-1c0-.5-.5-.5-.5-.5h-4zm2 4l2.045.773L10 6.5c.132.5-.5.5-.5.5h-4s-.632 0-.5-.5l.455-1.727L7.5 4zm0 4a.5.5 0 110 1 .5.5 0 010-1zm-3.375 4L3 15h1.5l.375-1h5.25l.375 1H12l-1.125-3h-1.5l.375 1h-4.5l.375-1h-1.5z"
      fill="#000"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgTramStop;
