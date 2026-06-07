import { Operative, SpeCOp, DutyCategory } from './types';

export const INITIAL_OPERATIVES: Operative[] = [
  {
    id: 'op-1',
    nickname: 'Alexander_Gromov',
    callsign: 'Волк',
    rank: 'Полковник',
    position: 'Командир ОСН',
    specialization: 'Разведчик',
    status: 'В строю',
    points: 135,
    reprimands: 0,
    warnings: 0,
    joinDate: '2026-01-12',
    achievements: ['Орден Мужества', 'Лучший Боец Месяца', 'Медаль за Спасение'],
    avatarColor: '#EF4444', // Red
    notes: 'Отличный тактик, руководит ОСН "Берсерк" на сервере TITAN более 6 месяцев. Проводит регулярные КТО.'
  },
  {
    id: 'op-2',
    nickname: 'Dmitry_Sokolov',
    callsign: 'Сокол',
    rank: 'Майор',
    position: 'Зам. Командира ОСН',
    specialization: 'Снайпер',
    status: 'В строю',
    points: 92,
    reprimands: 0,
    warnings: 1,
    joinDate: '2026-02-15',
    achievements: ['Медаль за Отвагу', 'Снайпер-Ас'],
    avatarColor: '#F59E0B', // Amber
    notes: 'Заместитель командира. Ответственный за огневую подготовку снайперского отделения.'
  },
  {
    id: 'op-3',
    nickname: 'Maxim_Morozov',
    callsign: 'Мороз',
    rank: 'Капитан',
    position: 'Инструктор ОСН',
    specialization: 'Штурмовик',
    status: 'В строю',
    points: 78,
    reprimands: 1,
    warnings: 0,
    joinDate: '2026-03-01',
    achievements: ['Инструктор Высшей Категории'],
    avatarColor: '#3B82F6', // Blue
    notes: 'Обучает новобранцев штурмовой тактике. Имеет один устный выговор за превышение полномочий на рейде.'
  },
  {
    id: 'op-4',
    nickname: 'Egor_Smirnov',
    callsign: 'Каратель',
    rank: 'Старший Лейтенант',
    position: 'Старший Боец ОСН',
    specialization: 'Сапер',
    status: 'На спецзадании',
    points: 64,
    reprimands: 0,
    warnings: 0,
    joinDate: '2026-03-24',
    achievements: ['Мастер Разминирования'],
    avatarColor: '#10B981', // Emerald
    notes: 'В данный момент находится под прикрытием в рамках операции по ликвидации ОПГ.'
  },
  {
    id: 'op-5',
    nickname: 'Artem_Denisov',
    callsign: 'Гром',
    rank: 'Лейтенант',
    position: 'Боец ОСН',
    specialization: 'Штурмовик',
    status: 'В строю',
    points: 42,
    reprimands: 0,
    warnings: 2,
    joinDate: '2026-04-10',
    achievements: [],
    avatarColor: '#8B5CF6', // Purple
    notes: 'Показал отличные результаты на штурме банка у Южного. Требует присмотра из-за частых нарушений субординации.'
  },
  {
    id: 'op-6',
    nickname: 'Nikita_Vlasov',
    callsign: 'Агат',
    rank: 'Младший Лейтенант',
    position: 'Боец ОСН',
    specialization: 'Медик',
    status: 'В госпитале',
    points: 30,
    reprimands: 0,
    warnings: 0,
    joinDate: '2026-04-29',
    achievements: ['Красный Крест ОСН'],
    avatarColor: '#EC4899', // Pink
    notes: 'Получил ранение при обороне Военного Склада от ОПГ "Халифат". Находится на реабилитации.'
  },
  {
    id: 'op-7',
    nickname: 'Pavel_Kozlov',
    callsign: 'Призрак',
    rank: 'Старший Прапорщик',
    position: 'Боец ОСН',
    specialization: 'Водитель-Пилот',
    status: 'В отпуске',
    points: 15,
    reprimands: 2,
    warnings: 0,
    joinDate: '2026-05-02',
    achievements: [],
    avatarColor: '#6B7280', // Slate
    notes: 'Высококлассный водитель БТР и пилот вертолета. Ушел в недельный отпуск.'
  },
  {
    id: 'op-8',
    nickname: 'Andrey_Volkov',
    callsign: 'Сапсан',
    rank: 'Прапорщик',
    position: 'Стажер ОСН',
    specialization: 'Штурмовик',
    status: 'В строю',
    points: 10,
    reprimands: 0,
    warnings: 0,
    joinDate: '2026-05-20',
    achievements: [],
    avatarColor: '#14B8A6', // Teal
    notes: 'Недавно прошел вербовку из УВД-Ю. Сдает зачеты по уставу и тактике.'
  }
];

