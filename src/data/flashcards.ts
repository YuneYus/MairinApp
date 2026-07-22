

export interface Flashcard {
  id: number;
  category: string;
  question: string;
  answer: boolean;
  explanation: string;
}

export const flashcards = [
{
    id: 1,
    stage: "pregnancy",
    question: "Una mujer embarazada debe evitar todo tipo de ejercicio.",
    answer: false,
  },
  {
    id: 2,
    stage: "pregnancy",
    question: "Comer para dos significa que debes duplicar la cantidad de comida.",
    answer: false,
  },
  {
    id: 3,
    stage: "pregnancy",
    question: "Es importante asistir a los controles prenatales durante el embarazo.",
    answer: true,
  },
  {
    id: 4,
    stage: "pregnancy",
    question: "La forma del vientre puede predecir si el bebé será niño o niña.",
    answer: false,
  },
  {
    id: 5,
    stage: "pregnancy",
    question: "Fumar durante el embarazo puede afectar al bebé.",
    answer: true,
  },
  {
    id: 6,
    stage: "pregnancy",
    question: "Todas las mujeres embarazadas sienten náuseas.",
    answer: false,
  },

  // MENSTRUACIÓN
  {
    id: 7,
    stage: "menstruation",
    question: "No se puede hacer ejercicio durante la menstruación.",
    answer: false,
  },
  {
    id: 8,
    stage: "menstruation",
    question: "Es normal que el ciclo menstrual varíe algunos días.",
    answer: true,
  },
  {
    id: 9,
    stage: "menstruation",
    question: "Bañarse durante la menstruación es perjudicial.",
    answer: false,
  },
  {
    id: 10,
    stage: "menstruation",
    question: "El estrés puede afectar el ciclo menstrual.",
    answer: true,
  },
  {
    id: 11,
    stage: "menstruation",
    question: "Todas las mujeres tienen un ciclo de exactamente 28 días.",
    answer: false,
  },
  {
    id: 12,
    stage: "menstruation",
    question: "Es importante cambiar las toallas sanitarias o tampones con frecuencia.",
    answer: true,
  },

  // MENOPAUSIA
  {
    id: 13,
    stage: "menopause",
    question: "La menopausia significa el fin de la vida sexual.",
    answer: false,
  },
  {
    id: 14,
    stage: "menopause",
    question: "Los sofocos son un síntoma común de la menopausia.",
    answer: true,
  },
  {
    id: 15,
    stage: "menopause",
    question: "Todas las mujeres experimentan los mismos síntomas durante la menopausia.",
    answer: false,
  },
  {
    id: 16,
    stage: "menopause",
    question: "El ejercicio puede ayudar a mejorar algunos síntomas de la menopausia.",
    answer: true,
  },
  {
    id: 17,
    stage: "menopause",
    question: "La menopausia ocurre de un día para otro.",
    answer: false,
  },
  {
    id: 18,
    stage: "menopause",
    question: "Después de la menopausia aumenta el riesgo de osteoporosis.",
    answer: true,
  },
];