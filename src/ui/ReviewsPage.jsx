import React, { useMemo, useState } from "react";

/** Simple star icon (filled/half/outline) */
const Star = ({ fill = 0, className = "w-6 h-6" }) => {

  return (
    <svg viewBox="0 0 24 24" className={className}>
      <defs>
        <linearGradient id={`grad-${fill}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fill * 100}%`} stopColor="#F97316" />
          <stop offset={`${fill * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={`url(#grad-${fill})`}
        stroke="#F97316"
        strokeWidth="1"
      />
    </svg>
  );
};

const Stars = ({ value, size = "w-6 h-6" }) => {
  const fills = useMemo(() => {
    const full = Math.floor(value);
    const decimal = value - full;
    return Array.from({ length: 5 }).map((_, i) => {
      if (i < full) return 1; // full
      if (i === full) return decimal; // partial
      return 0; // empty
    });
  }, [value]);

  return (
    <div className="flex gap-1">
      {fills.map((f, i) => (
        <Star key={i} fill={f} className={size} />
      ))}
    </div>
  );
};

export default function ReviewsPage() {
  // Summary
  const totalReviews = 122;
  const avgRating = 4.6;
  const distribution = { 5: 0.81, 4: 0.09, 3: 0.0, 2: 0.02, 1: 0.08 };

  // Example reviews list (replace with your API data)
  const reviews = [
    { id: 1, title: "test", body: "fdgfdg", name: "anjali", rating: 4, date: "2025-08-20", verified: false },
    { id: 2, title: "Classic Visiting Cards", body: "superb", name: "anant j.", rating: 5, date: "2025-08-18", verified: true },
    { id: 3, title: "Great Job!", body: "Loved it", name: "saakshi s.", rating: 5, date: "2025-08-17", verified: true },
  ];

  // Left filter (radio)
  const [filter, setFilter] = useState(null);

  // Modal
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", title: "", rating: 0, review: "", anonymous: false });

  // Top toolbar controls (for "Reviewed by ... customers" section)
  const [q, setQ] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all"); // all | 5..1
  const [sortBy, setSortBy] = useState("recent"); // recent | high | low

  const filtered = useMemo(() => {
    let out = [...reviews];

    const needle = q.trim().toLowerCase();
    if (needle) {
      out = out.filter(
        (r) =>
          r.title?.toLowerCase().includes(needle) ||
          r.body?.toLowerCase().includes(needle) ||
          r.name?.toLowerCase().includes(needle)
      );
    }
    if (ratingFilter !== "all") {
      const n = Number(ratingFilter);
      out = out.filter((r) => r.rating === n);
    }
    out.sort((a, b) => {
      if (sortBy === "recent") return new Date(b.date) - new Date(a.date);
      if (sortBy === "high") return b.rating - a.rating || new Date(b.date) - new Date(a.date);
      if (sortBy === "low") return a.rating - b.rating || new Date(b.date) - new Date(a.date);
      return 0;
    });

    // Also respect the left radio filter if selected
    if (filter) out = out.filter((r) => r.rating === filter);

    return out;
  }, [reviews, q, ratingFilter, sortBy, filter]);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("SUBMIT REVIEW →", form);
    setOpen(false);
    setForm({ name: "", title: "", rating: 0, review: "", anonymous: false });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1100px] mx-auto">
        {/* Top: Reviews summary (left column) */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">Reviews</h2>

            <div className="mt-4 flex items-center gap-2">
              <Stars value={avgRating} size="w-6 h-6" />
              <span className="text-gray-900 font-medium">
                {avgRating} <span className="text-gray-500">({totalReviews})</span>
              </span>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="mt-6 w-full rounded-xl border border-gray-300 py-3 text-gray-900 font-medium hover:bg-gray-50"
            >
              Write a Review
            </button>

            {/* Left-side "Filter By" radios */}
            <div className="mt-10">
              <div className="text-xl font-semibold text-gray-900">Filter By</div>
              <ul className="mt-6 space-y-5">
                {[5, 4, 3, 2, 1].map((star) => (
                  <li key={star} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="rating-filter"
                      className="w-5 h-5 accent-orange-500"
                      checked={filter === star}
                      onChange={() => setFilter(filter === star ? null : star)}
                    />
                    <div className="flex items-center gap-2">
                      <Stars value={star} />
                      <span className="text-gray-900">{star} stars</span>
                      <span className="text-gray-500">
                        ({Math.round(distribution[star] * 100)}%)
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right side left intentionally empty to match your screenshot */}
          <div></div>
        </div>

        {/* === BELOW: "Reviewed by {total} customers" with Search / Filter / Sort + list === */}
        <section className="border-t mt-8 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-2xl md:text-[28px] font-semibold text-gray-900">
              Reviewed by {totalReviews} customers
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Search */}
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search reviews"
                  className="w-[320px] max-w-full rounded-2xl border border-gray-300 py-2.5 pl-4 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">🔍</span>
              </div>

              {/* Filter By */}
              <div className="relative">
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-[160px] rounded-2xl border border-gray-300 py-2.5 pl-4 pr-9 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="all">All ratings</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-[160px] rounded-2xl border border-gray-300 py-2.5 pl-4 pr-9 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <option value="recent">Most recent</option>
                  <option value="high">Highest rating</option>
                  <option value="low">Lowest rating</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div className="mt-6 divide-y">
            {filtered.map((r) => (
              <article key={r.id} className="py-6">
                <div className="flex items-center gap-2">
                  <Stars value={r.rating} />
                  <span className="text-gray-900 font-medium">{r.rating}</span>
                </div>

                <h4 className="mt-1 text-lg font-semibold text-gray-900">{r.title}</h4>

                <div className="mt-2 text-sm text-gray-500">
                  {new Date(r.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  | {r.name}
                  {r.verified && (
                    <span className="ml-2 inline-flex items-center gap-1 text-gray-600">
                      <span className="text-blue-600">✔</span> Verified Buyer
                    </span>
                  )}
                </div>

                <p className="mt-4 text-gray-800">{r.body}</p>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-500">No reviews match your filters.</div>
            )}
          </div>
        </section>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">Write a Review</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close">
                ✕
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={onSubmit}>
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setForm((f) => ({ ...f, rating: n }))}
                      className="focus:outline-none"
                      aria-label={`${n} star`}
                    >
                      <Star type={form.rating >= n ? "full" : "empty"} className="w-7 h-7" />
                    </button>
                  ))}
                  {form.rating > 0 && <span className="text-sm text-gray-600 ml-1">{form.rating} / 5</span>}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Great quality and fast delivery"
                  required
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  rows={5}
                  value={form.review}
                  onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="Share details about quality, packaging, speed, etc."
                  required
                />
              </div>

              {/* Name + anonymous */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    placeholder="John D."
                    required
                    disabled={form.anonymous}
                  />
                </div>
                <label className="flex items-center gap-2 mt-7">
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-orange-500"
                    checked={form.anonymous}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        anonymous: e.target.checked,
                        name: e.target.checked ? "" : f.name,
                      }))
                    }
                  />
                  <span className="text-sm text-gray-700">Post as anonymous</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-gray-900 px-5 py-2 text-white hover:bg-black" disabled={form.rating === 0}>
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
