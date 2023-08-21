# didjqwfoqejfhiohqeo

2023.8.11

initializations. 
- read_database.ipynb: basic data washing
- funcs.py: some functions 

Future Plans
1. 上课时间判定
    - 春秋学期稳定性
    - 星期几稳定性
    - 时段稳定性
2. 撞课判定
    - 选定一门课，统计撞课概况
    - 撞课排行榜, (eg.A课与B课每次都完全对撞)
3. 教师判定
    - 选定一门课，查看历史开课教师
    - 选定一位教师，查看历史开课记录
4. TBC...

2023.8.21
完善了上课时间提取，修改了撞课判定的bug

底层函数基本完工，现在可以写应用类的函数了，也就是上次更新提到的Future Plans。例如，给用户“判定”撞课情况，要给用户具体什么信息？

关于类型提示，pd.DataFrame 说明是多条课程。pd.Series 是单条课程。

单条课程指一个df里的index，例如：

> kch:00432150, kcmc:量子力学 (A), kctxm:专业必修, kkxsmc:物理学院, jxbh:1, xf:4, ......

这样单行多列的Series
