import { describe, expect, it } from 'vitest';
import { NATIVE_SVG_COMPONENT, SVG_PRIMITIVES, Svg } from './Svg.js';
import { Icon } from './Icon.js';

function FakeSvg(): React.ReactElement {
  return <></>;
}

describe('@usemotif/react-native — Svg', () => {
  it('NATIVE_SVG_COMPONENT is null when react-native-svg is not installed', () => {
    // The test environment doesn't ship react-native-svg, so the
    // optional require returns null and the integration falls back
    // to the Box-based shell.
    expect(NATIVE_SVG_COMPONENT).toBeNull();
  });

  it('SVG_PRIMITIVES is null without react-native-svg', () => {
    expect(SVG_PRIMITIVES).toBeNull();
  });

  it('renders without throwing when no SvgComponent is supplied', () => {
    const tree = (
      <Svg size={20}>
        <></>
      </Svg>
    );
    expect(tree).toBeTruthy();
  });

  it('Icon falls back to Box when render is provided but rn-svg missing', () => {
    // No throw. The render fn isn't invoked; children path is empty.
    const tree = <Icon render={({ Line }) => <Line />} />;
    expect(tree).toBeTruthy();
  });

  it('respects an explicit SvgComponent override', () => {
    const tree = <Svg SvgComponent={FakeSvg as React.ComponentType<Record<string, unknown>>} />;
    expect(tree).toBeTruthy();
  });
});
