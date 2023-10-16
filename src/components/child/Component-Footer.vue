<template>
  <el-footer>
    <div class="footer">
      <div
        class="regenerate"
        v-show="screenWidth > 768 && activeIndex !== -1 && !streamData"
        @click="sendApi()"
        :style="screenWidth<=768?`    bottom: 7.5vh;
    right: calc(100vw / 2 - 178.49px / 2);`:''"
      >
        <div class="regenerate-button">
          <div>
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3 w-3 flex-shrink-0"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path
                d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
              ></path>
            </svg>
            Regenerate response
          </div>
        </div>
      </div>
      <div
        class="regenerate"
        v-show="screenWidth > 768 && activeIndex !== -1 && streamData"
        @click="stopStream()"
      >
        <div class="regenerate-button">
          <div>
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3 w-3"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
            Stop generating
          </div>
        </div>
      </div>
      <div
        class="input-entity"
        :style="
          screenWidth <= 768
            ? `--width-input: 100vw;right: calc(100vw / 2 - var(--width-input) / 2);background-color: #ffffff;border-top: #e5e5e5 solid 1px;padding: 10px;`
            : ''
        "
      >
        <div class="input-box">
          <el-input
            v-model="question"
            :autosize="{ minRows: 1, maxRows: 8 }"
            resize="none"
            type="textarea"
            placeholder="Send a message."
            class="el-textarea-input"
            @keydown.enter="handleEnterKey($event)"
          />
          <div class="send" @click="sendQuestion()">
            <span
              :style="sendStyles"
              class="send-svg"
              :class="{ 'send-svg-active': question != '' }"
            >
              <svg
                v-show="!streamData"
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4 mr-1"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </span>
            <div v-show="streamData" class="send-point">
              <span>.</span>
              <span :class="{ invisible: point1 }">.</span>
              <span :class="{ invisible: point2 }">.</span>
            </div>
          </div>
        </div>
        <div class="phone-regenerate" v-show="screenWidth <= 768 && activeIndex !== -1">
          <svg
            v-show="screenWidth <= 768 && activeIndex !== -1 && !streamData"
            @click="sendApi()"
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="16px"
            width="16px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path
              d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
            ></path>
          </svg>

          <svg
            v-show="screenWidth <= 768 && activeIndex !== -1 && streamData"
            @click="stopStream()"
            stroke="currentColor"
            fill="none"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="16px"
            width="16px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
        </div>
      </div>
      <div class="myInfo" :style="screenWidth<=768?`    height: 5vh;
    --width-myInfo: 100vw;
    right: calc(100vw / 2 - var(--width-myInfo) / 2);`:''">
        <span>
          The model is gpt-3.5-turbo-0301.Data stored locally in the browser (safe and free).
        </span>
      </div>
    </div>
  </el-footer>
</template>

<script setup>
import { inject, ref, computed, nextTick, watch } from "vue";
import { marked } from "marked";
import hljs from "highlight.js";
import { markedHighlight } from "marked-highlight";
import { mangle } from "marked-mangle";
// 親コンポーネント変数/メソッドを取得します
const history = inject("history");
const question = inject("question"); // 質問
const chatHistory = inject("chatHistory");
const activeIndex = inject("activeIndex");
const abortController = inject("abortController"); // fetch終了
const streamData = inject("streamData"); // ストリームデータを受信して​​いるかどうか
const scrollbarRef = inject("scrollbarRef");
const screenWidth = inject("screenWidth"); // 画面幅
let timer = null; // タイマー変数

const contextLength = ref(8); // コンテクスト

marked.setOptions({
  headerIds: false,
});
marked.use(mangle());
marked.use(
  markedHighlight({
    // async: true,
    langPrefix: "hljs language-",
    highlight: function (code, lang) {
      return hljs.highlightAuto(code, [lang]).value;
    },
  })
);

// 定義変数
const point1 = ref(true); // 送信中に動的な変更が必要な2つのポイント
const point2 = ref(true);

watch(streamData, (newVal) => {
  if (newVal === false && timer !== null) {
    console.log("clearInterval");
    clearInterval(timer);
    timer = null;
  }
});

//main
const sendQuestion = () => {
  // 問題を送信し、空にしないでください
  if (question.value == "") {
    return;
  }

  if (activeIndex.value === -1) {
    // 新しいセッション
    console.log("new chat", activeIndex.value);

    history.value = [
      { role: "user", content: question.value },
      { role: "ai", content: "" },
    ];

    // 後ろから追加
    // chatHistory.value.push({
    //   title: "New Chat",
    //   history: history.value,
    // });
    // activeIndex.value = (chatHistory.value.length - 1).toString();

    // 参加する
    chatHistory.value.unshift({
      title: "New Chat",
      history: history.value,
    });
    activeIndex.value = "0";
    sendApi();
  } else {
    // 古いセッション
    history.value.push({ role: "user", content: question.value });
    history.value.push({ role: "ai", content: "" });
    sendApi();
  }
  question.value = "";
};

const sendApi = async () => {
  setPoint(); // 送信時のアニメーションの2つのポイント
  let index = parseInt(activeIndex.value); // 現在のセッションインデックス
  // 注：history.at(-1)に従うと、自分の携帯電話で正常に送信することはできません。
  let len = chatHistory.value[index].history.length - 1;
  chatHistory.value[index].history[len].content = "";
  delete chatHistory.value[index].history[len]["markdown"];
  // chatHistory.value[index].history.at(-1).markdown; // 最後のAIによって生成されたコンテンツをクリア
  let data = chatHistory.value[index].history.slice(0, history.value.length - 1);
  
  streamData.value = true; // オープンストリーミングデータ
  abortController.value = new AbortController(); // abortController取り戻し
  const response = await fetch("/chatGPT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data.splice(-contextLength.value)),
    signal: abortController.signal,
  });
  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    // 各サイクルが始まる前にリクエストが停止されたかどうかを確認
    if (abortController.value.signal.aborted) {
      streamData.value = false; // ストリーミングデータを閉じる
      console.log("请求已经中止");
      break;
    }
    // console.log(done, value, new TextDecoder("utf-8").decode(value));
    // 2つを書く：history.value[history.value.length - 1]["content"] += new TextDecoder("utf-8").decode(value);
    chatHistory.value[index].history[len].content += new TextDecoder("utf-8").decode(
      value
    ); // 履歴変更不可（参照のため）
    chatHistory.value[index].history[len].markdown = marked.parse(
      chatHistory.value[index].history[len].content
    );
    // marked.parse(text);

    let sub =
      scrollbarRef.value.wrapRef.scrollHeight -
      (scrollbarRef.value.wrapRef.scrollTop + scrollbarRef.value.wrapRef.offsetHeight);
    if (Math.abs(sub) <= 2) {
      scrollbarRef.value.wrapRef.scrollTop = scrollbarRef.value.wrapRef.scrollHeight;
    }
  }
  if (
    chatHistory.value[index].title == "New Chat" &&
    chatHistory.value[index].history.length === 2
  )
    getTitle(index); // 新しいセッション リクエストタイトル
  // 持久化 保存
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory.value));
  console.log("持久化保存成功！");
  streamData.value = false; // ストリーミングデータを閉じる
};
// ChatGptからセッションタイトルを取得してセットアップ
const getTitle = async (index) => {
  let data = chatHistory.value[index].history.slice(
    0,
    chatHistory.value[index].history.length
  );
  data.push({
    role: "user",
    content:
      "現在のセッションのコンテンツによると、タイトルを生成するために、トークンは10以内に制限されているため、タイトルコンテンツに答えるだけです",
  });
  console.log("setTitle", index, data);
  const response = await fetch("/chatGPT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const reader = response.body.getReader();
  chatHistory.value[index].title = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (new TextDecoder("utf-8").decode(value) === '"') continue;
    chatHistory.value[index].title += new TextDecoder("utf-8").decode(value);
  }
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory.value));
};

// フローデータの受信を停止します
const stopStream = () => {
  abortController.value.abort();
  streamData.value = false;
};

// enterしてshift+enter イベントを入力します
const handleEnterKey = (event) => {
  // shiftキーを同時に押すと、トリガーされません
  if (event.shiftKey) return;
  sendQuestion();
  event.preventDefault(); // デフォルトを停止
};

// sendStyles
const sendStyles = computed(() => {
  if (question.value == "") return "cursor:default;";
  else return "cursor:pointer;color:rgb(142, 142, 160);";
});

// 2つのポイントアニメーションを設定
const setPoint = () => {
  timer = setInterval(() => {
    // console.log("setPoint");
    if (point1.value) point1.value = false;
    else if (point2.value) point2.value = false;
    else point1.value = point2.value = true;
  }, 400);
};
</script>

<style>
@import "../../assets/css/markdown.css";
/* markdownスタイル補助 */
pre {
  /* user-select: all; */
  display: block;
  padding: 10px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #abb2bf;
  background: #23241f;
  word-break: break-all;
  word-wrap: break-word;
  overflow: auto;
  border-radius: 5px;
}

@media (width <= 768px) {
  .input-entity.input-entity {
    --width-input: 100vw;
    right: calc(100vw / 2 - var(--width-input) / 2);
    background-color: #ffffff;
    /* border:#e5e5e5 solid 0px; */
    border-top: #e5e5e5 solid 1px;
    padding: 10px;
    /* z-index:9999; */
  }
  .myInfo.myInfo {
    height: 5vh;
    --width-myInfo: 100vw;
    right: calc(100vw / 2 - var(--width-myInfo) / 2);
  }

  .regenerate.regenerate {
    bottom: 7.5vh;
    right: calc(100vw / 2 - 178.49px / 2);
  }
}

.el-footer {
  display: flex;
  height: 10vh;
  padding: 0;
  position: fixed;
  bottom: 0px;
  width: 100vw;
  background-image: linear-gradient(to bottom, transparent 0%, white 40%);
  /* mainグラデーションよりも高い設定レベルは、mainローリングバーに有効になります */
  z-index: 10;
}

.footer {
  flex-direction: column;
  align-items: stretch;
  flex: 1 1 0%;
  position: relative;
}

.regenerate {
  width: 178.49px;
  height: 37.33px;
  padding: 0.5rem 0.75rem;
  border: rgba(0, 0, 0, 0.1) solid 1px;
  border-radius: 0.25rem;
  background-color: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  position: fixed;
  right: calc((100vw - 260px) / 2 - 178.49px / 2);
  bottom: 10.5vh;
  cursor: pointer;
}

.regenerate:hover {
  background-color: rgb(236, 236, 241);
}

.regenerate-button {
  border-width: 1px;
  position: relative;
}

.regenerate-button div {
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
  width: 105%;
  display: flex;
}
.regenerate-button div svg {
  flex-shrink: 0;
  width: 0.75rem;
  height: 0.75rem;
  margin-top: 2px;
}

.input-entity {
  --width-input: 65vw;
  position: fixed;
  bottom: 4.5vh;
  display: flex;
  width: var(--width-input);
  right: calc((100vw - 260px) / 2 - var(--width-input) / 2);
  justify-content: space-between;
  align-items: stretch;
  box-sizing: border-box;
}

.input-box {
  box-sizing: border-box;
  flex: 1;
  padding: 0.5rem 0.5rem;
  box-shadow: 0px 0px 5px 1px #ccc;
  height: fit-content;
  border-radius: 5px;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  background-color: #ffffff;
  --phone-regenerate-width: 0px;
}
.el-textarea__inner {
  box-shadow: none;
  border: none;
  padding: 0px 11px;
  font-size: 1.125rem;
  vertical-align: middle;
}
.el-textarea__inner:hover,
.el-textarea__inner:focus {
  border: none;
  box-shadow: none;
}

.phone-regenerate {
  --phone-regenerate-width: 44px;
  box-sizing: border-box;
  width: 44px;
  margin-left: 10px;
  /* height: 44px; */
  align-items: center;
  justify-content: center;
  display: flex;
  cursor: pointer;
}

.phone-regenerate:hover {
  background-color: rgb(236, 236, 241);
  border-radius: 0.25rem;
}

.myInfo {
  --width-myInfo: 65vw;
  height: 4.5vh;
  font-size: 0.75rem;
  line-height: 1rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: fixed;
  bottom: 0vh;
  color: rgb(86, 88, 105);

  display: flex;
  width: var(--width-myInfo);
  right: calc((100vw - 260px) / 2 - var(--width-myInfo) / 2);
}

.myInfo span {
  cursor: text;
  max-height: 5vh;
}
a {
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration-line: underline;
  color: inherit;
}

.el-textarea-input {
  flex: 1;
}

.send .send-svg {
  display: inline-block;
  margin-bottom: 2px;
  --color: rgb(186, 186, 181);
  border-radius: 4px;
  padding: 4px 4px 1px 4px;
  color: var(--color);
  cursor: "pointer";
}

.send span.send-svg-active:hover {
  --color: rgb(142, 142, 160);
  background: #e5e5e5;
}

.send .send-point {
  display: inline-block;
  cursor: default;
  font-size: 1.5rem;
  line-height: 1.5rem;
  color: rgb(142, 142, 160);
}

.send .send-point span {
  position: relative;
  bottom: 0.5rem;
}

.invisible {
  visibility: hidden;
}
</style>
