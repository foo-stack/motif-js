import { DemoScreen } from '@usemotif/example-desktop-shared';

// The same shared component the web/Electron/Tauri targets render — here on the
// react-native bundle (react-native-macos / -windows). The bundler resolves
// `usemotif` to its native entry through motif's export conditions, so this
// file never branches on platform.
export function App(): React.ReactElement {
  return <DemoScreen />;
}

export default App;
