//logs.js
//const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog';
import Notify from '../../vant/notify/notify';
const app = getApp()
Page({
  data: {
    logs: [],
    pageNumber: 0,
    pageSize: 5,
    hasMoreData: true
  },
  onLoad: function() {
    this.setData({ //初始化分页信息
      logs: [],
      pageNumber: 0,
      pageSize: 5,
      hasMoreData: true
    })
    wx.showLoading({
      title: '加载中'
    })
    var that = this;
    wx.request({
      url: app.globalData.ip + 'crud',
      method: 'GET',
      data: {
        pageNumber: 0,
        pageSize: that.data.pageSize,
        sort: "DESC",
        field: "pubDate"
      },
      success: function(res) {
        console.log(res.data);

        wx.hideLoading();
        that.setData({
          logs: res.data
        })

      },
      fail: function(err) {
        console.log(err);

        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
      }
    })
  },
  //页面下拉。刷新
  onPullDownRefresh() {
    this.setData({ //初始化分页信息
      logs: [],
      pageNumber: 0,
      pageSize: 5,
      hasMoreData: true
    })
    wx.showLoading({
      title: '加载中'
    })
    var that = this;
    wx.request({
      url: app.globalData.ip + 'crud',
      method: 'GET',
      data: {
        pageNumber: 0,
        pageSize: that.data.pageSize,
        sort: "DESC",
        field: "pubDate"
      },
      success: function(res) {
        console.log(res.data);
        wx.hideLoading();
        that.setData({
          logs: res.data
        })
      },
      fail: function(err) {
        console.log(err);
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
      }
    })
  },

  //上划触顶 查找下一页
  onReachBottom: function() {
    if (this.data.hasMoreData) {
      this.getLogs('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
  // 获取下一页
  getLogs: function(message) {
    wx.showLoading({
      title: '加载中'
    })
    var that = this
    var datas = {
      pageNumber: that.data.pageNumber,
      pageSize: that.data.pageSize,
      sort: "DESC",
      field: "pubDate"
    }
    wx.request({
      url: app.globalData.ip + "crud",
      data: datas,
      success: res => {
        console.log(res)
        var logss = that.data.logs
        if (res.data != 0) {
          if (that.data.pageNumber == 0) {
            logss = []
          }
          var logs = res.data
          if (logs.length < that.data.pageSize) {
            that.setData({
              logs: logss.concat(logs),
              hasMoreData: false
            })
          } else {
            that.setData({
              logs: logss.concat(logs),
              hasMoreData: true,
              pageNumber: that.data.pageNumber + 1
            })
          }
          wx.hideLoading();
        } else {
          wx.showToast({
            title: ".......",
          })
          wx.hideLoading();
        }

      },
      fail: err => {
        wx.showToast({
          title: '加载数据失败',
        })
      }
    })
  },
  delete_inv: function(e) {
    //console.log(e.currentTarget.dataset.id)   //获取button按钮中绑定的属性值，用来删除该记录
    var invID = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '警告',
      content: '你确认要删除这条信息吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.ip + 'delete',
            method: 'GET',
            data: {
              invID: invID,
              session_key: wx.getStorageSync("session_key") //判断是否有权限删除
            },
            success: function(res) {
              console.log(res.data)
              if (res.data == 0) {
                Notify({
                  text: "您没有权限操作",
                  duration: 3000,
                  selector: '#custom-selector',
                  backgroundColor: '#1989fa'

                });
              } else {
                Notify({
                  text: "删除成功",
                  duration: 3000,
                  selector: '#custom-selector',
                  backgroundColor: '#1989fa'

                });
            
                that.onLoad(); //刷新页面
              }
            },
            fail: function(err) {
              Notify({
                text: "删除失败，请刷新重试",
                duration: 3000,
                selector: '#custom-selector',
                backgroundColor: '#1989fa'
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})