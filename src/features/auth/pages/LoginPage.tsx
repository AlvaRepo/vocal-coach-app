import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/shared/api/supabase-client';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { useAuthStore } from '@/shared/stores/auth-store';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';
import { CoroBlackLogo } from '@/shared/components/ui/icons/CoroBlackLogo';
import { SoulPulse } from '@/shared/components/ui/icons/SoulPulse';
import { FrequencySoul } from '@/shared/components/ui/icons/FrequencySoul';
import { VocalFold } from '@/shared/components/ui/icons/VocalFold';
import { ResonanceFork } from '@/shared/components/ui/icons/ResonanceFork';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore(state => state.setSession);
  const from = location.state?.from?.pathname || '/';

  const handleDevBypass = () => {
    // Simulamos una sesión exitosa para saltar el rate limit de Supabase en desarrollo
    const mockSession = {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'dev-user-id',
        email: 'invitado-dev@vocalcoach.io',
        app_metadata: {},
        user_metadata: { full_name: 'Invitado Dev' },
        aud: 'authenticated',
        created_at: new Date().toISOString()
      }
    } as any;

    setSession(mockSession);
    navigate(from, { replace: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Revisá tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      
      if (data.user && data.session) {
        navigate(from, { replace: true });
      } else {
        setError('Registro exitoso. Revisá tu email para confirmar la cuenta o intenta iniciar sesión si la confirmación está desactivada.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8 overflow-hidden relative font-sans">
      <style>
        {`
          @keyframes float-gentle {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-float-slow {
            animation: float-gentle 8s ease-in-out infinite;
          }
          .animate-float-slower {
            animation: float-gentle 12s ease-in-out infinite reverse;
          }
          .animate-gradient-slow {
            animation: gradient-move 6s ease infinite;
          }
        `}
      </style>
      {/* Background Decor - Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
         
         {/* Floating Background Icons */}
         <div className="absolute top-[10%] left-[8%] opacity-20 animate-in fade-in duration-1000 delay-300 animate-float-slow">
            <SoulPulse size={180} isAnimated className="rotate-[-10deg]" />
         </div>
         
         <div className="absolute bottom-[15%] right-[8%] opacity-15 animate-in fade-in duration-1000 delay-500 animate-float-slower">
            <FrequencySoul size={220} isAnimated className="rotate-[15deg]" />
         </div>

         <div className="absolute top-[55%] left-[-8%] opacity-10 animate-in fade-in duration-1000 delay-700 animate-float-slow">
            <VocalFold size={280} isAnimated className="rotate-[30deg]" />
         </div>

         <div className="absolute top-[5%] right-[5%] opacity-10 animate-in fade-in duration-1000 delay-200 animate-float-slower">
            <ResonanceFork size={200} isAnimated className="rotate-[-15deg]" />
         </div>
      </div>

      <Card className="w-full max-w-md border-border/40 bg-card/60 backdrop-blur-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="mx-auto flex w-fit items-center justify-center overflow-visible">
            <CoroBlackLogo size={160} isAnimated />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-display font-bold tracking-tight bg-gradient-to-r from-[#00ACBC] via-white to-[#C933FF] bg-[length:200%_auto] animate-gradient-slow bg-clip-text text-transparent">
              Vocal Coach Admin
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium tracking-wide">
              {isRegistering 
                ? 'Creá tu cuenta de administrador.' 
                : 'Bienvenido de nuevo. Ingresá al alma del sistema.'}
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={isRegistering ? handleRegister : handleLogin} noValidate>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {isRegistering ? 'Email Profesional' : 'Email'}
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Contraseña
                </Label>
              </div>
              <div className="relative group">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-6 pt-2">
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all bg-primary hover:bg-primary/90" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2 italic">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  {isRegistering ? 'Creando cuenta...' : 'Conectando...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
                </div>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline transition-all"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering 
                  ? '¿Ya tenés cuenta? Iniciá sesión' 
                  : '¿No tenés cuenta? Registrate como administrador'}
              </button>
            </div>

            {import.meta.env.DEV && (
              <div className="w-full pt-2">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-bold tracking-widest text-[9px]">
                      Zona de Emergencia (Dev)
                    </span>
                  </div>
                </div>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/10 transition-all font-bold gap-2 text-xs"
                  onClick={handleDevBypass}
                >
                  <ShieldAlert className="h-4 w-4" />
                  Entrar como Invitado (Bypass)
                </Button>
                <p className="text-[9px] text-center text-muted-foreground mt-2 italic">
                  Usa esto si Supabase te da "rate limit exceeded"
                </p>
              </div>
            )}

            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">
              Vocal Coach Dashboard &copy; {new Date().getFullYear()}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
