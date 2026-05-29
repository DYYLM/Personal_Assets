import { useState, useMemo, useEffect, useRef } from 'react';
import { useAssetStore } from '@/store';
import { CATEGORIES, Asset, AssetCategory, AssetStatus, CustomTab } from '@/types';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, EyeOff, Pencil, Trash2, Check, X } from 'lucide-react';
import { IconMapper } from '@/components/IconMapper';
import Logo from '@/components/Logo';
import { useCurrentDate } from '@/hooks/useCurrentTime';
import { calculateCurrentValue, calculateDaysUsed } from '@/utils/depreciation';
import { getAssetImage, getPlaceholderEmoji } from '@/constants/images';

const COLORS = ['#0ea5e9', '#10b981', '#8b5cf6', '#f97316', '#ec4899'];
const DESIGN_WIDTH = 414; // 设计稿宽度（iPhone 12/13 宽度）
const DESIGN_HEIGHT = 896; // 设计稿高度

export default function Home() {
  const { assets, tabs, renameTab, deleteTab, addTab } = useAssetStore();
  const currentDate = useCurrentDate();
  const [activeTab, setActiveTab] = useState('all');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [showAmount, setShowAmount] = useState(true);
  const [isEditingTabs, setIsEditingTabs] = useState(false);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState('');
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // 使用当前日期计算折旧后的值
  const calculateTotalValue = () => assets.reduce((sum, a) => sum + a.value, 0);
  const calculateTotalCurrentValue = () => assets.reduce((sum, a) => sum + calculateCurrentValue(a, currentDate), 0);
  
  const totalValue = calculateTotalValue();
  const totalCurrentValue = calculateTotalCurrentValue();

  // 创建 tab id 到名称的映射
  const tabIdToName = useMemo(() => {
    const map: Record<string, string> = {};
    tabs.forEach((tab: CustomTab) => {
      map[tab.id] = tab.name;
    });
    return map;
  }, [tabs]);

  // 筛选资产
  const filteredAssets = activeTab === 'all' 
    ? assets 
    : assets.filter(a => a.category === activeTab);

  // 计算缩放比例
  useEffect(() => {
    const updateScale = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const scaleX = windowWidth / DESIGN_WIDTH;
      const scaleY = windowHeight / DESIGN_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1); // 最大缩放1倍，不放大
      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(value);
  };

  // 获取状态标签
  const getStatusBadge = (asset: Asset) => {
    // 确保没有status的旧数据也能正常显示
    const status = asset.status || 'active';
    switch (status) {
      case 'sold':
        return { text: '已出售', color: 'bg-orange-500 text-white' };
      case 'disused':
        return { text: '已弃用', color: 'bg-gray-400 text-white' };
      default:
        return { text: '持有中', color: 'bg-blue-500 text-white' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDE9B1] to-white pb-24 flex items-start justify-center overflow-hidden">
      <div
        ref={containerRef}
        className="w-full origin-top-center"
        style={{
          width: `${DESIGN_WIDTH}px`,
          transform: `scale(${scale})`,
        }}
      >
      {/* 顶部标题栏 */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex gap-4">
            <button className="p-2">
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            <Link to="/assets/add" className="p-2">
              <Plus className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* 资产总览卡片 */}
      <div className="mx-4 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">资产总览</h2>
            <button
              onClick={() => setShowAmount(!showAmount)}
              className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              {showAmount ? (
                <Eye className="w-3 h-3 text-gray-600" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-600" />
              )}
            </button>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 mb-1">总资产</p>
              <p className="text-3xl font-bold text-black">
                {showAmount ? formatValue(totalCurrentValue) : '***'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 mb-1">日盈亏</p>
              <p className="text-2xl font-bold text-black">
                {showAmount ? '1,214.58' : '***'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="mb-6">
        <div className="flex gap-2 px-4 items-center overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <div key={tab.id} className="flex items-center gap-1">
              {editingTabId === tab.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editingTabName}
                    onChange={(e) => setEditingTabName(e.target.value)}
                    className="px-3 py-2 rounded-full text-sm font-medium bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-24"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (editingTabName.trim()) {
                          renameTab(tab.id, editingTabName.trim());
                        }
                        setEditingTabId(null);
                        setEditingTabName('');
                      } else if (e.key === 'Escape') {
                        setEditingTabId(null);
                        setEditingTabName('');
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (editingTabName.trim()) {
                        renameTab(tab.id, editingTabName.trim());
                      }
                      setEditingTabId(null);
                      setEditingTabName('');
                    }}
                    className="p-1.5 rounded-full hover:bg-green-100 text-green-600"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTabId(null);
                      setEditingTabName('');
                    }}
                    className="p-1.5 rounded-full hover:bg-red-100 text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : isEditingTabs ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.name}
                  </button>
                  {tab.id !== 'all' && (
                    <>
                      <button
                        onClick={() => {
                          setEditingTabId(tab.id);
                          setEditingTabName(tab.name);
                        }}
                        className="p-1.5 rounded-full hover:bg-blue-100 text-blue-600"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteTab(tab.id)}
                        className="p-1.5 rounded-full hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.name}
                </button>
              )}
            </div>
          ))}
          {isEditingTabs ? (
            isAddingTab ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <input
                  type="text"
                  value={newTabName}
                  onChange={(e) => setNewTabName(e.target.value)}
                  placeholder="输入名称"
                  className="px-3 py-2 rounded-full text-sm font-medium bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 w-24"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (newTabName.trim()) {
                        addTab(newTabName.trim());
                      }
                      setIsAddingTab(false);
                      setNewTabName('');
                    } else if (e.key === 'Escape') {
                      setIsAddingTab(false);
                      setNewTabName('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (newTabName.trim()) {
                      addTab(newTabName.trim());
                    }
                    setIsAddingTab(false);
                    setNewTabName('');
                  }}
                  className="p-1.5 rounded-full hover:bg-green-100 text-green-600"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    setIsAddingTab(false);
                    setNewTabName('');
                  }}
                  className="p-1.5 rounded-full hover:bg-red-100 text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingTab(true)}
                className="p-2 rounded-full hover:bg-green-100 text-green-600 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            )
          ) : null}
          <button
            onClick={() => setIsEditingTabs(!isEditingTabs)}
            className={`p-2 rounded-full flex-shrink-0 transition-colors ${
              isEditingTabs
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isEditingTabs ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 资产网格 */}
      <div className="px-4">
        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <p className="text-gray-500">暂无资产</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredAssets.map((asset) => {
              // 确保旧数据有默认状态
              const normalizedAsset = { ...asset, status: asset.status || 'active' };
              const currentValue = calculateCurrentValue(normalizedAsset, currentDate);
              const daysUsed = calculateDaysUsed(normalizedAsset, currentDate);
              const status = getStatusBadge(normalizedAsset);
              const imageUrl = normalizedAsset.imageUrl || getAssetImage(normalizedAsset.name);
              const hasImageError = imageErrors[asset.id];
              const placeholder = getPlaceholderEmoji(normalizedAsset.name);
              
              const handleImageError = () => {
                setImageErrors(prev => ({ ...prev, [asset.id]: true }));
              };
              
              return (
                <Link
                  key={asset.id}
                  to={`/assets/${asset.category}/${asset.id}`}
                  className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-all relative flex flex-col"
                  style={{ aspectRatio: '1/1' }}
                >
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium border ${
                    normalizedAsset.status === 'sold' 
                      ? 'border-red-500 text-red-500 bg-white' 
                      : normalizedAsset.status === 'disused' 
                        ? 'border-gray-400 text-gray-400 bg-white' 
                        : 'border-green-500 text-green-500 bg-white'
                  }`}>
                    {status.text}
                  </div>
                  
                  {/* 图片区域 */}
                  <div className="mb-3">
                    <div className="w-[90px] h-[90px] bg-white rounded-2xl flex items-center justify-center">
                      {imageUrl && !hasImageError ? (
                        <img
                          src={imageUrl}
                          alt={normalizedAsset.name}
                          className="max-w-[90%] max-h-[90%] object-contain"
                          onError={handleImageError}
                        />
                      ) : (
                        <span className="text-4xl">{placeholder}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* 文字区域 */}
                  <div className="h-[90px] flex flex-col justify-between mt-[-10px]">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-0 truncate text-left">{normalizedAsset.name}</h3>
                      <p className="text-sm font-bold text-gray-900 mb-0 text-left">
                        {formatValue(currentValue)}
                      </p>
                      {normalizedAsset.status === 'sold' ? (
                        <p className="text-sm text-gray-400 line-through text-left">
                          ¥{normalizedAsset.value.toLocaleString()}
                        </p>
                      ) : (
                        normalizedAsset.useDepreciation && (
                          <p className="text-sm text-gray-400 line-through text-left">
                            ¥{normalizedAsset.value.toLocaleString()}
                          </p>
                        )
                      )}
                    </div>
                    {normalizedAsset.purchaseDate && (
                      <div className="flex items-center justify-end gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          normalizedAsset.status === 'sold' ? 'bg-red-500' : 
                          normalizedAsset.status === 'disused' ? 'bg-gray-500' : 'bg-green-500'
                        }`}></div>
                        <p className="text-xs text-gray-500">
                          {normalizedAsset.status === 'sold' ? '已出售' : `持有：${daysUsed}天`}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
