import { FC } from "react";

import "../styles/spinner.css";

const Bounce: FC = () => (
  <div className="b">
    <div className="db1"></div>
    <div className="db2"></div>
  </div>
);

const Spinner: FC = () => (
  <div className="s">
    <div className="b1"></div>
    <div className="b2"></div>
    <div className="b3"></div>
  </div>
);

export { Bounce, Spinner };
