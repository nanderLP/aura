import { styled } from "../../styles/stitches.config";
import { FC } from "react";

const Button = styled("button", {
  // label large
  lineHeight: "20px",
  fontSize: "14px",
  letterSpacing: "0.1px",
  fontWeight: "500",

  cursor: "pointer",

  "&:disabled": {
    cursor: "not-allowed",
    // TODO: CHANGE THIS CHANGE THISm OVERLAY PROPERTY YOU KNOW HOW TO DO IT
    opacity: 0.6,
  },
  variants: {
    variant: {
      filled: {
        height: "40px",
        padding: "0 1.5rem",
        borderRadius: "20px",
      },
      fab: {
        height: "56px",
        borderRadius: "1rem",
        padding: "1rem",
      },
    },
    color: {
      primary: {
        backgroundColor: "$primary",
        color: "$onPrimary",
      },
      secondary: {
        backgroundColor: "$secondary",
        color: "$onSecondary",
      },
    },
  },
});

export default Button;
