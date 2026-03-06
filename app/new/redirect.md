# redirect

- redirect 确实是用来重定向的，但它的实现机制在 Next.js 中比较特殊：

## 工作原理：

- redirect 函数实际上是抛出了一个 Next.js 内部错误（Internal Error）。Next.js 框架捕获这个错误后，才会执行重定向操作。

### 1. 适用场景：

- 它专门设计用于 服务端组件 (Server Components)、Server Actions，或者客户端组件的 渲染阶段。

### 2. 为什么在这里失效：

- 你是在 onSuccess 回调（一个点击提交后的异步函数）里调用它的。在这个时机，代码已经超出了 Next.js 自动捕获该“重定向错误”的生命周期。
  > 这会导致重定向没有发生，甚至在控制台看到一个类似 "NEXT_REDIRECT" 的报错（因为它变成了未捕获的错误）

### 3. 解决方案：

- 在客户端的事件处理器或回调函数中，官方推荐的做法是使用 useRouter().push()。

```tsx
const router = useRouter();

const onSubmit: SubmitHandler<CreateTopicType> = (data) => {
  createTopic(data);
};

const onSuccess = () => {
  router.push("/topics");
};
```

## createPost redirect 为什么放到外面，而不是 trpcServerCaller 之后？

- 在 Server Actions 中，redirect 必须放在 `try/catch` 块的 **外面**，原因有两点：

### 1. redirect 的实现机制

Next.js 的 `redirect` 函数其实并不是一个普通的函数，它通过抛出一个特定的错误（内部称为 `NEXT_REDIRECT` 错误）来中断当前的执行流。

- 如果放在 `trpcServerCaller` 之后但仍在 `try` 块内，这个“重定向错误”会被你写的 `catch (error)` 捕获。
- 一旦被捕获，Next.js 框架就拿不到这个错误，也就不知道该执行重定向了。

### 2. catch 逻辑会将其误判为业务逻辑错误

观察你的代码：

```typescript
try {
  // ... 执行逻辑
  redirect(...) // 如果放在这里
} catch (error) {
  // 这里的捕获会把 redirect 抛出的 NEXT_REDIRECT 错误也抓进来
  if (error instanceof Error) {
    return { errors: { _form: [error.message] } }; // 结果报错显示在 UI 上，而不是跳转
  }
}
```

### 3. 在Next.js的Server Actions 中，标准的处理模式如下：

```typescript
export async function myAction(...) {
  let successData;
  try {
    // 1. 只在 try 块里做数据操作、调用 API/TRPC
    successData = await trpcServerCaller(...).create(...);
  } catch (error) {
    // 2. 错误处理：返回给前端显示错误信息
    return { errors: { _form: [...] } };
  }

  // 3. 只有成功走出 try 块，说明没有异常，此时再执行重定向
  redirect(`/success-path/${successData.id}`);
}

```

### 总结

- **放在 try 内部**：重定向会被 `catch` 拦截，导致跳转失效，页面反而可能会显示一个“未知错误”。
- **放在 try 外部**：确保 `redirect` 抛出的特殊错误能被 Next.js 底层引擎正确捕获并触发浏览器跳转。
