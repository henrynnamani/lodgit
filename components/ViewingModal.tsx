"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { X, Calendar, CheckCircle, Loader } from "lucide-react";

interface ViewingModalProps {
  listingId: string;
  listingTitle: string;
  onClose: () => void;
}

export default function ViewingModal({ listingId, listingTitle, onClose }: ViewingModalProps) {
  const submitRequest = useMutation(api.viewingRequests.submitRequest);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    preferredDate: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitRequest({
        listingId: listingId as Id<"listings">,
        ...form,
      });
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-600">
          <div>
            <h2 className="font-display font-bold text-white text-base">Request a Viewing</h2>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{listingTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-base">Request Sent!</h3>
                <p className="text-gray-500 text-sm mt-1">
                  The agent will reach out to you soon to confirm your viewing.
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-lodge-500 hover:bg-lodge-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1.5 block">Full Name</label>
                  <input
                    required
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    placeholder="Your full name"
                    className="w-full bg-dark-700 border border-dark-500 text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-gray-600 focus:border-lodge-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
                  <input
                    required
                    type="email"
                    value={form.studentEmail}
                    onChange={(e) => setForm({ ...form, studentEmail: e.target.value })}
                    placeholder="you@email.com"
                    className="w-full bg-dark-700 border border-dark-500 text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-gray-600 focus:border-lodge-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Phone</label>
                  <input
                    required
                    type="tel"
                    value={form.studentPhone}
                    onChange={(e) => setForm({ ...form, studentPhone: e.target.value })}
                    placeholder="080xxxxxxxx"
                    className="w-full bg-dark-700 border border-dark-500 text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-gray-600 focus:border-lodge-500 transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1.5 block">Preferred Viewing Date</label>
                  <input
                    required
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-dark-700 border border-dark-500 text-white text-sm rounded-xl px-3.5 py-2.5 focus:border-lodge-500 transition-colors"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1.5 block">
                    Message <span className="text-gray-600">(optional)</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Any specific questions or requirements?"
                    rows={2}
                    className="w-full bg-dark-700 border border-dark-500 text-white text-sm rounded-xl px-3.5 py-2.5 placeholder:text-gray-600 focus:border-lodge-500 transition-colors resize-none"
                  />
                </div>
              </div>

              <p className="text-[11px] text-gray-600 -mt-1">
                Your contact details will only be shared with the agent once confirmed.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-lodge-500 hover:bg-lodge-600 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                {loading ? (
                  <Loader size={15} className="animate-spin" />
                ) : (
                  <Calendar size={15} />
                )}
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
