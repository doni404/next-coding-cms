import React from "react";

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
    padding: "32px 16px 18px",
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
    borderRadius: "7px 7px 0 0",
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
    padding: "0 16px 14px",
  },
  tableTitlePart: {
    textAlign: "center",
    paddingBottom: "16px",
    width: "100%",
  },
  divider: {
    borderTop: "1px solid #bcbebd",
    paddingBottom: "36px",
  },
  titleEnglish: {
    fontSize: "14px",
    color: "#F45E2A",
  },
  titleJapan: {
    fontSize: "24px",
    color: "#1e2d44",
    paddingTop: "2px",
    paddingBottom: "10px",
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
  imageItemFull: {
    width: "100%",
    paddingBottom: "10px",
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
    padding: 0,
  },
  titleItemTop: {
    width: "100%",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "7px 0 8px",
    color: "#191a1c",
  },
  DescItem: {
    width: "100%",
    fontSize: "14px",
    color: "#191a1c",
  },
  itemWrapper: {
    width: "100%",
    padding: "0 0 12px",
  },
  imageItem: {
    width: "25%",
    verticalAlign: "top",
    maxWidth: "25%",
  },
  itemDescWrapper: {
    width: "75%",
    verticalAlign: "top",
    paddingLeft: "12px",
  },
  titleItem: {
    width: "100%",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "6px 0 6px",
    color: "#191a1c",
  },
  widthTablePartMargin: {
    width: "100%",
    maxWidth: "450px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 0,
    padding: "0 16px 14px",
    marginTop: "20px",
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
    marginTop: "20px",
    paddingBottom: "15px",
    maxWidth: "450px",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
  },
  footerTable: {
    margin: "10px auto 22px",
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
    color: "#F45E2A",
    textDecoration: "none",
  },
  footerText3: {
    fontSize: "14px",
    color: "#191a1c",
    paddingBottom: "20px"
  },
};

import { useState, useEffect } from "react";
import axios from 'axios'

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;
export const BASE_URL_EC = process.env.REACT_APP_BASE_URL_EC;
export const BASE_URL_CMS = process.env.REACT_APP_BASE_URL_CMS;

