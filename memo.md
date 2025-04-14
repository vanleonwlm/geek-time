https://time.geekbang.com/course/intro/100637901 视频课未存储文章内容，即有视频，又有文章

https://time.geekbang.com/course/detail/101015101-861825 视频课，m3u8文件分析

小马哥讲Spring核心编程思想

---

已经购买的专栏：
100636901,101015101,100841001,100020801,100023901,100017001,100057601,100017301,100002201,100039001,100035801,100035501,100025301,100024801,100102001,100082001,100042601,100065901,100541101,100310101,100548101,100064201,100069501,100060101,100310901,100671401,100069301

---

破解m3u8视频文件

POST /serv/v3/article/info, 
- 通过 info.video.id 获取视频 id: f0911f7a046671f0bffb4531859c0102
- 通过 info.video.hls_vid 获取 hls 视频 id: 603a313a046871f0b3654531949c0402
- 通过 hls_medias 获取视频源
    - hd：https://media001.geekbang.org/603a313a046871f0b3654531949c0402/ddaeb28bf31849c1c210cd9134330239-sd-encrypt-stream.m3u8?MtsHlsUriToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiYTU5YTkwZTA5NmFjMDYyNzJlMDYwNGNkNDVkNzk3NzZlZmNhMWE4OCIsImV4cCI6MTc0NDYwMzk2OTY4NiwiZXh0cmEiOnsidmlkIjoiNjAzYTMxM2EwNDY4NzFmMGIzNjU0NTMxOTQ5YzA0MDIiLCJhaWQiOjg2MTgyOSwidWlkIjoxMDkzNjY2LCJzIjoiIn0sInMiOjIsInQiOjEsInYiOjF9.dhpZOnQ7miGktSrnhv_oM5kHWfw7JHIzRZQOAZ_30WY
    - 格式：https://media001.geekbang.org/{hls_vid}/{m3u8_id}.m3u8
    - m3u8: https://media001.geekbang.org/f0911f7a046671f0bffb4531859c0102/a8f365cade6946a88aa86769e90c6b14-527d17ff77b90f985a8ad9baf164b76d-hd-encrypt-stream.m3u8

- 最终 ts 文件：https://media001.geekbang.org/f0911f7a046671f0bffb4531859c0102/a8f365cade6946a88aa86769e90c6b14-527d17ff77b90f985a8ad9baf164b76d-hd-encrypt-stream-00001.ts
