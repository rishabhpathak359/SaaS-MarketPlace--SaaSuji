// const base_url = 'http://localhost:8000';
const base_url = 'https://sassujibackend.onrender.com';


export const fetchDataFromApiWithResponse = async (bodyData, api_endpoint) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
    };
    const res = await fetch(`${base_url}${api_endpoint}`, options);
    const data = await res.json();
    return data;
};

export const getDataFromApiWithResponse = async (queryData, api_endpoint) => {
    const queryParams = new URLSearchParams(queryData).toString();
    const url = `${base_url}${api_endpoint}?${queryParams}`;
    
    const options = { method: 'GET' };
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
};

export const fetchDataFromApiWithAuthorization = async (bodyData, api_endpoint) => {
    const url = `${base_url}${api_endpoint}`;
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
        credentials: 'include',
    };
    
    const res = await fetch(url, options);
    
    const data = await res.json();
    return data;
};
export const getDataFromApiWithAuthorization = async (bodyData, api_endpoint) => {
    const url = `${base_url}${api_endpoint}`;
    const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, '$1');
    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    const res = await fetch(url, options);
    
    const data = await res.json();
    return data;
};