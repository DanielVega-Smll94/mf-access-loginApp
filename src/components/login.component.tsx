import { Component } from "react";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AuthService from "../services/auth.service";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import iconLogo from '../assets/img/iconLogo.png'
type Props = {};

type State = {
  redirect: string | null,
  username: string,
  password: string,
  application: string,
  loading: boolean,
  message: string
};

export default class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);

    this.state = {
      redirect: null,
      username: "",
      password: "",
      application: "",
      loading: false,
      message: ""
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      this.setState({ redirect: "/profile" });
    };
  }

  componentWillUnmount() {
    window.location.reload();
  }

  validationSchema() {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
      application: Yup.string().required("This field is required!"),
    });
  }

  setStateLoadingFalse(){
    this.setState({
      message: "",
      loading: true
    });
  }

  handleLogin(formValue: { username: string; password: string, application:string }) {
    const { username, password, application } = formValue;
    const MySwal = withReactContent(Swal)

    this.setState({
      message: "",
      loading: true
    });

    AuthService.login(username, password, application,this).then(
      (response) => {
        // this.setState({
        //   redirect: "/profile"
        // });
        this.setState({
          loading: false,
        });

        console.log(response)
        if(response!== undefined)
          switch(response.codigo){
            case "002":
              //alert
              MySwal.fire({
                title: "Error, código " + response.codigo,
                html: <i>{response.mensaje!}</i>,
                icon: 'error'
              }).then(
                (result) => {
                  if (result.isConfirmed) {
                    // window.location.reload();
                  }
                }
              )
            break;
            default:
            break;
          }
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage
        });
      }
    );
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { loading, message } = this.state;

    const initialValues = {
      username: "",
      password: "",
      application: "GDS"
    };
    interface app {
      site: string;
      value: string;
    }

    const applications: app[] = [
      { site: 'GDShrimp',value: "GDS"},
      { site: 'Acosux', value:"ACOSUX" },
      { site: 'Panacea', value:"PANACEA" }
    ]

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src={iconLogo}
            alt="profile-img"
            className="profile-img-card"
          />

          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleLogin}
          >
            <Form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-group-append">
                <span className="input-group-text"><i className="fa fa-user"></i></span>
                  <Field name="username" type="text" className="form-control" />
                  </div>
                  <ErrorMessage
                    name="username" component="div" className="alert alert-danger"/>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group-append">
                <span className="input-group-text"><i className="fas fa-key"></i></span>
                  <Field name="password" type="password" className="form-control" />
                </div>
                  <ErrorMessage
                    name="password" component="div"className="alert alert-danger"/>
              </div>

              <div className="form-group">
                <label htmlFor="application">Application</label>
                <div className="input-group-append">
                <span className="input-group-text"><i className="fa fa-network-wired"></i></span>
                  <Field name="application" type="application" className="form-control" disabled={true}/>
                  </div>
                      <ErrorMessage
                        name="application" component="div" className="alert alert-danger"/>
              </div>
              {/* <select className="form-control" name="application">
                        {applications.map((app) => (
                          <option key={app.value}>{app.site}</option>
                        ))}
                </select> */}
              <div className="form-group">
                <button type="submit" className="btn btn-outline-secondary btn login_btn" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}
