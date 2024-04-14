import Alert from "./components/Alert";
import Button from "./components/Button";
import { useState } from "react";

function App() {
  const colors = ["btn btn-primary", "btn btn-secondary", "btn btn-success"];
  const [alertVisible, setAlertVisible] = useState(false);

  return (
    <div>
      {alertVisible && (
        <Alert
          onClick={() => {
            setAlertVisible(false);
            console.log(alertVisible);
          }}
        >
          This is my alert.
        </Alert>
      )}
      <Button
        onClick={() => {
          setAlertVisible(true);
          console.log(alertVisible);
        }}
        colors={colors}
      >
        This is how many times you've clicked:{" "}
      </Button>
    </div>
  );
}

export default App;
