const PptxGenJS = require('pptxgenjs');
const { marked } = require('marked');
const { decode } = require('html-entities');

// MarkdownからHTMLへの変換関数
function parseMarkdownToHtml(markdownContent) {
  return marked.parse(markdownContent);
}

// Markdownセクションからスライドデータへ変換する関数
function convertMarkdownToSlides(markdownSections) {
  return markdownSections.map(section => {
    const htmlContent = parseMarkdownToHtml(section.content);
    
    // 各要素を順番通りに抽出
    const elements = [];
    
    // タイトルと本文を抽出
    const titleMatch = htmlContent.match(/<h1>(.*?)<\/h1>/);
    if (titleMatch) {
      elements.push({ type: 'title', content: decode(titleMatch[1]) });
    }
    
    // 残りの内容（pタグ、画像、コードブロックなど）を順番通りに処理
    const bodyMatches = [...htmlContent.matchAll(/(<p>(.*?)<\/p>)|(<img src="(.*?)".*?>)|(<pre><code class="(language-\w+)">(.*?)<\/code><\/pre>)/gs)];
    
    bodyMatches.forEach(match => {
      if (match[2]) { // pタグ（テキスト）
        elements.push({ type: 'text', content: decode(match[2]) });
      } else if (match[4]) { // imgタグ（画像）
        elements.push({ type: 'image', content: match[4] }); // 画像URLを抽出
      } else if (match[7]) { // pre/codeタグ（コードブロック）
        const languageClass = match[6];
        const language = languageClass.split('-')[1];
        const codeContent = decode(match[7].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'));
        elements.push({ type: 'code', language, content: codeContent });
      }
    });

    return elements;
  });
}

// PptxGenJSでスライドを作成する関数
function createPptFromMarkdown(slides) {
  let pptx = new PptxGenJS();
  
  // スライドレイアウトを16:9に設定
  pptx.layout = 'LAYOUT_WIDE';
  
  slides.forEach((slideElements, index) => {
    let slide = pptx.addSlide();
    
    let yPosition = 0.5; // 各要素のY位置を管理

    slideElements.forEach(element => {
      if (element.type === 'title') {
        slide.addText(element.content, { 
          x: '10%', y: yPosition, 
          w: '80%', h: '10%', 
          fontSize: 48, 
          bold: true,
          align: 'center',
        });
        yPosition += 1; // タイトル分の高さを加算
      } else if (element.type === 'text') {
        slide.addText(element.content, { 
          x: 0.5, y: yPosition, 
          w: '90%', h: '10%', 
          fontSize: 24,
          align: 'left',
        });
        yPosition += 0.5; // テキスト分の高さを加算
      } else if (element.type === 'image') {
        slide.addImage({ path: element.content, x: 0.5, y: yPosition, w: 6, h: 4 }); // URLから画像を追加
        yPosition += 4.5; // 画像分の高さを加算
      } else if (element.type === 'code') {
        const blockHeight = calculateCodeBlockHeight(element.content);
        
        // コードブロックの背景と枠線
        slide.addShape(pptx.shapes.RECTANGLE, {
          x: 0.5,
          y: yPosition,
          w: '90%',
          h: blockHeight / 72 + "in", // 高さはインチ単位で指定する必要があるため変換（72pt = 1in）
          fill: { color:'1E1E1E' }, // 背景色（VSCode風）
          line:{ color:'888888', width:1 } // 枠線（薄いグレー）
        });

        // コードブロックを追加（等幅フォント）
        slide.addText(element.content, { 
          x: 0.7,
          y: yPosition + 0.1,
          w: '89%',
          h: blockHeight / 72 + "in",
          fontSize: 20,
          fontFace:'Courier New', // 等幅フォントで表示
          color:'FFFFFF', // 白い文字（VSCode風）
          align:'left'
        });

        yPosition += blockHeight / 72 + 0.5; // コードブロック分の高さを加算
      }
    });
    
  });

  pptx.writeFile({ fileName: 'presentation.pptx' });
}

// コードブロックの高さを計算する関数
function calculateCodeBlockHeight(codeContent) {
  const numLines = codeContent.split('\n').length; // コード内の行数をカウント
  const averageLineHeight = 18; // 1行あたりの高さ（ポイント）
  const margin = 10; // 上下に余白を追加
  return (numLines * averageLineHeight) + margin; // 合計高さを返す
}

// Markdownセクションのデータ（例）
const markdownSections = [
  { content: '# NotionSlide紹介\n\n\nプレゼンター：大鐘　斐斗' },
  {
    content: '# 画像の仕様調査\n' +
      '\n' +
      '\n' +
      '![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/dccc7203-ade1-4aea-a380-11049fde0390/726c108b-85af-4256-a1b9-7d9cc147e5ca/image.png)\n' +
      '\n' +
      '\n' +
      'おそらく一時間ほどで画像のurlがきれてしまうのですらいどの有効期限を決める必要がある'
  },
];

// スライドデータへ変換してPPTXファイル作成
const slidesData = convertMarkdownToSlides(markdownSections);
createPptFromMarkdown(slidesData);