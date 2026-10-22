import React, { useState } from 'react';
import { glossaryData } from '../data/gameData';

export function Glossary({ onClose }: { onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filtered = glossaryData.filter(item =>
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">📖 Глоссарий</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">✕</button>
          </div>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full mt-2 p-2 rounded-lg text-gray-800 text-sm" placeholder="Поиск термина..." />
        </div>
        <div className="overflow-y-auto p-4 flex-1">
          <div className="space-y-2">
            {filtered.map(item => (
              <div key={item.term} className="border rounded-lg overflow-hidden">
                <button onClick={() => setExpandedTerm(expandedTerm === item.term ? null : item.term)}
                  className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-blue-800">{item.term}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Урок {item.lessonRef}</span>
                    <span className="text-gray-400">{expandedTerm === item.term ? '▲' : '▼'}</span>
                  </span>
                </button>
                {expandedTerm === item.term && (
                  <div className="p-3 bg-blue-50 border-t text-sm text-gray-700">
                    {item.definition}
                  </div>
                )}
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-8">Термин не найден</p>
          )}
        </div>
      </div>
    </div>
  );
}
