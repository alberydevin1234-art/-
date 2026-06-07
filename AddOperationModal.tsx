import { SpeCOp } from '../types';
import { Calendar, User, ShieldAlert, Award, Radio, CircleEllipsis } from 'lucide-react';
import { motion } from 'motion/react';

interface OperationsBoardProps {
  operations: SpeCOp[];
  onAddOperationClick: () => void;
  onDeleteOperation: (id: string) => void;
}

export default function OperationsBoard({ operations, onAddOperationClick, onDeleteOperation }: OperationsBoardProps) {
  const getStatusStyle = (status: SpeCOp['status']) => {
    switch (status) {
      case 'Успешно':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20';
      case 'Провалено':
        return 'bg-rose-950/40 text-rose-400 border-rose-500/20';
      case 'В процессе':
        return 'bg-sky-950/40 text-sky-400 border-sky-500/20 animate-pulse';
    }
  };

  const getOpBadgeColor = (type: SpeCOp['type']) => {
    switch (type) {
      case 'Штурм': return 'border-red-500/30 text-red-400 bg-red-950/10';
      case 'Патруль': return 'border-blue-500/30 text-blue-400 bg-blue-950/10';
      case 'Защита ВЧ': return 'border-amber-500/30 text-amber-400 bg-amber-950/10';
      case 'Рейд': return 'border-violet-500/30 text-violet-400 bg-violet-950/10';
      case 'Сопровождение': return 'border-emerald-500/30 text-emerald-400 bg-emerald-950/10';
      case 'Тренировка': return 'border-slate-500/30 text-slate-400 bg-slate-900/10';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  return (
    <div className="bg-slate-950/30 border border-slate-900 rounded-xl p-6 backdrop-blur-xl" id="operations-tactical-section">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            Журнал Спецопераций и Тренировок
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Боевые выезды, учебные тревоги и результаты операций команды ОСН
          </p>
        </div>
        
        <button
          onClick={onAddOperationClick}
          className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 hover:border-slate-700 transition flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4 text-orange-500" />
          <span>Архивировать Спецоперацию</span>
        </button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {operations.map((op) => (
          <motion.div
            key={op.id}
            variants={item}
            className="border border-slate-900 bg-slate-950/40 rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group hover:border-slate-800 hover:bg-slate-950/60 transition-all duration-200"
          >
            {/* Ambient indicator lines for active operations */}
            {op.status === 'В процессе' && (
              <span className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 to-sky-500 animate-pulse" />
            )}

            <div>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${getOpBadgeColor(op.type)}`}>
                    {op.type}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight mt-2 font-sans group-hover:text-red-400 transition-colors">
                    {op.name}
                  </h3>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider uppercase border ${getStatusStyle(op.status)}`}>
                  {op.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-mono mt-3 line-clamp-3 leading-relaxed">
                {op.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-900/60 grid grid-cols-2 gap-3 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{op.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate" title={`Руководитель: ${op.commander}`}>РД: {op.commander}</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleEllipsis className="w-3.5 h-3.5 text-slate-500" />
                <span>Задействовано: {op.participantsCount} бойцов</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-amber-400 font-bold">+{op.rewardPoints} баллов к отчету</span>
              </div>
            </div>

            {/* Hidden Delete Action in the cards */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteOperation(op.id);
                }}
                className="text-[10px] text-red-500 hover:text-red-400 font-bold bg-slate-950 px-2 py-1 border border-slate-900 rounded"
              >
                Удалить запись
              </button>
            </div>

          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
