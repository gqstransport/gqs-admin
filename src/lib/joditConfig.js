import { Jodit } from 'jodit-react';

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function looksLikeHtml(text) {
  return /<[a-z][\s\S]*>/i.test(text);
}

/** Turn plain-text ChatGPT/Gemini copy into lists, headings, paragraphs */
export function structurePlainPaste(text) {
  if (!text?.trim() || looksLikeHtml(text)) return undefined;

  const lines = text.split(/\r?\n/);
  const parts = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      parts.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      parts.push('</ol>');
      inOl = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeLists();
      continue;
    }

    const bullet = /^[-*•]\s+(.+)$/.exec(line);
    const numbered = /^(\d+)[.)]\s+(.+)$/.exec(line);

    if (bullet) {
      if (inOl) {
        parts.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        parts.push('<ul>');
        inUl = true;
      }
      parts.push(`<li>${escapeHtml(bullet[1])}</li>`);
    } else if (numbered) {
      if (inUl) {
        parts.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        parts.push('<ol>');
        inOl = true;
      }
      parts.push(`<li>${escapeHtml(numbered[2])}</li>`);
    } else if (line.length < 56 && !/[.!?]$/.test(line)) {
      closeLists();
      parts.push(`<h3>${escapeHtml(line)}</h3>`);
    } else {
      closeLists();
      parts.push(`<p>${escapeHtml(line)}</p>`);
    }
  }

  closeLists();
  return parts.length ? parts.join('') : undefined;
}

/** Google Docs–style sizes (px) */
const FONT_SIZES = [
  8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 72,
];

const TOOLBAR_BUTTONS = [
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'eraser',
  '|',
  'fontsize',
  'paragraph',
  '|',
  'ul',
  'ol',
  'indent',
  'outdent',
  '|',
  'align',
  '|',
  'brush',
  'link',
  'image',
  '|',
  'undo',
  'redo',
  '|',
  'source',
  'fullsize',
];

const DISABLED_PLUGINS = [
  'speech-recognize',
  'spellcheck',
  'print',
  'about',
  'video',
  'file',
  'math',
  'symbols',
  'ai-assistant',
  'line-height',
  'copy-format',
  'paste-storage',
  'preview',
  'mobile',
  'add-new-line',
  'powered-by-jodit',
  'table',
  'hr',
  'page-break',
  'select-cells',
  'resize-cells',
  'insert-date',
  'class-span',
  'button-generator',
  'iframe',
  'emoji',
];

/** Tags preserved when pasting from ChatGPT, Gemini, Word, etc. */
const PASTE_ALLOW_TAGS = {
  p: true,
  br: true,
  strong: true,
  b: true,
  em: true,
  i: true,
  u: true,
  s: true,
  strike: true,
  del: true,
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  ul: true,
  ol: true,
  li: true,
  blockquote: true,
  pre: true,
  code: true,
  a: true,
  span: true,
  div: true,
};

export function getBlogEditorConfig(placeholder = 'Start typing your rich text blog content here...') {
  return {
    readonly: false,
    placeholder,
    minHeight: 400,
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    processPasteHTML: true,
    nl2brInPlainText: true,
    defaultActionOnPaste: 'insert_as_html',
    defaultActionOnPasteFromWord: 'insert_as_html',
    cleanHTML: {
      allowTags: PASTE_ALLOW_TAGS,
      removeEmptyElements: false,
      fillEmptyParagraph: true,
      replaceOldTags: {
        b: 'strong',
        i: 'em',
      },
    },
    enter: 'p',
    buttons: TOOLBAR_BUTTONS,
    buttonsMD: TOOLBAR_BUTTONS,
    buttonsSM: TOOLBAR_BUTTONS,
    buttonsXS: TOOLBAR_BUTTONS,
    disablePlugins: DISABLED_PLUGINS,
    controls: {
      fontsize: {
        list: Jodit.atom(FONT_SIZES),
        tooltip: 'Font size',
      },
      paragraph: {
        list: Jodit.atom({
          p: 'Paragraph',
          h1: 'Heading 1',
          h2: 'Heading 2',
          h3: 'Heading 3',
          h4: 'Heading 4',
          blockquote: 'Quote',
          pre: 'Code',
        }),
      },
    },
    style: {
      fontFamily: 'inherit',
      fontSize: '16px',
    },
    events: {
      processPaste(_e, text) {
        return structurePlainPaste(text);
      },
    },
  };
}
