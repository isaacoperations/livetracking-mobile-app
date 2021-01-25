import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Auth0 from 'react-native-auth0';

import {API_URL_FORGOT_PASSWORD} from '../../config';
import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';
import HeaderStatus from '../../components/HeaderStatus';
import ErrorComponent from '../../components/ErrorComponent';

import {credentials} from '../../config/auth0-configuration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAction} from '../../utils/createAction';

export function ForgotPasswordScreen({navigation}) {
  const [isError, setIsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .min(3, 'Please enter more than 3 characters!')
      .max(70, 'Too Long!')
      .email('Invalid email')
      .required('Required'),
  });

  const auth0 = new Auth0(credentials);
  const formData = new FormData();

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <Formik
        initialValues={{email: ''}}
        validationSchema={LoginSchema}
        onSubmit={async (values, actions) => {
          try {
            setIsLoading(true);
            const emailData = values.email.toLowerCase();
            const data = JSON.stringify({
              [emailData]: {
                username: emailData,
                email: emailData,
              },
            });
            formData.append('email_data', data);
            // await auth0.auth
            //   .resetPassword({
            //     email: values.email.toLowerCase(),
            //     connection: 'Username-Password-Authentication',
            //   })
            //   .then(async (res) => {
            //     console.log('data auth0', res);
            await axios({
              method: 'POST',
              url: API_URL_FORGOT_PASSWORD,
              headers: {
                'x-api-key': 'sL5WYLqysS3N8g12LpnyL9dUUoDxoPDT7CW25dGr',
                'Content-Type': 'multipart/form-data;',
              },
              data: formData,
            }).then((response) => {
              setIsLoading(false);
              setIsError('');
            });
            // })
            // .catch((err) => {
            //   console.log('errr', err);
            //   setIsError(err.message);
            //   setIsLoading(false);
            // });
            actions.resetForm();
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
          isValid,
          dirty,
        }) => (
          <SafeAreaView style={styles.containerScroll}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              {/*<KeyboardAvoidingView*/}
              {/*  enabled={false}*/}
              {/*  style={{flex: 1, width: '100%'}}*/}
              {/*  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>*/}
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                  <View
                    style={{
                      width: '100%',
                      marginTop: 'auto',
                    }}>
                    <Text style={styles.title}>
                      Enter your account email to reset password
                    </Text>
                    {isError && isError ? (
                      <ErrorComponent
                        text={isError}
                        style={{marginTop: 15, color: 'red'}}
                      />
                    ) : null}
                    <TextInput
                      style={[
                        {
                          borderColor: errors.email
                            ? THEME.DANGER_COLOR
                            : THEME.GRAY_COLOR,
                        },
                        styles.input,
                      ]}
                      placeholderTextColor="#999"
                      placeholder={'Your Email'}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                    />

                    <ErrorMessage
                      name="email"
                      render={(msg) => (
                        <Text style={THEME.ERROR_TEXT}>{msg}</Text>
                      )}
                    />

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
                              'Reset Password'
                            )}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                  <View style={styles.containerBottom}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('AuthInfo')}
                      activeOpacity={1}>
                      <Text style={[{color: THEME.PRIMARY_COLOR}, styles.text]}>
                        Still have trouble? Contact administrator
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
              {/*</KeyboardAvoidingView>*/}
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
  title: {
    marginTop: 'auto',
    fontSize: 15,
    fontFamily: FONT.SemiBold,
    color: THEME.CHAR_COLOR,
    textAlign: 'center',
    marginBottom: 60,
  },
  containerBottom: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    borderBottomWidth: 1,
    borderRadius: 2,
    width: '100%',
    padding: 15,
    backgroundColor: THEME.WHITE_COLOR,
    marginBottom: 30,
    color: THEME.DARK_COLOR,
  },
});
