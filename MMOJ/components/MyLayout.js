import "semantic-ui-css/semantic.min.css";
import Header from "./Header";
import NProgress from "nprogress";
import Router from "next/router";

Router.onRouteChangeStart = () => {
  console.log("ROUTE STARTED");
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  console.log("route done");
  NProgress.done();
};
Router.onRouteChangeError = () => NProgress.done();

const Layout = props => (
  <div>
    <Header />
    {props.children}
  </div>
);

export default Layout;
