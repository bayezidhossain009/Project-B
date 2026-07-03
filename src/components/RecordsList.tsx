import { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  Clock,
  CheckCircle,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MachineRecord, MACHINE_TYPE_LABELS } from '../types';
import { storage } from '../utils/storage';

interface RecordsListProps {
  initialFilter: 'all' | 'active' | 'closed';
  onBack: () => void;
}

export function RecordsList({ initialFilter, onBack }: RecordsListProps) {
  const [records, setRecords] = useState<MachineRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MachineRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>(initialFilter);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingRecord, setEditingRecord] = useState<MachineRecord | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterAndSearchRecords();
  }, [records, searchQuery, filter]);

  const loadRecords = () => {
    const allRecords = storage.getRecords();
    setRecords(allRecords);
  };

  const filterAndSearchRecords = () => {
    let filtered = records;

    if (filter !== 'all') {
      filtered = filtered.filter((r) => r.status === filter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.recipientName.toLowerCase().includes(query) ||
          r.recipientCardNumber.toLowerCase().includes(query) ||
          r.machineNumber.toLowerCase().includes(query) ||
          `line ${r.lineNo}`.includes(query) ||
          MACHINE_TYPE_LABELS[r.machineType].toLowerCase().includes(query)
      );
    }

    setFilteredRecords(filtered);
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

  const handleDelete = (id: string) => {
    storage.deleteRecord(id);
    loadRecords();
    setShowDeleteConfirm(null);
  };

  const handleEditSave = () => {
    if (editingRecord) {
      storage.saveRecord(editingRecord);
      setEditingRecord(null);
      loadRecords();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-6 text-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-7 h-7" />
            <h1 className="text-xl font-bold">Records</h1>
          </div>
          <button onClick={onBack} className="px-3 py-1 rounded-lg bg-white/20 text-sm">
            Back
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, card, machine, line..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          {['all', 'active', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as 'all' | 'active' | 'closed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Closed'}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      <div className="p-4 max-w-md mx-auto">
        <p className="text-slate-500 text-sm mb-3">
          {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''} found
        </p>

        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">No records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Main Row */}
                <button
                  onClick={() => toggleExpand(record.id)}
                  className="w-full p-4 text-left hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          record.status === 'active' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                      />
                      <div>
                        <p className="text-slate-800 font-medium">
                          Line {record.lineNo} - {record.machineNumber}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {MACHINE_TYPE_LABELS[record.machineType]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'active'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {record.status === 'active' ? (
                          <Clock className="w-3 h-3 inline mr-1" />
                        ) : (
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                        )}
                        {record.status}
                      </span>
                      {expandedId === record.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <span>{record.recipientName}</span>
                    <span className="text-slate-300">|</span>
                    <span>{record.recipientCardNumber}</span>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedId === record.id && (
                  <div className="border-t px-4 py-3 bg-slate-50">
                    <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                      <div>
                        <p className="text-slate-500">Issued</p>
                        <p className="text-slate-800">{formatDate(record.createdAt)}</p>
                      </div>
                      {record.closedAt && (
                        <div>
                          <p className="text-slate-500">Closed</p>
                          <p className="text-slate-800">{formatDate(record.closedAt)}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-slate-500 text-xs mb-1">Given</p>
                        <div className="flex flex-wrap gap-1">
                          {record.issued.bobbin && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                              Bobbin
                            </span>
                          )}
                          {record.issued.case && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                              Case
                            </span>
                          )}
                          {record.issued.needleCount > 0 && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                              {record.issued.needleCount}N
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-slate-500 text-xs mb-1">Returned</p>
                        <div className="flex flex-wrap gap-1">
                          {record.deposited.bobbin && (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">
                              Bobbin
                            </span>
                          )}
                          {record.deposited.case && (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">
                              Case
                            </span>
                          )}
                          {record.deposited.needleCount > 0 && (
                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">
                              {record.deposited.needleCount}N
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingRecord({ ...record })}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-100 text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(record.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-100 text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Edit Record</h3>
              <button onClick={() => setEditingRecord(null)}>
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 text-sm mb-1">Machine Number</label>
                <input
                  type="text"
                  value={editingRecord.machineNumber}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, machineNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-sm mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={editingRecord.recipientName}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, recipientName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-600 text-sm mb-1">Card Number</label>
                <input
                  type="text"
                  value={editingRecord.recipientCardNumber}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, recipientCardNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <button
                onClick={handleEditSave}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Record?</h3>
            <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
