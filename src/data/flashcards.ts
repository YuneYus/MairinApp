

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
    question: "A pregnant woman should avoid all exercise during pregnancy.",
    answer: false,
    explanation:
      "Moderate exercise is usually recommended during pregnancy unless a doctor advises otherwise."
  },
  {
    id: 2,
    stage: "menopause",
    question:
      "Hot flashes are a common symptom during menopause.",
    answer: true,
    explanation:
      "Changes in hormones can cause hot flashes during menopause."
  },
  {
    id: 3,
    stage: "period",
    question:
      "Cramps happen because the uterus contracts during menstruation.",
    answer: true,
    explanation:
      "The uterus contracts to help remove its lining, causing cramps."
  }
];