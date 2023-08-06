interface ICountHasAnswerComp {
  contentCount: number | undefined;
  hasAnswer: boolean | undefined;
}

export const CountHasAnswerComp: React.FC<ICountHasAnswerComp> = ({
  contentCount,
  hasAnswer,
}) => {
  if (contentCount)
    return (
      <div
        className={`ml-2 mr-4 w-6 h-6 border-2 rounded-full 
        font-semibold flex justify-center items-center
        ${
          hasAnswer
            ? "text-green-500 border-green-500"
            : "text-red-500 border-red-500"
        }`}
        style={{ minWidth: "24px" }}
      >
        {contentCount}
      </div>
    );
  else return <></>;
};
