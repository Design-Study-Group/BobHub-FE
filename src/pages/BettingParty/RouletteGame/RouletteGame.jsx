import React, { useState, useEffect, useRef, useCallback } from 'react';
import './RouletteGame.css';

const RouletteGame = () => {
  const canvasRef = useRef(null);
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(-currentRotation * Math.PI / 180);

    const anglePerSlice = (2 * Math.PI) / numSlices;

    for (let i = 0; i < numSlices; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * anglePerSlice, (i + 1) * anglePerSlice);
      ctx.closePath();
      ctx.fillStyle = generateSliceColor(i, numSlices);
      ctx.fill();
    }

    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX - 10, centerY - radius - 20);
    ctx.lineTo(centerX + 10, centerY - radius - 20);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.font = '16px YUniverse-B';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < numSlices; i++) {
      const textAngle = (i * anglePerSlice + anglePerSlice / 2) - (currentRotation * Math.PI / 180);
      const textX = radius * 0.65 * Math.cos(textAngle);
      const textY = radius * 0.65 * Math.sin(textAngle);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillText(sliceLabels[i] || `항목 ${i + 1}`, 0, 0);
      ctx.restore();
    }
    ctx.restore();


  }, [sliceLabels, generateSliceColor]);

  const animateSpin = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;

    if (elapsed < durationRef.current) {
      const progress = elapsed / durationRef.current;
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentAnimatedRotation = initialRotationAtSpinStartRef.current + (targetRotationRef.current - initialRotationAtSpinStartRef.current) * easedProgress;
      drawRoulette(currentAnimatedRotation);
      animationFrameRef.current = requestAnimationFrame(animateSpin);
    } else {
      setIsSpinning(false);
      setRotation(targetRotationRef.current);
      drawRoulette(targetRotationRef.current);
      const finalAngle = (targetRotationRef.current % 360 + 360) % 360;
      const numSlices = sliceLabels.length;
      const anglePerSlice = 360 / numSlices;

      // Calculate the angle on the unrotated wheel that is under the arrow
      const angleAtArrow = (270 - finalAngle + 360) % 360;
      const selectedIndex = Math.floor(angleAtArrow / anglePerSlice);
      setSpinResult(sliceLabels[selectedIndex]);
      startTimeRef.current = 0;
    }
  }, [sliceLabels, drawRoulette]);

  const startSpin = () => {
    const numSlices = sliceLabels.length;
    if (isSpinning || numSlices < 2) return;

    setIsSpinning(true);
    setSpinResult(null);

    const winningSliceIndex = Math.floor(Math.random() * numSlices);
    const anglePerSlice = 360 / numSlices;

    const extraRotations = 5;
    initialRotationAtSpinStartRef.current = rotation;
    // Calculate the angle needed to align the center of the winning slice with the arrow (270 degrees)
    const angleToAlign = (270 - (winningSliceIndex * anglePerSlice + anglePerSlice / 2) + 360) % 360;
    targetRotationRef.current = rotation + angleToAlign + (extraRotations * 360);

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
    <div className="roulette-game-container">
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
          {isSpinning ? '회전 중...' : '룰렛 돌리기'}
        </button>
      </div>
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} className="roulette-canvas"></canvas>
      </div>
      {spinResult && (
        <div className="roulette-result">
          <h3>결과: {spinResult}</h3>
        </div>
      )}
    </div>
  );
};

export default RouletteGame;