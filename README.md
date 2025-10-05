# JS Signals

A super tiny implementation of signals and computed values for basic reactivity. Here is a sample usage.

```html
<p id="count"></p>
<button id="clicker">Click me</button>
```

```js
document.addEventListener("DOMContentLoaded", () => {
  const [count, setCount, subscribeCount] = signal(0);

  const renderCount = computed(() => {
    return `Count is ${count.value}`;
  }, [[count, setCount, subscribeCount]]);

  subscribeCount(() => {
    document.querySelector("#count").innerText = renderCount.value;
  }, { debounce: 200 });

  document.querySelector("#clicker").addEventListener("click", () => {
    setCount(v => v + 1);
  });
});
```

## API

### `signal(initialValue)`

Creates a new signal.

* `initialValue`: The starting value of the signal.

Returns an array with three elements:
1. `read` (object): An object with a `.value` getter to read the signal's current value.
2. `write` (function): A function to update the signal's value.
3. `subscribe` (function): A function to subscribe to changes.

### `computed(fn, dependencies)`

Creates a new signal that is computed from other signals.

* `fn` (function): A function that calculates the value of the computed signal.
* `dependencies` (array): An array of signals that this computed signal depends on.

Returns a `read` object to get the computed value.

### Subscriber Options

When you subscribe to a signal, you can pass an options object as the second argument to the `subscribe` function.

* `debounce` (number): The number of milliseconds to wait after the last signal change before executing the subscriber function. This is useful for preventing a subscriber from running too frequently.

**Example:**

```js
subscribeCount(() => {
  console.log("Count changed!");
}, { debounce: 200 });
```

### Writer Options

When you update a signal's value using the writer function, you can pass an options object as the second argument.

*   `noDebounce` (boolean): If set to `true`, this will cause all subscribers to execute immediately, bypassing any `debounce` setting they may have. This is useful for when you need to ensure a subscriber runs right away.

**Example:**

```js
setCount(10, { noDebounce: true });
```
