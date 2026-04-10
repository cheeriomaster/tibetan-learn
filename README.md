# 藏文辅音学习游戏

一个轻量化的藏文30个辅音字母学习Web应用，包含四种互动练习模式。

## 在线演示

将 `audio/` 文件夹放入项目根目录后，推送到 GitHub，启用 **Settings → Pages → main branch** 即可在线访问。

## 项目结构

```
tibetan-learn/
├── index.html      # 主页面
├── style.css       # 样式
├── app.js          # 核心逻辑
├── data/           # 数据文件（可选）
└── audio/          # 音频文件夹 ⚠️ 需手动添加
```

## 添加音频文件

将你的30个音频文件放入 `audio/` 目录，命名规则：

| 文件名 | 对应字母 | Wylie |
|--------|----------|-------|
| 1_ka.mp3 | ཀ | ka |
| 2_kha.mp3 | ཁ | kha |
| 3_ga.mp3 | ག | ga |
| ... | ... | ... |
| 30_a.mp3 | ཨ | a |

## 功能模式

1. **闪卡记忆** - 翻转卡片学习字形+发音
2. **选择题测验** - 4选1，检验学习成果
3. **连连看** - 字形与Wylie音配对
4. **听音找字** - 听发音选对应字形

## 本地运行

直接用浏览器打开 `index.html` 即可（需要本地服务器解决跨域音频加载问题）：

```bash
# 方法1: Python
python -m http.server 8000

# 方法2: Node
npx serve .
```

然后访问 http://localhost:8000

## 部署到 GitHub Pages

1. 创建 GitHub 仓库
2. 推送代码
3. Settings → Pages → 选择 main 分支
4. 访问 `https://你的用户名.github.io/仓库名/`