export const INITIAL_SPECIAL_OPS: SpeCOp[] = [
  {
    id: 'op-101',
    name: 'Зачистка Воинской Части от ОПГ',
    date: '2026-06-05',
    commander: 'Alexander_Gromov',
    type: 'Защита ВЧ',
    status: 'Успешно',
    participantsCount: 6,
    rewardPoints: 20,
    description: 'Отражение вооруженного нападения бандитской группировки на склады боеприпасов ВЧ. Все нападавшие нейтрализованы, склад сохранен.'
  },
  {
    id: 'op-102',
    name: 'Штурм захваченного ТРК "Ритм"',
    date: '2026-06-03',
    commander: 'Dmitry_Sokolov',
    type: 'Штурм',
    status: 'Успешно',
    participantsCount: 5,
    rewardPoints: 25,
    description: 'Ликвидация ЧС с удержанием заложников. Штурмовая группа вошла через крышу, снайперы обеспечили прикрытие. 4 заложника спасены без потерь.'
  },
  {
    id: 'op-103',
    name: 'Рейд на склад наркодилеров у Батырево',
    date: '2026-06-01',
    commander: 'Maxim_Morozov',
    type: 'Рейд',
    status: 'Успешно',
    participantsCount: 4,
    rewardPoints: 15,
    description: 'Внезапная проверка складских помещений на окраине ПГТ Батырево. Изъято 450 кг запрещенных веществ, задержано 3 члена преступной группы.'
  },
  {
    id: 'op-104',
    name: 'Сопровождение колонны Правительства у Арзамаса',
    date: '2026-05-29',
    commander: 'Alexander_Gromov',
    type: 'Сопровождение',
    status: 'Провалено',
    participantsCount: 4,
    rewardPoints: 10,
    description: 'Сопровождение кортежа губернатора. Из-за утечки информации ОПГ устроила засаду на мосту. Кортеж был обстрелян, один автомобиль уничтожен. Операция считается провальной.'
  }
];

export const DUTY_CATEGORIES: DutyCategory[] = [
  {
    id: 'act-1',
    label: 'Задержание ООП (Особо Опасного Преступника)',
    points: 5,
    description: 'Задержание игрока с уровнем розыска 4-6 звёзд с последующим арестом'
  },
  {
    id: 'act-2',
    label: 'Участие в ГРП (Глобальном RolePlay мероприятии)',
    points: 15,
    description: 'Координация и прямое участие в крупномасштабных серверных сценариях от администрации'
  },
  {
    id: 'act-3',
    label: 'Охрана Воинской Части (10 минут)',
    points: 2,
    description: 'Нахождение на посту КПП-1, складе или вышке на ВЧ с докладами в рацию раз в 10 минут'
  },
  {
    id: 'act-4',
    label: 'Сопровождение Колонны ВЧ / ФСБ',
    points: 8,
    description: 'Сопровождение военного транспорта с патронами или кортежа руководства'
  },
  {
    id: 'act-5',
    label: 'Участие в тренировке или лекции по тактике',
    points: 4,
    description: 'Присутствие и выполнение задач на тренировках от руководящего состава'
  },
  {
    id: 'act-6',
    label: 'Предотвращение ЧС на территории Нижегородской области',
    points: 10,
    description: 'Ликвидация нападений на инкассаторов, гос. здания или освобождение заложников'
  },
  {
    id: 'act-7',
    label: 'Проведение лекции / тренировки для состава (для Офицеров)',
    points: 6,
    description: 'Самостоятельно подготовленная и проведенная тактическая подготовка бойцов ОСН'
  },
  {
    id: 'act-8',
    label: 'Успешный рейд на наркопритон или нелегальный клуб',
    points: 12,
    description: 'Участие в штурме наркологических вертепов вместе со следственным комитетом'
  }
];

export const AVAILABLE_RANKS = [
  'Рядовой',
  'Сержант',
  'Старшина',
  'Прапорщик',
  'Старший Прапорщик',
  'Младший Лейтенант',
  'Лейтенант',
  'Старший Лейтенант',
  'Капитан',
  'Майор',
  'Подполковник',
  'Полковник',
  'Генерал-Майор',
  'Генерал-Лейтенант'
];

export const AVAILABLE_POSITIONS = [
  'Командир ОСН',
  'Зам. Командира ОСН',
  'Инструктор ОСН',
  'Старший Боец ОСН',
  'Боец ОСН',
  'Стажер ОСН'
];

export const AVAILABLE_SPECIALIZATIONS = [
  'Штурмовик',
  'Снайпер',
  'Медик',
  'Сапер',
  'Разведчик',
  'Водитель-Пилот'
];
