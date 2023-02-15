import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

var CrossStorageClient = require('cross-storage').CrossStorageClient;
var CrossStorageHub    = require('cross-storage').CrossStorageHub;

class CrossStorageHubService {


  constructor() {
    this.init()
  }

  init() {
    CrossStorageHub.init([
      { origin: /localhost:4200$/, allow: ['set', 'get'] },
    ]);
  }

  async setItems(domClient: string, objects: { key: any, value: any }[]) {
    const MySwal = withReactContent(Swal)

    var storageClient= new CrossStorageClient(domClient, {timeout: 30000})
    for (let item of objects) {
      await storageClient?.onConnect().then(
        () => {
          return storageClient?.set(item.key, JSON.stringify(item.value))
        },
        (error:any)=>{
          MySwal.fire({
            title: "Falló",
            html: "Intente nuevamente !",
            icon: 'info'
          }).then(
            (result) => {
              if (result.isConfirmed) {
                // window.location.reload();
              }
            }
          )
        }
         // (err:any) => {
        //   window.location.reload();
        // }
        );
    }
    return true;
  }


}
export default new CrossStorageHubService();

