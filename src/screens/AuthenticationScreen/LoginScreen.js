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

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import crashlytics from '@react-native-firebase/crashlytics';

import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';

import LogoBlackSvg from '../../components/icons/LogoBlack';
import HeaderStatus from '../../components/HeaderStatus';
import ErrorComponent from '../../components/ErrorComponent';

import {AuthContext} from '../../context/context';

export function LoginScreen({navigation}) {
  const [showPassword, setShowPassword] = useState(true);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState('');
  const [isErrorEmail, setIsErrorEmail] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);

  const {login} = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      await MaterialIcons.loadFont();
      await MaterialCommunityIcons.loadFont();
      await AntDesign.loadFont();
      await Ionicons.loadFont();
      crashlytics().log('Login - screen');
    })();
  }, []);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .min(3, 'Please enter more than 3 characters!')
      .max(70, 'Too Long!')
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Please enter more than 6 characters!')
      .max(24, 'Too Long!')
      .required('Required'),
  });

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <Formik
        initialValues={{email: '', password: ''}} // check: false
        validationSchema={LoginSchema}
        onSubmit={async (values, actions) => {
          try {
            crashlytics().log('Login - form');
            setIsLoading(true);
            actions.setSubmitting(false);
            // actions.resetForm();
            await login(values.email.toLowerCase(), values.password);
          } catch (e) {
            crashlytics().recordError(e.message);
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
          isSubmitting,
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
                    {isError ? (
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
                      onFocus={() => {
                        setIsErrorEmail(false);
                        setFocusEmail(true);
                      }}
                      onChangeText={handleChange('email')}
                      onBlur={() => {
                        setFocusEmail(false);
                        handleBlur('email');
                      }}
                      value={values.email}
                    />

                    {isErrorEmail && errors.email ? (
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
                        onFocus={() => {
                          setIsErrorPassword(false);
                          setFocusPassword(true);
                        }}
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
                        <MaterialCommunityIcons
                          style={{color: THEME.ASH_COLOR}}
                          name={showPassword ? 'eye' : 'eye-off'}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>

                    {isErrorPassword && errors.password ? (
                      <Text style={THEME.ERROR_TEXT}>{errors.password}</Text>
                    ) : null}
                  </View>
                  <View style={styles.containerBottom}>
                    <Pressable
                      onPress={() => {
                        setIsErrorEmail(true);
                        setIsErrorPassword(true);
                        handleSubmit();
                      }}
                      disabled={isSubmitting}
                      // disabled={dirty} //!(isValid && dirty)
                      style={({pressed}) => [
                        {
                          backgroundColor: pressed
                            ? THEME.PRIMARY_COLOR_DARK
                            : THEME.PRIMARY_COLOR,
                          borderColor: THEME.WHITE_COLOR,
                          opacity: 1, // !(isValid && dirty) ? 0.5 : 1
                        },
                        THEME.BUTTON_PRIMARY_SMALL,
                      ]}>
                      {({pressed}) => (
                        <View style={styles.buttonContainer}>
                          {isLoading ? (
                            <ActivityIndicator
                              style={{
                                marginLeft: 'auto',
                                marginRight: 'auto',
                              }}
                              color={THEME.WHITE_COLOR}
                            />
                          ) : (
                            <Text
                              style={[{color: THEME.WHITE_COLOR}, styles.text]}>
                              Log in
                            </Text>
                          )}
                        </View>
                      )}
                    </Pressable>
                    <TouchableOpacity
                      onPress={() => {
                        crashlytics().log('ForgotPassword - button');
                        navigation.navigate('ForgotPassword');
                      }}
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
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
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
    top: Platform.OS === 'ios' ? 20 : 27,
    width: 60,
    height: Platform.OS === 'ios' ? 50 : 60,
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
