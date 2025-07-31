import React, { useRef, useState, useEffect } from "react";
import { RiPlayFill, RiPauseFill } from "react-icons/ri";

const MoodSongs = ({ songs }) => {
  const [allSongs, setAllSongs] = useState([]);
  const audioRefs = useRef([]);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setAllSongs((prevSongs) => {
      const existingIds = new Set(prevSongs.map((s) => s._id || s.title));
      const newUniqueSongs = songs.filter(
        (s) => !existingIds.has(s._id || s.title)
      );
      return [...prevSongs, ...newUniqueSongs];
    });
  }, [songs]);

  useEffect(() => {
    if (currentPlayingIndex !== null && currentPlayingIndex < allSongs.length) {
      const currentAudio = audioRefs.current[currentPlayingIndex];
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      setCurrentPlayingIndex(null);
    }
  }, [allSongs]);

  useEffect(() => {
    let interval;
    if (currentPlayingIndex !== null) {
      const audio = audioRefs.current[currentPlayingIndex];

      interval = setInterval(() => {
        if (audio && !audio.paused && audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 500);
    }

    return () => clearInterval(interval);
  }, [currentPlayingIndex]);

  const togglePlay = (index) => {
    const currentAudio = audioRefs.current[index];
    if (!currentAudio) return;

    if (currentPlayingIndex !== null && currentPlayingIndex !== index) {
      const previousAudio = audioRefs.current[currentPlayingIndex];
      if (previousAudio) previousAudio.pause();
    }

    if (currentAudio.paused) {
      currentAudio.play();
      setCurrentPlayingIndex(index);
    } else {
      currentAudio.pause();
      setCurrentPlayingIndex(null);
      setProgress(0);
    }
  };

  return (
    <div className="mood-song w-full mt-8 ">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 ">
        Recommended <span className="text-purple-700">Songs As </span> Per Your
        Mood...
      </h2>

      {allSongs.length === 0 && (
        <p className="text-gray-500 ">No songs found for this mood.</p>
      )}

      {allSongs.map((song, index) => (
        <div
          key={index}
          className="mb-4 p-4 bg-gray-200  rounded-full shadow flex justify-between items-center"
        >
          <div className="title">
            <h3 className="lg:text-lg font-semibold">{song.title}</h3>
            <p className="text-sm text-gray-600">{song.artist}</p>
          </div>

          {/* Progress Bar */}
          {currentPlayingIndex === index && (
            <input
              type="range"
              className="lg:w-[60%] mt-2 accent-purple-700 w-[30%]"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => {
                const newProgress = parseFloat(e.target.value);
                setProgress(newProgress);
                const audio = audioRefs.current[index];
                if (audio && audio.duration) {
                  audio.currentTime = (audio.duration * newProgress) / 100;
                }
              }}
            />
          )}

          <audio
            ref={(el) => (audioRefs.current[index] = el)}
            className="hidden"
          >
            <source src={song.audio} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>

          <button
            onClick={() => togglePlay(index)}
            className="text-purple-700 text-2xl hover:scale-110 transition"
          >
            {currentPlayingIndex === index ? (
              <RiPauseFill className="text-3xl" />
            ) : (
              <RiPlayFill className="text-3xl" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default MoodSongs;
