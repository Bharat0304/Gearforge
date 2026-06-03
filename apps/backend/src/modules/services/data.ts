import axios from 'axios';
export async function fetchData(data: any){
    const response = await axios.post('http://localhost:8000/render', data);
    return response.data;
}

export async function generateVideo(data: any){
    const response = await axios.post('http://localhost:8000/generate-video', data);
    return response.data;
}