import React, { useRef, useState, useEffect } from "react";
import './PinballGame.css';
import useTheme from '../../../hooks/useTheme';

export default function PinballGame() {
  const { theme } = useTheme();
  const [mutedColor, setMutedColor] = useState('');
  const canvasRef = useRef(null);
  const resultsRef = useRef(null); // 결과 영역 Ref 추가
  const [playerLabels, setPlayerLabels] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [balls, setBalls] = useState([]);
  const [loser, setLoser] = useState(null);
  const [running, setRunning] = useState(false);
  const cameraYRef = useRef(0);
  const [obstacles, setObstacles] = useState([]);
  const [windZones, setWindZones] = useState([]);

  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim();
    setMutedColor(color);
  }, [theme]);

  const setupGameElements = () => {
    const canvasWidth = 500;
    const canvasHeight = 3600;
    const newObstacles = [];
    const numObstacles = 40; // 장애물 개수 증가
    const bumperCount = 5; // 범퍼 개수

    // 장애물 생성
    for (let i = 0; i < numObstacles; i++) {
      const r = Math.random() * 10 + 8; // 크기 범위 약간 줄임
      const x = Math.random() * (canvasWidth - 2 * r) + r;
      const y = Math.random() * (canvasHeight - 200) + 150; // 위 아래 여백
      const isBumper = i < bumperCount; // 처음 몇 개를 범퍼로 지정
      newObstacles.push({ x, y, r, isBumper });
    }
    setObstacles(newObstacles);

    // 바람 영역 생성
    const newWindZones = [
      { x: 0, y: 800, width: canvasWidth / 2, height: 200, force: -0.08 }, // 왼쪽으로 미는 바람
      { x: canvasWidth / 2, y: 1600, width: canvasWidth / 2, height: 200, force: 0.08 }, // 오른쪽으로 미는 바람
      { x: 0, y: 2400, width: canvasWidth, height: 150, force: Math.random() > 0.5 ? 0.07 : -0.07 } // 랜덤 방향 바람
    ];
    setWindZones(newWindZones);
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
    setupGameElements(); // 게임 요소 (장애물, 바람) 설정

    // 각 참가자별로 5개의 공 생성
    const ballsPerPlayer = 5;
    const newBalls = playerLabels.flatMap((player, playerIndex) => {
      const playerColor = `hsl(${(playerIndex * 360) / playerLabels.length}, 70%, 60%)`;
      const playerXStart = 50 + playerIndex * ((canvas.width - 100) / playerLabels.length);
      const playerXWidth = ((canvas.width - 100) / playerLabels.length);

      return Array.from({ length: ballsPerPlayer }).map(() => ({
        player: player,
        x: playerXStart + Math.random() * (playerXWidth - 20) + 10,
        y: 50 + Math.random() * 150, // 공들이 약간 다른 높이에서 시작
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 2 + 1,
        r: 10,
        color: playerColor, // 플레이어별로 색상 통일
      }));
    });

    setBalls(newBalls);
    setRunning(true);

    setTimeout(() => {
      canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // 게임 종료 시 결과로 스크롤
  useEffect(() => {
    if (loser) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [loser]);

  // 공 이동 + 충돌 처리
  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let lowestBallY = 0;
      if (balls.length > 0) {
        lowestBallY = Math.max(...balls.map(ball => ball.y));
      }

      const viewportHeight = 600;
      let targetCameraY = lowestBallY - 100;
      if (targetCameraY < 0) targetCameraY = 0;
      const maxCameraY = canvas.height - viewportHeight;
      if (targetCameraY > maxCameraY) targetCameraY = maxCameraY;
      cameraYRef.current += (targetCameraY - cameraYRef.current) * 0.1;

      // 바람 영역 그리기 (시각적 표시)
      ctx.save();
      ctx.fillStyle = 'rgba(100, 100, 255, 0.1)';
      windZones.forEach(zone => {
        ctx.fillRect(zone.x, zone.y - cameraYRef.current, zone.width, zone.height);
      });
      ctx.restore();

      // 장애물 그리기
      obstacles.forEach((o) => {
        ctx.beginPath();
        ctx.fillStyle = o.isBumper ? '#ff6347' : 'gray'; // 범퍼는 다른 색으로 표시
        ctx.arc(o.x, o.y - cameraYRef.current, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const newBalls = [];
      let currentLoser = null;

      balls.forEach((ball) => {
        let { x, y, dx, dy, r, color, player } = ball;

        // 1. 마찰력/공기저항 적용
        dx *= 0.997;

        // 2. 바람의 영향 적용
        windZones.forEach(zone => {
          if (x > zone.x && x < zone.x + zone.width && y > zone.y && y < zone.y + zone.height) {
            dx += zone.force;
          }
        });

        // 3. 중력
        dy += 0.05;

        // 4. 위치 업데이트
        x += dx;
        y += dy;

        // 5. 벽 충돌
        if (x - r < 0) {
          x = r;
          dx *= -0.8;
        } else if (x + r > canvas.width) {
          x = canvas.width - r;
          dx *= -0.8;
        }

        // 6. 장애물 충돌
        obstacles.forEach((o) => {
          const dist = Math.hypot(x - o.x, y - o.y);
          if (dist < r + o.r) {
            const nx = (x - o.x) / dist;
            const ny = (y - o.y) / dist;
            const dot = dx * nx + dy * ny;
            
            const bounceFactor = o.isBumper ? 1.3 : 0.9; // 범퍼 반발력 감소

            dx = (dx - 2 * dot * nx) * bounceFactor;
            dy = (dy - 2 * dot * ny) * bounceFactor;

            const overlap = r + o.r - dist;
            x += nx * overlap;
            y += ny * overlap;
          }
        });

        // 7. 최대 속도 제한
        const maxDx = 7;
        if (dx > maxDx) dx = maxDx;
        if (dx < -maxDx) dx = -maxDx;

        // 8. 바닥 도착
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
          ctx.fillStyle = theme === 'dark' ? mutedColor : 'black';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(player, x + r + 5, y - cameraYRef.current);
          newBalls.push({ ...ball, x, y, dx, dy });
        }
      });

      setBalls(newBalls);

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
  }, [running, balls, loser, theme, mutedColor, obstacles, windZones]);

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
            <li key={index}>
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
            height={3600}
            className="pinball-canvas"
          />
        </div>
      </div>

      {loser && (
        <div ref={resultsRef} className="pinball-winner-display">
          ❌ 패자: {loser}
        </div>
      )}
    </div>
  );
}