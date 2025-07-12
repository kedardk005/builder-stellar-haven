import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Database, Users, Package, ShoppingCart, Info, AlertCircle, CheckCircle } from 'lucide-react';

interface DemoStatus {
  isDemoDataPresent: boolean;
  stats: {
    demoUsers: number;
    totalItems: number;
    totalOrders: number;
  };
  demoAccounts?: Array<{
    email: string;
    role: string;
    password: string;
  }>;
}

interface DemoInfo {
  message: string;
  description: string;
  features: string[];
  demoAccounts: {
    admin: {
      email: string;
      password: string;
      role: string;
      description: string;
    };
    users: Array<{
      email: string;
      password: string;
      name: string;
      description: string;
    }>;
  };
  instructions: string[];
  endpoints: Record<string, string>;
}

export const DemoDataManager: React.FC = () => {
  const [demoStatus, setDemoStatus] = useState<DemoStatus | null>(null);
  const [demoInfo, setDemoInfo] = useState<DemoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    checkDemoStatus();
    fetchDemoInfo();
  }, []);

  const checkDemoStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/demo/status');
      const data = await response.json();
      
      if (data.success) {
        setDemoStatus(data);
      }
    } catch (error) {
      console.error('Error checking demo status:', error);
      setMessage({ type: 'error', text: 'Failed to check demo status' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDemoInfo = async () => {
    try {
      const response = await fetch('/api/demo/info');
      const data = await response.json();
      
      if (data.success) {
        setDemoInfo(data);
      }
    } catch (error) {
      console.error('Error fetching demo info:', error);
    }
  };

  const seedDemoData = async () => {
    try {
      setSeeding(true);
      setMessage(null);
      
      const response = await fetch('/api/demo/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: `Demo data seeded successfully! Created ${data.users} users, ${data.items} items, ${data.orders} orders, and ${data.reviews} reviews.` });
        await checkDemoStatus();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to seed demo data' });
      }
    } catch (error) {
      console.error('Error seeding demo data:', error);
      setMessage({ type: 'error', text: 'Failed to seed demo data' });
    } finally {
      setSeeding(false);
    }
  };

  const clearDemoData = async () => {
    if (!window.confirm('Are you sure you want to clear all demo data? This action cannot be undone.')) {
      return;
    }

    try {
      setClearing(true);
      setMessage(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/demo/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Demo data cleared successfully!' });
        await checkDemoStatus();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to clear demo data' });
      }
    } catch (error) {
      console.error('Error clearing demo data:', error);
      setMessage({ type: 'error', text: 'Failed to clear demo data' });
    } finally {
      setClearing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: 'Copied to clipboard!' });
    setTimeout(() => setMessage(null), 2000);
  };

  if (loading && !demoStatus) {
    return (
      <div className=\"flex items-center justify-center p-8\">
        <Loader2 className=\"h-8 w-8 animate-spin\" />
        <span className=\"ml-2\">Checking demo status...</span>
      </div>
    );
  }

  return (
    <div className=\"space-y-6 p-6\">
      <div className=\"text-center\">
        <h1 className=\"text-3xl font-bold tracking-tight\">ReWear Demo Environment</h1>
        <p className=\"text-muted-foreground mt-2\">
          Manage demo data for testing and demonstration purposes
        </p>
      </div>

      {message && (
        <Alert className={message.type === 'error' ? 'border-destructive' : 'border-green-500'}>
          {message.type === 'error' ? (
            <AlertCircle className=\"h-4 w-4\" />
          ) : (
            <CheckCircle className=\"h-4 w-4\" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Demo Status */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            <Database className=\"h-5 w-5\" />
            Demo Data Status
          </CardTitle>
          <CardDescription>
            Current state of demo data in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {demoStatus && (
            <div className=\"space-y-4\">
              <div className=\"flex items-center gap-4\">
                <Badge variant={demoStatus.isDemoDataPresent ? 'default' : 'secondary'}>
                  {demoStatus.isDemoDataPresent ? 'Demo Data Present' : 'No Demo Data'}
                </Badge>
              </div>
              
              <div className=\"grid grid-cols-3 gap-4 text-sm\">
                <div className=\"flex items-center gap-2\">
                  <Users className=\"h-4 w-4 text-muted-foreground\" />
                  <span>{demoStatus.stats.demoUsers} Demo Users</span>
                </div>
                <div className=\"flex items-center gap-2\">
                  <Package className=\"h-4 w-4 text-muted-foreground\" />
                  <span>{demoStatus.stats.totalItems} Items</span>
                </div>
                <div className=\"flex items-center gap-2\">
                  <ShoppingCart className=\"h-4 w-4 text-muted-foreground\" />
                  <span>{demoStatus.stats.totalOrders} Orders</span>
                </div>
              </div>

              <div className=\"flex gap-2\">
                <Button 
                  onClick={seedDemoData} 
                  disabled={seeding}
                  variant={demoStatus.isDemoDataPresent ? \"outline\" : \"default\"}
                >
                  {seeding ? (
                    <>
                      <Loader2 className=\"mr-2 h-4 w-4 animate-spin\" />
                      Seeding...
                    </>
                  ) : (
                    `${demoStatus.isDemoDataPresent ? 'Re-seed' : 'Seed'} Demo Data`
                  )}
                </Button>
                
                {demoStatus.isDemoDataPresent && (
                  <Button 
                    onClick={clearDemoData} 
                    disabled={clearing}
                    variant=\"destructive\"
                  >
                    {clearing ? (
                      <>
                        <Loader2 className=\"mr-2 h-4 w-4 animate-spin\" />
                        Clearing...
                      </>
                    ) : (
                      'Clear Demo Data'
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Demo Accounts */}
      {demoStatus?.demoAccounts && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <Users className=\"h-5 w-5\" />
              Demo Accounts
            </CardTitle>
            <CardDescription>
              Available demo accounts for testing (Password: demo123)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-3\">
              {demoStatus.demoAccounts.map((account, index) => (
                <div 
                  key={index}
                  className=\"flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer\"
                  onClick={() => copyToClipboard(account.email)}
                >
                  <div className=\"flex items-center gap-3\">
                    <Badge variant={account.role === 'admin' ? 'default' : 'secondary'}>
                      {account.role}
                    </Badge>
                    <span className=\"font-medium\">{account.email}</span>
                  </div>
                  <span className=\"text-sm text-muted-foreground\">Click to copy</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Information */}
      {demoInfo && (
        <Card>
          <CardHeader>
            <CardTitle className=\"flex items-center gap-2\">
              <Info className=\"h-5 w-5\" />
              Demo Information
            </CardTitle>
            <CardDescription>
              Features and instructions for the demo environment
            </CardDescription>
          </CardHeader>
          <CardContent className=\"space-y-4\">
            <div>
              <h4 className=\"font-semibold mb-2\">Features Available:</h4>
              <div className=\"grid grid-cols-2 gap-2 text-sm\">
                {demoInfo.features.map((feature, index) => (
                  <div key={index} className=\"flex items-center gap-2\">
                    <CheckCircle className=\"h-3 w-3 text-green-500\" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className=\"font-semibold mb-2\">Instructions:</h4>
              <ol className=\"list-decimal list-inside space-y-1 text-sm text-muted-foreground\">
                {demoInfo.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            {demoInfo.demoAccounts.users.length > 0 && (
              <div>
                <h4 className=\"font-semibold mb-2\">User Profiles:</h4>
                <div className=\"space-y-2\">
                  {demoInfo.demoAccounts.users.map((user, index) => (
                    <div key={index} className=\"border rounded p-3 text-sm\">
                      <div className=\"flex items-center justify-between mb-1\">
                        <span className=\"font-medium\">{user.name}</span>
                        <Badge variant=\"outline\">{user.email}</Badge>
                      </div>
                      <p className=\"text-muted-foreground\">{user.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DemoDataManager;