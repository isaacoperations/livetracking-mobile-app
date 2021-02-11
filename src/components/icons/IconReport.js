import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconReport(props) {
  return (
    <Svg
      width={18}
      height={19}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M6.75 18.58h4.5V.84h-4.5v17.74zm-6.75 0h4.5V9.71H0v8.87zM13.5 6.384V18.58H18V6.384h-4.5z"
        fill={props.color}
      />
    </Svg>
  );
}

export default IconReport;
