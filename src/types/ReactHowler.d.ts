declare module 'react-howler' {
    import * as React from 'react';
  
    export interface HowlerProps {
      src: string | string[];
      playing?: boolean;
      loop?: boolean;
      mute?: boolean;
      volume?: number;
      html5?: boolean;
      preload?: boolean;
      onEnd?: () => void;
      onPlay?: () => void;
      onPause?: () => void;
      onStop?: () => void;
      onLoad?: () => void;
      onLoadError?: () => void;
      onSeek?: () => void;
      format?: string[];
      // Add other props as needed
    }
  
    export default class Howl extends React.Component<HowlerProps> {}
  }
  