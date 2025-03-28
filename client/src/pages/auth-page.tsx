import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema } from '@shared/schema';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fadeIn, slideUp } from '@/utils/animation-utils';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  displayName: z.string().min(1, "Display name is required"),
  grade: z.coerce.number().min(1).max(4)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      grade: 1
    }
  });
  
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Login successful",
          description: `Welcome back, ${values.username}!`,
        });
      }
    });
  };
  
  const onRegisterSubmit = (values: RegisterFormValues) => {
    // Need to remove confirmPassword as it's not in the database schema
    const { confirmPassword, ...registerData } = values;
    
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        toast({
          title: "Registration successful",
          description: `Welcome to AnimaLearn, ${values.displayName}!`,
        });
      }
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background py-12 px-4 sm:px-6">
      <motion.div 
        className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 md:w-1/2"
        {...fadeIn}
      >
        <div className="mx-auto w-full max-w-md">
          <motion.div className="text-center mb-8" {...slideUp}>
            <div className="w-20 h-20 rounded-full bg-primary mx-auto flex items-center justify-center mb-4">
              <span className="text-white font-heading font-bold text-3xl">A</span>
            </div>
            <h2 className="font-heading font-bold text-3xl text-primary">AnimaLearn</h2>
            <p className="mt-2 text-gray-600">Interactive Math Learning for Grades 1-4</p>
          </motion.div>

          <motion.div {...slideUp} transition={{ delay: 0.1 }}>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Login to Your Account</CardTitle>
                    <CardDescription>Enter your credentials to access your learning journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Your username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Logging in...
                            </>
                          ) : "Login"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab("register")}
                    >
                      Don't have an account? Register
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Create a New Account</CardTitle>
                    <CardDescription>Join AnimaLearn and start your learning adventure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="grade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Grade</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                >
                                  <option value={1}>Grade 1</option>
                                  <option value={2}>Grade 2</option>
                                  <option value={3}>Grade 3</option>
                                  <option value={4}>Grade 4</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Choose a password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Repeat your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : "Register"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab("login")}
                    >
                      Already have an account? Login
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="hidden md:flex md:w-1/2 bg-primary rounded-l-3xl overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col justify-center items-center p-12 text-white">
          <motion.div 
            className="w-24 h-24 mb-6"
            animate={{ 
              y: [0, -10, 0],
              transition: { 
                repeat: Infinity, 
                duration: 2,
                repeatType: "mirror"
              }
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#FFD166" />
              <circle cx="35" cy="40" r="8" fill="white" />
              <circle cx="35" cy="40" r="4" fill="#333" />
              <circle cx="65" cy="40" r="8" fill="white" />
              <circle cx="65" cy="40" r="4" fill="#333" />
              <path d="M30 65 Q50 85 70 65" stroke="#333" strokeWidth="4" fill="none" />
            </svg>
          </motion.div>
          
          <h2 className="text-4xl font-heading font-bold mb-4">Discover Math Adventures!</h2>
          <p className="text-lg text-center mb-8">Explore exciting islands of knowledge and learn through fun, interactive lessons.</p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-heading font-bold mb-2">Animated Lessons</h3>
              <p className="text-sm">Engaging content that makes learning math concepts easy and fun</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-heading font-bold mb-2">Interactive Practice</h3>
              <p className="text-sm">Hands-on activities to reinforce learning and build confidence</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-heading font-bold mb-2">Virtual Teaching</h3>
              <p className="text-sm">Become the teacher and solidify your understanding</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-heading font-bold mb-2">Progress Tracking</h3>
              <p className="text-sm">Watch your knowledge grow with each completed lesson</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
