import React from 'react';
import {Text, StyleSheet, View, Platform, ScrollView} from 'react-native';
import _ from 'lodash';

import {THEME} from '../../../constants/theme';
import {FONT} from '../../../constants/fonts';
import IconArrow from '../../../components/icons/IconArrow';

export function CardEfficiency({
  efficiencyPercent = 45,
  efficiencyTarget = 70,
}) {
  return (
    <>
      <Text style={styles.label}>EFFICIENCY</Text>
      <View
        style={{
          marginTop: 10,
          alignItems: 'center',
        }}>
        <View style={[styles.cardProgressRow, {marginTop: 65}]}>
          <View
            style={[
              styles.cardProgressLineHead,
              {
                width:
                  efficiencyPercent > 100
                    ? '100%'
                    : `${_.floor(efficiencyPercent, 1)}%`,
              },
            ]}>
            <View style={styles.cardProgressLineHeadText}>
              <Text style={styles.textBlue}>OEE</Text>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: FONT.Medium,
                  color: THEME.PRIMARY_COLOR_DARK,
                  marginTop: Platform.OS === 'ios' ? 0 : -10,
                }}>
                {efficiencyPercent > 100
                  ? _.floor(efficiencyPercent)
                  : _.floor(efficiencyPercent, 1)}
                %
              </Text>
              <IconArrow
                height={10}
                width={10}
                fill={THEME.DANGER_COLOR}
                style={{
                  marginTop: Platform.OS === 'ios' ? 1 : -8,
                }}
              />
            </View>
          </View>
          <View
            style={[
              styles.cardProgressLineMiddle,
              {
                width:
                  efficiencyTarget > 100
                    ? '100%'
                    : `${_.floor(efficiencyTarget, 1)}%`,
              },
            ]}>
            <View style={styles.cardProgressLineMiddleText}>
              <IconArrow
                height={10}
                width={10}
                fill={'rgba(0, 68, 132, 0.4)'}
                style={{
                  marginTop: Platform.OS === 'ios' ? 0 : 0,
                  transform: [{rotate: '180deg'}],
                }}
              />
              <Text
                style={[
                  styles.textBlue,
                  {
                    color: 'rgba(0, 68, 132, 0.4)',
                    marginTop: Platform.OS === 'ios' ? 0 : -3,
                  },
                ]}>
                TARGET
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: FONT.Medium,
                  color: 'rgba(0, 68, 132, 0.4)',
                  marginTop: Platform.OS === 'ios' ? 0 : -15,
                }}>
                {_.floor(efficiencyTarget, 1)}%
              </Text>
            </View>
          </View>
          <View style={styles.cardProgressLineFooter} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    color: THEME.PEW_COLOR,
    fontSize: 12,
    fontFamily: FONT.Regular,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 17,
    fontFamily: FONT.Medium,
    color: THEME.DARK_COLOR,
    marginBottom: 20,
  },
  textBlue: {
    fontSize: 15,
    fontFamily: FONT.Regular,
    color: THEME.PRIMARY_COLOR_DARK,
    marginBottom: 0,
  },
  cardProgressRow: {
    position: 'relative',
    width: '100%',
    marginBottom: 6,
  },
  cardProgressLineHeadText: {
    width: 75,
    position: 'absolute',
    top: -65,
    right: -36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardProgressLineMiddleText: {
    width: 75,
    position: 'absolute',
    bottom: -65,
    right: -35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardProgressLineHead: {
    width: '50%',
    position: 'absolute',
    zIndex: 3,
    left: 0,
    top: 0,
    backgroundColor: THEME.PRIMARY_COLOR_DARK,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    height: 16,
  },
  cardProgressLineMiddle: {
    width: '80%',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    top: 3,
    backgroundColor: 'rgba(0, 68, 132, 0.4)',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    height: 10,
  },
  cardProgressLineFooter: {
    width: '100%',
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 3,
    backgroundColor: '#DDDDDD',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    height: 10,
  },
});
