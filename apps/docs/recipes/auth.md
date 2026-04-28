# Auth flow

Sign-in, sign-up, and forgot-password screens with form validation,
loading states, and proper accessibility wiring.

## What we're building

Three screens that share a layout shell:

- **Sign-in** — email + password, "Forgot password?" link, "Don't
  have an account?" link to sign-up.
- **Sign-up** — email + password + confirm-password, basic strength
  indicator, link back to sign-in.
- **Forgot password** — single email field, success state confirms
  the reset email sent.

Each form uses motif's `Field` family for label / help / error wiring
and `useToast()` to surface server-side errors.

## Shell

A centred card on a muted background. Same shell for all three
screens — the content swaps via your router.

```tsx
import { Box, Heading, Stack, Text, VStack } from '@motif-js/react';
import type { ReactNode } from 'react';

export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box minH="100vh" bg="$colors.surface.muted" alignItems="center" justifyContent="center" p="$4">
      <VStack
        gap="$5"
        w="100%"
        maxW={400}
        p="$6"
        bg="$colors.surface.base"
        borderRadius="$lg"
        boxShadow="$md"
      >
        <Heading as="h1">{title}</Heading>
        {children}
      </VStack>
    </Box>
  );
}
```

## Sign-in

```tsx
import {
  Button,
  Field,
  FieldError,
  Input,
  Label,
  Link,
  PasswordInput,
  Stack,
  Text,
} from '@motif-js/react';
import { useToast } from '@motif-js/headless';
import { useState } from 'react';

interface SignInValues {
  email: string;
  password: string;
}

export function SignIn() {
  const { toast } = useToast();
  const [values, setValues] = useState<SignInValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<SignInValues>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(v: SignInValues): Partial<SignInValues> {
    const errs: Partial<SignInValues> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) errs.email = 'Enter a valid email';
    if (v.password.length < 8) errs.password = 'Password must be 8+ characters';
    return errs;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await api.signIn(values);
      router.push('/dashboard');
    } catch (err) {
      toast({ title: 'Sign-in failed', description: err.message, type: 'foreground' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Sign in">
      <form onSubmit={onSubmit} noValidate>
        <Stack gap="$4">
          <Field invalid={errors.email !== undefined}>
            <Label>Email</Label>
            <Input
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            {errors.email !== undefined && <FieldError>{errors.email}</FieldError>}
          </Field>
          <Field invalid={errors.password !== undefined}>
            <Label>Password</Label>
            <PasswordInput
              autoComplete="current-password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
            {errors.password !== undefined && <FieldError>{errors.password}</FieldError>}
          </Field>
          <Link href="/forgot-password" fontSize="$sm" color="$colors.brand.500">
            Forgot password?
          </Link>
          <Button type="submit" loading={submitting} loadingLabel="Signing in…">
            Sign in
          </Button>
          <Text fontSize="$sm" color="$colors.text.muted">
            Don't have an account? <Link href="/sign-up">Sign up</Link>
          </Text>
        </Stack>
      </form>
    </AuthShell>
  );
}
```

### What this hits

- **`Field` + `FieldError`** — when `invalid` is true on the Field,
  the FieldError renders, the input gets `aria-invalid="true"`,
  `aria-describedby` points at the error message id. Screen readers
  announce errors when the input gains focus.
- **`autoComplete`** — `'email'` and `'current-password'` opt the
  browser into autofill + password-manager integration.
- **`noValidate`** — disables the browser's native HTML5 validation
  so motif's typed messages own the UX. Validation runs on submit
  via the `validate()` function.
- **Loading state** — `loading={submitting}` swaps the button label
  to `loadingLabel` while in flight, sets `aria-busy="true"`, and
  blocks click events.
- **Toast on failure** — `useToast` from `@motif-js/headless`. The
  `'foreground'` type announces with `aria-live="assertive"` since
  errors require immediate attention.

## Sign-up

Mostly the same shape, with confirm-password and a strength meter.

