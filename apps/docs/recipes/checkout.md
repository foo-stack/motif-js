# E-commerce checkout

Cart → shipping → payment → confirmation flow. Each step has its own
panel; a Stepper at the top tracks progress; back / next buttons walk
the user through.

## Step state

A small reducer-driven state machine ties the steps together. Lifting
state to the parent makes it easy to skip / revisit steps without
losing user input.

```tsx
import { useState } from 'react';

type Step = 'cart' | 'shipping' | 'payment' | 'confirm';

interface CheckoutState {
  step: Step;
  cart: CartItem[];
  shipping: ShippingAddress;
  payment: PaymentDetails;
  totals: Totals;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}
interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}
interface PaymentDetails {
  card: string;
  expiry: string;
  cvc: string;
  name: string;
}
interface Totals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const STEPS: { id: Step; label: string }[] = [
  { id: 'cart', label: 'Cart' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirm', label: 'Confirm' },
];
```

## Shell — Stepper + content

```tsx
import { Box, Heading, HStack, Stack, Text, VStack } from '@motif-js/react';
import { Stepper } from '@motif-js/headless';

export function CheckoutPage() {
  const [state, setState] = useState<CheckoutState>(() => ({
    step: 'cart',
    cart: initialCart,
    shipping: { name: '', address: '', city: '', zip: '', country: 'US' },
    payment: { card: '', expiry: '', cvc: '', name: '' },
    totals: computeTotals(initialCart),
  }));

  function goto(next: Step) {
    setState((s) => ({ ...s, step: next }));
  }

  return (
    <Box maxW={900} mx="auto" p={{ base: '$4', md: '$6' }}>
      <Heading as="h1" mb="$6">
        Checkout
      </Heading>

      <Stepper
        steps={STEPS}
        current={state.step}
        renderStep={({ step, status, isLast }) => (
          <HStack gap="$2" alignItems="center" flex={1}>
            <Box
              w={28}
              h={28}
              borderRadius="$full"
              alignItems="center"
              justifyContent="center"
              bg={
                status === 'complete' || status === 'active'
                  ? '$colors.brand.500'
                  : '$colors.gray.200'
              }
            >
              <Text
                color={
                  status === 'complete' || status === 'active' ? 'white' : '$colors.text.muted'
                }
              >
                {status === 'complete' ? '✓' : STEPS.findIndex((s) => s.id === step.id) + 1}
              </Text>
            </Box>
            <Text fontWeight={status === 'active' ? '$semibold' : '$normal'}>{step.label}</Text>
            {!isLast && <Box flex={1} h={1} bg="$colors.gray.300" mx="$2" />}
          </HStack>
        )}
      />

      <Box mt="$6">
        {state.step === 'cart' && (
          <CartStep state={state} setState={setState} onNext={() => goto('shipping')} />
        )}
        {state.step === 'shipping' && (
          <ShippingStep
            state={state}
            setState={setState}
            onBack={() => goto('cart')}
            onNext={() => goto('payment')}
          />
        )}
        {state.step === 'payment' && (
          <PaymentStep
            state={state}
            setState={setState}
            onBack={() => goto('shipping')}
            onNext={() => goto('confirm')}
          />
        )}
        {state.step === 'confirm' && <ConfirmStep state={state} onBack={() => goto('payment')} />}
      </Box>
    </Box>
  );
}
```

## Cart step

Line-item editor with qty steppers + a totals panel.

