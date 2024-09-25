import Checkbox from "../components/Checkbox";
import { useState, useEffect } from "react";

// helper function to save checked categories/difficulties per browser
// session

const saveToSessionStorage = (key: string, value: object) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

interface Props {
  categories: {
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
  };
  difficulties: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
  timerDuration: number;
  setCategories: (category: object) => void;
  setDifficulties: (difficulty: object) => void;
  setTimerDuration: (timerDuration: number) => void;
}

const TriviaSettings = ({
  categories,
  difficulties,
  setCategories,
  setDifficulties,
}: Props) => {
  // everytime the categories/difficulties state is updated, save it to session

  useEffect(() => {
    saveToSessionStorage("categories", categories);
  }, [categories]);

  useEffect(() => {
    saveToSessionStorage("difficulties", difficulties);
  }, [difficulties]);

  // when the category/difficulty is updated, that means its state is the opposite of the prev
  // state, so update it in that way

  const handleCategory = (category: string) => {
    let newCategories = { ...categories };
    newCategories[category as keyof typeof categories] =
      !newCategories[category as keyof typeof categories];
    setCategories(newCategories);
    console.log(categories);
  };

  const handleDifficulty = (difficulty: string) => {
    let newDifficulties = { ...difficulties };
    newDifficulties[difficulty as keyof typeof difficulties] =
      !newDifficulties[difficulty as keyof typeof difficulties];
    setDifficulties(newDifficulties);
    console.log(difficulties);
  };

  // render the categories/difficulties checkboxes
  return (
    <div>
      <div style={{ padding: "20px" }}>
        <h2>Categories</h2>
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="Music"
          category="music"
          isChecked={categories["music"]}
        />
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="Sports and Leisure"
          category="sports_and_leisure"
          isChecked={categories["sports_and_leisure"]}
        />
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="Film and TV"
          category="film_and_tv"
          isChecked={categories["film_and_tv"]}
        />
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="Arts and Literature"
          category="arts_and_literature"
          isChecked={categories["arts_and_literature"]}
        />
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="History"
          category="history"
          isChecked={categories["history"]}
        />
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="Society and Culture"
          category="society_and_culture"
          isChecked={categories["society_and_culture"]}
        />
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="Science"
          category="science"
          isChecked={categories["science"]}
        />
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="Geography"
          category="geography"
          isChecked={categories["geography"]}
        />
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="Food and Drink"
          category="food_and_drink"
          isChecked={categories["food_and_drink"]}
        />
        <Checkbox
          handleCheckboxChange={handleCategory}
          displayName="General Knowledge"
          category="general_knowledge"
          isChecked={categories["general_knowledge"]}
        />
      </div>
      <div style={{ padding: "20px" }}>
        <h2>Difficulties</h2>
        <Checkbox
          handleCheckboxChange={handleDifficulty}
          displayName="Easy"
          category="easy"
          isChecked={difficulties["easy"]}
        />
        <Checkbox
          handleCheckboxChange={handleDifficulty}
          displayName="Medium"
          category="medium"
          isChecked={difficulties["medium"]}
        />
        <Checkbox
          handleCheckboxChange={handleDifficulty}
          displayName="Hard"
          category="hard"
          isChecked={difficulties["hard"]}
        />
      </div>
      <div style={{ padding: "20px" }}>
        <h2>Set Timer Duration</h2>
        <input
          type="number"
          id="timerDurationInput"
          className="form-control"
          min="3"
          max="30"
          placeholder="15"
          style={{ width: "75px" }}
          // onChange={(document.getElementById('timerDurationInput').value) => }
        />
        <div id="timerDurationInput" className="form-text">
          Please input a number between 3 - 30 seconds.
        </div>
      </div>
    </div>
  );
};

export default TriviaSettings;
