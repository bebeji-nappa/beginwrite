import { useState, useEffect, useCallback } from "react"
import axios from 'axios';
import HeadingText from "@/components/atoms/HeadingText";

type Data = {
  data: string
}

export default function Home() {
  const [message, setMessage] = useState("");

  const helloHandle = useCallback(async () => {
    await axios.get('http://127.0.0.1:8000')
      .then(({ data }: Data) => {
        setMessage(data)
      });
  }, []);


  useEffect(() => {
    helloHandle();
  });

  return (
    <HeadingText size={1}>
      {message} + Next.js!
    </HeadingText>
  )
}
