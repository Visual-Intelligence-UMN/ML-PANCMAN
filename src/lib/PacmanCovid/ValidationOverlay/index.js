import React from 'react';
import PropTypes from 'prop-types';
import { PLAYER_RADIUS } from '../constants';
import { cssPosition } from '../helpers';
import './style.scss';

// Map validation directions to SVG angles (in degrees)
// SVG angles: 0=East, 90=South, 180=West, 270=North
// We need: up=North(270/-90), right=East(0), down=South(90), left=West(180)
const HIGHLIGHT_ROTATIONS = {
  up: -90,    // Points up (North)
  right: 0,   // Points right (East)
  down: 90,   // Points down (South)
  left: 180,  // Points left (West)
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function ValidationOverlay({
  gridSize,
  position,
  validationConfidence,
  validationDirection,
  validationThreshold,
}) {
  const normalizedConfidence = clamp(
    validationConfidence / Math.max(validationThreshold || 0.001, 0.001),
    0,
    1
  );

  const radius = gridSize * PLAYER_RADIUS * 1.6; // Slightly larger than player

  const style = {
    ...cssPosition(position, gridSize),
    width: radius * 2,
    height: radius * 2,
    marginLeft: -radius,
    marginTop: -radius,
  };

  // Color interpolation
  const base = { r: 210, g: 210, b: 210 };
  const target = { r: 76, g: 175, b: 80 };
  const lerp = (start, end) =>
    Math.round(start + (end - start) * normalizedConfidence);

  const color = {
    r: lerp(base.r, target.r),
    g: lerp(base.g, target.g),
    b: lerp(base.b, target.b),
  };

  const alpha = 0.25 + normalizedConfidence * 0.35; // More transparent than original
  const strokeWidth = 2 + normalizedConfidence * 1;

  const circleProps = {
    cx: radius,
    cy: radius,
    r: radius - strokeWidth / 2,
    fill: 'none',
    stroke: `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`,
    strokeWidth: strokeWidth,
  };

  // Directional indicator (small wedge/arc)
  let arcPath = null;
  if (validationDirection && HIGHLIGHT_ROTATIONS.hasOwnProperty(validationDirection)) {
    const rotation = HIGHLIGHT_ROTATIONS[validationDirection];
    const spread = 30 + normalizedConfidence * 10; // degrees
    const startAngle = rotation - spread / 2;
    const endAngle = rotation + spread / 2;
    
    // Convert degrees to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Calculate arc endpoints
    const innerRadius = radius - strokeWidth / 2 - 3;
    const outerRadius = radius - strokeWidth / 2 + 3;
    
    const x1 = radius + innerRadius * Math.cos(startRad);
    const y1 = radius + innerRadius * Math.sin(startRad);
    const x2 = radius + outerRadius * Math.cos(startRad);
    const y2 = radius + outerRadius * Math.sin(startRad);
    const x3 = radius + outerRadius * Math.cos(endRad);
    const y3 = radius + outerRadius * Math.sin(endRad);
    const x4 = radius + innerRadius * Math.cos(endRad);
    const y4 = radius + innerRadius * Math.sin(endRad);
    
    const largeArcFlag = spread > 180 ? 1 : 0;
    
    arcPath = `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
      Z
    `;
    
    const arcAlpha = 0.3 + normalizedConfidence * 0.4;
    var arcProps = {
      d: arcPath,
      fill: `rgba(${color.r}, ${color.g}, ${color.b}, ${arcAlpha})`,
    };
  }

  return (
    <svg className="validation-overlay" style={style}>
      <circle {...circleProps} />
      {arcPath && <path {...arcProps} />}
    </svg>
  );
}

ValidationOverlay.propTypes = {
  gridSize: PropTypes.number.isRequired,
  position: PropTypes.array.isRequired,
  validationConfidence: PropTypes.number.isRequired,
  validationDirection: PropTypes.string,
  validationThreshold: PropTypes.number.isRequired,
};

