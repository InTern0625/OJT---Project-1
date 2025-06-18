const SplashArt = () => {
  return (
    <>
      <svg
        viewBox="0 0 960 540"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute inset-0"
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="100"
          className="text-gray-700 opacity-25"
        >
          <circle r="234" cx="196" cy="23"></circle>
          <circle r="234" cx="790" cy="491"></circle>
        </g>
      </svg>
      <svg
        viewBox="0 0 220 192"
        width="220"
        height="192"
        fill="none"
        className="absolute -top-16 -right-16 text-gray-700"
      >
        <defs>
          <pattern
            id="837c3e70-6c3a-44e6-8854-cc48c737b659"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
          </pattern>
        </defs>
        <rect
          width="220"
          height="192"
          fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
        ></rect>
      </svg>
      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-5xl leading-none font-bold text-gray-100">
          <div>Welcome to</div>
          <div>WiseCare Providers Inc.</div>
        </div>
        <div className="mt-6 text-lg leading-6 tracking-tight text-gray-400">
          <p>
            Empowering your health, securing your future. Join us to access
            comprehensive healthcare solutions tailored just for you. Together,
            we can achieve wellness and peace of mind.
          </p>
        </div>
      </div>
    </>
  )
}

export default SplashArt
