import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link
        href="/"
        className="nm-protrude px-4 py-2 rounded-xl bg-gray-200 hover:nm-dent"
      >
        Return Home
      </Link>
    </div>
  );
}
