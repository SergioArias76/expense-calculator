'use client';

import { Profile } from '@/lib/types';
import { ChevronDown, Plus, Settings, User } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ProfileSelectorProps {
  profiles: Profile[];
  activeProfileId: string;
  onProfileChange: (profileId: string) => void;
  onManageProfiles: () => void;
}

export function ProfileSelector({ 
  profiles, 
  activeProfileId, 
  onProfileChange,
  onManageProfiles 
}: ProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors border border-border"
      >
        {activeProfile?.avatarUrl ? (
          <div className="w-6 h-6 rounded-full overflow-hidden border border-border">
            <Image
              src={activeProfile.avatarUrl}
              alt={activeProfile.name}
              width={24}
              height={24}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: activeProfile?.color + '20' }}
          >
            <User className="w-4 h-4" style={{ color: activeProfile?.color }} />
          </div>
        )}
        <span className="font-medium text-foreground">{activeProfile?.name}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 w-56 card-minimal rounded-lg shadow-lg border border-border z-20 overflow-hidden">
            <div className="p-2">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => {
                    onProfileChange(profile.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    profile.id === activeProfileId 
                      ? 'bg-foreground/10' 
                      : 'hover:bg-foreground/5'
                  }`}
                >
                  {profile.avatarUrl ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border flex-shrink-0">
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.name}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                      style={{ backgroundColor: profile.color + '20' }}
                    >
                      <User className="w-5 h-5" style={{ color: profile.color }} />
                    </div>
                  )}
                  <span className="font-medium text-foreground text-sm flex-1">{profile.name}</span>
                  {profile.id === activeProfileId && (
                    <span className="ml-auto text-xs text-muted-foreground">✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-border p-2">
              <button
                onClick={() => {
                  onManageProfiles();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-foreground/5 transition-colors text-sm"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground">Gestionar Perfiles</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