function PreviewMail (data) {
  const [topTitle, setTopTitle] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [intro, setIntro] = useState('');

  useEffect(() => {
    const token = window.sessionStorage.getItem('token')
    const header = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(BASE_URL_API + "v1/mail_magazine/" + data.data.id, header)
      .then(async response => {
        setTopTitle(response.data.data.topTitle)
        setTitle(response.data.data.title)
        setSubtitle(response.data.data.subtitle)
        setIntro(response.data.data.opening_text)
      })
      .catch(err => {
      })
  }, [data])
    return (
      <table style={style.backgroundTable}>
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
                                      src="/images/artwithme.png"
                                      width="250"
                                      border="0"
                                      alt="handmate-logo"
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td style={style.topDate}>
                                    {topTitle}
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
                                style={style.fullWidthCenter}
                              >
                                <tr>
                                  <td style={style.p0}>
                                    <img
                                      src="https://src.handmate.io/public/mail-top-line_1.jpg"
                                      height="16"
                                      alt="line"
                                      style={style.lineTop}
                                    />
                                  </td>
                                </tr>
                              </table>

                              <table
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                                style={style.tableStyle1}
                              >
                                <tr>
                                  <td style={style.title}>
                                    {title}
                                  </td>
                                </tr>

                                <tr>
                                  <td style={style.subtitle}>
                                   {subtitle}
                                  </td>
                                </tr>

                                <tr>
                                  <td style={style.intro}>
                                    {intro}
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        {/* <!-- End Template Header --> */}

                        {/* <!-- New Upcoming news --> */}
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
                                    Upcoming News
                                  </td>
                                </tr>
                                <tr>
                                  <td style={style.titleJapan}>
                                    今後のワークショップ
                                  </td>
                                </tr>
                              </table>

                              <table
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                                style={style.fullWidth}
                              >
                                {/* <!--top item--> */}
                                <tr>
                                  <td style={style.itemTopWrapper}>
                                    <a
                                      href="#"
                                      target="_blank"
                                      style={style.linkDecoration}
                                    >
                                      <table style={style.fullWidth}>
                                        <tr style={style.fullWidthTopAlign}>
                                          <img
                                            src="https://dev-src.handmate.io/workshop_thumb/20220720-104738-226.jpg"
                                            alt="workshop"
                                            onerror="this.src='../resources/images/no_photo.jpg';"
                                            style={style.imageItemFull}
                                          />
                                        </tr>
                                        <tr style={style.fullWidthTopAlign}>
                                          <td>
                                            <table
                                              style={style.noBorderSpacing}
                                            >
                                              <tr
                                                style={style.fullWidthTopAlign}
                                              >
                                                <td style={style.p0}>
                                                  <table
                                                    style={
                                                      style.noBorderSpacing
                                                    }
                                                  >
                                                    <tr>
                                                      <td
                                                        style={style.dateItem}
                                                      >
                                                        2022/07/23
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </td>
                                              </tr>
                                              <tr
                                                style={style.fullWidthTopAlign}
                                              >
                                                <td style={style.titleItemTop}>
                                                  title item
                                                </td>
                                              </tr>
                                              <tr
                                                style={style.fullWidthTopAlign}
                                              >
                                                <td style={style.DescItem}>
                                                  item desciption field will put
                                                  here
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </a>
                                  </td>
                                </tr>
                                {/* <!--list item--> */}
                                <tr>
                                  <td style={style.itemWrapper}>
                                    <a
                                      href="#"
                                      target="_blank"
                                      style={style.linkDecoration}
                                    >
                                      <table style={style.fullWidth}>
                                        <td style={style.imageItem}>
                                          <img
                                            src="https://dev-src.handmate.io/workshop_thumb/20220712-113025-58.jpg"
                                            alt="workshop"
                                            onerror="this.src='../resources/images/no_photo.jpg';"
                                            style={style.fullWidth}
                                          />
                                        </td>
                                        <td style={style.itemDescWrapper}>
                                          <table style={style.noBorderSpacing}>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.p0}>
                                                <table
                                                  style={style.noBorderSpacing}
                                                >
                                                  <tr>
                                                    <td style={style.dateItem}>
                                                      2022/07/23
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.titleItem}>
                                                title item 2nd
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.DescItem}>
                                                item desciption field will put
                                                here
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </table>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={style.itemWrapper}>
                                    <a
                                      href="#"
                                      target="_blank"
                                      style={style.linkDecoration}
                                    >
                                      <table style={style.fullWidth}>
                                        <td style={style.imageItem}>
                                          <img
                                            src="https://dev-src.handmate.io/workshop_thumb/20220712-113025-58.jpg"
                                            alt="workshop"
                                            onerror="this.src='../resources/images/no_photo.jpg';"
                                            style={style.fullWidth}
                                          />
                                        </td>
                                        <td style={style.itemDescWrapper}>
                                          <table style={style.noBorderSpacing}>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.p0}>
                                                <table
                                                  style={style.noBorderSpacing}
                                                >
                                                  <tr>
                                                    <td style={style.dateItem}>
                                                      2022/07/23
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.titleItem}>
                                                title item 2nd
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.DescItem}>
                                                item desciption field will put
                                                here
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </table>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={style.itemWrapper}>
                                    <a
                                      href="#"
                                      target="_blank"
                                      style={style.linkDecoration}
                                    >
                                      <table style={style.fullWidth}>
                                        <td style={style.imageItem}>
                                          <img
                                            src="https://dev-src.handmate.io/workshop_thumb/20220712-113025-58.jpg"
                                            alt="workshop"
                                            onerror="this.src='../resources/images/no_photo.jpg';"
                                            style={style.fullWidth}
                                          />
                                        </td>
                                        <td style={style.itemDescWrapper}>
                                          <table style={style.noBorderSpacing}>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.p0}>
                                                <table
                                                  style={style.noBorderSpacing}
                                                >
                                                  <tr>
                                                    <td style={style.dateItem}>
                                                      2022/07/23
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.titleItem}>
                                                title item 2nd
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.DescItem}>
                                                item desciption field will put
                                                here
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </table>
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        {/* <!-- End Upcoming news --> */}
                        {/* <!--Upcoming article--> */}
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
                                  <td style={style.titleJapan}>
                                    今後のワークショップ
                                  </td>
                                </tr>
                              </table>

                              <table
                                border="0"
                                cellspacing="0"
                                cellpadding="0"
                                style={style.fullWidth}
                              >
                                {/* <!--top item--> */}
                                <tr>
                                  <td style={style.itemTopWrapper}>
                                    <a
                                      href="#"
                                      target="_blank"
                                      style={style.linkDecoration}
                                    >
                                      <table style={style.fullWidth}>
                                        <tr style={style.fullWidthTopAlign}>
                                          <img
                                            src="https://dev-src.handmate.io/workshop_thumb/20220720-104738-226.jpg"
                                            alt="workshop"
                                            onerror="this.src='../resources/images/no_photo.jpg';"
                                            style={style.imageItemFull}
                                          />
                                        </tr>
                                        <tr style={style.fullWidthTopAlign}>
                                          <td>
                                            <table
                                              style={style.noBorderSpacing}
                                            >
                                              <tr
                                                style={style.fullWidthTopAlign}
                                              >
                                                <td style={style.p0}>
                                                  <table
                                                    style={
                                                      style.noBorderSpacing
                                                    }
                                                  >
                                                    <tr>
                                                      <td
                                                        style={style.dateItem}
                                                      >
                                                        2022/07/23
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </td>
                                              </tr>
                                              <tr
                                                style={style.fullWidthTopAlign}
                                              >
                                                <td style={style.titleItemTop}>
                                                  title item
                                                </td>
                                              </tr>
                                              <tr
                                                style={style.fullWidthTopAlign}
                                              >
                                                <td style={style.DescItem}>
                                                  item desciption field will put
                                                  here
                                                </td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </a>
                                  </td>
                                </tr>
                                {/* <!--list item--> */}
                                <tr>
                                  <td style={style.itemWrapper}>
                                    <a
                                      href="#"
                                      target="_blank"
                                      style={style.linkDecoration}
                                    >
                                      <table style={style.fullWidth}>
                                        <td style={style.imageItem}>
                                          <img
                                            src="https://dev-src.handmate.io/workshop_thumb/20220712-113025-58.jpg"
                                            alt="workshop"
                                            onerror="this.src='../resources/images/no_photo.jpg';"
                                            style={style.fullWidth}
                                          />
                                        </td>
                                        <td style={style.itemDescWrapper}>
                                          <table style={style.noBorderSpacing}>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.p0}>
                                                <table
                                                  style={style.noBorderSpacing}
                                                >
                                                  <tr>
                                                    <td style={style.dateItem}>
                                                      2022/07/23
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.titleItem}>
                                                title item 2nd
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.DescItem}>
                                                item desciption field will put
                                                here
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </table>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={style.itemWrapper}>
                                    <a
                                      href="#"
                                      target="_blank"
                                      style={style.linkDecoration}
                                    >
                                      <table style={style.fullWidth}>
                                        <td style={style.imageItem}>
                                          <img
                                            src="https://dev-src.handmate.io/workshop_thumb/20220712-113025-58.jpg"
                                            alt="workshop"
                                            onerror="this.src='../resources/images/no_photo.jpg';"
                                            style={style.fullWidth}
                                          />
                                        </td>
                                        <td style={style.itemDescWrapper}>
                                          <table style={style.noBorderSpacing}>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.p0}>
                                                <table
                                                  style={style.noBorderSpacing}
                                                >
                                                  <tr>
                                                    <td style={style.dateItem}>
                                                      2022/07/23
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.titleItem}>
                                                title item 2nd
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.DescItem}>
                                                item desciption field will put
                                                here
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </table>
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={style.itemWrapper}>
                                    <a
                                      href="#"
                                      target="_blank"
                                      style={style.linkDecoration}
                                    >
                                      <table style={style.fullWidth}>
                                        <td style={style.imageItem}>
                                          <img
                                            src="https://dev-src.handmate.io/workshop_thumb/20220712-113025-58.jpg"
                                            alt="workshop"
                                            onerror="this.src='../resources/images/no_photo.jpg';"
                                            style={style.fullWidth}
                                          />
                                        </td>
                                        <td style={style.itemDescWrapper}>
                                          <table style={style.noBorderSpacing}>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.p0}>
                                                <table
                                                  style={style.noBorderSpacing}
                                                >
                                                  <tr>
                                                    <td style={style.dateItem}>
                                                      2022/07/23
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.titleItem}>
                                                title item 2nd
                                              </td>
                                            </tr>
                                            <tr style={style.fullWidthTopAlign}>
                                              <td style={style.DescItem}>
                                                item desciption field will put
                                                here
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </table>
                                    </a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        {/* <!-- End Upcoming article --> */}
                        {/* line bottom */}
                        <table
                          border="0"
                          cellspacing="0"
                          cellpadding="0"
                          style={style.widthTable}
                        >
                          <tr>
                            <td style={style.p0}>
                              <img
                                src="https://src.handmate.io/public/mail-top-line_1.jpg"
                                height="16"
                                alt=""
                                style={style.lineBottom}
                              />
                            </td>
                          </tr>
                        </table>
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
                                      href=""
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
                                      href=""
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
                                      href=""
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
                                        src="/images/artwithme.png"
                                        width="200"
                                        border="0"
                                        alt="artwithme-logo"
                                      />
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td style={style.footerText}>
                                    本メールは送信専用メールアドレスから配信しております。メールマガジンの配信停止は
                                    <a
                                      href={BASE_URL_EC + "account/login/"}
                                      style={style.footerText2}
                                    >
                                      マイページ
                                    </a>
                                    の通知設定から設定ください。
                                  </td>
                                </tr>
                                <tr>
                                  <td style={style.footerText3}>
                                    ©2023 ART WITH ME Corp.
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
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
export default PreviewMail;