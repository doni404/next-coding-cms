// ** React Imports
import { createContext, useEffect, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";

// ** Axios
import axios from "axios";
import Cookies from 'js-cookie';

// ** Config
import authConfig from "src/configs/auth";

import { browserName } from "react-device-detect";
// ** Defaults

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [isInitialized, setIsInitialized] = useState(
    defaultProvider.isInitialized
  );

  // ** Hooks
  const router = useRouter();
  const pathname = router.pathname.split("/");

  useEffect(() => {
    // console.log("Use Effect Run");
    const initAuth = async () => {
      console.log("init Auth");
      const userData = window.sessionStorage.getItem("userData");
      console.log("user data : ",JSON.parse(userData));
      setUser(JSON.parse(userData));
      setLoading(false);
    };

    const authAccess = async (pathname) => {
      // console.log("auth access ")
      setIsInitialized(true);
      if (Cookies.get('en_cms_cookie_login') !== undefined) {
        const cookieStoredToken = Cookies.get('en_cms_cookie_login');
        if(window.sessionStorage.getItem('token') === null) {
          window.sessionStorage.setItem("token", cookieStoredToken);
        }
      }

      const storedToken = window.sessionStorage.getItem("token");

      if (storedToken !== null) {
        // Check if en_cms_cookie_user_data is defined in Cookies
        if (Cookies.get('en_cms_cookie_user_data') !== undefined) {
          // Retrieve en_cms_cookie_user_data from Cookies
          const cookieUserData = Cookies.get('en_cms_cookie_user_data');
          // If userData is not set in sessionStorage, set it
          if (window.sessionStorage.getItem('userData') === null) {
            window.sessionStorage.setItem("userData", cookieUserData);
          }
        }

        const userData = JSON.parse(window.sessionStorage.getItem("userData"));

        if ( userData !== null) {
          const adminPermission = userData.admin_role.admin_permissions
          // console.log("data permission : ",  adminPermission)
          const status = await adminPermission.find((obj) => {
            return obj.name_en === pathname[1];
          });

          if (status) {
            initAuth();
          } else {
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
            //console.log("result : ", pathUrl);
            await router.push(pathUrl);
            initAuth();
          }
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    console.log("pathname : ", pathname);
    authAccess(pathname);
  }, []);

  const jwtConfig = {
    secret: "dd5f3089-40c3-403d-af14-d0c228b05cb4",
    refreshTokenSecret: "7c4c1c50-3230-45bf-9eae-c9b2e401c767",
  };

  const handleLogin = (params, errorCallback) => {
    let { remember, ...loginData } = params
    // console.log("params : ", params)
    axios.post(BASE_URL_API + "v1/cms/admins/login", params)
      .then(async (response) => {
        console.log("response login : ", response.data.data)
        const returnUrl = router.query.returnUrl;
        // const accessToken = jwt.sign({ id: response.data.data.id }, jwtConfig.secret)
        // window.sessionStorage.setItem(authConfig.storageTokenKeyName, accessToken)
        setUser({ ...response.data.data });
        const essentialUserData = {
          id: response?.data.data.id,
          name: response?.data.data.name,
          email: response?.data.data.email,
          situation: response?.data.data.situation,
          password: response?.data.data.password,
          phone: response?.data.data.phone,
          note: response?.data.data.note,
          created_at: response?.data.data.created_at,
          admin_role: {
            id: response?.data.data.admin_role.id,
            name_ja: response?.data.data.admin_role.name_ja,
            admin_permissions: response?.data.data.admin_role?.admin_permissions?.map(permission => ({
              id: permission.id,
              name_en: permission.name_en,
              name_ja: permission.name_ja,
              slug: permission.slug,
            }))
          },
        };

        const userData = JSON.stringify(essentialUserData);
        // console.log("user data length : ", userData.length)

        if (userData.length > 4000) {
          console.error("Essential user data exceeds cookie size limit:", userData.length);
          // Handle the case where data is too large (e.g., notify the user or reduce data further)
        } else if (remember) {
          Cookies.set("en_cms_cookie_login", response.data.data.token, {
            expires: 30,
            sameSite: 'None',
            secure: true,
          });
          Cookies.set("en_cms_cookie_user_data", userData, {
            expires: 30,
            sameSite: 'None',
            secure: true,
          });
        }

        console.log("en_cms_cookie_login : ",  Cookies.get('en_cms_cookie_login'));
        console.log("en_cms_cookie_user_data : ",  Cookies.get('en_cms_cookie_user_data'));

        await window.sessionStorage.setItem("userData", JSON.stringify(response.data.data));
        await window.sessionStorage.setItem("email", response.data.data.email);
        await window.sessionStorage.setItem("token", response.data.data.token);
        await window.sessionStorage.setItem("id", response.data.data.id);

        const token = response.data.data.token;

        const header = {
          headers: { Authorization: `Bearer ${token}` },
        };

        var paramsLog = {
          admin_id: response.data.data.id,
        };

        // console.log("params log", paramsLog , "header : ", header);
        axios.post(BASE_URL_API + "v1/cms/admin-login-logs", paramsLog, header)
          .then(async (response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });

        const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";
        router.replace(redirectURL);
      })
      .catch((err) => {
        console.log(err);
        if (errorCallback) errorCallback(err);
      });
  };

  const handleLogout = () => {
    setUser(null);
    setIsInitialized(false);
    window.sessionStorage.removeItem("userData");
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem(authConfig.storageTokenKeyName);
    Cookies.remove('en_cms_cookie_login')
    Cookies.remove('en_cms_cookie_user_data')
    router.push("/login");
  };

  const handleRegister = (params, errorCallback) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then((res) => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error);
        } else {
          handleLogin({ email: params.email, password: params.password });
        }
      })
      .catch((err) => (errorCallback ? errorCallback(err) : null));
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
