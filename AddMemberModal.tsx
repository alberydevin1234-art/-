import { useState } from 'react';
import { Operative } from '../types';
import { 
  Search, Filter, ArrowUpDown, Shield, AlertTriangle, Eye, Edit2, 
  Trash2, UserPlus, Award, SquareCheck, RefreshCcw, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AVAILABLE_RANKS, AVAILABLE_POSITIONS, AVAILABLE_SPECIALIZATIONS } from '../initialData';

interface MembersTableProps {
  operatives: Operative[];
  onSelectOperative: (operative: Operative) => void;
  onEditOperative: (operative: Operative) => void;
  onDeleteOperative: (operativeId: string) => void;
  onAddOperativeClick: () => void;
  onBulkResetPoints: () => void;
  onExportBBCode: () => void;
}

type SortField = 'nickname' | 'points' | 'rank' | 'reprimands' | 'status';
type SortOrder = 'asc' | 'desc';

export default function MembersTable({
  operatives,
  onSelectOperative,
  onEditOperative,
  onDeleteOperative,
  onAddOperativeClick,
  onBulkResetPoints,
  onExportBBCode
}: MembersTableProps) {
  const [search, setSearch] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Search & Filter Operatives
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredOperatives = operatives
    .filter(op => {
      const matchSearch = 
        op.nickname.toLowerCase().includes(search.toLowerCase()) ||
        op.callsign.toLowerCase().includes(search.toLowerCase()) ||
        op.rank.toLowerCase().includes(search.toLowerCase());
      
      const matchSpec = filterSpecialization === 'all' || op.specialization === filterSpecialization;
      const matchStatus = filterStatus === 'all' || op.status === filterStatus;
      const matchPosition = filterPosition === 'all' || op.position === filterPosition;

      return matchSearch && matchSpec && matchStatus && matchPosition;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'nickname') {
        comparison = a.nickname.localeCompare(b.nickname);
      } else if (sortField === 'points') {
        comparison = a.points - b.points;
      } else if (sortField === 'reprimands') {
        comparison = a.reprimands - b.reprimands;
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'rank') {
        // Simple rank index comparison
        const indexA = AVAILABLE_RANKS.indexOf(a.rank);
        const indexB = AVAILABLE_RANKS.indexOf(b.rank);
        comparison = indexA - indexB;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusStyle = (status: Operative['status']) => {
    switch (status) {
      case 'В строю':
        return 'bg-emerald-950/50 text-emerald-400 border-emerald-500/20';
      case 'На спецзадании':
        return 'bg-sky-950/50 text-sky-400 border-sky-500/20';
      case 'В отпуске':
        return 'bg-amber-950/50 text-amber-400 border-amber-500/20';
      case 'В госпитале':
        return 'bg-rose-950/50 text-rose-400 border-rose-500/20';
      case 'Отстранен':
        return 'bg-slate-900 text-slate-400 border-slate-700/50';
    }
  };

  const getSpecColor = (spec: Operative['specialization']) => {
    switch (spec) {
      case 'Штурмовик': return 'text-red-400 border-red-500/20 bg-red-950/10';
      case 'Снайпер': return 'text-amber-400 border-amber-500/20 bg-amber-950/10';
      case 'Медик': return 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10';
      case 'Сапер': return 'text-violet-400 border-violet-500/20 bg-violet-950/10';
      case 'Разведчик': return 'text-sky-400 border-sky-500/20 bg-sky-950/10';
      case 'Водитель-Пилот': return 'text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-950/10';
    }
  };

  return (
    <div className="bg-slate-950/30 border border-slate-900 rounded-xl p-6 backdrop-blur-xl" id="members-combat-section">
      
      {/* Table Action Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500 animate-pulse" />
            База Данных Бойцов ОСН «Берсерк»
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Сервер Amazing RP TITAN • Актуальный состав подразделения
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <button 
            onClick={onExportBBCode}
            className="flex-1 lg:flex-none py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-800 hover:border-slate-700 transition flex items-center justify-center gap-2"
            title="Сгенерировать отчет для форума"
          >
            <Copy className="w-3.5 h-3.5 text-blue-400" />
            <span>Форумный Экспорт (BB-Code)</span>
          </button>
          
          <button 
            onClick={onBulkResetPoints}
            className="flex-1 lg:flex-none py-2 px-3 bg-slate-950 hover:bg-slate-900 text-slate-400 rounded-lg text-xs font-medium border border-red-950/20 hover:border-red-500/30 transition flex items-center justify-center gap-2"
            title="Сбросить баллы состава на новую неделю"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-orange-500" />
            <span>Обнулить Неделю</span>
          </button>

          <button 
            onClick={onAddOperativeClick}
            className="flex-1 lg:flex-none py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-red-950/40 hover:shadow-red-700/20 transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Завербовать Бойца</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/40 p-4 rounded-lg border border-slate-900/60 mb-6">
        
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition font-mono"
            placeholder="Поиск по нику, позывному..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Specialization Filter */}
        <div className="relative">
          <select
            className="block w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition appearance-none cursor-pointer"
            value={filterSpecialization}
            onChange={(e) => setFilterSpecialization(e.target.value)}
          >
            <option value="all">Все Специализации</option>
            {AVAILABLE_SPECIALIZATIONS.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <Filter className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            className="block w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition appearance-none cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Любой Статус</option>
            <option value="В строю">В строю (Активный)</option>
            <option value="На спецзадании">На спецзадании</option>
            <option value="В отпуске">В отпуске</option>
            <option value="В госпитале">В госпитале</option>
            <option value="Отстранен">Отстранен</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <Filter className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Position Filter */}
        <div className="relative">
          <select
            className="block w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition appearance-none cursor-pointer"
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
          >
            <option value="all">Все Должности</option>
            {AVAILABLE_POSITIONS.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
            <Filter className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Operative Table Render */}
      <div className="overflow-x-auto border border-slate-900 rounded-lg bg-slate-950/40">
        <table className="min-w-full divide-y divide-slate-900 text-left">
          <thead className="bg-slate-900/80 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('nickname')}>
                <div className="flex items-center gap-1.5">
                  Оперативник / Ник {sortField === 'nickname' && <ArrowUpDown className="w-3 h-3 text-red-500" />}
                </div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('rank')}>
                <div className="flex items-center gap-1.5">
                  Звание / Должность {sortField === 'rank' && <ArrowUpDown className="w-3 h-3 text-red-500" />}
                </div>
              </th>
              <th scope="col" className="px-6 py-4">Специализация</th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1.5">
                  Статус {sortField === 'status' && <ArrowUpDown className="w-3 h-3 text-red-500" />}
                </div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('points')}>
                <div className="flex items-center gap-1.5">
                  Активность {sortField === 'points' && <ArrowUpDown className="w-3 h-3 text-red-500" />}
                </div>
              </th>
              <th scope="col" className="px-6 py-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('reprimands')}>
                <div className="flex items-center gap-1.5">
                  Выговоры {sortField === 'reprimands' && <ArrowUpDown className="w-3 h-3 text-red-500" />}
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-center">Штаб-Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-xs font-mono text-slate-200">
            <AnimatePresence mode="popLayout">
              {filteredOperatives.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                    На запрашиваемом тактическом уровне бойцы не найдены. Создайте нового оперативника или измените параметры поиска.
                  </td>
                </tr>
              ) : (
                filteredOperatives.map((op) => {
                  return (
                    <motion.tr
                      key={op.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      className="hover:bg-slate-900/30 transition-colors duration-150 group"
                    >
                      {/* Operative / Callsign */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white relative text-xs shadow-inner"
                            style={{ backgroundColor: op.avatarColor || '#dc2626' }}
                          >
                            {op.nickname.split('_').map(n => n[0]).join('')}
                            {/* Department Glow Dot */}
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-950 bg-green-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-white tracking-tight font-sans">
                              {op.nickname}
                            </p>
                            <p className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                              Позывной: <strong className="text-slate-300 font-bold">«{op.callsign}»</strong>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Rank & Position */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-slate-200">{op.rank}</p>
                          <p className="text-[10px] text-slate-500">{op.position}</p>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getSpecColor(op.specialization)}`}>
                          {op.specialization}
                        </span>
                      </td>

                      {/* Duty Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(op.status)}`}>
                          {op.status}
                        </span>
                      </td>

                      {/* Activity points */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col w-28">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-300 text-[11px] font-bold">{op.points} баллов</span>
                            <span className="text-slate-500 text-[9px]">{op.points >= 60 ? 'ПОВЫШЕНИЕ' : `${op.points}/60`}</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/80">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${op.points >= 60 ? 'bg-gradient-to-r from-red-600 to-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min((op.points / 60) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Reprimands */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1" title={`${op.reprimands} строгих выговоров`}>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">ВЫГ:</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map((num) => (
                                <span 
                                  key={num} 
                                  className={`w-2 h-2 rounded-full border border-slate-950 ${num <= op.reprimands ? 'bg-red-500 shadow-md shadow-red-500/50' : 'bg-slate-800'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1" title={`${op.warnings} устных предупреждений`}>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">УСТ:</span>
                            <div className="flex gap-0.5">
                              {[1, 2].map((num) => (
                                <span 
                                  key={num} 
                                  className={`w-2 h-2 rounded-full border border-slate-950 ${num <= op.warnings ? 'bg-amber-500' : 'bg-slate-800'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onSelectOperative(op)}
                            className="p-1 px-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition"
                            title="Открыть Личное Дело"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          <button 
                            onClick={() => onEditOperative(op)}
                            className="p-1 px-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition"
                            title="Редактировать профиль"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-amber-500" />
                          </button>

                          <button 
                            onClick={() => onDeleteOperative(op.id)}
                            className="p-1 px-1.5 rounded bg-red-950/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 border border-red-900/30 hover:border-red-500/30 transition"
                            title="Уволить из отряда"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
