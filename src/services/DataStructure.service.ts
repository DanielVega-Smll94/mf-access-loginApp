import axios from 'axios';
import authHeader from './auth-header';

class DataStructureService {

    sendDataWithStructure(ruta:string,respuestaToken:any,data:any,username:string,application:string){
        return {
            "ruta": ruta,
            "respuesta": {
              "access_token": respuestaToken.access_token, 
              "expires_in": respuestaToken.expires_in,
              "refresh_expires_in":respuestaToken.refresh_expires_in,
              "refresh_token":respuestaToken.refresh_token ,
              "token_type": respuestaToken.token_type,
              "session_state":respuestaToken.session_state ,
              "scope":respuestaToken.scope,
              "not_before_policy":respuestaToken.not_before_policy ,
              "code": data.codigo,
              "message":data.mensaje,
              "list_paths":data.listaPath ,
              "userName": username,
              "application": application 
            }
        }
    }
}

export default new DataStructureService();