/**
 * 藏文辅音学习游戏 - 核心逻辑
 */

// ===== 数据 =====
// 分组说明：A(1-4) B(5-8) C(9-12) D(13-16) E(17-20) F(21-24) G(25-28) H(29-30)
// 音频命名格式：{组别}_{新序号}_{wylie}.mp3
const letters = [
  // A组
  { id: 1,  group: "A", char: "ཀ", wylie: "ka",   name: "卡",  audio: "A_1_ka.mp3" },
  { id: 2,  group: "A", char: "ཁ", wylie: "kha",  name: "喀",  audio: "A_2_kha.mp3" },
  { id: 3,  group: "A", char: "ག", wylie: "ga",   name: "嘎",  audio: "A_3_ga.mp3" },
  { id: 4,  group: "A", char: "ང", wylie: "nga",  name: "昂",  audio: "A_4_nga.mp3" },
  // B组
  { id: 5,  group: "B", char: "ཅ", wylie: "ca",   name: "匝",  audio: "B_5_ca.mp3" },
  { id: 6,  group: "B", char: "ཆ", wylie: "cha",  name: "叉",  audio: "B_6_cha.mp3" },
  { id: 7,  group: "B", char: "ཇ", wylie: "ja",   name: "扎",  audio: "B_7_ja.mp3" },
  { id: 8,  group: "B", char: "ཉ", wylie: "nya",  name: "娘",  audio: "B_8_nya.mp3" },
  // C组
  { id: 9,  group: "C", char: "ཏ", wylie: "ta",   name: "塔",  audio: "C_9_ta.mp3" },
  { id: 10, group: "C", char: "ཐ", wylie: "tha",  name: "他",  audio: "C_10_tha.mp3" },
  { id: 11, group: "C", char: "ད", wylie: "da",   name: "达",  audio: "C_11_da.mp3" },
  { id: 12, group: "C", char: "ན", wylie: "na",   name: "那",  audio: "C_12_na.mp3" },
  // D组
  { id: 13, group: "D", char: "པ", wylie: "pa",   name: "八",  audio: "D_13_pa.mp3" },
  { id: 14, group: "D", char: "ཕ", wylie: "pha",  name: "趴",  audio: "D_14_pha.mp3" },
  { id: 15, group: "D", char: "བ", wylie: "ba",   name: "巴",  audio: "D_15_ba.mp3" },
  { id: 16, group: "D", char: "མ", wylie: "ma",   name: "妈",  audio: "D_16_ma.mp3" },
  // E组
  { id: 17, group: "E", char: "ཙ", wylie: "tsa",  name: "匝",  audio: "E_17_tsa.mp3" },
  { id: 18, group: "E", char: "ཚ", wylie: "tsha", name: "擦",  audio: "E_18_tsha.mp3" },
  { id: 19, group: "E", char: "ཛ", wylie: "dza",  name: "杂",  audio: "E_19_dza.mp3" },
  { id: 20, group: "E", char: "ཝ", wylie: "wa",   name: "蛙",  audio: "E_20_wa.mp3" },
  // F组
  { id: 21, group: "F", char: "ཞ", wylie: "zha",  name: "沙",  audio: "F_21_zha.mp3" },
  { id: 22, group: "F", char: "ཟ", wylie: "za",   name: "杂",  audio: "F_22_za.mp3" },
  { id: 23, group: "F", char: "འ", wylie: "'a",  name: "阿",  audio: "F_23_apostrophe_a.mp3" },
  { id: 24, group: "F", char: "ཡ", wylie: "ya",   name: "呀",  audio: "F_24_ya.mp3" },
  // G组
  { id: 25, group: "G", char: "ར", wylie: "ra",   name: "热",  audio: "G_25_ra.mp3" },
  { id: 26, group: "G", char: "ལ", wylie: "la",   name: "拉",  audio: "G_26_la.mp3" },
  { id: 27, group: "G", char: "ཤ", wylie: "sha",  name: "沙",  audio: "G_27_sha.mp3" },
  { id: 28, group: "G", char: "ས", wylie: "sa",   name: "撒",  audio: "G_28_sa.mp3" },
  // H组
  { id: 29, group: "H", char: "ཧ", wylie: "ha",   name: "哈",  audio: "H_29_ha.mp3" },
  { id: 30, group: "H", char: "ཨ", wylie: "a",    name: "阿",  audio: "H_30_a.mp3" }
];

