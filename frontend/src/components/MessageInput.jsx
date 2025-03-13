import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X, Image, Send } from "lucide-react";
import { toast } from "react-toastify";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file", {
        className: "bg-error text-white",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    if (!selectedUser?._id) {
      toast.error("No user selected", {
        className: "bg-error text-white",
      });
      return;
    }

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form after successful send
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log("Failed to send message: ", error);
    }
  };

  return (
    <div className="sticky bottom-0 p-4 border-t border-base-300 bg-base-100">
      <div className="p-4 border-t border-base-300 bg-base-100">
        {imagePreview && (
          <div className="mb-4 relative w-32 h-32 mx-auto">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-base-content"
            >
              <Image className="size-5" />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <button
            type="submit"
            disabled={!text.trim() && !imagePreview}
            className={`btn btn-primary ${
              !text.trim() && !imagePreview ? "btn-disabled" : ""
            }`}
          >
            <Send className="size-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageInput;
