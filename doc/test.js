'use strict';
const { get, find } = require('lodash');

module.exports = () =>
  async function Auth(ctx, next) {
    const customId = ctx.customId;
    // 暂时通过域名中的 "ke" 判断是否通用版
    const isCustom = customId === 'ke';

    // 设置默认用户信息
    ctx.locals.user = { roles: [] };

    if (!isCustom)  {
      try {
        const platformInfo = await ctx.callAPI('GET_PLATFORM_INFO');
        const {data, platformType, platformUid, name = '录播实验小学'} = platformInfo.data;
        ctx.locals.user.videoReview = data.config.vodApprovingEnabled;
        ctx.locals.customData.platformType = platformType;
        ctx.locals.customData.isSchoolPlatform = platformType === 2;
        ctx.locals.customData.webTitle = name;
        ctx.locals.customData.platformUid = platformUid;
      } catch (error) {
        console.log(error);
      }
    }

    const token = ctx.token;
    if (token) {
      try {
        const userResult = await ctx.callAPI('GET_USER_INFO');
        //有 token 但失效，要求重新登录
        if (get(userResult, 'data.code') === 200) {
          // 已经登录
          const user = userResult.data.data;

          // 获取权限信息
          const params = { userUid: user.uid };
          // 用户登录通用版，若属于某区域版，则跳转到对应区域版；若不属于任何区域版，则显示默认页面
          if (isCustom) {
            const platformAuthResult = await ctx.callAPI('GET_PLATFORM_AUTH', { params });
            const data = platformAuthResult.data.data;
            if (data.platforms && data.platforms.length) {
              await ctx.redirect(`http://${data.platforms[0].domain}`);
            } else {
              return await ctx.render('customDefault');
            }
          }

          const roleResult = await ctx.callAPI('GET_MYROLES', { params });

          if (get(roleResult, 'data.code') === 200) {
            user.roles = roleResult.data.data;
          } else {
            user.roles = [];
          }

          const isTeacher = user.roles.filter((x) => x.roleCode === '100').length > 0;
          const isSchoolManager = user.roles.filter((x) => x.roleCode === '101').length > 0;
          const isAdmin = user.roles.filter((x) => ['200', '201', '202', '203'].includes(x.roleCode)).length > 0;
          const isAuthAdmin = user.roles.filter((x) => x.roleCode === '201' || x.roleCode === '200').length > 0;
          const isManageAdmin = user.roles.filter((x) => x.roleCode === '202' || x.roleCode === '200').length > 0;
          const isLiveAdmin = user.roles.filter((x) => x.roleCode === '203' || x.roleCode === '200').length > 0;
          const isSchoolPlatform = ctx.locals.customData.isSchoolPlatform;

          const hasManageAuth = isTeacher || isSchoolManager || isManageAdmin || isAuthAdmin;
          if (!hasManageAuth && /^\/(manage)/g.test(ctx.path)) {
            ctx.body = '无访问权限';
            return;
          }

          user.auth = { isTeacher, isSchoolManager, isAdmin, isAuthAdmin, isLiveAdmin, isManageAdmin };
          user.areaAuth = find(user.roles, (x) => x.areaCode) || {};

          // 设置权限列表，并取值为 true 的 keys
          const authList = {
            overview: !isSchoolPlatform && isAdmin,
            manage: isManageAdmin || isTeacher || isSchoolManager || isAuthAdmin,
            courseLive: isLiveAdmin || ( !isSchoolPlatform && isTeacher) || isSchoolManager,
            livePatrol: isAdmin || isTeacher || isSchoolManager,
            messageCenter:isAdmin || isTeacher,
            publishVideo: isTeacher,
            teacherCourse: !isSchoolPlatform,
          }
          user.authList = Object.keys(authList).filter(x=>authList[x]);

          const visitHome = /^\/(home)/g.test(ctx.path) || ctx.path === '/';

          if(isSchoolPlatform){
            //不是校管访问专递课堂，同时访问的不是督导巡课
            const courseLiveValidate = (!isSchoolManager && /^\/courselive/g.test(ctx.path) && !(/\/courselive\/patrol(\/.+)?$/g.test(ctx.path)));
            //访问名校，但访问的不是名校详情页
            const schoolValidate = /^\/school/g.test(ctx.path) && !(/\/school\/.+$/g.test(ctx.path));
            //访问名师，但访问的不是名师详情页
            const teacherValidate = /^\/teacher/g.test(ctx.path) && !(/\/class\/.+$/g.test(ctx.path));
            //访问教研活动管理
            const manageValidate = /^\/manage\/my-activities/g.test(ctx.path);

            if(visitHome || courseLiveValidate || schoolValidate){
              await ctx.response.redirect(`/school/${ctx.locals.customData.platformUid}`);
            }

            if(teacherValidate){
              await ctx.response.redirect(`/teacher/class/${user.uid}`);
            }

            if(manageValidate){
              await ctx.response.redirect(`/manage/create-live`);
            }

          }else {
            //区域平台
            // 如果不是管理员并访问数据看板，重定向到名师
            if (!isAdmin && visitHome) {
              await ctx.response.redirect('/teacher');
            }

            // 如果不是管理员并访问数据看板，重定向到名师
            if (!isAuthAdmin && !isSchoolManager && /^\/(admin)/g.test(ctx.path)) {
              await ctx.response.redirect('/teacher');
            }

            // 如果不是校管理员、教师、专递课堂管理员，并访问专递课堂，重定向到名师
            if (!(isTeacher || isSchoolManager || isLiveAdmin) && /^\/(courselive\/[list/calendar])/g.test(ctx.path)) {
              await ctx.response.redirect('/teacher');
            }
          }

          ctx.locals.user = Object.assign({}, ctx.locals.user, user);
          await next();
        } else {
          // 如果 token 失效，跳转到登录页
          ctx.clearToken();
          await ctx.response.redirect('/login');
        }
      } catch (error) {
        ctx.clearToken();
        await ctx.response.redirect('/login');
      }
    } else {
      if (isCustom) {
        await ctx.response.redirect('/login');
      }

      if(ctx.locals.customData.isSchoolPlatform){
        // 名校内页、名师内页、课程详情，可直接进入
        if (/^\/(school\/.+$|teacher\/class\/.+$)/g.test(ctx.path)) {
          await next();
        } else {
          // 未登录的，统一跳到名校内页
          await ctx.response.redirect(`/school/${ctx.locals.customData.platformUid}`);
        }
      }else{
        // 名师、名校页面，可直接进入
        if (/^\/(school|teacher|open)/g.test(ctx.path)) {
          await next();
        } else {
          // 未登录的，统一跳到名师课堂
          await ctx.response.redirect('/teacher');
        }
      }   
    }
  };
