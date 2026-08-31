/**
 * @usemotif/headless - accessible behavior components for motif-js.
 *
 * Headless: behaviour + a11y wiring, no styling. Each component
 * exposes a small surface (Root / Trigger / Content / etc.) that
 * composes the visual primitives from `@usemotif/react`. Build
 * fully-styled components on top of these in your app.
 *
 * **This barrel deliberately carries no `'use client'` directive.** The
 * components live in `./client.js`, which does; this module re-exports them,
 * so each name arrives here already a client reference. That is what lets a
 * Server Component import from this package at all.
 *
 * It also lets a compound component cross the boundary. A client reference is
 * a proxy that exposes named exports and nothing else, so reaching *through*
 * one - `Dialog.Root` where `Dialog` is an object the client module exported -
 * yields `undefined` and the render dies. Assembling the namespace here
 * instead, out of parts the client module exports flat, gives an object whose
 * every property is itself a client reference: a valid element type on either
 * side of the boundary.
 */

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from './client.js';

/**
 * Built here, in the server graph, out of six client references. An object
 * exported from the client chunk would arrive as a proxy, and `Dialog.Root`
 * would read a property that does not exist on it.
 */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

export {
  Accordion,
  Adapt,
  AlertDialog,
  Breadcrumb,
  Calendar,
  Checkbox,
  Collapsible,
  ColorPicker,
  Combobox,
  CommandPalette,
  configureViewportBreakpoints,
  ContextMenu,
  DatePicker,
  defaultFuzzyMatch,
  Drawer,
  FileUpload,
  HoverCard,
  Menu,
  MultiSelect,
  NavigationMenu,
  PACKAGE_NAME,
  Pagination,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  RangeSlider,
  RatingInput,
  Search,
  Select,
  Sheet,
  Slider,
  Stepper,
  Switch,
  Tabs,
  TimeInput,
  Toast,
  Toaster,
  Toolbar,
  Tooltip,
  TreeView,
  useCommandPaletteShortcut,
  useDialogState,
  useReducedMotion,
  useToast,
} from './client.js';

export type {
  AccordionItemProps,
  AccordionRootProps,
  AdaptProps,
  BreadcrumbProps,
  CalendarProps,
  CheckboxProps,
  CollapsibleRootProps,
  ColorPickerProps,
  ComboboxOption,
  ComboboxRootProps,
  Command,
  CommandPaletteListProps,
  CommandPaletteRootProps,
  ContextMenuContentProps,
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  DatePickerProps,
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
  DrawerContentProps,
  FileUploadProps,
  HoverCardContentProps,
  HoverCardRootProps,
  HoverCardTriggerProps,
  MenuContentProps,
  MenuItemProps,
  MenuRootProps,
  MenuTriggerProps,
  MultiSelectRootProps,
  NavigationMenuItem,
  NavigationMenuProps,
  PaginationProps,
  Placement,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverRootProps,
  PopoverTriggerProps,
  ProgressProps,
  RadioGroupProps,
  RadioProps,
  RangeSliderProps,
  RatingInputProps,
  SelectRootProps,
  SliderProps,
  StepperProps,
  StepperStep,
  SwitchProps,
  TabsPanelProps,
  TabsRootProps,
  TabsTabProps,
  TimeInputProps,
  ToasterProps,
  ToastItem,
  ToolbarProps,
  TooltipContentProps,
  TooltipRootProps,
  TooltipTriggerProps,
  TreeNode,
  TreeViewProps,
} from './client.js';
