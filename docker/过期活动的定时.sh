####################过期活动的定时####################

# 明星小店(星店长)
0 1,21 * * * node /scripts/jd_star_shop.js >> /scripts/logs/jd_star_shop.log 2>&1

# crazyJoy自动每日任务
30 7,23 * * * node /scripts/jd_crazy_joy.js >> /scripts/logs/jd_crazy_joy.log 2>&1

#监控crazyJoy分红
10 12 * * * node /scripts/jd_crazy_joy_bonus.js >> /scripts/logs/jd_crazy_joy_bonus.log 2>&1

# 欧洲狂欢杯 活动时间：###
0 5,10,11 * * * node /scripts/jd_europeancup.js >> /scripts/logs/jd_europeancup.log 2>&1

# 京喜领88元红包(已结束)
#30 1,6,12,21 * * * node /scripts/jd_jxlhb.js >> /scripts/logs/jd_jxlhb.log 2>&1

# 跳跳乐瓜分京豆(已结束)
#15 0-23/2 * * * node /scripts/jd_jump.js >> /scripts/logs/jd_jump.log 2>&1

# 宠汪汪强制为别人助力(旧版.不可用)
#15 10 * * * node /scripts/jd_joy_help.js >> /scripts/logs/jd_joy_help.log 2>&1

# 京东手机狂欢城(已结束)
#0 0,12,18,21 * * * node /scripts/jd_carnivalcity.js >> /scripts/logs/jd_carnivalcity.log 2>&1

# 新潮品牌狂欢(已结束)
#20 1,21 * * * node /scripts/jd_mcxhd.js >> /scripts/logs/jd_mcxhd.log 2>&1

# 家电星推官(已结束)
#0 0 * * * node /scripts/jd_xtg.js >> /scripts/logs/jd_xtg.log 2>&1

# 家电星推官好友互助(已结束)
#0 0 * * * node /scripts/jd_xtg_help.js >> /scripts/logs/jd_xtg_help.log 2>&1

# 618动物联萌(已结束)
#36 0,6-23/2 * * * node /scripts/jd_zoo.js >> /scripts/logs/jd_zoo.log 2>&1

# 618动物联萌收金币(已结束)
#0-59/30 * * * * node /scripts/jd_zooCollect.js >> /scripts/logs/jd_zooCollect.log 2>&1




