import { useEffect, useRef, useState, useCallback } from "react";
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
  Tooltip,
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
  FiberManualRecord,
  Link as LinkIcon,

} from "@mui/icons-material";
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import SideBarLayout from "../layout/SideBarLayout";

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

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-link-preview": "" }, HTMLAttributes)];
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

// ─── Toolbar helpers ─────────────────────────────────────────────────────────

const ToolBtn = ({ title, onClick, active, children }) => (
  <Tooltip title={title} arrow>
    <IconButton
      size="small"
      onClick={onClick}
      sx={{
        borderRadius: 1.5,
        width: 32,
        height: 32,
        color: active ? "primary.contrastText" : "text.secondary",
        bgcolor: active ? "primary.main" : "transparent",
        "&:hover": { bgcolor: active ? "primary.dark" : "action.hover" },
        transition: "all 0.15s",
      }}
    >
      {children}
    </IconButton>
  </Tooltip>
);

const ToolGroup = ({ children }) => (
  <Stack direction="row" alignItems="center" gap={0.25}>{children}</Stack>
);

const Sep = () => (
  <Divider orientation="vertical" flexItem sx={{ mx: 0.75, height: 20, alignSelf: "center" }} />
);

// ─── MenuBar ─────────────────────────────────────────────────────────────────

