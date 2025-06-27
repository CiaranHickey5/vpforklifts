import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const Logo = ({
  variant = "default", // 'default', 'white', 'small'
  height = 56,
  onClick,
  showFallback = true,
  sx = {},
  ...props
}) => {
  const logoSrc =
    variant === "white"
      ? "/virgilpowerforkliftslogo.png"
      : "/virgilpowerforkliftslogo.png";

  // Handle responsive height if it's an object
  const logoHeight =
    typeof height === "object"
      ? height
      : variant === "small"
      ? height * 0.7
      : height;
  const maxWidth = variant === "small" ? 150 : { xs: 180, sm: 220, md: 250 };

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: onClick ? "pointer" : "default",
        display: "inline-block",
        ...sx,
      }}
      {...props}
    >
      <Box
        component="img"
        src={logoSrc}
        alt="Virgil Power Forklifts"
        sx={{
          height: logoHeight,
          width: "auto",
          maxWidth: maxWidth,
          objectFit: "contain",
        }}
        onError={(e) => {
          if (showFallback) {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }
        }}
      />

      {/* Fallback text logo */}
      {showFallback && (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="baseline"
          sx={{ display: "none" }}
        >
          <Typography
            variant={variant === "small" ? "h6" : "h5"}
            sx={{
              fontWeight: "bold",
              color: variant === "white" ? "#ff8c00" : "#ff8c00",
              letterSpacing: "0.5px",
            }}
          >
            VIRGIL
          </Typography>
          <Typography
            variant={variant === "small" ? "h6" : "h5"}
            sx={{
              fontWeight: "bold",
              color: variant === "white" ? "white" : "text.primary",
              letterSpacing: "0.5px",
            }}
          >
            POWER
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default Logo;
