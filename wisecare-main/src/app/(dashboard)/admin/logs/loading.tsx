const LogsLoading = () => {
  return (
    <div className="flex w-full flex-row">
      <div className="border-border absolute -left-[600px] z-20 h-[calc(100vh-64px)] w-full border-r bg-white transition-all duration-1000 sm:-left-96 sm:w-96 md:-left-24 md:-z-10 lg:relative lg:left-0 lg:z-20">
        <div className="flex flex-row items-center justify-start px-8 py-9">
          <h2 className="text-3xl font-extrabold">Activity Logs</h2>
        </div>
      </div>
    </div>
  )
}

export default LogsLoading
