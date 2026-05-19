import { useRef, useState, useCallback, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ImagePlus, Send, Smile } from "lucide-react";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import { useThemeStore } from "../store/useThemeStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileRef = useRef(null);
  const emojiRef = useRef(null);
  const typingRef = useRef(null);
  const { theme } = useThemeStore();
  const { sendMessage, selectedUser, emitTyping, emitStopTyping } = useChatStore();

  // Close emoji picker on outside click
  useEffect(() => {
    const close = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) setShowEmoji(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleTyping = useCallback(() => {
    if (!selectedUser?._id) return;
    emitTyping(selectedUser._id);
    clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => emitStopTyping(selectedUser._id), 2000);
  }, [selectedUser, emitTyping, emitStopTyping]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    clearTimeout(typingRef.current);
    emitStopTyping(selectedUser._id);
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      setShowEmoji(false);
      if (fileRef.current) fileRef.current.value = "";
    } catch {}
  };

  const canSend = !!text.trim() || !!imagePreview;

  return (
    <div className="border-t border-border bg-card shrink-0">

      {/* ── Image preview strip (appears above input row) ── */}
      {imagePreview && (
        <div className="flex items-center gap-3 px-3 pt-3 pb-2 animate-fade-in">
          {/* Thumbnail */}
          <div className="relative shrink-0">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-xl border border-border shadow-sm"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Label */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">Image ready to send</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add a caption below, or send as-is
            </p>
          </div>
        </div>
      )}

      {/* ── Emoji picker ── */}
      {showEmoji && (
        <div ref={emojiRef} className="absolute bottom-[72px] left-4 z-50 animate-scale-in shadow-xl">
          <EmojiPicker
            onEmojiClick={(d) => setText((p) => p + d.emoji)}
            width={300}
            height={380}
            theme={theme === "dark" ? "dark" : "light"}
            searchPlaceholder="Search emoji..."
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      {/* ── Input row ── */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-3">

        {/* Emoji btn */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowEmoji(!showEmoji)}
          className={`rounded-full shrink-0 ${showEmoji ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
        >
          <Smile className="w-5 h-5" />
        </Button>

        {/* Text input */}
        <div className="relative flex-1">
          <Input
            placeholder={imagePreview ? "Add a caption..." : "Type a message..."}
            value={text}
            onChange={(e) => { setText(e.target.value); handleTyping(); }}
            className="text-sm pr-9"
          />
          {/* Image attach icon inside input */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors ${
              imagePreview ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Attach image"
          >
            <ImagePlus className="w-4 h-4" />
          </button>
          <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleImage} />
        </div>

        {/* Send btn — always visible, disabled when nothing to send */}
        <Button
          type="submit"
          size="icon"
          disabled={!canSend}
          title="Send message"
          className={`rounded-full shrink-0 transition-all duration-200 ${
            canSend ? "opacity-100 scale-100" : "opacity-30 scale-90 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
