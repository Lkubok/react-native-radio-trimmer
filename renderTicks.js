/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import _ from 'lodash';
const renderTicks = ({
  ticksCount,
  boxCenterX,
  boxCenterY,
  dotSize,
  pureRadius,
  normalizedAngle,
  ticksLength,
  ticksWidth,
  ticksCountHover,
  ticksColor,
  ticksActiveColor,
  tickMargin,
}) => {
  const boxCenter = {
    x: boxCenterX + dotSize / 2,
    y: boxCenterY + dotSize / 2,
  };

  let ticksArr = [];

  const initPos = {
    top: boxCenter.x,
    left: boxCenter.y - ticksWidth / 2,
  };

  for (let i = 0; i < ticksCount; i++) {
    let angleStep = 360 / ticksCount;
    let curAngle = angleStep * i;
    let curAngleDeg = _.clone(curAngle);
    if (curAngle > 180) {
      curAngle -= 360;
    }
    curAngle = curAngle * (Math.PI / 180);

    let normCurAngle =
      curAngleDeg + 90 - 360 * Math.floor((curAngleDeg + 90) / 360);

    let isActive = false;
    let min =
      normalizedAngle - (angleStep * ticksCountHover) / 2 + 90;
    let max =
      normalizedAngle + (angleStep * ticksCountHover) / 2 + 90;
    if (max > 360) {
      max -= 360;
      min -= 360;
    }
    if (
      (normCurAngle >= min && normCurAngle <= max) ||
      (min < 0 && normCurAngle > 360 + min)
    ) {
      isActive = true;
    }
    ticksArr.push(
      <View
        key={curAngle}
        style={{
          backgroundColor: isActive ? ticksActiveColor : ticksColor,
          transform: [{ rotate: `${angleStep * i}deg` }],
          position: 'absolute',
          top:
            initPos.top -
            pureRadius * Math.cos(curAngle) -
            ticksLength * Math.cos(curAngle) -
            tickMargin * Math.cos(curAngle) +
            -ticksLength / 2,
          left:
            initPos.left +
            pureRadius * Math.sin(curAngle) +
            ticksLength * Math.sin(curAngle) +
            tickMargin * Math.sin(curAngle),

          height: ticksLength,
          width: ticksWidth,
        }}
      />,
    );
  }

  return ticksArr;
};

export default renderTicks;
