import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconWifi(props) {
  return (
    <Svg
      width={20}
      height={17}
      viewBox="0 0 20 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M19.7 4.833C19.325 4.55 15.592 1.5 10 1.5c-1.25 0-2.408.158-3.458.4l8.608 8.6 4.55-5.667zm-5.5 6.85L2.725.2 1.667 1.267l1.708 1.716C1.592 3.8.492 4.683.3 4.833l9.692 12.075.008.009.008-.009 3.25-4.05 2.767 2.767 1.058-1.058-2.883-2.884z"
        fill="#fff"
      />
    </Svg>
  );
}

export default IconWifi;
