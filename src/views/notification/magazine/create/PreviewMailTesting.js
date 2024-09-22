import React from "react";
import { useState, useEffect, useRef } from "react";
import DataGrid from "src/@core/theme/overrides/dataGrid";
import axios from 'axios'
import moment from "moment";
import draftToHtml from "draftjs-to-html";

const style = {
  backgroundTable: {
    backgroundColor: "#f5f5f5",
    padding: "0 5px",
    width: "100%",
  },
  fullWidth: {
    width: "100%",
  },
  pb1: {
    paddingBottom: "1em",
  },
  widthTable: {
    width: "100%",
    maxWidth: "450px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  paddingBorder: {
    padding: "32px 16px 32px",
  },
  alignCenter: {
    textAlign: "center",
  },
  topDate: {
    color: "#191a1c",
    fontSize: "20px",
    textAlign: "center",
    paddingTop: "16px",
    fontWeight: "bold",
  },
  widthTableRadius: {
    width: "100%",
    maxWidth: "450px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "0",
    borderTop: "4px solid #E50031",
  },
  fullWidthCenter: {
    width: "100%",
    textAlign: "center",
  },
  p0: {
    padding: 0,
  },
  lineTop: {
    width: "100%",
    borderTopLeftRadius: "7px",
    borderTopRightRadius: "7px",
  },
  tableStyle1: {
    textAlign: "center",
    padding: "16px",
    width: "100%",
  },
  title: {
    fontSize: "16px",
    color: "#191a1c",
    paddingTop: "20px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#191a1c",
    paddingTop: "22px",
  },
  intro: {
    fontSize: "16px",
    color: "#191a1c",
    paddingTop: "22px",
    lineHeight: "22px",
    paddingBottom: "20px",
  },
  widthTablePart: {
    width: "100%",
    maxWidth: "450px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 0,
    padding: "0 16px 20px",
  },
  tableTitlePart: {
    textAlign: "center",
    paddingBottom: "16px",
    width: "100%",
  },
  divider: {
    borderTop: "1px solid #DD5270",
    paddingBottom: "36px",
  },
  titleEnglish: {
    fontSize: "14px",
    color: "#E50031",
  },
  titleJapan: {
    fontSize: "24px",
    color: "#1e2d44",
    paddingTop: "2px",
    paddingBottom: "16px",
  },
  itemTopWrapper: {
    width: "100%",
    padding: "0 0 25px",
  },
  linkDecoration: {
    textDecoration: "none",
  },
  fullWidthTopAlign: {
    width: "100%",
    verticalAlign: "top",
  },
  seller_cursor: {
    width: "100%",
    verticalAlign: "top",
    cursor: "pointer"
  },
  imageItemFull: {
    width: "100%",
    borderRadius: "8px",
  },
  noBorderSpacing: {
    borderSpacing: 0,
    width: "100%",
  },
  dateItem: {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "16px",
    color: "#191a1c",
    padding: "0 0 10px",
  },
  titleItemTop: {
    width: "100%",
    fontWeight: "600",
    fontSize: "16px",
    padding: "7px 0 3px",
    color: "#191a1c",
  },
  DescItem: {
    width: "100%",
    fontSize: "14px",
    color: "#919191",
  },
  itemWrapper: {
    width: "100%",
    padding: "0 0 12px",
  },
  imageItem: {
    // width: "124px",
    verticalAlign: "top",
    // minWidth: "124px",
    borderRadius: "8px",
    width: "40%",
    maxWidth: "124px",
    cursor :"pointer",
  },
  itemDescWrapper: {
    width: "75%",
    verticalAlign: "top",
    paddingLeft: "12px",
  },
  titleItem: {
    width: "100%",
    fontWeight: "600",
    fontSize: "16px",
    padding: "0px 0px 0px",
    color: "#191a1c",
  },
  widthTablePartMargin: {
    width: "100%",
    maxWidth: "450px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 0,
    padding: "0 16px 30px",
    marginTop: "26px",
  },
  pb36: {
    paddingBottom: "36px",
  },
  lineBottom: {
    width: "100%",
    borderBottomLeftRadius: "7px",
    borderBottomRightRadius: "7px",
  },
  footerWrapper: {
    borderRadius: "7px",
    marginTop: "30px",
    paddingBottom: "15px",
    maxWidth: "450px",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
  },
  footerTable: {
    margin: "10px auto 16px",
    textAlign: "center",
    width: "100%",
  },
  footerSns1: {
    textAlign: "right",
    width: "40.333%",
  },
  footerSns2: {
    textAlign: "center",
    width: "19.333%",
  },
  footerSns3: {
    textAlign: "left",
    width: "40.333%",
  },
  snsWidth: {
    width: "40px",
  },
  footerTextTable: {
    textAlign: "center",
    paddingBottom: "6px",
    width: "100%",
  },
  footerText: {
    fontSize: "12px",
    color: "#191a1c",
    padding: "18px 0 24px",
  },
  footerText2: {
    color: "#e50031",
    textDecoration: "none",
  },
  footerText3: {
    fontSize: "12px",
    color: "#191a1c"
  },
  widthHalfAsset: {
    width: "50%",
    // padding: "0 5px 10px",
    padding: "8px 8px 5px",
    border: "1px solid #D9D9D9",
    borderRadius: "8px",
  },
  tableNewAsset: {
    // padding: "8px 8px 5px",
    // border: "1px solid #D9D9D9",
    // borderRadius: "8px",
  },
  imageNewAsset: {
    width: "100%",
    borderRadius: "5px",
    verticalAlign: "top",
  },
  imageArtistAsset: {
    width: "35px",
    borderRadius: "50%",
    height: "35px",
  },
  imageRankBadge: {
    width: "32px",
    marginRight: "14px",
  },
  imageRankAsset: {
    width: "100%",
    borderRadius: "8px",
  },
  artistName: {
    color: "#000000",
    fontSize: "13px",
    verticalAlign: "baseline",
    paddingTop: "7px",
    paddingLeft: "10px",
    wordBreak: "break-all",
  },
  artistWrap: {
    paddingTop: "10px",
  },
  squareAssetWrap: {
    // minHeight: "176px",
    // height: "176px",
    // maxHeight: "176px",
    padding: "0",
  },
  titleItemNewAsset: {
    width: "100%",
    fontWeight: "600",
    fontSize: "16px",
    padding: "8px 0px 0px",
    color: "#191a1c",
  },
  dateItemTop: {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "16px",
    color: "#191a1c",
    padding: "8px 0 0",
  },
  descNews: {
    width: "100%",
    fontSize: "14px",
    color: "#454545",
    paddingTop: "4px",
  },
  imageItemNews: {
    // width: "124px",
    verticalAlign: "top",
    // minWidth: "124px",
    borderRadius: "8px",
    paddingRight: "7px",
    width: "30%",
    maxWidth: "124px",
  },
  topLogo: {
    width: "100%",
    maxWidth: "365px",
  },
  newAssetWrapper: {
    borderSpacing: "12px",
  },
  widthTablePartNewAsset: {
    width: "100%",
    maxWidth: "450px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 0,
    padding: "0 6px 40px",
    marginTop: "26px",
  },
  verAlignTop: {
    verticalAlign: "top"
  }
};
// ** Store Imports
import { useDispatch } from 'react-redux'

