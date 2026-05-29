import { useState, useEffect } from 'react';
import { useAssetStore } from '@/store';
import { AssetCategory, Asset, AssetStatus, CustomTab } from '@/types';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { X, Image as ImageIcon, Plus, Check } from 'lucide-react';
import Logo from '@/components/Logo';
import ImageSelector from '@/components/ImageSelector';
import { getDefaultDepreciationConfig, calculateDefaultSalvageValue } from '@/utils/depreciation';
import { getAssetImage, getPlaceholderEmoji } from '@/constants/images';

export default function AssetForm() {
  const { category: routeCategory, id } = useParams<{ category?: AssetCategory; id?: string }>();
  const navigate = useNavigate();
  const { addAsset, updateAsset, assets, tabs, addTab } = useAssetStore();

  const isEdit = !!id;
  const isAddFromCategory = !!routeCategory && !id;
  const existingAsset = isEdit ? assets.find((a) => a.id === id) : null;

  const [formData, setFormData] = useState<Partial<Asset>>({
    category: isAddFromCategory ? routeCategory : undefined,
    subCategory: '',
    name: '',
    value: 0,
    description: '',
    purchaseDate: '',
    location: '',
    imageUrl: undefined,
    status: 'active' as AssetStatus,
    salePrice: undefined,
    useDepreciation: false,
    usefulLifeMonths: undefined,
    salvageValue: undefined,
  });

  const [showImageSelector, setShowImageSelector] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (existingAsset) {
      // 确保编辑旧数据时有默认状态
      setFormData({
        ...existingAsset,
        status: existingAsset.status || 'active'
      });
    }
  }, [existingAsset]);

  // 过滤掉"全部"标签
  const availableTabs = tabs.filter((tab: CustomTab) => tab.id !== 'all');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addTab(newCategoryName.trim());
      // 自动选中新增的类别
      const allTabs = useAssetStore.getState().tabs;
      const newTab = allTabs[allTabs.length - 1];
      setFormData(prev => ({ ...prev, category: newTab.id }));
      setShowAddCategory(false);
      setNewCategoryName('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.name || formData.value === undefined) {
      alert('请填写必填信息');
      return;
    }

    // 如果状态是已出售，必须填写售价
    if (formData.status === 'sold' && (formData.salePrice === undefined || formData.salePrice === null)) {
      alert('请填写出售价格');
      return;
    }

    try {
      if (isEdit && id) {
        updateAsset(id, formData);
      } else {
        addAsset(formData as Omit<Asset, 'id' | 'createdAt'>);
      }
      navigate('/');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    }
  };

  const handleChange = (field: keyof Asset, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // 当状态不是已出售时，清理salePrice
      if (field === 'status' && value !== 'sold') {
        newData.salePrice = undefined;
      }
      
      return newData;
    });
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDE9B1] to-white pb-8">
      {/* 顶部区域 */}
      <div className="px-4 pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Logo />
          <Link to="/" className="p-2">
            <X className="w-6 h-6 text-gray-600" />
          </Link>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="bg-white rounded-t-[32px] px-6 pt-8 pb-8 min-h-[calc(100vh-120px)]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? '编辑资产' : '添加资产'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 资产图片 */}
          <div>
            <label className="block text-base font-medium text-gray-800 mb-3">资产图片</label>
            <button
              type="button"
              onClick={() => setShowImageSelector(true)}
              className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden hover:bg-gray-300 transition-colors relative group"
            >
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt={formData.name || '资产图片'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <svg className="w-12 h-12 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">点击选择</span>
                </div>
              )}
              {/* 悬停效果 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 rounded-full p-2">
                    <ImageIcon className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* 资产状态 */}
          <div>
            <label className="block text-base font-medium text-gray-800 mb-3">资产状态</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange('status', 'active')}
                className={`flex-1 px-4 py-2 rounded-full border-2 font-medium transition-colors ${
                  formData.status === 'active'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                持有中
              </button>
              <button
                type="button"
                onClick={() => handleChange('status', 'sold')}
                className={`flex-1 px-4 py-2 rounded-full border-2 font-medium transition-colors ${
                  formData.status === 'sold'
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                已出售
              </button>
              <button
                type="button"
                onClick={() => handleChange('status', 'disused')}
                className={`flex-1 px-4 py-2 rounded-full border-2 font-medium transition-colors ${
                  formData.status === 'disused'
                    ? 'border-gray-400 bg-gray-50 text-gray-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                已弃用
              </button>
            </div>
          </div>

          {/* 出售价格（仅在状态为已出售时显示） */}
          {formData.status === 'sold' && (
            <div>
              <label className="block text-base font-medium text-gray-800 mb-2">出售价格</label>
              <input
                type="number"
                value={formData.salePrice || ''}
                onChange={(e) => handleChange('salePrice', parseFloat(e.target.value) || undefined)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                placeholder="请输入出售价格"
                min="0"
                step="0.01"
              />
            </div>
          )}

          {/* 资产类型选择 */}
          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">资产类型</label>
            {!showAddCategory ? (
              <select
                value={formData.category || ''}
                onChange={(e) => {
                  if (e.target.value === 'add-new') {
                    setShowAddCategory(true);
                  } else {
                    handleChange('category', e.target.value as AssetCategory);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              >
                <option value="">请选择</option>
                {availableTabs.map((tab: CustomTab) => (
                  <option key={tab.id} value={tab.id}>{tab.name}</option>
                ))}
                <option value="add-new" className="text-blue-600">+ 新增类型</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="输入新类型名称"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddCategory();
                    else if (e.key === 'Escape') {
                      setShowAddCategory(false);
                      setNewCategoryName('');
                    }
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* 资产名称 */}
          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">资产名称</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              placeholder="请输入内容"
            />
          </div>

          {/* 资产价值 */}
          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">资产价值</label>
            <input
              type="number"
              value={formData.value || ''}
              onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              placeholder="请输入内容"
              min="0"
              step="0.01"
            />
          </div>

          {/* 购买日期 */}
          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">购买日期</label>
            <input
              type="date"
              value={formData.purchaseDate || ''}
              onChange={(e) => handleChange('purchaseDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
            />
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-base font-medium text-gray-800 mb-2">备注</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent resize-none"
              rows={4}
              placeholder="请输入内容"
            />
          </div>

          {/* 折旧设置 - 可选显示 */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">折旧设置</h3>
            
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="useDepreciation"
                checked={formData.useDepreciation || false}
                onChange={(e) => handleChange('useDepreciation', e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
              />
              <label htmlFor="useDepreciation" className="text-base font-medium text-gray-700">
                启用直线折旧计算
              </label>
            </div>

            {formData.useDepreciation && (
              <div className="grid gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">使用年限（月）</label>
                  <input
                    type="number"
                    value={formData.usefulLifeMonths || ''}
                    onChange={(e) => handleChange('usefulLifeMonths', parseInt(e.target.value) || undefined)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                    placeholder="例如：36"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">残值（元）</label>
                  <input
                    type="number"
                    value={formData.salvageValue || ''}
                    onChange={(e) => handleChange('salvageValue', parseFloat(e.target.value) || undefined)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                    placeholder="例如：100"
                    min="0"
                    step="0.01"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  使用直线折旧法计算资产当前价值
                </p>
              </div>
            )}
          </div>

          {/* 提交按钮 */}
          <div className="pt-6 flex justify-center">
            <button
              type="submit"
              className="px-12 py-3 bg-amber-300 hover:bg-amber-400 text-gray-800 rounded-lg font-bold transition-colors"
            >
              {isEdit ? '保存修改' : '添加资产'}
            </button>
          </div>
        </form>
      </div>

      {/* 图片选择器 */}
      <ImageSelector
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onSelect={handleImageSelect}
        currentImage={formData.imageUrl}
      />
    </div>
  );
}
