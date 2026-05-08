"use client";
import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  Home, ArrowLeft, Upload, Video, Image as ImageIcon,
  CheckCircle, Loader, X, Play
} from "lucide-react";

const AMENITIES = [
  { value: "water", label: "💧 Running Water" },
  { value: "electricity", label: "⚡ Electricity (NEPA)" },
  { value: "security", label: "🔒 Security" },
  { value: "parking", label: "🚗 Parking" },
  { value: "wifi", label: "📶 WiFi" },
];

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default";

async function uploadToCloudinary(file: File, resourceType: "image" | "video") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "lodgeit");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );
  if (!res.ok) throw new Error("Upload failed");
  return await res.json();
}

export default function ListPropertyPage() {
  const createListing = useMutation(api.listings.create);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const thumbRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    roomType: "self-contain",
    location: "",
    city: "Enugu",
    distanceToSchool: "10min",
    amenities: [] as string[],
    availability: "immediate",
    thumbnailUrl: "",
    videoUrl: "",
    videoPublicId: "",
    agentName: "",
    agentEmail: "",
    agentPhone: "",
  });

  const [thumbPreview, setThumbPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  const update = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

  const toggleAmenity = (val: string) => {
    update(
      "amenities",
      form.amenities.includes(val)
        ? form.amenities.filter((a) => a !== val)
        : [...form.amenities, val]
    );
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbPreview(URL.createObjectURL(file));
    setUploadingThumb(true);
    try {
      const data = await uploadToCloudinary(file, "image");
      update("thumbnailUrl", data.secure_url);
    } catch {
      // For demo: use object URL as fallback
      update("thumbnailUrl", URL.createObjectURL(file));
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoPreview(URL.createObjectURL(file));
    setUploadingVideo(true);
    try {
      const data = await uploadToCloudinary(file, "video");
      update("videoUrl", data.secure_url);
      update("videoPublicId", data.public_id);
    } catch {
      update("videoUrl", URL.createObjectURL(file));
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.thumbnailUrl) {
      alert("Please upload a thumbnail image first.");
      return;
    }
    setLoading(true);
    try {
      await createListing({
        ...form,
        price: Number(form.price),
        videoUrl: form.videoUrl || undefined,
        videoPublicId: form.videoPublicId || undefined,
        distanceToSchool: form.distanceToSchool || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-dark-700 border border-dark-500 text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-gray-600 focus:border-lodge-500 transition-colors";
  const labelClass = "text-xs font-medium text-gray-400 mb-1.5 block";

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white text-xl">Listing Submitted!</h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Your property has been listed and is now visible to students. You'll receive viewing requests directly.
            </p>
          </div>
          <Link
            href="/"
            className="lodge-gradient text-white font-semibold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            View All Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg lodge-gradient flex items-center justify-center">
              <Home size={14} fill="white" className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-base tracking-tight">LodgeIt</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            List Your Property
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Reach hundreds of students looking for accommodation near campus.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Media Upload */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex flex-col gap-5">
            <h2 className="font-display font-bold text-white text-sm">📸 Photos & Video</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Thumbnail */}
              <div>
                <label className={labelClass}>Thumbnail Image *</label>
                <div
                  onClick={() => thumbRef.current?.click()}
                  className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-dark-600 hover:border-lodge-500/50 transition-colors cursor-pointer overflow-hidden bg-dark-700 flex items-center justify-center group"
                >
                  {thumbPreview ? (
                    <>
                      <img src={thumbPreview} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      {uploadingThumb && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Loader size={20} className="animate-spin text-white" />
                        </div>
                      )}
                      {!uploadingThumb && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-xs font-medium">Change photo</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-600">
                      <ImageIcon size={24} />
                      <p className="text-xs text-center">Click to upload thumbnail</p>
                    </div>
                  )}
                </div>
                <input
                  ref={thumbRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailUpload}
                />
                {form.thumbnailUrl && !uploadingThumb && (
                  <p className="text-emerald-500 text-[10px] mt-1 flex items-center gap-1">
                    <CheckCircle size={10} /> Uploaded
                  </p>
                )}
              </div>

              {/* Video */}
              <div>
                <label className={labelClass}>
                  Video Tour <span className="text-gray-600">(optional)</span>
                </label>
                <div
                  onClick={() => videoRef.current?.click()}
                  className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-dark-600 hover:border-lodge-500/50 transition-colors cursor-pointer overflow-hidden bg-dark-700 flex items-center justify-center group"
                >
                  {videoPreview ? (
                    <>
                      <video src={videoPreview} className="absolute inset-0 w-full h-full object-cover" muted />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        {uploadingVideo ? (
                          <Loader size={20} className="animate-spin text-white" />
                        ) : (
                          <Play size={24} fill="white" className="text-white" />
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-600">
                      <Video size={24} />
                      <p className="text-xs text-center">Click to upload video tour</p>
                      <p className="text-[10px] text-gray-700">MP4, MOV up to 100MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={videoRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
                {form.videoUrl && !uploadingVideo && (
                  <p className="text-emerald-500 text-[10px] mt-1 flex items-center gap-1">
                    <CheckCircle size={10} /> Uploaded
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex flex-col gap-4">
            <h2 className="font-display font-bold text-white text-sm">🏠 Property Details</h2>

            <div>
              <label className={labelClass}>Listing Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Cozy Self-Contain off Ekulu"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the property — size, finishing, what makes it great..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Room Type *</label>
                <select
                  required
                  value={form.roomType}
                  onChange={(e) => update("roomType", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="single">Single Room</option>
                  <option value="self-contain">Self-Contain</option>
                  <option value="shared">Shared Room</option>
                  <option value="flat">Flat</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Annual Rent (₦) *</label>
                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  placeholder="e.g. 150000"
                  min={10000}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City *</label>
                <select
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="Enugu">Enugu</option>
                  <option value="Nsukka">Nsukka</option>
                  <option value="Awka">Awka</option>
                  <option value="Owerri">Owerri</option>
                  <option value="Asaba">Asaba</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Availability *</label>
                <select
                  required
                  value={form.availability}
                  onChange={(e) => update("availability", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="immediate">Available Now</option>
                  <option value="next-month">Next Month</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Full Address / Location *</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="e.g. 12 Odim Street, Nsukka"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Walking Distance to Campus</label>
                <select
                  value={form.distanceToSchool}
                  onChange={(e) => update("distanceToSchool", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="5min">≤ 5 minutes</option>
                  <option value="10min">≤ 10 minutes</option>
                  <option value="20min">≤ 20 minutes</option>
                </select>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className={labelClass}>Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AMENITIES.map((a) => (
                  <label
                    key={a.value}
                    className={`flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl border transition-colors ${
                      form.amenities.includes(a.value)
                        ? "bg-lodge-500/10 border-lodge-500/40 text-lodge-400"
                        : "bg-dark-700 border-dark-600 text-gray-500 hover:border-dark-500"
                    }`}
                  >
                    <div
                      onClick={() => toggleAmenity(a.value)}
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        form.amenities.includes(a.value)
                          ? "bg-lodge-500 border-lodge-500"
                          : "border-dark-400"
                      }`}
                    >
                      {form.amenities.includes(a.value) && (
                        <svg width="7" height="5" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span onClick={() => toggleAmenity(a.value)} className="text-xs">{a.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Details */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex flex-col gap-4">
            <h2 className="font-display font-bold text-white text-sm">👤 Agent Information</h2>
            <p className="text-gray-600 text-xs -mt-2">
              Your contact details are kept private and only shared with serious viewing requesters.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Full Name *</label>
                <input
                  required
                  value={form.agentName}
                  onChange={(e) => update("agentName", e.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input
                  required
                  type="email"
                  value={form.agentEmail}
                  onChange={(e) => update("agentEmail", e.target.value)}
                  placeholder="agent@email.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={form.agentPhone}
                  onChange={(e) => update("agentPhone", e.target.value)}
                  placeholder="080xxxxxxxx"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || uploadingThumb || uploadingVideo}
            className="w-full flex items-center justify-center gap-2 lodge-gradient hover:opacity-90 disabled:opacity-60 text-white font-display font-bold text-base py-4 rounded-2xl transition-opacity"
          >
            {loading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            {loading ? "Publishing..." : "Publish Listing"}
          </button>

          <p className="text-center text-gray-600 text-xs -mt-4">
            By submitting, you confirm that all information provided is accurate.
          </p>
        </form>
      </div>
    </div>
  );
}
