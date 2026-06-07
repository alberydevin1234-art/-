import { useState, useEffect } from 'react';
import { Operative } from '../types';
import { 
  X, Shield, User, Calendar, Award, AlertTriangle, AlertOctagon, 
  CheckCircle, FileText, Bookmark, Target, Save, Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

interface OperativeDossierProps {
  operative: Operative | null;
  onClose: () => void;
  onUpdateOperative: (updated: Operative) => void;
}

const ALL_MEDALS = [
  'Орден Мужества',
  'Медаль за Отвагу',
  'Лучший Боец Месяца',
  'Медаль за Спасение',
  'Снайпер-Ас',
  'Инструктор Высшей Категории',
  'Красный Крест ОСН',
  'Ветеран ОСН Берсерк'
];

const STANDARD_EQUIPMENT = [
  'АК-105 тактический (обвес ЕОТесн)',
  'Снайперская Винтовка Драгунова (СВД)',
  'Пистолет Мамарова (ПМ) глушитель',
  'ВСС «Винторез» с оптикой ПСО-1',
  'Тяжелый бронежилет скрытый (6Б45)',
  'Тактический шлем с ПНВ (Лидер-М)',
  'Комплект штурмовых гранат (Ф-1 / Световые)',
  'Портативная радиостанция КЕНВУД ТКТ'
];

export default function OperativeDossier({ operative, onClose, onUpdateOperative }: OperativeDossierProps) {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Operative['status']>('В строю');
  const [reprimands, setReprimands] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [equippedWeapons, setEquippedWeapons] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state with incoming operative prop
  useEffect(() => {
    if (operative) {
      setNotes(operative.notes || '');
      setStatus(operative.status);
      setReprimands(operative.reprimands);
      setWarnings(operative.warnings);
      setAchievements(operative.achievements || []);
      
      // Seed some dynamic equipment if not loaded
      const randSeed = operative.nickname.length % 3 === 0 
        ? [STANDARD_EQUIPMENT[0], STANDARD_EQUIPMENT[4], STANDARD_EQUIPMENT[7]]
        : operative.nickname.length % 3 === 1
        ? [STANDARD_EQUIPMENT[1], STANDARD_EQUIPMENT[3], STANDARD_EQUIPMENT[4], STANDARD_EQUIPMENT[5]]
        : [STANDARD_EQUIPMENT[0], STANDARD_EQUIPMENT[2], STANDARD_EQUIPMENT[4], STANDARD_EQUIPMENT[6], STANDARD_EQUIPMENT[7]];
      setEquippedWeapons(randSeed);
    }
  }, [operative]);

  if (!operative) return null;

  const handleToggleMedal = (medal: string) => {
    setAchievements(prev => 
      prev.includes(medal) ? prev.filter(m => m !== medal) : [...prev, medal]
    );
  };

  const handleToggleEquipment = (eq: string) => {
    setEquippedWeapons(prev =>
      prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]
    );
  };

  const handleSaveDossierChanges = () => {
    const updatedOperative: Operative = {
      ...operative,
      notes,
      status,
      reprimands,
      warnings,
      achievements
    };
    onUpdateOperative(updatedOperative);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const increaseReprimands = () => setReprimands(prev => Math.min(3, prev + 1));
  const decreaseReprimands = () => setReprimands(prev => Math.max(0, prev - 1));
  const increaseWarnings = () => setWarnings(prev => Math.min(2, prev + 1));
  const decreaseWarnings = () => setWarnings(prev => Math.max(0, prev - 1));

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end">
      
      {/* Drawer content element */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full md:w-[600px] bg-slate-950 border-l border-slate-900 h-full overflow-y-auto flex flex-col shadow-2xl relative"
      >
        {/* Dossier Header */}
        <div className="p-6 border-b border-slate-950 bg-slate-950 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
              style={{ backgroundColor: operative.avatarColor || '#dc2626' }}
            >
              {operative.nickname.split('_').map(n => n[0]).join('')}
            </span>
            <div>
              <h3 className="text-md font-bold text-white tracking-wide font-sans">{operative.nickname}</h3>
              <p className="text-xs text-red-400 font-mono">Личное дело № BERSERK-{operative.id.toUpperCase()}</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dossier Body Scroll Container */}
        <div className="flex-1 p-6 space-y-6">
          
          {/* Quick status cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 border border-slate-900/60 rounded-lg p-3.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Спец-Звание / Должность</span>
              <p className="text-xs font-bold text-white">{operative.rank}</p>
              <p className="text-[10px] text-red-500 font-mono mt-0.5">{operative.position}</p>
            </div>
            
            <div className="bg-slate-950/60 border border-slate-900/60 rounded-lg p-3.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Группа специализации</span>
              <p className="text-xs font-bold text-amber-500">{operative.specialization}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Вступление: {operative.joinDate}</p>
            </div>
          </div>

          {/* Operational Status selector */}
          <div className="bg-slate-900/15 border border-slate-900 rounded-lg p-4">
            <label className="block text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-wide">
              Текущий Статус Дежурства
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['В строю', 'На спецзадании', 'В отпуске', 'В госпитале', 'Отстранен'] as Operative['status'][]).map(st => (
                <button
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-1.5 px-2 rounded text-[10px] font-bold border transition text-center ${
                    status === st 
                      ? 'bg-red-950/40 text-red-400 border-red-500/50 shadow-sm'
                      : 'bg-slate-950 text-slate-500 border-slate-900 hover:border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Points, Warnings & Reprimands (Disciplinary commands) */}
          <div className="bg-slate-900/15 border border-slate-900 rounded-lg p-4 space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide border-b border-slate-900 pb-2">
              Дисциплинарная Карта Бойца
            </h4>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-slate-200">Строгие выговоры</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">При достижении 3/3 — автоматическое увольнение</p>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-900 rounded-lg p-1">
                <button 
                  onClick={decreaseReprimands}
                  className="w-7 h-7 flex items-center justify-center rounded bg-slate-900 text-slate-400 hover:text-white"
                  disabled={reprimands === 0}
                >
                  -
                </button>
                <span className="w-10 text-center font-bold font-mono text-sm text-red-500">
                  {reprimands}/3
                </span>
                <button 
                  onClick={increaseReprimands}
                  className="w-7 h-7 flex items-center justify-center rounded bg-slate-900 text-slate-400 hover:text-white"
                  disabled={reprimands === 3}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div>
                <p className="text-xs font-semibold text-slate-200">Устные предупреждения</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">При получении 2 предупреждений — выдается 1 строгий</p>
              </div>
              
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-900 rounded-lg p-1">
                <button 
                  onClick={decreaseWarnings}
                  className="w-7 h-7 flex items-center justify-center rounded bg-slate-900 text-slate-400 hover:text-white"
                  disabled={warnings === 0}
                >
                  -
                </button>
                <span className="w-10 text-center font-bold font-mono text-sm text-amber-500">
                  {warnings}/2
                </span>
                <button 
                  onClick={increaseWarnings}
                  className="w-7 h-7 flex items-center justify-center rounded bg-slate-900 text-slate-400 hover:text-white"
                  disabled={warnings === 2}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Achievements / Medals Toggle Section */}
          <div className="bg-slate-900/15 border border-slate-900 rounded-lg p-4">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide border-b border-slate-900 pb-2 mb-3">
              Государственные Награды & Достижения
            </h4>
            <div className="flex flex-wrap gap-2">
              {ALL_MEDALS.map(medal => {
                const hasMedal = achievements.includes(medal);
                return (
                  <button
                    key={medal}
                    onClick={() => handleToggleMedal(medal)}
                    className={`py-1 px-2 rounded text-[10px] font-sans font-medium border flex items-center gap-1.5 transition ${
                      hasMedal
                        ? 'bg-amber-950/30 text-amber-400 border-amber-500/40'
                        : 'bg-slate-950 text-slate-500 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <Award className={`w-3.5 h-3.5 ${hasMedal ? 'text-amber-400 text-shadow-md' : 'text-slate-600'}`} />
                    <span>{medal}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Standard combat items loadout checklist */}
          <div className="bg-slate-900/15 border border-slate-900 rounded-lg p-4">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide border-b border-slate-900 pb-2 mb-3">
              Экипировка и табельное спец-вооружение
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {STANDARD_EQUIPMENT.map(eq => {
                const isEquipped = equippedWeapons.includes(eq);
                return (
                  <label
                    key={eq}
                    onClick={() => handleToggleEquipment(eq)}
                    className={`p-2 rounded border flex items-center gap-2 cursor-pointer transition select-none ${
                      isEquipped
                        ? 'bg-slate-900/50 border-red-500/25 text-slate-100'
                        : 'bg-slate-950 border-slate-900/60 text-slate-500 hover:border-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isEquipped}
                      readOnly
                      className="rounded border-slate-800 text-red-600 focus:ring-red-500 focus:ring-offset-slate-950 w-3.5 h-3.5"
                    />
                    <span className="text-[10px] font-mono font-medium leading-tight truncate">{eq}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes text area */}
          <div className="bg-slate-900/15 border border-slate-900 rounded-lg p-4">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wide border-b border-slate-900 pb-2 mb-3">
              Личные заметки командования
            </h4>
            <textarea
              className="w-full bg-slate-950 border border-slate-900 rounded-lg p-3 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-red-500/50 h-28 font-mono leading-relaxed"
              placeholder="Характеристика бойца, нарушения субординации, дата повышения..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

        </div>

        {/* Save CTA Drawer Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950 sticky bottom-0 z-10 flex gap-2">
          {saveSuccess && (
            <div className="absolute top-[-36px] left-1/2 -translate-x-1/2 bg-emerald-950 border border-emerald-500/30 text-emerald-400 py-1.5 px-4 rounded-md text-[10px] font-mono tracking-wide shadow-lg">
              Личное дело бойца сохранено!
            </div>
          )}
          
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-lg border border-slate-800 transition text-center"
          >
            Отмена
          </button>
          
          <button
            onClick={handleSaveDossierChanges}
            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md shadow-red-950/40 transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить Архив</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
}
