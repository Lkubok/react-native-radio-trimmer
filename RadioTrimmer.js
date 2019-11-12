/* eslint-disable react-native/no-inline-styles */
import React, { Component } from "react";
import { View, Text } from "react-native";
import { Svg, Circle } from "react-native-svg";
import Animated from "react-native-reanimated";
// import { getInset } from "react-native-safe-area-view";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import PropTypes from "prop-types";

import renderTicks from "./renderTicks";
import createStyles from "./createStyles";

const { call, cond, eq, event, Value } = Animated;
export class RadioTrimmer extends Component {
  constructor(props) {
    super(props);
    const { boxSize, dotSize, minValue } = props;
    this.state = {
      angle: null,
      boxCenterX: boxSize / 2 - dotSize / 2,
      boxCenterY: boxSize / 2 - dotSize / 2,
      boxMountPosX: null,
      boxMountPosY: null,
      boxSize,
      centerTestX: null,
      centerTestY: null,
      calculatedText: minValue,
      dotOffsetX: boxSize / 2 - dotSize / 2,
      heightFromTopOfScreen: 50,
      dotOffsetY: 0,
      dotSize,
      normalizedAngle: null,
      pureRadius: boxSize / 2,
      radius: boxSize / 2 - dotSize / 2,
      ticksCount: this.props.ticksCount
    };
    this.absoluteX = new Value(0);
    this.absoluteY = new Value(0);
    this.gestureState = new Value(-1);
    this.onGestureEvent = event([
      {
        nativeEvent: {
          absoluteX: this.absoluteX,
          absoluteY: this.absoluteY,
          state: this.gestureState
        }
      }
    ]);
  }
  componentDidMount() {
    this.props.onMount(this.props.minValue);
  }
  handleLayoutChange = () => {
    this.RadioTrimmer.measure((px, py) => {
      this.setState({
        boxMountPosY: py
      });
    });
  };
  handleLayoutChangeX = () => {
    this.RadioTrimmer.measure((px, py, w, h, pax, pay) => {
      this.setState({
        centerTestX: pax,
        centerTestY: pay
      });
    });
  };
  moving = ([curX, curY]) => {
    const { heightFromTopOfScreen, radius } = this.state;
    const { onChangeValue } = this.props;
    const boxCenter = {
      x: this.state.centerTestX,
      y: this.state.centerTestY + heightFromTopOfScreen
    };
    const pointerCurPos = {
      x: curX,
      y: curY
    };
    const calcX = Math.cos(this.mesAngle(boxCenter, pointerCurPos)) * radius;
    const calcY = Math.sin(this.mesAngle(boxCenter, pointerCurPos)) * radius;
    this.setState(prev => {
      return {
        dotOffsetX: prev.boxCenterX + calcX,
        dotOffsetY: prev.boxCenterY + calcY,
        angle: this.mesAngleDeg(boxCenter, pointerCurPos),
        normalizedAngle:
          this.mesAngleDeg(boxCenter, pointerCurPos) +
          90 -
          360 *
            Math.floor((this.mesAngleDeg(boxCenter, pointerCurPos) + 90) / 360)
      };
    });
    this.calculateRadioValue();
    onChangeValue ? this.props.onChangeValue(this.state.calculatedText) : null;
  };
  mesAngle = (p1, p2) => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  };
  mesAngleDeg = (p1, p2) => {
    return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
  };
  calculateRadioValue = () => {
    const { minValue, maxValue, step, accuracy } = this.props;
    const { radius, angle, normalizedAngle } = this.state;
    const circuitLength = Math.PI * 2 * radius;
    const routeDistance = maxValue - minValue;
    const countOfSteps = routeDistance / step;
    const oneStepLength = circuitLength / countOfSteps;
    const lengthOnArc = (normalizedAngle / 360) * circuitLength;
    let ValueToReturn = angle
      ? minValue + Math.ceil(lengthOnArc / oneStepLength) * step
      : minValue;
    this.setState({
      calculatedText: Math.floor(ValueToReturn * accuracy) / accuracy
    });
  };
  ticksRender = () => {
    return renderTicks({ ...this.state, ...this.props });
  };
  render() {
    const {
      backgroundColor,
      boxSize,
      dotColor,
      dotIsShadow,
      dotSize,
      innerDotColor,
      innerDotSize,
      marginTop,
      pathColor,
      pathIsShadow,
      pathWidth,
      textBackgroundColor,
      children
    } = this.props;
    const {
      dotOffsetX,
      dotOffsetY,
      calculatedText,
      boxCenterY,
      boxCenterX
    } = this.state;
    const styles = createStyles({
      backgroundColor,
      boxSize,
      dotColor,
      dotIsShadow,
      dotSize,
      innerDotColor,
      innerDotSize,
      marginTop,
      pathColor,
      pathIsShadow,
      pathWidth,
      textBackgroundColor
    });

    return (
      <View style={styles.viewBox} onLayout={this.handleLayoutChange}>
        <View
          style={styles.radioBox}
          onLayout={e => {
            this.setState({
              boxMountPosX: e.nativeEvent.layout.x
            });
          }}
        >
          <View style={styles.changingTextBox}>
            <View style={styles.textInfo}>
              {children ? children : <Text>{calculatedText}</Text>}
            </View>
            <View style={styles.tickBox}>{this.ticksRender()}</View>
            <Svg
              blurRadius={20}
              height={boxSize}
              style={{ position: "absolute" }}
              width={boxSize}
            >
              <Circle
                cx={boxSize / 2}
                cy={boxSize / 2}
                fill="transparent"
                r={boxSize / 2 - dotSize / 2}
                stroke={pathColor}
                strokeWidth={pathWidth}
              />
            </Svg>
            <View
              style={{
                position: "absolute",
                top: boxCenterY + dotSize / 2,
                left: boxCenterX + dotSize / 2
              }}
              ref={view => {
                this.RadioTrimmer = view;
              }}
              onLayout={this.handleLayoutChangeX}
            />
          </View>
          <Animated.Code>
            {() =>
              cond(
                eq(this.gestureState, State.ACTIVE),
                call([this.absoluteX, this.absoluteY], this.moving)
              )
            }
          </Animated.Code>

          <PanGestureHandler
            maxpointerCurPoss={1}
            minDist={10}
            onGestureEvent={this.onGestureEvent}
            onHandlerStateChange={this.onGestureEvent}
          >
            <Animated.View
              style={[
                styles.radioDot,
                {
                  top: dotOffsetY,
                  left: dotOffsetX
                }
              ]}
            >
              <View style={styles.whiteDot} />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </View>
    );
  }
}

