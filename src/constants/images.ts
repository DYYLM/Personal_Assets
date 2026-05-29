// 资产图片资源映射
export const ASSET_IMAGES = {
  // 手机类 - 小米系列
  'xiaomi-14': '/images/xiaomi-14.png',
  'xiaomi-14-pro': '/images/xiaomi-14.png',
  'xiaomi-6': '/images/xiaomi-6.jpg',
  'xiaomi': '/images/xiaomi-14.png',
  
  'iphone': 'https://images.unsplash.com/photo-1611791487801-10d134349050?w=400&h=400&fit=crop',
  
  // 电脑类
  'macbook': '/images/macbook.png',
  'macbook-pro': '/images/macbook.png',
  'macbook-air': '/images/macbook.png',
  'laptop': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
  
  // 耳机类
  'airpods': 'https://images.unsplash.com/photo-1606741965326-ea6a2a60f470?w=400&h=400&fit=crop',
  'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
  
  // 手表类
  'watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
  'apple-watch': 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
  
  // 其他数码产品
  'camera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
  'tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
};

// 根据资产名称获取默认图片
export function getAssetImage(assetName: string): string {
  const name = assetName.toLowerCase();
  
  if (name.includes('小米6')) return ASSET_IMAGES['xiaomi-6'];
  if (name.includes('xiaomi 6')) return ASSET_IMAGES['xiaomi-6'];
  if (name.includes('xiaomi6')) return ASSET_IMAGES['xiaomi-6'];
  if (name.includes('小米14')) return ASSET_IMAGES['xiaomi-14'];
  if (name.includes('xiaomi 14')) return ASSET_IMAGES['xiaomi-14'];
  if (name.includes('xiaomi14')) return ASSET_IMAGES['xiaomi-14'];
  if (name.includes('小米')) return ASSET_IMAGES['xiaomi'];
  if (name.includes('xiaomi')) return ASSET_IMAGES['xiaomi'];
  if (name.includes('iphone')) return ASSET_IMAGES['iphone'];
  if (name.includes('macbook pro')) return ASSET_IMAGES['macbook-pro'];
  if (name.includes('macbook air')) return ASSET_IMAGES['macbook-air'];
  if (name.includes('macbook')) return ASSET_IMAGES['macbook'];
  if (name.includes('电脑')) return ASSET_IMAGES['laptop'];
  if (name.includes('airpods')) return ASSET_IMAGES['airpods'];
  if (name.includes('耳机')) return ASSET_IMAGES['headphones'];
  if (name.includes('手表') || name.includes('watch')) return ASSET_IMAGES['watch'];
  if (name.includes('相机')) return ASSET_IMAGES['camera'];
  if (name.includes('平板')) return ASSET_IMAGES['tablet'];
  
  // 默认图标
  return '';
}

// 获取占位图（如果图片加载失败）
export function getPlaceholderEmoji(assetName: string): string {
  const name = assetName.toLowerCase();
  
  if (name.includes('手机') || name.includes('iphone') || name.includes('小米')) return '📱';
  if (name.includes('电脑') || name.includes('macbook') || name.includes('笔记本')) return '💻';
  if (name.includes('耳机') || name.includes('airpods')) return '🎧';
  if (name.includes('手表') || name.includes('watch')) return '⌚';
  if (name.includes('相机')) return '📷';
  if (name.includes('平板')) return '📱';
  
  return '📦';
}