```tsx
import { Image, IconButton, NumberInput, Spacer } from '@motif-js/react';
import { Trash } from '@motif-js/icons';

function CartStep({
  state,
  setState,
  onNext,
}: {
  state: CheckoutState;
  setState: React.Dispatch<React.SetStateAction<CheckoutState>>;
  onNext: () => void;
}) {
  function updateQty(id: string, qty: number) {
    setState((s) => {
      const next = s.cart.map((it) => (it.id === id ? { ...it, qty } : it));
      return { ...s, cart: next, totals: computeTotals(next) };
    });
  }
  function remove(id: string) {
    setState((s) => {
      const next = s.cart.filter((it) => it.id !== id);
      return { ...s, cart: next, totals: computeTotals(next) };
    });
  }

  return (
    <VStack gap="$5" alignItems="stretch">
      <VStack gap="$3" alignItems="stretch">
        {state.cart.map((item) => (
          <HStack
            key={item.id}
            gap="$3"
            alignItems="center"
            p="$3"
            bg="$colors.surface.base"
            borderRadius="$md"
          >
            <Image src={item.image} alt={item.name} w={64} h={64} borderRadius="$md" />
            <VStack gap="$1" flex={1}>
              <Text fontWeight="$semibold">{item.name}</Text>
              <Text color="$colors.text.muted">${item.price.toFixed(2)}</Text>
            </VStack>
            <NumberInput
              value={item.qty}
              onValueChange={(n) => updateQty(item.id, n)}
              min={1}
              max={99}
              w={100}
            />
            <IconButton
              aria-label={`Remove ${item.name}`}
              icon={<Trash />}
              variant="ghost"
              intent="danger"
              onPress={() => remove(item.id)}
            />
          </HStack>
        ))}
      </VStack>

      <TotalsPanel totals={state.totals} />

      <HStack justifyContent="space-between">
        <Link href="/products">← Continue shopping</Link>
        <Button onPress={onNext} disabled={state.cart.length === 0}>
          Continue to shipping
        </Button>
      </HStack>
    </VStack>
  );
}

function TotalsPanel({ totals }: { totals: Totals }) {
  return (
    <Box
      p="$4"
      bg="$colors.surface.base"
      borderRadius="$md"
      borderWidth={1}
      borderColor="$colors.border.subtle"
    >
      <VStack gap="$2">
        <HStack justifyContent="space-between">
          <Text>Subtotal</Text>
          <Text>${totals.subtotal.toFixed(2)}</Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text>Shipping</Text>
          <Text>{totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}</Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text>Tax (estimated)</Text>
          <Text>${totals.tax.toFixed(2)}</Text>
        </HStack>
        <Box h={1} bg="$colors.border.subtle" my="$1" />
        <HStack justifyContent="space-between">
          <Text fontWeight="$semibold">Total</Text>
          <Text fontWeight="$semibold">${totals.total.toFixed(2)}</Text>
        </HStack>
      </VStack>
    </Box>
  );
}
```

## Shipping step

Form + per-field validation. The `Field` family wires errors to
`aria-invalid` + `aria-describedby` automatically.

```tsx
import { Field, FieldError, Grid, Input, Label } from '@motif-js/react';
import { Select } from '@motif-js/headless';

function ShippingStep({
  state,
  setState,
  onBack,
  onNext,
}: {
  state: CheckoutState;
  setState: React.Dispatch<React.SetStateAction<CheckoutState>>;
  onBack: () => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  function validate(): Partial<ShippingAddress> {
    const errs: Partial<ShippingAddress> = {};
    const a = state.shipping;
    if (!a.name) errs.name = 'Required';
    if (!a.address) errs.address = 'Required';
    if (!a.city) errs.city = 'Required';
    if (!/^\d{5}(-\d{4})?$/.test(a.zip)) errs.zip = 'Enter a valid ZIP';
    return errs;
  }

  function set<K extends keyof ShippingAddress>(key: K, value: ShippingAddress[K]) {
    setState((s) => ({ ...s, shipping: { ...s.shipping, [key]: value } }));
  }

  function onSubmit() {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
  }

  return (
    <VStack gap="$5" alignItems="stretch">
      <Stack gap="$4">
        <Field invalid={errors.name !== undefined}>
          <Label>Full name</Label>
          <Input value={state.shipping.name} onChange={(e) => set('name', e.target.value)} />
          {errors.name !== undefined && <FieldError>{errors.name}</FieldError>}
        </Field>
        <Field invalid={errors.address !== undefined}>
          <Label>Address</Label>
          <Input value={state.shipping.address} onChange={(e) => set('address', e.target.value)} />
          {errors.address !== undefined && <FieldError>{errors.address}</FieldError>}
        </Field>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap="$3">
          <Field invalid={errors.city !== undefined}>
            <Label>City</Label>
            <Input value={state.shipping.city} onChange={(e) => set('city', e.target.value)} />
            {errors.city !== undefined && <FieldError>{errors.city}</FieldError>}
          </Field>
          <Field invalid={errors.zip !== undefined}>
            <Label>ZIP</Label>
            <Input value={state.shipping.zip} onChange={(e) => set('zip', e.target.value)} />
            {errors.zip !== undefined && <FieldError>{errors.zip}</FieldError>}
          </Field>
        </Grid>
        <Field>
          <Label>Country</Label>
          <Select.Root
            options={countries.map((c) => ({ value: c.code, label: c.name }))}
            value={state.shipping.country}
            onValueChange={(v) => set('country', v as string)}
          >
            <Select.Trigger>
              <Button variant="outline">
                {countries.find((c) => c.code === state.shipping.country)?.name}
              </Button>
            </Select.Trigger>
            <Select.List />
          </Select.Root>
        </Field>
      </Stack>

      <HStack justifyContent="space-between">
        <Button variant="ghost" onPress={onBack}>
          ← Back to cart
        </Button>
        <Button onPress={onSubmit}>Continue to payment</Button>
      </HStack>
    </VStack>
  );
}
```

