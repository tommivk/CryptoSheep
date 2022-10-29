import { useEffect, useRef, useState } from "react";

type Props = {
  sheepColor: string;
};

const GogglySheep = ({ sheepColor }: Props) => {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
  }>();
  const sheepRef = useRef<HTMLImageElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  const sheepSVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 20 20' shape-rendering='crispEdges'> <path stroke='${sheepColor}' d='M4 3h3M3 4h5M2 5h15M1 6h2M16 6h3M1 7h1M17 7h1M1 8h1M17 8h1M1 9h1M17 9h1M1 10h1M17 10h1M1 11h2M16 11h2M2 12h15M4 13h1M6 13h1M13 13h1M15 13h1M3 14h2M6 14h1M12 14h2M15 14h1M5 15h2M14 15h2' /><path stroke='#13141a' d='M4 7h1M6 7h1M3 9h1M7 9h1M3 10h5' /></svg>`;

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!sheepRef.current || !leftEyeRef.current || !rightEyeRef.current) {
      return;
    }
    const rect = sheepRef.current.getBoundingClientRect();
    const anchorX = rect.left + rect.width / 2;
    const anchorY = rect.top + rect.height / 2;
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;

    const angle = (cx: number, cy: number, ex: number, ey: number) => {
      const dy = ey - cy;
      const dx = ex - cx;
      const rad = Math.atan2(dy, dx);
      return (rad * 180) / Math.PI;
    };

    const onMouseMove = (event: any) => {
      const clientX = event.clientX;
      const clientY = event.clientY;
      const angleDeg = angle(clientX, clientY, anchorX, anchorY);
      leftEye.style.transform = `rotate(${-90 + Math.ceil(angleDeg)}deg)`;
      rightEye.style.transform = `rotate(${-90 + Math.ceil(angleDeg)}deg)`;
    };
    document.addEventListener("mousemove", onMouseMove);

    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [windowSize, sheepRef, leftEyeRef, rightEyeRef]);

  return (
    <div className="relative pt-30 w-[300px] h-[300px] m-auto bg-slate-800 rounded-md">
      <img
        ref={sheepRef}
        className="m-auto mt-5"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(sheepSVG)}`}
      ></img>
      <div
        ref={leftEyeRef}
        className="h-5 w-5 bg-darkBackground rounded-full absolute top-[102px] left-[58px]"
      >
        <div className="h-2 w-2 bg-gray-500 ml-1 rounded"></div>
      </div>
      <div
        ref={rightEyeRef}
        className="h-5 w-5 bg-darkBackground rounded-full absolute top-[102px] left-[86px]"
      >
        <div className="h-2 w-2 bg-gray-500 ml-1 rounded"></div>
      </div>
    </div>
  );
};

export default GogglySheep;
