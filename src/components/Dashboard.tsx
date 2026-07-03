import { useState, useEffect } from 'react';
import {
  BarChart3,
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  BoxSelect,
  Target,
} from 'lucide-react';
import { MachineRecord, MACHINE_TYPE_LABELS } from '../types';
import { storage } from '../utils/storage';

interface DashboardProps {
  onViewRecords: (filter: 'all' | 'active' | 'closed') => void;
}

interface Stats {
  totalRecords: number;
  activeIssues: number;
  closedRecords: number;
  bobbinPending: number;
  casePending: number;
  needlePending: number;
}

export function Dashboard({ onViewRecords }: DashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalRecords: 0,
    activeIssues: 0,
    closedRecords: 0,
    bobbinPending: 0,
    casePending: 0,
    needlePending: 0,
  });
  const [recentRecords, setRecentRecords] = useState<MachineRecord[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const records = storage.getRecords();
    const active = records.filter((r) => r.status === 'active');
    const closed = records.filter((r) => r.status === 'closed');

    const bobbinPending = active.filter((r) => r.issued.bobbin && !r.deposited.bobbin).length;
    const casePending = active.filter((r) => r.issued.case && !r.deposited.case).length;
    const needlePending = active.filter(
      (r) => r.issued.needleCount > r.deposited.needleCount
    ).length;

    setStats({
      totalRecords: records.length,
      activeIssues: active.length,
      closedRecords: closed.length,
      bobbinPending,
      casePending,
      needlePending,
    });

    setRecentRecords(records.slice(0, 5));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bn-BD', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-slate-300 text-sm">Machine Issue Tracker</p>
          </div>
        </div>

        {/* Company Badge */}
        <div className="mt-4 flex items-center gap-2">
          <div className="bg-slate-700/50 px-3 py-1.5 rounded-lg">
            <p className="text-amber-400 text-xs font-medium">Bottoms Gallery Pvt. Ltd.</p>
            <p className="text-slate-400 text-xs">Spider Group</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onViewRecords('all')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.totalRecords}</p>
            <p className="text-slate-500 text-sm">Total</p>
          </button>

          <button
            onClick={() => onViewRecords('active')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.activeIssues}</p>
            <p className="text-slate-500 text-sm">Active</p>
          </button>

          <button
            onClick={() => onViewRecords('closed')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.closedRecords}</p>
            <p className="text-slate-500 text-sm">Closed</p>
          </button>
        </div>

        {/* Pending Items */}
        {(stats.bobbinPending > 0 || stats.casePending > 0 || stats.needlePending > 0) && (
          <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 font-bold">Pending Items</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {stats.bobbinPending > 0 && (
                <div className="bg-white rounded-lg p-3 text-center">
                  <BoxSelect className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-800">{stats.bobbinPending}</p>
                  <p className="text-slate-500 text-xs">Bobbin</p>
                </div>
              )}
              {stats.casePending > 0 && (
                <div className="bg-white rounded-lg p-3 text-center">
                  <Package className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-800">{stats.casePending}</p>
                  <p className="text-slate-500 text-xs">Case</p>
                </div>
              )}
              {stats.needlePending > 0 && (
                <div className="bg-white rounded-lg p-3 text-center">
                  <Target className="w-5 h-5 text-red-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-slate-800">{stats.needlePending}</p>
                  <p className="text-slate-500 text-xs">Needles</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Clear Message */}
        {stats.activeIssues === 0 && stats.totalRecords > 0 && (
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <p className="text-emerald-700 font-medium">All items returned!</p>
            </div>
          </div>
        )}

        {/* Recent Records */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-700 font-medium">Recent Records</p>
            <button
              onClick={() => onViewRecords('all')}
              className="text-amber-600 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {recentRecords.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400">No records yet</p>
              <p className="text-slate-400 text-sm">Issue a machine to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => onViewRecords(record.status)}
                  className="w-full bg-white rounded-xl p-3 shadow-sm text-left hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          record.status === 'active' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                      <div>
                        <p className="text-slate-800 font-medium">
                          Line {record.lineNo} - {record.machineNumber}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {MACHINE_TYPE_LABELS[record.machineType]}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs font-medium ${
                          record.status === 'active' ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {record.status === 'active' ? 'Active' : 'Closed'}
                      </p>
                      <p className="text-slate-400 text-xs">{formatDate(record.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
