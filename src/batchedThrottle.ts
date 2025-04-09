import throttle from "lodash/throttle";
import createFrame from "./createFrame";

export default function batchedThrottle<A extends [any, ...any[]], B>(
  func: (args: A[]) => ((...args: A) => B) | Promise<(...args: A) => B>,
  wait?: Parameters<typeof throttle>[1],
  options?: Parameters<typeof throttle>[2]
) {
  let frame = createFrame<A, B>();

  /**
   * TODO: Explain
   * @returns
   */
  const execute = throttle(
    async () => {
      // Read and reset active frame
      const { args, resolve, reject } = frame;
      frame = createFrame();

      // Execute function
      try {
        const convert = await func(args);
        resolve(convert);
      } catch (error) {
        reject(error);
      }
    },
    wait,
    options
  );

  /**
   *
   * @param args
   * @returns
   */
  const enqueue = async (...args: A) => {
    const promise = frame.promise;
    frame.args.push(args);
    execute();
    const convert = await promise;
    return convert(...args);
  };

  return enqueue;
}
