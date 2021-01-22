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
} from 'react-native';
import {Formik, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import {API_URL_FORGOT_PASSWORD} from '../../config';
import {THEME} from '../../constants/theme';
import {FONT} from '../../constants/fonts';
import HeaderStatus from '../../components/HeaderStatus';
import ErrorComponent from '../../components/ErrorComponent';

export function ForgotPasswordScreen({navigation}) {
  const [isError, setIsError] = useState('');
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .min(3, 'Please enter more than 3 characters!')
      .max(70, 'Too Long!')
      .email('Invalid email')
      .required('Required'),
  });

  return (
    <>
      <HeaderStatus ios={'dark'} />
      <Formik
        initialValues={{email: ''}}
        validationSchema={LoginSchema}
        onSubmit={async (values, actions) => {
          try {
            const formData = new FormData();
            formData.append('email_data', {
              'esen.arykbaev@dteam.dev': {
                username: 'esen',
                email: 'esen.arykbaev@dteam.dev',
              },
            });
            console.log('asdasd', formData._parts[0]);
            await axios({
              method: 'POST',
              url: API_URL_FORGOT_PASSWORD,
              headers: {
                'Content-Type': 'multipart/form-data; boundary=--------------------------805119290776880596250158',
                'x-api-key': 'sL5WYLqysS3N8g12LpnyL9dUUoDxoPDT7CW25dGr',
                Host: 'p6ynxnvo9l.execute-api.eu-central-1.amazonaws.com',
              },
              data: formData,
            });
            actions.resetForm();
          } catch (e) {
            console.log('err', e.message);
            setIsError(e.message);
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
                            Reset Password
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
