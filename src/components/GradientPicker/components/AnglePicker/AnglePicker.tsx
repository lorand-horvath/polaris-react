import React, {useState, useCallback, useMemo, useRef} from 'react';

import {useMouse} from './hooks/useMouse';
import styles from './AnglePicker.scss';

interface Props {
  value: {from: number; to: number};
  onChange(value: {from: number; to: number}): void;
  isDisabled?: boolean;
  limitFrom?: {min: number; max: number};
  limitTo?: {min: number; max: number};
  radius?: number;
  handlerRangeRadiusOffset?: number;
  handlerRadius?: number;
  offsetHandlerRadius?: number;
  offsetHandlerRadiusOffset?: number;
  min?: number;
  max?: number;
  isQuarterCircle?: boolean;
}

const HANDLER_RADIUS = 10;
const DEFAULT_HANDLER_RADIUS_OFFSET = 30;
const RADIUS = 150;

const radiantsToDegrees = (radians) =>
  parseInt(((radians * 180) / Math.PI).toFixed(0), 10);

const degreesToRadians = (degress) => (degress * Math.PI) / 180;

const getCenterAngleOfRange = (from, to) => {
  if (from > to) {
    return (to - (360 - from)) / 2;
  }
  return (from + to) / 2;
};

const getOffsetAngleOfRangeCenter = (from, to) => {
  if (from > to) {
    return (to + (360 - from)) / 2;
  }
  return (to - from) / 2;
};

const modulus360 = (angle) => (angle + 360) % 360;

