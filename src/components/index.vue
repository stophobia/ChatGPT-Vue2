<template>
  <div>
    <el-container>
      <component-aside v-if="screenWidth > 768"></component-aside>
      <el-container style="flex-direction: column">
        <component-header v-if="screenWidth <= 768"></component-header>
        <el-drawer
          v-if="screenWidth <= 768"
          v-model="drawerAside"
          :with-header="false"
          direction="ltr"
          show-close="true"
          size="260px"
        >
        
          <component-aside></component-aside>
        </el-drawer>
        <el-scrollbar class="el-main-scrollbar" ref="scrollbarRef" :style="screenWidth<=768?'max-height: 95vh;':''">
          <el-main :style="screenWidth<=768?'width:auto':''">
            <!-- 履歴の場合、ホームページプロンプトコンポーネントが表示されます -->
            <component-index v-if="history.length == 0"></component-index>
            <!-- 
              xs（特小）：幅576px未満の機器または画面。
              sm（小）：576pxまたは、より広い幅のデバイスまたは画面。
              md（中）：768pxまたは、より広い幅のデバイスまたは画面。
              lg（大）：992pxまたは、より広い幅のデバイスまたは画面。
              xl（特大）：1200pxまたは、より広い幅のデバイスまたは画面。
             -->
            <component-content></component-content>
          </el-main>
          <component-footer></component-footer>
        </el-scrollbar>
      </el-container>
    </el-container>
    
  </div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, ref, provide } from "vue";
import { ElScrollbar, ElMain, ElContainer, ElDrawer } from "element-plus";

import ComponentAside from "./child/Component-Aside.vue";
import ComponentHeader from "./child/Component-Header.vue";
import ComponentContent from "./child/Component-Content.vue";
import ComponentFooter from "./child/Component-Footer.vue";
import ComponentIndex from "./child/Component-Index.vue";

// REAL-TIMEモニタリング画面幅：768px超え、サイドバー表示
const screenWidth = ref(window.innerWidth);
const handleResize = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// 変数ステートメント
const activeIndex = ref(-1); // 現在のセッションインデックス
const history = ref([]); // 現在のセッションチャットレコード
const question = ref(""); // 質問
const deleteTitle = ref(-1); // セッションインデックスを削除します
const abortController = ref(null); // fetch終了
const streamData = ref(false); // ストリームデータを受信して​​いるかどうか
const drawerAside = ref(false); // サイドバードロワー

const scrollbarRef = ref(); //mainローリングバーRef
// 新しいセッション
const newChat = () => {
  console.log("newChat");
  history.value = [];
  if (activeIndex.value != -1) drawerAside.value = false;
  activeIndex.value = -1;
  deleteTitle.value = -1;
};

// ブラウザ履歴レコードのコレクション
const chatHistory = ref([]);
onBeforeMount(() => {
  chatHistory.value = JSON.parse(localStorage.getItem("chatHistory"));
  if(chatHistory.value == null) chatHistory.value = [];
  // console.log(chatHistory.value);
});

// コンポーネント値を代用
// 方法
provide("newChat", newChat);
// 変数
provide("chatHistory", chatHistory);
provide("history", history);
provide("activeIndex", activeIndex);
provide("question", question);
provide("drawerAside", drawerAside);
provide("abortController", abortController);
provide("streamData", streamData);
provide("scrollbarRef", scrollbarRef);
provide("screenWidth", screenWidth);// 画面幅を渡す
</script>

<style scoped>
@media (width <= 768px) {
  /* .el-aside {
    幅が768未満の場合、asideは自動的に非表示になります
    display: none;
  } */
  /* .el-header.el-header {
    display: flex;
  } */



  .el-main.el-main {
    width: auto;
  }
  .el-main-scrollbar {
    max-height: 95vh;
  }

  
}

.el-main {
  /* height: 90vh; */
  padding: 0;
  width: calc(100vw - 260px);
  /* padding:20px 0px 20px 0px; */
  overflow-x: hidden;
  /* min-height:80vh; */
  margin-bottom:15vh;
}

.el-main-scrollbar {
  height: 100vh;
}

:deep(.el-drawer__body) {
  padding: 0 !important;
}

.newButton {
  color: #ffffff;
  align-items: center;
}
.centered-menu-item {
  text-align: center;
}
.index-content .el-col {
  padding: 0.75rem;
  background-color: rgb(247, 247, 248);
  border-radius: 0.375rem;
}
</style>
