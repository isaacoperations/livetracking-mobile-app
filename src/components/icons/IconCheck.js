import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconCheck(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"
        fill={props.color || '#004485'}
      />
      <Path
        d="M13.23 6.36l-4.3 5.16-2.22-2.23a1.004 1.004 0 00-1.42 1.42l3 3A1 1 0 009 14h.05a1 1 0 00.72-.36l5-6a1.001 1.001 0 00-1.54-1.28z"
        fill={props.color || '#004485'}
      />
    </Svg>
  );
}

export default IconCheck;
