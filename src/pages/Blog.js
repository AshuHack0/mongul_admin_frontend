import { useEffect, useRef, useState, useCallback, useReducer, memo } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatQuote,
  Code as CodeIcon,
  Image as ImageIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  StrikethroughS,
  HorizontalRule,
  AddPhotoAlternate,
  Close,
  Link as LinkIcon,
  TextDecrease as TextDecreaseIcon,
  TextIncrease as TextIncreaseIcon,
} from "@mui/icons-material";
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Node, Mark, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import SideBarLayout from "../layout/SideBarLayout";
import styles from "../styles/dashboard.module.css";
import {
  fetchBlogByIdThunk,
  createBlogThunk,
  updateBlogThunk,
} from "../store/thunks/blogThunks";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("python", python);

// ─── Link Preview Card (node view) ───────────────────────────────────────────

const LinkPreviewCardView = ({ node }) => {
  const { url, title, description, image } = node.attrs;
  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  return (
    <NodeViewWrapper contentEditable={false}>
      <Box
        component="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "stretch",
          textDecoration: "none",
          color: "inherit",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.5,
          overflow: "hidden",
          my: 2,
          bgcolor: "background.paper",
          cursor: "pointer",
          maxHeight: 160,
        }}
      >
        {/* Text side */}
        <Box sx={{ flex: 1, px: 3, py: 2.5, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Box>
            <Typography
              sx={{
                fontSize: "1.05rem",
                fontWeight: 700,
                lineHeight: 1.4,
                mb: 1,
                color: "text.primary",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {title || domain}
            </Typography>
            {description && (
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "text.secondary",
                  lineHeight: 1.55,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
          <Typography sx={{ fontSize: "0.8rem", color: "text.disabled", mt: 1.5 }}>
            {domain}
          </Typography>
        </Box>

        {/* Thumbnail */}
        {image && (
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{ width: 160, flexShrink: 0, objectFit: "cover", bgcolor: "grey.100" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
      </Box>
    </NodeViewWrapper>
  );
};

const LinkPreviewNode = Node.create({
  name: "linkPreview",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      url: { default: "" },
      title: { default: "" },
      description: { default: "" },
      image: { default: "" },
      favicon: { default: "" },
      loading: { default: false },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-link-preview]' }];
  },

  renderHTML({ node }) {
    const { url = '', title = '', description = '', image = '' } = node.attrs;
    let domain = url;
    try { domain = new URL(url).hostname; } catch {}

    const textSide = ['div', { style: 'flex:1;padding:20px 24px;display:flex;flex-direction:column;justify-content:space-between;min-width:0;' },
      ['div', {},
        ['div', { style: 'font-weight:700;font-size:1.05rem;line-height:1.4;margin-bottom:8px;color:#18181b;' }, title || domain],
        ...(description ? [['div', { style: 'font-size:0.85rem;color:#71717a;line-height:1.55;' }, description]] : []),
      ],
      ['div', { style: 'font-size:0.8rem;color:#a1a1aa;margin-top:12px;' }, domain],
    ];

    return ['div', { 'data-link-preview': '' },
      ['a', {
        href: url, target: '_blank', rel: 'noopener noreferrer',
        style: 'display:flex;align-items:stretch;text-decoration:none;color:inherit;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;margin:16px 0;max-height:160px;',
      },
        textSide,
        ...(image ? [['img', { src: image, alt: title || '', style: 'width:160px;flex-shrink:0;object-fit:cover;' }]] : []),
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkPreviewCardView);
  },
});

// ─── URL helper ──────────────────────────────────────────────────────────────

const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

async function fetchLinkPreview(url) {
  try {
    const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const json = await res.json();
    if (json.status === "success") {
      return {
        title: json.data?.title || "",
        description: json.data?.description || "",
        image: json.data?.image?.url || json.data?.screenshot?.url || "",
        favicon: json.data?.logo?.url || "",
      };
    }
  } catch {}
  return { title: "", description: "", image: "", favicon: "" };
}

// ─── Image resize node ───────────────────────────────────────────────────────

const HANDLE_DEFS = {
  nw: { top: -5, left: -5,          cursor: 'nwse-resize' },
  n:  { top: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  ne: { top: -5, right: -5,         cursor: 'nesw-resize' },
  e:  { top: '50%', right: -5, transform: 'translateY(-50%)', cursor: 'ew-resize' },
  se: { bottom: -5, right: -5,      cursor: 'nwse-resize' },
  s:  { bottom: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
  sw: { bottom: -5, left: -5,       cursor: 'nesw-resize' },
  w:  { top: '50%', left: -5, transform: 'translateY(-50%)', cursor: 'ew-resize' },
};

const ImageResizeView = ({ node, updateAttributes, selected }) => {
  const { src, alt, width, height } = node.attrs;
  const imgRef = useRef(null);

  const startResize = (e, dir) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = imgRef.current?.offsetWidth ?? width ?? 300;
    const startH = imgRef.current?.offsetHeight ?? height ?? 200;

    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const next = {};
      if (dir.includes('e')) next.width  = Math.max(50, Math.round(startW + dx));
      if (dir.includes('w')) next.width  = Math.max(50, Math.round(startW - dx));
      if (dir.includes('s')) next.height = Math.max(50, Math.round(startH + dy));
      if (dir.includes('n')) next.height = Math.max(50, Math.round(startH - dy));
      updateAttributes(next);
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <NodeViewWrapper>
      <div data-drag-handle style={{ display: 'inline-block', position: 'relative', lineHeight: 0, maxWidth: '100%', cursor: 'grab' }}>
        <img
          ref={imgRef}
          src={src}
          alt={alt || ''}
          draggable={false}
          style={{
            display: 'block',
            width: width ? `${width}px` : 'auto',
            height: height ? `${height}px` : 'auto',
            maxWidth: '100%',
            outline: selected ? '2px solid #1976d2' : 'none',
            outlineOffset: 1,
            pointerEvents: 'none',
          }}
        />
        {selected && Object.entries(HANDLE_DEFS).map(([dir, style]) => (
          <div
            key={dir}
            onMouseDown={(e) => startResize(e, dir)}
            style={{
              position: 'absolute',
              width: 10,
              height: 10,
              background: '#fff',
              border: '2px solid #1976d2',
              borderRadius: 2,
              boxSizing: 'border-box',
              zIndex: 10,
              ...style,
            }}
          />
        ))}
      </div>
    </NodeViewWrapper>
  );
};

const ImageResizeExtension = Node.create({
  name: 'image',
  group: 'block',
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src:    { default: null },
      alt:    { default: '' },
      width:  { default: null, parseHTML: el => el.getAttribute('width') ? parseInt(el.getAttribute('width')) : null },
      height: { default: null, parseHTML: el => el.getAttribute('height') ? parseInt(el.getAttribute('height')) : null },
    };
  },

  parseHTML() { return [{ tag: 'img[src]' }]; },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeView);
  },

  addCommands() {
    return {
      setImage: attrs => ({ commands }) => commands.insertContent({ type: this.name, attrs }),
    };
  },
});

// ─── Font size extension ──────────────────────────────────────────────────────

const FONT_SIZE_BASE = 19; // ≈ 1.2rem at 16px root
const FONT_SIZE_STEP = 2;
const FONT_SIZE_MIN = 10;
const FONT_SIZE_MAX = 72;

const FontSize = Mark.create({
  name: "fontSize",

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: (el) => {
          const fs = el.style.fontSize;
          return fs?.endsWith("px") ? parseInt(fs) : null;
        },
        renderHTML: (attrs) =>
          attrs.size ? { style: `font-size: ${attrs.size}px` } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "span", getAttrs: (el) => el.style.fontSize ? null : false }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setFontSize: (size) => ({ commands }) =>
        commands.setMark(this.name, { size }),
      unsetFontSize: () => ({ commands }) =>
        commands.unsetMark(this.name),
    };
  },
});

