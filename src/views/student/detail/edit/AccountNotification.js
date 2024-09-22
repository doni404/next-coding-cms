// ** React Imports
import React, { Fragment, useState, useEffect } from "react";

// ** MUI Imports
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import axios from "axios";

import toast from "react-hot-toast";

export const BASE_URL_API = process.env.REACT_APP_BASE_URL_API;

const AccountNotification = ({ data }) => {
  const dataResponse = data;

  const [login, setLogin] = useState(null)
  const [registerArtwork, setRegisterArtwork] = useState(null)
  const [purchaseArtwork, setPurchaseArtwork] = useState(null)
  const [favouriteArtwork, setFavouriteArtwork] = useState(null)
  const [mailMagazine, setMailMagazine] = useState(null)
  const [mailNotice, setMailNotice] = useState(null)
  const token = window.sessionStorage.getItem('token')

  const getNotifData = async () => {
    axios.get(BASE_URL_API + 'v1/accounts/' + dataResponse.id, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((res) => {
        setLogin(res.data.data.notif_login === 'yes' ? true : false)
        setRegisterArtwork(res.data.data.notif_register_artwork === 'yes' ? true : false)
        setPurchaseArtwork(res.data.data.notif_purchase_artwork === 'yes' ? true : false)
        setFavouriteArtwork(res.data.data.notif_favourite_artwork === 'yes' ? true : false)
        setMailMagazine(res.data.data.notif_mail_magazine === 'yes' ? true : false)
        setMailNotice(res.data.data.notif_mail_notice === 'yes' ? true : false)
      })
      .catch((error) => {
        console.log("error ", error)
        if (error.response.status === 401) {
          router.replace('/401')
        }
      })
  }
  useEffect(() => {
    getNotifData()
  }, []);
  const handleChange = (event) => {

    const request = {
      "notif_login": login ? 'yes' : 'no',
      "notif_register_artwork": registerArtwork ? 'yes' : 'no',
      "notif_purchase_artwork": purchaseArtwork ? 'yes' : 'no',
      "notif_favourite_artwork": favouriteArtwork ? 'yes' : 'no',
      "notif_mail_magazine": mailMagazine ? 'yes' : 'no',
      "notif_mail_notice": mailNotice ? 'yes' : 'no',
    }

    if (event.target.name === 'login') {
      request = {
        "notif_login": event.target.checked ? 'yes' : 'no',
        "notif_register_artwork": registerArtwork ? 'yes' : 'no',
        "notif_purchase_artwork": purchaseArtwork ? 'yes' : 'no',
        "notif_favourite_artwork": favouriteArtwork ? 'yes' : 'no',
        "notif_mail_magazine": mailMagazine ? 'yes' : 'no',
        "notif_mail_notice": mailNotice ? 'yes' : 'no',
      }
      setLogin(event.target.checked)
    }
    if (event.target.name === 'registerArtwork') {
      request = {
        "notif_login": login ? 'yes' : 'no',
        "notif_register_artwork": event.target.checked ? 'yes' : 'no',
        "notif_purchase_artwork": purchaseArtwork ? 'yes' : 'no',
        "notif_favourite_artwork": favouriteArtwork ? 'yes' : 'no',
        "notif_mail_magazine": mailMagazine ? 'yes' : 'no',
        "notif_mail_notice": mailNotice ? 'yes' : 'no',
      }
      setRegisterArtwork(event.target.checked)
    }
    if (event.target.name === 'purchaseArtwork') {
      request = {
        "notif_login": login ? 'yes' : 'no',
        "notif_register_artwork": registerArtwork ? 'yes' : 'no',
        "notif_purchase_artwork": event.target.checked ? 'yes' : 'no',
        "notif_favourite_artwork": favouriteArtwork ? 'yes' : 'no',
        "notif_mail_magazine": mailMagazine ? 'yes' : 'no',
        "notif_mail_notice": mailNotice ? 'yes' : 'no',
      }
      setPurchaseArtwork(event.target.checked)
    }
    if (event.target.name === 'favouriteArtwork') {
      request = {
        "notif_login": login ? 'yes' : 'no',
        "notif_register_artwork": registerArtwork ? 'yes' : 'no',
        "notif_purchase_artwork": purchaseArtwork ? 'yes' : 'no',
        "notif_favourite_artwork": event.target.checked ? 'yes' : 'no',
        "notif_mail_magazine": mailMagazine ? 'yes' : 'no',
        "notif_mail_notice": mailNotice ? 'yes' : 'no',
      }
      setFavouriteArtwork(event.target.checked)

    }
    if (event.target.name === 'mailMagazine') {
      request = {
        "notif_login": login ? 'yes' : 'no',
        "notif_register_artwork": registerArtwork ? 'yes' : 'no',
        "notif_purchase_artwork": purchaseArtwork ? 'yes' : 'no',
        "notif_favourite_artwork": favouriteArtwork ? 'yes' : 'no',
        "notif_mail_magazine": event.target.checked ? 'yes' : 'no',
        "notif_mail_notice": mailNotice ? 'yes' : 'no',
      }
      setMailMagazine(event.target.checked)
    }
    if (event.target.name === 'mailNotice') {
      request = {
        "notif_login": login ? 'yes' : 'no',
        "notif_register_artwork": registerArtwork ? 'yes' : 'no',
        "notif_purchase_artwork": purchaseArtwork ? 'yes' : 'no',
        "notif_favourite_artwork": favouriteArtwork ? 'yes' : 'no',
        "notif_mail_magazine": mailMagazine ? 'yes' : 'no',
        "notif_mail_notice": event.target.checked ? 'yes' : 'no',
      }
      setMailNotice(event.target.checked)
    }
    var axios = require("axios");
    var config = {
      method: "patch",
      url: BASE_URL_API + "v1/accounts/" + dataResponse.id + "/notifications",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: request,
    };

    axios(config)
      .then(function (response) {
        toast.success("通知設定が編集されました。");
      })
      .catch(function (error) {
        toast.error("通知設定が編集されませんでした。");
      });

    console.log("event.target.name", event.target.name);
    console.log("event.target.name", event.target.checked);
  };

  return (
    <Fragment>
      <Card>
        <Box sx={{ p: 5, pb: 10 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            通知設定
          </Typography>
          <Grid xs={12}>
            <TableContainer>
              <FormControl fullWidth component="fieldset" variant="standard">
                <FormGroup>
                  <Table sx={{ minWidth: 300 }}>
                    <TableBody>
                      <TableRow hover>
                        <TableCell><strong>ログイン通知</strong><br/><span>不正アクセス・不正ログインへの対策のためのログイン時メール通知機能です。</span></TableCell>
                        <TableCell
                          align="center"
                          sx={{ pt: "0 !important", pb: "0 !important" }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={login}
                                onChange={handleChange}
                                name="login"
                              />
                            }
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell><strong>作品登録完了通知</strong><br/><span>作品の登録が完了した際にお知らせする通知機能です。</span></TableCell>
                        <TableCell
                          align="center"
                          sx={{ pt: "0 !important", pb: "0 !important" }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={registerArtwork}
                                onChange={handleChange}
                                name="registerArtwork"
                              />
                            }
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell><strong>作品売買完了通知</strong><br/><span>作品の売買が完了した際にお知らせする通知機能です。</span></TableCell>
                        <TableCell
                          align="center"
                          sx={{ pt: "0 !important", pb: "0 !important" }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={purchaseArtwork}
                                onChange={handleChange}
                                name="purchaseArtwork"
                              />
                            }
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell><strong>いいね登録通知</strong><br/><span>作品を「いいね」登録した際にお知らせする通知機能です。</span></TableCell>
                        <TableCell
                          align="center"
                          sx={{ pt: "0 !important", pb: "0 !important" }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={favouriteArtwork}
                                onChange={handleChange}
                                name="favouriteArtwork"
                              />
                            }
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell><strong>メールマガジン</strong><br/><span>ART WITH MEが発行するメルマガの受け取り。</span></TableCell>
                        <TableCell
                          align="center"
                          sx={{ pt: "0 !important", pb: "0 !important" }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={mailMagazine}
                                onChange={handleChange}
                                name="mailMagazine"
                              />
                            }
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow hover>
                        <TableCell><strong>ART WITH MEからのお知らせ</strong><br/><span>ART WITH MEが発行するお知らせの受け取り。</span></TableCell>
                        <TableCell
                          align="center"
                          sx={{ pt: "0 !important", pb: "0 !important" }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={mailNotice}
                                onChange={handleChange}
                                name="mailNotice"
                              />
                            }
                            sx={{ m: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </FormGroup>
              </FormControl>
            </TableContainer>
          </Grid>
        </Box>
      </Card>
    </Fragment>
  );
};

export default AccountNotification;