import { setData } from 'src/store/apps/mail_magazine_params'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;
export const BASE_URL_EC = process.env.REACT_APP_BASE_URL_EC;
export const BASE_URL_CMS = process.env.REACT_APP_BASE_URL_CMS;

const GetAvatar = (avatar) => {
  // console.log("avatar", avatar);
  const [imgSrc, setImgSrc] = useState();
  useEffect(() => {
    setImgSrc(BASE_URL_API + "v1/public/resources?type=accounts/profiles&filename=" + avatar.avatar)
    // imageWithAuth(avatar.avatar);
  }, []);
  // const imageWithAuth = async (avatar) => {
  //   const token = window.sessionStorage.getItem("token");
  //   const header = {
  //     headers: { Authorization: `Bearer ${token}` },
  //     responseType: "blob",
  //   };
  //   const response = await axios.get(
  //     BASE_URL_API + "v1/resources?type=accounts/profiles&filename=" +
  //     avatar,
  //     header
  //   );
  //   const fileReader = new FileReader();
  //   fileReader.readAsDataURL(response.data);
  //   fileReader.onloadend = function () {
  //     if (fileReader.result == null) {
  //       setImgSrc("/images/avatars/1.png");
  //     } else {
  //       setImgSrc(fileReader.result);
  //     }
  //   };
  // };

  if (avatar.avatar != "") {
    return <img src={imgSrc} 
    style={style.imageArtistAsset} 
    onError={() => setImgSrc(BASE_URL_CMS + "images/avatars/1.png")}
    />
  } else {
    return <img src={BASE_URL_CMS + "images/avatars/1.png"} style={style.imageArtistAsset} />
  }
}

