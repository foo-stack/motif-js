import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Bare-RN entry point. No Expo runtime — register directly with RN's
// AppRegistry so the iOS / Android native shells can pick up the JS
// component by name.
AppRegistry.registerComponent(appName, () => App);
