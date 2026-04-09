import React from 'react';
import clsx from 'clsx';
type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return <div className={clsx('animate-skeleton bg-gray-200 rounded-md', className)} {...props} />;
};

export default Skeleton;
