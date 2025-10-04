/**
 * Define a signal with initial value
 */
export function signal(initialValue) {
   let value = initialValue;
   const subscribers = new Set();

   const read = {
      get value() {
         return value;
      }
   };

   const write = (newValue) => {
      value = typeof newValue === "function" ? newValue(value) : newValue;
      subscribers.forEach(fn => {
         fn();
      });
   };

   const subscribe = (fn, options = {}) => {
      subscribers.add(debounce(fn, options.debounce ?? 0));
      fn(value);
      return () => subscribers.delete(opts);
   };

   return [read, write, subscribe];
}

/**
 * Create a computed value
 */
export function computed(fn, dependencies) {
   const [read, write] = signal(fn());

   dependencies.forEach(([, , subscribe]) => {
      subscribe(() => write(fn()));
   });

   return read;
}

function debounce(fn, delay) {
   let id = null;

   return function() {
      let args = arguments;
      let self = this;

      clearTimeout(id);

      id = setTimeout(function() {
         fn.apply(self, args);
      }, delay);
   };
}
