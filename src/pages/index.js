// ** React Imports
import { useEffect } from "react";

// ** Next Imports
import { useRouter } from "next/router";

// ** Spinner Import
import Spinner from "src/@core/components/spinner";

// ** Hook Imports
import { useAuth } from "src/hooks/useAuth";

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role) => {
  if (role === "client") return "/acl";
  else return "/dashboards";
};

const Home = () => {
  // ** Hooks
  const auth = useAuth();
  const router = useRouter();

  const pathname = router.pathname.split("/");
  // console.log("pathname : ", pathname);

  const authAccess = async (pathname) => {
    const storedToken = window.sessionStorage.getItem("token");
    // console.log("token : ", storedToken)
    if (storedToken !== null) {
      const dataUser = JSON.parse(window.sessionStorage.getItem("userData"));
      const adminPermission = dataUser.admin_role.admin_permissions;
     
        const home = await adminPermission.find((obj) => {
          return obj.name_en === "home";
        });
        console.log("Home : ", home);

        var pathUrl = "/dashboards/crm";

        if (home) {
          pathUrl = "/dashboards/crm";
        } else {
          pathUrl = adminPermission[0].path;
        }

        console.log("result : ", pathUrl);
        await router.push(pathUrl);
      
    }
  };
  useEffect(() => {
    console.log(auth.user);
    authAccess(pathname);
    // if (auth.user && auth.user.admin_role.name) {
    // const homeRoute = '/dashboards'
    // Redirect user to Home URL
    // router.replace(homeRoute)
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Spinner />;
};

export default Home;
