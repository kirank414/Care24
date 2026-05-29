import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { Upload, X, Crop, Check } from 'lucide-react';
import getCroppedImg from '@/utils/cropImage';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || null);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImageBase64 = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          0
        );
        onChange(croppedImageBase64);
        setIsCropping(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />

      {!isCropping && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-slate-50 transition-colors group"
        >
          {value ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
              <img src={value} alt="Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={20} className="text-white" />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload size={24} className="text-slate-400" />
            </div>
          )}
          <p className="text-sm font-bold text-slate-700">
            {value ? 'Click to change photo' : 'Upload Profile Photo'}
          </p>
          <p className="text-xs text-slate-400 mt-1">JPEG, PNG or WebP</p>
        </div>
      )}

      {isCropping && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Crop size={18} className="text-primary" /> Adjust Photo
              </h3>
              <button 
                onClick={() => setIsCropping(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="relative w-full h-[400px] bg-slate-100">
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                  Zoom Level
                </label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => {
                    setZoom(Number(e.target.value))
                  }}
                  className="w-full accent-primary"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1 rounded-2xl h-12"
                  onClick={() => setIsCropping(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  className="flex-1 rounded-2xl h-12 gap-2"
                  onClick={handleCropSave}
                >
                  <Check size={18} /> Apply Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
