'use client';

import { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';
import Image from 'next/image';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onUpload: (file: File) => void;
  onDelete?: () => void;
  isUploading?: boolean;
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  onUpload, 
  onDelete,
  isUploading = false 
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call upload handler
    onUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    setPreview(null);
    if (onDelete) onDelete();
  };

  const displayUrl = preview || currentAvatarUrl;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative w-32 h-32 rounded-full overflow-hidden border-2 transition-all ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-border bg-foreground/5'
        } ${!displayUrl && !isUploading ? 'cursor-pointer hover:border-blue-400' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!displayUrl && !isUploading ? handleClick : undefined}
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="Avatar"
            fill
            className="object-cover"
          />
        ) : isUploading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <User className="w-12 h-12 mb-2" />
            <Upload className="w-6 h-6" />
          </div>
        )}
        
        {displayUrl && !isUploading && onDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      {!displayUrl && !isUploading && (
        <button
          onClick={handleClick}
          className="text-sm text-blue-500 hover:text-blue-600 font-medium"
        >
          Subir foto
        </button>
      )}

      {displayUrl && !isUploading && (
        <button
          onClick={handleClick}
          className="text-sm text-muted-foreground hover:text-foreground font-medium"
        >
          Cambiar foto
        </button>
      )}
    </div>
  );
}
