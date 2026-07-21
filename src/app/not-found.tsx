import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="reveal flex min-h-[50vh] flex-col items-center justify-center text-center">
      <Image
        src="/images/ouroboros.png"
        alt=""
        width={72}
        height={72}
        className="ouro opacity-60"
      />
      <h1 className="mt-8 font-pixel text-4xl lowercase">404</h1>
      <p className="mt-3 text-[13px] text-gray-500">this page ate itself.</p>
      <Link href="/" className="micro link mt-8 text-gray-500">
        ← back to index
      </Link>
    </div>
  );
}
