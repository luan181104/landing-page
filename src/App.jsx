import React, { useState, useEffect } from "react";
import { AiOutlineSync } from "react-icons/ai";

const TypingTest = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState([0, 0]);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isStarted, setIsStarted] = useState(false);
  const [results, setResults] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
  });
  const [wordStatus, setWordStatus] = useState([[], []]);

  const wordsPerRow = 10;

  const wordList = [
    "apple",
    "grape",
    "peach",
    "lemon",
    "timer",
    "black",
    "hello",
    "first",
    "mango",
    "melon",
    "berry",
    "brown",
    "green",
  ];

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isStarted]);

  const generateWords = () => {
    const randomWords = [];
    for (let i = 0; i < wordsPerRow * 2; i++) {
      randomWords.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return [randomWords.slice(0, wordsPerRow), randomWords.slice(wordsPerRow)];
  };

  const handleInputChange = (e) => {
    if (!isStarted) setIsStarted(true);
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      const trimmedValue = inputValue.trim();
      if (!trimmedValue) return;

      // Cập nhật kết quả khi nhập đúng/sai
      setResults((prev) => ({
        total: prev.total + 1,
        correct:
          trimmedValue === words[currentWordIndex[0]][currentWordIndex[1]]
            ? prev.correct + 1
            : prev.correct,
        incorrect:
          trimmedValue !== words[currentWordIndex[0]][currentWordIndex[1]]
            ? prev.incorrect + 1
            : prev.incorrect,
      }));

      // Cập nhật trạng thái của từ hiện tại (đúng hay sai)
      setWordStatus((prevStatus) => {
        const newStatus = [...prevStatus]; // Tạo bản sao của trạng thái hiện tại

        // Đảm bảo rằng mỗi hàng có một mảng trạng thái riêng
        if (!newStatus[currentWordIndex[0]]) {
          newStatus[currentWordIndex[0]] = [];
        }

        // Cập nhật trạng thái của từ tại vị trí hiện tại
        newStatus[currentWordIndex[0]][currentWordIndex[1]] =
          trimmedValue === words[currentWordIndex[0]][currentWordIndex[1]]
            ? "correct"
            : "incorrect";

        return newStatus;
      });

      setInputValue("");

      // Chuyển sang từ tiếp theo trong hàng hiện tại
      if (currentWordIndex[1] + 1 < words[currentWordIndex[0]].length) {
        setCurrentWordIndex([currentWordIndex[0], currentWordIndex[1] + 1]);
      } else {
        // Nếu hết từ trong hàng, chuyển sang hàng tiếp theo
        if (currentWordIndex[0] + 1 < words.length) {
          setCurrentWordIndex([currentWordIndex[0] + 1, 0]);
        } else {
          // Nếu hết tất cả các hàng, tạo lại các hàng mới
          setWords(generateWords());
          setCurrentWordIndex([0, 0]);
          setWordStatus([[], []]);
        }
      }
    }
  };

  const refreshTest = () => {
    setWords(generateWords());
    setCurrentWordIndex([0, 0]);
    setInputValue("");
    setTimeLeft(60);
    setIsStarted(false);
    setResults({ total: 0, correct: 0, incorrect: 0 });
    setWordStatus([[], []]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Typing Test</h1>
      <h2>Võ Minh Luân - SE184376</h2>

      <div
        className="words-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: "750px",
          margin: "20px 0",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          fontSize: "18px",
          fontFamily: "Times New Roman",
        }}
      >
        {words.map((row, rowIndex) => {
          return row.map((word, index) => {
            let backgroundColor = "white";
            if (
              rowIndex === currentWordIndex[0] &&
              index === currentWordIndex[1]
            ) {
              backgroundColor = "gray";
            } else if (
              rowIndex === currentWordIndex[0] &&
              index < currentWordIndex[1]
            ) {
              backgroundColor =
                wordStatus[rowIndex][index] === "correct" ? "green" : "red";
            }
            return (
              <span
                key={`${rowIndex}-${index}`}
                style={{
                  padding: "5px 10px",
                  margin: "5px",
                  borderRadius: "4px",
                  backgroundColor: backgroundColor,
                  color:
                    rowIndex === currentWordIndex[0] &&
                    index === currentWordIndex[1]
                      ? "white"
                      : "black",
                }}
              >
                {word}
              </span>
            );
          });
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: "#A7C8E7",
          maxWidth: "750px",
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={timeLeft === 0}
          style={{
            padding: "10px",
            width: "300px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100px",
            height: "50px",
            backgroundColor: "#3c4d5c",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          <p>{timeLeft}s</p>
        </div>

        <button
          onClick={refreshTest}
          style={{
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#428bca",
            cursor: "pointer",
            color: "white",
          }}
        >
          <AiOutlineSync style={{ fontSize: "20px" }} />
        </button>
      </div>

      {timeLeft === 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Results</h2>
          <p>Total Words Typed: {results.total}</p>
          <p>Correct Words: {results.correct}</p>
          <p>Incorrect Words: {results.incorrect}</p>
        </div>
      )}
    </div>
  );
};

export default TypingTest;
