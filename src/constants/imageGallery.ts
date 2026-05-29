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
    id: 'phone-1',
    name: '智能手机',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    category: 'phone'
  },
  {
    id: 'phone-2',
    name: 'iPhone',
    url: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=400&fit=crop',
    category: 'phone'
  },
  {
    id: 'phone-3',
    name: '安卓手机',
    url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop',
    category: 'phone'
  },
  
  // 电脑类
  {
    id: 'macbook',
    name: 'MacBook',
    url: '/images/macbook.png',
    category: 'laptop'
  },
  {
    id: 'laptop-1',
    name: '笔记本电脑',
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    category: 'laptop'
  },
  {
    id: 'laptop-2',
    name: 'MacBook',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    category: 'laptop'
  },
  {
    id: 'desktop-1',
    name: '台式电脑',
    url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
    category: 'desktop'
  },
  
  // 耳机类
  {
    id: 'headphone-1',
    name: '无线耳机',
    url: 'https://images.unsplash.com/photo-1606741965326-ea6a2a60f470?w=400&h=400&fit=crop',
    category: 'audio'
  },
  {
    id: 'headphone-2',
    name: '头戴式耳机',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'audio'
  },
  
  // 手表类
  {
    id: 'watch-1',
    name: '智能手表',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: 'watch'
  },
  {
    id: 'watch-2',
    name: 'Apple Watch',
    url: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
    category: 'watch'
  },
  
  // 相机类
  {
    id: 'camera-1',
    name: '数码相机',
    url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    category: 'camera'
  },
  
  // 汽车类
  {
    id: 'car-1',
    name: '汽车',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop',
    category: 'car'
  },
  
  // 家具类
  {
    id: 'furniture-1',
    name: '沙发',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    category: 'furniture'
  },
  {
    id: 'furniture-2',
    name: '椅子',
    url: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop',
    category: 'furniture'
  },
  
  // 珠宝类
  {
    id: 'jewelry-1',
    name: '手表',
    url: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=400&fit=crop',
    category: 'jewelry'
  },
  {
    id: 'jewelry-2',
    name: '项链',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    category: 'jewelry'
  },
  
  // 艺术品类
  {
    id: 'art-1',
    name: '画作',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
    category: 'art'
  },
  
  // 其他
  {
    id: 'misc-1',
    name: '行李箱',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'travel'
  },
  {
    id: 'misc-2',
    name: '书籍',
    url: 'https://images.unsplash.com/photo-1476275466078-4007374bfebc?w=400&h=400&fit=crop',
    category: 'books'
  },
  {
    id: 'misc-3',
    name: '绿植',
    url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop',
    category: 'plants'
  }
];

export const IMAGE_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'phone', name: '手机' },
  { id: 'laptop', name: '电脑' },
  { id: 'audio', name: '音频' },
  { id: 'watch', name: '手表' },
  { id: 'camera', name: '相机' },
  { id: 'car', name: '汽车' },
  { id: 'furniture', name: '家具' },
  { id: 'jewelry', name: '珠宝' },
  { id: 'art', name: '艺术品' },
  { id: 'travel', name: '旅行' },
  { id: 'books', name: '书籍' },
  { id: 'plants', name: '植物' }
];
