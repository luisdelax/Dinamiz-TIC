const NoAccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4 text-lg">You do not have permission to view this page.</p>
    </div>
  );
};

export default NoAccess;