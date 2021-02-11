import * as React from 'react';
import Svg, {Circle, Path, Defs, Stop, RadialGradient} from 'react-native-svg';

function Onboarding3(props) {
  return (
    <Svg
      width={139}
      height={106}
      viewBox="0 0 139 106"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle
        cx={70}
        cy={53}
        r={49}
        stroke="url(#prefix__paint0_angular)"
        strokeWidth={8}
      />
      <Path fill="#F2F2F2" d="M0 44h69v46H0z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.554 67.33l7.586-2.101V48.913h5.267v14.833l7.21-1.978V48.913h5.267v11.433l7.148-2.039v-9.394h5.267v7.973l12.038-3.338v32.137h-7.775V73.634h-10.91v12.05H9.555V67.33zm17.618 6.86h6.52v3.275h-6.52V74.19zm-11.6 0h6.521v3.275h-6.52V74.19z"
        fill="#004484"
      />
      <Path fill="#F2F2F2" d="M139 18H85v31h54z" />
      <Path
        d="M122.679 14v10.656l-5.593 3.016v-5.63l-11.186 5.63v-5.63l-11.186 5.63v15.28h33.558V14h-5.593zm-23.57 18.9h5.593v4.02h-5.593V32.9zm9.588 0h5.593v4.02h-5.593V32.9zm9.588 0h5.593v4.02h-5.593V32.9z"
        fill="#0A71CE"
      />
      <Defs>
        <RadialGradient
          id="prefix__paint0_angular"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(122.45 20.447 45.722) scale(69.6507)">
          <Stop offset={0.301} stopColor="#1187F3" />
          <Stop offset={0.578} stopColor="#66D7F0" />
          <Stop offset={0.824} stopColor="#0C83C7" />
          <Stop offset={0.962} stopColor="#185B9B" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}

export default Onboarding3;
