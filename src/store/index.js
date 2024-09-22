// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import admin from 'src/store/apps/admin'
import admin_roles from 'src/store/apps/admin_roles'
import account from "src/store/apps/account"
import news from 'src/store/apps/news'
import reservation from "src/store/apps/reservation"
import collection from "src/store/apps/collection"
import notification from 'src/store/apps/notification'
import order from 'src/store/apps/order'
import news_media from 'src/store/apps/news_media'
import article from 'src/store/apps/article'
import article_image from 'src/store/apps/article_image'
import faq from 'src/store/apps/faq'
import mail_template from 'src/store/apps/mail_template'
import guide from 'src/store/apps/guide'
import guide_image from 'src/store/apps/guide_image'
import category from 'src/store/apps/category'
import article_series from 'src/store/apps/article_series'
import faq_category from 'src/store/apps/faq_category'
import guide_category from 'src/store/apps/guide_category'
import student from 'src/store/apps/student'
import student_point_history from 'src/store/apps/student_point_history'
import teacher from 'src/store/apps/teacher'
import teacher_video from 'src/store/apps/teacher_video'
import teacher_lesson_history from 'src/store/apps/teacher_lesson_history'
import course from 'src/store/apps/course'
import timezones from 'src/store/apps/timezones'
import video_news from 'src/store/apps/video_news'
import student_certificates from 'src/store/apps/student_certificates'
import dashboard from 'src/store/apps/dashboard'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    admin,
    admin_roles,
    account,
    news,
    reservation,
    collection,
    order,
    news_media,
    notification,
    article,
    article_image,
    faq,
    faq_category,
    mail_template,
    guide,
    guide_image,
    category,
    article_series,
    guide_category,
    student,
    student_point_history,
    teacher,
    teacher_video,
    teacher_lesson_history,
    course,
    timezones,
    video_news,
    student_certificates,
    dashboard,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
