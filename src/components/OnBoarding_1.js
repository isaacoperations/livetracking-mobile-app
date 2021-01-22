import * as React from 'react';
import Svg, {Path, Defs, Stop, RadialGradient} from 'react-native-svg';

function Onboarding1(props) {
  return (
    <Svg
      width={125}
      height={66}
      viewBox="0 0 125 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.393 64.565a67.181 67.181 0 01-.004-.717C1.389 28.586 29.06 0 63.194 0 97.33 0 125 28.586 125 63.848c0 .24-.001.478-.004.717H1.393z"
        fill="url(#prefix__paint0_angular)"
      />
      <Path
        d="M62.497 0C28.167 0 0 29.339 0 65.096h8.802c0-30.714 24.207-55.928 53.695-55.928 29.489 0 53.695 25.214 53.695 55.928h8.803C125.435 29.339 97.267 0 62.497 0z"
        fill="url(#prefix__paint1_angular)"
      />
      <Path
        d="M67.779 60.123l12.324-28.027-27.288 12.657c-3.521 1.809-5.722 5.877-5.722 9.946C47.093 61.027 51.935 66 58.096 66c4.402 0 7.923-2.26 9.683-5.877z"
        fill="#004485"
      />
      <Defs>
        <RadialGradient
          id="prefix__paint0_angular"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(13.8889 0 0 14.3478 62.5 79.63)">
          <Stop offset={0.051} stopColor="#0A71CE" />
          <Stop offset={0.249} stopColor="#44AFEC" />
          <Stop offset={0.448} stopColor="#C1D7EC" />
        </RadialGradient>
        <RadialGradient
          id="prefix__paint1_angular"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(.28736 55.64176 -72.58143 .37485 62.5 32.548)">
          <Stop offset={0.156} stopColor="#0C7EE4" />
          <Stop offset={0.536} stopColor="#0456D2" />
          <Stop offset={0.867} stopColor="#3BC4E2" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}

export default Onboarding1;
