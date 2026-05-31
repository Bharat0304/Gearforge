import axios from 'axios';
export async function fetchData(data:any){
    const response = await axios.post('http://localhost:8000/render', data    );
    return response.data.json();
}