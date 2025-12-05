'use client';

import { Profile } from '@/lib/types';
import { X, Plus, Trash2, Edit2, Check, User } from 'lucide-react';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AvatarUpload } from './avatar-upload';
import Image from 'next/image';

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  activeProfileId: string;
  onCreateProfile: (name: string, color: string, avatarFile?: File) => void;
  onDeleteProfile: (profileId: string) => void;
  onUpdateProfileName?: (profileId: string, name: string) => void;
  onUpdateProfileAvatar?: (profileId: string, file: File) => void;
  onDeleteProfileAvatar?: (profileId: string) => void;
}

const PROFILE_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export function ProfileManager({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onCreateProfile,
  onDeleteProfile,
  onUpdateProfileName,
  onUpdateProfileAvatar,
  onDeleteProfileAvatar,
}: ProfileManagerProps) {
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROFILE_COLORS[0]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newProfileAvatar, setNewProfileAvatar] = useState<File | null>(null);
  const [editingAvatarFile, setEditingAvatarFile] = useState<File | null>(null);
  const [uploadingAvatarId, setUploadingAvatarId] = useState<string | null>(null);

  const handleCreate = () => {
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName.trim(), selectedColor, newProfileAvatar || undefined);
      setNewProfileName('');
      setSelectedColor(PROFILE_COLORS[0]);
      setNewProfileAvatar(null);
      setIsCreating(false);
    }
  };

  const handleDelete = (profileId: string) => {
    if (profiles.length <= 1) {
      alert('No puedes eliminar el único perfil');
      return;
    }
    if (confirm('¿Estás seguro de eliminar este perfil? Se perderán todos sus datos.')) {
      onDeleteProfile(profileId);
    }
  };

  const handleStartEdit = (profile: Profile) => {
    setEditingId(profile.id);
    setEditingName(profile.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim() && onUpdateProfileName) {
      onUpdateProfileName(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingAvatarFile(null);
  };

  const handleAvatarUpload = async (profileId: string, file: File) => {
    if (onUpdateProfileAvatar) {
      setUploadingAvatarId(profileId);
      try {
        await onUpdateProfileAvatar(profileId, file);
      } finally {
        setUploadingAvatarId(null);
        setEditingAvatarFile(null);
      }
    }
  };

  const handleAvatarDelete = async (profileId: string) => {
    if (onDeleteProfileAvatar && confirm('¿Eliminar la foto de perfil?')) {
      setUploadingAvatarId(profileId);
      try {
        await onDeleteProfileAvatar(profileId);
      } finally {
        setUploadingAvatarId(null);
      }
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md card-minimal rounded-xl p-6 z-50 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-foreground">
              Gestionar Perfiles
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="p-4 rounded-lg border border-border hover:bg-foreground/5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar Section */}
                  <div className="flex-shrink-0">
                    {editingId === profile.id ? (
                      <AvatarUpload
                        currentAvatarUrl={profile.avatarUrl}
                        onUpload={(file) => handleAvatarUpload(profile.id, file)}
                        onDelete={profile.avatarUrl ? () => handleAvatarDelete(profile.id) : undefined}
                        isUploading={uploadingAvatarId === profile.id}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border bg-foreground/5 flex items-center justify-center">
                        {profile.avatarUrl ? (
                          <Image
                            src={profile.avatarUrl}
                            alt={profile.name}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: profile.color + '20' }}
                          >
                            <User className="w-8 h-8" style={{ color: profile.color }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile Info and Actions */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      {editingId === profile.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="flex-1 px-2 py-1 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm mr-2"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: profile.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{profile.name}</p>
                            {profile.id === activeProfileId && (
                              <p className="text-xs text-muted-foreground">Activo</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-1 flex-shrink-0">
                        {editingId === profile.id ? (
                          <>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 rounded-md hover:bg-muted transition-colors"
                            >
                              <X className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {onUpdateProfileName && (
                              <button
                                onClick={() => handleStartEdit(profile)}
                                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                                title="Editar perfil"
                              >
                                <Edit2 className="w-4 h-4 text-muted-foreground" />
                              </button>
                            )}
                            {profiles.length > 1 && (
                              <button
                                onClick={() => handleDelete(profile.id)}
                                className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                                disabled={profile.id === activeProfileId && profiles.length === 1}
                                title="Eliminar perfil"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-border hover:bg-foreground/5 transition-colors"
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Crear Nuevo Perfil</span>
            </button>
          ) : (
            <div className="space-y-4 p-4 rounded-lg border border-border bg-foreground/5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre del Perfil
                </label>
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Ej: Mi Pareja, Compartidos"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {PROFILE_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        selectedColor === color ? 'scale-125 ring-2 ring-foreground' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Foto de Perfil (Opcional)
                </label>
                <div className="flex justify-center">
                  <AvatarUpload
                    onUpload={(file) => setNewProfileAvatar(file)}
                    onDelete={() => setNewProfileAvatar(null)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewProfileName('');
                    setSelectedColor(PROFILE_COLORS[0]);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newProfileName.trim()}
                  className="flex-1 px-4 py-2 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
