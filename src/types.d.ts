export interface triviaQuestion {
  category: string;
  id: string;
  tags: string[];
  difficulty: string;
  regions: string[];
  isNiche: boolean;
  question: {
    text: string;
  };
  correctAnswer: string;
  incorrectAnswers: string[];
  type: string;
}

export interface categoriesList {
  music: boolean;
  sports_and_leisure: boolean;
  film_and_tv: boolean;
  arts_and_literature: boolean;
  history: boolean;
  society_and_culture: boolean;
  science: boolean;
  geography: boolean;
  food_and_drink: boolean;
  general_knowledge: boolean;
}

export interface difficultiesList {
  easy: boolean;
  medium: boolean;
  hard: boolean;
}