const audioPath = 'audio/';  // 音频文件夹路径

 // ===== 状态 =====
let progress = JSON.parse(localStorage.getItem('tibetan-progress')) || {
  flashcard: [],
  listen: { correct: 0, total: 0 }
};

 // ===== 工具函数 =====
function saveProgress() {
  localStorage.setItem('tibetan-progress', JSON.stringify(progress));
  updateHomeProgress();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function playSound(filename) {
  const audio = document.getElementById('audio-player');
  audio.src = audioPath + filename;
  audio.play().catch(e => console.log('音频文件未找到:', filename));
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  
  // 进入页面时初始化
  if (id === 'flashcard') initFlashcard();
  if (id === 'listen') initListen();
  if (id === 'home') updateHomeProgress();
}

 // ===== 首页进度 =====
function updateHomeProgress() {
  const flashcardP = progress.flashcard.length / 30 * 100;
  const listenP = progress.listen.total > 0 ? (progress.listen.correct / progress.listen.total * 100) : 0;
  const total = (flashcardP + listenP) / 2;
  
  document.getElementById('total-progress').style.width = total + '%';
  document.getElementById('total-percent').textContent = Math.round(total);
  
  document.getElementById('flashcard-stat').style.width = flashcardP + '%';
  document.getElementById('listen-stat').style.width = listenP + '%';
}

 // ===== 闪卡 =====
let currentCardIndex = 0;

function initFlashcard() {
  currentCardIndex = 0;
  updateCard();
}

function updateCard() {
  const card = letters[currentCardIndex];
  document.getElementById('card-char').textContent = card.char;
  document.getElementById('card-index').textContent = currentCardIndex + 1;
}

function prevCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    updateCard();
  }
}

function nextCard() {
  if (currentCardIndex < letters.length - 1) {
    currentCardIndex++;
    updateCard();
  }
}

function playAudio() {
  const card = letters[currentCardIndex];
  playSound(card.audio);
  
  // 记录已学习
  if (!progress.flashcard.includes(card.id)) {
    progress.flashcard.push(card.id);
    saveProgress();
  }
}

 // ===== 听音找字 =====
let listenQuestions = [];
let currentListenIndex = 0;
let listenAnswered = false;
let currentListenCorrect = null;

function initListen() {
  currentListenIndex = 0;
  listenAnswered = false;
  document.getElementById('listen-correct').textContent = progress.listen.correct;
  generateListenQuestions();
  showListenQuestion();
}

function generateListenQuestions() {
  const shuffled = shuffle(letters);
  listenQuestions = shuffled.slice(0, 10).map(correct => {
    const others = shuffle(letters.filter(l => l.id !== correct.id)).slice(0, 3);
    const options = shuffle([correct, ...others]);
    return { correct, options };
  });
}

function showListenQuestion() {
  if (currentListenIndex >= listenQuestions.length) {
    alert(`听音完成！正确: ${progress.listen.correct}/${progress.listen.total}`);
    showScreen('home');
    return;
  }
  
  const q = listenQuestions[currentListenIndex];
  currentListenCorrect = q.correct;
  document.getElementById('listen-num').textContent = currentListenIndex + 1;
  listenAnswered = false;
  
  const container = document.getElementById('listen-options');
  container.innerHTML = q.options.map(opt => 
    `<button class="listen-option" data-id="${opt.id}" onclick="selectListenAnswer(${opt.id})">${opt.char}</button>`
  ).join('');
}

function playQuizAudio() {
  playSound(currentListenCorrect.audio);
}

function selectListenAnswer(id) {
  if (listenAnswered) return;
  listenAnswered = true;
  
  const isCorrect = id === currentListenCorrect.id;
  
  progress.listen.total++;
  if (isCorrect) progress.listen.correct++;
  saveProgress();
  
  document.getElementById('listen-correct').textContent = progress.listen.correct;
  
  document.querySelectorAll('.listen-option').forEach(btn => {
    const btnId = parseInt(btn.dataset.id);
    btn.classList.add('disabled');
    if (btnId === currentListenCorrect.id) btn.classList.add('correct');
    else if (btnId === id) btn.classList.add('wrong');
  });
  
  setTimeout(() => {
    currentListenIndex++;
    showListenQuestion();
  }, 1200);
}

 // ===== 初始化 =====
updateHomeProgress();