```tsx
export function SignUp() {
  const { toast } = useToast();
  const [values, setValues] = useState({ email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<typeof values>>({});
  const [submitting, setSubmitting] = useState(false);

  const strength = scorePassword(values.password); // 0..4

  function validate(): Partial<typeof values> {
    const errs: Partial<typeof values> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errs.email = 'Enter a valid email';
    if (values.password.length < 8) errs.password = 'Password must be 8+ characters';
    if (values.confirm !== values.password) errs.confirm = 'Passwords do not match';
    return errs;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    try {
      await api.signUp(values);
      toast({ title: 'Welcome!', description: 'Check your email to verify.' });
      router.push('/dashboard');
    } catch (err) {
      toast({ title: 'Sign-up failed', description: err.message, type: 'foreground' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Create account">
      <form onSubmit={onSubmit} noValidate>
        <Stack gap="$4">
          <Field invalid={errors.email !== undefined}>
            <Label>Email</Label>
            <Input
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            {errors.email !== undefined && <FieldError>{errors.email}</FieldError>}
          </Field>
          <Field invalid={errors.password !== undefined}>
            <Label>Password</Label>
            <PasswordInput
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
            />
            <PasswordStrength score={strength} />
            {errors.password !== undefined && <FieldError>{errors.password}</FieldError>}
          </Field>
          <Field invalid={errors.confirm !== undefined}>
            <Label>Confirm password</Label>
            <PasswordInput
              autoComplete="new-password"
              value={values.confirm}
              onChange={(e) => setValues({ ...values, confirm: e.target.value })}
            />
            {errors.confirm !== undefined && <FieldError>{errors.confirm}</FieldError>}
          </Field>
          <Button type="submit" loading={submitting} loadingLabel="Creating…">
            Create account
          </Button>
          <Text fontSize="$sm" color="$colors.text.muted">
            Already have one? <Link href="/sign-in">Sign in</Link>
          </Text>
        </Stack>
      </form>
    </AuthShell>
  );
}

function PasswordStrength({ score }: { score: number }) {
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    '$colors.danger.500',
    '$colors.danger.400',
    '$colors.warning.500',
    '$colors.success.400',
    '$colors.success.500',
  ];
  return (
    <HStack gap="$2" alignItems="center" mt="$1">
      <Box flex={1} h={4} bg="$colors.gray.200" borderRadius="$full" overflow="hidden">
        <Box w={`${(score / 4) * 100}%`} h="100%" bg={colors[score] ?? colors[0]} />
      </Box>
      <Text fontSize="$xs" color="$colors.text.muted">
        {labels[score]}
      </Text>
    </HStack>
  );
}
```

`scorePassword` is a stand-in — drop in zxcvbn or a similar library
for real strength scoring.

## Forgot password

Simple single-field form; on success, swap to a confirmation state
instead of resetting the form.

```tsx
export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setError(undefined);
    setSubmitting(true);
    try {
      await api.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <AuthShell title="Check your email">
        <Text>
          We sent a reset link to <Text fontWeight="$semibold">{email}</Text>. The link expires in 1
          hour.
        </Text>
        <Link href="/sign-in" mt="$2">
          Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Forgot password">
      <form onSubmit={onSubmit} noValidate>
        <Stack gap="$4">
          <Text color="$colors.text.muted">Enter your email and we'll send you a reset link.</Text>
          <Field invalid={error !== undefined}>
            <Label>Email</Label>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error !== undefined && <FieldError>{error}</FieldError>}
          </Field>
          <Button type="submit" loading={submitting} loadingLabel="Sending…">
            Send reset link
          </Button>
          <Link href="/sign-in" fontSize="$sm">
            Back to sign in
          </Link>
        </Stack>
      </form>
    </AuthShell>
  );
}
```

## Cross-platform notes

These screens work on RN with two changes:

1. Replace `<form onSubmit={...}>` with a Pressable-driven submit
   handler — there's no `<form>` on RN.
2. Swap `router.push('/dashboard')` for your RN navigator's API
   (e.g. `navigation.replace('Dashboard')`).

Everything else — `Field`, `Input`, `PasswordInput`, `Button`, the
toast — works without modification.

## See also

- [Forms (primitive)](../primitives/forms) — `Field`, `Label`,
  `FieldError`, `Input`, `PasswordInput`.
- [Toast (headless)](../headless/toast) — error notifications.
- [Settings recipe](./settings) — when the user is signed in.
