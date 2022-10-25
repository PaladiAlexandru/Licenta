export function check(array, id) {
 
    array.forEach(element => {
       
        if (element.id == id)
            console.log("cacaaat: " + element);
            return element;
            
    });
    
    return "";
  }