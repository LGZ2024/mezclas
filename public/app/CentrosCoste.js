import {setPost,setPostVariedad} from "./postList.js"

async function centrosCoste(rancho){
    const dataArray = [];
        //CREAMOS CONDICION PARA para obtener el documento a modificar 
        
       const response=await fetchCC(rancho)
       setPost(response);
}
async function Variedades(centroCoste){
    const dataArray = [];
        //CREAMOS CONDICION PARA para obtener el documento a modificar 
        
        const response=await fetchVariedad(centroCoste)
        

        setPostVariedad(response);
}


//consulta de centro de costes por rancho
async function fetchCC(rancho) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };
    const response = await fetch(`/cc/${rancho}`,options);
    const data = await response.json();
    return data;
}

//consulta de centro de costes por rancho
async function fetchVariedad(centroCoste) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  };
    const response = await fetch(`/variedades/${centroCoste}`,options);
    const data = await response.json();
    return data;
}
export { centrosCoste,Variedades };