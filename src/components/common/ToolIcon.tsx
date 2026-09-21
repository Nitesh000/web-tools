import {
  Eraser,
  FileArchive,
  RefreshCw,
  Film,
  QrCode,
  KeyRound,
  CaseSensitive,
  Palette,
  Braces,
  Receipt,
  ListTree,
  SquarePen,
  FileImage,
  Images,
  ShieldCheck,
  Gift,
  Zap,
  Ban,
  Smartphone,
  Infinity as InfinityIcon,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  eraser: Eraser,
  'file-archive': FileArchive,
  'refresh-cw': RefreshCw,
  film: Film,
  'qr-code': QrCode,
  'key-round': KeyRound,
  'case-sensitive': CaseSensitive,
  palette: Palette,
  braces: Braces,
  receipt: Receipt,
  'list-tree': ListTree,
  'square-pen': SquarePen,
  'file-image': FileImage,
  images: Images,
  'shield-check': ShieldCheck,
  gift: Gift,
  zap: Zap,
  ban: Ban,
  smartphone: Smartphone,
  infinity: InfinityIcon,
};

export interface AppIconProps {
  name: string;
  className?: string;
}

export function AppIcon({ name, className }: AppIconProps) {
  const Icon = ICON_MAP[name] ?? Wrench;
  return <Icon className={className} aria-hidden="true" />;
}

export default AppIcon;
