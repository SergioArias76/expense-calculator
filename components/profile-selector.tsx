'use client';

import { Profile } from '@/lib/types';
import { ChevronDown, Plus, Settings } from 'lucide-react';
import { useState } from 'react';

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
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: activeProfile?.color }}
        />
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
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: profile.color }}
                  />
                  <span className="font-medium text-foreground text-sm">{profile.name}</span>
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
