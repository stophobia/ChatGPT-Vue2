<template>
  <div></div>
</template>

<script setup>

  chatHistory.value.push({
    title: "test0",
    history: [
    {role:"user",content:"Python学習"},{role:"ai",content:"1.基本文法：変数、データ型、演算子、条件文、サイクルステートメント、関数などを含むPythonの基本的な構文を学習します。 2.データ構造とアルゴリズム：リスト、グループ、辞書、セットなど、Pythonで一般的に使用されるデータ構造、およびソート、検索、再帰などの一般的なアルゴリズムを学習します。 3.ファイル操作とモジュール：ファイルの読み取りと書き込み、モジュールのインポート、独自のモジュールの作成など、Pythonのファイル操作とモジュールを学習します。 4. Web開発：Flask、Djangoなど、PythonのWeb開発フレームワーク、および関連するHTML、CSS、JavaScript、その他のフロントエンドテクノロジーを学びます。 5.データベース操作：MySQL、SQLite、MongoDBなど、Pythonでのデータベース操作、および関連するSQL言語。 6.補強材とデータ分析：クライミングWebページ、データクリーニング、データの視覚化などを含む、Pythonでクロールとデータ分析を学習します。 7.機械学習と人工知能：一般的に使用される機械学習アルゴリズム、ディープラーニングフレームワークなどを含む、Pythonで機械学習と人工知能を学習します。 8.その他のアプリケーション：科学的コンピューティング、自然言語処理、画像処理など、他のアプリケーションでPythonのアプリケーションを学習します。 上記はPythonの基本的なルートです。特定の学習コンテンツと深さは、個人的な関心とニーズに応じて調整できます。"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    ],
  });
  chatHistory.value.push({
    title: "测试1",
    history: [
    {role:"user",content:"おはよう1"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    ],
  });
  chatHistory.value.push({
    title: "测试2",
    history: [
    {role:"user",content:"おはよう2"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    ],
  });
  chatHistory.value.push({
    title: "测试3",
    history: [
    {role:"user",content:"おはよう3"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    {role:"user",content:"おはよう0"},{role:"ai",content:"おはよう、ChatGPT"},
    ],
  });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory.value));
</script>

<style scoped></style>
