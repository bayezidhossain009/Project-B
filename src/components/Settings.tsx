import { useState, useRef } from 'react';
import {
  Download,
  Upload,
  User,
  Settings as SettingsIcon,
  Trash2,
  Check,
  AlertTriangle,
  Facebook,
  Instagram,
  Github,
  MessageCircle,
} from 'lucide-react';
import { UserInfo } from '../types';
import { storage } from '../utils/storage';

interface SettingsProps {
  userInfo: UserInfo;
  onUserUpdate: (user: UserInfo) => void;
  onNavigateToProfile: () => void;
}

export function Settings({ userInfo, onUserUpdate, onNavigateToProfile }: SettingsProps) {
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showImportError, setShowImportError] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `machine-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = storage.importData(content);
      if (success) {
        setShowImportSuccess(true);
        setTimeout(() => {
          setShowImportSuccess(false);
          window.location.reload();
        }, 1500);
      } else {
        setShowImportError(true);
        setTimeout(() => setShowImportError(false), 3000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    storage.clearAll();
    setShowClearConfirm(false);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-6 text-white">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-7 h-7" />
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-4">
        {/* Profile Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <button
            onClick={onNavigateToProfile}
            className="w-full flex items-center gap-4 text-left"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-slate-800 font-bold text-lg">{userInfo.name}</p>
              <p className="text-slate-500">{userInfo.cardNumber}</p>
            </div>
            <User className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-slate-700 font-medium">Data Management</p>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-slate-50 transition-all border-b border-slate-100"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-slate-800 font-medium">Export Data</p>
              <p className="text-slate-400 text-sm">Save backup to file</p>
            </div>
          </button>

          <label className="flex items-center gap-3 px-4 py-4 hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-100">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-slate-800 font-medium">Import Data</p>
              <p className="text-slate-400 text-sm">Restore from backup file</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-red-50 transition-all"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <p className="text-red-600 font-medium">Clear All Data</p>
              <p className="text-slate-400 text-sm">Delete all records permanently</p>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-slate-700 font-medium mb-3">App Information</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">App Name</span>
              <span className="text-slate-800">Machine Issue Tracker</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Version</span>
              <span className="text-slate-800">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Company</span>
              <span className="text-slate-800">Bottoms Gallery Pvt. Ltd.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Group</span>
              <span className="text-slate-800">Spider Group</span>
            </div>
          </div>
        </div>

        {/* Developer Contact Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-slate-700 font-medium">Developer Contact</p>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <div>
                <p className="text-slate-800 font-bold">Bayezid Hossain</p>
                <p className="text-amber-600 text-sm">Developed by Bayezid Miah</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <a
                href="https://www.facebook.com/bayezid.hossain.007"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-slate-600">Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/bayezid.hossain.007"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-all"
              >
                <Instagram className="w-5 h-5 text-pink-600" />
                <span className="text-xs text-slate-600">Instagram</span>
              </a>
              <a
                href="https://github.com/bayezid-404"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <Github className="w-5 h-5 text-slate-800" />
                <span className="text-xs text-slate-600">GitHub</span>
              </a>
              <a
                href="https://wa.me/8801613164879"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-all"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="text-xs text-slate-600">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Success Messages */}
      {showExportSuccess && (
        <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto bg-emerald-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg animate-slide-up">
          <Check className="w-5 h-5" />
          Data exported successfully!
        </div>
      )}

      {showImportSuccess && (
        <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto bg-emerald-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg">
          <Check className="w-5 h-5" />
          Data imported! Reloading...
        </div>
      )}

      {showImportError && (
        <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto bg-red-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg">
          <AlertTriangle className="w-5 h-5" />
          Failed to import. Invalid file format.
        </div>
      )}

      {/* Clear Data Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Clear All Data?</h3>
            <p className="text-slate-500 text-sm mb-6">
              This will delete all your records and profile. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
