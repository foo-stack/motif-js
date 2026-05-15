import type { ReactNode } from 'react';
import { heroDemo } from './hero.js';
import { boxDemo } from './box.js';
import { stackDemo } from './stack.js';
import { hstackDemo } from './hstack.js';
import { vstackDemo } from './vstack.js';
import { containerDemo } from './container.js';
import { centerDemo } from './center.js';
import { flexDemo } from './flex.js';
import { gridDemo } from './grid.js';
import { wrapDemo } from './wrap.js';
import { zstackDemo } from './zstack.js';
import { aspectRatioDemo } from './aspect-ratio.js';
import { spacerDemo } from './spacer.js';
import { safeAreaDemo } from './safe-area.js';
import { textDemo } from './text.js';
import { headingDemo } from './heading.js';
import { paragraphDemo } from './paragraph.js';
import { blockquoteDemo } from './blockquote.js';
import { codeDemo } from './code.js';
import { kbdDemo } from './kbd.js';
import { inputDemo } from './input.js';
import { textareaDemo } from './textarea.js';
import { numberInputDemo } from './number-input.js';
import { passwordInputDemo } from './password-input.js';
import { labelDemo } from './label.js';
import { fieldDemo } from './field.js';
import { fieldHelpDemo } from './field-help.js';
import { fieldErrorDemo } from './field-error.js';
import { fieldsetDemo } from './fieldset.js';
import { avatarDemo } from './avatar.js';
import { iconDemo } from './icon.js';
import { imageDemo } from './image.js';
import { svgDemo } from './svg.js';
import { linkDemo } from './link.js';
import { pressableDemo } from './pressable.js';
import { buttonDemo } from './button.js';
import { iconButtonDemo } from './icon-button.js';
import { scrollViewDemo } from './scroll-view.js';
import { stickyDemo } from './sticky.js';
import { virtualListDemo } from './virtual-list.js';
import { focusScopeDemo } from './focus-scope.js';
import { liveRegionDemo } from './live-region.js';
import { visuallyHiddenDemo } from './visually-hidden.js';
import { showDemo } from './show.js';
import { hideDemo } from './hide.js';
import { overlayDemo } from './overlay.js';
import { portalDemo } from './portal.js';
import { dialogDemo } from './dialog.js';
import { alertDialogDemo } from './alert-dialog.js';
import { popoverDemo } from './popover.js';
import { hoverCardDemo } from './hover-card.js';
import { tooltipDemo } from './tooltip.js';
import { drawerDemo } from './drawer.js';
import { sheetDemo } from './sheet.js';
import { menuDemo } from './menu.js';
import { contextMenuDemo } from './context-menu.js';
import { navigationMenuDemo } from './navigation-menu.js';
import { commandPaletteDemo } from './command-palette.js';
import { accordionDemo } from './accordion.js';
import { collapsibleDemo } from './collapsible.js';
import { tabsDemo } from './tabs.js';
import { checkboxDemo } from './checkbox.js';
import { switchDemo } from './switch.js';
import { radioGroupDemo } from './radio-group.js';
import { comboboxDemo } from './combobox.js';
import { multiSelectDemo } from './multi-select.js';
import { searchDemo } from './search.js';
import { selectDemo } from './select.js';
import { calendarDemo } from './calendar.js';
import { datePickerDemo } from './date-picker.js';
import { timeInputDemo } from './time-input.js';
import { sliderDemo } from './slider.js';
import { rangeSliderDemo } from './range-slider.js';
import { progressDemo } from './progress.js';
import { ratingInputDemo } from './rating-input.js';
import { toastDemo } from './toast.js';
import { breadcrumbDemo } from './breadcrumb.js';
import { paginationDemo } from './pagination.js';
import { stepperDemo } from './stepper.js';
import { toolbarDemo } from './toolbar.js';
import { colorPickerDemo } from './color-picker.js';
import { fileUploadDemo } from './file-upload.js';
import { treeViewDemo } from './tree-view.js';

export type ControlValue = string | number | boolean;
export type ControlState = Readonly<Record<string, ControlValue>>;

export type ControlSpec =
  | { kind: 'color'; id: string; label: string; defaultValue: string }
  | {
      kind: 'range';
      id: string;
      label: string;
      defaultValue: number;
      min: number;
      max: number;
      step?: number;
    }
  | { kind: 'toggle'; id: string; label: string; defaultValue: boolean }
  | { kind: 'select'; id: string; label: string; defaultValue: string; options: readonly string[] };

export interface PlaygroundDemo {
  label: string;
  code: (state: ControlState) => string;
  preview: (state: ControlState) => ReactNode;
  controls?: readonly ControlSpec[];
}

export const playgroundDemos = {
  hero: heroDemo,
  box: boxDemo,
  stack: stackDemo,
  hstack: hstackDemo,
  vstack: vstackDemo,
  container: containerDemo,
  center: centerDemo,
  flex: flexDemo,
  grid: gridDemo,
  wrap: wrapDemo,
  zstack: zstackDemo,
  'aspect-ratio': aspectRatioDemo,
  spacer: spacerDemo,
  'safe-area': safeAreaDemo,
  text: textDemo,
  heading: headingDemo,
  paragraph: paragraphDemo,
  blockquote: blockquoteDemo,
  code: codeDemo,
  kbd: kbdDemo,
  input: inputDemo,
  textarea: textareaDemo,
  'number-input': numberInputDemo,
  'password-input': passwordInputDemo,
  label: labelDemo,
  field: fieldDemo,
  'field-help': fieldHelpDemo,
  'field-error': fieldErrorDemo,
  fieldset: fieldsetDemo,
  avatar: avatarDemo,
  icon: iconDemo,
  image: imageDemo,
  svg: svgDemo,
  link: linkDemo,
  pressable: pressableDemo,
  button: buttonDemo,
  'icon-button': iconButtonDemo,
  'scroll-view': scrollViewDemo,
  sticky: stickyDemo,
  'virtual-list': virtualListDemo,
  'focus-scope': focusScopeDemo,
  'live-region': liveRegionDemo,
  'visually-hidden': visuallyHiddenDemo,
  show: showDemo,
  hide: hideDemo,
  overlay: overlayDemo,
  portal: portalDemo,
  dialog: dialogDemo,
  'alert-dialog': alertDialogDemo,
  popover: popoverDemo,
  'hover-card': hoverCardDemo,
  tooltip: tooltipDemo,
  drawer: drawerDemo,
  sheet: sheetDemo,
  menu: menuDemo,
  'context-menu': contextMenuDemo,
  'navigation-menu': navigationMenuDemo,
  'command-palette': commandPaletteDemo,
  accordion: accordionDemo,
  collapsible: collapsibleDemo,
  tabs: tabsDemo,
  checkbox: checkboxDemo,
  switch: switchDemo,
  'radio-group': radioGroupDemo,
  combobox: comboboxDemo,
  'multi-select': multiSelectDemo,
  search: searchDemo,
  select: selectDemo,
  calendar: calendarDemo,
  'date-picker': datePickerDemo,
  'time-input': timeInputDemo,
  slider: sliderDemo,
  'range-slider': rangeSliderDemo,
  progress: progressDemo,
  'rating-input': ratingInputDemo,
  toast: toastDemo,
  breadcrumb: breadcrumbDemo,
  pagination: paginationDemo,
  stepper: stepperDemo,
  toolbar: toolbarDemo,
  'color-picker': colorPickerDemo,
  'file-upload': fileUploadDemo,
  'tree-view': treeViewDemo,
} satisfies Record<string, PlaygroundDemo>;

export type PlaygroundDemoName = keyof typeof playgroundDemos;
