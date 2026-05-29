import {
  Wallet,
  Home,
  TrendingUp,
  Lightbulb,
  Package,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  wallet: Wallet,
  home: Home,
  'trending-up': TrendingUp,
  lightbulb: Lightbulb,
  package: Package
};

interface IconMapperProps {
  name: string;
  className?: string;
}

export const IconMapper = ({ name, className }: IconMapperProps) => {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className={className} />;
};
