import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  ServerIcon,
  CpuChipIcon,
  ServerIcon as HardDriveIcon,
  WifiIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  EyeIcon,
  DocumentTextIcon,
  CloudIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  BellIcon,
  WrenchScrewdriverIcon,
  ServerIcon as DatabaseIcon,
  GlobeAltIcon,
  BoltIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
} from '@heroicons/react/24/outline';

// Types for the System component
interface SystemMetrics {
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: {
    incoming: number;
    outgoing: number;
  };
  activeConnections: number;
  responseTime: number;
  errorRate: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  source: string;
  user?: string;
  ip?: string;
}

interface ApiEndpoint {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastChecked: string;
  endpoint: string;
}

interface BackupJob {
  id: string;
  name: string;
  type: 'database' | 'files' | 'full';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  createdAt: string;
  size?: string;
  duration?: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface SystemProps {
  // Props can be added here if needed for data passing
}

const System: React.FC<SystemProps> = () => {
  // State for system data
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    uptime: '7d 14h 32m',
    cpuUsage: 45.2,
    memoryUsage: 68.7,
    diskUsage: 234.5,
    networkTraffic: {
      incoming: 1250,
      outgoing: 890,
    },
    activeConnections: 1247,
    responseTime: 245,
    errorRate: 0.02,
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2025-12-07T14:32:15Z',
      level: 'error',
      message: 'Database connection timeout on property search API',
      source: 'api-server',
      ip: '192.168.1.100',
    },
    {
      id: '2',
      timestamp: '2025-12-07T14:28:42Z',
      level: 'warning',
      message: 'High memory usage detected (85% utilization)',
      source: 'system-monitor',
    },
    {
      id: '3',
      timestamp: '2025-12-07T14:25:18Z',
      level: 'info',
      message: 'Scheduled database backup completed successfully',
      source: 'backup-service',
    },
    {
      id: '4',
      timestamp: '2025-12-07T14:20:33Z',
      level: 'info',
      message: 'User authentication successful',
      source: 'auth-service',
      user: 'admin@ragdol.com',
      ip: '203.0.113.195',
    },
  ]);

  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>([
    {
      name: 'Property API',
      status: 'operational',
      responseTime: 245,
      uptime: 99.9,
      lastChecked: '2025-12-07T14:35:00Z',
      endpoint: '/api/properties',
    },
    {
      name: 'User API',
      status: 'operational',
      responseTime: 189,
      uptime: 99.8,
      lastChecked: '2025-12-07T14:35:00Z',
      endpoint: '/api/users',
    },
    {
      name: 'Search API',
      status: 'operational',
      responseTime: 312,
      uptime: 99.7,
      lastChecked: '2025-12-07T14:35:00Z',
      endpoint: '/api/search',
    },
    {
      name: 'Payment API',
      status: 'degraded',
      responseTime: 1247,
      uptime: 97.2,
      lastChecked: '2025-12-07T14:35:00Z',
      endpoint: '/api/payments',
    },
  ]);

  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([
    {
      id: '1',
      name: 'Daily Database Backup',
      type: 'database',
      status: 'completed',
      createdAt: '2025-12-07T02:00:00Z',
      size: '2.4GB',
      duration: '15m 32s',
    },
    {
      id: '2',
      name: 'Weekly Full Backup',
      type: 'full',
      status: 'scheduled',
      createdAt: '2025-12-10T02:00:00Z',
    },
    {
      id: '3',
      name: 'File System Backup',
      type: 'files',
      status: 'running',
      createdAt: '2025-12-07T14:30:00Z',
    },
  ]);

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'error',
      title: 'Database Connection Issue',
      message: 'Multiple connection timeouts detected in the last hour',
      timestamp: '2025-12-07T14:32:15Z',
      resolved: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Memory utilization exceeded 80% threshold',
      timestamp: '2025-12-07T14:28:42Z',
      resolved: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Backup Completed',
      message: 'Scheduled database backup finished successfully',
      timestamp: '2025-12-07T14:25:18Z',
      resolved: true,
    },
  ]);

  // State for UI management
  const [activeSection, setActiveSection] = useState<'overview' | 'monitoring' | 'logs' | 'maintenance' | 'backups' | 'alerts'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLogLevel, setSelectedLogLevel] = useState<'all' | 'error' | 'warning' | 'info' | 'debug'>('all');
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh system metrics
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        responseTime: Math.max(50, Math.min(2000, prev.responseTime + (Math.random() - 0.5) * 100)),
        activeConnections: Math.max(0, prev.activeConnections + Math.floor((Math.random() - 0.5) * 50)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter logs based on level and search term
  const filteredLogs = logs.filter(log => {
    const matchesLevel = selectedLogLevel === 'all' || log.level === selectedLogLevel;
    const matchesSearch = log.message.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
                         (log.user && log.user.toLowerCase().includes(logSearchTerm.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  // Maintenance action handlers
  const handleMaintenanceAction = async (action: string) => {
    setIsLoading(true);
    try {
      // Simulate maintenance action
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${action} completed successfully!`);
    } catch (error) {
      alert(`Failed to ${action.toLowerCase()}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async (type: 'database' | 'files' | 'full') => {
    setIsLoading(true);
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      const newBackup: BackupJob = {
        id: Date.now().toString(),
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Backup`,
        type,
        status: 'running',
        createdAt: new Date().toISOString(),
      };
      setBackupJobs(prev => [newBackup, ...prev]);
      alert('Backup job started successfully!');
    } catch (error) {
      alert('Failed to create backup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setSystemAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  // Format bytes to human readable
  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }
    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'completed':
        return 'text-green-500';
      case 'degraded':
      case 'warning':
        return 'text-yellow-500';
      case 'down':
      case 'error':
      case 'failed':
        return 'text-red-500';
      case 'running':
        return 'text-blue-500';
      default:
        return 'text-muted-foreground';
    }
  };

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{systemMetrics.uptime}</p>
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <CpuChipIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{systemMetrics.cpuUsage.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">CPU Usage</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${systemMetrics.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 rounded-lg">
                    <HardDriveIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{systemMetrics.memoryUsage.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Memory Usage</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          systemMetrics.memoryUsage > 80 ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${systemMetrics.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <WifiIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{systemMetrics.activeConnections}</p>
                    <p className="text-sm text-muted-foreground">Active Connections</p>
                  </div>
                </div>
              </div>
            </div>

            {/* API Status */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5" />
                API Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {apiEndpoints.map((api, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{api.name}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        api.status === 'operational' ? 'bg-green-500/10 text-green-500' :
                        api.status === 'degraded' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {api.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Response: {api.responseTime}ms</p>
                    <p className="text-sm text-muted-foreground">Uptime: {api.uptime}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BellIcon className="h-5 w-5" />
                Recent Alerts
              </h3>
              <div className="space-y-3">
                {systemAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      alert.type === 'error' ? 'bg-red-500/10' :
                      alert.type === 'warning' ? 'bg-yellow-500/10' :
                      'bg-blue-500/10'
                    }`}>
                      {alert.type === 'error' ? <ExclamationTriangleIcon className="h-4 w-4 text-red-500" /> :
                       alert.type === 'warning' ? <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" /> :
                       <CheckCircleIcon className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Real-time Monitoring</h3>
                <p className="text-muted-foreground">Live system performance metrics</p>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-foreground">Auto-refresh</span>
              </label>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="font-semibold text-foreground mb-4">CPU & Memory Usage</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>{systemMetrics.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${systemMetrics.cpuUsage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>{systemMetrics.memoryUsage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          systemMetrics.memoryUsage > 80 ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${systemMetrics.memoryUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="font-semibold text-foreground mb-4">Network Traffic</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Incoming</span>
                    <span className="font-semibold">{formatBytes(systemMetrics.networkTraffic.incoming)}/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Outgoing</span>
                    <span className="font-semibold">{formatBytes(systemMetrics.networkTraffic.outgoing)}/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Connections</span>
                    <span className="font-semibold">{systemMetrics.activeConnections}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-4">System Health</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                    systemMetrics.responseTime < 500 ? 'bg-green-500/10' :
                    systemMetrics.responseTime < 1000 ? 'bg-yellow-500/10' :
                    'bg-red-500/10'
                  }`}>
                    <BoltIcon className={`h-8 w-8 ${
                      systemMetrics.responseTime < 500 ? 'text-green-500' :
                      systemMetrics.responseTime < 1000 ? 'text-yellow-500' :
                      'text-red-500'
                    }`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{systemMetrics.responseTime}ms</p>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                </div>

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                    systemMetrics.errorRate < 0.01 ? 'bg-green-500/10' :
                    systemMetrics.errorRate < 0.05 ? 'bg-yellow-500/10' :
                    'bg-red-500/10'
                  }`}>
                    <ShieldCheckIcon className={`h-8 w-8 ${
                      systemMetrics.errorRate < 0.01 ? 'text-green-500' :
                      systemMetrics.errorRate < 0.05 ? 'text-yellow-500' :
                      'text-red-500'
                    }`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{(systemMetrics.errorRate * 100).toFixed(2)}%</p>
                  <p className="text-sm text-muted-foreground">Error Rate</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 bg-blue-500/10">
                    <DatabaseIcon className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{formatBytes(systemMetrics.diskUsage * 1024 * 1024)}</p>
                  <p className="text-sm text-muted-foreground">Database Size</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">System Logs</h3>
                <p className="text-muted-foreground">Monitor system events and activities</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedLogLevel}
                  onChange={(e) => setSelectedLogLevel(e.target.value as typeof selectedLogLevel)}
                  className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="error">Errors</option>
                  <option value="warning">Warnings</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={logSearchTerm}
                  onChange={(e) => setLogSearchTerm(e.target.value)}
                  className="px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <div className="divide-y divide-border">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded ${
                          log.level === 'error' ? 'bg-red-500/10' :
                          log.level === 'warning' ? 'bg-yellow-500/10' :
                          log.level === 'info' ? 'bg-blue-500/10' :
                          'bg-gray-500/10'
                        }`}>
                          {log.level === 'error' ? <ExclamationTriangleIcon className="h-4 w-4 text-red-500" /> :
                           log.level === 'warning' ? <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" /> :
                           log.level === 'info' ? <CheckCircleIcon className="h-4 w-4 text-blue-500" /> :
                           <DocumentTextIcon className="h-4 w-4 text-gray-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              log.level === 'error' ? 'bg-red-500/10 text-red-500' :
                              log.level === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                              log.level === 'info' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-gray-500/10 text-gray-500'
                            }`}>
                              {log.level.toUpperCase()}
                            </span>
                            <span className="text-sm text-muted-foreground">{log.source}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-foreground">{log.message}</p>
                          {(log.user || log.ip) && (
                            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                              {log.user && <span>User: {log.user}</span>}
                              {log.ip && <span>IP: {log.ip}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <DocumentTextIcon className="h-4 w-4" />
                Export Logs
              </button>
            </div>
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">System Maintenance</h3>
              <p className="text-muted-foreground">Perform routine maintenance tasks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <button
                  onClick={() => handleMaintenanceAction('Clear Cache')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-foreground">Clear Cache</p>
                    <p className="text-sm text-muted-foreground">Clear application cache to improve performance</p>
                  </div>
                  {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /> : <ArrowPathIcon className="h-5 w-5 text-muted-foreground" />}
                </button>

                <button
                  onClick={() => handleMaintenanceAction('Optimize Database')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-foreground">Optimize Database</p>
                    <p className="text-sm text-muted-foreground">Optimize database tables for better performance</p>
                  </div>
                  {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /> : <WrenchScrewdriverIcon className="h-5 w-5 text-muted-foreground" />}
                </button>

                <button
                  onClick={() => handleMaintenanceAction('Update Indexes')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-foreground">Update Indexes</p>
                    <p className="text-sm text-muted-foreground">Rebuild database indexes for optimal queries</p>
                  </div>
                  {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /> : <DatabaseIcon className="h-5 w-5 text-muted-foreground" />}
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleMaintenanceAction('Health Check')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-foreground">System Health Check</p>
                    <p className="text-sm text-muted-foreground">Run comprehensive system diagnostics</p>
                  </div>
                  {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /> : <ShieldCheckIcon className="h-5 w-5 text-muted-foreground" />}
                </button>

                <button
                  onClick={() => handleMaintenanceAction('Clean Temp Files')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-foreground">Clean Temp Files</p>
                    <p className="text-sm text-muted-foreground">Remove temporary files and cleanup storage</p>
                  </div>
                  {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin text-primary" /> : <XMarkIcon className="h-5 w-5 text-muted-foreground" />}
                </button>

                <button
                  onClick={() => handleMaintenanceAction('Reset System')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-4 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <div>
                    <p className="font-semibold text-red-500">Reset System</p>
                    <p className="text-sm text-muted-foreground">Reset all data (use with caution)</p>
                  </div>
                  {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin text-red-500" /> : <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
                </button>
              </div>
            </div>
          </div>
        );

      case 'backups':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Backup Management</h3>
                <p className="text-muted-foreground">Manage system backups and recovery</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCreateBackup('database')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <DatabaseIcon className="h-4 w-4" />}
                  Database Backup
                </button>
                <button
                  onClick={() => handleCreateBackup('full')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <CloudIcon className="h-4 w-4" />}
                  Full Backup
                </button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Created</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Size</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {backupJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground">{job.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{job.type}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                            job.status === 'running' ? 'bg-blue-500/10 text-blue-500' :
                            job.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {job.status === 'running' && <ArrowPathIcon className="h-3 w-3 animate-spin" />}
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(job.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {job.size || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {job.status === 'completed' && (
                              <>
                                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                                  Download
                                </button>
                                <button className="text-sm text-red-500 hover:text-red-500/80 transition-colors">
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">System Alerts</h3>
              <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
            </div>

            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${
                  alert.resolved ? 'bg-muted/30 border-muted' : 'bg-card border-border'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      alert.type === 'error' ? 'bg-red-500/10' :
                      alert.type === 'warning' ? 'bg-yellow-500/10' :
                      'bg-blue-500/10'
                    }`}>
                      {alert.type === 'error' ? <ExclamationTriangleIcon className="h-5 w-5 text-red-500" /> :
                       alert.type === 'warning' ? <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" /> :
                       <CheckCircleIcon className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{alert.title}</h4>
                        {alert.resolved && (
                          <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Administration</h2>
          <p className="text-muted-foreground">Monitor and manage system performance and maintenance</p>
        </div>
      </div>

      {/* System Navigation */}
      <div className="bg-card border border-border rounded-xl p-1">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'monitoring', label: 'Monitoring', icon: EyeIcon },
            { id: 'logs', label: 'Logs', icon: DocumentTextIcon },
            { id: 'maintenance', label: 'Maintenance', icon: WrenchScrewdriverIcon },
            { id: 'backups', label: 'Backups', icon: CloudIcon },
            { id: 'alerts', label: 'Alerts', icon: BellIcon },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as typeof activeSection)}
              className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* System Content */}
      <div className="min-h-[600px]">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default System;