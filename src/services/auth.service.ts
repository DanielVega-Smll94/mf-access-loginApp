import axios from "axios";
import crossStorageHubService from "./cross-storage-hub.service";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Login from "../components/login.component";
import DataStructureService from "./DataStructure.service";

// const API_URL = "http://localhost:8080/api/auth/";
const API_URL = "http://172.16.11.25:9999/api/"

class AuthService {
  login(username: string, password: string, application:string,contexto:any) {
    const userCredentials = {
      usuario: username, password:password, app: application
    }
    console.log(userCredentials)
    return axios
      .post(API_URL + "login",userCredentials)
      .then(response => {
        console.log(response)
        if (response.data.respuestaToken) { //access_token
          // localStorage.setItem("user", JSON.stringify(response.data));
          let dashboardList = response.data.listaPath?.FRONTEND.MODULO.find((lista:any)=>lista.nombreModulo=='DASHBOARD')
          console.log(dashboardList)
          let dashboard = dashboardList.dataModul[0]
          console.log(dashboard)
          const dataStrucre = DataStructureService.sendDataWithStructure(dashboard.ruta,response.data.respuestaToken,response.data,username,application)
          crossStorageHubService.setItems(dashboard.ruta,[
            { key: "access_token", value: response.data.respuestaToken.access_token },
            { key: "expires_in", value: response.data.respuestaToken.expires_in },
            { key: "refresh_expires_in", value: response.data.respuestaToken.refresh_expires_in },
            { key: "refresh_token", value: response.data.respuestaToken.refresh_token },
            { key: "token_type", value: response.data.respuestaToken.token_type },
            { key: "session_state", value: response.data.respuestaToken.session_state },
            { key: "scope", value: response.data.respuestaToken.scope },
            { key: "not_before_policy", value: response.data.respuestaToken.not_before_policy },
            { key: "code", value: response.data.codigo },
            { key: "message", value: response.data.mensaje },
            { key: "list_paths", value: response.data.listaPath },
            { key: "userName", value: username },
            { key: "application", value: application },
          ]).then(()=>{
            if(dashboard.method ==='DASHBOARD'){
              const MySwal = withReactContent(Swal)
              // window.location.href = dashboard.ruta
              MySwal.fire({
                title: "Correcto ",
                html: response.data.mensaje+"!",
                icon: 'success'
              }).then((result=>{
                if(result.isConfirmed || !result.isConfirmed){
                    setTimeout(() => {
                    contexto.setStateLoadingFalse();
                    window.location.href = dashboard.ruta
                  }, 1000);
                  }
                }))
              // return response.data
            }else{
              window.location.reload();
              return response.data
            }
          })
        }else{
          console.log(response.data)
          return response.data;
        }

        // return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();
