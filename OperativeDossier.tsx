import { Operative, SpeCOp } from '../types';
import { Shield, Users, Target, CircleAlert, Flame, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsProps {
  operatives: Operative[];
  operations: SpeCOp[];
}

export default function DashboardStats({ operatives, operations }: StatsProps) {
  const totalPersonnel = operatives.length;
  const activeFighters = operatives.filter(op => op.status === 'В строю').length;
  const missionFighters = operatives.filter(op => op.status === 'На спецзадании').length;
  const hospitalFighters = operatives.filter(op => op.status === 'В госпитале').length;
  
  const readynessRate = totalPersonnel ? Math.round(((activeFighters + missionFighters) / totalPersonnel) * 100) : 0;
  
  const totalPoints = operatives.reduce((sum, op) => sum + op.points, 0);
  const avgPoints = totalPersonnel ? Math.round(totalPoints / totalPersonnel) : 0;
  
  const successfulOps = operations.filter(op => op.status === 'Успешно').length;
  const totalOps = operations.length;
  const successRate = totalOps ? Math.round((successfulOps / totalOps) * 100) : 0;

  const totalReprimands = operatives.reduce((sum, op) => sum + op.reprimands, 0);

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: 'easeOut'
      }
    })
  };

  const statItems = [
    {
      title: 'Личный Состав',
      value: `${totalPersonnel} оперативников`,
      sub: `${activeFighters} активных, ${missionFighters} на выезде`,
      detail: `${hospitalFighters} в госпитале, ${operatives.filter(o => o.status === 'В отпуске').length} в отпуске`,
      icon: Users,
      color: 'border-red-500/20 text-red-500 bg-red-950/20',
      iconColor: 'text-red-500'
    },
    {
      title: 'Боевая Готовность',
      value: `${readynessRate}%`,
      sub: `Норматив выполнен`,
      detail: `Весь состав укомплектован спецвооружением`,
      icon: Flame,
      color: 'border-orange-500/20 text-orange-500 bg-orange-950/20',
      iconColor: 'text-orange-500'
    },
    {
      title: 'Активность (Баллы)',
      value: `Σ ${totalPoints} / Ср. ${avgPoints}`,
      sub: `Средний балл за службу`,
      detail: `Доминирует снайперское отделение`,
      icon: Target,
      color: 'border-amber-500/20 text-amber-500 bg-amber-950/20',
      iconColor: 'text-amber-500'
    },
    {
      title: 'Успех Спецопераций',
      value: `${successRate}%`,
      sub: `${successfulOps} из ${totalOps} успешно`,
      detail: `Ликвидировано 3 ЧС за неделю`,
      icon: CheckCircle,
      color: 'border-emerald-500/20 text-emerald-500 bg-emerald-950/20',
      iconColor: 'text-emerald-500'
    },
    {
      title: 'Нарушения и Взыскания',
      value: `${totalReprimands} выг.`,
      sub: `Контрдисциплина отряда`,
      detail: `Штаб контролирует субординацию`,
      icon: CircleAlert,
      color: totalReprimands > 3 ? 'border-red-500/30 text-rose-400 bg-red-950/30' : 'border-slate-800 text-slate-400 bg-slate-900/40',
      iconColor: totalReprimands > 3 ? 'text-red-500 animate-pulse' : 'text-slate-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            id={`stat-card-${index}`}
            className={`border rounded-lg p-5 flex flex-col justify-between backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-950/10 hover:border-red-500/30 ${item.color}`}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-2 blur-2xl -mr-6 -mt-6 rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  {item.title}
                </p>
                <p className="text-2xl font-bold font-mono tracking-tight text-white">
                  {item.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 ${item.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/40">
              <p className="text-xs text-slate-300 font-medium">
                {item.sub}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                {item.detail}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
