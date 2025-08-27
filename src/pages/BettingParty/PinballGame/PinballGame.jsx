import React, { useRef, useState, useEffect } from "react";
import './PinballGame.css';

export default function PinballGame() {
  const canvasRef = useRef(null);
  const [playerLabels, setPlayerLabels] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [balls, setBalls] = useState([]);
  const [loser, setLoser] = useState(null);
  const [running, setRunning] = useState(false);
  const cameraYRef = useRef(0);
  const [randomObstacles, setRandomObstacles] = useState([]);

  const generateRandomObstacles = () => {
    const numObstacles = 30;
    const newObstacles = [];
    const canvasWidth = 500;
    const canvasHeight = 3200;

    for (let i = 0; i < numObstacles; i++) {
      const r = Math.random() * 15 + 10;
      const x = Math.random() * (canvasWidth - 2 * r) + r;
      const y = Math.random() * (canvasHeight - 2 * r) + r;
      newObstacles.push({ x, y, r });
    }
    return newObstacles;
  };

  // 참가자 추가
  const handleAddPlayer = () => {
    if (currentInput.trim() !== "") {
      setPlayerLabels([...playerLabels, currentInput.trim()]);
      setCurrentInput("");
    }
  };

  const handleRemovePlayer = (indexToRemove) => {
    setPlayerLabels(playerLabels.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  // 게임 시작
  const handleStartGame = () => {
    if (playerLabels.length === 0) {
      alert("참가자를 입력하세요!");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoser(null);
    setRandomObstacles(generateRandomObstacles());

    // 각 참가자 공 생성
    const newBalls = playerLabels.map((p, i) => ({
      player: p,
      x: 50 + i * 50,
      y: 300, // Changed initial y position
      dx: Math.random() * 2 - 1,
      dy: 2,
      r: 10,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }));

    setBalls(newBalls);
    setRunning(true);
  };

  // 공 이동 + 충돌 처리
  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Find the lowest ball to determine camera position
      let lowestBallY = 0;
      if (balls.length > 0) {
        lowestBallY = Math.max(...balls.map(ball => ball.y));
      }

      // Calculate target camera Y to center on the lowest ball
      // Assuming a visible viewport height of 600 (original canvas height)
      const viewportHeight = 600;
      let targetCameraY = lowestBallY - 100; // Offset from top of viewport

      // Ensure targetCameraY does not go below 0
      if (targetCameraY < 0) {
        targetCameraY = 0;
      }

      const maxCameraY = canvas.height - viewportHeight;
      if (targetCameraY > maxCameraY) {
        targetCameraY = maxCameraY;
      }

      cameraYRef.current += (targetCameraY - cameraYRef.current) * 0.1;

      // 장애물 그리기
      ctx.fillStyle = "gray";
      randomObstacles.forEach((o) => {
        ctx.beginPath();
        ctx.arc(o.x, o.y - cameraYRef.current, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      let gameOver = false;
      let loserPlayer = null;

      const newBalls = [];
      let currentLoser = null;

      balls.forEach((ball) => {
        let { x, y, dx, dy, r, color, player } = ball;

        // 중력
        dy += 0.05;

        // 위치 업데이트
        x += dx;
        y += dy;

        // 벽 충돌
        if (x - r < 0 || x + r > canvas.width) dx *= -1;

        // 장애물 충돌
        randomObstacles.forEach((o) => { // Changed to randomObstacles
          const dist = Math.hypot(x - o.x, y - o.y);
          if (dist < r + o.r) {
            // 충돌 지점에서의 법선 벡터 계산
            const nx = (x - o.x) / dist;
            const ny = (y - o.y) / dist;

            // 속도 벡터와 법선 벡터의 내적 계산
            const dot = dx * nx + dy * ny;

            // 속도 벡터 반사 (반발 계수 0.9 적용)
            dx = (dx - 2 * dot * nx) * 0.9;
            dy = (dy - 2 * dot * ny) * 0.9;

            // 공이 장애물에 파고들지 않도록 위치 조정
            const overlap = r + o.r - dist;
            x += nx * overlap;
            y += ny * overlap;
          }
        });

        // 바닥 도착
        if (y - r > canvas.height) {
          currentLoser = player;
        } else {
          // 공 그리기
          ctx.beginPath();
          ctx.arc(x, y - cameraYRef.current, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();

          // 사용자 이름 그리기
          ctx.font = '12px YUniverse-B';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(player, x + r + 5, y - cameraYRef.current);
          newBalls.push({ ...ball, x, y, dx, dy });
        }
      });

      setBalls(newBalls);

      // 게임 종료 조건: 모든 공이 떨어졌을 때
      if (newBalls.length === 0 && running) {
        setLoser(currentLoser);
        setRunning(false);
        cancelAnimationFrame(animationId);
        return;
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animationId);
  }, [running, balls, loser]);

  return (
    <div className="pinball-game-container">
      <h2>핀볼 내기 게임</h2>
      <div className="pinball-controls">
        <div className="input-group">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="참가자 이름 입력 후 Enter 또는 추가 버튼"
            disabled={running}
          />
          <button onClick={handleAddPlayer} disabled={running}>
            추가
          </button>
        </div>
        <ul className="participant-list">
          {playerLabels.map((label, index) => (
            <li key={index} style={{ backgroundColor: `hsl(${index * 40}, 70%, 50%)` }}>
              {label}
              <button onClick={() => handleRemovePlayer(index)} disabled={running}>
                x
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleStartGame} disabled={running || playerLabels.length === 0}>
          {running ? '게임 중...' : '게임 시작'}
        </button>
      </div>

      <div className="canvas-wrapper">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={500}
            height={3200}
            className="pinball-canvas"
          />
        </div>
      </div>

      {loser && (
        <div className="pinball-winner-display">
          ❌ 패자: {loser}
        </div>
      )}
    </div>
  );
}