import { Asset } from '@/types';

// 直线折旧法计算当前价值
export function calculateCurrentValue(asset: Asset, currentDate?: Date): number {
  // 如果资产已出售，使用出售价格（如果有）
  if (asset.status === 'sold' && asset.salePrice !== undefined) {
    return asset.salePrice;
  }

  if (!asset.useDepreciation || !asset.purchaseDate || !asset.usefulLifeMonths) {
    return asset.value;
  }

  const purchaseDate = new Date(asset.purchaseDate);
  const today = currentDate || new Date();
  
  // 计算已使用月数
  const monthsUsed = Math.max(0, 
    (today.getFullYear() - purchaseDate.getFullYear()) * 12 + 
    (today.getMonth() - purchaseDate.getMonth())
  );

  // 计算总折旧额
  const salvageValue = asset.salvageValue || 0;
  const totalDepreciation = asset.value - salvageValue;
  
  // 计算每月折旧额
  const monthlyDepreciation = totalDepreciation / asset.usefulLifeMonths;
  
  // 计算累计折旧
  const accumulatedDepreciation = monthsUsed * monthlyDepreciation;
  
  // 计算当前价值，不能低于残值
  const currentValue = Math.max(salvageValue, asset.value - accumulatedDepreciation);
  
  return Math.round(currentValue * 100) / 100;
}

// 默认折旧配置
export const DEFAULT_DEPRECIATION_CONFIG: Record<string, { usefulLifeMonths: number; salvageRate: number}> = {
  '电脑': { usefulLifeMonths: 36, salvageRate: 0.1 }, // 3年，残值10%
  '手机': { usefulLifeMonths: 24, salvageRate: 0.05 }, // 2年，残值5%
  '耳机': { usefulLifeMonths: 24, salvageRate: 0.05 }, // 2年，残值5%
  '手表': { usefulLifeMonths: 60, salvageRate: 0.3 }, // 5年，残值30%
};

// 获取默认折旧配置
export function getDefaultDepreciationConfig(subCategory: string) {
  return DEFAULT_DEPRECIATION_CONFIG[subCategory] || null;
}

// 计算默认残值
export function calculateDefaultSalvageValue(originalValue: number, salvageRate: number) {
  return Math.round(originalValue * salvageRate * 100) / 100;
}

// 计算已使用月数
export function calculateMonthsUsed(asset: Asset, currentDate?: Date): number {
  if (!asset.purchaseDate) return 0;
  
  const purchaseDate = new Date(asset.purchaseDate);
  const today = currentDate || new Date();
  
  return Math.max(0, 
    (today.getFullYear() - purchaseDate.getFullYear()) * 12 + 
    (today.getMonth() - purchaseDate.getMonth())
  );
}

// 计算已使用天数
export function calculateDaysUsed(asset: Asset, currentDate?: Date): number {
  if (!asset.purchaseDate) return 0;
  
  const purchaseDate = new Date(asset.purchaseDate);
  const today = currentDate || new Date();
  
  const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}
