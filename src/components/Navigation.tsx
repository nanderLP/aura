import { FC, useState } from "react";
import { m } from "framer-motion";
import { animated, useSpring } from "@react-spring/web";

const Navigation: FC = () => {
  const [selected, setSelected] = useState("watch");

  const Item: FC<{ name: string; icon: string }> = ({ name, icon }) => {
    const active = selected === name;
    const styles = useSpring({
      width: active ? 256 : 64,
    });
    return (
      <animated.button
        style={styles}
        css={{
          background: "none",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "0.5rem",
          cursor: "pointer",
          userSelect: "none",
          margin: 0,
          //width: active ? "200px" : "48px",
          backgroundColor: "#696969", //active ? "#696969" : "var(--onSurface)",
          color: "#fff", //active ? "#fff" : undefined,
        }}
        onClick={() => setSelected(name === selected ? "a" : "watch")}
      >
        <span className="material-symbols-outlined" css={{ fontSize: "32px" }}>
          {icon}
        </span>
        {active && <h1>{name}</h1>}
      </animated.button>
    );
  };

  return (
    <nav
      css={{
        display: "flex",
        gap: "2rem",
        height: "48px",
        width: "500px",
      }}
    >
      <Item name="watch" icon="visibility" />
      {/*<Item name="host" icon="screen_share" />*/}
    </nav>
  );
};

export default Navigation;
