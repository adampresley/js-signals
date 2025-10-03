/**
 * Define a signal with initial value
 */
function signal(initialValue) {
   let value = initialValue;
   const subscribers = new Set();

   const read = {
      get value() {
         return value;
      }
   };

   const write = (newValue) => {
      value = typeof newValue === "function" ? newValue(value) : newValue;
      subscribers.forEach(fn => fn(value));
   };

   const subscribe = (fn) => {
      subscribers.add(fn);
      fn(value);
      return () => subscribers.delete(fn);
   };

   return [read, write, subscribe];
}

/**
 * Create a computed value
 */
function computed(fn, dependencies) {
   const [read, write] = signal(fn());

   dependencies.forEach(([, , subscribe]) => {
      subscribe(() => write(fn()));
   });

   return read;
}
