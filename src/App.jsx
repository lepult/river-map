import { useEffect, useState } from "react";
import Map from './Map';

const App = () => {
  const [inputGWK, setInputGWK] = useState(null);

  useEffect(() => {
    console.log("inputGWK", inputGWK);
  }, [inputGWK]);

  return (
    <div>
      <input
        style={{ zIndex: 1000, position: "absolute" }}
        name="myInput"
        onChange={(e) => {
          setInputGWK(e.target.value);
        }}
        value={inputGWK}
      />
      <Map/>
    </div>
  );
};

export default App;
