import * as React from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card} from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import _ from 'lodash';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';

import {BadgeComponent} from '../../../components/BadgeComponent';
import IconE from '../../../components/icons/IconE';
import IconMoon from '../../../components/icons/IconMoon';
import IconDanger from '../../../components/icons/IconDanger';


const numColumns = 2;
const WIDTH = Dimensions.get('window').width;

export function CardComponent({
  progressLine = '50',
  progressRun = '80',
  description,
  status,
  title,
  onPress,
  currentDowntimeDurationSeconds,
  currentDowntimeStartTime,
  currentDowntimeStatus,
  runDurationSeconds,
  runStartTime,
  targetSpeed,
}) {
  return (
    <Card
      containerStyle={[
        styles.cardContainer,
        {width: progressLine ? 'auto' : '46%'},
      ]}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.cardImage}>
          <BadgeComponent status={status} />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardTitle}>
            {title}
          </Text>
          {description ? (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.cardDescription}>
              {description}
            </Text>
          ) : (
            <Text style={{marginTop: 15}} />
          )}
          <View
            style={[
              styles.cardProgress,
              {marginBottom: 20},
            ]}>
            <IconE />
            {progressLine ? (
              <>
                <Text style={styles.cardProgressTitle}>
                  {_.floor(progressRun, 1)}%
                </Text>
                <View style={styles.cardProgressRow}>
                  <View
                    style={[
                      styles.cardProgressLineHead,
                      {width: `${_.floor(progressRun)}%`},
                    ]}
                  />
                  <View
                    style={[
                      styles.cardProgressLineMiddle,
                      {width: `${_.floor(progressLine)}%`},
                    ]}
                  />
                  <View style={styles.cardProgressLineFooter} />
                </View>
              </>
            ) : null}
          </View>
          <View style={styles.cardTimerRow}>
            {status === 'down' ? (
              <IconDanger style={{marginBottom: 4}} />
            ) : (
              <IconMoon style={{marginBottom: 4}} />
            )}
            {status !== 'notrunning' ? (
              <>
                <CountDown
                  size={15}
                  until={
                    status === 'slow' || status === 'normal'
                      ? runDurationSeconds
                      : status === 'down'
                      ? currentDowntimeDurationSeconds
                      : null
                  }
                  onFinish={() => console.log('Finished')}
                  digitTxtStyle={{
                    color:
                      status === 'down'
                        ? THEME.ERROR_COLOR
                        : THEME.PRIMARY_COLOR_DARK,
                    fontSize: 12,
                  }}
                  timeLabelStyle={{
                    color: THEME.ASH_COLOR,
                    margin: 0,
                  }}
                  digitStyle={{
                    backgroundColor: 'transparent',
                    height: 20,
                  }}
                  separatorStyle={{
                    color: THEME.ASH_COLOR,
                    marginTop: 'auto',
                    marginBottom: 1,
                  }}
                  timeToShow={['H', 'M', 'S']}
                  timeLabels={{h: 'HR', m: 'MIN', s: 'SEC'}}
                  showSeparator
                />
              </>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    maxWidth: '46%',
    margin: '2%',
    borderRadius: 8,
    padding: 15,
    marginBottom: 5,
    height: '100%',
    maxHeight: Platform.OS === 'ios' ? 176 : 180,
  },
  cardImage: {
    backgroundColor: THEME.WHITE_COLOR,
  },
  cardTitle: {
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    marginBottom: Platform.OS === 'ios' ? 7 : 0,
    textTransform: 'uppercase',
  },
  cardDescription: {
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Bold,
  },
  cardProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
    marginBottom: 7,
  },
  cardProgressTitle: {
    color: THEME.PRIMARY_COLOR_DARK,
    fontFamily: FONT.SemiBold,
  },
  cardProgressRow: {
    position: 'relative',
    width: '100%',
    maxWidth: 64,
    marginBottom: 6,
  },
  cardProgressLineHead: {
    width: '50%',
    position: 'absolute',
    zIndex: 3,
    left: 0,
    top: 0,
    backgroundColor: '#004485',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    height: 5,
  },
  cardProgressLineMiddle: {
    width: '80%',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    top: 0,
    backgroundColor: '#BAD7F2',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    height: 5,
  },
  cardProgressLineFooter: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 1,
    backgroundColor: '#DDDDDD',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
    height: 3,
  },
  cardTimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});
