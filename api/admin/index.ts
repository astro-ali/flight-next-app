// All Admin API calls

const URL = "http://localhost:5000";

export const ApiAdminLogin = (info: object, callback: any) => {
  console.log(info);
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify(info);

  let requestOptions: any = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${URL}/admin/v1/login`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status) return callback(result, null);
      else {
        return callback(null, result.errMsg);
      }
    })
    .catch((error) => console.log("error", error));
};

export const ApiAdminGetMe = (info: any, callback: any) => {
  let myHeaders = new Headers();
  myHeaders.append("token", info);

  let requestOptions: any = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`${URL}/admin/v1/getMe`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status) return callback(result, null);
      else {
        return callback(null, result.errMsg);
      }
    })
    .catch((error) => console.log("error", error));
};

export const apiGetAllCities = (token: string, callback: Function) => {
  let myHeaders = new Headers();
  myHeaders.append("token", token);

  let requestOptions: object = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`${URL}/admin/v1/cities`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status) return callback(result, null);
      return callback(null, result.errMsg);
    })
    .catch((error) => console.log("error", error));
};

export const apiAdminAddCity = (
  token: string,
  info: object,
  callback: Function
) => {
  let myHeaders = new Headers();
  myHeaders.append("token", token);
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify(info);

  let requestOptions: object = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${URL}/admin/v1/cities`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status) return callback(result, null);
      return callback(null, result.errMsg);
    })
    .catch((error) => console.log("error", error));
};

export const apiAdminDeleteCity = (
  token: string,
  id: number,
  callback: Function
) => {
  let myHeaders = new Headers();
  myHeaders.append("token", token);

  let requestOptions: object = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`${URL}/admin/v1/cities/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status) return callback(result, null);
      return callback(null, result.errMsg);
    })
    .catch((error) => console.log("error", error));
};

export const apiAdminEditCity = (
  token: string,
  info: object,
  id: number,
  callback: Function
) => {
  let myHeaders = new Headers();
  myHeaders.append("token", token);
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify(info);

  let requestOptions: object = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${URL}/admin/v1/cities/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result.status) return callback(result, null);
      return callback(null, result.errMsg);
    })
    .catch((error) => console.log("error", error));
};
