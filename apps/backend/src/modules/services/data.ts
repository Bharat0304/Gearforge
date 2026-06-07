import axios from 'axios';
export async function fetchData(data: any){
    const response = await axios.post('http://127.0.0.1:8000/render', data);
    return response.data;
}

export async function generateVideo(data: any){
    const response = await axios.post('http://127.0.0.1:8000/generate-video', data);
    return response.data;
}