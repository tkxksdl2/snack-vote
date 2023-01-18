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
    <div className="percentageBarBase" style={{ width, height }}>
      <div
        className="percentageBarLeft"
        style={{
          width: `${
            totalCnt > 0
              ? height / 2 + (width - height / 2) * (voteCntA / totalCnt) + ""
              : `${width / 2 + height / 2}`
          }px`,
        }}
      >
        <div className="percentageBarNode" style={{ width: height }}></div>
      </div>
    </div>
  );
};