const GetNewsImage = (news) => {
  // console.log("avatar", avatar);
  const [imgSrc, setImgSrc] = useState(BASE_URL_API + "v1/public/resources?type=news&filename=" + news.news);
  // useEffect(() => {
  //   imageWithAuth(news.news);
  // }, []);
  // const imageWithAuth = async (news) => {
  //   const token = window.sessionStorage.getItem("token");
  //   const header = {
  //     headers: { Authorization: `Bearer ${token}` },
  //     responseType: "blob",
  //   };
  //   const response = await axios.get(
  //     BASE_URL_API + "v1/resources?type=news&filename=" +
  //     news,
  //     header
  //   );
  //   const fileReader = new FileReader();
  //   fileReader.readAsDataURL(response.data);
  //   fileReader.onloadend = function () {
  //     if (fileReader.result == null) {
  //       setImgSrc("/images/avatars/1.png");
  //     } else {
  //       setImgSrc(fileReader.result);
  //     }
  //   };
  // };

  if (news.news != "") {
    return <img
      src={imgSrc}
      alt="workshop"
      onError={() => setImgSrc(BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif')}
      style={style.imageRankAsset}
    />
  } else {
    return <img
      src={BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif'}
      alt="workshop"
      onerror="this.src='../resources/images/no_photo.jpg';"
      style={style.imageRankAsset}
    />
  }
}

const GetArticleImage = (article) => {
  // console.log("avatar", avatar);
  const [imgSrc, setImgSrc] = useState(BASE_URL_API + "v1/public/resources?type=articles&filename=" + article.article);
  // useEffect(() => {
  //   imageWithAuth(article.article);
  // }, []);
  // const imageWithAuth = async (article) => {
  //   const token = window.sessionStorage.getItem("token");
  //   const header = {
  //     headers: { Authorization: `Bearer ${token}` },
  //     responseType: "blob",
  //   };
  //   const response = await axios.get(
  //     BASE_URL_API + "v1/resources?type=articles&filename=" +
  //     article,
  //     header
  //   );
  //   const fileReader = new FileReader();
  //   fileReader.readAsDataURL(response.data);
  //   fileReader.onloadend = function () {
  //     if (fileReader.result == null) {
  //       setImgSrc("/images/avatars/1.png");
  //     } else {
  //       setImgSrc(fileReader.result);
  //     }
  //   };
  // };

  if (article.article != "") {
    return <img
      src={imgSrc}
      alt="workshop"
      onError={() => setImgSrc(BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif')}
      style={style.imageRankAsset}
    />
  } else {
    return <img
      src={BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif'}
      alt="workshop"
      onerror="this.src='../resources/images/no_photo.jpg';"
      style={style.imageRankAsset}
    />
  }
};

const GetAssetImage = (asset) => {
  // console.log("avatar", avatar);
  const [imgSrc, setImgSrc] = useState(BASE_URL_API + "v1/public/resources?type=assets&filename=" + asset.asset);
  // useEffect(() => {
  //   imageWithAuth(asset.asset);
  // }, []);
  // const imageWithAuth = async (asset) => {
  //   const token = window.sessionStorage.getItem("token");
  //   const header = {
  //     headers: { Authorization: `Bearer ${token}` },
  //     responseType: "blob",
  //   };
  //   const response = await axios.get(
  //     BASE_URL_API + "v1/resources?type=assets&filename=" +
  //     asset,
  //     header
  //   );
  //   const fileReader = new FileReader();
  //   fileReader.readAsDataURL(response.data);
  //   fileReader.onloadend = function () {
  //     if (fileReader.result == null) {
  //       setImgSrc("/images/avatars/1.png");
  //     } else {
  //       setImgSrc(fileReader.result);
  //     }
  //   };
  // };

  if (asset.asset != "") {
    return <img
      src={imgSrc}
      alt="workshop"
      onError={() => setImgSrc(BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif')}
      style={style.imageRankAsset}
    />
  } else {
    return <img
      src={BASE_URL_API + 'v1/public/resources?type=general_images&filename=nophoto.gif'}
      alt="workshop"
      onerror="this.src='../resources/images/no_photo.jpg';"
      style={style.imageRankAsset}
    />
  }
};

function PreviewMailTesting(data) {
  const [toptitle, setTopTitle] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [intro, setIntro] = useState('');
  const [dataNftSales, setDataNftSales] = useState([]);
  const [dataAssets, setDataAssets] = useState([]);
  const [dataNews, setDataNews] = useState([]);
  const [dataArticles, setDataArticles] = useState([]);
  // ** Hooks
  const dispatch = useDispatch();


  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  useEffect(() => {
    setTopTitle(data.toptitle)
    setTitle(data.title)
    setSubtitle(data.subtitle)
    setIntro(data.intro)
    dispatch(setData(document.getElementById('table')))
    getDate()
    loadNftSales()
    loadAssets()
    loadNews()
    loadArticles()
  }, [data])

  const getDate = () => {
    var today = new Date();
    setDay(String(today.getDate()).padStart(2, '0'))
    setMonth(String(today.getMonth() + 1).padStart(2, '0'))
    setYear(today.getFullYear())
  }

  const loadNftSales = async () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/nft_sales/groups/asset?sort=desc', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        console.log("res nft sales : ", res)
        setDataNftSales(res.data.data)
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }

  const loadAssets = async () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/assets?limit=4&sort=created_at desc', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        console.log("res assets : ", res)
        setDataAssets(res.data.data)
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }

  const loadNews = async () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/news?limit=4&sort=released_date desc', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        console.log("res news : ", res)
        setDataNews(res.data.data)
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }

  const loadArticles = async () => {
    const token = window.sessionStorage.getItem('token')
    axios.get(BASE_URL_API + 'v1/articles?limit=4&sort=released_date desc', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        console.log("res articles : ", res)
        setDataArticles(res.data.data)
      })
      .catch((error) => {
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }

  const getHtml = (content) => {
    if (content !== '') {
      // console.log("content to convert : ",content)
      content = draftToHtml(JSON.parse(content)) // get json parse to html
      content = getText(content) // convert from html to plain text
    }
    return content;
  };

  //method for convert html to text
  const getText = (html) => {
    var divContainer = document.createElement("div");
    divContainer.innerHTML = html;
    return divContainer.textContent || divContainer.innerText || "";
  }

  return (
    <table id="table" style={style.backgroundTable}>
      <tr>
        <td>
          {/* <!-- Main --> */}
          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            style={style.fullWidth}
          >
            <tr>
              <td align="center" style={style.pb1}>
                {/* <!-- Shell --> */}
                <table
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  style={style.widthTable}
                >
                  <tr>
                    <td>
                      {/* <!--Template Top Bar --> */}
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        style={style.widthTable}
                      >
                        <tr>
                          <td style={style.paddingBorder}>
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.fullWidth}
                            >
                              <tr>
                                <td style={style.alignCenter}>
                                  <img
                                    src={BASE_URL_CMS + "images/artwithme.png"}
                                    border="0"
                                    alt="nft-logo"
                                    style={style.topLogo}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td style={style.topDate}>
                                  {toptitle == ""
                                    ? "メールマガジン-" +
                                    year +
                                    "年" +
                                    month +
                                    "月" +
                                    day +
                                    "日"
                                    : toptitle}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      {/* <!-- END Template Top Bar --> */}

                      {/* <!-- Template Header --> */}
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                        style={style.widthTableRadius}
                      >
                        <tr>
                          <td>
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.tableStyle1}
                            >
                              <tr>
                                <td style={style.title}>
                                  {title == "" ? "Title Mail Magazine" : title}
                                </td>
                              </tr>

                              <tr>
                                <td style={style.subtitle}>
                                  {subtitle == ""
                                    ? "Subtitle Mail Magazine"
                                    : subtitle}
                                </td>
                              </tr>

                              <tr>
                                <td style={style.intro}>
                                  {intro == ""
                                    ? "This field for introduction text"
                                    : intro}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      {/* <!-- End Template Header --> */}

                      {/* <!-- Asset Ranking by Sales --> */}
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                        style={style.widthTablePart}
                      >
                        <tr>
                          <td>
                            {/* <!--title each part--> */}
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.tableTitlePart}
                            >
                              <tr>
                                <td style={style.divider}></td>
                              </tr>

                              <tr>
                                <td style={style.titleEnglish}>
                                  Asset Ranking by Sales
                                </td>
                              </tr>
                              <tr>
                                <td style={style.titleJapan}>
                                  売上別資産ランキング
                                </td>
                              </tr>
                            </table>
                            {/* <!-- end title each part--> */}

                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.fullWidth}
                            >
                              {/* <!--list item--> */}
                              {dataNftSales &&
                                dataNftSales.map((item, index) => (
                                  index < 9 ? (
                                  <tr key={index}>
                                    <td style={style.itemWrapper}>
                                        <table style={style.fullWidth}>
                                          <td style={style.verAlignTop}>
                                            <img
                                              src={BASE_URL_CMS + `images/email/rank_${index + 1}.png`}
                                              alt="workshop"
                                              onerror="this.src='../resources/images/no_photo.jpg'"
                                              style={style.imageRankBadge}
                                            />
                                          </td>
                                          <td style={style.imageItem} onClick={() => window.open((BASE_URL_EC + "assets"), "_blank")}>
                                            <GetAssetImage asset={item.asset_image} />
                                          </td>
                                          <td style={style.itemDescWrapper}>
                                            <table style={style.noBorderSpacing}>
                                              <tr style={style.fullWidthTopAlign}>
                                                <td style={style.titleItem}>
                                                  {item.asset_name}
                                                </td>
                                              </tr>
                                              <tr style={style.fullWidthTopAlign}>
                                                <td style={style.DescItem}>
                                                  {item.sales_total} ETH
                                                </td>
                                              </tr>
                                              <tr style={style.seller_cursor} onClick={() => window.open((BASE_URL_EC + "seller/" + item.seller_username), "_blank")}>
                                                <td style={style.artistWrap}>
                                                  <table
                                                    border="0"
                                                    cellspacing="0"
                                                    cellpadding="0"
                                                  >
                                                    <tr>
                                                      <td>
                                                        <GetAvatar avatar={item.seller_profile} />
                                                      </td>
                                                      <td style={style.artistName}>
                                                        <span>{item.seller_username}</span>
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </table>
                                    </td>
                                  </tr> ) : null
                                ))}
                              {/* <!--list item--> */}
                            </table>
                          </td>
                        </tr>
                      </table>
                      {/* <!-- End Asset Ranking by Sales --> */}
                      {/* <!--New Asset--> */}
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                        style={style.widthTablePartNewAsset}
                      >
                        <tr>
                          <td>
                            {/* <!--title each part--> */}
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.tableTitlePart}
                            >
                              <tr>
                                <td style={style.pb36}></td>
                              </tr>

                              <tr>
                                <td style={style.titleEnglish}>New Asset</td>
                              </tr>
                              <tr>
                                <td style={style.titleJapan}>新しいアセット</td>
                              </tr>
                            </table>
                            {/* <!--end title each part--> */}

                            <table style={style.newAssetWrapper}>
                              {/* <!-- item list --> */}
                              <tr style={style.fullWidthTopAlign}>
                                {dataAssets &&
                                  dataAssets.map((item, index) => (
                                    index === 0 || index === 1 ? (
                                      <td style={style.widthHalfAsset}>
                                        <a
                                          href={BASE_URL_EC + `assets/${item.collection.contract}:${item.token_id}`}
                                          target="_blank"
                                          style={style.linkDecoration}
                                        >
                                          <table style={style.tableNewAsset}>
                                            <tr>
                                              <td style={style.squareAssetWrap}>
                                                <GetAssetImage asset={item.image_url} />
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.titleItemNewAsset}>
                                                {item.name}
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.DescItem}>{item.price} ETH</td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.artistWrap}>
                                                <table
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td>
                                                      <GetAvatar avatar={item.owner.profile_image} />
                                                    </td>
                                                    <td style={style.artistName}>
                                                      <span>{item.owner.username}</span>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </a>
                                      </td>) : null
                                  ))}
                              </tr>
                              <tr style={style.fullWidthTopAlign}>
                                {dataAssets &&
                                  dataAssets.map((item, index) => (
                                    index === 2 || index === 3 ? (
                                      <td style={style.widthHalfAsset}>
                                        <a
                                          href={BASE_URL_EC + `assets/${item.collection.contract}:${item.token_id}`}
                                          target="_blank"
                                          style={style.linkDecoration}
                                        >
                                          <table style={style.tableNewAsset}>
                                            <tr>
                                              <td style={style.squareAssetWrap}>
                                                <GetAssetImage asset={item.image_url} />
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.titleItemNewAsset}>
                                                {item.name}
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.DescItem}>
                                                {item.price} ETH
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.artistWrap}>
                                                <table
                                                  border="0"
                                                  cellspacing="0"
                                                  cellpadding="0"
                                                >
                                                  <tr>
                                                    <td>
                                                      <GetAvatar avatar={item.owner.profile_image} />
                                                    </td>
                                                    <td style={style.artistName}>
                                                      <span>
                                                        {item.owner.username}
                                                      </span>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </a>
                                      </td>
                                    ) : null
                                  ))}
                              </tr>
                              {/* <!-- end item list --> */}
                            </table>
                          </td>
                        </tr>
                      </table>
                      {/* <!-- End News Asset --> */}
                      {/* <!-- Upcoming News --> */}
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                        style={style.widthTablePartMargin}
                      >
                        <tr>
                          <td>
                            {/* <!--title each part--> */}
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.tableTitlePart}
                            >
                              <tr>
                                <td style={style.pb36}></td>
                              </tr>

                              <tr>
                                <td style={style.titleEnglish}>
                                  Upcoming News
                                </td>
                              </tr>
                              <tr>
                                <td style={style.titleJapan}>今後のニュース</td>
                              </tr>
                            </table>
                            {/* <!--end title each part--> */}
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.fullWidth}
                            >
                              {/* <!--top item--> */}
                              {dataNews &&
                                dataNews.map((item, index) => (
                                  index === 0 ? (
                                    <tr>
                                      <td style={style.itemTopWrapper}>
                                        <a
                                          href={BASE_URL_EC + "news/" + item.url}
                                          target="_blank"
                                          style={style.linkDecoration}
                                        >
                                          <table style={style.fullWidth}>
                                            <tr style={style.fullWidthTopAlign}>
                                              <GetNewsImage news={item.image} />
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td>
                                                <table style={style.noBorderSpacing}>
                                                  <tr style={style.fullWidthTopAlign}>
                                                    <td style={style.dateItemTop}>
                                                      {moment(item.release_date).format("yyyy/MM/DD")}
                                                    </td>
                                                  </tr>
                                                  <tr style={style.fullWidthTopAlign}>
                                                    <td style={style.titleItemTop}>
                                                      {item.title}
                                                    </td>
                                                  </tr>
                                                  <tr style={style.fullWidthTopAlign}>
                                                    <td style={style.descNews}>
                                                      {getHtml(item.content).substring(0, 134)}...
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </a>
                                      </td>
                                    </tr>) : null
                                ))}
                              {/* <!-- end top item--> */}
                              {/* <!--list item--> */}
                              {dataNews &&
                                dataNews.map((item, index) => (
                                  index !== 0 ? (
                                    <tr key={index}>
                                      <td style={style.itemWrapper}>
                                        <a
                                          href={BASE_URL_EC + "news/" + item.url}
                                          target="_blank"
                                          style={style.linkDecoration}
                                        >
                                          <table style={style.fullWidth}>
                                            <td style={style.imageItemNews}>
                                              <GetNewsImage news={item.image} />
                                            </td>
                                            <td style={style.itemDescWrapper}>
                                              <table style={style.noBorderSpacing}>
                                                <tr style={style.fullWidthTopAlign}>
                                                  <td style={style.dateItem}>
                                                    {moment(item.release_date).format("yyyy/MM/DD")}
                                                  </td>
                                                </tr>
                                                <tr style={style.fullWidthTopAlign}>
                                                  <td style={style.titleItem}>
                                                    {item.title}
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </table>
                                        </a>
                                      </td>
                                    </tr>
                                  ) : null
                                ))}
                              {/* <!-- end list item --> */}
                            </table>
                          </td>
                        </tr>
                      </table>
                      {/* <!-- End Upcoming News --> */}
                      {/* <!-- Upcoming Article --> */}
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                        style={style.widthTablePartMargin}
                      >
                        <tr>
                          <td>
                            {/* <!--title each part--> */}
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.tableTitlePart}
                            >
                              <tr>
                                <td style={style.pb36}></td>
                              </tr>

                              <tr>
                                <td style={style.titleEnglish}>
                                  Upcoming Article
                                </td>
                              </tr>
                              <tr>
                                <td style={style.titleJapan}>今後の記事</td>
                              </tr>
                            </table>
                            {/* <!--end title each part--> */}
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.fullWidth}
                            >
                              {/* <!--top item--> */}
                              {dataArticles &&
                                dataArticles.map((item, index) => (
                                  index === 0 ? (
                                    <tr>
                                      <td style={style.itemTopWrapper}>
                                        <a
                                          href={BASE_URL_EC + "article/" + item.url}
                                          target="_blank"
                                          style={style.linkDecoration}
                                        >
                                          <table style={style.fullWidth}>
                                            <tr style={style.fullWidthTopAlign}>
                                              <GetArticleImage article={item.image} />
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td>
                                                <table style={style.noBorderSpacing}>
                                                  <tr style={style.fullWidthTopAlign}>
                                                    <td style={style.dateItemTop}>
                                                      {moment(item.release_date).format("yyyy/MM/DD")}
                                                    </td>
                                                  </tr>
                                                  <tr style={style.fullWidthTopAlign}>
                                                    <td style={style.titleItemTop}>
                                                      {item.title}
                                                    </td>
                                                  </tr>
                                                  <tr style={style.fullWidthTopAlign}>
                                                    <td style={style.descNews}>
                                                      {getHtml(item.content).substring(0, 134)}...
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </a>
                                      </td>
                                    </tr>) : null
                                ))}
                              {/* <!-- end top item--> */}
                              {/* <!--list item--> */}
                              {dataArticles &&
                                dataArticles.map((item, index) => (
                                  index !== 0 ? (
                                    <tr key={index}>
                                      <td style={style.itemWrapper}>
                                        <a
                                          href={BASE_URL_EC + "article/" + item.url}
                                          target="_blank"
                                          style={style.linkDecoration}
                                        >
                                          <table style={style.fullWidth}>
                                            <td style={style.imageItemNews}>
                                              <GetArticleImage article={item.image} />
                                            </td>
                                            <td style={style.itemDescWrapper}>
                                              <table style={style.noBorderSpacing}>
                                                <tr style={style.fullWidthTopAlign}>
                                                  <td style={style.dateItem}>
                                                    {moment(item.release_date).format("yyyy/MM/DD")}
                                                  </td>
                                                </tr>
                                                <tr style={style.fullWidthTopAlign}>
                                                  <td style={style.titleItem}>
                                                    {item.title}
                                                  </td>
                                                </tr>
                                              </table>
                                            </td>
                                          </table>
                                        </a>
                                      </td>
                                    </tr>
                                  ) : null
                                ))}
                              {/* <!-- end list item --> */}
                            </table>
                          </td>
                        </tr>
                      </table>
                      {/* <!-- End Upcoming Article --> */}
                      {/* <!-- line bottom --> */}
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        style={style.widthTableRadius}
                      >
                        <tr>
                          <td style={style.p0}></td>
                        </tr>
                      </table>
                      {/* <!-- end line bottom --> */}
                      {/* <!--Footer--> */}
                      <table
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#f5f5f5"
                        style={style.footerWrapper}
                      >
                        <tr>
                          <td>
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.footerTable}
                            >
                              <tr>
                                <td style={style.footerSns1}>
                                  {/* <a
                                    href="#"
                                    target="_blank"
                                  > */}
                                    <img
                                      src="https://handmate.io/resources/handmate/img/sns-ig.png"
                                      alt="instagram"
                                      style={style.snsWidth}
                                    />
                                  {/* </a> */}
                                </td>
                                <td style={style.footerSns2}>
                                  {/* <a
                                    href="#"
                                    target="_blank"
                                  > */}
                                    <img
                                      src="https://handmate.io/resources/handmate/img/sns-tw.png"
                                      alt="twitter"
                                      style={style.snsWidth}
                                    />
                                  {/* </a> */}
                                </td>
                                <td style={style.footerSns3}>
                                  {/* <a
                                    href="#"
                                    target="_blank"
                                  > */}
                                    <img
                                      src="https://handmate.io/resources/handmate/img/sns-fb.png"
                                      alt="facebook"
                                      style={style.snsWidth}
                                    />
                                  {/* </a> */}
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellspacing="0"
                              cellpadding="0"
                              style={style.footerTextTable}
                            >
                              <tr>
                                <td>
                                  <a href={BASE_URL_EC +'home'} target="_blank">
                                    <img
                                      src={BASE_URL_CMS + "images/artwithme.png"}
                                      width="200"
                                      border="0"
                                      alt="artwithme-logo"
                                    />
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td style={style.footerText}>
                                  本メールは送信専用メールアドレスから配信しております。このメールの登録を解除するには、
                                  <a
                                    href={BASE_URL_EC + "account/notification"}
                                    style={style.footerText2}
                                    target="_blank"
                                  >ここ</a>をクリックしてください。{" "}
                                </td>
                              </tr>
                              <tr>
                                <td style={style.footerText3}>
                                  ©2023 ART WITH ME
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      {/* <!-- End Footer --> */}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          {/* <!-- End Main --> */}
        </td>
      </tr>
    </table>
  );
}
export default PreviewMailTesting;