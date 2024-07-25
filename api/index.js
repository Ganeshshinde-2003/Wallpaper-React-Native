import axios from "axios";

const API_KEY = "45097788-ff28bf3ec912a2348c438eba9";

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params) => {
  let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true";

  if (!params) {
    return url;
  }

  let paramKeys = Object.keys(params);
  paramKeys.forEach((key) => {
    let value = key === "q" ? encodeURIComponent(params[key]) : params[key];
    url += `&${key}=${value}`;
  });
  return url;
};

export const apiCall = async (params) => {
  try {
    const response = await axios.get(formatUrl(params));
    const { data } = response;

    return { success: true, data };
  } catch (error) {
    console.log(error.message);
    return { success: false, msg: error.message };
  }
};
