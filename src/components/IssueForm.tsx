import { useState } from 'react';
import { Wrench, Save, User, CreditCard, Hash, Check } from 'lucide-react';
import { MachineType, MachineRecord, MACHINE_TYPES, MACHINE_TYPE_LABELS, LINES, MachineItem } from '../types';
import { storage, generateId } from '../utils/storage';

interface IssueFormProps {
  onSaved: () => void;
}

const emptyItem: MachineItem = { bobbin: false, case: false, needleCount: 0 };

export function IssueForm({ onSaved }: IssueFormProps) {
  const [lineNo, setLineNo] = useState<number>(1);
  const [machineType, setMachineType] = useState<MachineType>(MACHINE_TYPES[0]);
  const [machineNumber, setMachineNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientCardNumber, setRecipientCardNumber] = useState('');
  const [issued, setIssued] = useState<MachineItem>({ ...emptyItem });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const record: MachineRecord = {
      id: generateId(),
      lineNo,
      machineType,
      machineNumber,
      recipientName,
      recipientCardNumber,
      issued: { ...issued },
      deposited: { bobbin: false, case: false, needleCount: 0 },
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    storage.saveRecord(record);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setMachineNumber('');
      setRecipientName('');
      setRecipientCardNumber('');
      setIssued({ ...emptyItem });
      onSaved();
    }, 1500);
  };

  const toggleItem = (key: 'bobbin' | 'case') => {
    setIssued((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-6 text-white">
        <div className="flex items-center gap-3">
          <Wrench className="w-7 h-7" />
          <div>
            <h1 className="text-xl font-bold">Issue Machine</h1>
            <p className="text-amber-100 text-sm">Record machine with accessories</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
        {/* Line Selection */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-slate-700 font-medium mb-3">Select Line</label>
          <div className="grid grid-cols-5 gap-2">
            {LINES.map((line) => (
              <button
                key={line}
                type="button"
                onClick={() => setLineNo(line)}
                className={`py-3 rounded-lg font-bold text-sm transition-all ${
                  lineNo === line
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {line}
              </button>
            ))}
          </div>
        </div>

        {/* Machine Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <div>
            <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <Wrench className="w-4 h-4 text-amber-500" />
              Machine Type
            </label>
            <select
              value={machineType}
              onChange={(e) => setMachineType(e.target.value as MachineType)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-800"
            >
              {MACHINE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {MACHINE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <Hash className="w-4 h-4 text-amber-500" />
              Machine Number
            </label>
            <input
              type="text"
              value={machineNumber}
              onChange={(e) => setMachineNumber(e.target.value)}
              placeholder="Enter machine number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-800"
              required
            />
          </div>
        </div>

        {/* Recipient Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-slate-700 font-medium">Recipient (Line Chief/Supervisor)</h3>

          <div>
            <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <User className="w-4 h-4 text-amber-500" />
              Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter recipient name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-800"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              Card Number
            </label>
            <input
              type="text"
              value={recipientCardNumber}
              onChange={(e) => setRecipientCardNumber(e.target.value)}
              placeholder="Enter card number"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-800"
              required
            />
          </div>
        </div>

        {/* Items Given with Machine */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-slate-700 font-medium mb-4">Items Given with Machine</label>

          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => toggleItem('bobbin')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${
                issued.bobbin
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-slate-200 text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  issued.bobbin ? 'bg-amber-500 text-white' : 'bg-slate-100'
                }`}
              >
                {issued.bobbin && <Check className="w-4 h-4" />}
              </div>
              <span className="font-medium">Bobbin</span>
            </button>

            <button
              type="button"
              onClick={() => toggleItem('case')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${
                issued.case
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-slate-200 text-slate-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  issued.case ? 'bg-amber-500 text-white' : 'bg-slate-100'
                }`}
              >
                {issued.case && <Check className="w-4 h-4" />}
              </div>
              <span className="font-medium">Case</span>
            </button>
          </div>

          <label className="block text-slate-700 font-medium mb-2">Needles</label>
          <select
            value={issued.needleCount}
            onChange={(e) =>
              setIssued((prev) => ({
                ...prev,
                needleCount: parseInt(e.target.value) as 0 | 1 | 2 | 3,
              }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-slate-800"
          >
            <option value={0}>No Needle</option>
            <option value={1}>1 Needle</option>
            <option value={2}>2 Needles</option>
            <option value={3}>3 Needles</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
        >
          <Save className="w-5 h-5" />
          Save Issue Record
        </button>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-bounce">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-slate-800 font-bold text-lg">Saved Successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}
