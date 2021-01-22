import * as React from 'react';
import Svg, {Stop, Path, Defs, LinearGradient} from 'react-native-svg';

function Onboarding4(props) {
  return (
    <Svg
      width={83}
      height={98}
      viewBox="0 0 83 98"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M42.783 97.71c40.37-13.99 39.74-46.86 39.3-70.87 0-2.46-.09-4.86-.09-7.16v-2.4a2.79 2.79 0 00-2.79-2.79h-2.43c-13.6 0-23.49-3.72-32.07-12.07L43.023.79a2.79 2.79 0 00-3.89 0l-1.67 1.63c-8.59 8.35-18.48 12.07-32.07 12.07h-2.41a2.79 2.79 0 00-2.79 2.79v2.41c0 2.3 0 4.69-.09 7.16-.46 24-1.09 56.88 39.28 70.87a5.19 5.19 0 003.4-.01zm-8.81-37a1.58 1.58 0 01-.92-2l3.71-10.43a7 7 0 118.65 0l3.67 10.46a1.58 1.58 0 01-.92 2 19.57 19.57 0 01-14.19 0v-.03z"
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={15}
          y1={5.5}
          x2={54.5}
          y2={86.5}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#014584" />
          <Stop offset={0.624} stopColor="#52A4EE" />
          <Stop offset={1} stopColor="#4BBEE4" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default Onboarding4;
