import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Card} from 'react-native-elements';
import _ from 'lodash';

import {FONT} from '../../../constants/fonts';
import {THEME} from '../../../constants/theme';

import {BadgeComponent} from '../../../components/BadgeComponent';
import IconE from '../../../components/icons/IconE';
import IconMoon from '../../../components/icons/IconMoon';
import IconDanger from '../../../components/icons/IconDanger';
import {CountTimer} from '../../CardDetailsScreen/components/CountTimer';

export function CardComponent({
  progressLine = '50',
  progressRun = '80',
  productName,
  productDesc,
  status,
  title,
  onPress,
  currentDowntimeDurationSeconds,
  runDurationSeconds,
}) {
  return (
    <Card containerStyle={[styles.cardContainer]}>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <View style={styles.cardImage}>
          <BadgeComponent status={status} />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardTitle}>
            {title}
          </Text>
          {productName ? (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.cardName}>
              {productName}
            </Text>
          ) : null}
          {productDesc ? (
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={styles.cardDescription}>
              {productDesc}
            </Text>
          ) : null}
          {status === 'notrunning' ? <View style={{height: 30}} /> : null}
          <View style={[styles.cardProgress, {marginBottom: 10}]}>
            <IconE />
            {status !== 'notrunning' ? (
              progressLine ? (
                <>
                  <Text style={styles.cardProgressTitle}>
                    {progressRun > 100
                      ? _.floor(progressRun)
                      : _.floor(progressRun, 1)}
                    %
                  </Text>
                  <View style={styles.cardProgressRow}>
                    <View
                      style={[
                        styles.cardProgressLineHead,
                        {
                          width:
                            progressRun > 100
                              ? '100%'
                              : `${_.floor(progressRun)}%`,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.cardProgressLineMiddle,
                        {
                          width:
                            progressLine > 100
                              ? '100%'
                              : `${_.floor(progressLine)}%`,
                        },
                      ]}
                    />
                    <View style={styles.cardProgressLineFooter} />
                  </View>
                </>
              ) : null
            ) : null}
          </View>
          <View style={styles.cardTimerRow}>
            {status !== 'notrunning' ? (
              status === 'down' ? (
                <IconDanger style={{marginTop: 10}} />
              ) : (
                <IconMoon style={{marginTop: 5}} />
              )
            ) : (
              <IconMoon style={{marginTop: 5}} />
            )}
            {status !== 'notrunning' ? (
              status === 'down' ? (
                <View style={{width: '100%', paddingHorizontal: 15}}>
                  <CountTimer
                    durationSeconds={currentDowntimeDurationSeconds}
                    status={status}
                  />
                </View>
              ) : (
                <View style={{width: '100%', paddingHorizontal: 15}}>
                  <CountTimer
                    durationSeconds={runDurationSeconds}
                    status={status}
                  />
                </View>
              )
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
    width: '100%',
    margin: '2%',
    borderRadius: 8,
    padding: 15,
    marginBottom: 5,
    maxHeight: Platform.OS === 'ios' ? 246 : 250,
  },
  cardImage: {
    backgroundColor: THEME.WHITE_COLOR, //red
  },
  cardTitle: {
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    marginBottom: Platform.OS === 'ios' ? 7 : 0,
    textTransform: 'uppercase',
  },
  cardName: {
    color: THEME.DARK_COLOR,
    fontSize: 12,
    fontFamily: FONT.Bold,
  },
  cardDescription: {
    color: THEME.CHAR_COLOR,
    fontSize: 11,
    fontFamily: FONT.Regular,
    marginTop: Platform.OS === 'android' ? -5 : 0,
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
    fontFamily: Platform.OS === 'ios' ? FONT.SemiBold : FONT.Bold,
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
