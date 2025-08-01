"use client";

export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
      id="background-desktop"
    >
      <div
        className="-top-32 -right-32 absolute opacity-90 blur-xl rounded-full w-[520px] h-[520px]"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, #e1bee7 0%, #ce93d8 50%, #ba68c8 70%, transparent 100%)",
        }}
      />
      <div
        className="bottom-0 left-0 absolute opacity-80 blur-lg rounded-full w-[380px] h-[380px]"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, #f8bbd0 0%, #f48fb1 40%, #e91e63 70%, transparent 100%)",
        }}
      />
      <div
        className="top-[58%] left-1/2 absolute opacity-70 blur-lg rounded-full w-[600px] h-[120px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, #ce93d8 10%, #f8bbd0 50%, #e1bee7 100%)",
        }}
      />
      <div
        className="top-1/2 left-1/2 absolute opacity-60 blur-2xl rounded-full w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, #e1bee7 0%, #ce93d8 30%, transparent 70%)",
        }}
      />
    </div>
  );
}
