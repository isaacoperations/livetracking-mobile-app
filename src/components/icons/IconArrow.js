import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IconArrow(props) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490"
      width={props.width}
      height={props.height}
      fill={props.fill}
      {...props}>
      <Path d="M0 15.541h490L244.991 474.459 0 15.541z" fill={props.fill} />
    </Svg>
  );
}

export default IconArrow;
