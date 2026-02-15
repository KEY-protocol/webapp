import type { IconProps } from '../types';

export const TokenIcon = ({
  className = '',
  fill = 'currentColor',
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1177.1 1175.81"
    className={className}
    fill={fill}
  >
    <path
      fill={fill}
      d="M 546.8 1.3 C 92 29.9 -156.1 556.4 108.2 929.2 c 248.7 350.7 783.9 322.4 993.1 -53 C 1329.6 466.4 1012.3 -28.1 546.8 1.3 Z M 849.9 534 v 109.8 h -224.2 l 226.4 311.5 h -135.6 l -187.2 -253.3 v 253.3 h -109.8 v -305.9 c 0 -0.7 -3 -3.4 -2.2 -5.6 h -94.2 v -109.8 h 93 l 1.2 -306.9 l 109.7 -4.6 l 3.3 253.3 l 177.3 -244.1 l 8.8 -9.1 h 135.6 l -228.7 311.5 h 226.4 Z"
    />
  </svg>
);
