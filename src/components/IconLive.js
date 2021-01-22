import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconLive(props) {
  return (
    <Svg
      width={18}
      height={19}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M0 10.696h8V.84H0v9.855zm0 7.884h8v-5.913H0v5.913zm10 0h8V8.725h-8v9.855zM10 .84v5.914h8V.84h-8z"
        fill={props.color}
      />
    </Svg>
  );
}

export default IconLive;
