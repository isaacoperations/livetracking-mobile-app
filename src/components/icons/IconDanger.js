import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function IconDanger(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle
        cx={10}
        cy={10}
        r={9}
        fill="#fff"
        stroke="#E00000"
        strokeWidth={2}
      />
      <Path
        d="M9.05 5.129l.157 6.61h1.58l.156-6.61H9.05zM10 15.17c.69 0 1.135-.424 1.135-1.073 0-.657-.445-1.08-1.135-1.08s-1.135.423-1.135 1.08c0 .65.445 1.073 1.135 1.073z"
        fill="#E00000"
      />
    </Svg>
  );
}

export default IconDanger;