// ─── Toolbar helpers ─────────────────────────────────────────────────────────

const ToolBtn = memo(({ title, onClick, active, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      width: "32px",
      height: "32px",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      color: active ? "#ffffff" : disabled ? "#d4d4d8" : "#71717a",
      backgroundColor: active ? "#18181b" : "transparent",
      transition: "background 0.1s, color 0.1s",
      outline: "none",
      opacity: disabled ? 0.5 : 1,
    }}
    onMouseEnter={(e) => { if (!active && !disabled) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)"; }}
    onMouseLeave={(e) => { if (!active && !disabled) e.currentTarget.style.backgroundColor = "transparent"; }}
  >
    {children}
  </button>
));

const ToolGroup = ({ children }) => (
  <Stack direction="row" alignItems="center" gap={0.25}>{children}</Stack>
);

const Sep = () => (
  <Divider orientation="vertical" flexItem sx={{ mx: 0.75, height: 20, alignSelf: "center" }} />
);

// ─── MenuBar ─────────────────────────────────────────────────────────────────

function MenuBar({ editor, onAddImage, onAddLink }) {
  if (!editor) return null;

  const currentSize = editor.getAttributes("fontSize").size ?? FONT_SIZE_BASE;
  const atMin = currentSize <= FONT_SIZE_MIN;
  const atMax = currentSize >= FONT_SIZE_MAX;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 0.5,
        px: 3,
        py: 1,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        position: "sticky",
        top: 0,
        zIndex: 10,
        minHeight: 52,
      }}
    >
      <Box sx={{ maxWidth: 780, mx: "auto", width: "100%", display: "flex", alignItems: "center", gap: 0.5 }}>
        <ToolGroup>
          <ToolBtn title="Undo" onClick={() => editor.chain().focus().undo().run()}>
            <UndoIcon sx={{ fontSize: 16 }} />
          </ToolBtn>
          <ToolBtn title="Redo" onClick={() => editor.chain().focus().redo().run()}>
            <RedoIcon sx={{ fontSize: 16 }} />
          </ToolBtn>
        </ToolGroup>
        <Sep />
        <ToolGroup>
          <ToolBtn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
            <FormatBold sx={{ fontSize: 16 }} />
          </ToolBtn>
          <ToolBtn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
            <FormatItalic sx={{ fontSize: 16 }} />
          </ToolBtn>
          <ToolBtn title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
            <StrikethroughS sx={{ fontSize: 16 }} />
          </ToolBtn>
          <ToolBtn title="Link" onClick={onAddLink} active={editor.isActive("link")}>
            <LinkIcon sx={{ fontSize: 16 }} />
          </ToolBtn>
        </ToolGroup>
        <Sep />
        <ToolGroup>
          <ToolBtn title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, lineHeight: 1 }}>H1</Typography>
          </ToolBtn>
          <ToolBtn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, lineHeight: 1 }}>H2</Typography>
          </ToolBtn>
          <ToolBtn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 800, lineHeight: 1 }}>H3</Typography>
          </ToolBtn>
        </ToolGroup>
        <Sep />
        <ToolGroup>
          <ToolBtn title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
            <FormatListBulleted sx={{ fontSize: 16 }} />
          </ToolBtn>
          <ToolBtn title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
            <FormatQuote sx={{ fontSize: 16 }} />
          </ToolBtn>
          <ToolBtn title="Code Block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
            <CodeIcon sx={{ fontSize: 16 }} />
          </ToolBtn>
          <ToolBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <HorizontalRule sx={{ fontSize: 16 }} />
          </ToolBtn>
        </ToolGroup>
        <Sep />
        <ToolGroup>
          <ToolBtn
            title={`Decrease font size (${currentSize}px → ${Math.max(FONT_SIZE_MIN, currentSize - FONT_SIZE_STEP)}px)`}
            disabled={atMin}
            onClick={() => editor.chain().focus().setFontSize(Math.max(FONT_SIZE_MIN, currentSize - FONT_SIZE_STEP)).run()}
          >
            <TextDecreaseIcon sx={{ fontSize: 16 }} />
          </ToolBtn>
          <Box
            sx={{
              fontSize: "0.7rem", fontWeight: 700, minWidth: 28, textAlign: "center",
              color: currentSize !== FONT_SIZE_BASE ? "#18181b" : "#a1a1aa",
              cursor: currentSize !== FONT_SIZE_BASE ? "pointer" : "default",
              userSelect: "none",
            }}
            title={currentSize !== FONT_SIZE_BASE ? "Reset to default size" : "Default size"}
            onClick={() => currentSize !== FONT_SIZE_BASE && editor.chain().focus().unsetFontSize().run()}
          >
            {currentSize}
          </Box>
          <ToolBtn
            title={`Increase font size (${currentSize}px → ${Math.min(FONT_SIZE_MAX, currentSize + FONT_SIZE_STEP)}px)`}
            disabled={atMax}
            onClick={() => editor.chain().focus().setFontSize(Math.min(FONT_SIZE_MAX, currentSize + FONT_SIZE_STEP)).run()}
          >
            <TextIncreaseIcon sx={{ fontSize: 16 }} />
          </ToolBtn>
        </ToolGroup>
        <Sep />
        <ToolBtn title="Insert Image" onClick={onAddImage}>
          <ImageIcon sx={{ fontSize: 16 }} />
        </ToolBtn>
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    </Box>
  );
}

