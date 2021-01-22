import * as React from 'react';
import Svg, {Stop, Path, Defs, LinearGradient, Circle} from 'react-native-svg';

function LogoNotification(props) {
  return (
    <Svg
      width={71}
      height={77}
      viewBox="0 0 71 77"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M33 77c4.538 0 8.25-3.508 8.25-7.795h-16.5C24.75 73.492 28.421 77 33 77zm24.75-23.385V34.128c0-11.965-6.765-21.981-18.563-24.632v-2.65C39.188 3.611 36.425 1 33 1c-3.424 0-6.188 2.611-6.188 5.846v2.65C14.975 12.146 8.25 22.124 8.25 34.128v19.487L0 61.41v3.898h66V61.41l-8.25-7.795z"
        fill="url(#prefix__paint0_linear)"
      />
      <Circle cx={57} cy={14} r={14} fill="url(#prefix__paint1_linear)" />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={19.938}
          y1={11.688}
          x2={36.782}
          y2={57.621}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#1787ED" stopOpacity={0.73} />
          <Stop offset={0.368} stopColor="#0866BC" stopOpacity={0.794} />
          <Stop offset={1} stopColor="#004484" />
        </LinearGradient>
        <LinearGradient
          id="prefix__paint1_linear"
          x1={66.1}
          y1={0}
          x2={48.6}
          y2={22.4}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#EB5757" />
          <Stop offset={1} stopColor="#8D0D30" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default LogoNotification;
