::���ó���Ŀ¼·��
set TARGET_PATH=D:\h5\program\client\trunk\2dgame\resource

xcopy %~dp0��ͼ\*.* %TARGET_PATH%\ui\image /E /y /i
xcopy %~dp0ͼ��ImageSet\*.* %TARGET_PATH%\ui\icon /E /y /i
xcopy %~dp0��ͼImageSet\*.* %TARGET_PATH%\ui\imageset /E /y /i


pause