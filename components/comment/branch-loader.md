`CommentBranchLoader` 的核心思路是 **“按需加载”** 与 **“分层治理”**。它在你的评论系统中扮演着“增量加载器”的角色。

以下是它的实现思路和触发条件：

### 1. 实现思路 (Core Concept)

- **局部状态管理**：它不是一次性把成百上千条评论加载出来，而是给每个“评论分支”配一个独立的小型加载器。它自己维护 `replies` 数组和 `page` 页码。
- **递归与分页的结合**：
  - 当它加载出下一批评论时，它会再次渲染 `CommentBox`。
  - 如果这些新的 `CommentBox` 下面还有更多子评论，它们会挂载自己的 `CommentBranchLoader`。
  - 这种设计避免了后端 `getCommentTree` 在一次性构建树时产生的深度限制和性能负担。
- **平滑衔接**：它通过 `alreadyLoadedCount` 知道后端已经在初始页面展示了多少条，从而算出自己的起始页码（`page`），避免重复加载。

---

### 2. 只有满足以下条件，才会用到它

在 `CommentBox.tsx` 的逻辑中，你可以清楚地看到它的挂载条件：

```tsx
// 条件 1: 必须有子评论
// 条件 2: 或者是到了深度限制（Level 2 以上），或者是有更多没加载完的评论
{
  (depth >= 2 || loadedRepliesCount < totalReplies) && totalReplies > 0 && (
    <CommentBranchLoader
      parentId={comment.id}
      initialDepth={depth + 1}
      totalReplies={totalReplies}
      alreadyLoadedCount={depth < 2 ? loadedRepliesCount : 0}
    />
  );
}
```

具体来说，满足以下**任意一个场景**就会出现：

#### 场景 A：超出初始渲染深度 (Limit Depth)

- **条件**：`depth >= 2` 且 `totalReplies > 0`。
- **原因**：为了首屏加载速度，后端只递归到 Level 2。Level 3 之后的评论，无论有多少条，默认都不显示，而是显示一个 `CommentBranchLoader` 让用户手动点击“查看回复”。

#### 场景 B：初始数据没加载全 (Load More)

- **条件**：`loadedRepliesCount < totalReplies`。
- **原因**：你在后端限制了 Level 1 和 Level 2 每个父评论只初始化 5 条。如果一个父评论有 10 条回复，首屏只显示 5 条，剩下的 5 条就靠这个 loader 来“翻页”获取。

#### 场景 C：回复数量为 0 时不显示

- **条件**：`totalReplies === 0`。
- **结果**：如果没回复，`CommentBranchLoader` 会返回 `null`，不会在页面上渲染任何东西。

### 总结

它的存在是为了解决 **“无限递归导致的性能崩溃”** 和 **“长列表渲染缓慢”**。它把加载评论的主动权交还给了用户——用户点哪里，我们就加载哪里的分支。
