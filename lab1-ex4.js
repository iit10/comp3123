
  
  /*Exercise 4: Angle Type*/
  function angle_Type(angle) {
    if (typeof angle !== "number" || angle <= 0 || angle > 180) {
      return "Invalid angle";
    }
    if (angle < 90) return "Acute angle";
    if (angle === 90) return "Right angle";
    if (angle < 180) return "Obtuse angle";
    return "Straight angle";
  }
  console.log(angle_Type(47));   
  console.log(angle_Type(90));   
  console.log(angle_Type(145));  
  console.log(angle_Type(180));  
  