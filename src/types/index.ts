export type AssetCategory = 
  | 'current' 
  | 'fixed' 
  | 'financial' 
  | 'intangible' 
  | 'other'
  | string;

export type AssetStatus = 'active' | 'sold' | 'disused';

export interface Asset {
  id: string;
  category: AssetCategory;
  subCategory: string;
  name: string;
  value: number;
  description: string;
  purchaseDate: string;
  location: string;
  createdAt: string;
  imageUrl?: string; // 资产图片
  status: AssetStatus; // 资产状态
  salePrice?: number; // 出售价格（当状态为已出售时）
  // 折旧相关字段
  useDepreciation?: boolean;
  usefulLifeMonths?: number; // 使用年限（月）
  salvageValue?: number; // 残值
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  subCategories: string[];
}

export interface CustomTab {
  id: string;
  name: string;
}

export const CATEGORIES: Record<AssetCategory, CategoryConfig> = {
  current: {
    id: 'current',
    name: '流动资产',
    icon: 'wallet',
    color: 'from-sky-500 to-cyan-600',
    subCategories: [
      '现金及存款',
      '应收款项',
      '日常实物'
    ]
  },
  fixed: {
    id: 'fixed',
    name: '固定资产',
    icon: 'home',
    color: 'from-emerald-500 to-teal-600',
    subCategories: [
      '房产',
      '车辆',
      '电脑',
      '手机',
      '耳机',
      '手表',
      '大型贵重物品'
    ]
  },
  financial: {
    id: 'financial',
    name: '金融资产',
    icon: 'trending-up',
    color: 'from-violet-500 to-purple-600',
    subCategories: [
      '证券类',
      '理财类',
      '保障类',
      '其他金融'
    ]
  },
  intangible: {
    id: 'intangible',
    name: '无形资产',
    icon: 'lightbulb',
    color: 'from-amber-500 to-orange-600',
    subCategories: [
      '知识产权',
      '个人商誉',
      '域名',
      '自媒体账号'
    ]
  },
  other: {
    id: 'other',
    name: '其他资产',
    icon: 'package',
    color: 'from-pink-500 to-rose-600',
    subCategories: [
      '收藏品',
      '经营类资产'
    ]
  }
};

// 默认标签页配置
export const DEFAULT_TABS: CustomTab[] = [
  { id: 'all', name: '全部' },
  { id: 'current', name: '数码' },
  { id: 'fixed', name: '家居' },
  { id: 'financial', name: '办公' },
  { id: 'other', name: '未分类' }
];
