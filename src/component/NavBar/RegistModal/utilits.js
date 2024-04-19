export const handleFileChange = (e, setPhoto) => {
    const file = e.target.files[0]; 
    const reader = new FileReader(); 
    reader.onload = (event) => {
      const fileContent = event.target.result;
      setPhoto(fileContent); 
    };
    reader.readAsDataURL(file);
  };





