import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

const Form = () => {
  const [text, setText] = useState([{ wallet: "", amount: "" }]);
  const [counter, setCounter] = useState(0);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const newData = result.data.map((item) => ({
          wallet: item.wallet || "",
          amount: item.amount || "",
        }));
        setText(newData);
        calculateCounter(newData);
      },
    });
  };

  const calculateCounter = (data) => {
    const counterAmount = data.reduce((acc, item) => {
      if (item.amount && item.amount !== "USD") {
        return acc + parseFloat(item.amount);
      }
      return acc;
    }, 0);
    setCounter(counterAmount);
  };

  const addText = () => {
    setText([...text, { wallet: "", amount: "" }]);
  };

  const removeRow = (index) => {
    const updatedtext = [...text];
    updatedtext.splice(index, 1);
    setText(updatedtext);
    calculateCounter(updatedtext);
  };

  const handleInputChange = (index, field, value) => {
    const updatedtext = [...text];
    updatedtext[index][field] = value;
    setText(updatedtext);
    calculateCounter(updatedtext);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv",
  });

  return (
    <div>
      <div
        {...getRootProps()}
        
      >
        <input {...getInputProps()} />
      </div>

      
        
        <div>
          {text.map((row, index) => (
            <div key={index}>
              <div>
                <input
                placeholder="Wallet Adress"
                  type="text"
                  value={row.wallet}
                  onChange={(e) =>
                    handleInputChange(index, "wallet", e.target.value)
                  }
                />
              </div>
              <div>
                <input
                placeholder="Amount"
                  type="text"
                  value={row.amount}
                  onChange={(e) =>
                    handleInputChange(index, "amount", e.target.value)
                  }
                />
              </div>
              <div>
                <button onClick={() => removeRow(index)}>Remove Row</button>
              </div>
            </div>
          ))}
        </div>
      

      <div>
        <p>counter: {counter}</p>
        <button onClick={addText}>Add New Wallet</button>
      </div>
    </div>
  );
};

export default Form;
