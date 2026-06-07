import { useState, FormEvent } from 'react';
import { SpeCOp } from '../types';
import { X, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AddOperationModalProps {
  onClose: () => void;
  onAddOperation: (op: Omit<SpeCOp, 'id'>) => void;
}

export default function AddOperationModal({ onClose, onAddOperation }: AddOperationModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [commander, setCommander] = useState('');
  const [type, setType] = useState<SpeCOp['type']>('Штурм');
  const [status, setStatus] = useState<SpeCOp['status']>('Успешно');
  const [participantsCount, setParticipantsCount] = useState(4);
  const [rewardPoints, setRewardPoints] = useState(15);
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const trimmedName = name.trim();
    const trimmedCommander = commander.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) {
      setValidationError('Укажите название специальной операции / учения.');
      return;
    }

    if (!trimmedCommander) {
      setValidationError('Укажите руководителя операции (например, Alexander_Gromov).');
      return;
    }

    if (!trimmedDesc) {
      setValidationError('Заполните тактическое описание операции.');
      return;
    }

    onAddOperation({
      name: trimmedName,
      date,
      commander: trimmedCommander,
      type,
      status,
      participantsCount,
      rewardPoints,
      description: trimmedDesc
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-lg bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-950 flex justify-between items-center bg-slate-950/40">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-sans flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-500 animate-pulse" />
            Регистрация Военной Спецоперации
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {validationError && (
            <div className="p-3 bg-red-950/40 border border-red-900/30 text-red-400 rounded-lg text-xs font-mono">
              <span>{validationError}</span>
            </div>
          )}

          {/* Op Name */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5">
              Название спецоперации / ГРП / учения <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Штурм захваченного ТРК «Амазинг-Ритм»"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition font-sans"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Commander */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5">
                Руководитель операции <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Dmitry_Sokolov"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition font-mono"
                value={commander}
                onChange={(e) => setCommander(e.target.value)}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5">
                Дата проведения
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition font-mono"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* Type */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5">
                Тип Инцидента
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition font-mono"
                value={type}
                onChange={(e) => setType(e.target.value as SpeCOp['type'])}
              >
                <option value="Штурм">Штурм (Аресты/Заложники)</option>
                <option value="Патруль">Патрулирование</option>
                <option value="Защита ВЧ">Защита Военной Части</option>
                <option value="Рейд">Рейд (Наркопритоны)</option>
                <option value="Сопровождение">Сопровождение кортежа</option>
                <option value="Тренировка">Тактические учения/дриллы</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5">
                Статус Завершения
              </label>
              <select
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition font-mono"
                value={status}
                onChange={(e) => setStatus(e.target.value as SpeCOp['status'])}
              >
                <option value="Успешно">Успешно завершено</option>
                <option value="Провалено">Провалено</option>
                <option value="В процессе">В процессе выполнения</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* Participants Count */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5">
                Задействовано бойцов ОСН
              </label>
              <input
                type="number"
                min="1"
                max="40"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition font-mono"
                value={participantsCount}
                onChange={(e) => setParticipantsCount(Number(e.target.value))}
              />
            </div>

            {/* Reward Points */}
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5">
                Бонусные баллы за участие
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition font-mono"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(Number(e.target.value))}
              />
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wide mb-1.5">
              Тактическое описание хода операции
            </label>
            <textarea
              required
              rows={3}
              placeholder="Опишите хронологию штурма, ключевые ориентиры, исход, действия с заложниками..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition font-sans leading-relaxed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="pt-5 border-t border-slate-900 mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-semibold border border-slate-800 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-md shadow-red-950/40"
            >
              Архивировать операцию
            </button>
          </div>

        </form>

      </motion.div>
    </div>
  );
}
