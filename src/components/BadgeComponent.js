import React from 'react';
import {StyleSheet} from 'react-native';
import {Badge} from 'react-native-elements';

import {FONT} from '../constants/fonts';
import {THEME} from '../constants/theme';

export function BadgeComponent({status, textColor = THEME.WHITE_COLOR}) {
  let statusLine;
  if (status === 'down') {
    statusLine = 'error';
  } else if (status === 'slow') {
    statusLine = 'warning';
  } else if (status === 'normal') {
    statusLine = 'success';
  } else {
    statusLine = 'info';
  }

  const statusLower = statusLine.toLocaleLowerCase();

  return (
    <Badge
      value={
        statusLower === 'warning'
          ? 'slow'
          : statusLower === 'success'
          ? 'up'
          : statusLower === 'error'
          ? 'down'
          : statusLower === 'info'
          ? 'not running'
          : 'down'
      }
      status={statusLower}
      containerStyle={styles.badgeContainer}
      badgeStyle={[
        styles.badgeStyle,
        {
          backgroundColor:
            statusLower === 'warning'
              ? THEME.WARNING_COLOR
              : statusLower === 'success'
              ? THEME.SUCCESS_COLOR
              : statusLower === 'error'
              ? THEME.ERROR_COLOR
              : statusLower === 'info'
              ? THEME.ASH_COLOR
              : THEME.PRIMARY_COLOR_DARK,
        },
      ]}
      textStyle={[styles.textStyle, {color: textColor}]}
    />
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    marginBottom: 5,
  },
  badgeStyle: {
    minWidth: 44,
    marginLeft: 'auto',
  },
  textStyle: {
    fontSize: 10,
    fontFamily: FONT.Regular,
    textTransform: 'uppercase',
  },
});
