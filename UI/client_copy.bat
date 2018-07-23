::设置程序目录路径
set TARGET_PATH=D:\h5\program\client\trunk\2dgame\resource

xcopy %~dp0整图\*.* %TARGET_PATH%\ui\image /E /y /i
xcopy %~dp0图标ImageSet\*.* %TARGET_PATH%\ui\icon /E /y /i
xcopy %~dp0切图ImageSet\*.* %TARGET_PATH%\ui\imageset /E /y /i


pause