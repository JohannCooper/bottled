/**
 * Create a new frame that stores accumulators that are modified during the
 * timeout period.
 * @returns The frame.
 */
export default function createFrame<A extends [any, ...any[]], B>() {
  let resolve: (convert: (...args: A) => B) => void;
  let reject: (reason?: any) => void;

  // Promise executors are guaranteed to run immediately
  const promise = new Promise<(...args: A) => B>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return {
    args: [] as A[],
    promise: promise,
    resolve: resolve!,
    reject: reject!,
  };
}
