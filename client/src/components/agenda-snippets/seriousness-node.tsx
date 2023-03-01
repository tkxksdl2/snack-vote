import React, { useState } from "react";

interface ISeriousnessNodeProps {
  seriousness: number;
}

export const SeriousnessNode: React.FC<ISeriousnessNodeProps> = ({
  seriousness,
}) => {
  const [showSeriousInfo, setShowSerious] = useState(false);
  const makeR = (v: number): number => {
    if (v >= 5) return 255;
    return Math.round(v * 25.5);
  };
  const makeG = (v: number): number => {
    if (v <= 5) return 255;
    return Math.round((10 - v) * 25.5);
  };

  return (
    <React.Fragment>
      {" "}
      <span
        onMouseEnter={() => {
          setShowSerious(true);
        }}
        onMouseLeave={() => {
          setShowSerious(false);
        }}
        className="border-2 border-gray-300 text-sm rounded-full text-center inline-block"
        style={{
          backgroundColor: `rgba(${makeR(seriousness)},
                          ${makeG(seriousness)},100, 0.7)`,
          width: "23px",
          height: "23px",
        }}
      >
        {seriousness}
      </span>
      <div
        className={
          "absolute border p-1 rounded-sm shadow-sm text-xs bottom-8 w-96 bg-white" +
          (showSeriousInfo ? " visible" : " visible-hidden")
        }
      >
        <div>심각도: {seriousness}</div>
        <div>작성자가 주제를 얼마나 중요하게 여기는가에 대한 점수입니다.</div>
        <div>실제 여론과는 차이가 있을 수 있습니다.</div>
      </div>
    </React.Fragment>
  );
};
