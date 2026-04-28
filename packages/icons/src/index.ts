/**
 * @motif-js/icons — pre-built icons over `<Icon>` from `@motif-js/react`.
 *
 * 81 glyphs across navigation, actions, communication, media,
 * users, status, files, editing, visibility, time, and misc
 * (commerce / device / branding). Each glyph is a small React
 * component that returns an `<Icon>` with the appropriate
 * `<path>` / `<line>` / `<circle>` / `<polygon>` / `<polyline>`
 * children. Sizes / colour are inherited from the parent's font-
 * size + colour (the SVGs use `currentColor`).
 *
 * Path data adapted from Lucide / Feather Icons (MIT) — same 24×24
 * stroke style across the set so glyphs combine consistently.
 *
 * For glyphs not in this set, drop down to `<Icon>` directly and
 * pass your own `render` callback — that's the same API the
 * pre-built glyphs use.
 */

export const PACKAGE_NAME = '@motif-js/icons';

// ─── Navigation ────────────────────────────────────────────────────
export { ArrowDown } from './glyphs/ArrowDown.js';
export { ArrowLeft } from './glyphs/ArrowLeft.js';
export { ArrowRight } from './glyphs/ArrowRight.js';
export { ArrowUp } from './glyphs/ArrowUp.js';
export { ChevronDown } from './glyphs/ChevronDown.js';
export { ChevronLeft } from './glyphs/ChevronLeft.js';
export { ChevronRight } from './glyphs/ChevronRight.js';
export { ChevronUp } from './glyphs/ChevronUp.js';
export { Menu } from './glyphs/Menu.js';
export { MoreHorizontal } from './glyphs/MoreHorizontal.js';
export { MoreVertical } from './glyphs/MoreVertical.js';

// ─── Actions ───────────────────────────────────────────────────────
export { Check } from './glyphs/Check.js';
export { Copy } from './glyphs/Copy.js';
export { Download } from './glyphs/Download.js';
export { Edit } from './glyphs/Edit.js';
export { ExternalLink } from './glyphs/ExternalLink.js';
export { Filter } from './glyphs/Filter.js';
export { Link } from './glyphs/Link.js';
export { Plus } from './glyphs/Plus.js';
export { RefreshCcw } from './glyphs/RefreshCcw.js';
export { Save } from './glyphs/Save.js';
export { Search } from './glyphs/Search.js';
export { Settings } from './glyphs/Settings.js';
export { Share } from './glyphs/Share.js';
export { Trash } from './glyphs/Trash.js';
export { Upload } from './glyphs/Upload.js';
export { X } from './glyphs/X.js';

// ─── Communication ─────────────────────────────────────────────────
export { Bell } from './glyphs/Bell.js';
export { Mail } from './glyphs/Mail.js';
export { MessageCircle } from './glyphs/MessageCircle.js';
export { Phone } from './glyphs/Phone.js';
export { Send } from './glyphs/Send.js';

// ─── Media ─────────────────────────────────────────────────────────
export { Camera } from './glyphs/Camera.js';
export { Pause } from './glyphs/Pause.js';
export { Play } from './glyphs/Play.js';
export { SkipBack } from './glyphs/SkipBack.js';
export { SkipForward } from './glyphs/SkipForward.js';
export { Volume2 } from './glyphs/Volume2.js';
export { VolumeX } from './glyphs/VolumeX.js';

// ─── User ──────────────────────────────────────────────────────────
export { LogIn } from './glyphs/LogIn.js';
export { LogOut } from './glyphs/LogOut.js';
export { User } from './glyphs/User.js';
export { UserPlus } from './glyphs/UserPlus.js';
export { Users } from './glyphs/Users.js';

// ─── Status ────────────────────────────────────────────────────────
export { AlertCircle } from './glyphs/AlertCircle.js';
export { AlertTriangle } from './glyphs/AlertTriangle.js';
export { CheckCircle } from './glyphs/CheckCircle.js';
export { HelpCircle } from './glyphs/HelpCircle.js';
export { Info } from './glyphs/Info.js';
export { XCircle } from './glyphs/XCircle.js';

// ─── File / Folder ─────────────────────────────────────────────────
export { File } from './glyphs/File.js';
export { Folder } from './glyphs/Folder.js';
export { Image } from './glyphs/Image.js';
export { Paperclip } from './glyphs/Paperclip.js';

// ─── Editing ───────────────────────────────────────────────────────
export { AlignCenter } from './glyphs/AlignCenter.js';
export { AlignLeft } from './glyphs/AlignLeft.js';
export { AlignRight } from './glyphs/AlignRight.js';
export { Bold } from './glyphs/Bold.js';
export { Italic } from './glyphs/Italic.js';
export { List } from './glyphs/List.js';
export { Underline } from './glyphs/Underline.js';

// ─── Visibility ────────────────────────────────────────────────────
export { Eye } from './glyphs/Eye.js';
export { EyeOff } from './glyphs/EyeOff.js';
export { Lock } from './glyphs/Lock.js';
export { Unlock } from './glyphs/Unlock.js';

// ─── Time ──────────────────────────────────────────────────────────
export { Calendar } from './glyphs/Calendar.js';
export { Clock } from './glyphs/Clock.js';

// ─── Misc ──────────────────────────────────────────────────────────
export { Bookmark } from './glyphs/Bookmark.js';
export { Code } from './glyphs/Code.js';
export { CreditCard } from './glyphs/CreditCard.js';
export { Github } from './glyphs/Github.js';
export { Globe } from './glyphs/Globe.js';
export { Heart } from './glyphs/Heart.js';
export { Home } from './glyphs/Home.js';
export { MapPin } from './glyphs/MapPin.js';
export { Moon } from './glyphs/Moon.js';
export { ShoppingCart } from './glyphs/ShoppingCart.js';
export { Star } from './glyphs/Star.js';
export { Sun } from './glyphs/Sun.js';
export { Tag } from './glyphs/Tag.js';
export { Terminal } from './glyphs/Terminal.js';

export type { IconProps } from '@motif-js/react';