// ─── Link dialog ─────────────────────────────────────────────────────────────

const LinkDialog = ({ open, onClose, onConfirm }) => {
  const [val, setVal] = useState("");
  const handleConfirm = () => {
    if (val.trim()) { onConfirm(val.trim()); setVal(""); }
  };
  return (
    <Dialog open={open} onClose={() => { onClose(); setVal(""); }} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 2 } } }}>
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} mb={2}>Insert link</Typography>
        <InputBase
          autoFocus
          fullWidth
          placeholder="https://example.com"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 1, fontSize: "0.9rem", mb: 2 }}
        />
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Button variant="text" size="small" onClick={() => { onClose(); setVal(""); }}>Cancel</Button>
          <Button variant="contained" size="small" onClick={handleConfirm} sx={{ borderRadius: 99, textTransform: "none" }}>
            Add link
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Blog component ──────────────────────────────────────────────────────

function Blog() {
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const editorRef = useRef(null);

  const [publishOpen, setPublishOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const { blogId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [previewTitle, setPreviewTitle] = useState("");
  const [previewSubtitle, setPreviewSubtitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [titleError, setTitleError] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(!!blogId);

  const insertLinkPreview = useCallback(async (editor, url) => {
    const meta = await fetchLinkPreview(url);
    editor.chain().focus().insertContent({
      type: "linkPreview",
      attrs: { url, loading: false, ...meta },
    }).run();
  }, []);

  const [, tick] = useReducer(x => x + 1, 0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: false,
      }),
      ImageResizeExtension,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Placeholder.configure({
        placeholder: "Start writing blog...",
        emptyEditorClass: "is-editor-empty",
      }),
      CodeBlockLowlight.configure({ lowlight }),
      LinkPreviewNode,
      FontSize,
    ],
    content: "",
    onTransaction: () => queueMicrotask(tick),
    editorProps: {
      handlePaste(view, event) {
        const text = event.clipboardData?.getData("text/plain")?.trim();
        if (!text || !URL_REGEX.test(text)) return false;

        const { selection } = view.state;
        const $from = selection.$from;
        const isEmptyParagraph = $from.parent.type.name === "paragraph" && $from.parent.textContent === "";
        if (!isEmptyParagraph) return false;

        event.preventDefault();
        if (editorRef.current) insertLinkPreview(editorRef.current, text);
        return true;
      },
    },
    onCreate({ editor: e }) { editorRef.current = e; },
  });

  useEffect(() => {
    if (!editor) return;

    if (blogId) {
      dispatch(fetchBlogByIdThunk(blogId))
        .unwrap()
        .then((blog) => {
          setPreviewTitle(blog.title || "");
          setPreviewSubtitle(blog.subtitle || "");
          setTopics(blog.topics || []);
          setCoverImage(blog.coverImage || null);
          if (blog.content) setTimeout(() => editor.commands.setContent(blog.content), 0);
          setLoading(false);
        })
        .catch(() => {
          alert("Failed to load blog post.");
          navigate("/blog/list");
        });
    } else {
      const saved = localStorage.getItem("blog-draft");
      if (saved) {
        try {
          setTimeout(() => editor.commands.setContent(JSON.parse(saved)), 0);
        } catch {}
      }
    }
  }, [editor, blogId, dispatch, navigate]);

  useEffect(() => {
    if (!editor || blogId) return; // Don't auto-save to localStorage if editing an existing blog
    const id = setInterval(() => {
      localStorage.setItem("blog-draft", JSON.stringify(editor.getJSON()));
      setSavedAt(new Date());
    }, 5000);
    return () => clearInterval(id);
  }, [editor, blogId]);

  const addImage = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (!editor.isDestroyed) editor.chain().focus().setImage({ src: ev.target.result }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Cover image must be under 5 MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setCoverImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleAddTopic = (e) => {
    if (e.key !== "Enter" || !topicInput.trim() || topics.length >= 5) return;
    const val = topicInput.trim();
    if (!topics.includes(val)) setTopics([...topics, val]);
    setTopicInput("");
  };

  const handleLinkConfirm = (url) => {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    setLinkDialogOpen(false);
    const { selection } = editor.state;
    const hasSelection = !selection.empty;

    if (hasSelection) {
      editor.chain().focus().setLink({ href: fullUrl }).run();
    } else {
      insertLinkPreview(editor, fullUrl);
    }
  };

  const handlePublishClick = async () => {
    if (!previewTitle.trim()) {
      setTitleError(true);
      return;
    }
    setTitleError(false);
    setPublishing(true);

    const blogData = {
      title: previewTitle,
      subtitle: previewSubtitle,
      coverImage,
      topics,
      content: editor.getJSON(),
      htmlContent: editor.getHTML(),
      status: "published",
    };

    try {
      if (blogId) {
        await dispatch(updateBlogThunk({ id: blogId, data: blogData })).unwrap();
      } else {
        await dispatch(createBlogThunk(blogData)).unwrap();
        localStorage.removeItem("blog-draft");
      }
      setPublishOpen(false);
      navigate("/blog/list");
    } catch (err) {
      alert(err || "Failed to publish blog.");
    } finally {
      setPublishing(false);
    }
  };

  const savedLabel = blogId
    ? null
    : savedAt
      ? `Saved at ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : "Draft not yet saved";

  const header = (
    <div className={styles.pageHeader}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
        <div>
          <Typography className={styles.pageTitle}>{blogId ? "Edit Post" : "Blog Editor"}</Typography>
          <Typography className={styles.pageSubtitle}>
            {blogId ? `Editing: ${previewTitle}` : "Write and publish blog posts with rich formatting."}
          </Typography>
        </div>
        <Button
          variant="outlined"
          onClick={() => navigate("/blog/list")}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "#e4e4e7", color: "#18181b" }}
        >
          Back to List
        </Button>
      </Box>
    </div>
  );

  if (loading && blogId) {
    return (
      <SideBarLayout header={header}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <CircularProgress size={40} sx={{ color: "#18181b" }} />
        </Box>
      </SideBarLayout>
    );
  }

  if (!editor) return null;

  return (
    <SideBarLayout header={header} noPadding>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", bgcolor: "#ffffff" }}>

        <MenuBar editor={editor} onAddImage={addImage} onAddLink={() => setLinkDialogOpen(true)} />

        {/* Writing area */}
        <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }} onClick={() => editor.commands.focus()}>
          <Box
            sx={{
              flex: 1,
              width: "100%",
              px: { xs: 3, md: 12 },
              py: { xs: 4, md: 8 },
              "& .tiptap": {
                outline: "none",
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.2rem",
                lineHeight: 1.6,
                color: "text.primary",
                maxWidth: 900,
                mx: "auto",
                "& p.is-editor-empty:first-of-type::before": {
                  color: "#94a3b8",
                  content: "attr(data-placeholder)",
                  float: "left",
                  height: 0,
                  pointerEvents: "none",
                },
                "& h1": { fontSize: "3rem", fontWeight: 800, lineHeight: 1.1, mt: 0, mb: "0.5em", letterSpacing: "-0.02em" },
                "& h2": { fontSize: "2rem", fontWeight: 700, lineHeight: 1.2, mt: "1.5em", mb: "0.4em" },
                "& h3": { fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.3, mt: "1.25em", mb: "0.4em" },
                "& p": { mt: 0, mb: "1.2em" },
                "& ul, & ol": { paddingInlineStart: "1.6rem", mb: "1.2em" },
                "& li": { mb: "0.4em" },
                "& a": { color: "#2563eb", textDecoration: "underline", textUnderlineOffset: "3px", "&:hover": { color: "#1d4ed8" } },
                "& blockquote": {
                  borderLeft: "3px solid #e2e8f0",
                  ml: 0, pl: "1.5em", my: "2em",
                  fontStyle: "italic", color: "text.secondary",
                  fontSize: "1.3rem",
                },
                "& pre": {
                  background: "#f8fafc", color: "#1e293b",
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "0.9rem", padding: "1.5rem",
                  borderRadius: "8px", overflowX: "auto", my: "2em", border: "1px solid #e2e8f0",
                  "& code": { color: "inherit", padding: 0, background: "none" },
                },
                "& code": {
                  background: "#f1f5f9", color: "#0f172a",
                  padding: "0.2em 0.4em", borderRadius: "4px",
                  fontSize: "0.9em", fontFamily: "'JetBrains Mono',monospace",
                },
                "& img": { maxWidth: "100%", height: "auto", borderRadius: "8px", display: "block", my: "2.5em" },
                "& hr": { border: 0, borderTop: "1px solid", borderColor: "divider", my: "3em" },
              },
            }}
          >
            <EditorContent editor={editor} />
          </Box>

          {/* Status bar */}
          <Box sx={{ px: { xs: 3, md: 12 }, py: 4, mt: "auto", borderTop: "1px solid", borderColor: "divider" }}>
            <Box sx={{ maxWidth: 900, mx: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              {savedLabel && (
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: savedAt ? "success.main" : "warning.main" }} />
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>{savedLabel}</Typography>
                </Stack>
              )}
              <Button
                variant="contained" size="large"
                onClick={() => setPublishOpen(true)}
                disabled={publishing}
                sx={{ borderRadius: 2, px: 4, py: 1, fontWeight: 700, textTransform: "none", fontSize: "0.95rem", boxShadow: "none", bgcolor: "#18181b", "&:hover": { bgcolor: "#000000", boxShadow: "none" } }}
              >
                {publishing ? <CircularProgress size={20} color="inherit" /> : "Ready to publish?"}
              </Button>
            </Box>
          </Box>
        </Box>

        <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />
      </Box>

      {/* Link dialog */}
      <LinkDialog open={linkDialogOpen} onClose={() => setLinkDialogOpen(false)} onConfirm={handleLinkConfirm} />

      {/* Publish dialog */}
      <Dialog open={publishOpen} onClose={() => setPublishOpen(false)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ px: 4, py: 2.5, borderBottom: "1px solid", borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "background.paper" }}>
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1rem" }}>Story preview</Typography>
            <IconButton size="small" onClick={() => setPublishOpen(false)} sx={{ color: "text.secondary" }}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", minHeight: 500 }}>
            {/* Left */}
            <Box sx={{ flex: 1, px: 4, py: 3.5, borderRight: "1px solid", borderColor: "divider" }}>
              <Box
                onClick={() => coverInputRef.current?.click()}
                sx={{
                  height: 190, bgcolor: coverImage ? "transparent" : "grey.50",
                  border: "2px dashed", borderColor: coverImage ? "transparent" : "grey.300",
                  borderRadius: 2.5, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", cursor: "pointer",
                  overflow: "hidden", mb: 3,
                  transition: "border-color 0.2s, background 0.2s",
                  "&:hover": { borderColor: "primary.main", bgcolor: coverImage ? "transparent" : "primary.50" },
                }}
              >
                {coverImage
                  ? <Box component="img" src={coverImage} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <Stack alignItems="center" spacing={1}><AddPhotoAlternate sx={{ fontSize: 36, color: "text.disabled" }} /><Typography variant="body2" color="text.secondary" textAlign="center" sx={{ px: 2, maxWidth: 280 }}>Click to add a cover image</Typography></Stack>
                }
              </Box>
              <input type="file" ref={coverInputRef} style={{ display: "none" }} accept="image/*" onChange={handleCoverFileChange} />

              <Box sx={{ mb: 2.5 }}>
                <InputBase
                  fullWidth placeholder="Write a preview title"
                  value={previewTitle}
                  onChange={(e) => { setPreviewTitle(e.target.value.slice(0, 100)); setTitleError(false); }}
                  sx={{ fontWeight: 700, fontSize: "1.05rem", pb: 0.75, borderBottom: "2px solid", borderColor: titleError ? "error.main" : "#e2e8f0", "& input::placeholder": { color: titleError ? "error.light" : "#94a3b8", fontWeight: 600 }, transition: "border-color 0.2s" }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                  <Typography variant="caption" color="error" sx={{ minHeight: 18 }}>{titleError ? "A title is required to publish" : ""}</Typography>
                  <Typography variant="caption" color={previewTitle.length > 80 ? "warning.main" : "text.disabled"}>{previewTitle.length}/100</Typography>
                </Box>
              </Box>

              <Box>
                <InputBase
                  fullWidth placeholder="Write a preview subtitle…"
                  value={previewSubtitle} multiline
                  onChange={(e) => setPreviewSubtitle(e.target.value.slice(0, 140))}
                  sx={{ fontSize: "0.95rem", pb: 0.75, color: "text.secondary", borderBottom: "1px solid #e2e8f0", alignItems: "flex-start", transition: "border-color 0.2s" }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
                  <Typography variant="caption" color={previewSubtitle.length > 110 ? "warning.main" : "text.disabled"}>{previewSubtitle.length}/140</Typography>
                </Box>
              </Box>

              <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 3, lineHeight: 1.6 }}>
                Changes here affect how the story appears in feeds and search — not the story content itself.
              </Typography>
            </Box>

            {/* Right */}
            <Box sx={{ width: 340, px: 4, py: 4, display: "flex", flexDirection: "column", gap: 3, bgcolor: "#fafafa" }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>Topics</Typography>
                <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontSize: "0.825rem", lineHeight: 1.5 }}>Add up to 5 topics to help readers discover your story.</Typography>
                <InputBase
                  fullWidth placeholder={topics.length >= 5 ? "Limit reached" : "Add a topic…"}
                  value={topicInput} disabled={topics.length >= 5}
                  onChange={(e) => setTopicInput(e.target.value)} onKeyDown={handleAddTopic}
                  sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 1, fontSize: "0.9rem", bgcolor: "background.paper", mb: 2, transition: "all 0.2s", "&:focus-within": { borderColor: "primary.main", boxShadow: "0 0 0 2px rgba(24,24,27,0.05)" } }}
                />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {topics.map((t) => <Chip key={t} label={t} size="small" onDelete={() => setTopics(topics.filter((x) => x !== t))} sx={{ borderRadius: 1, fontSize: "0.8rem", fontWeight: 600, bgcolor: "rgba(0,0,0,0.05)", border: "none", "& .MuiChip-deleteIcon": { fontSize: 14 } }} />)}
                </Stack>
              </Box>
              
              <Box sx={{ mt: "auto", pt: 2 }}>
                <Button fullWidth variant="contained" onClick={handlePublishClick}
                  sx={{ borderRadius: 1.5, py: 1.2, fontWeight: 700, textTransform: "none", fontSize: "0.95rem", boxShadow: "none", bgcolor: previewTitle.trim() ? "#18181b" : undefined, "&:hover": { boxShadow: "none", bgcolor: previewTitle.trim() ? "#000000" : undefined } }}
                >
                  Publish now
                </Button>

              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </SideBarLayout>
  );
}

export default Blog;
