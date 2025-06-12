import "../styles/background.css";

function SharedFiles() {
  return (
    <>
      <div className="absolute top-8 left-8 flex items-center gap-2 z-50">
        {/* Logo Icon */}
        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shadow-md">
          CC
        </div>

        {/* Logo Text */}
        <span className="text-white tracking wide font-clash text-xl font-medium tracking-wide">
          Consent<span className="text-white/60 px-0.5">Chain</span>
        </span>
      </div>

      <div className="w-screen h-screen flex flex-col items-center justify-center bg-transparent">
        <h1 className="text-3xl font-clash font-medium text-center mb-7">
          Shared Files
        </h1>

        <div className="w-screen max-w-7xl bg-gradient-to-t from-[#171717] to-[#303030] border border-gray-500 rounded-2xl p-10 shadow-2xl min-h-[500px] flex flex-col justify-start items-center">
          {/* Only this inner list scrolls */}
          <div className="w-full max-w-[1200px] bg-gradient-to-t from-[#000000] to-[#181818] border border-[#1b1b1b] rounded-2xl p-10 shadow-2xl min-h-[400px] max-h-[500px] overflow-y-auto scrollbar-thin">
            <div className="flex flex-col gap-5 w-full px-[75px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7].map((_, idx) => (
                <div
                  key={idx}
                  className="w-full bg-[#111] border border-gray-700 rounded-2xl p-6 shadow-lg flex items-center justify-between hover:bg-[#1a1a1a] transition"
                >
                  <div>
                    <div className="font-mono text-lg">
                      📄 dummy_file_{idx + 1}.pdf
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Shared by: user{idx + 1}@example.com
                    </div>
                  </div>

                  <button className="!bg-white text-black text-sm font-medium rounded-full px-4 py-2 shadow hover:bg-gray-200 transition">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SharedFiles;
