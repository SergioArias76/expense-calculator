'use client';

import { useState } from 'react';
import { useAuth } from './auth-provider';
import { Mail, LogIn, Loader2 } from 'lucide-react';

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el link');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen minimalist-bg flex items-center justify-center p-4">
        <div className="card-minimal rounded-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            ¡Revisa tu email!
          </h2>
          <p className="text-muted-foreground mb-6">
            Te enviamos un link mágico a <strong>{email}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Haz click en el link para iniciar sesión. Puede tardar unos minutos en llegar.
          </p>
          <button
            onClick={() => {
              setSent(false);
              setEmail('');
            }}
            className="mt-6 text-sm text-primary hover:underline"
          >
            Usar otro email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen minimalist-bg flex items-center justify-center p-4">
      <div className="card-minimal rounded-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Calculadora de Gastos
          </h1>
          <p className="text-muted-foreground">
            Inicia sesión para acceder a tus datos desde cualquier dispositivo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Enviar Link Mágico
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Te enviaremos un link por email para iniciar sesión sin contraseña
        </p>
      </div>
    </div>
  );
}
