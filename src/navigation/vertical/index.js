// ** React Imports
import { useState, useCallback, useEffect } from "react";
// ** Icon imports
import CubeOutline from 'mdi-material-ui/CubeOutline'
import LockOutline from 'mdi-material-ui/LockOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import ShieldOutline from 'mdi-material-ui/ShieldOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import TimelineClockOutline from 'mdi-material-ui/TimelineClockOutline'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline'
import CalendarBlankOutline from 'mdi-material-ui/CalendarBlankOutline'
import PackageVariantClosed from 'mdi-material-ui/PackageVariantClosed'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import OfficeBuildingOutline from "mdi-material-ui/OfficeBuildingOutline";
import ImageMultipleOutline from "mdi-material-ui/ImageMultipleOutline";
import ImageOutline from "mdi-material-ui/ImageOutline";
import CogOutline from "mdi-material-ui/CogOutline";
import CartVariant from 'mdi-material-ui/CartVariant'
import NewspaperVariantOutline from "mdi-material-ui/NewspaperVariantOutline";

const navigation = () => {

  const listMenu = [
    {
      slug: "HOME_ALL",
      title: "Dashboard",
      icon: HomeOutline,
      badgeContent: "new",
      badgeColor: "error",
      path: "/dashboards/crm",
    },
    {
      slug: "STUDENT_ALL",
      title: "Product",
      icon: CubeOutline,
      children: [
        {
          title: "Product List",
          path: "/product/list",
        },
        {
          title: "Product Stock Control",
          path: "/product/stock-control/list",
        },
      ],
    },
    {
      slug: "CUSTOMER_ALL",
      title: "Customer",
      icon: AccountOutline,
      path: "/customer/list",
    },
    {
      slug: "ORDER_ALL",
      title: "Customer Order",
      icon: CartVariant,
      path: "/customer-order/list",
    },
    {
      slug: "ORDER_RECONCILE_ALL",
      title: "Customer Order Reconcile",
      icon: TimelineClockOutline,
      path: "/customer-order/reconcile/list",
    },
    {
      slug: "ADMIN_ALL",
      title: "Admin",
      icon: AccountCogOutline,
      children: [
        {
          title: "Admin List",
          path: "/admin/list",
        },
        {
          title: "Admin Role",
          path: "/admin/role/list",
        },
      ],
    },
    {
      slug: "SETTING_ALL",
      title: "Setting",
      icon: CogOutline,
      children: [
        {
          title: "Email Template",
          path: "/setting/mail-template/list",
        },
        {
          title: "Site Config",
          path: "/setting/config-site",
        },
      ],
    },
    {
      slug: "NEWS_ALL",
      title: "News",
      icon: NewspaperVariantOutline,
      path: "/news/list",
    },
    // {
    //   sectionTitle: '動画管理'
    // },
  ];

  var listSide = [];
  const [permission, setPermission] = useState([])
  const userData = window.sessionStorage.getItem('userData')
  // console.log("permission : ", JSON.parse(userData).admin_role.permission)

  useEffect(() => {
    setPermission(JSON.parse(userData).admin_role.admin_permissions)
  }, [])

  listSide = listMenu.filter(item => {
    if (item.sectionTitle) {
      return true;
    }
    return permission.some(perm => perm.slug === item.slug);
  });

  return listSide;
}

export default navigation
