import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Asset, AssetCategory, AssetStatus, CustomTab, DEFAULT_TABS } from '@/types';
import { calculateCurrentValue } from '@/utils/depreciation';

interface AssetStore {
  assets: Asset[];
  tabs: CustomTab[];
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getAssetsByCategory: (category: AssetCategory) => Asset[];
  getTotalValue: () => number;
  getCategoryValue: (category: AssetCategory) => number;
  getTotalCurrentValue: () => number; // 折旧后总价值
  getCategoryCurrentValue: (category: AssetCategory) => number; // 分类折旧后总价值
  renameTab: (id: string, newName: string) => void;
  deleteTab: (id: string) => void;
  addTab: (name: string) => void;
}

// 旧数据类型
interface LegacyAsset {
  id: string;
  category: AssetCategory;
  subCategory: string;
  name: string;
  value: number;
  description: string;
  purchaseDate: string;
  location: string;
  createdAt: string;
  imageUrl?: string;
  status?: AssetStatus;
  salePrice?: number;
  useDepreciation?: boolean;
  usefulLifeMonths?: number;
  salvageValue?: number;
}

// 旧 store 数据类型
interface LegacyStoreState {
  assets?: LegacyAsset[];
  tabs?: CustomTab[];
}

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: [],
      tabs: DEFAULT_TABS,
      
      addAsset: (asset) => {
        const newAsset: Asset = {
          ...asset,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        };
        set((state) => ({ assets: [...state.assets, newAsset] }));
      },
      
      updateAsset: (id, asset) => {
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id ? { ...a, ...asset } : a
          )
        }));
      },
      
      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id)
        }));
      },
      
      getAssetsByCategory: (category) => {
        return get().assets.filter((a) => a.category === category);
      },
      
      getTotalValue: () => {
        return get().assets.reduce((sum, a) => sum + a.value, 0);
      },
      
      getCategoryValue: (category) => {
        return get()
          .assets.filter((a) => a.category === category)
          .reduce((sum, a) => sum + a.value, 0);
      },
      
      getTotalCurrentValue: () => {
        return get().assets.reduce((sum, a) => sum + calculateCurrentValue(a), 0);
      },
      
      getCategoryCurrentValue: (category) => {
        return get()
          .assets.filter((a) => a.category === category)
          .reduce((sum, a) => sum + calculateCurrentValue(a), 0);
      },
      
      renameTab: (id, newName) => {
        // 不允许重命名全部标签
        if (id === 'all') return;
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id ? { ...tab, name: newName } : tab
          )
        }));
      },
      
      deleteTab: (id) => {
        // 不允许删除全部标签
        if (id === 'all') return;
        set((state) => ({
          tabs: state.tabs.filter((tab) => tab.id !== id)
        }));
      },
      
      addTab: (name) => {
        const newTab: CustomTab = {
          id: crypto.randomUUID(),
          name
        };
        set((state) => ({
          tabs: [...state.tabs, newTab]
        }));
      }
    }),
    {
      name: 'personal-assets-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2, // 数据版本
      migrate: (persistedState: any, version) => {
        let state = persistedState as LegacyStoreState;
        
        // 从版本0迁移到版本1
        if (version < 1) {
          if (state.assets) {
            // 给所有旧资产添加默认状态
            state.assets = state.assets.map((asset) => ({
              ...asset,
              status: asset.status || ('active' as const), // 默认状态为持有中
              salePrice: asset.salePrice || undefined
            }));
          }
        }
        
        // 从版本1迁移到版本2
        if (version < 2) {
          // 添加默认标签页
          if (!state.tabs) {
            state.tabs = DEFAULT_TABS;
          }
        }
        
        return state;
      }
    }
  )
);
