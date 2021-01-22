import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {CheckBox} from 'react-native-elements';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import LogoBlackSvg from '../../components/LogoBlack';
import HeaderStatus from '../../components/HeaderStatus';
import ErrorComponent from '../../components/ErrorComponent';

import {AuthContext} from '../../context/context';

export function LoginScreen({navigation}) {
  const [showPassword, setShowPassword] = useState(true);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');

  const {login} = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
      await MaterialCommunityIcons.loadFont();
      await AntDesign.loadFont();
      await Ionicons.loadFont();
    })();
  }, []);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .min(3, 'Please enter more than 3 characters!')
      .max(70, 'Too Long!')
      .email('Invalid email')
      .required(''),
    password: Yup.string()
      .min(6, 'Please enter more than 6 characters!')
      .max(24, 'Too Long!')
      .required(''),
  });

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <Formik
        initialValues={{email: '', password: '', check: false}}
        validationSchema={LoginSchema}
        onSubmit={async (values, actions) => {
          try {
            setIsLoading(true);
            actions.resetForm();
            await login(values.email.toLowerCase(), values.password);
          } catch (e) {
            setIsError(e.message);
            setIsLoading(false);
          }
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          setFieldValue,
          isValid,
          dirty,
        }) => (
          <SafeAreaView style={styles.containerScroll}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                  <LogoBlackSvg style={styles.logo} />
                  <View
                    style={{
                      width: '100%',
                      marginTop: 'auto',
                    }}>
                    <>
                      {isError && isError ? (
                        <ErrorComponent
                          text={isError}
                          style={{marginTop: 15, color: 'red'}}
                        />
                      ) : null}
                      <Text style={styles.label}>Email</Text>
                      <TextInput
                        style={[
                          {
                            borderColor: focusEmail
                              ? THEME.PRIMARY_COLOR
                              : THEME.GRAY_COLOR,
                            backgroundColor: focusEmail
                              ? THEME.WHITE_COLOR
                              : THEME.GRAY_COLOR,
                          },
                          styles.input,
                        ]}
                        onFocus={() => setFocusEmail(true)}
                        onChangeText={handleChange('email')}
                        onBlur={() => {
                          setFocusEmail(false);
                          handleBlur('email');
                        }}
                        value={values.email}
                      />
                    </>

                    {focusEmail && errors.email ? (
                      <Text style={THEME.ERROR_TEXT}>{errors.email}</Text>
                    ) : null}

                    <View style={{position: 'relative', width: '100%'}}>
                      <Text style={styles.label}>Password</Text>
                      <TextInput
                        secureTextEntry={showPassword}
                        style={[
                          {
                            borderColor: focusPassword
                              ? THEME.PRIMARY_COLOR
                              : THEME.GRAY_COLOR,
                            backgroundColor: focusPassword
                              ? THEME.WHITE_COLOR
                              : THEME.GRAY_COLOR,
                          },
                          styles.input,
                        ]}
                        onChangeText={handleChange('password')}
                        onFocus={() => setFocusPassword(true)}
                        onBlur={() => {
                          setFocusPassword(false);
                          handleBlur('password');
                        }}
                        value={values.password}
                      />
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.maskPassword}>
                        {showPassword ? (
                          <MaterialCommunityIcons
                            style={{color: THEME.ASH_COLOR}}
                            name="eye"
                            size={20}
                          />
                        ) : (
                          <MaterialCommunityIcons
                            style={{color: THEME.ASH_COLOR}}
                            name="eye-off"
                            size={20}
                          />
                        )}
                      </TouchableOpacity>
                    </View>

                    {focusPassword && errors.password ? (
                      <Text style={THEME.ERROR_TEXT}>{errors.password}</Text>
                    ) : null}

                    <View style={{margin: 0, padding: 0}}>
                      <CheckBox
                        left
                        title="Remember Me"
                        iconLeft
                        containerStyle={{
                          borderWidth: 0,
                          backgroundColor: THEME.WHITE_COLOR,
                          padding: 0,
                          marginLeft: 0,
                          left: 0,
                          opacity: 1,
                        }}
                        textStyle={{
                          color: THEME.DARK_COLOR,
                          fontSize: 12,
                          fontWeight: '400',
                          marginTop: 2,
                        }}
                        checkedIcon={
                          <MaterialIcons
                            style={{color: THEME.PRIMARY_COLOR}}
                            name="check-box"
                            size={26}
                          />
                        }
                        uncheckedIcon={
                          <MaterialIcons
                            style={{color: THEME.PRIMARY_COLOR}}
                            name="check-box-outline-blank"
                            size={26}
                          />
                        }
                        activeOpacity={1}
                        uncheckedColor={THEME.PRIMARY_COLOR}
                        checkedColor={THEME.PRIMARY_COLOR}
                        checked={values.check}
                        onPress={(e) => {
                          setFieldValue('check', !values.check);
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.containerBottom}>
                    <Pressable
                      onPress={handleSubmit}
                      disabled={!(isValid && dirty)}
                      style={({pressed}) => [
                        {
                          backgroundColor: pressed
                            ? THEME.PRIMARY_COLOR_DARK
                            : THEME.PRIMARY_COLOR,
                          borderColor: THEME.WHITE_COLOR,
                          opacity: !(isValid && dirty) ? 0.5 : 1,
                        },
                        THEME.BUTTON_PRIMARY_SMALL,
                      ]}>
                      {({pressed}) => (
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={[{color: THEME.WHITE_COLOR}, styles.text]}>
                            {isLoading ? (
                              <ActivityIndicator color={THEME.WHITE_COLOR} />
                            ) : (
                              'Log in'
                            )}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ForgotPassword')}
                      activeOpacity={1}>
                      <Text style={[{color: THEME.PRIMARY_COLOR}, styles.text]}>
                        I forgot my password
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </SafeAreaView>
        )}
      </Formik>
    </>
  );
}

const styles = StyleSheet.create({
  containerScroll: {
    width: '100%',
    height: '100%',
    backgroundColor: THEME.WHITE_COLOR,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
    backgroundColor: THEME.WHITE_COLOR,
    width: '100%',
    height: '100%',
  },
  logo: {
    marginTop: 'auto',
  },
  containerBottom: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    width: '100%',
    height: 63,
    marginBottom: 30,
    borderRadius: 4,
    borderWidth: 1,
    padding: 20,
    borderColor: THEME.WHITE_COLOR,
  },
  text: {
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 14,
    fontFamily: FONT.SemiBold,
  },
  input: {
    fontSize: 14,
    fontFamily: FONT.SemiBold,
    borderWidth: 1,
    borderRadius: 2,
    width: '100%',
    padding: 15,
    marginBottom: 30,
    color: THEME.DARK_COLOR,
  },
  label: {
    fontSize: 12,
    fontFamily: FONT.Regular,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  maskPassword: {
    position: 'absolute',
    right: 0,
    top: Platform.OS === 'ios' ? 25 : 37,
    width: 50,
    height: 40,
    //backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
