import React, { useEffect } from 'react';
import { Button, Platform, PermissionsAndroid, StyleSheet, View } from 'react-native';
import PushNotification from "react-native-push-notification";

function App() {
  useEffect(() => {
    async function requestNotificationPermission() {
      if (Platform.OS === 'android' && Platform.Version) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs access to notifications to show alerts.',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      }
    }

    requestNotificationPermission();

    // Configure push notifications
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION RECEIVED:', notification);
      },
      onAction: function (notification) {
        console.log('NOTIFICATION ACTION:', notification);
        if (notification.action === 'Reply') {
          console.log('User replied with:', notification.reply_text);
        } else if (notification.action === 'MarkAsRead') {
          console.log('User marked notification as read.');
        }
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create channel for Android notifications
    PushNotification.createChannel(
      {
        channelId: 'firsts', // Unique channel ID
        channelName: 'My First Channel', // Channel name
        channelDescription: 'A description of my first channel', // Channel description
        playSound: true,
        soundName: 'default', 
        importance: 4, 
        vibrate: true,
      },
      (created) => console.log(`CreateChannel returned '${created}'`)
    );
  }, []);

  function scheduledNotificationHandler() {
    PushNotification.localNotificationSchedule({
      channelId: 'firsts', 
      title: 'My Notification Title',
      message: "My Notification Message", 
      date: new Date(Date.now() + 5 * 1000), 
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      actions: ['Reply', 'MarkAsRead'], // Define actions here
      reply_placeholder_text: "Type your reply...", // Placeholder text for reply
      reply_button_text: "Send", // Button text for reply action
    });
  }

  return (
    <View style={styles.container}>
      <Button title="Schedule Notification" onPress={scheduledNotificationHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
