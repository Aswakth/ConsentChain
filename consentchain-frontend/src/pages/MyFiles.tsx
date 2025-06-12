import "../styles/background.css";

function MyFiles() {
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
      <div className="relative w-screen h-screen overflow-hidden text-white">
        {/* 1. Animated grid background from CSS */}
        <div className="absolute inset-0 z-0 bg-transparent" />

        {/* 3. Main content */}
        <div className="relative z-10 flex flex-col items-center w-full h-full overflow-hidden py-[20px]">
          <h1 className="text-3xl font-medium text-center mt-12 mb-8">
            My Files
          </h1>

          {/* 4. Glass container */}
          <div className="backdrop-blur-md bg-white/10 border border-white/10 rounded-2xl shadow-2xl w-screen max-w-7xl min-h-[500px] px-10 py-12 flex flex-col justify-start items-center">
            {/* 5. Scrollable list container */}
            <div className="w-full max-w-[1200px] bg-gradient-to-t from-[#000000] to-[#181818] border border-[#1b1b1b] rounded-2xl p-10 shadow-2xl min-h-[400px] max-h-[500px] overflow-y-auto scrollbar-thin">
              <div className="flex flex-col gap-5 w-full px-[75px] mx-auto">
                {[1, 2, 3, 4, 5, 6, 7].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full bg-[#111] border border-gray-700 rounded-2xl p-6 shadow-lg flex flex-col gap-4 hover:bg-[#1a1a1a] transition"
                  >
                    {/* File Header */}
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-lg">
                        📄 dummy_file_{idx + 1}.pdf
                      </div>
                    </div>

                    {/* Log Section */}
                    <div className="bg-[#181818] border border-gray-800 rounded-xl p-4">
                      <h2 className="text-sm font-semibold text-gray-300 mb-2">
                        Access Log
                      </h2>
                      <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                        <li>Viewed by alice@example.com on 2024-12-01</li>
                        <li>Downloaded by bob@example.com on 2024-12-02</li>
                        <li>Permission changed on 2024-12-03</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyFiles;
