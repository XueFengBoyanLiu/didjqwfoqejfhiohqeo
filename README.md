# PKU全校课表可视化

### 目录结构
- /
  - visualization/
    - d3.v5.min.js d3.js 第5版，精简
    - d3.v7.min.js d3.js 第7版，精简
    - jquery-3.7.0.min.js jQuery 3.7.0 精简
    - main.html 主界面
    - script_graph.js 主界面四张图绘制
    - script_selchg.js 选择栏事件监听回调函数
    - script.js 课程冲突图绘制与初始化
    - style.css 样式表
  - read_database.ipynb           basic data washing
  - funcs.py                      some functions 
  - startserver.bat               open a local server
  - data_cleaning.py              .py version of read_database.ipynb
  - funcs_2.py                    WHH's functions (to be continued by him)
  - server.py                     connections between server and python, containing APIs
  - requirements.txt 服务端启动依赖

### 项目部署方式
1. 请安装flask，至少2.3.0版本或更高。同时要求Python至少3.9版本。推荐方法：
```sh
pip install flask==2.3.3
```
2. 运行./startserver.bat或./startserver.sh，或者直接运行
```sh
flask --app server run --debug --host=<host> --port=<port>
```
然后访问127.0.0.1:*\<your port\>* 即可。默认端口是5000。请注意，在Linux系统，使用小于1024的端口可能需要root权限，且不论在何种系统，已被占用的端口都不再能被使用。

**请注意: 请不要在公网环境下以--debug参数运行flask，否则安全隐患极大，后果自负！尽管编写的时候我们注意了后端对前端传递的参数进行检查，但是不能保证万无一失，因此在公网环境部署请务必小心！**

### 数据来源
本数据来自北京大学教务部全校课表查询，使用爬虫进行采集。

https://dean.pku.edu.cn/service/web/courseSearch.php

### 功能说明
1. 选择菜单
- 可以选择年份区间
- 可以选择春季、秋季、暑期学期中的一个或多个
- 对于饼图，可以选择课程类型中的一个或多个

2. 图表设计
- 第一幅图是总览，可以看到选择的数据范围中的开课总数的变化趋势。
- 第二幅图是课程类型，可以看到选择的数据范围中各种课程的比重，鼠标悬浮可以看到具体数值。
- 第三幅图是课时分布，可以看到不同课时课程数量的分布
- 第四幅图是课程时间热度，可以看到一周中各个时段的课程热度情况，鼠标悬浮可以看到具体开课数目。

3. 冲突分析
- 输入课程号，可以搜索一门指定的课程和选定范围中所有课程的冲突关系。可视化结果是一张网络，距离中间越近，说明课程冲突评分越大。鼠标悬浮可以看到具体课程名称。

- 两门课各自部分相撞、全部相撞、互相包含的冲突关系都有加权性质的评分。统计过程中，每个学期的冲突情况各自考虑，将冲突评分累加得到该课程相对于最初指定课程的冲突评分。

- 基于统计意义考虑，仅绘制了所有冲突课程的冲突评分在前95%的课程。


### 项目意义
通过可视化课程分布和冲突情况，我们希望同学们和老师们能够合理安排课程学习，特别是对于有辅修双学位学习计划的的同学，能够帮助他们尽量避免课程冲突。

### 数据清洗

本项目对于爬取的教务部数据，在read_database.ipynb中进行了字符串的预处理，以更好实现分类筛选的功能。

处理时，会在之前先使用unique函数确认不会出现异常值。

对于部分缺失数据，(例如，部分课程没有安排上课时间、起始周)，统一记为0。如此不会影响数据分析。

### 项目分工
- 刘泊岩（组长）：统筹规划，进行网页设计和d3.js可视化代码编写等。

- 徐臻：负责数据处理，后端API编写、代码逻辑优化、提供前端易于处理的数据，参与控件编写、回传参数检查、前后端通信等。

- 李博海：负责数据集爬取，后端API协议设计和编写，前端与后端的通信，以及兼容性问题和前端可视化bug修复。

- 王鸿辉：负责数据处理，进行d3.js可视化代码编写等。
