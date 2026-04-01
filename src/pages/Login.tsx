import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Leaf } from 'lucide-react';
import { auth } from '../lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { __dev_setRole } = useAuth(); // For dev/mock testing

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // If we are in MOCK_MODE, we will intercept "dev" logins to test UI
      if (email.startsWith('dev_')) {
        const fakeRole = email.split('_')[1].split('@')[0] as Role;
        __dev_setRole(fakeRole);
        navigate(`/${fakeRole}`);
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      // Let the AuthContext redirection handle navigation if real auth is used
      navigate('/household'); 
    } catch (err: any) {
      setError(err?.message || 'Failed to login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4 relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass shadow-2xl border-white/40">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Leaf className="h-8 w-8 text-secondary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Smart Waste 360
            </CardTitle>
            <CardDescription className="text-base mt-2 text-gray-600">
              Sign in to manage your waste ecosystem.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <div className="text-xs text-gray-500 mt-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <p className="font-semibold mb-1">Developer Fast Login:</p>
                <p>Use email format: <code>dev_{"{role}"}@test.com</code></p>
                <p>Roles: household, collector, officer, admin, dept</p>
                <p>Password: any</p>
              </div>

            </CardContent>
            <CardFooter className="pt-2 pb-8">
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
