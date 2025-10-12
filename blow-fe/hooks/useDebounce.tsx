// "use effect";

// import { useState, useEffect } from "react";

// export default function useDebounce(value: any, delay: any) {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     if (!value) return;

//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value]);

//   return debouncedValue;
// }
