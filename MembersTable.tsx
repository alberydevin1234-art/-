export interface Operative {
  id: string;
  nickname: string; // Игровой никнейм (например, Alexander_Nevsky)
  callsign: string; // Ползывной (например, "Гром")
  rank: string; // Воинское звание (например, Подполковник)
  position: string; // Должность (например, Командир ОСН)
  specialization: 'Штурмовик' | 'Снайпер' | 'Медик' | 'Сапер' | 'Разведчик' | 'Водитель-Пилот';
  status: 'В строю' | 'На спецзадании' | 'В отпуске' | 'В госпитале' | 'Отстранен';
  points: number; // Текущие баллы за неделю
  reprimands: number; // Выговоры (0-3)
  warnings: number; // Предупреждения (0-2)
  joinDate: string; // Дата вступления
  achievements: string[]; // Медали / Достижения
  avatarColor: string; // Хекс-цвет для аватара
  notes: string; // Личные заметки командования
}

export interface SpeCOp {
  id: string;
  name: string; // Название спецоперации
  date: string; // Дата
  commander: string; // Руководитель операции
  type: 'Штурм' | 'Патруль' | 'Защита ВЧ' | 'Рейд' | 'Сопровождение' | 'Тренировка';
  status: 'Успешно' | 'Провалено' | 'В процессе';
  participantsCount: number;
  rewardPoints: number;
  description: string;
}

export interface ActivityLog {
  id: string;
  operativeId: string;
  operativeName: string;
  actionType: string;
  pointsEarned: number;
  timestamp: string;
  details: string;
}

export interface DutyCategory {
  id: string;
  label: string;
  points: number;
  description: string;
}
