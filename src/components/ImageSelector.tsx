import { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { IMAGE_GALLERY, IMAGE_CATEGORIES, GalleryImage } from '@/constants/imageGallery';

interface ImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  currentImage?: string;
}

export default function ImageSelector({ isOpen, onClose, onSelect, currentImage }: ImageSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const filteredImages = selectedCategory === 'all' 
    ? IMAGE_GALLERY 
    : IMAGE_GALLERY.filter(img => img.category === selectedCategory);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSelect(reader.result as string);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySelect = (image: GalleryImage) => {
    onSelect(image.url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div 
        ref={modalRef}
        className="bg-white w-full max-w-2xl max-h-[80vh] sm:max-h-[90vh] sm:rounded-2xl rounded-t-3xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">选择图片</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setShowUpload(false)}
            className={`flex-1 py-3 text-center font-medium ${
              !showUpload 
                ? 'text-amber-600 border-b-2 border-amber-600' 
                : 'text-gray-500'
            }`}
          >
            图片库
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className={`flex-1 py-3 text-center font-medium ${
              showUpload 
                ? 'text-amber-600 border-b-2 border-amber-600' 
                : 'text-gray-500'
            }`}
          >
            上传图片
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!showUpload ? (
            <div>
              {/* Category selector */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                {IMAGE_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                      selectedCategory === cat.id 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Image grid */}
              <div className="grid grid-cols-3 gap-2">
                {filteredImages.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => handleGallerySelect(image)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      currentImage === image.url 
                        ? 'ring-2 ring-amber-500 ring-offset-2' 
                        : ''
                    }`}
                  >
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    {currentImage === image.url && (
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors"
              >
                <Upload className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">点击上传</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
