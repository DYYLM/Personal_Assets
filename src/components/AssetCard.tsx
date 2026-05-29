import { Asset } from '@/types';
import { Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAssetStore } from '@/store';
import { calculateCurrentValue, calculateMonthsUsed } from '@/utils/depreciation';
import { useCurrentDate } from '@/hooks/useCurrentTime';
import { getAssetImage, getPlaceholderEmoji } from '@/constants/images';

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const deleteAsset = useAssetStore((state) => state.deleteAsset);
  const currentDate = useCurrentDate();
  
  const currentValue = calculateCurrentValue(asset, currentDate);
  const monthsUsed = calculateMonthsUsed(asset, currentDate);
  const hasDepreciation = asset.useDepreciation && currentValue !== asset.value;
  const imageUrl = asset.imageUrl || getAssetImage(asset.name);
  const placeholder = getPlaceholderEmoji(asset.name);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
      <div className="flex gap-4 items-start">
        {/* 图片 */}
        <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={asset.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                // 如果图片加载失败，显示占位符
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                const parent = img.parentElement;
                if (parent) {
                  const span = document.createElement('span');
                  span.textContent = placeholder;
                  span.className = 'text-4xl';
                  parent.appendChild(span);
                }
              }}
            />
          ) : (
            <span className="text-4xl">{placeholder}</span>
          )}
        </div>
        
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{asset.name}</h3>
              <p className="text-sm text-gray-500">{asset.subCategory}</p>
            </div>
            <div className="text-right ml-4">
              {hasDepreciation ? (
                <>
                  <p className="font-bold text-lg text-emerald-600">{formatValue(currentValue)}</p>
                  <p className="text-xs text-gray-400 line-through">{formatValue(asset.value)}</p>
                </>
              ) : (
                <p className="font-bold text-lg text-sky-600">{formatValue(asset.value)}</p>
              )}
            </div>
          </div>
          
          {hasDepreciation && (
            <div className="mb-2">
              <p className="text-xs text-emerald-600">
                已折旧：{formatValue(asset.value - currentValue)} · 
                已使用 {monthsUsed} 个月 / {asset.usefulLifeMonths} 个月
              </p>
            </div>
          )}
          
          {asset.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{asset.description}</p>
          )}
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-400">
              {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString('zh-CN') : '未记录日期'}
            </p>
            <div className="flex gap-2">
              <Link
                to={`/assets/${asset.category}/${asset.id}`}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </Link>
              <button
                onClick={() => deleteAsset(asset.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
