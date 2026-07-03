import { useState, useEffect } from 'react';
import { ArrowDownCircle, Check, AlertTriangle, CheckCircle } from 'lucide-react';
import { MachineRecord, MACHINE_TYPE_LABELS } from '../types';
import { storage } from '../utils/storage';

interface DepositFormProps {
  onSaved: () => void;
  refreshTrigger: number;
}

export function DepositForm({ onSaved, refreshTrigger }: DepositFormProps) {
  const [activeRecords, setActiveRecords] = useState<MachineRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MachineRecord | null>(null);
  const [deposited, setDeposited] = useState({ bobbin: false, case: false, needleCount: 0 });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadActiveRecords();
  }, [refreshTrigger]);

  const loadActiveRecords = () => {
    const records = storage.getRecordsByStatus('active');
    setActiveRecords(records);
  };

  const handleSelectRecord = (record: MachineRecord) => {
    setSelectedRecord(record);
    setDeposited({
      bobbin: record.issued.bobbin,
      case: record.issued.case,
      needleCount: record.issued.needleCount,
    });
  };

  const toggleItem = (key: 'bobbin' | 'case') => {
    setDeposited((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isMissing = (key: 'bobbin' | 'case'): boolean => {
    if (!selectedRecord) return false;
    return selectedRecord.issued[key] && !deposited[key];
  };

  const isNeedleMissing = (): boolean => {
    if (!selectedRecord) return false;
    return selectedRecord.issued.needleCount > deposited.needleCount;
  };

  const handleDeposit = () => {
    if (!selectedRecord) return;

    const allReturned =
      selectedRecord.issued.bobbin === deposited.bobbin &&
      selectedRecord.issued.case === deposited.case &&
      selectedRecord.issued.needleCount === deposited.needleCount;

    storage.updateRecord(selectedRecord.id, {
      deposited: { ...deposited },
      status: allReturned ? 'closed' : 'active',
      closedAt: allReturned ? new Date().toISOString() : undefined,
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedRecord(null);
      loadActiveRecords();
      onSaved();
    }, 1500);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-6 text-white">
        <div className="flex items-center gap-3">
          <ArrowDownCircle className="w-7 h-7" />
          <div>
            <h1 className="text-xl font-bold">Deposit / Return</h1>
            <p className="text-emerald-100 text-sm">Record returned items</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {selectedRecord ? (
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-800 font-bold">
                  Line {selectedRecord.lineNo} - {selectedRecord.machineNumber}
                </p>
                <p className="text-slate-500 text-sm">
                  {MACHINE_TYPE_LABELS[selectedRecord.machineType]}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 px-3 py-1"
              >
                Back
              </button>
            </div>

            <div className="border-t pt-4">
              <p className="text-slate-600 text-sm">
                Recipient: <span className="font-medium text-slate-800">{selectedRecord.recipientName}</span>
              </p>
              <p className="text-slate-600 text-sm">
                Card: <span className="font-medium text-slate-800">{selectedRecord.recipientCardNumber}</span>
              </p>
            </div>

            {/* Issued items */}
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-slate-500 text-sm mb-2">Issued:</p>
              <div className="flex flex-wrap gap-2">
                {selectedRecord.issued.bobbin && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    Bobbin
                  </span>
                )}
                {selectedRecord.issued.case && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    Case
                  </span>
                )}
                {selectedRecord.issued.needleCount > 0 && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedRecord.issued.needleCount} Needle{selectedRecord.issued.needleCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Deposited items */}
            <div>
              <label className="block text-slate-700 font-medium mb-3">Deposited Items:</label>

              <div className="flex gap-3 mb-4">
                {selectedRecord.issued.bobbin && (
                  <button
                    type="button"
                    onClick={() => toggleItem('bobbin')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      deposited.bobbin
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : isMissing('bobbin')
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        deposited.bobbin
                          ? 'bg-emerald-500 text-white'
                          : isMissing('bobbin')
                            ? 'bg-red-100'
                            : 'bg-slate-100'
                      }`}
                    >
                      {deposited.bobbin && <Check className="w-4 h-4" />}
                      {isMissing('bobbin') && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <span className="font-medium">Bobbin</span>
                  </button>
                )}

                {selectedRecord.issued.case && (
                  <button
                    type="button"
                    onClick={() => toggleItem('case')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      deposited.case
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                        : isMissing('case')
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center ${
                        deposited.case
                          ? 'bg-emerald-500 text-white'
                          : isMissing('case')
                            ? 'bg-red-100'
                            : 'bg-slate-100'
                      }`}
                    >
                      {deposited.case && <Check className="w-4 h-4" />}
                      {isMissing('case') && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <span className="font-medium">Case</span>
                  </button>
                )}
              </div>

              {selectedRecord.issued.needleCount > 0 && (
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Needles Returned</label>
                  <select
                    value={deposited.needleCount}
                    onChange={(e) =>
                      setDeposited((prev) => ({
                        ...prev,
                        needleCount: parseInt(e.target.value) as 0 | 1 | 2 | 3,
                      }))
                    }
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                      isNeedleMissing()
                        ? 'border-red-300 bg-red-50'
                        : 'border-slate-200 focus:border-emerald-400'
                    }`}
                  >
                    <option value={0}>No Needle</option>
                    <option value={1}>1 Needle</option>
                    <option value={2}>2 Needles</option>
                    <option value={3}>3 Needles</option>
                  </select>
                  {isNeedleMissing() && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {deposited.needleCount} of {selectedRecord.issued.needleCount} needles returned
                    </p>
                  )}
                </div>
              )}
            </div>

            {(isMissing('bobbin') || isMissing('case') || isNeedleMissing()) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Some items are still missing!
                </p>
                <p className="text-red-500 text-sm mt-1">Record will remain active until all items returned.</p>
              </div>
            )}

            <button
              onClick={handleDeposit}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              <CheckCircle className="w-5 h-5" />
              Save Deposit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-slate-600 font-medium mb-2">Active Issues ({activeRecords.length})</p>
            {activeRecords.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-slate-400">No active issues found</p>
              </div>
            ) : (
              activeRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => handleSelectRecord(record)}
                  className="w-full bg-white rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-slate-800 font-bold">Line {record.lineNo}</p>
                      <p className="text-slate-500 text-sm">
                        {MACHINE_TYPE_LABELS[record.machineType]} - {record.machineNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-800 font-medium">{record.recipientName}</p>
                      <p className="text-slate-400 text-xs">{formatDate(record.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {record.issued.bobbin && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.deposited.bobbin
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        Bobbin {record.deposited.bobbin ? 'Returned' : 'Pending'}
                      </span>
                    )}
                    {record.issued.case && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.deposited.case
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        Case {record.deposited.case ? 'Returned' : 'Pending'}
                      </span>
                    )}
                    {record.issued.needleCount > 0 && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.deposited.needleCount >= record.issued.needleCount
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {record.deposited.needleCount}/{record.issued.needleCount} Needles
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-slate-800 font-bold text-lg">Deposit Recorded!</p>
          </div>
        </div>
      )}
    </div>
  );
}
