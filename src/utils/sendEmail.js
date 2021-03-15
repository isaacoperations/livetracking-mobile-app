import {Platform} from 'react-native';
import Mailer from 'react-native-mail';
import Toast from 'react-native-toast-message';

export function sendEmail(emailSubject, emailURL, emailBody, isHTML = true) {
  return Mailer.mail(
    {
      subject: emailSubject,
      recipients: [emailURL],
      body: emailBody,
      isHTML,
    },
    (error, event) => {
      if (event === 'sent') {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Send email',
          topOffset: Platform.OS === 'ios' ? 110 : 40,
          visibilityTime: 500,
        });
      } else {
        Toast.show({
          type: 'info',
          position: 'top',
          text1: 'Cancelable email',
          topOffset: Platform.OS === 'ios' ? 110 : 40,
          visibilityTime: 500,
        });
      }
      console.log('Mailer', error, event);
    },
  );
}
