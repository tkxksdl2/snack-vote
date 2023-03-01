interface IPercentageBarFrop {
  voteCntA: number;
  voteCntB: number;
  width: number;
  isBig: boolean;
}

export const PercentageBar: React.FC<IPercentageBarFrop> = ({
  voteCntA,
  voteCntB,
  width,
  isBig,
}) => {
  const totalCnt = voteCntA + voteCntB;
  const nodeRatio = isBig ? 4 : 6.5;
  const calHeight = width * (nodeRatio / 100);
  return (
    <div
      className="per-bar-base"
      style={{ maxWidth: width, height: calHeight }}
    >
      <div
        className="per-Bar-l"
        style={{
          width: `${
            totalCnt > 0
              ? nodeRatio + (100 - nodeRatio) * (voteCntA / totalCnt) + ""
              : nodeRatio + (100 - nodeRatio) * 0.5 + ""
          }%`,
          minWidth: calHeight,
        }}
      >
        <div
          className="per-bar-node relative"
          style={{ width: calHeight }}
        ></div>
      </div>
    </div>
  );
};
