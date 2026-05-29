import { useAssetStore } from '@/store';
import { CATEGORIES, AssetCategory } from '@/types';
import { Link, useParams } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import { IconMapper } from '@/components/IconMapper';
import { AssetCard } from '@/components/AssetCard';
import { Empty } from '@/components/Empty';
import { useCurrentDate } from '@/hooks/useCurrentTime';
import { calculateCurrentValue } from '@/utils/depreciation';

export default function AssetList() {
  const { category } = useParams<{ category: AssetCategory }>();
  const { getAssetsByCategory } = useAssetStore();
  const currentDate = useCurrentDate();

  if (!category || !CATEGORIES[category]) {
    return <div className="p-8">分类不存在</div>;
  }

  const categoryConfig = CATEGORIES[category];
  const assets = getAssetsByCategory(category);
  
  // 使用当前日期计算折旧后的值
  const calculateTotalValue = () => assets.reduce((sum, a) => sum + a.value, 0);
  const calculateTotalCurrentValue = () => assets.reduce((sum, a) => sum + calculateCurrentValue(a, currentDate), 0);
  
  const totalValue = calculateTotalValue();
  const totalCurrentValue = calculateTotalCurrentValue();
  const hasDepreciation = totalCurrentValue !== totalValue;

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 pb-8">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>返回首页</span>
        </Link>

        <div className={`bg-gradient-to-r ${categoryConfig.color} rounded-2xl p-8 text-white mb-8 shadow-lg`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
              <IconMapper name={categoryConfig.icon} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{categoryConfig.name}</h1>
              <p className="text-white/80">共 {assets.length} 项资产</p>
            </div>
          </div>
          {hasDepreciation ? (
            <div>
              <div className="text-4xl font-bold">{formatValue(totalCurrentValue)}</div>
              <p className="text-sm text-white/70 mt-1">
                原值：<span className="line-through">{formatValue(totalValue)}</span>
              </p>
            </div>
          ) : (
            <div className="text-4xl font-bold">{formatValue(totalValue)}</div>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">资产列表</h2>
          <Link
            to={`/assets/add`}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            添加资产
          </Link>
        </div>

        {assets.length === 0 ? (
          <Empty description="暂无资产，点击上方按钮添加" />
        ) : (
          <div className="grid gap-4">
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
