type MockFunc<T extends any[], R> = (...args: T) => R;

export const expectCalledTimesAndWith = <T extends any[], R>(
  mockfunc: jest.Mock<T, any> | MockFunc<T, R>,
  times: number,
  ...args: T[]
) => {
  expect(mockfunc).toHaveBeenCalledTimes(times);
  args.map((arg, i) => {
    expect(mockfunc).toHaveBeenNthCalledWith(i + 1, ...arg);
  });
};
