'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BranchLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    branch: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock branch data for login
  const branches = [
    { id: 1, name: "Downtown Premium", email: "downtown@premiumcuts.com", password: "Dt2025!Secure" },
    { id: 2, name: "Midtown Elite", email: "midtown@premiumcuts.com", password: "Mt2025!Secure" },
    { id: 3, name: "Uptown Luxury", email: "uptown@premiumcuts.com", password: "Ut2025!Secure" },
    { id: 4, name: "Suburban Comfort", email: "suburban@premiumcuts.com", password: "Sb2025!Secure" },
    { id: 5, name: "Westside Modern", email: "westside@premiumcuts.com", password: "Ws2025!Secure" },
    { id: 6, name: "Eastside Classic", email: "eastside@premiumcuts.com", password: "Es2025!Secure" },
    { id: 7, name: "Northgate Plaza", email: "northgate@premiumcuts.com", password: "Ng2025!Secure" },
    { id: 8, name: "Southpoint Mall", email: "southpoint@premiumcuts.com", password: "Sp2025!Secure" }
  ];

  const handleBranchChange = (branchName: string) => {
    const branch = branches.find(b => b.name === branchName);
    if (branch) {
      setFormData({
        ...formData,
        branch: branchName,
        email: branch.email
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - in real app, this would call an API
    const branch = branches.find(b => b.name === formData.branch);
    if (branch && branch.email === formData.email && branch.password === formData.password) {
      // Store branch info in localStorage (in real app, use proper auth)
      localStorage.setItem('branchAuth', JSON.stringify({
        branchId: branch.id,
        branchName: branch.name,
        email: branch.email,
        role: 'branch_admin'
      }));

      // Redirect to branch dashboard
      router.push(`/branch/${branch.id}/dashboard`);
    } else {
      alert('Invalid credentials. Please check your branch, email, and password.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif text-primary">Branch Portal</CardTitle>
          <CardDescription>
            Sign in to your branch management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="branch">Select Branch</Label>
              <Select value={formData.branch} onValueChange={handleBranchChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="branch@premiumcuts.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In to Branch Portal"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Branch Portal Access</h4>
            <p className="text-xs text-blue-700">
              Each branch has its own dedicated portal for managing daily operations,
              staff scheduling, customer bookings, and performance tracking.
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => router.push('/login')} className="text-sm">
              ← Back to Main Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}