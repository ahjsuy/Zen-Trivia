import { useState, useEffect } from "react";

interface Props {
  playMusic: number;
  setPlayMusic: (newVolume: number) => void;
}

const MusicButton = ({ playMusic, setPlayMusic }: Props) => {
  const handleMusic = () => {
    let newVolume = 0;
    if (playMusic == 2) {
      newVolume = 0;
    } else {
      newVolume = playMusic + 1;
    }
    setPlayMusic(newVolume);
  };
  return (
    <button
      className="btn"
      style={{ width: "50px", height: "50px" }}
      onClick={handleMusic}
    >
      {playMusic == 2 && (
        <i
          className="fas fa-volume-high fa-2xl"
          style={{ color: "#ffffff" }}
        ></i>
      )}
      {playMusic == 1 && (
        <i
          className="fa-solid fa-volume-low fa-2xl"
          style={{ color: "#ffffff" }}
        ></i>
      )}
      {playMusic == 0 && (
        <i
          className="fa-solid fa-volume-off fa-2xl"
          style={{ color: "#ffffff" }}
        ></i>
      )}
    </button>
  );
};

export default MusicButton;
