import React from 'react';

export const CartIcon: React.FC<{ size?: number; fill?: string; className?: string }> = ({
  size = 24,
  fill = "currentColor",
  className = "",
}) => (
  <svg
    className={className}
    fill={fill}
    height={size}
    viewBox="0 0 24 24"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.5 5H3.75C3.33579 5 3 5.33579 3 5.75C3 6.16421 3.33579 6.5 3.75 6.5H4.5C5.49459 6.5 6.29909 7.30628 6.29998 8.30087L6.3 8.5H19.5C20.3284 8.5 21 9.17157 21 10V12C21 12.8284 20.3284 13.5 19.5 13.5H8.25C7.83579 13.5 7.5 13.8358 7.5 14.25C7.5 14.6642 7.83579 15 8.25 15H19.5C21.1569 15 22.5 13.6569 22.5 12V10C22.5 8.34315 21.1569 7 19.5 7H7.79998L7.80002 6.69913C7.80137 5.47734 6.81799 4.49213 5.59619 4.5H3.75C2.50736 4.5 1.5 5.50736 1.5 6.75C1.5 7.99264 2.50736 9 3.75 9H4.5C4.91421 9 5.25 8.66421 5.25 8.25C5.25 7.83579 4.91421 7.5 4.5 7.5H3.75C3.33579 7.5 3 7.16421 3 6.75C3 6.33579 3.33579 6 3.75 6H4.5C4.91421 6 5.25 5.66421 5.25 5.25C5.25 4.83579 4.91421 4.5 4.5 4.5Z" />
    <path d="M7.5 18C7.5 16.6193 8.61929 15.5 10 15.5C11.3807 15.5 12.5 16.6193 12.5 18C12.5 19.3807 11.3807 20.5 10 20.5C8.61929 20.5 7.5 19.3807 7.5 18Z" />
    <path d="M16.5 18C16.5 16.6193 17.6193 15.5 19 15.5C20.3807 15.5 21.5 16.6193 21.5 18C21.5 19.3807 20.3807 20.5 19 20.5C17.6193 20.5 16.5 19.3807 16.5 18Z" />
</svg>
);