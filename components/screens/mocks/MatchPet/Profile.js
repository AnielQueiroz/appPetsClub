import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

function Profile() {
  const route = useRoute();
  const profile_username = route.params.profile_username;

  return <WebView style={{ flex: 1 }} source={{ uri: `https://www.twitter.com/${profile_username}` }} />
}

export default Profile;