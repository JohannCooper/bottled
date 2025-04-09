import debounce from "lodash/debounce";
import createFrame from "./createFrame";

export default function batchedDebounce<A extends [any, ...any[]], B>(
  func: (args: A[]) => ((...args: A) => B) | Promise<(...args: A) => B>,
  wait?: Parameters<typeof debounce>[1],
  options?: Parameters<typeof debounce>[2]
) {
  let frame = createFrame<A, B>();

  /**
   * TODO: Explain
   * @returns
   */
  const execute = debounce(
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
