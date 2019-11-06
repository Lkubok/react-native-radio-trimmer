import { StyleSheet } from "react-native";

const createStyles = ({
  dotColor,
  dotSize,
  boxSize,
  backgroundColor,
  textBackgroundColor,
  innerDotColor,
  innerDotSize,
  marginTop,
  pathColor,
  dotIsShadow,
  pathIsShadow
}) => {
  return StyleSheet.create({
    radioDot: {
      backgroundColor: dotColor,
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      position: "absolute",
      shadowColor: dotIsShadow ? dotColor : null,
      shadowOffset: dotIsShadow ? { width: 1, height: 1 } : null,
      shadowOpacity: dotIsShadow ? 0.8 : null,
      shadowRadius: dotIsShadow ? 10 : null
    },
    viewBox: {
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      marginTop: marginTop,
      backgroundColor: backgroundColor,
      shadowColor: pathIsShadow ? pathColor : null,
      shadowOffset: pathIsShadow ? { width: -10, height: 15 } : null,
      shadowOpacity: pathIsShadow ? 0.4 : null,
      shadowRadius: pathIsShadow ? 15 : null
    },
    radioBox: {
      width: boxSize,
      height: boxSize,
      backgroundColor: "transparent",
      position: "relative",
      borderRadius: boxSize / 2
    },
    changingTextBox: {
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      borderRadius: boxSize / 2,
      backgroundColor: textBackgroundColor
    },
    whiteDot: {
      backgroundColor: innerDotColor,
      position: "relative",
      width: innerDotSize,
      height: innerDotSize,
      borderRadius: innerDotSize / 2,
      top: (dotSize - innerDotSize) / 2,
      left: (dotSize - innerDotSize) / 2
    },
    tickBox: {
      width: boxSize,
      height: boxSize,
      position: "relative",
      borderRadius: boxSize / 2
    },
    textInfo: {
      position: "absolute"
    }
  });
};

export default createStyles;
