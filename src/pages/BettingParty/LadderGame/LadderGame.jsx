import React, { useState, useEffect, useRef, useCallback } from 'react';
import './LadderGame.css';
import useTheme from '../../../hooks/useTheme';

function shuffle(array) {
  const newArray = [...array];
  let currentIndex = newArray.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
}

const LadderGame = () => {
  const { theme } = useTheme();
  const [mutedColor, setMutedColor] = useState('');

  const [gameState, setGameState] = useState('setup');
  const [participants, setParticipants] = useState([]);
  const [punishments, setPunishments] = useState([]);
  const [loserCount, setLoserCount] = useState(1);
  
  const [participantInput, setParticipantInput] = useState('');
  const [punishmentInput, setPunishmentInput] = useState('');
  
  const [shuffledPunishments, setShuffledPunishments] = useState([]);
  const [results, setResults] = useState({});
  const [revealed, setRevealed] = useState({});
  const [allAnimationsFinished, setAllAnimationsFinished] = useState(false);

  const canvasRef = useRef(null);
  const resultRef = useRef(null); // 결과 div ref
  const gameDataRef = useRef({});
  const animationFrameRef = useRef();
  const playersRef = useRef([]);
  const stateRef = useRef();

  stateRef.current = { revealed, results, participants, shuffledPunishments };

  useEffect(() => {
    // 테마가 변경될 때 CSS 변수에서 색상 값을 다시 계산
    const color = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim();
    setMutedColor(color);
  }, [theme]);

  const addParticipant = () => {
    if (participantInput.trim() && participants.length < 10) {
      setParticipants([...participants, participantInput.trim()]);
      setParticipantInput('');
    }
  };

  const addPunishment = () => {
    if (punishmentInput.trim()) {
      setPunishments([...punishments, punishmentInput.trim()]);
      setPunishmentInput('');
    }
  };

  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (type === 'participant') {
        addParticipant();
      } else if (type === 'punishment') {
        addPunishment();
      }
    }
  };
  const handleStartGame = () => {
    if (participants.length < 2) {
      alert('참여자는 2명 이상이어야 합니다.');
      return;
    }
    if (punishments.length === 0) {
      alert('벌칙을 1개 이상 입력해주세요.');
      return;
    }

    // ✅ 벌칙 당첨자 수 = 벌칙 개수
    const loserCount = punishments.length;
    if (loserCount > participants.length) {
      alert('벌칙 개수가 참여자 수보다 많을 수 없습니다.');
      return;
    }

    const safeCount = participants.length - loserCount;
    const finalPunishments = [
      ...punishments.slice(0, loserCount),
      ...Array(safeCount).fill('통과 ✨')
    ];
    setShuffledPunishments(shuffle(finalPunishments));
    setAllAnimationsFinished(false);
    setResults({});
    setRevealed({});
    playersRef.current = [];
    setGameState('playing');
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { verticals, horizontals, topY, bottomY, colors } = gameDataRef.current;
    const { participants, revealed, results, shuffledPunishments } = stateRef.current;
    if (!verticals) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. 사다리 기본 구조 및 텍스트 그리기
    ctx.save();
    ctx.lineCap = 'round';
    ctx.textAlign = 'center';
    ctx.font = '16px YUniverse-B';

    // 세로선
    ctx.lineWidth = 3;
    ctx.strokeStyle = theme === 'dark' ? mutedColor : 'hsl(var(--muted-foreground-hsl) / 0.5)';
    verticals.forEach((v) => {
      ctx.beginPath();
      ctx.moveTo(v.x, topY);
      ctx.lineTo(v.x, bottomY);
      ctx.stroke();
    });

    // 가로선
    horizontals.forEach(({ col, y }) => {
      const x1 = verticals[col].x;
      const x2 = verticals[col + 1].x;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
    });
    
    ctx.restore(); // 그림자 효과 제거

    const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
      const words = text.split(' ');
      let line = '';
      let testLine = '';
      let metrics;
      let ty = y;

      for (let n = 0; n < words.length; n++) {
        testLine = line + words[n] + ' ';
        metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, ty);
          line = words[n] + ' ';
          ty += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, ty);
    };

    // 텍스트 그리기 (그림자 없이)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `bold ${gameDataRef.current.dynamicFontSize}px YUniverse-B`;
    const lineHeight = gameDataRef.current.dynamicFontSize * 1.2; // Calculate line height
    const maxWidth = gameDataRef.current.spacingX * 0.8; // 80% of spacingX for name width

    verticals.forEach((v, i) => {
      // 참가자 이름
      ctx.fillStyle = colors ? colors[i] : 'var(--foreground)';
      wrapText(ctx, participants[i], v.x, topY - 25, maxWidth, lineHeight); // Use wrapText

      // 벌칙
      const punishmentText = shuffledPunishments[i];
      const isLoserText = punishmentText !== "통과 ✨";
      ctx.fillStyle = isLoserText ? "#e74c3c" : (theme === 'dark' ? mutedColor : "#2f2f2fff");
      ctx.fillText(punishmentText, v.x, bottomY + 30);
    });
    ctx.restore();


    // 2. 경로 그리기
    playersRef.current.forEach(p => {
      if (p.path.length < 2) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 6;
      ctx.globalAlpha = 0.8;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(p.path[0].x, p.path[0].y);
      for (let i = 1; i < p.path.length; i++) {
        ctx.lineTo(p.path[i].x, p.path[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });

    // 3. 플레이어 점 그리기
    playersRef.current.forEach(p => {
      ctx.save();
      // Outer glow
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
      ctx.globalAlpha = 0.4;
      ctx.fill();
      
      ctx.globalAlpha = 1;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    });

  }, [theme, mutedColor]);

  const update = useCallback(() => {
    const { verticals, horizontals, bottomY } = gameDataRef.current;
    if (!verticals) return;

    let hasActivePlayers = false;
    playersRef.current.forEach(player => {
      if (player.finished) return;
      hasActivePlayers = true;

      const lastPathPoint = player.path[player.path.length - 1];
      if (player.y > lastPathPoint.y || player.x !== lastPathPoint.x) {
         player.path.push({ x: player.x, y: player.y });
      }

      player.y += player.speed;

      const currentVerticalIndex = player.currentCol;
      const nextHorizontal = horizontals.find(h => 
        h.y > player.y - player.speed && 
        h.y <= player.y &&
        (h.col === currentVerticalIndex || h.col === currentVerticalIndex - 1)
      );

      if (nextHorizontal) {
        player.y = nextHorizontal.y;
        player.path.push({ x: player.x, y: player.y });
        if (nextHorizontal.col === currentVerticalIndex) {
          player.currentCol++;
        } else {
          player.currentCol--;
        }
      }
      player.x = verticals[player.currentCol].x;

      if (player.y >= bottomY) {
        player.y = bottomY;
        player.finished = true;
      }
      player.path.push({ x: player.x, y: player.y });
      
      if(player.finished){
        setRevealed(prev => ({...prev, [player.startIndex]: true}));
      }
    });

    draw();

    if (hasActivePlayers) {
      animationFrameRef.current = requestAnimationFrame(update);
    }
  }, [draw]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const container = canvas.parentElement; // .canvas-wrapper
    const numPlayers = participants.length;
    
    // 너비를 부모 요소에 맞게 설정
    canvas.width = container.offsetWidth;
    canvas.height = 500;

    // Calculate dynamic font size based on canvas width
    const baseFontSize = 17; // Original font size
    const mobileBreakpoint = 768; // Example breakpoint for mobile
    const dynamicFontSize = canvas.width < mobileBreakpoint ? baseFontSize * 0.8 : baseFontSize; // Reduce by 20% for mobile

    const spacingX = canvas.width / (numPlayers + 1);
    const topY = 80;
    const bottomY = 420;

    const verticals = Array.from({ length: numPlayers }, (_, i) => ({ x: spacingX * (i + 1) }));
    const horizontals = [];
    const numSteps = Math.max(5, numPlayers * 2);
    const rungSpacing = 25;

    // 1. 인접한 모든 세로줄 사이에 하나 이상의 가로선을 배치하여 연결성을 보장합니다.
    for (let i = 0; i < numPlayers - 1; i++) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 10) { // 10번 시도 안에 가로선 배치
        const y = topY + 20 + Math.random() * (bottomY - topY - 40);
        // 현재 및 인접 열에 너무 가까운 가로선이 없는지 확인
        if (!horizontals.some(h => (h.col === i || h.col === i - 1 || h.col === i + 1) && Math.abs(h.y - y) < rungSpacing)) {
          horizontals.push({ col: i, y });
          placed = true;
        }
        attempts++;
      }
    }

    // 2. 게임의 재미를 위해 무작위 가로선을 추가합니다.
    let attempts = 0;
    while (horizontals.length < numSteps && attempts < 100) {
      const col = Math.floor(Math.random() * (numPlayers - 1));
      const y = topY + 20 + Math.random() * (bottomY - topY - 40);

      if (!horizontals.some(h => (h.col === col || h.col === col - 1 || h.col === col + 1) && Math.abs(h.y - y) < rungSpacing)) {
        horizontals.push({ col, y });
      }
      attempts++;
    }

    horizontals.sort((a, b) => a.y - b.y);

    const participantHitboxes = verticals.map((v, i) => ({
      x: v.x - spacingX / 2,
      y: topY - 40,
      width: spacingX,
      height: 40,
      index: i
    }));

    const colors = Array.from({ length: numPlayers }, (_, i) => `hsl(${(i * 360) / numPlayers}, 70%, 60%)`);

    const paths = {};
    for (let i = 0; i < verticals.length; i++) {
      let currentCol = i;
      horizontals.forEach(h => {
        if (h.col === currentCol) {
          currentCol++;
        } else if (h.col === currentCol - 1) {
          currentCol--;
        }
      });
      paths[i] = currentCol;
    }
    setResults(paths);

    gameDataRef.current = { verticals, horizontals, topY, bottomY, participantHitboxes, colors, dynamicFontSize, spacingX };
    
    const handleCanvasClick = (event) => {
      const { participantHitboxes, verticals, topY, colors } = gameDataRef.current;
      const { revealed } = stateRef.current;
      if (!participantHitboxes) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      participantHitboxes.forEach(hitbox => {
        if (x >= hitbox.x && x <= hitbox.x + hitbox.width && y >= hitbox.y && y <= hitbox.y + hitbox.height) {
          if (revealed[hitbox.index] || playersRef.current.some(p => p.startIndex === hitbox.index)) return;
          
          const wasIdle = playersRef.current.every(p => p.finished);

          playersRef.current.push({
            x: verticals[hitbox.index].x,
            y: topY,
            radius: 7,
            color: colors[hitbox.index],
            speed: 4,
            startIndex: hitbox.index,
            currentCol: hitbox.index,
            finished: false,
            path: [{ x: verticals[hitbox.index].x, y: topY }]
          });

          if (wasIdle) {
             cancelAnimationFrame(animationFrameRef.current);
             animationFrameRef.current = requestAnimationFrame(update);
          }
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);
    
    draw();

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameRef.current);
    };

  }, [gameState, participants, shuffledPunishments, draw, update]);

  useEffect(() => {
    if (gameState === 'playing') {
      draw();
    }
  }, [revealed, results, draw, gameState]);

  useEffect(() => {
    if (gameState === 'playing' && participants.length > 0 && Object.keys(revealed).length === participants.length) {
      setAllAnimationsFinished(true);
    } else {
      setAllAnimationsFinished(false);
    }
  }, [revealed, participants, gameState]);

  useEffect(() => {
    if (allAnimationsFinished && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [allAnimationsFinished]);

  useEffect(() => {
    if (gameState === 'playing' && canvasRef.current) {
      canvasRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [gameState]);


  return (
    <div className="ladder-container">
      <div className="ladder-setup-container">
        <h2>사다리 타기</h2>
        <div className="setup-section">
          <label>참여자 (최대 10명)</label>
          <div className="input-group">
            <input
              type="text"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'participant')}
              placeholder="이름 입력 후 Enter 또는 추가 버튼"
              disabled={gameState === 'playing'}
            />
            <button onClick={addParticipant} disabled={gameState === 'playing'}>추가</button>
          </div>
          <ul className="item-list">
            {participants.map((p, i) => (
              <li key={i}>
                {p} <button onClick={() => setParticipants(participants.filter(item => item !== p))} disabled={gameState === 'playing'}>x</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="setup-section">
          <label>벌칙</label>
          <div className="input-group">
            <input
              type="text"
              value={punishmentInput}
              onChange={(e) => setPunishmentInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'punishment')}
              placeholder="벌칙 입력 후 Enter 또는 추가 버튼"
              disabled={gameState === 'playing'}
            />
            <button onClick={addPunishment} disabled={gameState === 'playing'}>추가</button>
          </div>
          <ul className="item-list">
            {punishments.map((p, i) => (
              <li key={i}>
                {p} <button onClick={() => setPunishments(punishments.filter(item => item !== p))} disabled={gameState === 'playing'}>x</button>
              </li>
            ))}
          </ul>
        </div>

        <button className="start-game-btn" onClick={gameState === 'playing' ? () => setGameState('setup') : handleStartGame}>
          {gameState === 'playing' ? '게임 초기화' : '게임 시작'}
        </button>
      </div>

      {gameState === 'playing' && (
        <div className="ladder-game-container">
          <h2>🎲 사다리 타기</h2>
          <h3>(이름을 클릭하여 시작)</h3>
          <div className="canvas-wrapper">
            <canvas ref={canvasRef} className="ladder-canvas" />
          </div>
          {allAnimationsFinished && (
            <div className="results-summary" ref={resultRef}>
              <h3>🎉 당첨 결과 🎉</h3>
              <ul>
                {participants.map((participant, index) => {
                  const resultIndex = results[index];
                  const punishment = shuffledPunishments[resultIndex];
                  if (punishment !== '통과 ✨') {
                    return (
                      <li key={index}>
                        {participant}님이 {punishment}에 당첨되었습니다!
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LadderGame;