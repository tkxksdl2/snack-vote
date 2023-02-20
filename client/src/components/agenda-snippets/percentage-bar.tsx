interface IPercentageBarFrop {
  voteCntA: number;
  voteCntB: number;
  width: number;
  height: number;
}

export const PercentageBar: React.FC<IPercentageBarFrop> = ({
  voteCntA,
  voteCntB,
  width,
  height,
}) => {
  const totalCnt = voteCntA + voteCntB;

  return (
    <div
      className="per-bar-base"
      style={{ maxWidth: width - height / 2, height }}
    >
      <div
        className="per-Bar-l"
        style={{
          width: `${totalCnt > 0 ? (voteCntA / totalCnt) * 100 + "" : `50`}%`,
          minWidth: height,
        }}
      >
        <div className="per-bar-node" style={{ width: height }}></div>
      </div>
    </div>
  );
};