const MenuBar = ({ editor, onAddImage, onAddLink }) => {
  if (!editor) return null;

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
      }}
    >
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
      <ToolBtn title="Insert Image" onClick={onAddImage}>
        <ImageIcon sx={{ fontSize: 16 }} />
      </ToolBtn>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
};

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
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewSubtitle, setPreviewSubtitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [topicInput, setTopicInput] = useState("");
  const [topics, setTopics] = useState([]);
  const [titleError, setTitleError] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const insertLinkPreview = useCallback(async (editor, url) => {
    const meta = await fetchLinkPreview(url);
    editor.chain().focus().insertContent({
      type: "linkPreview",
      attrs: { url, loading: false, ...meta },
    }).run();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      ImageResizeExtension,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      CodeBlockLowlight.configure({ lowlight }),
      LinkPreviewNode,
    ],
    content: "<p>Start writing your blog...</p>",
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
    const saved = localStorage.getItem("blog-draft");
    if (saved) {
      try { editor.commands.setContent(JSON.parse(saved)); } catch {}
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    const id = setInterval(() => {
      localStorage.setItem("blog-draft", JSON.stringify(editor.getJSON()));
      setSavedAt(new Date());
    }, 3000);
    return () => clearInterval(id);
  }, [editor]);

  if (!editor) return null;

  const addImage = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => editor.chain().focus().setImage({ src: ev.target.result }).run();
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
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

  const handlePublishClick = () => {
    if (!previewTitle.trim()) { setTitleError(true); return; }
    setTitleError(false);
    console.log("PUBLISH:", { previewTitle, previewSubtitle, coverImage, topics, content: editor.getJSON() });
    setPublishOpen(false);
  };

  const savedLabel = savedAt
    ? `Saved at ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : "Saving…";

  const header = (
    <Stack spacing={0.5}>
      <Typography variant="h5" fontWeight={700}>Blog Editor</Typography>
      <Typography variant="body2" color="text.secondary">Write and publish blog posts with rich formatting.</Typography>
    </Stack>
  );

  return (
    <SideBarLayout header={header}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", bgcolor: "#f5f6f8" }}>

        <MenuBar editor={editor} onAddImage={addImage} onAddLink={() => setLinkDialogOpen(true)} />

        {/* Writing area */}
        <Box sx={{ flex: 1, overflow: "auto", py: 4, px: 2 }} onClick={() => editor.commands.focus()}>
          <Box
            sx={{
              maxWidth: 780,
              mx: "auto",
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              p: { xs: 3, md: 5 },
              minHeight: 480,
              "& .tiptap": {
                outline: "none",
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontSize: "1.1rem",
                lineHeight: 1.85,
                color: "text.primary",
                "& p.is-editor-empty:first-of-type::before": {
                  color: "#c0c4cc",
                  content: "attr(data-placeholder)",
                  float: "left",
                  height: 0,
                  pointerEvents: "none",
                  fontStyle: "italic",
                },
                "& h1": { fontFamily: "Inter, sans-serif", fontSize: "2.2rem", fontWeight: 800, lineHeight: 1.2, mt: 0, mb: "0.5em" },
                "& h2": { fontFamily: "Inter, sans-serif", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.3, mt: "1.5em", mb: "0.4em" },
                "& h3": { fontFamily: "Inter, sans-serif", fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.4, mt: "1.25em", mb: "0.4em" },
                "& p": { mt: 0, mb: "1em" },
                "& ul, & ol": { paddingInlineStart: "1.6rem", mb: "1em" },
                "& li": { mb: "0.3em" },
                "& a": { color: "#6366f1", textDecoration: "underline", textUnderlineOffset: "3px", "&:hover": { color: "#4f46e5" } },
                "& blockquote": {
                  borderLeft: "4px solid #6366f1",
                  ml: 0, pl: "1.25em", pr: "1em", py: "0.25em", my: "1.5em",
                  fontStyle: "italic", color: "text.secondary",
                  bgcolor: "rgba(99,102,241,0.04)", borderRadius: "0 8px 8px 0",
                },
                "& pre": {
                  background: "#0f1117", color: "#e2e8f0",
                  fontFamily: "'JetBrains Mono','Fira Code',monospace",
                  fontSize: "0.88rem", padding: "1.25rem 1.5rem",
                  borderRadius: "10px", overflowX: "auto", my: "1.5em", lineHeight: 1.7,
                  "& code": { color: "inherit", padding: 0, background: "none" },
                },
                "& code": {
                  background: "rgba(99,102,241,0.08)", color: "#6366f1",
                  padding: "0.15em 0.45em", borderRadius: "5px",
                  fontSize: "0.88em", fontFamily: "'JetBrains Mono',monospace",
                },
                "& img": { maxWidth: "100%", height: "auto", borderRadius: "10px", display: "block", my: "1.5em" },
                "& hr": { border: 0, borderTop: "2px solid", borderColor: "divider", my: "2.5em" },
              },
            }}
          >
            <EditorContent editor={editor} />
          </Box>
        </Box>

        {/* Status bar */}
        <Box sx={{ px: 3, py: 1, borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <FiberManualRecord sx={{ fontSize: 8, color: "success.main" }} />
            <Typography variant="caption" color="text.secondary">{savedLabel}</Typography>
          </Stack>
          <Button
            variant="contained" size="small"
            onClick={() => setPublishOpen(true)}
            sx={{ borderRadius: 99, px: 3, py: 0.75, fontWeight: 600, textTransform: "none", fontSize: "0.85rem", boxShadow: "none", bgcolor: "#111827", "&:hover": { bgcolor: "#1f2937", boxShadow: "none" } }}
          >
            Publish
          </Button>
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
            <Box sx={{ width: 320, px: 3.5, py: 3.5, display: "flex", flexDirection: "column", gap: 2.5, bgcolor: "#fafafa" }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>Topics</Typography>
                <Typography variant="body2" color="text.secondary" mb={1.5} sx={{ fontSize: "0.82rem" }}>Add up to 5 topics to help readers discover your story.</Typography>
                <InputBase
                  fullWidth placeholder={topics.length >= 5 ? "Limit reached" : "Add a topic and press Enter…"}
                  value={topicInput} disabled={topics.length >= 5}
                  onChange={(e) => setTopicInput(e.target.value)} onKeyDown={handleAddTopic}
                  sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5, px: 1.5, py: 0.75, fontSize: "0.88rem", bgcolor: "background.paper", mb: 1.5, transition: "border-color 0.2s" }}
                />
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {topics.map((t) => <Chip key={t} label={t} size="small" onDelete={() => setTopics(topics.filter((x) => x !== t))} sx={{ borderRadius: 1, fontSize: "0.8rem" }} />)}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>Publication</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.82rem" }}>Your story will be published to your profile and listed in connected feeds.</Typography>
              </Box>

              <Box sx={{ mt: "auto", pt: 1 }}>
                <Button fullWidth variant="contained" onClick={handlePublishClick}
                  sx={{ borderRadius: 99, py: 1, fontWeight: 700, textTransform: "none", fontSize: "0.9rem", boxShadow: "none", bgcolor: previewTitle.trim() ? "#111827" : undefined, "&:hover": { boxShadow: "none", bgcolor: previewTitle.trim() ? "#1f2937" : undefined } }}
                >
                  Publish now
                </Button>
                <Button fullWidth variant="text" sx={{ mt: 1, borderRadius: 99, textTransform: "none", fontSize: "0.85rem", color: "text.secondary" }}>
                  Schedule for later
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
