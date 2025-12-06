'use client';

import { Profile } from '@/lib/types';
import { User, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProfileSelectionScreenProps {
  profiles: Profile[];
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: () => void;
  isLoading?: boolean;
}

export function ProfileSelectionScreen({ 
  profiles, 
  onSelectProfile, 
  onCreateProfile,
  isLoading = false
}: ProfileSelectionScreenProps) {
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null);

  return (
    <div className="min-h-screen minimalist-bg flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            ¿Quién desea ver sus gastos?
          </h1>
          <p className="text-muted-foreground text-lg">
            Selecciona tu perfil para continuar
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onSelectProfile(profile.id)}
              onMouseEnter={() => setHoveredProfile(profile.id)}
              onMouseLeave={() => setHoveredProfile(null)}
              className="group flex flex-col items-center gap-4 transition-transform hover:scale-105 focus:outline-none"
            >
              <div 
                className={`
                  w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 transition-all duration-300
                  ${hoveredProfile === profile.id ? 'border-foreground shadow-xl' : 'border-transparent'}
                `}
                style={{ 
                  backgroundColor: profile.avatarUrl ? 'transparent' : (profile.color + '20') 
                }}
              >
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User 
                    className="w-16 h-16 transition-colors duration-300" 
                    style={{ 
                      color: hoveredProfile === profile.id ? 'var(--foreground)' : profile.color 
                    }} 
                  />
                )}
              </div>
              <span className={`
                text-xl font-medium transition-colors duration-300
                ${hoveredProfile === profile.id ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                {profile.name}
              </span>
            </button>
          ))}

          <button
            onClick={onCreateProfile}
            className="group flex flex-col items-center gap-4 transition-transform hover:scale-105 focus:outline-none"
          >
            <div className="w-32 h-32 rounded-full flex items-center justify-center border-4 border-transparent bg-foreground/5 group-hover:bg-foreground/10 group-hover:border-foreground transition-all duration-300">
              <Plus className="w-12 h-12 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
            <span className="text-xl font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Agregar Perfil
            </span>
          </button>
        </div>

        {isLoading && (
          <div className="mt-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
