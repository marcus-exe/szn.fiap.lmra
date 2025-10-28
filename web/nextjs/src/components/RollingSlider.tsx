'use client';

export default function RollingSlider() {
  return (
    <>
      <div className="overflow-hidden border-y border-white/10">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="inline-block px-8 text-2xl font-semibold text-gray-300">
              现代化旧代码库的完整参考指南 •
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </>
  );
}

