import type { Meta, StoryObj } from '@storybook/react';
import { Box, HStack, Text, VStack, useAnimate } from 'usemotif';
import { Note, Tile } from '../../harness/demo.js';

/**
 * `useAnimate()` returns `[scope, animate]` for imperative animations. Attach
 * `scope` (a `RefObject`) to a parent element; `animate(target, keyframes,
 * options?)` drives an animation against either the scope root itself or a CSS
 * selector resolved WITHIN the scope. Durations / delays are in seconds.
 *
 *   const [scope, animate] = useAnimate();
 *   await animate(scope, { opacity: 1 }, { duration: 0.3 }).finished;
 *   await animate('.row', { x: 100 }, { duration: 0.4, delay: 0.1 }).finished;
 *   <Box ref={scope}>{rows.map(r => <Box className="row" />)}</Box>
 *
 * On web it runs the Web Animations API under the hood; `controls.finished`
 * resolves when the animation settles so sequences can be `await`ed.
 */
const meta = {
  title: 'Motion/useAnimate',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

const RN_NOTE =
  'Heads up: this runs the Web Animations API on the JS host under react-native-web here; true UI-thread performance (Reanimated / Gesture Handler) is verified on-device.';

/**
 * Animate the scope root itself. The button fires a single keyframe bag - the
 * runtime animates from the element's current computed style to the target.
 */
function AnimateScope() {
  const [scope, animate] = useAnimate();

  const run = () => {
    animate(
      scope,
      { transform: 'rotate(360deg) scale(1.2)' },
      { duration: 0.6, easing: 'ease-in-out' },
    );
  };
  const reset = () => {
    animate(scope, { transform: 'rotate(0deg) scale(1)' }, { duration: 0.3 });
  };

  return (
    <VStack gap="$4">
      <Note>{RN_NOTE}</Note>
      <Note>`animate(scope, keyframes, opts)` targets the scoped root element.</Note>
      <Box ref={scope} w={96} h={96}>
        <Tile tone="success">scope</Tile>
      </Box>
      <HStack gap="$3">
        <button onClick={run}>Spin + grow</button>
        <button onClick={reset}>Reset</button>
      </HStack>
    </VStack>
  );
}

export const ScopeRoot: Story = {
  name: 'Animate scope root',
  parameters: {
    docs: {
      source: {
        code: `const [scope, animate] = useAnimate();
const run = () => animate(scope, { transform: 'rotate(360deg) scale(1.2)' }, { duration: 0.6 });
<Box ref={scope}><Tile>scope</Tile></Box>
<button onClick={run}>Spin + grow</button>`,
      },
    },
  },
  render: () => <AnimateScope />,
};

/**
 * Selector targets resolve via `scope.querySelectorAll(selector)` inside the
 * scope. Here one call animates every `.dot` in parallel; `controls.finished`
 * resolves when the last one settles.
 */
function AnimateSelector() {
  const [scope, animate] = useAnimate();

  const run = () => {
    animate('.dot', { transform: 'translateY(-32px)', opacity: 0.4 }, { duration: 0.35 });
  };
  const reset = () => {
    animate('.dot', { transform: 'translateY(0px)', opacity: 1 }, { duration: 0.35 });
  };

  return (
    <VStack gap="$4">
      <Note>{RN_NOTE}</Note>
      <Note>
        `animate('.dot', ...)` resolves every match inside the scope and runs them in parallel.
      </Note>
      <HStack ref={scope} gap="$3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Box key={i} className="dot">
            <Tile>{i}</Tile>
          </Box>
        ))}
      </HStack>
      <HStack gap="$3">
        <button onClick={run}>Lift dots</button>
        <button onClick={reset}>Reset</button>
      </HStack>
    </VStack>
  );
}

export const SelectorTargets: Story = {
  name: 'Selector targets',
  parameters: {
    docs: {
      source: {
        code: `const [scope, animate] = useAnimate();
const run = () => animate('.dot', { transform: 'translateY(-32px)', opacity: 0.4 }, { duration: 0.35 });
<HStack ref={scope}>{dots.map(i => <Box key={i} className="dot" />)}</HStack>`,
      },
    },
  },
  render: () => <AnimateSelector />,
};

/**
 * Awaited sequence. Each `animate(...).finished` is a promise that resolves
 * when that step settles, so steps run one after another - a keyframe
 * sequence built from `await`s.
 */
function AnimateSequence() {
  const [scope, animate] = useAnimate();

  const run = async () => {
    // Reset, then run three steps back to back.
    await animate(
      scope,
      { transform: 'translateX(0px) rotate(0deg)', opacity: 1 },
      { duration: 0.01 },
    ).finished;
    await animate(scope, { transform: 'translateX(200px)' }, { duration: 0.4 }).finished;
    await animate(scope, { transform: 'translateX(200px) rotate(180deg)' }, { duration: 0.4 })
      .finished;
    await animate(
      scope,
      { transform: 'translateX(0px) rotate(0deg)' },
      { duration: 0.5, easing: 'ease-out' },
    ).finished;
  };

  return (
    <VStack gap="$4">
      <Note>{RN_NOTE}</Note>
      <Note>`await animate(...).finished` chains steps into a sequence.</Note>
      <Box
        bg="$colors.surface.muted"
        p="$4"
        borderRadius="$md"
        w={320}
        h={96}
        display="flex"
        alignItems="center"
      >
        <Box ref={scope} w={64} h={64}>
          <Tile>seq</Tile>
        </Box>
      </Box>
      <Text fontSize="$sm" color="$colors.text.muted">
        slide → rotate → return, each step awaiting the previous
      </Text>
      <HStack gap="$3">
        <button onClick={run}>Run sequence</button>
      </HStack>
    </VStack>
  );
}

export const Sequence: Story = {
  name: 'Awaited sequence',
  parameters: {
    docs: {
      source: {
        code: `const [scope, animate] = useAnimate();
const run = async () => {
  await animate(scope, { transform: 'translateX(200px)' }, { duration: 0.4 }).finished;
  await animate(scope, { transform: 'translateX(200px) rotate(180deg)' }, { duration: 0.4 }).finished;
  await animate(scope, { transform: 'translateX(0px) rotate(0deg)' }, { duration: 0.5 }).finished;
};
<Box ref={scope}><Tile>seq</Tile></Box>`,
      },
    },
  },
  render: () => <AnimateSequence />,
};
