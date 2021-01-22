import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function IconE(props) {
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
        stroke="#004485"
        strokeWidth={2}
      />
      <Path
        d="M12.815 13.517h-4.62v-2.824h4.367V9.292H8.194V6.619h4.621V5.136H6.431V15h6.384v-1.483z"
        fill="#004485"
      />
    </Svg>
  );
}

export default IconE;
