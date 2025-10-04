/**
 * Define a signal with initial value
 */
export function signal(initialValue) {
   let value = initialValue;
   const subscribers = new Set();

   /**
    * Reader function to get the current value of the signal.
    * @returns {Object} - An object with a getter for the current value of the signal.
    */
   const read = {
      get value() {
         return value;
      }
   };

   /**
    * Writer function to update the value of the signal.
    * @param {Function|*} newValue - The new value for the signal. If newValue is a function, it will be called with the current value of the signal.
    * @returns {void} 
    */
   const write = (newValue) => {
      value = typeof newValue === "function" ? newValue(value) : newValue;
      subscribers.forEach(fn => {
         fn();
      });
   };

   /**
    * Subscribe to changes to the signal and execute the provided function when the signal changes.
    * Returns a function that can be used to unsubscribe from the signal.
    * @param {Function} fn - The function to execute when the signal changes
    * @param {Object} options - Optional configuration object
    * @returns {Function} - A function that can be used to unsubscribe from the signal
    */
   const subscribe = (fn, options = {}) => {
      subscribers.add(debounce(fn, options.debounce ?? 0));
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
