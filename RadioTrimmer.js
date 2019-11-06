/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

import renderTicks from './renderTicks';
import createStyles from './createStyles';

const { cond, eq, call, Value, event } = Animated;
export class RadioTrimmer extends Component {
  constructor(props) {
    super(props);
    const { dotSize, boxSize, minValue } = props;
    this.state = {
      dotOffsetX: boxSize / 2 - dotSize / 2,
      dotOffsetY: 0,
      boxMountPosX: null,
      boxMountPosY: null,
      boxCenterX: boxSize / 2 - dotSize / 2,
      boxCenterY: boxSize / 2 - dotSize / 2,
      radius: boxSize / 2 - dotSize / 2,
      pureRadius: boxSize / 2,
      boxSize,
      dotSize,
      angle: null,
      calculatedText: minValue,
      normalizedAngle: null,
      ticksCount: this.props.ticksCount,
    };
    this.absoluteX = new Value(0);
    this.absoluteY = new Value(0);
    this.gestureState = new Value(-1);
    this.onGestureEvent = event([
      {
        nativeEvent: {
          state: this.gestureState,
          absoluteY: this.absoluteY,
          absoluteX: this.absoluteX,
        },
      },
    ]);
  }
  handleLayoutChange = () => {
    this.RadioTrimmer.measure((py, px) => {
      this.setState({
        heightFromTopOfScreen: px,
        boxMountPosY: px,
      });
    });
  };
  moving = ([curX, curY]) => {
    const {
      dotSize,
      boxCenterX,
      boxCenterY,
      boxMountPosX,
      boxMountPosY,
      radius,
    } = this.state;
    const { onChangeValue } = this.props;
    const boxCenter = {
      x: boxMountPosX + boxCenterX,
      y: boxMountPosY + boxCenterY,
    };
    const pointerCurPos = {
      x: curX - dotSize / 2,
      y: curY - dotSize / 2,
    };
    const calcX =
      Math.cos(this.mesAngle(boxCenter, pointerCurPos)) * radius;
    const calcY =
      Math.sin(this.mesAngle(boxCenter, pointerCurPos)) * radius;
    this.setState(prev => {
      return {
        dotOffsetX: prev.boxCenterX + calcX,
        dotOffsetY: prev.boxCenterY + calcY,
        angle: this.mesAngleDeg(boxCenter, pointerCurPos),
        normalizedAngle:
          this.mesAngleDeg(boxCenter, pointerCurPos) +
          90 -
          360 *
            Math.floor(
              (this.mesAngleDeg(boxCenter, pointerCurPos) + 90) / 360,
            ),
      };
    });
    this.calculateRadioValue();
    onChangeValue
      ? this.props.onChangeValue(this.state.calculatedText)
      : null;
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
      calculatedText: Math.floor(ValueToReturn * accuracy) / accuracy,
    });
  };

  ticksRender = () => {
    return renderTicks({ ...this.state, ...this.props });
  };

  render() {
    const {
      dotColor,
      dotSize,
      backgroundColor,
      textBackgroundColor,
      boxSize,
      paddingCircle,
      innerDotSize,
      innerDotColor,
      textAfterNumber,
      marginTop,
      pathColor,
      pathWidth,
      pathIsShadow,
      dotIsShadow,
    } = this.props;
    const { dotOffsetX, dotOffsetY, calculatedText } = this.state;

    const styles = createStyles({
      backgroundColor,
      boxSize,
      dotColor,
      dotIsShadow,
      dotSize,
      innerDotColor,
      innerDotSize,
      marginTop,
      paddingCircle,
      pathColor,
      pathIsShadow,
      pathWidth,
      textBackgroundColor,
    });

    return (
      <View
        style={styles.viewBox}
        ref={view => {
          this.RadioTrimmer = view;
        }}
        onLayout={this.handleLayoutChange}
      >
        <View
          style={styles.radioBox}
          onLayout={e => {
            this.setState({
              boxMountPosX: e.nativeEvent.layout.x,
            });
          }}
        >
          <View style={styles.changingTextBox}>
            <Text style={styles.textInfo}>
              {calculatedText} {textAfterNumber}
            </Text>
            <View style={styles.tickBox}>{this.ticksRender()}</View>
            <Svg
              height={boxSize}
              width={boxSize}
              style={{ position: 'absolute' }}
              blurRadius={20}
            >
              <Circle
                cx={boxSize / 2}
                cy={boxSize / 2}
                r={boxSize / 2 - dotSize / 2}
                fill="transparent"
                stroke={pathColor}
                strokeWidth={pathWidth}
              />
            </Svg>
          </View>
          <Animated.Code>
            {() =>
              cond(
                eq(this.gestureState, State.ACTIVE),
                call([this.absoluteX, this.absoluteY], this.moving),
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
                  left: dotOffsetX,
                },
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
  dotColor: PropTypes.string,
  dotSize: PropTypes.number,
  innerDotColor: PropTypes.string,
  innerDotSize: PropTypes.number,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  marginTop: PropTypes.number,
  paddingCircle: PropTypes.number,
  pathColor: PropTypes.string,
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
  ticksWidth: PropTypes.number,
  dotIsShadow: PropTypes.bool,
  onChangeValue: PropTypes.func,
  pathIsShadow: PropTypes.bool,
};

export default RadioTrimmer;
