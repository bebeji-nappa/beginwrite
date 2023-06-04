import React, { useCallback, useEffect, useState } from "react";
import styled from 'styled-components';

type Heading = {
  size: number;
  children: React.ReactNode;
}

const Text = styled.h1``;

const HeadingText = ({ size, children }: Heading) => {
  const [style, setStyle] = useState('');
  const textSize = useCallback(() => {
    switch (size) {
      case 1:
        return 'text-6xl'
      case 2:
        return 'text-5xl'
      case 3:
        return 'text-5xl'
      case 4:
        return 'text-4xl'
      case 5:
        return 'text-3xl'
      case 6:
        return 'text-2xl'
      default:
        return ''
    }
  }, [size])

  useEffect(() => {
    const style = textSize();
    setStyle(style);
  }, [])

  return (
    <Text className={style}>
      {children}
    </Text>
  )
}

export default HeadingText;