export function AnglePicker({
  value = {from: 0, to: 90},
  onChange = () => {},
  isDisabled = false,
  limitFrom = undefined,
  limitTo = undefined,
  radius = RADIUS,
  handlerRangeRadiusOffset = DEFAULT_HANDLER_RADIUS_OFFSET,
  handlerRadius = HANDLER_RADIUS,
  offsetHandlerRadius = HANDLER_RADIUS,
  offsetHandlerRadiusOffset = HANDLER_RADIUS,
  min = 0,
  max = 359,
  // minOffset = 0,
  // maxOffset = 45,
  isQuarterCircle = false,
}: Props) {
  const getHandlerXY = useCallback(
    (angle, handlerRadiusOffset) => {
      const alpha = angle % 360;
      const x =
        (radius + handlerRadiusOffset) * Math.sin(degreesToRadians(alpha));
      const y =
        -(radius + handlerRadiusOffset) * Math.cos(degreesToRadians(alpha));
      return {x, y};
    },
    [radius],
  );

  const [centerHandler, setCenterHandler] = useState({
    ...getHandlerXY((value.to - value.from) / 2, handlerRangeRadiusOffset),
    angle: (value.to - value.from) / 2,
  });

  const [fromAngleHandler, setFromAngleHandler] = useState({
    ...getHandlerXY(value.from, offsetHandlerRadiusOffset),
    angle: value.from,
  });
  const [toAngleHandler, setToAngleHandler] = useState({
    ...getHandlerXY(value.to, offsetHandlerRadiusOffset),
    angle: value.to,
  });

  const [isCenterHandlerActive, setIsCenterHandlerActive] = useState(false);
  const [isFromAngleHandlerActive, setIsFromAngleHandlerActive] = useState(
    false,
  );
  const [isToAngleHandlerActive, setIsToAngleHandlerActive] = useState(false);

  const centerHandlerEl = useRef(null);
  const axisCenterEl = useRef(null);
  const fromAngleHandlerEl = useRef(null);
  const toAngleHandlerEl = useRef(null);

  const {elX, elY} = useMouse(axisCenterEl);

  const onCenterAngleHandlerMouseDown = useCallback(
    (e) => {
      if (isDisabled) {
        return;
      }
      setIsCenterHandlerActive(true);
    },
    [setIsCenterHandlerActive, isDisabled],
  );

  const onfromAngleHandlerMouseDown = useCallback(
    (e) => {
      if (isDisabled) {
        return;
      }
      setIsFromAngleHandlerActive(true);
    },
    [setIsFromAngleHandlerActive, isDisabled],
  );

  const ontoAngleHandlerMouseDown = useCallback(
    (e) => {
      if (isDisabled) {
        return;
      }
      setIsToAngleHandlerActive(true);
    },
    [setIsToAngleHandlerActive, isDisabled],
  );

  const onMouseUp = useCallback(() => {
    if (isDisabled) {
      return;
    }
    setIsCenterHandlerActive(false);
    setIsFromAngleHandlerActive(false);
    setIsToAngleHandlerActive(false);
    onChange({from: fromAngleHandler.angle, to: toAngleHandler.angle});
  }, [isDisabled, onChange, fromAngleHandler, toAngleHandler]);

  const getAbsoluteAngle = useCallback(() => {
    let alpha =
      Math.round(elY) !== 0 // avoid dividing by 0
        ? radiantsToDegrees(Math.atan(elX / -elY))
        : 90;

    if (elY > 0 || elX < 0) {
      alpha += 180;
    }
    if (elY < 0 && elX < 0) {
      alpha += 180;
    }
    return alpha;
  }, [elX, elY]);

  const onMouseMove = useCallback(
    (e) => {
      if (isDisabled) {
        return;
      }
      if (isCenterHandlerActive) {
        let updatedCenterAngle = getAbsoluteAngle();
        if (updatedCenterAngle < min || updatedCenterAngle > max) {
          updatedCenterAngle = centerHandler.angle;
        }
        const {x: xCenter, y: yCenter} = getHandlerXY(
          updatedCenterAngle,
          handlerRangeRadiusOffset,
        );
        const offsetAngle = Math.ceil(updatedCenterAngle - centerHandler.angle);
        const updatedFromAngle = modulus360(
          fromAngleHandler.angle + offsetAngle,
        );
        const updatedToAngle = modulus360(toAngleHandler.angle + offsetAngle);
        const {x: xFrom, y: yFrom} = getHandlerXY(
          updatedFromAngle,
          offsetHandlerRadiusOffset,
        );
        const {x: xTo, y: yTo} = getHandlerXY(
          updatedToAngle,
          offsetHandlerRadiusOffset,
        );
        if (
          (limitFrom &&
            (limitFrom.min > updatedFromAngle ||
              limitFrom.max < updatedFromAngle)) ||
          (limitTo &&
            (limitTo.min > updatedToAngle || limitTo.max < updatedToAngle))
        ) {
          return;
        }
        setFromAngleHandler({x: xFrom, y: yFrom, angle: updatedFromAngle});
        setCenterHandler({x: xCenter, y: yCenter, angle: updatedCenterAngle});
        setToAngleHandler({x: xTo, y: yTo, angle: updatedToAngle});
      }

      if (isFromAngleHandlerActive) {
        const updatedFromAngleHandlerAngle = getAbsoluteAngle();
        const {x: xFrom, y: yFrom} = getHandlerXY(
          updatedFromAngleHandlerAngle,
          offsetHandlerRadiusOffset,
        );
        const updatedCenterAngle = getCenterAngleOfRange(
          updatedFromAngleHandlerAngle,
          toAngleHandler.angle,
        );
        const {x: xCenter, y: yCenter} = getHandlerXY(
          updatedCenterAngle,
          handlerRangeRadiusOffset,
        );
        if (
          limitFrom &&
          (limitTo.min > updatedFromAngleHandlerAngle ||
            limitTo.max < updatedFromAngleHandlerAngle)
        ) {
          return;
        }
        setCenterHandler({x: xCenter, y: yCenter, angle: updatedCenterAngle});
        setFromAngleHandler({
          x: xFrom,
          y: yFrom,
          angle: updatedFromAngleHandlerAngle,
        });
      }

      if (isToAngleHandlerActive) {
        const updatedToAngleHandlerAngle = getAbsoluteAngle();
        const {x: xTo, y: yTo} = getHandlerXY(
          updatedToAngleHandlerAngle,
          offsetHandlerRadiusOffset,
        );
        const updatedCenterAngle = getCenterAngleOfRange(
          fromAngleHandler.angle,
          updatedToAngleHandlerAngle,
        );
        const {x: xCenter, y: yCenter} = getHandlerXY(
          updatedCenterAngle,
          handlerRangeRadiusOffset,
        );
        if (
          limitTo &&
          (limitTo.min > updatedToAngleHandlerAngle ||
            limitTo.max < updatedToAngleHandlerAngle)
        ) {
          return;
        }
        setToAngleHandler({
          x: xTo,
          y: yTo,
          angle: updatedToAngleHandlerAngle,
        });
        setCenterHandler({x: xCenter, y: yCenter, angle: updatedCenterAngle});
      }

      onChange({from: fromAngleHandler.angle, to: toAngleHandler.angle});
    },
    [
      isDisabled,
      isCenterHandlerActive,
      isFromAngleHandlerActive,
      isToAngleHandlerActive,
      getAbsoluteAngle,
      min,
      max,
      getHandlerXY,
      handlerRangeRadiusOffset,
      centerHandler.angle,
      fromAngleHandler.angle,
      toAngleHandler.angle,
      offsetHandlerRadiusOffset,
      limitFrom,
      limitTo,
      onChange,
    ],
  );

  const offsetAngleOfCenter = useMemo(() => {
    return getOffsetAngleOfRangeCenter(
      fromAngleHandler.angle,
      toAngleHandler.angle,
    );
  }, [fromAngleHandler.angle, toAngleHandler.angle]);

  return (
    <div
      className={styles.root}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      style={{
        cursor:
          isCenterHandlerActive ||
          isFromAngleHandlerActive ||
          isToAngleHandlerActive
            ? 'move'
            : 'auto',
      }}
    >
      <div
        className={styles.fullRange}
        style={{
          width: isQuarterCircle ? radius : 2 * radius,
          height: isQuarterCircle ? radius : 2 * radius,
          borderRadius: 2 * radius,
          borderBottomRightRadius: isQuarterCircle ? 0 : 2 * radius,
          borderBottomLeftRadius: isQuarterCircle ? 0 : 2 * radius,
          borderTopLeftRadius: isQuarterCircle ? 0 : 2 * radius,
          margin: Math.max(handlerRangeRadiusOffset, 0),
        }}
      >
        <div
          className={styles.offsetsSegment}
          style={{
            transform: `translate(${
              isQuarterCircle ? '-100%, 0' : '0, -50%'
            }) rotate(90deg) rotate(${fromAngleHandler.angle}deg)`,
            transformOrigin: isQuarterCircle ? '100% 100%' : '50% 100%',
          }}
        >
          <div
            className={styles.offsetsSegmentRemove}
            style={{
              transform: `translate(0, 100%) rotate(${offsetAngleOfCenter}deg)`,
              transformOrigin: isQuarterCircle ? '100% 0%' : '50% 0%',
            }}
          />
        </div>
        <div
          className={styles.offsetsSegment}
          style={{
            transform: `translate(${
              isQuarterCircle ? '-100%, 0' : '0, -50%'
            }) rotate(90deg) rotate(${
              fromAngleHandler.angle + offsetAngleOfCenter
            }deg)`,
            transformOrigin: isQuarterCircle ? '100% 100%' : '50% 100%',
          }}
        >
          <div
            className={styles.offsetsSegmentRemove}
            style={{
              transform: `translate(0, 100%) rotate(${offsetAngleOfCenter}deg)`,
              transformOrigin: isQuarterCircle ? '100% 0%' : '50% 0%',
            }}
          />
        </div>
      </div>

      <div
        className={styles.relativeAxis}
        style={{
          top: radius + Math.max(handlerRangeRadiusOffset, 0),
          left:
            (isQuarterCircle ? 0 : radius) +
            Math.max(handlerRangeRadiusOffset, 0),
        }}
      >
        <div className={styles.axisCenter} ref={axisCenterEl} />
        <div
          ref={centerHandlerEl}
          className={styles.centerAngleHandler}
          style={{
            width: 2 * handlerRadius,
            height: 2 * handlerRadius,
            borderRadius: 2 * handlerRadius,
            transform: `translate(${centerHandler.x - handlerRadius}px, ${
              centerHandler.y - handlerRadius
            }px)`,
            opacity: isCenterHandlerActive ? 0.5 : 1,
            cursor: isCenterHandlerActive ? 'move' : 'pointer',
          }}
          onMouseDown={onCenterAngleHandlerMouseDown}
        />
      </div>
    </div>
  );
}
