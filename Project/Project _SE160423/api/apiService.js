import axios from "axios";

const apiHost = "https://677f899d0476123f76a6e9ed.mockapi.io/project";

const api = axios.create({
  baseURL: apiHost,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
});

export const getData = async (id) => {
  try {
    const response = await api.get(`/${id || ""}`);
    return response;
  } catch (error) {
    console.log("getData in service error : ", error);
    return error;
  }
};

export const createData = async (data) => {
  try {
    const response = await api.post(``, data);
    return response;
  } catch (error) {
    console.log("createProduct in service error : ", error);
    return error;
  }
};

export const updateData = async (data) => {
  try {
    const response = await api.put(``, data);
    return response;
  } catch (error) {
    console.log("updateProduct in service error : ", error);
    return error;
  }
};

export const deleteData = async (id) => {
  try {
    const response = await api.delete(`/${id || ""}`);
    return response;
  } catch (error) {
    console.log("deleteProduct in service error : ", error);
    return error;
  }
};
