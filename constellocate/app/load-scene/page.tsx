import { StarfieldBackground } from "../src/components/star-background";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
    >
      <StarfieldBackground />

      <main className="flex flex-col items-center justify-center gap-6 relative z-50">
        {/* UIverse Loader */}
        <div className="container">
          <div className="moon">
            <div className="crater crater1"></div>
            <div className="crater crater2"></div>
            <div className="crater crater3"></div>
            <div className="crater crater4"></div>
            <div className="crater crater5"></div>
            <div className="shadow"></div>
            <div className="eye eye-l"></div>
            <div className="eye eye-r"></div>
            <div className="mouth"></div>
            <div className="blush blush1"></div>
            <div className="blush blush2"></div>
          </div>

          <div className="orbit">
            <div className="rocket">
              <div className="window"></div>
              <div className="fire"></div>
              <div className="gas"></div>
              <div className="gas"></div>
              <div className="gas"></div>
              <div className="gas"></div>
              <div className="gas"></div>
              <div className="gas"></div>
              <div className="gas"></div>
            </div>
          </div>

          <div className="curve">
            <svg viewBox="0 0 500 500">
              <path
                id="loading"
                d="M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97"
              ></path>
              <text width="500">
                <textPath xlinkHref="#loading">...loading...</textPath>
              </text>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Loading your constillations...
        </h1>
      </main>
    </div>
  );
}