import React, { useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function logingoole() {
  const [userInfo, setUserInfo] = React.useState<Google.AuthSessionResult | null>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '759317752188-ltlbvnh4m5mc6124antac90ei46hgf9i.apps.googleusercontent.com',
    iosClientId: '759317752188-ebsklhgqj6gvnnp4h6p4oigodle2v78c.apps.googleusercontent.com',
    androidClientId: '759317752188-31pqa1loaqsqviafreu948apcm8haanq.apps.googleusercontent.com',
    webClientId: '759317752188-q3mlq3uis4m6iu7bk8553pvv2bj45irn.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Ở đây bạn có thể gọi API Google để lấy thêm thông tin người dùng
      if (authentication) {
        console.log('Access Token:', authentication.accessToken);
        setUserInfo(authentication || "");
      }
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button 
        disabled={!request}
        title="Đăng nhập với Google"
        onPress={() => promptAsync()}
      />
      {userInfo && <Text>Đăng nhập thành công!</Text>}
    </View>
  );
}
