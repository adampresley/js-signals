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

