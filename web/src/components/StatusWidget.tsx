import useStore from "../lib/store";
import { keyframes, styled } from "../styles/stitches.config";

const StatusWidget = () => {
  const connected = useStore((state) => state.connected);
  const clients = useStore((state) => state.clients);
  const Container = styled("div", {
    position: "absolute",
    width: "100%",
  });

  const gradient = keyframes({
    "0%": {
      backgroundPosition: "15% 0%",
    },
    "50%": {
      backgroundPosition: "85% 100%",
    },
    "100%": {
      backgroundPosition: "15% 0%",
    },
  });

  const frameEnter = keyframes({
    "0%": {
      clipPath:
        "polygon(0% 100%, 3px 100%, 3px 3px, calc(100% - 3px) 3px, calc(100% - 3px) calc(100% - 3px), 3px calc(100% - 3px), 3px 100%, 100% 100%, 100% 0%, 0% 0%)",
    },
    "25%": {
      clipPath:
        "polygon(0% 100%, 3px 100%, 3px 3px, calc(100% - 3px) 3px, calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 100% 100%, 100% 0%, 0% 0%)",
    },
    "50%": {
      clipPath:
        "polygon(0% 100%, 3px 100%, 3px 3px, calc(100% - 3px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 3px, calc(100% - 3px) 3px, 100% 0%, 0% 0%)",
    },
    "75%": {
      "-webkit-clip-path":
        "polygon(0% 100%, 3px 100%, 3px 3px, 3px 3px, 3px 3px, 3px 3px, 3px 3px, 3px 3px, 3px 0%, 0% 0%)",
    },
    "100%": {
      "-webkit-clip-path":
        "polygon(0% 100%, 3px 100%, 3px 100%, 3px 100%, 3px 100%, 3px 100%, 3px 100%, 3px 100%, 3px 100%, 0% 100%)",
    },
  });

  const Content = styled("div", {
    boxSizing: "border-box",
    width: "200px",
    position: "relative",
    padding: "1rem",
    borderRadius: "$md",
    background: "$surface",
    border: "1px solid $outline",
    margin: "1rem auto",
    transition: "margin-right 0.5s",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    "@medium": {
      marginRight: "1rem",
    },

    variants: {
      connected: {
        true: {
          border: "none",
          "&:after": {
            animation: `${frameEnter} 1s forwards ease-in-out reverse, ${gradient} 4s ease-in-out infinite`,
            content: "''",
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            borderRadius: "4px",
            background: "linear-gradient(120deg, #6E3CBC, #7267CB, #98BAE7)",
            backgroundSize: "300% 300%",
            clipPath:
              "polygon(0% 100%, 3px 100%, 3px 3px, calc(100% - 3px) 3px, calc(100% - 3px) calc(100% - 3px), 3px calc(100% - 3px), 3px 100%, 100% 100%, 100% 0%, 0% 0%)",
          },
        },
        // Johnny Fekete idk who you are but thank you for this amazing animation
        // https://codepen.io/johnnyfekete/pen/WMoWvb
      },
    },
  });
  return (
    <Container>
      <Content connected={connected}>
        <p>status: {connected ? "connected" : "not connected"}</p>
        <p>clients: {clients.length + 1}</p>
      </Content>
    </Container>
  );
};

export default StatusWidget;
