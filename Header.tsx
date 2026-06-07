import { useState } from 'react';
import { Operative, DutyCategory, ActivityLog } from '../types';
import { DUTY_CATEGORIES } from '../initialData';
import { Calculator, Copy, Check, FileText, Send, RefreshCw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportCalculatorProps {
  operatives: Operative[];
  onApplyPoints: (operativeId: string, points: number, activityDetails: string) => void;
}

export default function ReportCalculator({ operatives, onApplyPoints }: ReportCalculatorProps) {
  const [selectedOpId, setSelectedOpId] = useState<string>('');
  const [quantities, setQuantities] = useState<Record<string, number>>(
    DUTY_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: 0 }), {})
  );
  const [screenUrls, setScreenUrls] = useState<Record<string, string>>(
    DUTY_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: '' }), {})
  );

  const [copied, setCopied] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const selectedOp = operatives.find(op => op.id === selectedOpId);

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  const handleUrlChange = (id: string, url: string) => {
    setScreenUrls(prev => ({
      ...prev,
      [id]: url
    }));
  };

  const calculateTotalPoints = () => {
    return DUTY_CATEGORIES.reduce((sum, cat) => {
      return sum + (quantities[cat.id] * cat.points);
    }, 0);
  };

  const handleReset = () => {
    setQuantities(DUTY_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: 0 }), {}));
    setScreenUrls(DUTY_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: '' }), {}));
    setSelectedOpId('');
    setAppliedSuccess(false);
  };

  const generateReportText = (format: 'bbcode' | 'plain') => {
    const op = selectedOp || { nickname: 'Nick_Name', rank: 'Звание', position: 'Должность', callsign: 'Берсерк' };
    const totalPoints = calculateTotalPoints();
    const date = new Date().toLocaleDateString('ru-RU');
    
    // Filter out rows with 0 quantities
    const itemsDone = DUTY_CATEGORIES.filter(cat => quantities[cat.id] > 0);

    if (format === 'bbcode') {
      let bbc = `[RIGHT][FONT=Trebuchet MS]Командиру ОСН «Берсерк» Полковнику Громову А.В.\nОт боевого сотрудника ОСН «Берсерк» ${op.rank} ${op.nickname}[/FONT][/RIGHT]\n\n`;
      bbc += `[CENTER][B][SIZE=5][FONT=Trebuchet MS]Р А П О Р Т[/FONT][/SIZE][/B]\n`;
      bbc += `[FONT=Trebuchet MS]О проделанной служебно-боевой работе подразделения за период службы[/FONT][/CENTER]\n\n`;
      bbc += `[FONT=Trebuchet MS]Я, сотрудник ОСН «Берсерк», состоящий в звании [B]${op.rank}[/B] и занимающий должность [B]${op.position}[/B] под позывным [B]«${op.callsign || 'Берсерк'}»[/B], предоставляю отчетную ведомость о проделанной мной работе.\n`;
      bbc += `К рапорту прилагаю ксерокопию удостоверения и фиксации проделанной работы:\n\n`;
      
      if (itemsDone.length === 0) {
        bbc += `[I](Список проделанной работы пуст, заполните калькулятор на сайте)[/I]\n`;
      } else {
        itemsDone.forEach((cat, index) => {
          const countLabel = cat.id === 'act-3' ? 'минут' : 'раз(а)';
          const urlStr = screenUrls[cat.id] ? `[URL='${screenUrls[cat.id]}']Фиксация выполнения[/URL]` : `[Ссылка не приложена]`;
          bbc += `${index + 1}. [B]${cat.label}[/B] в количестве [B]${quantities[cat.id]}[/B] ${countLabel} — ${urlStr} (+${quantities[cat.id] * cat.points} баллов)\n`;
        });
      }
      
      bbc += `\n[B]Итого набрано баллов на этой неделе:[/B] [COLOR=#EF4444][B]${totalPoints}[/B][/COLOR] баллов.\n\n`;
      bbc += `Дата подачи: ${date}\n`;
      bbc += `Личная подпись: ${op.nickname ? op.nickname.substring(0, 5) + '_Bers' : 'BERSERK'}[/FONT]`;
      return bbc;
    } else {
      let txt = `Кому: Командиру ОСН «Берсерк» Полковнику Громову А.В.\nОт: ${op.rank} ОСН «Берсерк» ${op.nickname}\n\n`;
      txt += `Р А П О Р Т\n\n`;
      txt += `Я, сотрудник ОСН «Берсерк», состоящий в звании ${op.rank}, занимающий должность ${op.position}, предоставляю отчет о проделанной работе:\n`;
      
      if (itemsDone.length === 0) {
        txt += `- Нет зарегистрированной работы -\n`;
      } else {
        itemsDone.forEach((cat, index) => {
          const countLabel = cat.id === 'act-3' ? 'мин.' : 'ед.';
          const proof = screenUrls[cat.id] ? `Ссылка: ${screenUrls[cat.id]}` : 'Фиксации без ссылки';
          txt += `${index + 1}) ${cat.label} x${quantities[cat.id]} ${countLabel}. ${proof} (+${quantities[cat.id] * cat.points} б.)\n`;
        });
      }
      
      txt += `\nИтого баллов: ${totalPoints} / 60 для повышения квалификации.\n`;
      txt += `Дата: ${date}\n`;
      txt += `Подпись: ${op.nickname ? op.nickname.split('_')[0] : 'BER'}_TITAN`;
      return txt;
    }
  };

  const handleCopyToClipboard = (format: 'bbcode' | 'plain') => {
    const text = generateReportText(format);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToOperative = () => {
    if (!selectedOpId) return;
    const totalPoints = calculateTotalPoints();
    if (totalPoints === 0) return;

    const summaryParts: string[] = [];
    DUTY_CATEGORIES.forEach(cat => {
      if (quantities[cat.id] > 0) {
        summaryParts.push(`${cat.label} (x${quantities[cat.id]})`);
      }
    });

    onApplyPoints(selectedOpId, totalPoints, summaryParts.join(', '));
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-950/30 border border-slate-900 rounded-xl p-6 backdrop-blur-xl" id="duty-calculator-section">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-red-500" />
            Универсальный Калькулятор и Генератор Рапортов
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Рассчитайте баллы за дежурства и сгенерируйте готовый BB-код для форума Amazing RP
          </p>
        </div>
        
        <button
          onClick={handleReset}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono transition border border-slate-850 flex items-center gap-1.5"
          title="Сбросить все поля"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Сбросить данные</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: point logging table */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-900/40 p-4 border border-slate-900 rounded-lg">
            <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">
              Шаг 1: Выберите Бойца для Зачисления
            </label>
            <select
              className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500/50 transition font-mono"
              value={selectedOpId}
              onChange={(e) => setSelectedOpId(e.target.value)}
            >
              <option value="">-- Выбрать исполнителя --</option>
              {operatives.map(op => (
                <option key={op.id} value={op.id}>
                  {op.nickname} • «{op.callsign}» ({op.rank}) — Текущие баллы: {op.points} б.
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950/40 border border-slate-900 rounded-lg overflow-hidden">
            <div className="p-3 bg-slate-900/50 border-b border-slate-900 font-mono text-[10px] text-slate-400 flex justify-between items-center uppercase tracking-wider">
              <span>Нормативы Набора Баллов</span>
              <span>Баллы за ед.</span>
            </div>
            
            <div className="divide-y divide-slate-900/80 max-h-[380px] overflow-y-auto pr-1">
              {DUTY_CATEGORIES.map((cat) => {
                const qty = quantities[cat.id];
                return (
                  <div key={cat.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900/10 transition">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-200">{cat.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{cat.description}</p>
                      
                      {/* URL input if done */}
                      {qty > 0 && (
                        <div className="mt-2">
                          <input 
                            type="text"
                            placeholder="Вставьте ссылку на Imgur/Yapx (док-ва)..."
                            className="w-full bg-slate-950 border border-slate-900 rounded px-2.5 py-1 text-[10px] text-red-300 placeholder-slate-600 focus:outline-none focus:border-red-600/30 font-mono"
                            value={screenUrls[cat.id]}
                            onChange={(e) => handleUrlChange(cat.id, e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-none pt-2 md:pt-0 border-slate-900">
                      <div className="font-mono text-xs text-amber-500 font-bold bg-amber-950/20 px-2 py-0.5 rounded border border-amber-500/10">
                        +{cat.points} б.
                      </div>
                      
                      <div className="flex items-center gap-1 bg-slate-950 border border-slate-900 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-white">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 transition text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: output preview & BBCode template generator */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Dynamic Scoring Display */}
          <div className="bg-gradient-to-br from-slate-950 to-red-950/10 border border-red-900/20 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-44">
            <div className="absolute top-2 right-2 w-16 h-16 bg-red-600/5 blur-2xl rounded-full pointer-events-none" />
            
            <div>
              <span className="text-[9px] font-mono tracking-widest text-red-400 uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-red-500 animate-pulse" />
                Расчет Активности Бойца
              </span>
              <h3 className="text-3xl font-extrabold text-white tracking-wider font-mono mt-2">
                {calculateTotalPoints()}{' '}
                <span className="text-xs font-normal text-slate-400 font-sans">баллов набрано</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                {selectedOp ? `Исполнитель: ${selectedOp.nickname} [«${selectedOp.callsign}»]` : 'Боец не выбран (рапорт будет шаблонным)'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-900 flex gap-2">
              <button
                onClick={handleApplyToOperative}
                disabled={!selectedOpId || calculateTotalPoints() === 0}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-2 ${
                  selectedOpId && calculateTotalPoints() > 0
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-950/40'
                    : 'bg-slate-900 text-slate-500 border border-slate-950 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Зачислить в личную карту</span>
              </button>
            </div>
          </div>

          {/* Success apply Banner */}
          <AnimatePresence>
            {appliedSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 rounded-lg p-3 text-xs font-mono flex items-center gap-2.5"
              >
                <Check className="w-4 h-4 text-emerald-400 bg-emerald-950 rounded-full p-0.5 border border-emerald-500/30" />
                <span>Баллы успешно начислены! Данные обновлены в личном деле оперативника.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab preview generate */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg flex flex-col flex-1 min-h-[280px]">
            <div className="p-3 bg-slate-900/60 border-b border-slate-900 flex justify-between items-center text-xs font-mono font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                Ксерокопия Рапорта
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleCopyToClipboard('bbcode')}
                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] rounded border border-slate-800 hover:border-slate-700 transition"
                >
                  Копировать BB-Code
                </button>
                <button
                  onClick={() => handleCopyToClipboard('plain')}
                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] rounded border border-slate-800 hover:border-slate-700 transition"
                >
                  Текст (Обычный)
                </button>
              </div>
            </div>

            {/* Live Text Preview Box */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[280px] bg-slate-950/90 font-mono text-[10px] text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-red-800/50">
              {generateReportText('bbcode')}
            </div>

            {/* Copy indicator footer */}
            <div className="p-2.5 bg-slate-900/20 border-t border-slate-900 text-center flex items-center justify-center">
              {copied ? (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 flex-row">
                  <Check className="w-3 h-3" /> Успешно скопировано в буфер обмена! Можно вставить на форум
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">
                  Верхний блок копирует готовый BB-код с тегами для вставки на форум Amazing RP (раздел рапортов).
                </span>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
