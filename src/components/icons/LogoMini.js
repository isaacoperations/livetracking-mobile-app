import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function LogoMini(props) {
  return (
    <Svg
      width={props.width || 20}
      height={props.height || 18}
      viewBox={'0 0 20 18'}
      fill={props.fill || 'none'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.923 0H3.25L0 18h3.672l3.25-18zM13.462 5.51H9.789L7.534 17.998h3.672l2.256-12.489zM20 10.558h-3.672l-1.343 7.439h3.671L20 10.556z"
        fill={props.fill || '#fff'}
      />
    </Svg>
  );
}

export default LogoMini;
