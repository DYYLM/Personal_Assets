export interface GalleryImage {
  id: string;
  name: string;
  url: string;
  category: string;
}

export const IMAGE_GALLERY: GalleryImage[] = [
  // 手机类
  {
    id: 'xiaomi-14',
    name: '小米14',
    url: '/images/xiaomi-14.png',
    category: 'phone'
  },
  {
    id: 'iphone-17',
    name: 'iPhone 17',
    url: '/images/iPhone 17.png',
    category: 'phone'
  },
  {
    id: 'xiaomi-pad-5',
    name: '小米平板5',
    url: '/images/小米平板5.png',
    category: 'laptop'
  },
  {
    id: 'ipad-pro',
    name: 'iPad Pro',
    url: '/images/iPad Pro.png',
    category: 'laptop'
  },
  
  // 电脑类
  {
    id: 'macbook',
    name: 'MacBook',
    url: '/images/macbook.png',
    category: 'laptop'
  },
  {
    id: 'mac-mini',
    name: 'Mac mini',
    url: '/images/Mac mini.png',
    category: 'laptop'
  },
  
  // 耳机类
  {
    id: 'redmi-buds-6-pro',
    name: 'Redmi Buds 6 Pro',
    url: '/images/Redmi Buds 6 Pro.png',
    category: 'audio'
  },
  {
    id: 'airpods-4',
    name: 'AirPods 4',
    url: '/images/AirPods 4.png',
    category: 'audio'
  },
  
  // 手表类
  {
    id: 'redmi-watch-6',
    name: 'REDMI Watch 6',
    url: '/images/REDMI Watch 6.png',
    category: 'watch'
  },
  {
    id: 'apple-watch',
    name: 'Apple Watch',
    url: '/images/Apple watch.png',
    category: 'watch'
  }
];

export const IMAGE_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'phone', name: '手机' },
  { id: 'laptop', name: '电脑' },
  { id: 'audio', name: '音频' },
  { id: 'watch', name: '手表' }
];
