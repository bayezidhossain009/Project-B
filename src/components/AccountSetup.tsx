import { useState } from 'react';
import { User, CreditCard, Building, Briefcase, Save } from 'lucide-react';
import { UserInfo } from '../types';

interface AccountSetupProps {
  onComplete: (user: UserInfo) => void;
  existingUser?: UserInfo | null;
}

export function AccountSetup({ onComplete, existingUser }: AccountSetupProps) {
  const [name, setName] = useState(existingUser?.name || '');
  const [cardNumber, setCardNumber] = useState(existingUser?.cardNumber || '');
  const [floor, setFloor] = useState(existingUser?.floor || '');
  const [designation, setDesignation] = useState(existingUser?.designation || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && cardNumber) {
      const user: UserInfo = {
        name,
        cardNumber,
        floor,
        designation,
        createdAt: existingUser?.createdAt || new Date().toISOString(),
      };
      onComplete(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {existingUser ? 'Update Profile' : 'Create Account'}
          </h1>
          <p className="text-slate-500 mt-2">Enter your details to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <User className="w-4 h-4 text-amber-500" />
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-800"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              Card Number *
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="e.g., B - 2500"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-800"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <Building className="w-4 h-4 text-amber-500" />
              Floor
            </label>
            <input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="Enter floor number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <Briefcase className="w-4 h-4 text-amber-500" />
              Designation
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Your role/title"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <Save className="w-5 h-5" />
            {existingUser ? 'Update Profile' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
            <Building className="w-4 h-4" />
            <span>Bottoms Gallery Pvt. Ltd.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
