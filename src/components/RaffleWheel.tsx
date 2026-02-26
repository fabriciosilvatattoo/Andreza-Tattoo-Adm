import React, { useEffect, useRef, useState } from "react";

interface RaffleWheelProps {
  participants: string[];
  onSpinEnd: (winner: string) => void;
  isSpinning: boolean;
}

export default function RaffleWheel({
  participants,
  onSpinEnd,
  isSpinning,
}: RaffleWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWheel = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;
      const numSegments = participants.length || 1;
      const anglePerSegment = (2 * Math.PI) / numSegments;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (participants.length === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#1E293B";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#334155";
        ctx.stroke();
        ctx.fillStyle = "#94A3B8";
        ctx.font = "16px Poppins";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Nenhum participante", centerX, centerY);
        return;
      }

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      const colors = ["#1E293B", "#0F172A", "#334155", "#020617"];

      for (let i = 0; i < numSegments; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = startAngle + anglePerSegment;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#020617";
        ctx.stroke();

        ctx.save();
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 14px Poppins";
        ctx.fillText(participants[i], radius - 20, 0);
        ctx.restore();
      }

      ctx.restore();

      // Draw pointer
      ctx.beginPath();
      ctx.moveTo(centerX + radius - 10, centerY);
      ctx.lineTo(centerX + radius + 10, centerY - 10);
      ctx.lineTo(centerX + radius + 10, centerY + 10);
      ctx.closePath();
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    };

    drawWheel();
  }, [participants, rotation]);

  useEffect(() => {
    if (isSpinning && participants.length > 0) {
      const spinDuration = 5000;
      const startRotation = rotation;
      const targetRotation =
        startRotation + Math.PI * 2 * 10 + Math.random() * Math.PI * 2;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentRotation =
          startRotation + (targetRotation - startRotation) * easeProgress;

        setRotation(currentRotation);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Calculate winner
          const numSegments = participants.length;
          const anglePerSegment = (2 * Math.PI) / numSegments;
          // Normalize rotation to 0 - 2PI
          const normalizedRotation = currentRotation % (2 * Math.PI);
          // The pointer is at 0 radians (right side).
          // We need to find which segment is at 0 radians.
          // Since the wheel rotates clockwise, the segment at 0 radians is:
          const winningSegmentIndex =
            Math.floor((2 * Math.PI - normalizedRotation) / anglePerSegment) %
            numSegments;

          onSpinEnd(participants[winningSegmentIndex]);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSpinning, participants]);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
      />
    </div>
  );
}
