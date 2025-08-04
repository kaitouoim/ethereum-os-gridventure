/*
 * ===================================================================
 * ETHEREUM OS GRIDVENTURE -  TRADING GAME
 * ===================================================================
 *
 * Copyright (c) 2025 @SwordEyz-Emonymous
 * All Rights Reserved.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const EthereumGridventure = () => {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playerAnimation, setPlayerAnimation] = useState("");

  // New states for trading line effects
  const [tradingLine, setTradingLine] = useState(null);
  const [showTradingLine, setShowTradingLine] = useState(false);
  const [lineAnimation, setLineAnimation] = useState(false);

  const audioContextRef = useRef(null);

  // Game board configuration
  const boardSize = 100;
  const gridCols = 10;

  // Ladders (start -> end) - Educational boosts
  const ladders = {
    4: 14, // Early DeFi learning
    9: 21, // Smart contract basics
    16: 26, // Blockchain fundamentals
    20: 42, // Web3 knowledge
    28: 84, // Major breakthrough
    40: 59, // Advanced concepts
    51: 67, // DeFi protocols
    63: 81, // Layer 2 solutions
    71: 91, // Almost there!
  };

  // Snakes/FUD (start -> end) - Fear, Uncertainty, Doubt
  const snakes = {
    98: 78, // Last minute FUD
    95: 75, // Major correction
    93: 73, // Bear market fears
    87: 24, // Crypto winter
    62: 19, // Regulation FUD
    54: 34, // Technical issues
    49: 11, // Market crash
    64: 43, // Scam concerns
    56: 53, // Minor setback
    88: 67, // Volatility fear
  };

  // Educational and FUD messages
  const eduMessages = [
    "🎓 DeFi allows peer-to-peer financial services without banks!",
    "💡 Smart contracts execute automatically when conditions are met!",
    "🔐 Your private keys = your crypto. Never share them!",
    "🌍 Ethereum enables global, permissionless innovation!",
    "⚡ Layer 2 solutions make transactions faster and cheaper!",
    "🏗️ DApps run on decentralized networks, not single servers!",
    "💎 HODLing means holding for long-term value growth!",
  ];

  const fudMessages = [
    "😱 FUD Alert: 'Crypto is just a bubble that will burst!'",
    "🚨 FUD Alert: 'Government will ban all cryptocurrencies!'",
    "💥 FUD Alert: 'Ethereum will be replaced by newer blockchains!'",
    "⚠️ FUD Alert: 'DeFi is too risky for normal people!'",
    "🔥 FUD Alert: 'Crypto mining destroys the environment!'",
    "💸 FUD Alert: 'You'll lose all your money in crypto!'",
    "🌪️ FUD Alert: 'Crypto is only used by criminals!'",
  ];

  // Create trading line between two positions
  const createTradingLine = (fromPos, toPos, isBullish) => {
    const fromStyle = getPositionStyle(fromPos);
    const toStyle = getPositionStyle(toPos);

    // Convert percentage to pixels (approximate for calculation)
    const fromX = parseFloat(fromStyle.left);
    const fromY = 100 - parseFloat(fromStyle.bottom); // Invert Y for screen coordinates
    const toX = parseFloat(toStyle.left);
    const toY = 100 - parseFloat(toStyle.bottom);

    const length = Math.sqrt(
      Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2)
    );
    const angle = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;

    return {
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      length,
      angle,
      isBullish,
      fromPos,
      toPos,
    };
  };

  // Show trading line animation
  const showTradingLineAnimation = (fromPos, toPos, isBullish) => {
    const lineData = createTradingLine(fromPos, toPos, isBullish);
    setTradingLine(lineData);
    setShowTradingLine(true);
    setLineAnimation(true);

    // Hide after animation completes
    setTimeout(() => {
      setLineAnimation(false);
      setTimeout(() => {
        setShowTradingLine(false);
        setTradingLine(null);
      }, 500);
    }, 2000);
  };

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== "undefined" && window.AudioContext) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
  }, []);

  // Play sound effects
  const playSound = (type) => {
    if (!soundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case "dice":
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          200,
          ctx.currentTime + 0.1
        );
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case "ladder":
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          800,
          ctx.currentTime + 0.5
        );
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.5);
        break;
      case "snake":
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const glitchOsc = ctx.createOscillator();
            const glitchGain = ctx.createGain();
            glitchOsc.connect(glitchGain);
            glitchGain.connect(ctx.destination);
            glitchOsc.frequency.setValueAtTime(
              Math.random() * 1000 + 100,
              ctx.currentTime
            );
            glitchGain.gain.setValueAtTime(0.05, ctx.currentTime);
            glitchGain.gain.exponentialRampToValueAtTime(
              0.01,
              ctx.currentTime + 0.1
            );
            glitchOsc.start();
            glitchOsc.stop(ctx.currentTime + 0.1);
          }, i * 50);
        }
        break;
      case "win":
        oscillator.frequency.setValueAtTime(523, ctx.currentTime);
        oscillator.frequency.setValueAtTime(659, ctx.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.6);
        break;
    }
  };

  const rollDice = () => {
    if (isRolling || gameWon) return;

    setIsRolling(true);
    playSound("dice");

    // Generate truly random dice value first
    const finalDiceValue = Math.floor(Math.random() * 6) + 1;

    // Dice rolling animation with random values during animation
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= 15) {
        clearInterval(rollInterval);
        setDiceValue(finalDiceValue);
        movePlayer(finalDiceValue);
        setIsRolling(false);
      }
    }, 80);
  };

  const movePlayer = (steps) => {
    const startPosition = playerPosition;
    let newPosition = playerPosition + steps;

    // Check if player wins
    if (newPosition >= boardSize) {
      newPosition = boardSize;
      setPlayerPosition(newPosition);
      setGameWon(true);
      playSound("win");
      showGameMessage(
        "🎉 Congratulations! You've mastered the Ethereum ecosystem! 🎉",
        "win"
      );
      // Show massive bull run for winning
      showPriceMovementIndicator(startPosition, newPosition, "bull");
      return;
    }

    // Show initial movement
    setPlayerPosition(newPosition);

    // Check for ladders
    if (ladders[newPosition]) {
      setTimeout(() => {
        setPlayerAnimation("bounce");
        playSound("ladder");
        const ladderEnd = ladders[newPosition];

        // Show bullish trading line from ladder start to end
        showTradingLineAnimation(newPosition, ladderEnd, true);

        setPlayerPosition(ladderEnd);
        showGameMessage(
          eduMessages[Math.floor(Math.random() * eduMessages.length)],
          "edu"
        );
        setTimeout(() => setPlayerAnimation(""), 600);
      }, 500);
    }
    // Check for snakes/FUD
    else if (snakes[newPosition]) {
      setTimeout(() => {
        setPlayerAnimation("wiggle");
        playSound("snake");
        const snakeEnd = snakes[newPosition];

        // Show bearish trading line from snake start to end
        showTradingLineAnimation(newPosition, snakeEnd, false);

        setPlayerPosition(snakeEnd);
        showGameMessage(
          fudMessages[Math.floor(Math.random() * fudMessages.length)],
          "fud"
        );
        setTimeout(() => setPlayerAnimation(""), 800);
      }, 500);
    }
  };

  const showGameMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4000);
  };

  const resetGame = () => {
    setPlayerPosition(1);
    setDiceValue(1);
    setGameStarted(false);
    setGameWon(false);
    setMessage("");
    setShowMessage(false);
    setMessageType("");
    setPlayerAnimation("");
    setShowTradingLine(false);
    setTradingLine(null);
    setLineAnimation(false);
  };

  const getPositionStyle = (position) => {
    // Calculate row from bottom (0-based)
    const row = Math.floor((position - 1) / gridCols);
    // Calculate column (0-based)
    const col = (position - 1) % gridCols;

    // Snake pattern: even rows (0,2,4...) go left-to-right, odd rows go right-to-left
    const actualCol = row % 2 === 0 ? col : gridCols - 1 - col;

    return {
      left: `${actualCol * 10 + 5}%`,
      bottom: `${row * 10 + 5}%`,
    };
  };

  const renderBoard = () => {
    const cells = [];
    // Render from 1 to 100, but arrange in snake pattern
    for (let row = 9; row >= 0; row--) {
      for (let col = 0; col < gridCols; col++) {
        // Calculate cell number based on snake pattern
        let cellNum;
        if (row % 2 === 1) {
          cellNum = row * gridCols + (gridCols - col);
        } else {
          cellNum = row * gridCols + (col + 1);
        }

        const isLadder = ladders[cellNum];
        const isSnake = snakes[cellNum];

        cells.push(
          <div
            key={cellNum}
            className={`
              relative w-full h-full border border-cyan-500/30 flex items-center justify-center text-xs font-bold
              ${isLadder ? "bg-green-500/30 border-green-400" : ""}
              ${isSnake ? "bg-red-500/30 border-red-400" : ""}
              ${cellNum === 1 ? "bg-yellow-500/30 border-yellow-400" : ""}
              ${
                cellNum === boardSize
                  ? "bg-purple-500/30 border-purple-400"
                  : ""
              }
            `}
          >
            <span className="text-cyan-300 font-semibold">{cellNum}</span>
            {isLadder && (
              <div className="absolute inset-0 flex items-center justify-center text-green-400 text-lg">
                🪜
              </div>
            )}
            {isSnake && (
              <div className="absolute inset-0 flex items-center justify-center text-red-400 text-lg">
                🐍
              </div>
            )}
            {cellNum === 1 && (
              <div className="absolute top-0 left-0 text-yellow-400 text-sm">
                🏁
              </div>
            )}
            {cellNum === boardSize && (
              <div className="absolute top-0 right-0 text-purple-400 text-sm">
                🏆
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  // Trading Line Component
  const TradingLine = () => {
    if (!showTradingLine || !tradingLine) return null;

    const { from, to, isBullish, fromPos, toPos } = tradingLine;

    // Create SVG path for the trading line
    const pathData = `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${
      from.y < to.y ? Math.min(from.y, to.y) - 10 : Math.max(from.y, to.y) + 10
    } ${to.x} ${to.y}`;

    return (
      <div className="absolute inset-0 pointer-events-none z-30">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Animated trading line */}
          <path
            d={pathData}
            fill="none"
            stroke={isBullish ? "#10B981" : "#EF4444"}
            strokeWidth="0.8"
            strokeDasharray="2 1"
            className={`
              ${lineAnimation ? "animate-pulse" : ""}
              transition-all duration-2000
            `}
            style={{
              filter: `drop-shadow(0 0 4px ${
                isBullish ? "#10B981" : "#EF4444"
              })`,
              animation: lineAnimation
                ? `${
                    isBullish ? "bullish-line" : "bearish-line"
                  } 2s ease-in-out`
                : "none",
            }}
          />

          {/* Start point */}
          <circle
            cx={from.x}
            cy={from.y}
            r="1.5"
            fill={isBullish ? "#10B981" : "#EF4444"}
            className={lineAnimation ? "animate-ping" : ""}
          >
            <animate
              attributeName="r"
              values="1.5;2.5;1.5"
              dur="1s"
              repeatCount="2"
            />
          </circle>

          {/* End point */}
          <circle
            cx={to.x}
            cy={to.y}
            r="1.5"
            fill={isBullish ? "#10B981" : "#EF4444"}
            className={lineAnimation ? "animate-ping" : ""}
          >
            <animate
              attributeName="r"
              values="1.5;2.5;1.5"
              dur="1s"
              repeatCount="2"
              begin="0.5s"
            />
          </circle>

          {/* Direction arrow */}
          <defs>
            <marker
              id={`arrowhead-${isBullish ? "bull" : "bear"}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill={isBullish ? "#10B981" : "#EF4444"}
              />
            </marker>
          </defs>

          <path
            d={pathData}
            fill="none"
            stroke="transparent"
            strokeWidth="0.5"
            markerEnd={`url(#arrowhead-${isBullish ? "bull" : "bear"})`}
          />

          {/* Price labels */}
          <text
            x={from.x}
            y={from.y - 2}
            textAnchor="middle"
            className="text-xs font-bold"
            fill={isBullish ? "#10B981" : "#EF4444"}
          >
            {fromPos}
          </text>

          <text
            x={to.x}
            y={to.y - 2}
            textAnchor="middle"
            className="text-xs font-bold"
            fill={isBullish ? "#10B981" : "#EF4444"}
          >
            {toPos}
          </text>

          {/* Trend indicator */}
          <text
            x={(from.x + to.x) / 2}
            y={(from.y + to.y) / 2 - 3}
            textAnchor="middle"
            className="text-sm font-bold"
            fill={isBullish ? "#10B981" : "#EF4444"}
          >
            {isBullish ? "📈" : "📉"}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-2 md:p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 255, 255, 0.8);
          }
        }
        @keyframes bullish-line {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes bearish-line {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        .bounce {
          animation: bounce 0.6s ease-in-out;
        }
        .wiggle {
          animation: wiggle 0.8s ease-in-out;
        }
        .glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header - Compact */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src="/ethereum_os_logo.png"
                alt="Ethereum OS Logo"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Ethereum_OS Gridventure
            </h1>
          </div>
          <p className="text-cyan-300 text-sm md:text-base">
            Navigate the crypto ecosystem and reach DeFi mastery!
          </p>
        </div>

        {/* Game Controls - Mobile Friendly */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {!gameStarted && !gameWon && (
            <button
              onClick={() => setGameStarted(true)}
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all glow text-sm md:text-base"
            >
              <Play size={16} />
              Start Game
            </button>
          )}

          {gameStarted && (
            <button
              onClick={rollDice}
              disabled={isRolling || gameWon}
              className={`
                flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 font-bold rounded-lg transition-all text-sm md:text-base
                ${
                  isRolling || gameWon
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 glow"
                }
              `}
            >
              🎲 {isRolling ? "Rolling..." : `Roll Dice (${diceValue})`}
            </button>
          )}

          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all text-sm md:text-base"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`
              flex items-center gap-1 px-3 py-2 md:px-4 md:py-3 font-bold rounded-lg transition-all text-sm md:text-base
              ${
                soundEnabled
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-600 text-gray-300"
              }
            `}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Game Status - Compact */}
        <div className="text-center mb-4">
          <div className="text-lg md:text-xl font-bold text-cyan-300 mb-2">
            Position: {playerPosition} / {boardSize}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(playerPosition / boardSize) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Game Board - Responsive */}
        <div className="relative bg-black/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border border-cyan-500/30 mb-4">
          <div className="grid grid-cols-10 gap-1 aspect-square max-w-xl md:max-w-2xl mx-auto relative">
            {renderBoard()}

            {/* Player - Fixed positioning */}
            {gameStarted && (
              <div
                className={`
                  absolute w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full
                  flex items-center justify-center text-sm md:text-xl font-bold transform -translate-x-1/2 -translate-y-1/2
                  transition-all duration-500 z-20 border-2 border-yellow-200 ${playerAnimation}
                `}
                style={getPositionStyle(playerPosition)}
              >
                🏃‍➡️
              </div>
            )}

            {/* Trading Line Overlay */}
            <TradingLine />
          </div>
        </div>

        {/* Messages - Better positioning and colors */}
        {showMessage && (
          <div
            className={`
            fixed top-16 md:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm md:max-w-md mx-auto p-3 md:p-4 rounded-lg border-2 shadow-2xl backdrop-blur-sm
            ${
              messageType === "fud"
                ? "bg-red-900/95 border-red-400 text-red-100"
                : messageType === "win"
                ? "bg-purple-900/95 border-purple-400 text-purple-100"
                : "bg-green-900/95 border-green-400 text-green-100"
            }
          `}
          >
            <p className="text-center font-bold text-sm md:text-base">
              {message}
            </p>
          </div>
        )}

        {/* Legend - Compact */}
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-cyan-500/30">
          <h3 className="text-cyan-300 font-bold mb-2 text-center text-sm md:text-base">
            Game Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
            <div className="text-center">
              <div className="text-lg md:text-2xl mb-1">🪜</div>
              <div className="text-green-400 font-bold">Ladders</div>
              <div className="text-gray-300">Learn & Rise!</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl mb-1">🐍</div>
              <div className="text-red-400 font-bold">FUD Snakes</div>
              <div className="text-gray-300">Fear & Fall</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl mb-1">🏁</div>
              <div className="text-yellow-400 font-bold">Start</div>
              <div className="text-gray-300">Begin Journey</div>
            </div>
            <div className="text-center">
              <div className="text-lg md:text-2xl mb-1">🏆</div>
              <div className="text-purple-400 font-bold">DeFi Master</div>
              <div className="text-gray-300">Victory!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthereumGridventure;
