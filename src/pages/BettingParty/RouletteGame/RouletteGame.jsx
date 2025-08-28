import React, { useState, useEffect, useRef, useCallback } from 'react';
import './RouletteGame.css';

const RouletteGame = () => {
  const canvasRef = useRef(null);
  const rouletteRef = useRef(null); // 자동스크롤용 ref
  const canvasWrapperScrollRef = useRef(null); // 캔버스 감싸는 div에 대한 ref
  const resultRef = useRef(null); // 결과 div에 대한 ref
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const targetRotationRef = useRef(0);
  const startTimeRef = useRef(0);
  const animationFrameRef = useRef(null);
  const durationRef = useRef(5000);
  const initialRotationAtSpinStartRef = useRef(0);

  const [currentInput, setCurrentInput] = useState('');
  const [sliceLabels, setSliceLabels] = useState(['항목1', '항목2']);
  const [spinResult, setSpinResult] = useState(null);

  const generateSliceColor = useCallback((index, totalSlices) => {
    return `hsl(${(index * 360) / totalSlices}, 50%, 80%)`;
  }, []);

  const drawRoulette = useCallback((currentRotation) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const numSlices = sliceLabels.length;
    const anglePerSlice = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);

    // 룰렛 전체 회전
    const rotationInRadians = currentRotation * Math.PI / 180;
    ctx.rotate(rotationInRadians);

    // --- 그리기 시작 ---

    // 1. 슬라이스 그리기
    for (let i = 0; i < numSlices; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * anglePerSlice, (i + 1) * anglePerSlice);
      ctx.closePath();
      ctx.fillStyle = generateSliceColor(i, numSlices);
      ctx.fill();
    }

    // 2. 텍스트 그리기 (단순화된 버전)
    ctx.font = '16px YUniverse-B';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < numSlices; i++) {
      const centerAngle = i * anglePerSlice + anglePerSlice / 2;
      const textX = radius * 0.6 * Math.cos(centerAngle);
      const textY = radius * 0.6 * Math.sin(centerAngle);
      
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(centerAngle + Math.PI / 2); // 글자가 칸의 방향을 따르도록 회전
      ctx.fillText(sliceLabels[i], 0, 0);
      ctx.restore();
    }
    
    // --- 그리기 종료 ---

    ctx.restore();

    // 포인터 그리기
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX - 10, centerY - radius - 20);
    ctx.lineTo(centerX + 10, centerY - radius - 20);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();

  }, [sliceLabels, generateSliceColor]);

  const animateSpin = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;

    if (elapsed < durationRef.current) {
      const progress = elapsed / durationRef.current;
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      const currentAnimatedRotation = initialRotationAtSpinStartRef.current + (targetRotationRef.current - initialRotationAtSpinStartRef.current) * easedProgress;
      drawRoulette(currentAnimatedRotation);
      animationFrameRef.current = requestAnimationFrame(animateSpin);
    } else {
      setIsSpinning(false);
      const finalRotation = targetRotationRef.current;
      setRotation(finalRotation);
      drawRoulette(finalRotation);

      // 스핀이 멈춘 후 결과를 계산
      const numSlices = sliceLabels.length;
      const anglePerSlice = 360 / numSlices;
      const finalAngleInDegrees = (finalRotation % 360 + 360) % 360;
      
      // 포인터(270도) 위치에 어떤 슬라이스가 있는지 역산
      const angleAtPointer = (360 - finalAngleInDegrees + 270) % 360;
      const winningIndex = Math.floor(angleAtPointer / anglePerSlice);
      
      setSpinResult(sliceLabels[winningIndex]);
      startTimeRef.current = 0;
    }
  }, [sliceLabels, drawRoulette]);

  const startSpin = () => {
    const numSlices = sliceLabels.length;
    if (isSpinning || numSlices < 2) return;

    setIsSpinning(true);
    setSpinResult(null);

    if (canvasWrapperScrollRef.current) {
      setTimeout(() => {
        canvasWrapperScrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }

    // 결과를 미리 정하지 않고, 랜덤한 회전 값을 설정
    initialRotationAtSpinStartRef.current = rotation;
    const randomExtraRotations = Math.random() * 5 + 5; // 5~10 바퀴 추가 회전
    const randomStopAngle = Math.random() * 360; // 무작위 멈춤 각도

    targetRotationRef.current = rotation + randomExtraRotations * 360 + randomStopAngle;

    startTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(animateSpin);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth * 0.9;
      canvas.height = canvas.width;
      drawRoulette(rotation);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [drawRoulette, rotation]);

  useEffect(() => {
    drawRoulette(rotation);
  }, [sliceLabels, rotation, drawRoulette]);

  // 결과가 나오면 스크롤
  useEffect(() => {
    if (spinResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [spinResult]);

  const handleAddSlice = () => {
    if (currentInput.trim() && sliceLabels.length < 8) {
      setSliceLabels([...sliceLabels, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const handleRemoveSlice = (indexToRemove) => {
    if (sliceLabels.length > 1) {
      setSliceLabels(sliceLabels.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleAddSlice();
    }
  };

  return (
    <div className="roulette-game-container" ref={rouletteRef}> {/* Add ref here */}
      <h2>룰렛 게임</h2>
      <div className="roulette-controls">
        <div className="input-group">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="항목 입력 후 Enter 또는 추가 버튼"
            disabled={isSpinning}
          />
          <button onClick={handleAddSlice} disabled={isSpinning}>
            추가
          </button>
        </div>
        <ul className="item-list">
          {sliceLabels.map((label, index) => (
            <li key={index}>
              {label}
              {sliceLabels.length > 1 && (
                <button onClick={() => handleRemoveSlice(index)} disabled={isSpinning}>
                  x
                </button>
              )}
            </li>
          ))}
        </ul>
        <button onClick={startSpin} disabled={isSpinning || sliceLabels.length < 2}>
          {isSpinning ? '회전 중...' : '게임 시작'}
        </button>
      </div>
      <div className="canvas-wrapper" ref={canvasWrapperScrollRef}>
            <canvas ref={canvasRef} className="roulette-canvas"></canvas>
          </div>
          {spinResult && (
            <div className="roulette-result" ref={resultRef}>
              <h3>결과: {spinResult}</h3>
        </div>
      )}
    </div>
  );
};

export default RouletteGame;