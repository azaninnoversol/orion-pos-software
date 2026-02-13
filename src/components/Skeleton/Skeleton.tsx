import React from "react";

const Skeleton = ({ className }: { className?: string }) => <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`} />;

export default React.memo(Skeleton);
