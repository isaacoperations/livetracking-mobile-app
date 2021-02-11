import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconNotification(props) {
  return (
    <Svg
      width={18}
      height={19}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9 20.55c1.238 0 2.25-.909 2.25-2.02h-4.5c0 1.111 1.001 2.02 2.25 2.02zm6.75-6.064V9.432c0-3.103-1.845-5.7-5.063-6.388v-.687C10.688 1.517 9.934.84 9 .84s-1.688.677-1.688 1.516v.687C4.085 3.731 2.25 6.32 2.25 9.432v5.054L0 16.508v1.01h18v-1.01l-2.25-2.022z"
        fill={props.color}
      />
    </Svg>
  );
}

export default IconNotification;