## Payment step

Card details form. Real apps replace this with Stripe Elements / a
similar tokenisation library — the motif primitives just provide the
form scaffolding.

```tsx
function PaymentStep({
  state,
  setState,
  onBack,
  onNext,
}: {
  state: CheckoutState;
  setState: React.Dispatch<React.SetStateAction<CheckoutState>>;
  onBack: () => void;
  onNext: () => void;
}) {
  function set<K extends keyof PaymentDetails>(key: K, value: PaymentDetails[K]) {
    setState((s) => ({ ...s, payment: { ...s.payment, [key]: value } }));
  }

  return (
    <VStack gap="$5" alignItems="stretch">
      <Stack gap="$4">
        <Field>
          <Label>Card number</Label>
          <Input
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            value={state.payment.card}
            onChange={(e) => set('card', e.target.value)}
          />
        </Field>
        <Grid templateColumns="1fr 1fr" gap="$3">
          <Field>
            <Label>Expiry</Label>
            <Input
              placeholder="MM / YY"
              value={state.payment.expiry}
              onChange={(e) => set('expiry', e.target.value)}
            />
          </Field>
          <Field>
            <Label>CVC</Label>
            <Input
              inputMode="numeric"
              maxLength={4}
              value={state.payment.cvc}
              onChange={(e) => set('cvc', e.target.value)}
            />
          </Field>
        </Grid>
        <Field>
          <Label>Cardholder name</Label>
          <Input value={state.payment.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
      </Stack>

      <HStack justifyContent="space-between">
        <Button variant="ghost" onPress={onBack}>
          ← Back to shipping
        </Button>
        <Button onPress={onNext}>Review order</Button>
      </HStack>
    </VStack>
  );
}
```

## Confirm step

Summary of cart + shipping + payment + the final pay button.

```tsx
function ConfirmStep({ state, onBack }: { state: CheckoutState; onBack: () => void }) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      const order = await api.placeOrder(state);
      router.push(`/orders/${order.id}`);
    } catch (err) {
      toast({ title: 'Payment failed', description: err.message, type: 'foreground' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <VStack gap="$5" alignItems="stretch">
      <SummaryRow title="Items">
        {state.cart.map((item) => (
          <HStack key={item.id} justifyContent="space-between" alignItems="center" py="$1">
            <Text>
              {item.qty} × {item.name}
            </Text>
            <Text>${(item.price * item.qty).toFixed(2)}</Text>
          </HStack>
        ))}
      </SummaryRow>
      <SummaryRow title="Shipping">
        <Text>{state.shipping.name}</Text>
        <Text color="$colors.text.muted">{state.shipping.address}</Text>
        <Text color="$colors.text.muted">
          {state.shipping.city}, {state.shipping.zip}, {state.shipping.country}
        </Text>
      </SummaryRow>
      <SummaryRow title="Payment">
        <Text>•••• •••• •••• {state.payment.card.slice(-4)}</Text>
      </SummaryRow>

      <TotalsPanel totals={state.totals} />

      <HStack justifyContent="space-between">
        <Button variant="ghost" onPress={onBack}>
          ← Back to payment
        </Button>
        <Button intent="success" onPress={submit} loading={submitting} loadingLabel="Charging…">
          Pay ${state.totals.total.toFixed(2)}
        </Button>
      </HStack>
    </VStack>
  );
}

function SummaryRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box p="$4" bg="$colors.surface.base" borderRadius="$md">
      <Text fontWeight="$semibold" mb="$2">
        {title}
      </Text>
      <VStack gap="$1">{children}</VStack>
    </Box>
  );
}
```

## Patterns to lift

- **Lift state to the page level** — each step is a presentation
  component that receives `state` + `setState`. Going back doesn't
  lose work.
- **Per-step validation** — only the current step is validated on
  Next click; later steps' fields are ignored until you reach them.
- **Stepper as progress indicator** — `motif-js/headless`'s Stepper
  is render-prop. The visual is yours; the status / index / labels
  come from props.
- **AlertDialog NOT used here** — checkout doesn't need destructive
  confirmations; the explicit "Pay $X" button is the action commit.
  A real app might add a "Place order — this will charge your card"
  confirmation, but the back / forward flow is enough.

## Cross-platform notes

The flow translates directly to RN. Replace `<Grid>` with `<HStack>`
on RN where the fields side-by-side; everything else is identical.

## See also

- [Stepper (headless)](../headless/navigation) — progress indicator.
- [Forms (primitive)](../primitives/forms) — `Field`, `Input`,
  `NumberInput`.
- [Toast (headless)](../headless/toast) — payment failure surface.
