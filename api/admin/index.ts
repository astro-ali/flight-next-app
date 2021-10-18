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
        else{
          return callback(null, result.errMsg);
        }
    })
    .catch((error) => console.log("error", error));
};