RadioTrimmer.propTypes = {
  accuracy: PropTypes.number,
  backgroundColor: PropTypes.string,
  boxSize: PropTypes.number,
  children: PropTypes.Component,
  dotColor: PropTypes.string,
  dotIsShadow: PropTypes.bool,
  dotSize: PropTypes.number,
  innerDotColor: PropTypes.string,
  innerDotSize: PropTypes.number,
  marginTop: PropTypes.number,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  onChangeValue: PropTypes.func,
  onMount: PropTypes.func,
  pathColor: PropTypes.string,
  pathIsShadow: PropTypes.bool,
  pathWidth: PropTypes.number,
  step: PropTypes.number,
  textAfterNumber: PropTypes.string,
  textBackgroundColor: PropTypes.string,
  tickMargin: PropTypes.number,
  ticksActiveColor: PropTypes.string,
  ticksColor: PropTypes.string,
  ticksCount: PropTypes.number,
  ticksCountHover: PropTypes.number,
  ticksLength: PropTypes.number,
  ticksWidth: PropTypes.number
};

RadioTrimmer.defaultProps = {
  accuracy: 10,
  backgroundColor: "transparent",
  boxSize: 200,
  dotColor: "gray",
  dotIsShadow: false,
  dotSize: 24,
  innerDotColor: "white",
  innerDotSize: 10,
  marginTop: 0,
  maxValue: 108,
  minValue: 87.5,
  onChangeValue: null,
  pathColor: "lightgray",
  pathIsShadow: false,
  pathWidth: 10,
  step: 0.1,
  textAfterNumber: "MHz",
  textBackgroundColor: "transparent",
  tickMargin: 0,
  ticksActiveColor: "black",
  ticksColor: "gray",
  ticksCount: 25,
  ticksCountHover: 5,
  ticksLength: 15,
  ticksWidth: 2
};

export default RadioTrimmer;
