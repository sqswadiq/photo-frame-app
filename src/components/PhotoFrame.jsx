import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { MdAddPhotoAlternate } from "react-icons/md";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/CropImage";

export default function PhotoFrame() {
  const [photo, setPhoto] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [name, setName] = useState(""); // 🆕 Name input state

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const frame = new Image();
    frame.src = "/frame.webp";
    frame.onload = () => {
      canvas.width = 500;
      canvas.height = 500; 
      ctx.clearRect(0, 0, 500, 500);
      ctx.drawImage(frame, 0, 0, 500, 500);
    };
  }, []);

  useEffect(() => {
    if (!photo) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const baseImage = new Image();
    baseImage.src = photo;

    baseImage.onload = () => {
      const frame = new Image();
      frame.src = "/frame.webp";

      frame.onload = () => {
        canvas.width = 500;
        canvas.height = 500;
        ctx.clearRect(0, 0, 500, 500);

        const circleX = 255;
        const circleY = 235;
        const circleRadius = 130;

        // Draw circular clipped image
        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          baseImage,
          circleX - circleRadius,
          circleY - circleRadius,
          circleRadius * 2,
          circleRadius * 2
        );

        ctx.restore();

        // Draw frame on top
        ctx.drawImage(frame, 0, 0, 500, 500);

        // Draw user name below the image
        if (name.trim() !== "") {
          ctx.font = "bold 26px Arial";
          ctx.fillStyle = "#1e293b"; // slate-800
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
          ctx.shadowOffsetY = 1;
          ctx.shadowBlur = 1;
          ctx.fillText(name, 250, 410); //name below circle
        }
      };
    };
  }, [photo, name]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropDone = async () => {
    const croppedImage = await getCroppedImg(photo, croppedAreaPixels);
    setPhoto(croppedImage);
    setShowCropper(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "framed-photo.jpg";
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
    toast.success("Photo downloaded successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 px-5 overflow-hidden">
      <div className="bg-lime-50 rounded-xl shadow-xl p-4 sm:p-6 w-full max-w-md space-y-6">
        <div className="w-full flex justify-center">
          <canvas
            ref={canvasRef}
            width={500}
            height={550}
            className="w-full max-w-full border-2 border-slate-250 rounded shadow-md"
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <label
              htmlFor="fileUpload"
              className="cursor-pointer flex items-center justify-center w-full bg-red-100 text-stone-900 border border-red-300 font-medium py-2 rounded-lg hover:bg-red-200 transition"
            >
              <MdAddPhotoAlternate className="text-2xl text-stone-900" /> Choose
              Photo
            </label>
            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/*  Name input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />


          {photo && !showCropper && (
            <button
              onClick={handleDownload}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Download Photo
            </button>
          )}
        </div>
      </div>

      {showCropper && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-md h-[400px] sm:h-[450px]">
            <Cropper
              image={photo}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, cropped) => setCroppedAreaPixels(cropped)}
            />
            <button
              onClick={handleCropDone}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white px-4 py-2 rounded shadow-md hover:bg-blue-900 transition"
            >
              Crop & Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
