import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

const schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (!isLogin) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', data.email)
          .single();

        if (existingUser) {
          toast({
            title: 'Email already registered',
            description: 'This email is already registered. Please log in instead.',
            variant: 'destructive'
          });
          setIsLogin(true);
          return;
        }
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password
        });
        if (error) {
          let errorMessage = 'An error occurred during login';
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (error.message.includes('Email not confirmed')) {
            errorMessage = 'Please verify your email address before logging in.';
          } else if (error.message.includes('Too many requests')) {
            errorMessage = 'Too many login attempts. Please try again later.';
          }
          toast.error(errorMessage);
        } else {
          toast({
            title: '👋 Welcome back!',
            description: 'Successfully logged in to your account'
          });
        }
      } else {
        const { error, data: { user } } = await supabase.auth.signUp({
          email: data.email,
          password: data.password, 
          options: {
            data: {
              full_name: data.fullName,
            },
          },
        });
        if (error) {
          let errorMessage = 'Failed to create account';
          if (error.message.includes('Password')) {
            errorMessage = 'Password must be at least 6 characters long';
          } else if (error.message.includes('email')) {
            errorMessage = 'Please enter a valid email address';
          }
          toast.error(errorMessage);
        }
        
        if (user) {
          setIsLogin(true); 
          toast({
            title: '✨ Account created successfully!',
            description: 'Please check your email to verify your account before logging in.',
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen animate-in fade-in duration-500">
      <Card className="p-6 w-full max-w-sm mx-auto shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-full">
            <Receipt className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold">SubTrackr</h1>
            <h2 className="text-xl font-semibold">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...register('fullName')}
                className={`transition-colors duration-200 ${
                  errors.fullName ? 'border-destructive' : ''
                }`}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`transition-colors duration-200 ${
                errors.email ? 'border-destructive' : ''
              }`}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="At least 6 characters"
              {...register('password')}
              error={!!errors.password}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              isLogin ? 'Log in' : 'Sign up'
            )}
          </Button>

          <Button
            type="button" 
            variant="ghost"
            className="w-full text-sm hover:bg-secondary/80 transition-all duration-200"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </Button>
          
          {isLogin && (
            <Button
              type="button"
              variant="link"
              className="w-full text-sm text-muted-foreground hover:text-primary transition-all duration-200"
            >
              Forgot your password?
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
}